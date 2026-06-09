import { useMemo, useState } from 'react';
import { safeJsonParse } from './appData';
import { SectionHeading } from './uiPieces';
import lifeScenarioArt from './assets/life-scenario-game.png';

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
  const [lastMove, setLastMove] = useState(null);

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
    setLastMove(null);
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
    placeScenario(scenarioId, targetVerdict);
  }

  function placeScenario(scenarioId, targetVerdict) {
    if (!scenarioId || !scenarioMap.has(scenarioId) || checked) {
      return;
    }

    setPlacements((prev) => ({ ...prev, [scenarioId]: targetVerdict }));
    setLastMove({ id: scenarioId, target: targetVerdict, tick: Date.now() });
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
    setLastMove(null);
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
        <span className="soft-chip">Орналастырылды: {placedCount} / {runItems.length}</span>
        {checked ? <span className="soft-chip">Ұпай: {score}</span> : <span className="soft-chip">10 жағдай</span>}
      </div>

      <article className="feature-panel trust-brief">
        <SectionTitle
          title="Жағдайларды екі аймаққа бөл"
          description="Әр картаны оқы да, қауіпсіз әрекет болса “Қауіпсіз”, ал жеке дерек сұраса немесе асықтырса “Қауіпті” аймағына сал. Соңында тексер."
        />
        <div className="cta-row">
          <button type="button" className="secondary-btn" onClick={resetRun} disabled={busy}>
            Жаңа айналым
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
          <SectionHeading eyebrow="Топтама" title="Жағдай карталары" description="Сүйреп апар немесе картадағы батырманы бас." />
          <div className="trust-card-grid">
            {pool.map((item, cardIndex) => (
              <div
                key={item.id}
                className={`trust-card trust-card--${cardIndex % 4}`}
                draggable={!busy && !checked}
                onDragStart={(event) => onDragStart(event, item.id)}
              >
                <span className="trust-card-mark" aria-hidden="true">{cardIndex + 1}</span>
                <div className="trust-card-copy">
                  <strong>{item.text}</strong>
                  <small>Қай аймаққа сай екенін таңда</small>
                </div>
                {!checked ? (
                  <div className="trust-card-actions">
                    <button
                      type="button"
                      className="trust-action trust-action--good"
                      onClick={() => placeScenario(item.id, 'trust')}
                      disabled={busy}
                    >
                      Қауіпсіз
                    </button>
                    <button
                      type="button"
                      className="trust-action trust-action--bad"
                      onClick={() => placeScenario(item.id, 'no_trust')}
                      disabled={busy}
                    >
                      Қауіпті
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <div className="trust-board">
          <TrustBin
            title="Қауіпсіз"
            text="Тексеру, ересекке айту, ресми арна қолдану сияқты дұрыс әрекеттер."
            tone="good"
            items={trustBin}
            expectedVerdict="trust"
            checked={checked}
            busy={busy}
            lastMove={lastMove}
            onDragStart={onDragStart}
            onDrop={(event) => placeFromDrop(event, 'trust')}
            onDragOver={allowDrop}
            onReturn={(itemId) => {
              setPlacements((prev) => {
                const next = { ...prev };
                delete next[itemId];
                return next;
              });
            }}
          />

          <TrustBin
            title="Қауіпті"
            text="Құпиясөз, код, жеке дерек сұрау немесе асықтыру бар жағдайлар."
            tone="bad"
            items={noTrustBin}
            expectedVerdict="no_trust"
            checked={checked}
            busy={busy}
            lastMove={lastMove}
            onDragStart={onDragStart}
            onDrop={(event) => placeFromDrop(event, 'no_trust')}
            onDragOver={allowDrop}
            onReturn={(itemId) => {
              setPlacements((prev) => {
                const next = { ...prev };
                delete next[itemId];
                return next;
              });
            }}
          />
        </div>
      </div>

      {checked ? (
        <article className={`result-box ${passed ? 'result-success' : 'result-warning'}`}>
          <h3>{passed ? 'Жақсы нәтиже' : 'Қайта жаттығып көр'}</h3>
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

function TrustBin({
  title,
  text,
  tone,
  items,
  expectedVerdict,
  checked,
  busy,
  lastMove,
  onDragStart,
  onDrop,
  onDragOver,
  onReturn,
}) {
  return (
    <article className={`feature-panel trust-bin trust-bin--${tone}`} onDragOver={onDragOver} onDrop={onDrop}>
      <div className="trust-bin-head">
        <div>
          <h3>{title}</h3>
          <p className="page-copy">{text}</p>
        </div>
        <span className="trust-bin-count">{items.length}</span>
      </div>
      <div className="trust-bin-grid">
        {items.map((item) => {
          const correct = checked ? item.verdict === expectedVerdict : null;
          const isFresh = lastMove?.id === item.id && lastMove?.target === expectedVerdict;

          return (
            <div
              key={item.id}
              className={`trust-chip ${isFresh ? 'is-fresh' : ''} ${checked ? (correct ? 'is-correct' : 'is-wrong') : ''}`}
              draggable={!busy && !checked}
              onDragStart={(event) => onDragStart(event, item.id)}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!checked) {
                  onReturn(item.id);
                }
              }}
              onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && !checked) {
                  event.preventDefault();
                  onReturn(item.id);
                }
              }}
            >
              {item.text}
            </div>
          );
        })}
      </div>
      {!checked ? <small className="hint-text">Қайтару үшін картаны бас немесе топтамаға сүйреп апар.</small> : null}
    </article>
  );
}

export function LifeScenarioGame({ game, busy, onComplete }) {
  const fallbackContent = {
    version: 'life-scenarios-v1',
    scenarioCount: 5,
    scenarios: [
      {
        id: 'chat-secret',
        place: 'Ойын чаты',
        title: 'Жаңа ойыншы жеке чатқа шақырды',
        question: 'Бейтаныс ойыншы: "Ата-анаңа айтпа, маған суретіңді және қай мектепте оқитыныңды жібер. Сонда саған сирек скин беремін" дейді. Не істейсің?',
        characterMood: 'alert',
        choices: [
          {
            id: 'block',
            text: 'Чатты жабамын, бұғаттаймын және ересекке айтамын',
            points: 20,
            outcome: 'Сен жеке деректеріңді сақтап қалдың және қауіпті әңгімені тоқтаттың.',
            lesson: 'Құпия сақтауды сұрайтын бейтаныс адамға жеке ақпарат жіберуге болмайды.',
          },
          {
            id: 'ask-more',
            text: 'Алдымен қандай скин екенін сұраймын',
            points: 8,
            outcome: 'Әңгіме ұзарып, ол тағы да жеке дерек сұрауы мүмкін.',
            lesson: 'Күмәнді ұсынысты созбай тоқтатқан дұрыс.',
          },
          {
            id: 'send',
            text: 'Скин алу үшін сурет пен мектепті жіберемін',
            points: 0,
            outcome: 'Бейтаныс адам сен туралы артық ақпарат алды.',
            lesson: 'Фото, мектеп, мекенжай және телефон жеке дерек болып саналады.',
          },
        ],
      },
      {
        id: 'class-meme',
        place: 'Сынып чаты',
        title: 'Досың күлкілі сурет жіберді',
        question: 'Сынып чатында бір оқушының суретін мазақ қылып жіберді. Барлығы күліп, "сен де тарат" дейді. Қалай әрекет етесің?',
        characterMood: 'kind',
        choices: [
          {
            id: 'support',
            text: 'Таратпаймын, чатта тоқтатуды сұраймын және мұғалімге айтамын',
            points: 20,
            outcome: 'Сен кибербуллингті күшейтпедің және көмек шақырдың.',
            lesson: 'Мазақ суретті тарату да ренжітуге қатысу болып саналады.',
          },
          {
            id: 'ignore',
            text: 'Ештеңе жазбай, жай ғана өшіріп тастаймын',
            points: 12,
            outcome: 'Сен суретті таратпадың, бірақ жағдай тоқтамауы мүмкін.',
            lesson: 'Қауіпсіз қадам: таратпау және сенімді ересекке айту.',
          },
          {
            id: 'forward',
            text: 'Достарыма да жіберемін',
            points: 0,
            outcome: 'Сурет көбірек таралып, балаға ауыр тиеді.',
            lesson: 'Басқа адамды ұялтатын контентті бөлісуге болмайды.',
          },
        ],
      },
      {
        id: 'free-prize',
        place: 'Браузер',
        title: 'Тегін сыйлық беті ашылды',
        question: 'Сайт "сен ұттың!" деп, ойын аккаунтыңның логині мен құпиясөзін енгізуді сұрайды. Не таңдайсың?',
        characterMood: 'thinking',
        choices: [
          {
            id: 'close',
            text: 'Бетті жабамын және ресми қолданбадан тексеремін',
            points: 20,
            outcome: 'Сен фишинг бетіне дерек енгізбедің.',
            lesson: 'Сыйлық уәдесімен құпиясөз сұраса, бұл қауіпті белгі.',
          },
          {
            id: 'fake',
            text: 'Қате құпиясөз жазып көремін',
            points: 6,
            outcome: 'Сайт бәрібір сенің логиніңді немесе басқа деректі жинауы мүмкін.',
            lesson: 'Күмәнді сайтпен тәжірибе жасамай, оны жабу керек.',
          },
          {
            id: 'login',
            text: 'Логин мен құпиясөзді енгіземін',
            points: 0,
            outcome: 'Аккаунтың ұрлануы мүмкін.',
            lesson: 'Құпиясөзді тек ресми сайтта немесе қолданбада енгіз.',
          },
        ],
      },
      {
        id: 'wifi',
        place: 'Кафе',
        title: 'Тегін Wi-Fi қосылды',
        question: 'Кафедегі Wi-Fi "әлеуметтік желі пароліңді енгізсең ғана интернет беремін" дейді. Не істейсің?',
        characterMood: 'careful',
        choices: [
          {
            id: 'skip',
            text: 'Қосылмаймын немесе ата-анамнан мобильді интернет сұраймын',
            points: 20,
            outcome: 'Сен пароліңді күмәнді желіге бермедің.',
            lesson: 'Wi-Fi ешқашан әлеуметтік желі паролін сұрамауы керек.',
          },
          {
            id: 'ask-staff',
            text: 'Кафе қызметкерінен ресми Wi-Fi атауын сұраймын',
            points: 16,
            outcome: 'Сен желінің рас екенін тексердің.',
            lesson: 'Қоғамдық жерде желі атауын тексеру пайдалы.',
          },
          {
            id: 'enter',
            text: 'Парольді енгіземін, интернет керек',
            points: 0,
            outcome: 'Паролің бөтен адамға кетуі мүмкін.',
            lesson: 'Қоғамдық Wi-Fi-да аккаунт деректерін енгізбе.',
          },
        ],
      },
      {
        id: 'friend-money',
        place: 'Мессенджер',
        title: 'Досың ақша сұрады',
        question: 'Досыңның аккаунтынан "тез ақша жібер, кейін түсіндіремін" деген хабар келді. Жазу стилі біртүрлі. Не істейсің?',
        characterMood: 'suspicious',
        choices: [
          {
            id: 'call',
            text: 'Басқа жолмен хабарласып, рас екенін тексеремін',
            points: 20,
            outcome: 'Сен бұзылған аккаунт болуы мүмкін екенін байқадың.',
            lesson: 'Ақша немесе код сұраса, басқа арнамен тексер.',
          },
          {
            id: 'question',
            text: 'Чатта "сен шынымен кімсің?" деп сұраймын',
            points: 10,
            outcome: 'Алаяқ жауап ойлап табуы мүмкін.',
            lesson: 'Сол чаттың өзінде тексеру жеткіліксіз.',
          },
          {
            id: 'send-money',
            text: 'Көмектесу үшін бірден жіберемін',
            points: 0,
            outcome: 'Ақша алаяққа кетуі мүмкін.',
            lesson: 'Қысым мен асықтыру қауіп белгісі.',
          },
        ],
      },
      {
        id: 'camera-permission',
        place: 'Жаңа қосымша',
        title: 'Қосымша көп рұқсат сұрады',
        question: 'Қарапайым викторина қолданбасы камера, микрофон, геолокация және контакт сұрайды. Сенің таңдауың?',
        characterMood: 'focused',
        choices: [
          {
            id: 'deny',
            text: 'Артық рұқсаттарды бермеймін, қажет болса қолданбаны өшіремін',
            points: 20,
            outcome: 'Сен деректеріңді артық жинаудан қорғадың.',
            lesson: 'Қолданбаға тек жұмысына қажет рұқсаттарды бер.',
          },
          {
            id: 'location-only',
            text: 'Тек геолокацияны қосамын',
            points: 7,
            outcome: 'Викторинаға орналасқан жерің қажет болмауы мүмкін.',
            lesson: 'Әр рұқсаттың не үшін керек екенін ойлан.',
          },
          {
            id: 'allow-all',
            text: 'Барлығына рұқсат беремін',
            points: 0,
            outcome: 'Қолданба сен туралы көп ақпарат жинай алады.',
            lesson: 'Артық рұқсаттар жеке қауіпсіздікке әсер етеді.',
          },
        ],
      },
      {
        id: 'online-challenge',
        place: 'Әлеуметтік желі',
        title: 'Қауіпті челлендж шықты',
        question: 'Танымал челлендж үйдегі құжаттарды және бөлмеңді видеоға түсіріп салуды сұрайды. Не істейсің?',
        characterMood: 'decisive',
        choices: [
          {
            id: 'skip-report',
            text: 'Қатыспаймын, жеке ақпарат көрінсе видеоны салмаймын',
            points: 20,
            outcome: 'Сен үйің мен отбасың туралы деректерді сақтадың.',
            lesson: 'Видеода құжат, мекенжай, мектеп формасы сияқты дерек көрінуі мүмкін.',
          },
          {
            id: 'crop',
            text: 'Тек фонды қатты тексеріп, қауіпсіз болса ғана түсіремін',
            points: 14,
            outcome: 'Сен жарияламас бұрын тексердің, бірақ бәрібір абай болу керек.',
            lesson: 'Пост салмас бұрын кадрдағы барлық нәрсені тексер.',
          },
          {
            id: 'post',
            text: 'Тез түсіріп, бірден жариялаймын',
            points: 0,
            outcome: 'Видеода жеке дерек қалып қоюы мүмкін.',
            lesson: 'Жылдам жариялау қателікке әкеледі.',
          },
        ],
      },
      {
        id: 'teacher-link',
        place: 'Мектеп порталы',
        title: 'Мұғалім тапсырма жіберді',
        question: 'Мұғалім мектептің ресми чатында LMS сілтемесін жіберді. Бірақ сен бәрібір сенімді болғың келеді. Не істейсің?',
        characterMood: 'confident',
        choices: [
          {
            id: 'check-domain',
            text: 'Сілтеменің доменін тексеріп, ресми порталмен салыстырамын',
            points: 20,
            outcome: 'Сен пайдалы әдет қолдандың: алдымен тексердің.',
            lesson: 'Ресми арнадан келсе де, доменді қарап алған дұрыс.',
          },
          {
            id: 'click-fast',
            text: 'Бірден басамын, мұғалім жіберді ғой',
            points: 12,
            outcome: 'Бұл жолы қауіп аз, бірақ әдет ретінде тексерген жақсы.',
            lesson: 'Жақсы қауіпсіздік әдеттері күн сайын көмектеседі.',
          },
          {
            id: 'share-password',
            text: 'Кіре алмасам, досыма паролімді айтып көмек сұраймын',
            points: 0,
            outcome: 'Паролің басқа адамның қолына өтеді.',
            lesson: 'Көмек керек болса, парольді айтпай ересектен сұра.',
          },
        ],
      },
    ],
  };

  const parsed = safeJsonParse(game.contentJson, {});
  const content = Array.isArray(parsed?.scenarios) ? parsed : fallbackContent;
  const allScenarios = Array.isArray(content?.scenarios) ? content.scenarios : fallbackContent.scenarios;
  const scenarioCount = clamp(Number(content?.scenarioCount) || 5, 1, allScenarios.length);

  const [runSeed, setRunSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);

  const runScenarios = useMemo(() => {
    return sampleUnique(allScenarios, scenarioCount).map((scenario, scenarioIndex) => ({
      ...scenario,
      id: String(scenario.id ?? `life-${runSeed}-${scenarioIndex}`),
      choices: Array.isArray(scenario.choices) ? scenario.choices : [],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runSeed, scenarioCount]);

  const currentScenario = runScenarios[index] ?? null;
  const selectedChoice = currentScenario?.choices?.find((choice) => choice.id === selectedChoiceId) ?? null;
  const maxScore = runScenarios.length * 20;
  const earnedScore = answers.reduce((sum, answer) => sum + Number(answer.choice?.points ?? 0), 0);
  const finalScore = maxScore ? Math.round((earnedScore / maxScore) * 100) : 0;

  const ending =
    finalScore >= 85
      ? {
          title: 'Кибер-навигатор',
          text: 'Сен қиын жағдайларда тоқтап, тексеріп, өзіңді де, достарыңды да қорғадың.',
          tone: 'result-success',
        }
      : finalScore >= 60
        ? {
            title: 'Осторожный исследователь',
            text: 'Көп шешімің дұрыс. Кейбір жерде асықпай, ересектен көмек сұрасаң нәтиже одан да мықты болады.',
            tone: 'result-success',
          }
        : {
            title: 'Нужна помощь команды',
            text: 'Кей жағдайларда қауіп белгісі байқалмай қалды. Жақсы жаңалық: енді сен нені тексеру керегін білесің.',
            tone: 'result-warning',
          };

  function chooseOption(choiceId) {
    if (finished) {
      return;
    }
    setSelectedChoiceId(choiceId);
  }

  function moveNext() {
    if (!currentScenario || !selectedChoice) {
      return;
    }

    const nextAnswers = [
      ...answers,
      {
        scenario: currentScenario,
        choice: selectedChoice,
      },
    ];

    setAnswers(nextAnswers);
    setSelectedChoiceId(null);

    if (index + 1 >= runScenarios.length) {
      const score = Math.round(
        (nextAnswers.reduce((sum, answer) => sum + Number(answer.choice?.points ?? 0), 0) / maxScore) * 100
      );
      setFinished(true);
      if (!saved) {
        setSaved(true);
        onComplete(game.id, score, `Жизненные сценарии: ${score}`);
      }
      return;
    }

    setIndex((value) => value + 1);
  }

  function restart() {
    setRunSeed((value) => value + 1);
    setIndex(0);
    setSelectedChoiceId(null);
    setAnswers([]);
    setFinished(false);
    setSaved(false);
  }

  if (!currentScenario && !finished) {
    return (
      <article className="result-box result-warning">
        <h3>Сценарийлер табылмады</h3>
        <p>Ойын мазмұнын тексеріңіз.</p>
      </article>
    );
  }

  return (
    <div className="game-card-shell life-game">
      <div className="game-meta">
        <span className="soft-chip">Өмірлік сценарийлер</span>
        <span className="soft-chip">{finished ? 'Финал' : `${index + 1} / ${runScenarios.length}`}</span>
        <span className="soft-chip">Жауап соңында ашылады</span>
      </div>

      {!finished ? (
        <article className={`life-stage life-stage--${currentScenario.characterMood ?? 'focused'}`}>
          <img className="life-stage-art" src={lifeScenarioArt} alt="Бала цифрлық қауіпсіздік жағдайларын таңдап тұр" />
          <div className="life-stage-overlay">
            <span className="soft-chip">{currentScenario.place}</span>
            <h3>{currentScenario.title}</h3>
            <p>{currentScenario.question}</p>
          </div>
          <div className="life-character-card">
            <span className="life-avatar" aria-hidden="true">?</span>
            <div>
              <strong>Сенің таңдауың</strong>
              <small>Қазір жауап көрсетілмейді. 5 жағдайдан кейін толық нәтиже шығады.</small>
            </div>
          </div>
        </article>
      ) : (
        <article className={`life-finale ${ending.tone}`}>
          <div>
            <span className="eyebrow">Финал</span>
            <h3>{ending.title}</h3>
            <p>{ending.text}</p>
          </div>
          <div className="life-score-badge">
            <strong>{finalScore}</strong>
            <span>ұпай</span>
          </div>
        </article>
      )}

      {!finished ? (
        <article className="feature-panel life-choice-panel">
          <SectionTitle
            title="Қалай әрекет етесің?"
            description="Бір нұсқаны таңда. Дұрыс-бұрысын ойын соңында бірге қараймыз."
          />
          <div className="life-choice-grid">
            {currentScenario.choices.map((choice, choiceIndex) => (
              <button
                key={choice.id}
                type="button"
                className={`life-choice-card ${selectedChoiceId === choice.id ? 'is-selected' : ''}`}
                onClick={() => chooseOption(choice.id)}
                disabled={busy}
              >
                <span>{choiceIndex + 1}</span>
                <strong>{choice.text}</strong>
              </button>
            ))}
          </div>
          <div className="cta-row">
            <button type="button" className="secondary-btn" onClick={restart} disabled={busy}>
              Қайта бастау
            </button>
            <button type="button" className="primary-btn" onClick={moveNext} disabled={busy || !selectedChoiceId}>
              {index + 1 >= runScenarios.length ? 'Финалды көру' : 'Келесі жағдай'}
            </button>
          </div>
        </article>
      ) : (
        <>
          <article className="feature-panel life-review-panel">
            <SectionTitle
              title="Сенің әрекеттерің"
              description="Міне, 5 жағдайдағы таңдауларың және қауіпсіз шешімнің себебі."
            />
            <div className="life-review-grid">
              {answers.map((answer, answerIndex) => (
                <article key={answer.scenario.id} className="life-review-card">
                  <span className="soft-chip">#{answerIndex + 1} {answer.scenario.place}</span>
                  <h3>{answer.scenario.title}</h3>
                  <p><strong>Таңдауың:</strong> {answer.choice.text}</p>
                  <p>{answer.choice.outcome}</p>
                  <small>{answer.choice.lesson}</small>
                </article>
              ))}
            </div>
          </article>
          <div className="cta-row">
            <button type="button" className="primary-btn" onClick={restart} disabled={busy}>
              Тағы ойнау
            </button>
          </div>
        </>
      )}
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
