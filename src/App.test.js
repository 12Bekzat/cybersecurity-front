import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

function jsonResponse(data) {
  return Promise.resolve({
    ok: true,
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: {
      get: () => 'application/json',
    },
  });
}

beforeEach(() => {
  window.location.hash = '';
  window.localStorage.clear();
  window.scrollTo = jest.fn();

  global.fetch = jest.fn((url) => {
    if (String(url).includes('/api/public/courses/cards')) {
      return jsonResponse([
        {
          id: 1,
          slug: 'cyber-shield-basics',
          title: 'Киберщит новичка',
          subtitle: 'Первый безопасный маршрут',
          description: 'Основы цифровой защиты',
          level: 'Starter',
          category: 'Безопасность',
          accentColor: '#ff9f6b',
          coverTag: 'shield',
          estimatedMinutes: 42,
          lessonCount: 3,
          quizCount: 1,
          progressPercent: 0,
          featured: true,
        },
      ]);
    }

    if (String(url).includes('/api/public/courses')) {
      return jsonResponse([
        {
          id: 1,
          slug: 'cyber-shield-basics',
          title: 'Киберщит новичка',
          subtitle: 'Первый безопасный маршрут',
          description: 'Основы цифровой защиты',
          longDescription: 'Полный курс по цифровой безопасности для детей.',
          level: 'Starter',
          category: 'Безопасность',
          accentColor: '#ff9f6b',
          coverTag: 'shield',
          estimatedMinutes: 42,
          progressPercent: 0,
          featured: true,
          lessons: [
            {
              id: 11,
              title: 'Пароли без паники',
              summary: 'Как создавать надежные пароли.',
              content: 'Урок о сильных паролях.',
              videoTitle: 'Video',
              videoUrl: 'https://www.youtube-nocookie.com/embed/DE5xKaf4E9E',
              duration: '04:10',
              lessonType: 'video',
              safetyChecklist: 'Не делись паролем.',
              position: 1,
              completed: false,
            },
          ],
          quizzes: [
            {
              id: 21,
              title: 'Проверка паролей',
              description: 'Мини-тест по уроку.',
              passingScore: 70,
              position: 1,
              questions: [
                {
                  id: 31,
                  prompt: 'Какой пароль лучше?',
                  explanation: 'Длинная пароль-фраза надежнее.',
                  position: 1,
                  options: [
                    { id: 41, text: '123456' },
                    { id: 42, text: 'Moon-Fox-Lime-29' },
                  ],
                },
              ],
            },
          ],
        },
      ]);
    }

    if (String(url).includes('/api/public/games')) {
      return jsonResponse([
        {
          id: 1,
          slug: 'inbox-defender',
          title: 'Пошта қалқаны',
          description: 'Хаттарды оқып, фишинг белгілерін тап.',
          instructions: 'Күдікті белгілерді белгіле де, соңында дұрыс шешім қабылда.',
          gameType: 'inbox-defender',
          difficulty: 'Средний',
          accentColor: '#ffb341',
          rewardPoints: 55,
          estimatedMinutes: 6,
          thumbnailLabel: 'MAIL',
          contentJson: JSON.stringify({
            version: 'inbox-defender-v1',
            rounds: [
              {
                id: 'r1',
                fromName: 'Ойын қолдауы',
                fromEmail: 'support@game-prizes.ru',
                timeLabel: '10:02',
                subject: 'Сен жеңдің! Сыйлығыңды алу үшін кір',
                body: 'Тезірек кіріп, аккаунтыңды раста.',
                linkText: 'Сыйлықты алу',
                linkUrl: 'http://game-prizes.ru/login?bonus=1',
                isPhish: true,
                clues: [
                  { id: 'weird-domain', text: 'Бейтаныс домен', isSuspicious: true },
                  { id: 'rush', text: 'Асықтырады', isSuspicious: true },
                  { id: 'gift', text: 'Тегін сыйлық уәде етеді', isSuspicious: true },
                  { id: 'no-secret', text: 'Құпиясөз сұрамайды', isSuspicious: false },
                ],
                explain: 'Бейтаныс домен және асықтыру қауіпті белгі.',
              },
            ],
          }),
          published: true,
          featured: true,
          bestScore: 0,
          completed: false,
        },
      ]);
    }

    return jsonResponse({});
  });
});

test('supports direct nested academy lesson routes', async () => {
  window.location.hash = '#/academy/course/1/lesson/11';

  render(<App />);

  expect(await screen.findByLabelText('Academy breadcrumbs')).toBeInTheDocument();
  expect(await screen.findByTitle('Video')).toBeInTheDocument();
});

test('renders the new landing hero and seeded course card', async () => {
  render(<App />);

  expect(
    await screen.findByRole('heading', {
      name: /Балаларға арналған цифрлық қауіпсіздік платформасы/i,
    })
  ).toBeInTheDocument();
  expect(await screen.findByText(/Дайын курстар/i)).toBeInTheDocument();
});

test('opens the auth page from navigation', async () => {
  render(<App />);

  fireEvent.click((await screen.findAllByRole('button', { name: /Кіру/i }))[0]);

  expect(await screen.findByRole('heading', { name: /Өз қауіпсіз оқу бағытыңа кір/i })).toBeInTheDocument();
  expect(screen.getByText(/JWT арқылы кіру және тіркелу/i)).toBeInTheDocument();
});

test('opens life scenario game from the games page', async () => {
  render(<App />);

  fireEvent.click((await screen.findAllByRole('button', { name: /^Ойындар$/i }))[0]);

  expect(await screen.findByText(/Өмірлік сценарийлер/i)).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: /Қалай әрекет етесің/i })).toBeInTheDocument();
});
