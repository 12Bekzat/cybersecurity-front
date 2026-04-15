export const API_BASE = process.env.REACT_APP_API_BASE ?? 'http://localhost:8080';
export const TOKEN_KEY = 'cyberkids-jwt';
export const USER_KEY = 'cyberkids-user';

export const NAV_ITEMS = [
  { id: 'home', label: 'Басты бет' },
  { id: 'academy', label: 'Академия' },
  { id: 'games', label: 'Ойындар' },
  { id: 'dashboard', label: 'Кабинет' },
  { id: 'admin', label: 'Әкімші' },
  { id: 'auth', label: 'Кіру' },
];

export const DEMO_ACCOUNTS = [];
/* Demo account credentials are stored in front/.env.local and front/.env.example.
    title: 'Ученик',
    username: process.env.REACT_APP_DEMO_STUDENT_USERNAME,
    password: process.env.REACT_APP_DEMO_STUDENT_PASSWORD,
    note: 'Готовый профиль с прогрессом, уроками и играми.',
  },
  {
    title: 'Администратор',
    username: process.env.REACT_APP_DEMO_ADMIN_USERNAME,
    password: process.env.REACT_APP_DEMO_ADMIN_PASSWORD,
    note: 'Полный доступ к сущностям, курсам, тестам и пользователям.',
  },
*/

export const HOME_MISSIONS = [
  'Буллинг пен жалған хабарламаны тануды үйрену.',
  'Жеке деректер мен құпиясөзді қорғау.',
  'Ойындар, тесттер және бейнесабақтар арқылы жаттығу.',
];

export const SAFETY_PROMISES = [
  {
    title: 'Сабырлы тіл',
    text: 'Платформа баланы қорқытпайды, керісінше қарапайым қадамдарға үйретеді: тоқта, тексер, ересектен сұра.',
  },
  {
    title: 'Қысқа сабақтар',
    text: 'Әр модуль бейне, тәжірибе және шағын тесті бар қысқа бөліктерге бөлінген.',
  },
  {
    title: 'Көрінетін прогресс',
    text: 'Қауіпсіздік ұпайлары, ойын тренажерлары және оқу бағыты қызығушылықты сақтауға көмектеседі.',
  },
];

export const SUPPORT_ACTIONS = [
  {
    title: 'Чатта ренжітсе',
    steps: ['Сол агрессиямен жауап берме.', 'Скриншот жасап сақта.', 'Бұғатта.', 'Хатты ересекке көрсет.'],
  },
  {
    title: 'Жеке дерек сұраса',
    steps: ['Мекенжайды, құжат фотосын және SMS кодты жіберме.', 'Кім жазып тұрғанын тексер.', 'Әңгімені тоқтат.', 'Ересекке айт.'],
  },
  {
    title: 'Күмәнді сілтеме келсе',
    steps: ['Бірден баспа.', 'Жіберушіні тексер.', 'Шынымен сол адам екенін нақтыла.', 'Тек тексергеннен кейін ғана аш.'],
  },
];

const INBOX_DEFENDER_TEMPLATE = {
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
    {
      id: 'r4',
      fromName: 'Сынып жетекшісі',
      fromEmail: 'teacher@school.kz',
      timeLabel: '14:05',
      subject: 'Үй тапсырмасы: бейне және қысқа сұрақ',
      body: 'Сәлем! Бүгінгі сабаққа бейнені қарап кел. Сұрақтарың болса, ертең талқылаймыз.',
      linkText: 'LMS бейне',
      linkUrl: 'https://lms.school.kz/video/42',
      isPhish: false,
      clues: [
        { id: 'same-domain', text: 'Мектеп жүйесі домені', isSuspicious: false },
        { id: 'no-codes', text: 'Код/құпиясөз сұрамайды', isSuspicious: false },
        { id: 'normal-task', text: 'Тапсырма қалыпты', isSuspicious: false },
        { id: 'no-pressure', text: 'Қысым жоқ', isSuspicious: false },
      ],
      explain: 'Мектеп домені, қалыпты тапсырма және құпия дерек сұрамауы қауіпсіз.',
    },
    {
      id: 'r5',
      fromName: 'Мессенджер әкімшілігі',
      fromEmail: 'security@messanger-support.com',
      timeLabel: '18:40',
      subject: 'Сенің профилің тексерісте',
      body: 'Профильді сақтау үшін SMS-кодты осында жібер. Әйтпесе аккаунт өшіріледі.',
      linkText: 'Қолдау чаты',
      linkUrl: 'https://messanger-support.com/chat',
      isPhish: true,
      clues: [
        { id: 'sms', text: 'SMS-код сұрайды', isSuspicious: true },
        { id: 'delete', text: 'Қорқытады: "өшіріледі"', isSuspicious: true },
        { id: 'odd-name', text: 'Бренд атауы түсініксіз/қате', isSuspicious: true },
        { id: 'support-domain', text: 'Ресми емес қолдау домені', isSuspicious: true },
      ],
      explain: 'SMS-код ешқашан жіберілмейді. Қорқыту және ресми емес домен қауіпті.',
    },
    {
      id: 'r6',
      fromName: 'Досың Айдана',
      fromEmail: 'aidana@kidsmail.kz',
      timeLabel: '20:15',
      subject: 'Ертең ойын ойнаймыз ба?',
      body: 'Сәлем! Ертең мектептен кейін ойнаймыз ба? Егер келсең, маған жаз.',
      linkText: '',
      linkUrl: '',
      isPhish: false,
      clues: [
        { id: 'known', text: 'Жіберуші таныс', isSuspicious: false },
        { id: 'no-links', text: 'Күмәнді сілтеме жоқ', isSuspicious: false },
        { id: 'no-secrets', text: 'Құпия дерек сұрамайды', isSuspicious: false },
        { id: 'friendly', text: 'Тілі достық', isSuspicious: false },
      ],
      explain: 'Таныс адам, құпия дерек сұрамайды және сілтеме жоқ.',
    },
  ],
};

export function createStudentState() {
  return {
    dashboard: null,
    courses: [],
    games: [],
  };
}

export function createAdminState() {
  return {
    overview: null,
    users: [],
    courses: [],
    games: [],
  };
}

export function createPublicState() {
  return {
    courseCards: [],
    courses: [],
    games: [],
  };
}

export const DEFAULT_LESSON_VIDEO_URL = 'https://www.youtube-nocookie.com/embed/DE5xKaf4E9E';
export const LESSON_BLOCKS_VERSION = 'lesson-blocks-v1';

export function createEmptyLessonBlock(type = 'text', position = 1) {
  if (type === 'video') {
    return {
      type: 'video',
      heading: '',
      body: '',
      videoTitle: '',
      videoUrl: DEFAULT_LESSON_VIDEO_URL,
      duration: '05:00',
      position,
    };
  }

  return {
    type: 'text',
    heading: '',
    body: '',
    videoTitle: '',
    videoUrl: '',
    duration: '',
    position,
  };
}

export function normalizeLessonBlocks(blocks = []) {
  return sortByPosition(blocks)
    .filter((block) => {
      if (block.type === 'video') {
        return String(block.videoUrl ?? '').trim();
      }

      return String(block.heading ?? '').trim() || String(block.body ?? '').trim();
    })
    .map((block, index) => ({
      type: block.type === 'video' ? 'video' : 'text',
      heading: block.heading ?? '',
      body: block.body ?? '',
      videoTitle: block.videoTitle ?? '',
      videoUrl: block.videoUrl ?? '',
      duration: block.duration ?? '',
      position: numberValue(block.position, index + 1),
    }));
}

export function serializeLessonBlocks(blocks = []) {
  return JSON.stringify(
    {
      version: LESSON_BLOCKS_VERSION,
      blocks: normalizeLessonBlocks(blocks),
    },
    null,
    2
  );
}

export function getLessonBlocks(lesson = {}) {
  const parsedContent = safeJsonParse(lesson.content, null);
  if (parsedContent?.version === LESSON_BLOCKS_VERSION && Array.isArray(parsedContent.blocks)) {
    return normalizeLessonBlocks(parsedContent.blocks);
  }

  const fallbackBlocks = [];

  if (lesson.videoUrl) {
    fallbackBlocks.push({
      ...createEmptyLessonBlock('video', 1),
      heading: lesson.videoTitle ?? '',
      videoTitle: lesson.videoTitle ?? '',
      videoUrl: lesson.videoUrl,
      duration: lesson.duration ?? '05:00',
    });
  }

  if (lesson.content) {
    fallbackBlocks.push({
      ...createEmptyLessonBlock('text', fallbackBlocks.length + 1),
      heading: 'Қысқаша мазмұн',
      body: lesson.content,
    });
  }

  return fallbackBlocks.length
    ? fallbackBlocks
    : [
        { ...createEmptyLessonBlock('video', 1), heading: 'Сабақтың бейнесі', videoTitle: 'Сабақтың бейнесі' },
        { ...createEmptyLessonBlock('text', 2), heading: 'Негізгі ой' },
      ];
}

export function createEmptyLesson(position = 1) {
  return {
    title: '',
    summary: '',
    content: '',
    videoTitle: '',
    videoUrl: DEFAULT_LESSON_VIDEO_URL,
    duration: '05:00',
    lessonType: 'video',
    safetyChecklist: '',
    position,
    blocks: [
      { ...createEmptyLessonBlock('video', 1), heading: 'Сабақтың бейнесі', videoTitle: 'Сабақтың бейнесі' },
      { ...createEmptyLessonBlock('text', 2), heading: 'Есте сақтайтын негізгі ой' },
    ],
  };
}

export function createEmptyOption(correct = false) {
  return {
    text: '',
    correct,
  };
}

export function createEmptyQuestion(position = 1) {
  return {
    prompt: '',
    explanation: '',
    position,
    options: [createEmptyOption(true), createEmptyOption(false), createEmptyOption(false)],
  };
}

export function createEmptyQuiz(position = 1) {
  return {
    title: '',
    description: '',
    passingScore: 70,
    position,
    questions: [createEmptyQuestion(1)],
  };
}

export function createEmptyCourseForm() {
  return {
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    longDescription: '',
    level: 'Бастапқы деңгей',
    category: 'Цифрлық қауіпсіздік',
    accentColor: '#ff9f6b',
    coverTag: 'shield',
    estimatedMinutes: 45,
    published: true,
    featured: false,
    sortOrder: 1,
    lessons: [createEmptyLesson(1)],
    quizzes: [createEmptyQuiz(1)],
  };
}

export function buildGameTemplate(type) {
  return INBOX_DEFENDER_TEMPLATE;
}

export function createEmptyGameForm(type = 'inbox-defender') {
  return {
    slug: 'inbox-defender',
    title: 'Пошта қалқаны',
    description: '',
    instructions: 'Хатты оқы, күдікті белгілерді тап, сосын "Қауіпсіз" немесе "Фишинг" деп таңда.',
    gameType: 'inbox-defender',
    difficulty: 'Орташа',
    accentColor: '#1d67de',
    rewardPoints: 50,
    estimatedMinutes: 6,
    thumbnailLabel: 'MAIL',
    contentJson: JSON.stringify(buildGameTemplate(type), null, 2),
    published: true,
    featured: true,
  };
}

export function sortByPosition(items = []) {
  return [...items].sort((left, right) => (left.position ?? 0) - (right.position ?? 0));
}

export function safeParseStoredUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(USER_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
}

export function getRouteFromHash() {
  if (typeof window === 'undefined') {
    return 'home';
  }

  const cleaned = window.location.hash.replace('#/', '').replace('#', '').trim();
  return cleaned || 'home';
}

export function navigateToRoute(route) {
  if (typeof window === 'undefined') {
    return;
  }

  window.location.hash = route === 'home' ? '' : `#/${route}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function numberValue(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function courseToForm(course) {
  return {
    slug: course.slug ?? '',
    title: course.title ?? '',
    subtitle: course.subtitle ?? '',
    description: course.description ?? '',
    longDescription: course.longDescription ?? '',
    level: course.level ?? 'Бастапқы деңгей',
    category: course.category ?? 'Цифрлық қауіпсіздік',
    accentColor: course.accentColor ?? '#ff9f6b',
    coverTag: course.coverTag ?? 'shield',
    estimatedMinutes: course.estimatedMinutes ?? 45,
    published: Boolean(course.published),
    featured: Boolean(course.featured),
    sortOrder: course.sortOrder ?? 1,
    lessons: sortByPosition(course.lessons).map((lesson, index) => ({
      title: lesson.title ?? '',
      summary: lesson.summary ?? '',
      content: lesson.content ?? '',
      videoTitle: lesson.videoTitle ?? '',
      videoUrl: lesson.videoUrl ?? '',
      duration: lesson.duration ?? '05:00',
      lessonType: lesson.lessonType ?? 'video',
      safetyChecklist: lesson.safetyChecklist ?? '',
      position: lesson.position ?? index + 1,
      blocks: getLessonBlocks(lesson),
    })),
    quizzes: sortByPosition(course.quizzes).map((quiz, quizIndex) => ({
      title: quiz.title ?? '',
      description: quiz.description ?? '',
      passingScore: quiz.passingScore ?? 70,
      position: quiz.position ?? quizIndex + 1,
      questions: sortByPosition(quiz.questions).map((question, questionIndex) => ({
        prompt: question.prompt ?? '',
        explanation: question.explanation ?? '',
        position: question.position ?? questionIndex + 1,
        options: (question.options ?? []).map((option) => ({
          text: option.text ?? '',
          correct: Boolean(option.correct),
        })),
      })),
    })),
  };
}

export function gameToForm(game) {
  return {
    slug: game.slug ?? '',
    title: game.title ?? '',
    description: game.description ?? '',
    instructions: game.instructions ?? '',
    gameType: game.gameType ?? 'inbox-defender',
    difficulty: game.difficulty ?? 'Орташа',
    accentColor: game.accentColor ?? '#ffb341',
    rewardPoints: game.rewardPoints ?? 50,
    estimatedMinutes: game.estimatedMinutes ?? 6,
    thumbnailLabel: game.thumbnailLabel ?? 'PLAY',
    contentJson: game.contentJson ?? JSON.stringify(buildGameTemplate('inbox-defender'), null, 2),
    published: game.published ?? true,
    featured: Boolean(game.featured),
  };
}

export function serializeCourseForm(form) {
  return {
    slug: form.slug,
    title: form.title,
    subtitle: form.subtitle,
    description: form.description,
    longDescription: form.longDescription,
    level: form.level,
    category: form.category,
    accentColor: form.accentColor,
    coverTag: form.coverTag,
    estimatedMinutes: numberValue(form.estimatedMinutes, 45),
    published: Boolean(form.published),
    featured: Boolean(form.featured),
    sortOrder: numberValue(form.sortOrder, 1),
    lessons: sortByPosition(form.lessons).map((lesson, index) => {
      const blocks = normalizeLessonBlocks(lesson.blocks ?? getLessonBlocks(lesson));
      const firstVideoBlock = blocks.find((block) => block.type === 'video') ?? createEmptyLessonBlock('video', 1);
      const firstTextBlock = blocks.find((block) => block.type === 'text');
      const summary = String(lesson.summary ?? '').trim() || String(firstTextBlock?.body ?? '').trim().slice(0, 500) || lesson.title;

      return {
        title: lesson.title,
        summary,
        content: serializeLessonBlocks(blocks),
        videoTitle: String(firstVideoBlock.videoTitle ?? firstVideoBlock.heading ?? lesson.title).trim() || lesson.title,
        videoUrl: String(firstVideoBlock.videoUrl ?? '').trim() || DEFAULT_LESSON_VIDEO_URL,
        duration: String(firstVideoBlock.duration ?? lesson.duration ?? '05:00').trim() || '05:00',
        lessonType: blocks.some((block) => block.type === 'video') ? 'video' : 'text',
        safetyChecklist: String(lesson.safetyChecklist ?? '').trim() || 'Тоқта, тексер, ересектен сұра.',
        position: numberValue(lesson.position, index + 1),
      };
    }),
    quizzes: sortByPosition(form.quizzes).map((quiz, quizIndex) => ({
      title: quiz.title,
      description: quiz.description,
      passingScore: numberValue(quiz.passingScore, 70),
      position: numberValue(quiz.position, quizIndex + 1),
      questions: sortByPosition(quiz.questions).map((question, questionIndex) => ({
        prompt: question.prompt,
        explanation: question.explanation,
        position: numberValue(question.position, questionIndex + 1),
        options: question.options.map((option) => ({
          text: option.text,
          correct: Boolean(option.correct),
        })),
      })),
    })),
  };
}

export function serializeGameForm(form) {
  return {
    slug: form.slug,
    title: form.title,
    description: form.description,
    instructions: form.instructions,
    gameType: form.gameType,
    difficulty: form.difficulty,
    accentColor: form.accentColor,
    rewardPoints: numberValue(form.rewardPoints, 50),
    estimatedMinutes: numberValue(form.estimatedMinutes, 6),
    thumbnailLabel: form.thumbnailLabel,
    contentJson: form.contentJson,
    published: Boolean(form.published),
    featured: Boolean(form.featured),
  };
}

export function safeJsonParse(rawValue, fallback = null) {
  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return fallback;
  }
}

export async function apiRequest(path, options = {}) {
  const { token, method = 'GET', body } = options;
  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const rawText = await response.text();
  const contentType = response.headers.get('content-type') ?? '';
  const payload = rawText ? (contentType.includes('application/json') ? JSON.parse(rawText) : rawText) : null;

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && (payload.message || payload.error)) ||
      (typeof payload === 'string' && payload) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}
