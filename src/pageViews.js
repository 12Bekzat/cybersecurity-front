import { HOME_MISSIONS, SAFETY_PROMISES, SUPPORT_ACTIONS, getLessonBlocks, sortByPosition } from './appData';
import { useEffect, useState } from 'react';
import { InboxDefenderGame, TrustSorterGame, UnknownGamePreview } from './gameViews';
import { serializeCourseForm } from './appData';
import { EmptyPanel, FormField, GatePanel, LoadingPanel, SectionHeading, StatCard } from './uiPieces';
import heroSafety from './assets/hero-safety.svg';
import academyBuddy from './assets/academy-buddy.svg';
import authFriends from './assets/auth-friends.svg';
import gamesLab from './assets/games-lab.svg';

const AUTH_FEATURES = [
  {
    title: 'Курстар мен бейнесабақтар',
    text: 'Аккаунтқа кіргеннен кейін оқушы сабақтарды, бейнелерді және шағын тесттерді тоқтаған жерінен жалғастырады.',
  },
  {
    title: 'Ойындар мен ұпайлар',
    text: 'Ойын нәтижелері мен қауіпсіздік ұпайлары бір жеке кабинетте сақталады.',
  },
  {
    title: 'Тыныш қарқын',
    text: 'Интерфейс қадам-қадаммен бағыттайды: алдымен кіру, кейін курс, содан соң түсінікті әрекеттер.',
  },
];

export function HomePage({ user, publicLoading, publicData, onNavigate }) {
  const spotlightCourse = publicData.courseCards[0];
  const spotlightGame = publicData.games[0];

  return (
    <section className="page-stack">
      <div className="hero-grid">
        <article className="hero-panel hero-copy">
          <span className="eyebrow">Қауіпсіз басталу</span>
          <h1>Балаларға арналған цифрлық қауіпсіздік платформасы қорғануды түсінікті әрі қызық етеді.</h1>
          <p>
            Курстар, шағын тесттер, бейнесабақтар, ойындар және әкімші панелі балаларды
            кибербуллингтен, фишингтен және басқа цифрлық қауіптерден қорғануға үйретеді.
          </p>
          <div className="chip-row">
            <span className="soft-chip">JWT сессиясы</span>
            <span className="soft-chip">Бейнесабақтар</span>
            <span className="soft-chip">Ойындар мен тесттер</span>
            <span className="soft-chip">Әкімші панелі</span>
          </div>
          <div className="cta-row">
            <button type="button" className="primary-btn" onClick={() => onNavigate(user ? 'academy' : 'auth')}>
              {user ? 'Оқуды жалғастыру' : 'Кіру'}
            </button>
            <button type="button" className="secondary-btn" onClick={() => onNavigate('games')}>
              Ойындарды ашу
            </button>
          </div>
          <div className="mission-ribbon">
            {HOME_MISSIONS.map((mission) => (
              <div key={mission} className="mission-card">
                {mission}
              </div>
            ))}
          </div>
        </article>

        <aside className="hero-panel hero-visual">
          <div className="image-panel image-panel-hero">
            <img className="section-illustration section-illustration-hero" src={heroSafety} alt="Интернетте қауіпсіз оқуды жүргіздіру туралы балалар суреті" />
          </div>

          <div className="spotlight-strip">
            <div>
              <span className="strip-label">Түсінікті оқу бағыты</span>
              <strong>Балалар басынан соңына дейін өте алатын қысқа әрі анық курстар</strong>
            </div>
            <div>
              <span className="strip-label">Басқару орталығы</span>
              <strong>Сабақтар, тесттер, сұрақтар мен ойындар бір жерден басқарылады</strong>
            </div>
          </div>
        </aside>
      </div>

      <div className="section-shell">
        <SectionHeading
          eyebrow="Бағыттар"
          title="Дайын курстар мен қауіпсіздікке арналған жаттығулар"
          description="Платформада курстар, сабақтар, тесттер және ойын тапсырмалары бар."
        />

        {publicLoading ? (
          <LoadingPanel title="Курстар тізімі жүктеліп жатыр" />
        ) : (
          <div className="course-card-grid">
            {publicData.courseCards.map((course) => (
              <article key={course.id} className="course-card" style={{ '--card-accent': course.accentColor }}>
                <div className="course-card-top">
                  <span className="soft-chip">{course.level}</span>
                  <span className="soft-chip">{course.coverTag}</span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.subtitle}</p>
                <div className="card-meta-row">
                  <span>{course.lessonCount} сабақ</span>
                  <span>{course.quizCount} тест</span>
                  <span>{course.estimatedMinutes} минут</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="split-shell">
        <article className="feature-panel feature-glow">
          <SectionHeading
            eyebrow="Әдіс"
            title="Платформа баланың назарын қалай сақтайды"
            description="Интерфейс қарапайым, жеңіл және ойын элементтерімен толықтырылған, сондықтан ол шаршатпайды."
          />

          <div className="promise-grid">
            {SAFETY_PROMISES.map((promise) => (
              <article key={promise.title} className="promise-card">
                <h3>{promise.title}</h3>
                <p>{promise.text}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="feature-panel feature-dark">
          <SectionHeading
            eyebrow="Мүмкіндіктер"
            title="Дайын материалдар бір жерде жиналған"
            description="Бейнесабақтар, толық курстар, тесттер және интерактивті ойындар бір платформада қолжетімді."
          />

          <div className="auth-side-copy">
            <span className="eyebrow">Кіргеннен кейін</span>
            <h2>Курстар, ойындар және көмек бір тыныш кеңістікте жиналады</h2>
            <p>Оқушы тек қажет нәрсені көреді: сабақ, тест, ойын және келесі қадам. Артық ақпарат жоқ.</p>
          </div>
          <div className="compact-stack">
            {spotlightCourse ? (
              <div className="compact-item">
                <strong>{spotlightCourse.title}</strong>
                <span>{spotlightCourse.description}</span>
              </div>
            ) : null}
            {spotlightGame ? (
              <div className="compact-item">
                <strong>{spotlightGame.title}</strong>
                <span>{spotlightGame.description}</span>
              </div>
            ) : null}
            <button type="button" className="primary-btn" onClick={() => onNavigate('academy')}>
              Академияға өту
            </button>
          </div>
        </article>
      </div>

      <div className="section-shell">
        <SectionHeading
          eyebrow="SOS"
          title="Қиын жағдайда жасалатын жедел қадамдар"
          description="Қауіпті жағдай туса, бала осы қысқа нұсқаулыққа кез келген уақытта қайта орала алады."
        />

        <div className="support-grid">
          {SUPPORT_ACTIONS.map((action) => (
            <article key={action.title} className="support-card">
              <h3>{action.title}</h3>
              <ol className="support-steps">
                {action.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AcademyPage({
  user,
  loading,
  courses,
  selectedCourse,
  selectedLesson,
  selectedQuiz,
  quizDrafts,
  quizResults,
  busyKey,
  courseSearch,
  academyView,
  onCourseSearchChange,
  onSelectCourse,
  onSelectLesson,
  onOpenCatalog,
  onOpenCourse,
  onOpenLesson,
  onOpenQuiz,
  onEnroll,
  onCompleteLesson,
  onSelectQuizOption,
  onSubmitQuiz,
  onNavigate,
}) {
  if (loading && !courses.length && !selectedCourse) {
    return <LoadingPanel title="Академиясын жүктеп жатырмыз" />;
  }

  if (!selectedCourse) {
    return <EmptyPanel title="Курстар табылмады" text="Іздеуді өшіруді немесе серверінің іске қосылғанын тексеруді спробуй." />;
  }

  if (!courses.length && academyView === 'catalog') {
    return <EmptyPanel title="Курстар табылмады" text="Іздеуді өшіруді немесе серверінің іске қосылғанын тексеруді спробуй." />;
  }

  const lessons = sortByPosition(selectedCourse.lessons);
  const quiz = selectedQuiz ?? sortByPosition(selectedCourse.quizzes)[0] ?? null;
  const quizDraft = quiz ? quizDrafts[quiz.id] ?? {} : {};
  const quizResult = quiz ? quizResults[quiz.id] : null;
  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const firstLesson = lessons[0] ?? null;
  const nextCourseLesson = lessons.find((lesson) => !lesson.completed) ?? firstLesson;
  const currentLessonIndex = selectedLesson ? lessons.findIndex((lesson) => lesson.id === selectedLesson.id) : -1;
  const previousLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex >= 0 ? lessons[currentLessonIndex + 1] ?? null : null;
  const quizUnlocked = lessons.length ? completedLessons === lessons.length : true;
  const quizPassed = Boolean(quizResult?.passed || (quiz && typeof quiz.latestScore === 'number' && quiz.latestScore >= quiz.passingScore));
  const stageItems = [
    {
      key: 'course',
      eyebrow: 'Қадам 1',
      title: 'Курс шолуы',
      description: 'Курстың не туралы екенін қарап, оқу жоспарын түсініп ал.',
      active: academyView === 'course',
      done: true,
    },
    {
      key: 'lesson',
      eyebrow: 'Қадам 2',
      title: `Сабақтар ${completedLessons}/${lessons.length}`,
      description: nextCourseLesson ? `Келесі қадам: ${nextCourseLesson.title}` : 'Барлық сабақтар өтелді.',
      active: academyView === 'lesson',
      done: lessons.length > 0 && completedLessons === lessons.length,
    },
    {
      key: 'quiz',
      eyebrow: 'Қадам 3',
      title: quiz ? quiz.title : 'Қорытынды тест',
      description: quiz ? (quizUnlocked ? 'Бұл тест материалды бекітуге көмектеседі.' : 'Тест барлық сабақ аяқталғаннан кейін ашылады.') : 'Бұл курста қорытынды тест жоқ.',
      active: academyView === 'quiz',
      done: quiz ? quizPassed : true,
    },
  ];

  function renderBreadcrumbs(items) {
    return (
      <div className="academy-breadcrumbs" aria-label="Academy breadcrumbs">
        {items.map((item) =>
          item.action ? (
            <button key={item.label} type="button" className="academy-breadcrumb" onClick={item.action}>
              {item.label}
            </button>
          ) : (
            <span key={item.label} className="academy-breadcrumb current">
              {item.label}
            </span>
          )
        )}
      </div>
    );
  }

  function renderStageCards() {
    return (
      <div className="academy-step-grid">
        {stageItems.map((item) => (
          <article key={item.key} className={`academy-step-card ${item.active ? 'is-current' : ''} ${item.done ? 'is-done' : ''}`}>
            <span className="step-badge">{item.eyebrow}</span>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    );
  }

  if (academyView === 'catalog') {
    return (
      <section className="page-stack academy-shell">
        <article className="hero-panel academy-hero-card">
          <div className="academy-hero-copy">
            <span className="eyebrow">Оқу бағыты</span>
            <h1 className="page-title">Курстар енді түсінікті ретпен өтеді: шолу, сабақтар, қорытынды тест.</h1>
            <p className="page-copy">
              Енді әр кезең бөлек бетте ашылады. Алдымен курс мазмұнын көресің, содан соң сабақтарды өтесің, ал соңында қорытынды тест тапсырасың.
            </p>
            <div className="chip-row">
              <span className="soft-chip">1. Курс таңдау</span>
              <span className="soft-chip">2. Сабақтарды өту</span>
              <span className="soft-chip">3. Білімді тексеру</span>
            </div>
          </div>

          <div className="academy-hero-side">
            <div className="image-panel image-panel-inline">
              <img className="section-illustration" src={academyBuddy} alt="Academy buddy" />
            </div>
            <div className="academy-note-card">
              <strong>Қалай өтеді</strong>
              <p>Курсты аш, қадамдарды көр, сабақтарды ретімен өт және соңында тест арқылы біліміңді бекіт.</p>
            </div>
          </div>
        </article>

        <div className="academy-toolbar">
          <label className="search-pill">
            <span>Курс іздеу</span>
            <input value={courseSearch} onChange={(event) => onCourseSearchChange(event.target.value)} placeholder="фишинг, буллинг, құпиясөз..." />
          </label>

          <div className="academy-toolbar-card">
            <span className="eyebrow">Қарқын</span>
            <strong>{courses.length} оқу бағыты</strong>
            <p>Әр курс бөлек бетте ашылады, сондықтан оқу реті анық көрінеді.</p>
          </div>
        </div>

        {courses.length ? (
          <div className="academy-catalog-grid">
            {courses.map((course) => {
              const courseLessons = sortByPosition(course.lessons);
              const courseQuiz = sortByPosition(course.quizzes)[0] ?? null;
              const courseStartLesson = courseLessons.find((lesson) => !lesson.completed) ?? courseLessons[0] ?? null;

              return (
                <article key={course.id} className="course-card academy-catalog-card" style={{ '--card-accent': course.accentColor }}>
                  <div className="course-card-top">
                    <span className="soft-chip">{course.level}</span>
                    <span className="soft-chip">{course.estimatedMinutes} мин</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.subtitle || course.description}</p>
                  <div className="progress-track">
                    <span style={{ width: `${course.progressPercent ?? 0}%` }} />
                  </div>
                  <small>{course.progressPercent ?? 0}% өтелді</small>

                  <div className="academy-mini-step-list">
                    <div className="academy-mini-step">
                      <span className="step-number">1</span>
                      <div>
                        <strong>Шолу</strong>
                        <small>Курстың бөлек беті</small>
                      </div>
                    </div>
                    <div className="academy-mini-step">
                      <span className="step-number">2</span>
                      <div>
                        <strong>Сабақтар</strong>
                        <small>{courseLessons.length} сабақ, бейне және қысқаша мазмұн</small>
                      </div>
                    </div>
                    <div className="academy-mini-step">
                      <span className="step-number">3</span>
                      <div>
                        <strong>Тест</strong>
                        <small>{courseQuiz ? courseQuiz.title : 'Тест жоқ'}</small>
                      </div>
                    </div>
                  </div>

                  <div className="cta-row">
                    <button type="button" className="primary-btn" onClick={() => onOpenCourse(course.id)}>
                      Бағытты ашу
                    </button>
                    {courseStartLesson ? (
                    <button type="button" className="secondary-btn" onClick={() => onOpenLesson(course.id, courseStartLesson.id)}>
                        Өтуді бастау
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyPanel title="Ештеңе табылмады" text="Іздеу сөзін өзгертіп көр немесе сәл кейінірек қайта аш." />
        )}
      </section>
    );
  }

  if (academyView === 'course') {
    return (
      <section className="page-stack academy-shell">
        {renderBreadcrumbs([
          { label: 'Академия', action: onOpenCatalog },
          { label: selectedCourse.title },
        ])}

        <article className="hero-panel academy-stage-hero-card" style={{ '--card-accent': selectedCourse.accentColor }}>
          <div className="card-squircle">
            <span className="eyebrow">{selectedCourse.category}</span>
            <h1 className="page-title academy-page-title">{selectedCourse.title}</h1>
            <p className="page-copy">{selectedCourse.longDescription || selectedCourse.description}</p>
            <div className="chip-row">
              <span className="soft-chip">{selectedCourse.level}</span>
              <span className="soft-chip">{selectedCourse.estimatedMinutes} минут</span>
              <span className="soft-chip">{lessons.length} сабақ</span>
              {quiz ? <span className="soft-chip">1 тест</span> : null}
            </div>
          </div>

          <div className="academy-stage-side">
            <div className="image-panel image-panel-inline">
              <img className="section-illustration" src={gamesLab} alt="Course route" />
            </div>
            <div className="course-stage-actions">
              <div className="progress-ring">
                <strong>{selectedCourse.progressPercent ?? 0}%</strong>
                <span>бағыт</span>
              </div>
              {user?.role === 'STUDENT' ? (
                <button type="button" className="primary-btn" disabled={busyKey === `enroll-${selectedCourse.id}`} onClick={() => onEnroll(selectedCourse.id)}>
                  Менің бағытыма қосу
                </button>
              ) : (
                <button type="button" className="primary-btn" onClick={() => onNavigate('auth')}>
                  Прогресті сақтау үшін кіру
                </button>
              )}
              {nextCourseLesson ? (
                <button type="button" className="secondary-btn" onClick={() => onOpenLesson(selectedCourse.id, nextCourseLesson.id)}>
                  {completedLessons ? 'Сабақтарды жалғастыру' : 'Бірінші сабақты ашу'}
                </button>
              ) : null}
            </div>
          </div>
        </article>

        <div className="academy-stage-grid">
          <article className="feature-panel">
            <SectionHeading eyebrow="Бағыт" title="Алдымен шолу, кейін сабақтар, соңында тест" description="Әр кезең жеке бетке шығарылды, сондықтан оқу барысына назар аудару жеңіл." />
            {renderStageCards()}
          </article>

          <article className="feature-panel feature-glow academy-summary-card">
            <strong>Келесі қадам</strong>
            <p>{nextCourseLesson ? `"${nextCourseLesson.title}" сабағын ашып, оқуды жалғастыр.` : 'Барлық сабақ аяқталды, енді қорытынды тестке өте аласың.'}</p>
            <div className="academy-summary-points">
              <div className="academy-summary-point">
                <strong>{completedLessons}</strong>
                <span>сабақ аяқталды</span>
              </div>
              <div className="academy-summary-point">
                <strong>{lessons.length - completedLessons}</strong>
                <span>қалды</span>
              </div>
            </div>
          </article>
        </div>

        <div className="academy-overview-grid">
          <article className="feature-panel">
            <SectionHeading eyebrow="Сабақтар" title="Әр сабақты жеке беттен аш" description="Ішінде бейне, қысқаша мазмұн, тексеру тізімі және келесі қадам батырмасы бар." />

            <div className="academy-lesson-grid">
              {lessons.map((lesson) => (
                <article key={lesson.id} className={`academy-lesson-card ${lesson.completed ? 'is-complete' : ''}`}>
                  <div className="academy-lesson-card-head">
                    <span className="step-number">{lesson.position}</span>
                    <div>
                      <strong>{lesson.title}</strong>
                      <small>{lesson.duration}</small>
                    </div>
                  </div>
                  <p>{lesson.summary}</p>
                  <div className="cta-row">
                    <button type="button" className="primary-btn" onClick={() => onOpenLesson(selectedCourse.id, lesson.id)}>
                      Сабақты ашу
                    </button>
                    {lesson.completed ? <span className="soft-chip">Аяқталды</span> : null}
                  </div>
                </article>
              ))}
            </div>
          </article>

          {quiz ? (
            <article className="feature-panel academy-quiz-preview">
              <SectionHeading eyebrow="Қорытынды" title={quiz.title} description={quiz.description} />
              <div className="academy-note-card">
                <strong>{quizUnlocked ? 'Тест дайын' : 'Тест сабақтардан кейін ашылады'}</strong>
                <p>{quizUnlocked ? 'Қорытынды тест бөлек бетке шығарылды, сондықтан назарды бөлмей тапсыра аласың.' : 'Алдымен барлық сабақтарды аяқта, содан кейін тест қолжетімді болады.'}</p>
              </div>
              <div className="cta-row">
                <button type="button" className="primary-btn" onClick={() => onOpenQuiz(selectedCourse.id, quiz.id)}>
                  Қорытынды тестті ашу
                </button>
                {typeof quiz.latestScore === 'number' ? <span className="soft-chip">Соңғы нәтиже: {quiz.latestScore}</span> : null}
              </div>
            </article>
          ) : null}
        </div>
      </section>
    );
  }

  if (academyView === 'lesson') {
    if (!selectedLesson) {
      return <EmptyPanel title="Сабақ табылмады" text="Курс бетіне қайтып, қолжетімді сабақты қайта ашып көр." />;
    }

    const lessonBlocks = getLessonBlocks(selectedLesson);

    return (
      <section className="page-stack academy-shell">
        {renderBreadcrumbs([
          { label: 'Академия', action: onOpenCatalog },
          { label: selectedCourse.title, action: () => onOpenCourse(selectedCourse.id) },
          { label: selectedLesson.title },
        ])}

        <div className="lesson-page-grid">
          <aside className="feature-panel academy-sidebar">
            <span className="eyebrow">Қадам 2 / 3</span>
            <h2>Сабақты жеке бетте өт</h2>
            <p>Сол жақта барлық сабақ көрініп тұрады, ал негізгі аймақта тек ағымдағы сабақ ашылады.</p>
            {renderStageCards()}

            <div className="academy-lesson-list">
              {lessons.map((lesson) => (
                <button key={lesson.id} type="button" className={`lesson-pill ${selectedLesson.id === lesson.id ? 'is-active' : ''}`} onClick={() => onOpenLesson(selectedCourse.id, lesson.id)}>
                  <span>{lesson.position}</span>
                  <div>
                    <strong>{lesson.title}</strong>
                    <small>{lesson.duration}</small>
                  </div>
                  {lesson.completed ? <em>Аяқталды</em> : null}
                </button>
              ))}
            </div>

            {quiz ? (
              <button type="button" className="secondary-btn" onClick={() => onOpenQuiz(selectedCourse.id, quiz.id)}>
                Тестке өту
              </button>
            ) : null}
          </aside>

          <article className="feature-panel viewer-panel academy-lesson-panel">
            <span className="eyebrow">{selectedLesson.lessonType}</span>
            <h1 className="page-title academy-page-title">{selectedLesson.title}</h1>
            <p className="page-copy">{selectedLesson.summary}</p>

            <div className="chip-row">
              <span className="soft-chip">{selectedLesson.duration}</span>
              <span className="soft-chip">Сабақ {selectedLesson.position}</span>
              {selectedLesson.completed ? <span className="soft-chip">Аяқталды</span> : null}
            </div>

            <div className="academy-lesson-blocks">
              {lessonBlocks.map((block, blockIndex) =>
                block.type === 'video' ? (
                  <article key={`${selectedLesson.id}-block-${blockIndex}`} className="content-card lesson-block-card">
                    <div className="lesson-block-head">
                      <span className="soft-chip">Видео</span>
                      <strong>{block.videoTitle || block.heading || `Видео ${blockIndex + 1}`}</strong>
                    </div>
                    <div className="video-shell">
                      <iframe
                        title={block.videoTitle || block.heading || selectedLesson.videoTitle || 'Video'}
                        src={block.videoUrl}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </article>
                ) : (
                  <article key={`${selectedLesson.id}-block-${blockIndex}`} className="content-card lesson-block-card prose-card">
                    <div className="lesson-block-head">
                      <span className="soft-chip">Мәтін</span>
                      <strong>{block.heading || `Блок ${blockIndex + 1}`}</strong>
                    </div>
                    <p className="preline">{block.body}</p>
                  </article>
                )
              )}

              <article className="content-card checklist-card">
                <h3>Қауіпсіздік тексеру тізімі</h3>
                <p className="preline">{selectedLesson.safetyChecklist}</p>
              </article>
            </div>

            <div className="lesson-nav-actions">
              {previousLesson ? (
                <button type="button" className="secondary-btn" onClick={() => onOpenLesson(selectedCourse.id, previousLesson.id)}>
                  Алдыңғы сабаққа қайту
                </button>
              ) : (
                <button type="button" className="secondary-btn" onClick={() => onOpenCourse(selectedCourse.id)}>
                  Бағытқа қайту
                </button>
              )}

              {user?.role === 'STUDENT' ? (
                <button type="button" className="primary-btn" disabled={selectedLesson.completed || busyKey === `lesson-${selectedLesson.id}`} onClick={() => onCompleteLesson(selectedLesson.id)}>
                  {selectedLesson.completed ? 'Сабақ аяқталды' : 'Сабақты аяқталды деп белгілеу'}
                </button>
              ) : (
                <button type="button" className="primary-btn" onClick={() => onNavigate('auth')}>
                  Прогресті сақтау үшін кір
                </button>
              )}

              {nextLesson ? (
                <button type="button" className="secondary-btn" onClick={() => onOpenLesson(selectedCourse.id, nextLesson.id)}>
                  Келесі сабақ
                </button>
              ) : quiz ? (
                <button type="button" className="secondary-btn" onClick={() => onOpenQuiz(selectedCourse.id, quiz.id)}>
                  Тестке өту
                </button>
              ) : null}
            </div>
          </article>
        </div>
      </section>
    );
  }

  if (!quiz) {
    return <EmptyPanel title="Тест әлі қосылмаған" text="Бұл курс сабақтармен аяқталады. Курс бетіне қайта аласың." />;
  }

  return (
    <section className="page-stack academy-shell">
      {renderBreadcrumbs([
        { label: 'Академия', action: onOpenCatalog },
        { label: selectedCourse.title, action: () => onOpenCourse(selectedCourse.id) },
        { label: quiz.title },
      ])}

      <div className="quiz-page-grid">
        <aside className="feature-panel academy-sidebar">
          <span className="eyebrow">Қадам 3 / 3</span>
          <h2>Қорытынды тест</h2>
          <p>Тест бөлек бетте ашылады, сондықтан сұрақтарға алаңдамай жауап беруге болады.</p>
          {renderStageCards()}
          <div className="academy-note-card">
            <strong>{quizUnlocked ? 'Жауаптарды жіберуге болады' : 'Алдымен барлық сабақтарды аяқта'}</strong>
            <p>{quizUnlocked ? 'Қажет болса, курсқа қайта оралып, сабақты қайта қарап шыға аласың.' : 'Сұрақтарды көре аласың, бірақ тапсыру үшін сабақтарды толық аяқтау керек.'}</p>
          </div>
          <div className="cta-row">
            <button type="button" className="secondary-btn" onClick={() => onOpenCourse(selectedCourse.id)}>
              Курсқа қайту
            </button>
            {nextCourseLesson ? (
              <button type="button" className="secondary-btn" onClick={() => onOpenLesson(selectedCourse.id, nextCourseLesson.id)}>
                Келесі сабақты ашу
              </button>
            ) : null}
          </div>
        </aside>

        <article className="feature-panel quiz-panel academy-quiz-panel">
          <SectionHeading eyebrow="Қорытынды" title={quiz.title} description={quiz.description} />

          {!quizUnlocked ? (
            <div className="academy-note-card academy-note-warning">
              <strong>Ең алдымен сабақтарды аяқтаңыз</strong>
              <p>Тестті толық тапсыру үшін алдымен курс ішіндегі барлық сабақтарды бітір.</p>
            </div>
          ) : null}

          <div className="quiz-question-grid">
            {sortByPosition(quiz.questions).map((question) => {
              console.log(quizDraft);
              
              const selectedOptionId = quizDraft[String(question.id)];
              return (
                <article key={question.id} className="question-card">
                  <strong className="question-prompt">{question.prompt}</strong>
                  <div className="answer-list">
                    {question.options.map((option) => {
                      const checked = selectedOptionId !== undefined && String(selectedOptionId) === String(option.id);
                      return (
                        <label
                          key={option.id}
                          className={checked ? 'answer-radio-label answer-radio-label--checked' : 'answer-radio-label'}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.id}
                            checked={checked}
                            onChange={() => onSelectQuizOption(quiz.id, question.id, option.id)}
                          />
                          <span className="answer-radio-circle" />
                          <span className="answer-radio-text">{option.text}</span>
                        </label>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="cta-row">
            <button type="button" className="primary-btn" disabled={!quizUnlocked || busyKey === `quiz-${quiz.id}`} onClick={() => onSubmitQuiz(quiz.id)}>
              Тестті жіберу
            </button>
            {typeof quiz.latestScore === 'number' ? <span className="soft-chip">Соңғы нәтиже: {quiz.latestScore} балл</span> : null}
          </div>

          {quizResult ? (
            <article className={`result-box ${quizResult.passed ? 'result-success' : 'result-warning'}`}>
              <h3>{quizResult.passed ? 'Тест сәтті аяқталды' : 'Нәтиже сақталды'}</h3>
              <p>Ұпай: {quizResult.score} / {quizResult.maxScore}. Курс прогресі {quizResult.courseProgressPercent}%-ға жетті.</p>
              <div className="evaluation-list">
                {quizResult.evaluations.map((evaluation) => (
                  <div key={evaluation.questionId} className="evaluation-card">
                    <strong>{evaluation.prompt}</strong>
                    <p>{evaluation.correct ? 'Дұрыс' : 'Қайта қарау керек'}: {evaluation.explanation}</p>
                    <small>Дұрыс жауап: {evaluation.correctOption}</small>
                  </div>
                ))}
              </div>
              <div className="cta-row">
                <button type="button" className="secondary-btn" onClick={() => onOpenCourse(selectedCourse.id)}>
                  Курсқа қайту
                </button>
                <button type="button" className="primary-btn" onClick={onOpenCatalog}>
                  Курстар каталогына өту
                </button>
              </div>
            </article>
          ) : null}
        </article>
      </div>
    </section>
  );

  // eslint-disable-next-line no-unreachable
  return (
    <section className="page-stack">
      <div className="section-shell academy-head">
        <div>
          <span className="eyebrow">Академия</span>
          <h1 className="page-title">Курстар, дерістер және тесттер бір ағынында.</h1>
          <p className="page-copy">
            {user
              ? 'Сізің прогрессіңіз, өтелген сабақтар және тест нәтижелері JWT-сессиясы арқылы backend-тен тартылады.'
              : 'Қонақ режімі оқыту бағдарламасын көрсетеді. Прогрессті сақтау және қауіпсіздік ұпайларын алу үшін профилге кіріңіз.'}
          </p>
        </div>

        <label className="search-pill">
          <span>Курс іздеу</span>
          <input value={courseSearch} onChange={(event) => onCourseSearchChange(event.target.value)} placeholder="Қуласы, фишинг, жеке ӘК..." />
        </label>
      </div>

      <div className="academy-layout">
        <aside className="course-rail">
          {courses.map((course) => (
            <button
              key={course.id}
              type="button"
              className={`rail-card ${selectedCourse.id === course.id ? 'is-active' : ''}`}
              style={{ '--card-accent': course.accentColor }}
              onClick={() => onSelectCourse(course.id)}
            >
              <span className="soft-chip">{course.level}</span>
              <strong>{course.title}</strong>
              <p>{course.subtitle}</p>
              <div className="progress-track">
                <span style={{ width: `${course.progressPercent ?? 0}%` }} />
              </div>
              <small>{course.progressPercent ?? 0}% өтелді</small>
            </button>
          ))}
        </aside>

        <div className="course-stage">
          <article className="hero-panel course-stage-hero" style={{ '--card-accent': selectedCourse.accentColor }}>
            <div className="card-squircle">
              <span className="eyebrow">{selectedCourse.category}</span>
              <h2>{selectedCourse.title}</h2>
              <p>{selectedCourse.longDescription}</p>
              <div className="chip-row">
                <span className="soft-chip">{selectedCourse.level}</span>
                <span className="soft-chip">{selectedCourse.estimatedMinutes} минут</span>
                <span className="soft-chip">{selectedCourse.lessons.length} сабақ</span>
              </div>
            </div>

            <div className="course-stage-aside">
              <div className="image-panel image-panel-inline">
                <img className="section-illustration" src={academyBuddy} alt="Балалар цифрлық қауіпсіздік іс-әрекеттері сипатталған суреті" />
              </div>
              <div className="course-stage-actions">
              <div className="progress-ring">
                <strong>{selectedCourse.progressPercent ?? 0}%</strong>
                <span>бағыт</span>
              </div>
              {user?.role === 'STUDENT' ? (
                <button
                  type="button"
                  className="primary-btn"
                  disabled={busyKey === `enroll-${selectedCourse.id}`}
                  onClick={() => onEnroll(selectedCourse.id)}
                >
                  Менің бағытыма қосу
                </button>
              ) : (
                <button type="button" className="primary-btn" onClick={() => onNavigate('auth')}>
                  Прогрессті сақтау үшін кіру
                </button>
                )}
              </div>
            </div>
          </article>

          <div className="lesson-layout">
            <article className="feature-panel">
              <SectionHeading
                eyebrow="Сабақтар"
                title="Курстың ойнату тізімі"
                description="Сабақты ашыңыз, орнатылған видеосын қарап, аяқтау белгісін қойыңыз."
              />

              <div className="lesson-list">
                {sortByPosition(selectedCourse.lessons).map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    className={`lesson-pill ${selectedLesson?.id === lesson.id ? 'is-active' : ''}`}
                    onClick={() => onSelectLesson(selectedCourse.id, lesson.id)}
                  >
                    <span>{lesson.position}</span>
                    <div>
                      <strong>{lesson.title}</strong>
                      <small>{lesson.duration}</small>
                    </div>
                    {lesson.completed ? <em>Готово</em> : null}
                  </button>
                ))}
              </div>
            </article>

            <article className="feature-panel viewer-panel">
              {selectedLesson ? (
                <>
                  <span className="eyebrow">{selectedLesson.lessonType}</span>
                  <h2>{selectedLesson.title}</h2>
                  <p>{selectedLesson.summary}</p>

                  <div className="video-shell">
                    <iframe
                      title={selectedLesson.videoTitle}
                      src={selectedLesson.videoUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="content-grid">
                    <article className="content-card prose-card">
                      <h3>Конспект</h3>
                      <p className="preline">{selectedLesson.content}</p>
                    </article>
                    <article className="content-card checklist-card">
                      <h3>Қауіпсіздік тексеру тізімі</h3>
                      <p className="preline">{selectedLesson.safetyChecklist}</p>
                    </article>
                  </div>

                  {user?.role === 'STUDENT' ? (
                    <button
                      type="button"
                      className="primary-btn"
                      disabled={selectedLesson.completed || busyKey === `lesson-${selectedLesson.id}`}
                      onClick={() => onCompleteLesson(selectedLesson.id)}
                    >
                      {selectedLesson.completed ? 'Сабақ өтелді' : 'Сабақты өтелді деген белгі қою'}
                    </button>
                  ) : null}
                </>
              ) : null}
            </article>
          </div>

          {quiz ? (
            <article className="feature-panel quiz-panel">
              <SectionHeading eyebrow="Тест" title={quiz.title} description={quiz.description} />

              <div className="quiz-question-grid">
                {sortByPosition(quiz.questions).map((question) => (
                  <article key={question.id} className="question-card">
                    <strong>{question.prompt}</strong>
                    <div className="answer-list">
                      {question.options.map((option) => (
                        <label key={option.id} className="answer-option">
                          <input
                            type="radio"
                            name={`quiz-${quiz.id}-question-${question.id}`}
                            checked={quizDraft[question.id] === option.id}
                            onChange={() => onSelectQuizOption(quiz.id, question.id, option.id)}
                          />
                          <span>{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="cta-row">
                <button type="button" className="primary-btn" disabled={busyKey === `quiz-${quiz.id}`} onClick={() => onSubmitQuiz(quiz.id)}>
                  Тестті жіберу
                </button>
                {typeof quiz.latestScore === 'number' ? <span className="soft-chip">Соңғы нәтиже: {quiz.latestScore} балл</span> : null}
              </div>

              {quizResult ? (
                <article className={`result-box ${quizResult.passed ? 'result-success' : 'result-warning'}`}>
                  <h3>{quizResult.passed ? 'Тест өтелді' : 'Тест сақталды'}</h3>
                  <p>
                    Ұпай: {quizResult.score} / {quizResult.maxScore}. Курс {quizResult.courseProgressPercent}%-ге дейін өнді.
                  </p>
                  <div className="evaluation-list">
                    {quizResult.evaluations.map((evaluation) => (
                      <div key={evaluation.questionId} className="evaluation-card">
                        <strong>{evaluation.prompt}</strong>
                        <p>{evaluation.correct ? 'Дұрыс' : 'Қайта қарау керек'}: {evaluation.explanation}</p>
                        <small>Дұрыс жауап: {evaluation.correctOption}</small>
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function GamesPage({ user, loading, games, selectedGame, selectedGameId, busyKey, onSelectGame, onCompleteGame, onNavigate }) {
  if (loading && !games.length) {
    return <LoadingPanel title="Ойындарды жүктеп жатырмыз" />;
  }

  if (!selectedGame) {
    return <EmptyPanel title="Ойындар табылмады" text="Әкімші панелінен ойын қосылғанын немесе сервер деректерін тексер." />;
  }

  return (
    <section className="page-stack">
      <div className="section-shell academy-head">
        <div>
          <span className="eyebrow">Ойындар</span>
          <h1 className="page-title">Шынайы цифрлық жағдайларға арналған шағын ойындар.</h1>
          <p className="page-copy">Ойын нәтижесін сақтау және қауіпсіздік ұпайларын қосу үшін белсенді JWT сессиясы қажет.</p>
        </div>

        {!user ? (
          <button type="button" className="primary-btn" onClick={() => onNavigate('auth')}>
            Нәтижені сақтау үшін кіру
          </button>
        ) : null}
      </div>

      <div className="academy-layout">
        <aside className="course-rail">
          {games.map((game) => (
            <button
              key={game.id}
              type="button"
              className={`rail-card ${selectedGameId === game.id ? 'is-active' : ''}`}
              style={{ '--card-accent': game.accentColor }}
              onClick={() => onSelectGame(game.id)}
            >
              <span className="soft-chip">{game.gameType}</span>
              <strong>{game.title}</strong>
              <p>{game.description}</p>
              <small>{game.bestScore ?? 0} ең жақсы ұпай</small>
            </button>
          ))}
        </aside>

        <div className="course-stage">
          <article className="hero-panel course-stage-hero" style={{ '--card-accent': selectedGame.accentColor }}>
            <div className="card-squircle">
              <span className="eyebrow">{selectedGame.difficulty}</span>
              <h2>{selectedGame.title}</h2>
              <p>{selectedGame.instructions}</p>
              <div className="chip-row">
                <span className="soft-chip">{selectedGame.rewardPoints} балл</span>
                <span className="soft-chip">{selectedGame.estimatedMinutes} минут</span>
                <span className="soft-chip">{selectedGame.completed ? 'Аяқталды' : 'Жаңа ойын'}</span>
              </div>
            </div>

            <div className="course-stage-aside">
              <div className="image-panel image-panel-inline">
                <img className="section-illustration" src={gamesLab} alt="Ойындар арқылы оқып жатқан балалар суреті" />
              </div>
              <div className="game-score-box">
              <strong>{selectedGame.bestScore ?? 0}</strong>
              <span>ең жақсы ұпай</span>
              </div>
            </div>
          </article>

          <article className="feature-panel game-stage">
            {selectedGame.gameType === 'inbox-defender' ? (
              <InboxDefenderGame
                key={selectedGame.id}
                game={selectedGame}
                busy={busyKey === `game-${selectedGame.id}`}
                onComplete={onCompleteGame}
              />
            ) : selectedGame.gameType === 'trust-sorter' ? (
              <TrustSorterGame
                key={selectedGame.id}
                game={selectedGame}
                busy={busyKey === `game-${selectedGame.id}`}
                onComplete={onCompleteGame}
              />
            ) : (
              <UnknownGamePreview game={selectedGame} />
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

export function DashboardPage({ user, loading, dashboard, onNavigate }) {
  if (!user) {
    return (
      <GatePanel
        title="Жеке кабинетке кіру қажет"
        text="Жеке кабинеттен оқу прогресін, қауіпсіздік ұпайларын, аяқталған ойындарды және келесі қадамдарды көресің."
        actionLabel="Кіруге өту"
        onAction={() => onNavigate('auth')}
      />
    );
  }

  if (user.role === 'ADMIN') {
    return (
      <GatePanel
        title="Бұл профиль әкімші ретінде ашылған"
        text="Сабақтарды, тесттерді, бейнелерді және ойындарды басқару үшін әкімші панеліне өт."
        actionLabel="Әкімші панелін ашу"
        onAction={() => onNavigate('admin')}
      />
    );
  }

  if (loading || !dashboard) {
    return <LoadingPanel title="Жеке кабинет жүктеліп жатыр" />;
  }

  return (
    <section className="page-stack">
      <div className="hero-grid">
        <article className="hero-panel profile-hero-panel">
          <span className="eyebrow">Оқушы кабинеті</span>
          <h1>{dashboard.user.fullName}</h1>
          <p>
            {dashboard.user.age} жас, {dashboard.user.gradeLevel}, {dashboard.user.city}. Күндік серия: {dashboard.user.streakDays}.
          </p>

          <div className="metric-grid">
            <div className="metric-card">
              <strong>{dashboard.user.safePoints}</strong>
              <span>қауіпсіздік ұпайы</span>
            </div>
            <div className="metric-card">
              <strong>{dashboard.myCourses.length}</strong>
              <span>белсенді курстар</span>
            </div>
            <div className="metric-card">
              <strong>{dashboard.games.filter((game) => game.completed).length}</strong>
              <span>аяқталған ойындар</span>
            </div>
          </div>
        </article>

        <aside className="hero-panel dashboard-action-panel">
          <div className="image-panel image-panel-compact">
            <img className="section-illustration" src={academyBuddy} alt="Оқушы прогрессі туралы суреті" />
          </div>
          <span className="eyebrow">Келесі қадам</span>
          <h2>Оқуды осы жерден жалғастыр</h2>
          <div className="compact-stack">
            {dashboard.featuredCourses.slice(0, 2).map((course) => (
              <button key={course.id} type="button" className="compact-link" onClick={() => onNavigate('academy')}>
                <strong>{course.title}</strong>
                <span>{course.progressPercent}% аяқталды</span>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div className="split-shell">
        <article className="feature-panel">
          <SectionHeading
            eyebrow="Менің курстарым"
            title="Оқу бағыты"
            description="Мұнда сенің жеке прогресіңе сай курстар көрсетіледі."
          />
          <div className="course-card-grid">
            {dashboard.myCourses.map((course) => (
              <article key={course.id} className="course-card" style={{ '--card-accent': course.accentColor }}>
                <h3>{course.title}</h3>
                <p>{course.subtitle}</p>
                <div className="progress-track">
                  <span style={{ width: `${course.progressPercent}%` }} />
                </div>
                <small>{course.progressPercent}% аяқталды</small>
              </article>
            ))}
          </div>
        </article>

        <article className="feature-panel feature-dark">
          <SectionHeading
            eyebrow="Жетістіктер"
            title="Соңғы нәтижелер"
            description="Бұл карточкалар сабақтар, тесттер және ойындар аяқталған сайын жаңарып отырады."
          />
          <div className="compact-stack">
            {dashboard.achievements.map((achievement) => (
              <div key={achievement.title} className="compact-item">
                <strong>{achievement.title}</strong>
                <span>{achievement.description}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export function AuthPage({
  user,
  authMode,
  setAuthMode,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  busyKey,
  onLoginSubmit,
  onRegisterSubmit,
  onNavigate,
}) {
  if (user) {
    return (
      <GatePanel
        title="Сессия белсенді"
        text="Сен аккаунтқа кіріп тұрсың. Оқуды жалғастыру үшін кабинетке немесе академияға өт."
        actionLabel="Жалғастыру"
        onAction={() => onNavigate(user.role === 'ADMIN' ? 'admin' : 'dashboard')}
      />
    );
  }

  return (
    <section className="page-stack">
      <div className="split-shell auth-shell">
        <article className="feature-panel auth-form-panel">
          <div className="auth-intro">
            <span className="eyebrow">Кіру</span>
            <h1 className="page-title">Өз қауіпсіз оқу бағытыңа кір</h1>
            <p className="page-copy">Кіргеннен кейін сабақтар, ойындар, тест нәтижелері және қауіпсіздік ұпайлары сақталады. Оқуды тоқтаған жерден жалғастыра аласың.</p>
            <div className="chip-row">
              <span className="soft-chip">Жеке кабинет</span>
              <span className="soft-chip">Оқу прогресі</span>
              <span className="soft-chip">JWT сессиясы</span>
            </div>
          </div>
          <SectionHeading eyebrow="Аккаунт" title="JWT арқылы кіру және тіркелу" description="Бұл форма `/api/auth/login` және `/api/auth/register` маршруттарымен жұмыс істейді." />

          <div className="tab-row auth-tab-row">
            <button type="button" className={`tab-btn ${authMode === 'login' ? 'is-active' : ''}`} onClick={() => setAuthMode('login')}>
              Кіру
            </button>
            <button type="button" className={`tab-btn ${authMode === 'register' ? 'is-active' : ''}`} onClick={() => setAuthMode('register')}>
              Тіркеу
            </button>
          </div>

          {authMode === 'login' ? (
            <form className="form-stack auth-form" onSubmit={onLoginSubmit}>
              <FormField label="Логин">
                <input value={loginForm.username} placeholder="Мысалы, alina" autoComplete="username" onChange={(event) => setLoginForm((state) => ({ ...state, username: event.target.value }))} />
              </FormField>
              <FormField label="Құпиясөз">
                <input type="password" value={loginForm.password} placeholder="Құпиясөзді енгіз" autoComplete="current-password" onChange={(event) => setLoginForm((state) => ({ ...state, password: event.target.value }))} />
              </FormField>
              <button type="submit" className="primary-btn" disabled={busyKey === 'login'}>
                Кіру
              </button>
              <p className="auth-inline-note">Кіргеннен кейін кабинет, курстар, ойындар және сақталған прогресс ашылады.</p>
            </form>
          ) : (
            <form className="form-stack auth-form" onSubmit={onRegisterSubmit}>
              <div className="field-grid auth-field-grid">
                <FormField label="Логин">
                  <input value={registerForm.username} placeholder="Өзіңе логин ойлап тап" onChange={(event) => setRegisterForm((state) => ({ ...state, username: event.target.value }))} />
                </FormField>
                <FormField label="Толық аты-жөні">
                  <input value={registerForm.fullName} placeholder="Мысалы, Аружан Сейтхан" onChange={(event) => setRegisterForm((state) => ({ ...state, fullName: event.target.value }))} />
                </FormField>
                <FormField label="Жасы">
                  <input value={registerForm.age} placeholder="Мысалы, 10" onChange={(event) => setRegisterForm((state) => ({ ...state, age: event.target.value }))} />
                </FormField>
                <FormField label="Сыныбы">
                  <input value={registerForm.gradeLevel} placeholder="Мысалы, 4Б" onChange={(event) => setRegisterForm((state) => ({ ...state, gradeLevel: event.target.value }))} />
                </FormField>
                <FormField label="Қала">
                  <input value={registerForm.city} placeholder="Мысалы, Қызылорда" onChange={(event) => setRegisterForm((state) => ({ ...state, city: event.target.value }))} />
                </FormField>
                <FormField label="Құпиясөз">
                  <input type="password" value={registerForm.password} placeholder="Құпиясөз ойлап тап" autoComplete="new-password" onChange={(event) => setRegisterForm((state) => ({ ...state, password: event.target.value }))} />
                </FormField>
              </div>
              <button type="submit" className="primary-btn" disabled={busyKey === 'register'}>
                Тіркелу
              </button>
              <p className="auth-inline-note">Жаңа профиль жеке кабинетке, оқу бағытына және прогресті сақтауға бірден қолжеткізеді.</p>
            </form>
          )}
        </article>

        <aside className="feature-panel feature-dark auth-side-panel">
          <div className="auth-side-copy">
            <span className="eyebrow">Кіргеннен кейін</span>
            <h2>Курстар, ойындар және көмек бір тыныш кеңістікте жиналады</h2>
            <p>Оқушы тек қажет нәрсені көреді: сабақ, тест, ойын және келесі қадам. Артық экрандар болмайды.</p>
          </div>
          <div className="image-panel image-panel-dark">
            <img className="section-illustration" src={authFriends} alt="Кіру және тіркелу бетіне арналған иллюстрация" />
          </div>
          <SectionHeading eyebrow="Мүмкіндіктер" title="Нені аласың" description="Аккаунт ашқаннан кейін барлық функция қолжетімді болады." />
          <div className="auth-benefit-grid">
            {AUTH_FEATURES.map((item) => (
              <article key={item.title} className="auth-benefit-card">
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="auth-side-note">
            <strong>Егер бір нәрсе алаңдатса</strong>
            <p>Платформа саған мынаны еске салады: агрессияға жауап берме, скриншот жаса және ересектен көмек сұра.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function AdminPage(props) {
  const {
    user,
    adminData,
    loading,
    busyKey,
    adminSearch,
    onAdminSearchChange,
    filteredUsers,
    gameEditor,
    onDeleteCourse,
    onOpenCourseBuilder,
    onSelectGameToEdit,
    onResetGame,
    onGameFieldChange,
    onSaveGame,
    onDeleteGame,
    onToggleGamePublished,
    onUpdateUserRole,
    onDeleteUser,
    onNavigate,
  } = props;

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [gamesMode, setGamesMode] = useState('view'); // view | edit

  useEffect(() => {
    if (activeTab !== 'games') {
      return;
    }

    if (!selectedGameId && adminData.games.length) {
      setSelectedGameId(adminData.games[0].id);
    }
  }, [activeTab, adminData.games, selectedGameId]);

  const selectedGame =
    selectedGameId != null
      ? adminData.games.find((game) => game.id === selectedGameId) ?? null
      : null;

  if (!user) {
    return (
      <GatePanel
        title="Админ-панель JWT құлыстануы арқылы қорықты"
        text="Мазмұны мен пайдаланушыларды басқару үшін администратор ретінде кіріңіз."
        actionLabel="Кіру ашу"
        onAction={() => onNavigate('auth')}
      />
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <GatePanel
        title="Жеткіліксіз құқылар"
        text="Ағымды профиль администратор құқықтары жоқ."
        actionLabel="Кабинетті ашу"
        onAction={() => onNavigate('dashboard')}
      />
    );
  }

  if (loading || !adminData.overview) {
    return <LoadingPanel title="Администрациялық панельді жүктеп жатырмыз" />;
  }

  const tabs = [
    { id: 'overview', label: 'Шолу' },
    { id: 'users', label: 'Пайдаланушылар' },
    { id: 'courses', label: 'Курстар' },
    { id: 'games', label: 'Ойындар' },
  ];

  return (
    <section className="page-stack">
      <div className="section-shell academy-head">
        <div>
          <span className="eyebrow">Admin кабинесі</span>
          <h1 className="page-title">Мазмұны мен пайдаланушыларды толық басқару.</h1>
          <p className="page-copy">Курстар сертификаттар ретінде құрылады: сабақтар, бейнелер, тесттер, сұрақтар және жауав варианттары бір терезеден өңделеді.</p>
        </div>
        {activeTab === 'users' ? (
          <label className="search-pill">
            <span>Пайдаланушыны іздеу</span>
            <input
              value={adminSearch}
              onChange={(event) => onAdminSearchChange(event.target.value)}
              placeholder="админ, алина, оқушы..."
            />
          </label>
        ) : (
          <div className="cta-row">
            <button type="button" className="secondary-btn" onClick={() => setActiveTab('courses')}>
              Курстар
            </button>
            <button type="button" className="secondary-btn" onClick={() => setActiveTab('games')}>
              Ойындар
            </button>
            <button type="button" className="primary-btn" onClick={() => onOpenCourseBuilder()}>
              Жаңа курс
            </button>
          </div>
        )}
      </div>

      <div className="wizard-steps admin-tabs" role="tablist" aria-label="Admin бөлімдері">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`wizard-step ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className="stats-grid">
            <StatCard label="Пайдаланушылар" value={adminData.overview.totalUsers} />
            <StatCard label="Оқушылар" value={adminData.overview.totalStudents} />
            <StatCard label="Курстар" value={adminData.overview.totalCourses} />
            <StatCard label="Ойындар" value={adminData.overview.totalGames} />
            <StatCard label="Сабақтар" value={adminData.overview.totalLessons} />
            <StatCard label="Тест талпындарын" value={adminData.overview.totalQuizAttempts} />
          </div>

          <div className="split-shell">
            <article className="feature-panel">
              <SectionHeading eyebrow="Жылдам әрекеттер" title="Басқаруды бастаңыз" description="Курс құру, ойындарды көрсету/жасыру және пайдаланушылар рөлдерін басқару." />
              <div className="cta-row">
                <button type="button" className="primary-btn" onClick={() => onOpenCourseBuilder()}>
                  Жаңа курс
                </button>
                <button type="button" className="secondary-btn" onClick={() => setActiveTab('courses')}>
                  Курстарға өту
                </button>
                <button type="button" className="secondary-btn" onClick={() => setActiveTab('games')}>
                  Ойындарға өту
                </button>
              </div>
            </article>

            <article className="feature-panel feature-dark">
              <SectionHeading eyebrow="Жағдай" title="Қысқаша көрініс" description="Платформа статистикасы және негізгі көрсеткіштер." />
              <div className="metric-grid">
                <div className="metric-card">
                  <strong>{adminData.overview.totalAdmins}</strong>
                  <span>Админ</span>
                </div>
                <div className="metric-card">
                  <strong>{adminData.overview.totalQuizzes}</strong>
                  <span>Тест</span>
                </div>
                <div className="metric-card">
                  <strong>{adminData.overview.totalLessons}</strong>
                  <span>Сабақ</span>
                </div>
              </div>
            </article>
          </div>
        </>
      ) : null}

      {activeTab === 'users' ? (
        <article className="feature-panel">
          <SectionHeading eyebrow="Пайдаланушылар" title="Рөлдер және есептіктері" description="Рөлдерді өзгертіңіз немесе есептікті өшіріңіз (соңғы админ сақталады)." />
          <div className="user-list">
            {filteredUsers.map((member) => (
              <article key={member.id} className="user-card">
                <div>
                  <strong>{member.fullName}</strong>
                  <p>@{member.username} • {member.city} • {member.gradeLevel}</p>
                </div>
                <div className="user-actions">
                  <select value={member.role} onChange={(event) => onUpdateUserRole(member.id, event.target.value)}>
                    <option value="STUDENT">STUDENT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button
                    type="button"
                    className="secondary-btn danger-btn"
                    disabled={busyKey === `delete-user-${member.id}` || busyKey === `role-${member.id}`}
                    onClick={() => onDeleteUser(member.id)}
                  >
                    Өшіру
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>
      ) : null}

      {activeTab === 'courses' ? (
        <article className="feature-panel feature-dark">
          <SectionHeading eyebrow="Курстар" title="Бар бағыттар" description="Курсты өңдеңіз немесе жаңасын құрыңыз." />
          <div className="cta-row">
            <button type="button" className="secondary-btn" onClick={() => onOpenCourseBuilder()}>
              Жаңа курс
            </button>
          </div>
          <div className="compact-stack">
            {adminData.courses.map((course) => (
              <div key={course.id} className="compact-item">
                <div>
                  <strong>{course.title}</strong>
                  <span>{course.lessons.length} сабақ • {course.quizzes.length} тест • {course.published ? 'жарияланды' : 'жасырылған'}</span>
                </div>
                <div className="mini-actions">
                  <button type="button" className="secondary-btn" onClick={() => onOpenCourseBuilder(course)}>Өңдеу</button>
                  <button type="button" className="secondary-btn danger-btn" onClick={() => onDeleteCourse(course.id)}>Өшіру</button>
                </div>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      {activeTab === 'games' ? (
        <div className="split-shell">
          <article className="feature-panel feature-dark">
            <SectionHeading eyebrow="Ойындар" title="Каталог" description="Ойындарды көрсету/жасыру және таңдалған ойынның мәліметтерін қарау." />
            <div className="compact-stack">
              {adminData.games.map((game) => (
                <div key={game.id} className={`compact-item ${selectedGameId === game.id ? 'is-selected' : ''}`}>
                  <button
                    type="button"
                    className="compact-select"
                    onClick={() => {
                      setSelectedGameId(game.id);
                      setGamesMode('view');
                    }}
                  >
                    <strong>{game.title}</strong>
                    <span>
                      {game.gameType} • {game.published ? 'көрінеді' : 'жасырылған'}
                    </span>
                  </button>
                  <div className="mini-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => {
                        setSelectedGameId(game.id);
                        setGamesMode('edit');
                        onSelectGameToEdit(game);
                      }}
                    >
                      Өңдеу
                    </button>
                    <button
                      type="button"
                      className="secondary-btn"
                      disabled={busyKey === `toggle-game-${game.id}`}
                      onClick={() => onToggleGamePublished(game)}
                    >
                      {game.published ? 'Жасыру' : 'Көрсету'}
                    </button>
                    <button type="button" className="secondary-btn danger-btn" onClick={() => onDeleteGame(game.id)}>
                      Өшіру
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="feature-panel editor-panel">
            <SectionHeading
              eyebrow={gamesMode === 'edit' ? 'Ойын өңдеу' : 'Ойын мәліметтері'}
              title={selectedGame ? selectedGame.title : 'Ойын таңдалмаған'}
              description={gamesMode === 'edit' ? 'Өңдеу режимі: өзгерістерді сақтаңыз.' : 'Көру режимі: JSON мен параметрлер.'}
            />

            {!selectedGame ? (
              <p className="page-copy">Сол жақтан ойын таңдаңыз.</p>
            ) : gamesMode === 'edit' ? (
              <>
                <div className="cta-row">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      setGamesMode('view');
                      onResetGame();
                    }}
                  >
                    Көруге қайту
                  </button>
                  <button type="button" className="primary-btn" disabled={busyKey === 'save-game'} onClick={onSaveGame}>
                    Сақтау
                  </button>
                </div>

                <div className="field-grid">
                  <FormField label="Slug"><input value={gameEditor.slug} onChange={(event) => onGameFieldChange('slug', event.target.value)} /></FormField>
                  <FormField label="Атауы"><input value={gameEditor.title} onChange={(event) => onGameFieldChange('title', event.target.value)} /></FormField>
                  <FormField label="Түрі"><input value={gameEditor.gameType} onChange={(event) => onGameFieldChange('gameType', event.target.value)} /></FormField>
                  <FormField label="Қиындығы"><input value={gameEditor.difficulty} onChange={(event) => onGameFieldChange('difficulty', event.target.value)} /></FormField>
                  <FormField label="Түсі"><input value={gameEditor.accentColor} onChange={(event) => onGameFieldChange('accentColor', event.target.value)} /></FormField>
                  <FormField label="Сыйлығы"><input value={gameEditor.rewardPoints} onChange={(event) => onGameFieldChange('rewardPoints', event.target.value)} /></FormField>
                  <FormField label="Минут"><input value={gameEditor.estimatedMinutes} onChange={(event) => onGameFieldChange('estimatedMinutes', event.target.value)} /></FormField>
                  <FormField label="Лейбл"><input value={gameEditor.thumbnailLabel} onChange={(event) => onGameFieldChange('thumbnailLabel', event.target.value)} /></FormField>
                </div>
                <FormField label="Сипаттамасы"><textarea value={gameEditor.description} onChange={(event) => onGameFieldChange('description', event.target.value)} rows={3} /></FormField>
                <FormField label="Нұсқасы"><textarea value={gameEditor.instructions} onChange={(event) => onGameFieldChange('instructions', event.target.value)} rows={4} /></FormField>
                <FormField label="JSON мазмұны"><textarea value={gameEditor.contentJson} onChange={(event) => onGameFieldChange('contentJson', event.target.value)} rows={16} /></FormField>
                <div className="toggle-row">
                  <label className="toggle-card"><input type="checkbox" checked={gameEditor.published} onChange={(event) => onGameFieldChange('published', event.target.checked)} /><span>Көрінеді</span></label>
                  <label className="toggle-card"><input type="checkbox" checked={gameEditor.featured} onChange={(event) => onGameFieldChange('featured', event.target.checked)} /><span>Ерекше</span></label>
                </div>
              </>
            ) : (
              <>
                <div className="field-grid">
                  <FormField label="Slug"><input value={selectedGame.slug ?? ''} readOnly /></FormField>
                  <FormField label="Түрі"><input value={selectedGame.gameType ?? ''} readOnly /></FormField>
                  <FormField label="Қиындығы"><input value={selectedGame.difficulty ?? ''} readOnly /></FormField>
                  <FormField label="Сыйлығы"><input value={selectedGame.rewardPoints ?? 0} readOnly /></FormField>
                  <FormField label="Минут"><input value={selectedGame.estimatedMinutes ?? 0} readOnly /></FormField>
                  <FormField label="Күйі"><input value={selectedGame.published ? 'көрінеді' : 'жасырылған'} readOnly /></FormField>
                </div>

                <FormField label="Сипаттамасы">
                  <textarea value={selectedGame.description ?? ''} readOnly rows={3} />
                </FormField>
                <FormField label="Нұсқауы">
                  <textarea value={selectedGame.instructions ?? ''} readOnly rows={4} />
                </FormField>

                <details className="details-card">
                  <summary>JSON мазмұнын көру</summary>
                  <pre className="code-block">{selectedGame.contentJson ?? ''}</pre>
                </details>

                <div className="cta-row">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      setGamesMode('edit');
                      onSelectGameToEdit(selectedGame);
                    }}
                  >
                    Өңдеу
                  </button>
                  <button
                    type="button"
                    className="secondary-btn"
                    disabled={busyKey === `toggle-game-${selectedGame.id}`}
                    onClick={() => onToggleGamePublished(selectedGame)}
                  >
                    {selectedGame.published ? 'Жасыру' : 'Көрсету'}
                  </button>
                </div>
              </>
            )}
          </article>
        </div>
      ) : null}
    </section>
  );
}

export function AdminCourseBuilderPage(props) {
  const {
    user,
    adminData,
    loading,
    busyKey,
    courseEditor,
    editingCourseId,
    onOpenAdminDashboard,
    onResetCourse,
    onCourseFieldChange,
    onLessonFieldChange,
    onLessonBlockFieldChange,
    onAddLessonBlock,
    onRemoveLessonBlock,
    onAddLesson,
    onRemoveLesson,
    onQuizFieldChange,
    onAddQuiz,
    onRemoveQuiz,
    onQuestionFieldChange,
    onAddQuestion,
    onRemoveQuestion,
    onOptionFieldChange,
    onSetCorrectOption,
    onAddOption,
    onRemoveOption,
    onSaveCourse,
    onDeleteCourse,
    onNavigate,
  } = props;

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);
  }, [editingCourseId]);

  if (!user) {
    return (
      <GatePanel
        title="Админ панелі"
        text="Курс конструкторын ашу үшін администратор ретінде кіріңіз."
        actionLabel="Кіру"
        onAction={() => onNavigate('auth')}
      />
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <GatePanel
        title="Жеткіліксіз құқық"
        text="Бұл бетке тек әкімші кіре алады."
        actionLabel="Кабинетке өту"
        onAction={() => onNavigate('dashboard')}
      />
    );
  }

  if (loading || !adminData.overview) {
    return <LoadingPanel title="Админ деректері жүктелуде" />;
  }

  const steps = [
    { id: 'base', label: 'Негізгі' },
    { id: 'lessons', label: 'Сабақтар' },
    { id: 'quizzes', label: 'Тесттер' },
    { id: 'preview', label: 'Шолу' },
  ];

  const step = steps[stepIndex]?.id ?? 'base';
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  return (
    <section className="page-stack">
      <div className="section-shell academy-head">
        <div>
          <span className="eyebrow">Admin • Курс конструкторы</span>
          <h1 className="page-title">
            {editingCourseId ? 'Курсты өңдеу' : 'Жаңа курс құру'}
          </h1>
          <p className="page-copy">
            Қадамдармен жүріңіз: негізгі ақпарат, сабақ блоктары, тест сұрақтары, соңында шолу және сақтау.
          </p>
        </div>
        <div className="cta-row">
          <button type="button" className="secondary-btn" onClick={onOpenAdminDashboard}>
            Артқа
          </button>
          <button type="button" className="secondary-btn" onClick={onResetCourse}>
            Жаңа форма
          </button>
          {editingCourseId ? (
            <button
              type="button"
              className="secondary-btn danger-btn"
              onClick={() => onDeleteCourse(editingCourseId)}
            >
              Өшіру
            </button>
          ) : null}
          <button
            type="button"
            className="primary-btn"
            disabled={busyKey === 'save-course'}
            onClick={onSaveCourse}
          >
            {editingCourseId ? 'Сақтау' : 'Құру'}
          </button>
        </div>
      </div>

      <div className="wizard-steps" role="tablist" aria-label="Курс құру қадамдары">
        {steps.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === stepIndex}
            className={`wizard-step ${index === stepIndex ? 'is-active' : ''}`}
            onClick={() => setStepIndex(index)}
          >
            {index + 1}. {item.label}
          </button>
        ))}
      </div>

      {step === 'base' ? (
        <article className="feature-panel editor-panel course-builder-panel">
          <SectionHeading eyebrow="1-қадам" title="Негізгі ақпарат" description="Курс карточкасы мен жалпы параметрлері." />
          <div className="field-grid">
            <FormField label="Slug">
              <input value={courseEditor.slug} onChange={(event) => onCourseFieldChange('slug', event.target.value)} />
            </FormField>
            <FormField label="Атауы">
              <input value={courseEditor.title} onChange={(event) => onCourseFieldChange('title', event.target.value)} />
            </FormField>
            <FormField label="Субтақырып">
              <input value={courseEditor.subtitle} onChange={(event) => onCourseFieldChange('subtitle', event.target.value)} />
            </FormField>
            <FormField label="Санаты">
              <input value={courseEditor.category} onChange={(event) => onCourseFieldChange('category', event.target.value)} />
            </FormField>
            <FormField label="Деңгейі">
              <input value={courseEditor.level} onChange={(event) => onCourseFieldChange('level', event.target.value)} />
            </FormField>
            <FormField label="Акцент түсі">
              <input value={courseEditor.accentColor} onChange={(event) => onCourseFieldChange('accentColor', event.target.value)} />
            </FormField>
            <FormField label="Cover tag">
              <input value={courseEditor.coverTag} onChange={(event) => onCourseFieldChange('coverTag', event.target.value)} />
            </FormField>
            <FormField label="Минут">
              <input value={courseEditor.estimatedMinutes} onChange={(event) => onCourseFieldChange('estimatedMinutes', event.target.value)} />
            </FormField>
            <FormField label="Sort order">
              <input value={courseEditor.sortOrder} onChange={(event) => onCourseFieldChange('sortOrder', event.target.value)} />
            </FormField>
          </div>
          <FormField label="Қысқаша сипаттама">
            <textarea value={courseEditor.description} onChange={(event) => onCourseFieldChange('description', event.target.value)} rows={3} />
          </FormField>
          <FormField label="Толық сипаттама">
            <textarea value={courseEditor.longDescription} onChange={(event) => onCourseFieldChange('longDescription', event.target.value)} rows={6} />
          </FormField>
          <div className="toggle-row">
            <label className="toggle-card">
              <input type="checkbox" checked={courseEditor.published} onChange={(event) => onCourseFieldChange('published', event.target.checked)} />
              <span>Жарияланды</span>
            </label>
            <label className="toggle-card">
              <input type="checkbox" checked={courseEditor.featured} onChange={(event) => onCourseFieldChange('featured', event.target.checked)} />
              <span>Ерекше</span>
            </label>
          </div>
        </article>
      ) : null}

      {step === 'lessons' ? (
        <article className="feature-panel editor-panel course-builder-panel">
          <SectionHeading eyebrow="2-қадам" title="Сабақтар" description="Сабақтар және блоктар: видео, мәтін." />
          <div className="cta-row">
            <button type="button" className="secondary-btn" onClick={onAddLesson}>
              Сабақ қосу
            </button>
          </div>

          <div className="nested-stack">
            {courseEditor.lessons.map((lesson, lessonIndex) => (
              <article key={`lesson-${lessonIndex}`} className="nested-card">
                <div className="nested-card-head">
                  <h3>Сабақ {lessonIndex + 1}</h3>
                  <div className="mini-actions">
                    <button type="button" className="secondary-btn" onClick={() => onAddLessonBlock(lessonIndex, 'video')}>
                      Видео блок
                    </button>
                    <button type="button" className="secondary-btn" onClick={() => onAddLessonBlock(lessonIndex, 'text')}>
                      Мәтін блок
                    </button>
                    <button type="button" className="secondary-btn danger-btn" onClick={() => onRemoveLesson(lessonIndex)}>
                      Сабақты өшіру
                    </button>
                  </div>
                </div>

                <div className="field-grid">
                  <FormField label="Атауы">
                    <input value={lesson.title} onChange={(event) => onLessonFieldChange(lessonIndex, 'title', event.target.value)} />
                  </FormField>
                  <FormField label="Позициясы">
                    <input value={lesson.position} onChange={(event) => onLessonFieldChange(lessonIndex, 'position', event.target.value)} />
                  </FormField>
                  <FormField label="Тексеру тізімі">
                    <input value={lesson.safetyChecklist} onChange={(event) => onLessonFieldChange(lessonIndex, 'safetyChecklist', event.target.value)} />
                  </FormField>
                </div>

                <FormField label="Сипаттамасы">
                  <textarea value={lesson.summary} onChange={(event) => onLessonFieldChange(lessonIndex, 'summary', event.target.value)} rows={3} />
                </FormField>

                <div className="nested-stack">
                  {(lesson.blocks ?? []).map((block, blockIndex) => (
                    <article key={`block-${lessonIndex}-${blockIndex}`} className="nested-card nested-block-card">
                      <div className="nested-card-head">
                        <strong>{block.type === 'video' ? 'Видео блок' : 'Мәтін блок'} #{blockIndex + 1}</strong>
                        <button type="button" className="secondary-btn danger-btn" onClick={() => onRemoveLessonBlock(lessonIndex, blockIndex)}>
                          Блокты өшіру
                        </button>
                      </div>

                      <div className="field-grid">
                        <FormField label="Позициясы">
                          <input value={block.position} onChange={(event) => onLessonBlockFieldChange(lessonIndex, blockIndex, 'position', event.target.value)} />
                        </FormField>
                        <FormField label="Heading">
                          <input value={block.heading} onChange={(event) => onLessonBlockFieldChange(lessonIndex, blockIndex, 'heading', event.target.value)} />
                        </FormField>
                      </div>

                      {block.type === 'video' ? (
                        <div className="field-grid">
                          <FormField label="Video title">
                            <input value={block.videoTitle} onChange={(event) => onLessonBlockFieldChange(lessonIndex, blockIndex, 'videoTitle', event.target.value)} />
                          </FormField>
                          <FormField label="Video URL">
                            <input value={block.videoUrl} onChange={(event) => onLessonBlockFieldChange(lessonIndex, blockIndex, 'videoUrl', event.target.value)} />
                          </FormField>
                          <FormField label="Duration">
                            <input value={block.duration} onChange={(event) => onLessonBlockFieldChange(lessonIndex, blockIndex, 'duration', event.target.value)} />
                          </FormField>
                        </div>
                      ) : (
                        <FormField label="Body">
                          <textarea value={block.body} onChange={(event) => onLessonBlockFieldChange(lessonIndex, blockIndex, 'body', event.target.value)} rows={4} />
                        </FormField>
                      )}
                    </article>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </article>
      ) : null}

      {step === 'quizzes' ? (
        <article className="feature-panel editor-panel course-builder-panel">
          <SectionHeading eyebrow="3-қадам" title="Тесттер" description="Тесттер, сұрақтар және жауап нұсқалары." />
          <div className="cta-row">
            <button type="button" className="secondary-btn" onClick={onAddQuiz}>
              Тест қосу
            </button>
          </div>

          <div className="nested-stack">
            {courseEditor.quizzes.map((quiz, quizIndex) => (
              <article key={`quiz-${quizIndex}`} className="nested-card nested-quiz-card">
                <div className="nested-card-head">
                  <h3>Тест {quizIndex + 1}</h3>
                  <button type="button" className="secondary-btn danger-btn" onClick={() => onRemoveQuiz(quizIndex)}>
                    Тестті өшіру
                  </button>
                </div>

                <div className="field-grid">
                  <FormField label="Атауы">
                    <input value={quiz.title} onChange={(event) => onQuizFieldChange(quizIndex, 'title', event.target.value)} />
                  </FormField>
                  <FormField label="Позициясы">
                    <input value={quiz.position} onChange={(event) => onQuizFieldChange(quizIndex, 'position', event.target.value)} />
                  </FormField>
                  <FormField label="Өту %">
                    <input value={quiz.passingScore} onChange={(event) => onQuizFieldChange(quizIndex, 'passingScore', event.target.value)} />
                  </FormField>
                </div>
                <FormField label="Сипаттамасы">
                  <textarea value={quiz.description} onChange={(event) => onQuizFieldChange(quizIndex, 'description', event.target.value)} rows={3} />
                </FormField>

                <div className="quiz-question-grid">
                  {quiz.questions.map((question, questionIndex) => (
                    <article key={`question-${quizIndex}-${questionIndex}`} className="question-editor">
                      <div className="nested-card-head">
                        <strong>Сұрақ {questionIndex + 1}</strong>
                        <button type="button" className="secondary-btn danger-btn" onClick={() => onRemoveQuestion(quizIndex, questionIndex)}>
                          Өшіру
                        </button>
                      </div>

                      <div className="field-grid">
                        <FormField label="Позициясы">
                          <input value={question.position} onChange={(event) => onQuestionFieldChange(quizIndex, questionIndex, 'position', event.target.value)} />
                        </FormField>
                      </div>
                      <FormField label="Сұрақ мәтіні">
                        <textarea value={question.prompt} onChange={(event) => onQuestionFieldChange(quizIndex, questionIndex, 'prompt', event.target.value)} rows={2} />
                      </FormField>
                      <FormField label="Түсініктемесі">
                        <textarea value={question.explanation} onChange={(event) => onQuestionFieldChange(quizIndex, questionIndex, 'explanation', event.target.value)} rows={2} />
                      </FormField>

                      <div className="option-grid">
                        {question.options.map((option, optionIndex) => (
                          <article key={`option-${quizIndex}-${questionIndex}-${optionIndex}`} className="option-editor">
                            <label className="option-correct-toggle">
                              <input
                                type="radio"
                                name={`correct-${quizIndex}-${questionIndex}`}
                                checked={option.correct}
                                onChange={() => onSetCorrectOption(quizIndex, questionIndex, optionIndex)}
                              />
                              <span>Дұрыс</span>
                            </label>
                            <textarea
                              value={option.text}
                              onChange={(event) => onOptionFieldChange(quizIndex, questionIndex, optionIndex, 'text', event.target.value)}
                              rows={2}
                            />
                            <button type="button" className="secondary-btn" onClick={() => onRemoveOption(quizIndex, questionIndex, optionIndex)}>
                              Нұсқаны өшіру
                            </button>
                          </article>
                        ))}
                      </div>

                      <div className="cta-row">
                        <button type="button" className="secondary-btn" onClick={() => onAddOption(quizIndex, questionIndex)}>
                          Нұсқа қосу
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="cta-row">
                  <button type="button" className="secondary-btn" onClick={() => onAddQuestion(quizIndex)}>
                    Сұрақ қосу
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>
      ) : null}

      {step === 'preview' ? (
        <article className="feature-panel editor-panel course-builder-panel">
          <SectionHeading eyebrow="4-қадам" title="Шолу" description="Сақтауға кететін payload." />
          <pre className="code-block">
            {JSON.stringify(serializeCourseForm(courseEditor), null, 2)}
          </pre>
        </article>
      ) : null}

      <div className="cta-row wizard-nav">
        <button
          type="button"
          className="secondary-btn"
          disabled={isFirst}
          onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
        >
          Артқа
        </button>
        <button
          type="button"
          className="secondary-btn"
          disabled={isLast}
          onClick={() => setStepIndex((value) => Math.min(steps.length - 1, value + 1))}
        >
          Келесі қадам
        </button>
      </div>
    </section>
  );
}
