import { useMemo, useState } from 'react';
import { safeJsonParse } from './appData';
import { SectionHeading } from './uiPieces';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function scoreRound({ verdictCorrect, clueAccuracy }) {
  const verdictPart = verdictCorrect ? 1 : 0;
  const cluePart = clamp(clueAccuracy, 0, 1);
  return Math.round(100 * (0.7 * verdictPart + 0.3 * cluePart));
}

export function InboxDefenderGame({ game, busy, onComplete }) {
  const fallbackContent = {
    version: 'inbox-defender-v1',
    rounds: [
      {
        id: 'r1',
        fromName: 'Мектеп әкімшілігі',
        fromEmail: 'admin@school.kz',
        timeLabel: '09:10',
        subject: 'Ертеңгі экскурсия туралы',
        body: 'Сәлем! Ертең 10:00-де жиналамыз. Ақпаратты тек мектеп арнасы арқылы жібереміз.',
        linkText: 'Кесте',
        linkUrl: 'https://school.kz/trip/schedule',
        isPhish: false,
        clues: [
          { id: 'domain-ok', text: 'Домен мектептікі (school.kz)', isSuspicious: false },
          { id: 'no-secret', text: 'Құпиясөз немесе SMS код сұрамайды', isSuspicious: false },
          { id: 'calm', text: 'Асықтырмайды, қорқытпайды', isSuspicious: false },
          { id: 'official', text: 'Ақпарат мектеп арнасымен сәйкес', isSuspicious: false },
        ],
        explain: 'Хат сабырлы, жеке дерек сұрамайды және мектеп доменінен келген.',
      },
      {
        id: 'r2',
        fromName: 'Ойын қолдауы',
        fromEmail: 'support@game-prizes.ru',
        timeLabel: '10:02',
        subject: 'Сен жеңдің! Сыйлығыңды алу үшін кір',
        body: 'Құттықтаймыз! Сыйлығың дайын. Тезірек кіріп, аккаунтыңды раста.',
        linkText: 'Сыйлықты алу',
        linkUrl: 'http://game-prizes.ru/login?bonus=1',
        isPhish: true,
        clues: [
          { id: 'weird-domain', text: 'Бейтаныс домен', isSuspicious: true },
          { id: 'rush', text: 'Асықтырады: "тезірек"', isSuspicious: true },
          { id: 'verify', text: 'Аккаунтты "раста" дейді', isSuspicious: true },
          { id: 'gift', text: 'Тегін сыйлық уәде етеді', isSuspicious: true },
        ],
        explain: 'Тегін сыйлық, асықтыру және бейтаныс домен фишингке ұқсайды.',
      },
      {
        id: 'r3',
        fromName: 'Google Security',
        fromEmail: 'no-reply@goog1e.com',
        timeLabel: '12:25',
        subject: 'Қауіп: аккаунтың бұғатталады',
        body: 'Біз күмәнді кіруді байқадық. 15 минут ішінде құпиясөзіңді жаңарт, әйтпесе аккаунт жабылады.',
        linkText: 'Құпиясөзді жаңарту',
        linkUrl: 'https://goog1e.com/reset',
        isPhish: true,
        clues: [
          { id: 'lookalike', text: 'Домен ұқсас, бірақ дұрыс емес (goog1e.com)', isSuspicious: true },
          { id: 'threat', text: 'Қорқытады: "жабылады"', isSuspicious: true },
          { id: 'timer', text: 'Қысқа уақыт береді', isSuspicious: true },
          { id: 'generic', text: 'Сені атымен атамайды', isSuspicious: false },
        ],
        explain: 'Ұқсас домен, қорқыту және таймер фишинг белгілері.',
      },
    ],
  };

  const content = safeJsonParse(game.contentJson, fallbackContent);
  const rounds = Array.isArray(content?.rounds) ? content.rounds : fallbackContent.rounds;

  const [index, setIndex] = useState(0);
  const [pickedClueIds, setPickedClueIds] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [pickedVerdict, setPickedVerdict] = useState(null); // true=phish, false=safe
  const [history, setHistory] = useState([]);
  const [showLink, setShowLink] = useState(false);

  const round = rounds[index] ?? null;

  const pickedSet = useMemo(() => new Set(pickedClueIds), [pickedClueIds]);
  const clueMeta = useMemo(() => {
    const clues = Array.isArray(round?.clues) ? round.clues : [];
    const suspiciousIds = new Set(clues.filter((c) => c?.isSuspicious).map((c) => c.id));
    return { clues, suspiciousIds };
  }, [round]);

  const totalScore = useMemo(() => {
    if (!history.length) {
      return 0;
    }
    const sum = history.reduce((acc, item) => acc + (item.points ?? 0), 0);
    return Math.round(sum / history.length);
  }, [history]);

  function toggleClue(id) {
    if (submitted) {
      return;
    }
    setPickedClueIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function submitVerdict(isPhish) {
    if (!round || submitted) {
      return;
    }

    const truthIsPhish = Boolean(round.isPhish);
    const verdictCorrect = isPhish === truthIsPhish;

    const { clues, suspiciousIds } = clueMeta;
    const clueCount = Math.max(clues.length, 1);
    const falsePositives = pickedClueIds.filter((id) => !suspiciousIds.has(id)).length;
    const falseNegatives = [...suspiciousIds].filter((id) => !pickedSet.has(id)).length;
    const clueAccuracy = clamp((clueCount - falsePositives - falseNegatives) / clueCount, 0, 1);
    const points = scoreRound({ verdictCorrect, clueAccuracy });

    setPickedVerdict(isPhish);
    setSubmitted(true);
    setHistory((prev) => [
      ...prev,
      {
        roundId: round.id ?? `${index + 1}`,
        verdictCorrect,
        clueAccuracy,
        points,
      },
    ]);
  }

  function nextRound() {
    if (!submitted) {
      return;
    }

    const isLast = index + 1 >= rounds.length;
    if (isLast) {
      const finalScore = history.length ? totalScore : 0;
      onComplete(game.id, finalScore, `Жергілікті нәтиже: ${finalScore}`);
      return;
    }

    setIndex((value) => value + 1);
    setPickedClueIds([]);
    setSubmitted(false);
    setPickedVerdict(null);
    setShowLink(false);
  }

  function restart() {
    setIndex(0);
    setPickedClueIds([]);
    setSubmitted(false);
    setPickedVerdict(null);
    setHistory([]);
    setShowLink(false);
  }

  if (!rounds.length) {
    // This should not happen due to fallbackContent, but keep a guard just in case.
    return (
      <article className="result-box result-warning">
        <h3>Ойын деректері табылмады</h3>
        <p>Content JSON бос сияқты. Админ панелінде contentJson өрісін тексер.</p>
        <pre className="json-preview">{game.contentJson}</pre>
      </article>
    );
  }

  const truthIsPhish = Boolean(round?.isPhish);
  const verdictCorrect = submitted && pickedVerdict === truthIsPhish;

  return (
    <div className="game-card-shell inbox-game">
      <div className="game-meta">
        <span className="soft-chip">Пошта қалқаны</span>
        <span className="soft-chip">
          {Math.min(index + 1, rounds.length)} / {rounds.length}
        </span>
        <span className="soft-chip">Орташа ұпай: {totalScore}</span>
      </div>

      <article className="inbox-email-card">
        <div className="inbox-email-head">
          <div>
            <strong>{round.fromName}</strong>
            <span className="inbox-email-from">&lt;{round.fromEmail}&gt;</span>
          </div>
          <span className="soft-chip">{round.timeLabel ?? 'қазір'}</span>
        </div>
        <h3 className="inbox-email-subject">{round.subject}</h3>
        <p className="inbox-email-body">{round.body}</p>

        {round.linkText ? (
          <div className="inbox-link-row">
            <span className="soft-chip">Сілтеме</span>
            <strong>{round.linkText}</strong>
            <button type="button" className="secondary-btn" onClick={() => setShowLink((v) => !v)}>
              {showLink ? 'Жасыру' : 'Көру'}
            </button>
          </div>
        ) : null}
        {showLink && round.linkUrl ? (
          <pre className="code-block">{round.linkUrl}</pre>
        ) : null}
      </article>

      <article className="feature-panel game-stage-panel">
        <SectionTitle
          title={submitted ? 'Нәтиже' : 'Тапсырма'}
          description={
            submitted
              ? verdictCorrect
                ? 'Дұрыс. Енді түсіндірмесін оқы.'
                : 'Қате. Неге олай екенін қарап шық.'
              : 'Күдікті белгілерді белгіле де, соңында "Қауіпсіз" немесе "Фишинг" деп таңда.'
          }
        />

        <div className="clue-grid">
          {clueMeta.clues.map((clue) => {
            const picked = pickedSet.has(clue.id);
            const suspicious = Boolean(clue.isSuspicious);
            const stateClass = submitted
              ? suspicious
                ? picked
                  ? 'is-correct'
                  : 'is-missed'
                : picked
                  ? 'is-wrong'
                  : ''
              : '';

            return (
              <button
                key={clue.id}
                type="button"
                className={`clue-tile ${picked ? 'is-picked' : ''} ${stateClass}`}
                disabled={busy || submitted}
                onClick={() => toggleClue(clue.id)}
              >
                {clue.text}
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <div className="cta-row">
            <button type="button" className="primary-btn" disabled={busy} onClick={() => submitVerdict(false)}>
              Қауіпсіз
            </button>
            <button type="button" className="secondary-btn" disabled={busy} onClick={() => submitVerdict(true)}>
              Фишинг
            </button>
          </div>
        ) : (
          <>
            <div className={`result-box ${verdictCorrect ? 'result-success' : 'result-warning'}`}>
              <h3>{verdictCorrect ? 'Дұрыс шешім' : 'Қате шешім'}</h3>
              <p>
                Дұрыс жауап: <strong>{truthIsPhish ? 'Фишинг' : 'Қауіпсіз'}</strong>. Сен таңдадың:{' '}
                <strong>{pickedVerdict ? 'Фишинг' : 'Қауіпсіз'}</strong>.
              </p>
              <p>{round.explain}</p>
              <small>Осы раундтың ұпайы: {history.at(-1)?.points ?? 0}</small>
            </div>

            <div className="cta-row">
              <button type="button" className="secondary-btn" onClick={restart} disabled={busy}>
                Қайта бастау
              </button>
              <button type="button" className="primary-btn" onClick={nextRound} disabled={busy}>
                {index + 1 >= rounds.length ? 'Нәтижені сақтау' : 'Келесі хат'}
              </button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}

function shuffleArray(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function sampleUnique(items, count) {
  if (!Array.isArray(items)) {
    return [];
  }
  return shuffleArray(items).slice(0, Math.max(0, count));
}

export function TrustSorterGame({ game, busy, onComplete }) {
  const fallbackScenarios = [
    { id: 's1', text: 'SMS-кодты жібер', verdict: 'no_trust', why: 'SMS-код пен растау коды жеке дерек. Оны ешкімге жіберме.' },
    { id: 's2', text: 'Құпиясөзді сұрайды', verdict: 'no_trust', why: 'Ешбір қолдау қызметі құпиясөзіңді сұрамайды.' },
    { id: 's3', text: '“ТЕЗ! 5 минутта бұғатталады”', verdict: 'no_trust', why: 'Асықтыру мен қорқыту фишинг белгісі.' },
    { id: 's4', text: 'Мектеп домені: school.kz', verdict: 'trust', why: 'Таныс ресми домен көбіне қауіпсіз, бірақ бәрібір тексер.' },
    { id: 's5', text: 'Тегін сыйлық уәде етеді', verdict: 'no_trust', why: 'Тегін сыйлықпен алдау жиі болады.' },
    { id: 's6', text: 'Бейтаныс домен: game-prizes.ru', verdict: 'no_trust', why: 'Күмәнді домендерден келген хатқа сенбе.' },
    { id: 's7', text: 'Ересекке көрсет', verdict: 'trust', why: 'Күмән болса, сенімді ересекке айту қауіпсіз.' },
    { id: 's8', text: 'Сілтемені баспай тұрып тексер', verdict: 'trust', why: 'Алдымен тексеру қауіпсіз әдет.' },
    { id: 's9', text: '“Жеке чатта құпия сөйлесейік”', verdict: 'no_trust', why: 'Жасырын әңгіме сұрау қауіпті белгі.' },
    { id: 's10', text: 'Таныс досыңнан қысқа хабар', verdict: 'trust', why: 'Таныс адам болса да, күмәнді сұрақ болса тексер.' },
    { id: 's11', text: '“Телефон нөміріңді бер”', verdict: 'no_trust', why: 'Телефон нөмірі жеке дерек.' },
    { id: 's12', text: '“Суретіңді жібер”', verdict: 'no_trust', why: 'Фотосурет те жеке дерек болуы мүмкін.' },
    { id: 's13', text: '“Ата-анаңа айтпа”', verdict: 'no_trust', why: 'Ересектерден жасырынуды сұрау қауіпті.' },
    { id: 's14', text: 'Қосымшаның рұқсатын тексер', verdict: 'trust', why: 'Артық рұқсат сұраса, қауіп болуы мүмкін.' },
    { id: 's15', text: '“Жеке карта нөміріңді енгіз”', verdict: 'no_trust', why: 'Қаржы деректерін ешқашан берме.' },
    { id: 's16', text: '“Сен жеңдің, логин енгіз”', verdict: 'no_trust', why: 'Логин беті арқылы аккаунтты ұрлауы мүмкін.' },
    { id: 's17', text: 'https://lms.school.kz', verdict: 'trust', why: 'Ресми оқу платформасы болса, қауіпсіз болуы ықтимал.' },
    { id: 's18', text: '“Скриншот жібер”', verdict: 'no_trust', why: 'Скриншотта жеке дерек болуы мүмкін.' },
    { id: 's19', text: '“Сілтемені тексер: https://goog1e.com”', verdict: 'no_trust', why: 'Домен ұқсас, бірақ дұрыс емес (әріп орнына сан).' },
    { id: 's20', text: '“Ережені оқы, келіссең ғана жалғастыр”', verdict: 'trust', why: 'Ережені оқу дұрыс, бірақ бәрібір жеке дерек берме.' },
    { id: 's21', text: '“Тек мына файлды орнат”', verdict: 'no_trust', why: 'Бейтаныс файл қауіпті болуы мүмкін.' },
    { id: 's22', text: '“Досымның аккаунты, бірақ мәтіні күмәнді”', verdict: 'no_trust', why: 'Аккаунт бұзылған болуы мүмкін, тексер.' },
    { id: 's23', text: '“Сәлем, қай мектептесің?”', verdict: 'no_trust', why: 'Бейтанысқа жеке ақпарат берме.' },
    { id: 's24', text: '“Верификация үшін код”', verdict: 'no_trust', why: 'Кодтарды ешкімге жіберме.' },
    { id: 's25', text: '“Жабық топқа қосыл”', verdict: 'no_trust', why: 'Топта қауіп болуы мүмкін, ата-анаңмен ақылдас.' },
    { id: 's26', text: '“Сілтеме: http://...”', verdict: 'no_trust', why: 'HTTP және күмәнді сілтеме қауіпті.' },
    { id: 's27', text: '“Досыңмен офлайн сөйлесіп тексер”', verdict: 'trust', why: 'Күмәнді нәрсені басқа арнамен тексеру дұрыс.' },
    { id: 's28', text: '“Профильді жеке қыл”', verdict: 'trust', why: 'Жекелік баптауы қорғаныс береді.' },
    { id: 's29', text: '“Үлкен ақша ұтамыз”', verdict: 'no_trust', why: 'Жеңіл ақша уәдесі жиі алдау.' },
    { id: 's30', text: '“Мұғалім айтқандай, мектеп чатында”', verdict: 'trust', why: 'Ресми арна арқылы тексеру дұрыс.' },
    { id: 's31', text: '“Қазір бас, әйтпесе кеш”', verdict: 'no_trust', why: 'Қысым жасау қауіпті белгі.' },
    { id: 's32', text: '“Қауіпсіздік баптауын аш”', verdict: 'trust', why: '2FA және баптауларды тексеру пайдалы.' },
  ];

  const parsed = safeJsonParse(game.contentJson, {});
  const allScenarios = Array.isArray(parsed?.scenarios) ? parsed.scenarios : fallbackScenarios;

  const [runSeed, setRunSeed] = useState(0);
  const runItems = useMemo(() => {
    const picked = sampleUnique(allScenarios, 10);
    return picked.map((item, index) => ({
      id: String(item.id ?? `p${runSeed}-${index}`),
      text: String(item.text ?? ''),
      verdict: item.verdict === 'trust' ? 'trust' : 'no_trust',
      why: String(item.why ?? ''),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runSeed]);

  const scenarioMap = useMemo(() => new Map(runItems.map((item) => [item.id, item])), [runItems]);
  const [placements, setPlacements] = useState({});
  const [checked, setChecked] = useState(false);
  const [saved, setSaved] = useState(false);

  const placedCount = Object.keys(placements).length;
  const readyToCheck = placedCount >= runItems.length;

  const correctCount = useMemo(() => {
    if (!checked) {
      return 0;
    }
    return runItems.filter((item) => placements[item.id] === item.verdict).length;
  }, [checked, placements, runItems]);

  const score = checked ? Math.round((correctCount * 100) / Math.max(runItems.length, 1)) : 0;
  const passed = checked ? score >= 70 : false;

  function resetRun() {
    setRunSeed((value) => value + 1);
    setPlacements({});
    setChecked(false);
    setSaved(false);
  }

  function allowDrop(event) {
    event.preventDefault();
  }

  function onDragStart(event, scenarioId) {
    event.dataTransfer.setData('text/plain', scenarioId);
    event.dataTransfer.effectAllowed = 'move';
  }

  function placeFromDrop(event, targetVerdict) {
    event.preventDefault();
    const scenarioId = event.dataTransfer.getData('text/plain');
    if (!scenarioId || !scenarioMap.has(scenarioId) || checked) {
      return;
    }
    setPlacements((prev) => ({ ...prev, [scenarioId]: targetVerdict }));
  }

  function moveToPool(event) {
    event.preventDefault();
    const scenarioId = event.dataTransfer.getData('text/plain');
    if (!scenarioId || !scenarioMap.has(scenarioId) || checked) {
      return;
    }
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[scenarioId];
      return next;
    });
  }

  function checkResult() {
    if (!readyToCheck || checked) {
      return;
    }
    setChecked(true);
  }

  function saveResult() {
    if (!checked || saved) {
      return;
    }
    setSaved(true);
    onComplete(game.id, score, `Жергілікті нәтиже: ${score}`);
  }

  const pool = runItems.filter((item) => placements[item.id] == null);
  const trustBin = runItems.filter((item) => placements[item.id] === 'trust');
  const noTrustBin = runItems.filter((item) => placements[item.id] === 'no_trust');

  return (
    <div className="game-card-shell trust-sorter">
      <div className="game-meta">
        <span className="soft-chip">Сенім сүзгісі</span>
        <span className="soft-chip">Салынды: {placedCount} / {runItems.length}</span>
        {checked ? <span className="soft-chip">Ұпай: {score}</span> : <span className="soft-chip">10 карта</span>}
      </div>

      <article className="feature-panel">
        <SectionTitle
          title="Карталарды себеттерге сал"
          description="Картаны алып, “Доверять” немесе “Не доверять” себетіне сал. Барлығын бөліп болған соң “Тексеру” бас."
        />
        <div className="cta-row">
          <button type="button" className="secondary-btn" onClick={resetRun} disabled={busy}>
            Жаңа раунд (кездейсоқ)
          </button>
          <button type="button" className="primary-btn" onClick={checkResult} disabled={busy || checked || !readyToCheck}>
            Тексеру
          </button>
          <button type="button" className="secondary-btn" onClick={saveResult} disabled={busy || !checked || saved}>
            {saved ? 'Сақталды' : 'Нәтижені сақтау'}
          </button>
        </div>
      </article>

      <div className="trust-layout">
        <article className="feature-panel trust-pool" onDragOver={allowDrop} onDrop={moveToPool}>
          <SectionHeading eyebrow="Таңдау" title="Карталар" description="Әр ойында 10 кездейсоқ жағдай шығады." />
          <div className="trust-card-grid">
            {pool.map((item) => (
              <div
                key={item.id}
                className={`trust-card ${checked ? (placements[item.id] ? '' : '') : ''}`}
                draggable={!busy && !checked}
                onDragStart={(event) => onDragStart(event, item.id)}
              >
                <strong>{item.text}</strong>
                <small>Тарту арқылы немесе батырмамен сал</small>
                {!checked ? (
                  <div className="trust-card-actions">
                    <button
                      type="button"
                      className="trust-action trust-action--good"
                      onClick={() => setPlacements((prev) => ({ ...prev, [item.id]: 'trust' }))}
                      disabled={busy}
                    >
                      Доверять
                    </button>
                    <button
                      type="button"
                      className="trust-action trust-action--bad"
                      onClick={() => setPlacements((prev) => ({ ...prev, [item.id]: 'no_trust' }))}
                      disabled={busy}
                    >
                      Не доверять
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="feature-panel trust-bin trust-bin--good" onDragOver={allowDrop} onDrop={(event) => placeFromDrop(event, 'trust')}>
          <h3>Доверять</h3>
          <p className="page-copy">Қауіпсіз, тексерілген, дұрыс әрекет.</p>
          <div className="trust-bin-grid">
            {trustBin.map((item) => {
              const correct = checked ? item.verdict === 'trust' : null;
              return (
                <div
                  key={item.id}
                  className={`trust-chip ${checked ? (correct ? 'is-correct' : 'is-wrong') : ''}`}
                  draggable={!busy && !checked}
                  onDragStart={(event) => onDragStart(event, item.id)}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (checked) {
                      return;
                    }
                    setPlacements((prev) => {
                      const next = { ...prev };
                      delete next[item.id];
                      return next;
                    });
                  }}
                >
                  {item.text}
                </div>
              );
            })}
          </div>
          {!checked ? <small className="hint-text">Қайтару үшін карточканы бас немесе сол жаққа сүйреп апар.</small> : null}
        </article>

        <article className="feature-panel trust-bin trust-bin--bad" onDragOver={allowDrop} onDrop={(event) => placeFromDrop(event, 'no_trust')}>
          <h3>Не доверять</h3>
          <p className="page-copy">Күмәнді, қауіпті, жеке дерек сұрайды.</p>
          <div className="trust-bin-grid">
            {noTrustBin.map((item) => {
              const correct = checked ? item.verdict === 'no_trust' : null;
              return (
                <div
                  key={item.id}
                  className={`trust-chip ${checked ? (correct ? 'is-correct' : 'is-wrong') : ''}`}
                  draggable={!busy && !checked}
                  onDragStart={(event) => onDragStart(event, item.id)}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (checked) {
                      return;
                    }
                    setPlacements((prev) => {
                      const next = { ...prev };
                      delete next[item.id];
                      return next;
                    });
                  }}
                >
                  {item.text}
                </div>
              );
            })}
          </div>
          {!checked ? <small className="hint-text">Қайтару үшін карточканы бас немесе сол жаққа сүйреп апар.</small> : null}
        </article>
      </div>

      {checked ? (
        <article className={`result-box ${passed ? 'result-success' : 'result-warning'}`}>
          <h3>{passed ? 'Ты успешно прошел' : 'Ты проиграл'}</h3>
          <p>
            Дұрыс жауаптар: {correctCount} / {runItems.length}. Ұпай: {score}.
          </p>
          <div className="evaluation-list">
            {runItems
              .filter((item) => placements[item.id] !== item.verdict)
              .slice(0, 8)
              .map((item) => (
                <div key={item.id} className="evaluation-card">
                  <strong>{item.text}</strong>
                  <p>{item.why || 'Күмән болса: тоқта, тексер, ересектен сұра.'}</p>
                </div>
              ))}
          </div>
        </article>
      ) : null}
    </div>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">Ойын</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export function UnknownGamePreview({ game }) {
  return (
    <article className="result-box result-warning">
      <h3>Белгісіз ойын түрі: {game.gameType}</h3>
      <p>Ойын backend-та сақталған, бірақ клиент жағында оған арналған интерфейс әлі қосылмаған.</p>
      <pre className="json-preview">{game.contentJson}</pre>
    </article>
  );
}
