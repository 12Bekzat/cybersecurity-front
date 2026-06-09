import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import "./App.css";
import {
  TOKEN_KEY,
  USER_KEY,
  NAV_ITEMS,
  apiRequest,
  courseToForm,
  createAdminState,
  createEmptyCourseForm,
  createEmptyGameForm,
  createEmptyLessonBlock,
  createStudentState,
  createPublicState,
  gameToForm,
  getRouteFromHash,
  navigateToRoute,
  numberValue,
  safeJsonParse,
  safeParseStoredUser,
  serializeCourseForm,
  serializeGameForm,
} from "./appData";
import {
  localizeAdminState,
  localizeDashboard,
  localizePublicState,
  localizeStudentState,
  localizeUserSummary,
  normalizeRole,
  translateApiMessage,
} from "./contentLocalization";
import {
  AcademyPage,
  AdminCourseBuilderPage,
  AdminPage,
  AuthPage,
  DashboardPage,
  GamesPage,
  HomePage,
} from "./pageViews";

function App() {
  const [route, setRoute] = useState(getRouteFromHash());
  const [token, setToken] = useState(
    () => window.localStorage.getItem(TOKEN_KEY) ?? "",
  );
  const [user, setUser] = useState(() =>
    localizeUserSummary(safeParseStoredUser()),
  );
  const [publicData, setPublicData] = useState(createPublicState);
  const [studentData, setStudentData] = useState(createStudentState);
  const [adminData, setAdminData] = useState(createAdminState);
  const [publicLoading, setPublicLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [busyKey, setBusyKey] = useState("");
  const [notice, setNotice] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedLessonIds, setSelectedLessonIds] = useState({});
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [quizDrafts, setQuizDrafts] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [courseSearch, setCourseSearch] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    fullName: "",
    age: 10,
    city: "Қызылорда",
    gradeLevel: "4Б",
  });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseEditor, setCourseEditor] = useState(createEmptyCourseForm);
  const [editingGameId, setEditingGameId] = useState(null);
  const [gameEditor, setGameEditor] = useState(createEmptyGameForm);

  const deferredCourseSearch = useDeferredValue(courseSearch);
  const deferredAdminSearch = useDeferredValue(adminSearch);
  const routeSegments = route.split("/").filter(Boolean);
  const routeRoot = routeSegments[0] ?? "home";
  const isAcademyRoute = routeRoot === "academy";
  const academyRouteCourseId =
    routeSegments[1] === "course" ? numberValue(routeSegments[2], null) : null;
  const academyRouteLessonId =
    routeSegments[3] === "lesson" ? numberValue(routeSegments[4], null) : null;
  const academyRouteQuizId =
    routeSegments[3] === "quiz" ? numberValue(routeSegments[4], null) : null;
  const isAdminRoute = routeRoot === "admin";
  const adminView = !isAdminRoute
    ? "dashboard"
    : routeSegments[1] === "course-builder"
      ? "builder"
      : "dashboard";
  const adminBuilderCourseId =
    adminView === "builder" ? numberValue(routeSegments[2], null) : null;
  const academyView = !isAcademyRoute
    ? "catalog"
    : routeSegments[1] === "course" && academyRouteCourseId
      ? routeSegments[3] === "lesson" && academyRouteLessonId
        ? "lesson"
        : routeSegments[3] === "quiz" && academyRouteQuizId
          ? "quiz"
          : "course"
      : "catalog";

  const userRole = normalizeRole(user?.role);
  const isStudent = userRole === "STUDENT";
  const isAdmin = userRole === "ADMIN";
  const academyCourses = isStudent ? studentData.courses : publicData.courses;
  const gameCatalog = isStudent ? studentData.games : publicData.games;
  const headerNavItems = NAV_ITEMS.filter((item) =>
    item.id === "admin" ? isAdmin : item.id !== "auth",
  );
  const footerNavItems = NAV_ITEMS.filter((item) =>
    item.id === "admin" ? isAdmin : true,
  );
  const currentYear = new Date().getFullYear();

  const filteredAcademyCourses = academyCourses.filter((course) => {
    const searchValue = deferredCourseSearch.trim().toLowerCase();
    if (!searchValue) {
      return true;
    }

    return [course.title, course.subtitle, course.category, course.level]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchValue);
  });

  const fallbackCourse = filteredAcademyCourses[0] ?? academyCourses[0] ?? null;
  const selectedCourse =
    academyCourses.find(
      (course) => course.id === (academyRouteCourseId ?? selectedCourseId),
    ) ?? fallbackCourse;
  const sortedSelectedLessons = selectedCourse?.lessons
    ? [...selectedCourse.lessons].sort(
        (left, right) => (left.position ?? 0) - (right.position ?? 0),
      )
    : [];
  const sortedSelectedQuizzes = selectedCourse?.quizzes
    ? [...selectedCourse.quizzes].sort(
        (left, right) => (left.position ?? 0) - (right.position ?? 0),
      )
    : [];
  const selectedLesson =
    sortedSelectedLessons.find(
      (lesson) =>
        lesson.id ===
        (academyRouteLessonId ?? selectedLessonIds[selectedCourse?.id]),
    ) ??
    sortedSelectedLessons[0] ??
    null;
  const selectedQuiz =
    sortedSelectedQuizzes.find((quiz) => quiz.id === academyRouteQuizId) ??
    sortedSelectedQuizzes[0] ??
    null;
  const selectedGame =
    gameCatalog.find((game) => game.id === selectedGameId) ??
    gameCatalog[0] ??
    null;

  const filteredAdminUsers = adminData.users.filter((member) => {
    const searchValue = deferredAdminSearch.trim().toLowerCase();
    if (!searchValue) {
      return true;
    }

    return [member.username, member.fullName, member.city, member.role]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchValue);
  });

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setNotice(null), 4800);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setPublicLoading(true);
      try {
        const [courseCards, courses, games] = await Promise.all([
          apiRequest("/api/public/courses/cards"),
          apiRequest("/api/public/courses"),
          apiRequest("/api/public/games"),
        ]);

        if (!cancelled) {
          startTransition(() => {
            setPublicData(localizePublicState({ courseCards, courses, games }));
            setPublicLoading(false);
          });
        }
      } catch (error) {
        if (!cancelled) {
          setPublicLoading(false);
          setNotice({
            tone: "warning",
            text: translateApiMessage(error.message),
          });
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedCourse && filteredAcademyCourses.length) {
      setSelectedCourseId(filteredAcademyCourses[0].id);
    }
  }, [filteredAcademyCourses, selectedCourse]);

  useEffect(() => {
    if (!selectedGame && gameCatalog.length) {
      setSelectedGameId(gameCatalog[0].id);
    }
  }, [gameCatalog, selectedGame]);

  useEffect(() => {
    if (!isAdminRoute || adminView !== "builder" || !adminBuilderCourseId) {
      return;
    }

    const courseToEdit = adminData.courses.find(
      (course) => course.id === adminBuilderCourseId,
    );
    if (courseToEdit && editingCourseId !== courseToEdit.id) {
      setEditingCourseId(courseToEdit.id);
      setCourseEditor(courseToForm(courseToEdit));
    }
  }, [
    adminBuilderCourseId,
    adminData.courses,
    adminView,
    editingCourseId,
    isAdminRoute,
  ]);

  useEffect(() => {
    if (academyRouteCourseId && selectedCourseId !== academyRouteCourseId) {
      setSelectedCourseId(academyRouteCourseId);
    }
  }, [academyRouteCourseId, selectedCourseId]);

  useEffect(() => {
    if (
      !selectedCourse ||
      !academyRouteLessonId ||
      selectedLessonIds[selectedCourse.id] === academyRouteLessonId
    ) {
      return;
    }

    setSelectedLessonIds((state) => ({
      ...state,
      [selectedCourse.id]: academyRouteLessonId,
    }));
  }, [academyRouteLessonId, selectedCourse, selectedLessonIds]);

  function openPage(nextRoute) {
    const resolvedRoute =
      nextRoute === "auth" && user
        ? isAdmin
          ? "admin"
          : "dashboard"
        : nextRoute;
    navigateToRoute(resolvedRoute);
    setRoute(resolvedRoute);
  }

  function isRouteActive(itemId) {
    return routeRoot === itemId;
  }

  function openAcademyCatalog() {
    openPage("academy");
  }

  function openAcademyCourse(courseId) {
    setSelectedCourseId(courseId);
    openPage(`academy/course/${courseId}`);
  }

  function openAcademyLesson(courseId, lessonId) {
    setSelectedCourseId(courseId);
    setSelectedLessonIds((state) => ({ ...state, [courseId]: lessonId }));
    openPage(`academy/course/${courseId}/lesson/${lessonId}`);
  }

  function openAcademyQuiz(courseId, quizId) {
    setSelectedCourseId(courseId);
    openPage(`academy/course/${courseId}/quiz/${quizId}`);
  }

  function openAdminDashboard() {
    openPage("admin");
  }

  function openAdminCourseBuilder(course = null) {
    if (course) {
      setEditingCourseId(course.id);
      setCourseEditor(courseToForm(course));
      openPage(`admin/course-builder/${course.id}`);
      return;
    }

    setEditingCourseId(null);
    setCourseEditor(createEmptyCourseForm());
    openPage("admin/course-builder");
  }

  function persistUser(nextUser) {
    const localizedUser = localizeUserSummary(nextUser);
    setUser(localizedUser);
    window.localStorage.setItem(USER_KEY, JSON.stringify(localizedUser));
  }

  function persistSession(authResponse) {
    setToken(authResponse.token);
    window.localStorage.setItem(TOKEN_KEY, authResponse.token);
    persistUser(authResponse.user);
  }

  function clearSession() {
    setToken("");
    setUser(null);
    setStudentData(createStudentState());
    setAdminData(createAdminState());
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }

  const syncSession = useEffectEvent(
    async (sessionToken, currentUser = null) => {
      if (!sessionToken) {
        return;
      }

      setSessionLoading(true);

      try {
        const baseUser =
          currentUser ??
          (await apiRequest("/api/auth/me", { token: sessionToken }));
        persistUser(baseUser);

        if (normalizeRole(baseUser.role) === "ADMIN") {
          const [bootstrap] = await Promise.all([
            apiRequest("/api/admin/bootstrap", { token: sessionToken }),
          ]);
          persistUser(baseUser);
          startTransition(() => {
            setAdminData(localizeAdminState(bootstrap));
            setStudentData(createStudentState());
          });
          if (route === "auth") {
            openPage("admin");
          }
        } else {
          const [dashboard, courses, games] = await Promise.all([
            apiRequest("/api/student/dashboard", { token: sessionToken }),
            apiRequest("/api/student/courses", { token: sessionToken }),
            apiRequest("/api/student/games", { token: sessionToken }),
          ]);
          persistUser(localizeDashboard(dashboard).user);
          startTransition(() => {
            setStudentData(localizeStudentState({ dashboard, courses, games }));
            setAdminData(createAdminState());
          });
          if (route === "auth" || route === "admin") {
            openPage("dashboard");
          }
        }
      } catch (error) {
        clearSession();
        setNotice({
          tone: "warning",
          text: `Сессия жаңартылды: ${translateApiMessage(error.message)}`,
        });
      } finally {
        setSessionLoading(false);
      }
    },
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    syncSession(token, user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!user || routeRoot !== "auth") {
      return;
    }

    const redirectRoute = isAdmin ? "admin" : "dashboard";
    navigateToRoute(redirectRoute);
    setRoute(redirectRoute);
  }, [isAdmin, routeRoot, user]);

  async function withNotice(action, successText) {
    try {
      await action();
      if (successText) {
        setNotice({ tone: "success", text: successText });
      }
    } catch (error) {
      setNotice({ tone: "warning", text: translateApiMessage(error.message) });
    }
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setBusyKey("login");
    await withNotice(async () => {
      const authResponse = await apiRequest("/api/auth/login", {
        method: "POST",
        body: loginForm,
      });
      persistSession(authResponse);
      await syncSession(authResponse.token, authResponse.user);
    }, "Жүйеге кіру сәтті аяқталды.");
    setBusyKey("");
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setBusyKey("register");
    await withNotice(async () => {
      const authResponse = await apiRequest("/api/auth/register", {
        method: "POST",
        body: { ...registerForm, age: numberValue(registerForm.age, 10) },
      });
      persistSession(authResponse);
      await syncSession(authResponse.token, authResponse.user);
    }, "Профиль сәтті құрылды.");
    setBusyKey("");
  }

  async function refreshAfterStudentAction(messageBuilder) {
    await syncSession(token, user);
    if (messageBuilder) {
      setNotice(messageBuilder);
    }
  }

  async function handleEnroll(courseId) {
    if (!token) {
      openPage("auth");
      return;
    }

    setBusyKey(`enroll-${courseId}`);
    await withNotice(async () => {
      await apiRequest(`/api/student/courses/${courseId}/enroll`, {
        method: "POST",
        token,
      });
      await refreshAfterStudentAction({
        tone: "success",
        text: "Курс жеке оқу бағытыңа қосылды.",
      });
    });
    setBusyKey("");
  }

  async function handleCompleteLesson(lessonId) {
    if (!token) {
      openPage("auth");
      return;
    }

    setBusyKey(`lesson-${lessonId}`);
    await withNotice(async () => {
      const response = await apiRequest(
        `/api/student/lessons/${lessonId}/complete`,
        { method: "POST", token },
      );
      setNotice({
        tone: "success",
        text: `Сабақ аяқталды. +${response.earnedPoints} қауіпсіздік ұпайы қосылды.`,
      });

      // Update student data locally without full sync
      setStudentData((prevData) => ({
        ...prevData,
        courses: prevData.courses.map((course) => ({
          ...course,
          lessons: course.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, completed: true } : lesson,
          ),
          progressPercent: course.lessons.some((l) => l.id === lessonId)
            ? response.progressPercent
            : course.progressPercent,
        })),
      }));

      // Update user safe points
      setUser((prevUser) => ({
        ...prevUser,
        safePoints: (prevUser?.safePoints ?? 0) + response.earnedPoints,
      }));
    });
    setBusyKey("");
  }

  function updateQuizDraft(quizId, questionId, optionId) {
    console.log(quizId, questionId, optionId);
    
    setQuizDrafts((state) => ({
      ...state,
      [quizId]: {
        ...(state[quizId] ?? {}),
        [String(questionId)]: optionId,
      },
    }));
  }

  async function handleSubmitQuiz(quizId) {
    if (!token) {
      openPage("auth");
      return;
    }

    const selectedOptionIds = Object.values(quizDrafts[quizId] ?? {});
    if (!selectedOptionIds.length) {
      setNotice({
        tone: "warning",
        text: "Алдымен кемінде бір сұраққа жауап бер.",
      });
      return;
    }

    setBusyKey(`quiz-${quizId}`);
    await withNotice(async () => {
      const response = await apiRequest(
        `/api/student/quizzes/${quizId}/submit`,
        {
          method: "POST",
          token,
          body: { selectedOptionIds },
        },
      );
      setQuizResults((state) => ({ ...state, [quizId]: response }));

      // Update student data locally without full sync
      setStudentData((prevData) => ({
        ...prevData,
        courses: prevData.courses.map((course) => ({
          ...course,
          quizzes: course.quizzes.map((quiz) =>
            quiz.id === quizId
              ? {
                  ...quiz,
                  latestScore: response.score,
                  passed: response.passed,
                }
              : quiz,
          ),
          progressPercent: response.courseProgressPercent,
        })),
      }));

      // Update user safe points if test passed
      if (response.earnedPoints > 0) {
        setUser((prevUser) => ({
          ...prevUser,
          safePoints: (prevUser?.safePoints ?? 0) + response.earnedPoints,
        }));
      }

      setNotice({
        tone: response.passed ? "success" : "warning",
        text: response.passed
          ? `Тест сәтті өтті. +${response.earnedPoints} қауіпсіздік ұпайы қосылды.`
          : "Нәтиже сақталды. Қайтадан байқап көруге болады.",
      });

      // Clear quiz draft after submission
      setQuizDrafts((state) => ({
        ...state,
        [quizId]: {},
      }));
    });
    setBusyKey("");
  }

  async function handleCompleteGame(gameId, score, fallbackMessage) {
    if (!token) {
      setNotice({
        tone: "info",
        text: `${fallbackMessage}. Рекордты сақтау үшін аккаунтқа кір.`,
      });
      return;
    }

    setBusyKey(`game-${gameId}`);
    await withNotice(async () => {
      const response = await apiRequest(
        `/api/student/games/${gameId}/complete`,
        {
          method: "POST",
          token,
          body: { score },
        },
      );
      await syncSession(token, user);
      setNotice({
        tone: response.completed ? "success" : "info",
        text: `${translateApiMessage(response.message)} Ең үздік нәтиже: ${response.bestScore}.`,
      });
    });
    setBusyKey("");
  }

  async function refreshAdmin() {
    await syncSession(token, user);
  }

  function validateCourseBuilder() {
    if (!courseEditor.lessons.length) {
      throw new Error("Курсқа кемінде бір сабақ қос.");
    }

    courseEditor.lessons.forEach((lesson, lessonIndex) => {
      const blocks = lesson.blocks ?? [];
      if (!blocks.length) {
        throw new Error(`${lessonIndex + 1}-сабақта бірде-бір блок жоқ.`);
      }

      if (
        !blocks.some(
          (block) =>
            block.type === "video" && String(block.videoUrl ?? "").trim(),
        )
      ) {
        throw new Error(
          `${lessonIndex + 1}-сабақта кемінде бір бейне блок болуы керек.`,
        );
      }
    });

    if (!courseEditor.quizzes.length) {
      throw new Error("Курс соңында кемінде бір тест болуы керек.");
    }
  }

  async function saveCourse() {
    setBusyKey("save-course");
    await withNotice(
      async () => {
        validateCourseBuilder();
        await apiRequest(
          editingCourseId
            ? `/api/admin/courses/${editingCourseId}`
            : "/api/admin/courses",
          {
            method: editingCourseId ? "PUT" : "POST",
            token,
            body: serializeCourseForm(courseEditor),
          },
        );
        setEditingCourseId(null);
        setCourseEditor(createEmptyCourseForm());
        await refreshAdmin();
        openAdminDashboard();
      },
      editingCourseId ? "Курс жаңартылды." : "Жаңа курс құрылды.",
    );
    setBusyKey("");
  }

  async function deleteCourse(courseId) {
    if (
      !window.confirm(
        "Курсты сабақтарымен және тесттерімен бірге өшіру керек пе?",
      )
    ) {
      return;
    }
    setBusyKey(`delete-course-${courseId}`);
    await withNotice(async () => {
      await apiRequest(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
        token,
      });
      if (editingCourseId === courseId) {
        setEditingCourseId(null);
        setCourseEditor(createEmptyCourseForm());
        openAdminDashboard();
      }
      await refreshAdmin();
    }, "Курс өшірілді.");
    setBusyKey("");
  }

  async function saveGame() {
    setBusyKey("save-game");
    await withNotice(
      async () => {
        if (!safeJsonParse(gameEditor.contentJson, null)) {
          throw new Error("Ойынның JSON құрылымында қате бар.");
        }
        await apiRequest(
          editingGameId
            ? `/api/admin/games/${editingGameId}`
            : "/api/admin/games",
          {
            method: editingGameId ? "PUT" : "POST",
            token,
            body: serializeGameForm(gameEditor),
          },
        );
        setEditingGameId(null);
        setGameEditor(createEmptyGameForm(gameEditor.gameType));
        await refreshAdmin();
      },
      editingGameId ? "Ойын жаңартылды." : "Жаңа ойын құрылды.",
    );
    setBusyKey("");
  }

  async function deleteGame(gameId) {
    if (!window.confirm("Ойынды өшіру керек пе?")) {
      return;
    }
    setBusyKey(`delete-game-${gameId}`);
    await withNotice(async () => {
      await apiRequest(`/api/admin/games/${gameId}`, {
        method: "DELETE",
        token,
      });
      if (editingGameId === gameId) {
        setEditingGameId(null);
        setGameEditor(createEmptyGameForm());
      }
      await refreshAdmin();
    }, "Ойын өшірілді.");
    setBusyKey("");
  }

  async function toggleGamePublished(game) {
    if (!game?.id) {
      return;
    }

    const nextPublished = !Boolean(game.published);
    setBusyKey(`toggle-game-${game.id}`);
    await withNotice(async () => {
      await apiRequest(`/api/admin/games/${game.id}`, {
        method: "PUT",
        token,
        body: serializeGameForm({ ...gameToForm(game), published: nextPublished }),
      });
      await refreshAdmin();
    }, nextPublished ? "Ойын көрсетіледі." : "Ойын жасырылды.");
    setBusyKey("");
  }

  async function updateUserRole(userId, role) {
    setBusyKey(`role-${userId}`);
    await withNotice(async () => {
      await apiRequest(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        token,
        body: { role },
      });
      await refreshAdmin();
    }, "Пайдаланушының рөлі жаңартылды.");
    setBusyKey("");
  }

  async function deleteUser(userId) {
    if (
      !window.confirm(
        "Пайдаланушыны және оған байланысты деректерді өшіру керек пе?",
      )
    ) {
      return;
    }
    setBusyKey(`delete-user-${userId}`);
    await withNotice(async () => {
      await apiRequest(`/api/admin/users/${userId}`, {
        method: "DELETE",
        token,
      });
      if (user?.id === userId) {
        clearSession();
        openPage("home");
        return;
      }
      await refreshAdmin();
    }, "Пайдаланушы өшірілді.");
    setBusyKey("");
  }

  function logout() {
    clearSession();
    setNotice({ tone: "info", text: "Сессия аяқталды." });
    openPage("home");
  }

  function updateCourseField(field, value) {
    setCourseEditor((state) => ({ ...state, [field]: value }));
  }

  function updateLessonField(index, field, value) {
    setCourseEditor((state) => ({
      ...state,
      lessons: state.lessons.map((lesson, currentIndex) =>
        currentIndex === index ? { ...lesson, [field]: value } : lesson,
      ),
    }));
  }

  function updateLessonBlockField(lessonIndex, blockIndex, field, value) {
    setCourseEditor((state) => ({
      ...state,
      lessons: state.lessons.map((lesson, currentLessonIndex) =>
        currentLessonIndex === lessonIndex
          ? {
              ...lesson,
              blocks: (lesson.blocks ?? []).map((block, currentBlockIndex) =>
                currentBlockIndex === blockIndex
                  ? { ...block, [field]: value }
                  : block,
              ),
            }
          : lesson,
      ),
    }));
  }

  function addLessonBlock(lessonIndex, type) {
    setCourseEditor((state) => ({
      ...state,
      lessons: state.lessons.map((lesson, currentLessonIndex) =>
        currentLessonIndex === lessonIndex
          ? {
              ...lesson,
              blocks: [
                ...(lesson.blocks ?? []),
                {
                  ...createEmptyLessonBlock(
                    type,
                    (lesson.blocks?.length ?? 0) + 1,
                  ),
                  heading:
                    type === "video" ? "Жаңа бейне блок" : "Жаңа мәтіндік блок",
                  videoTitle: type === "video" ? "Жаңа бейне блок" : "",
                },
              ],
            }
          : lesson,
      ),
    }));
  }

  function removeLessonBlock(lessonIndex, blockIndex) {
    setCourseEditor((state) => ({
      ...state,
      lessons: state.lessons.map((lesson, currentLessonIndex) =>
        currentLessonIndex === lessonIndex
          ? {
              ...lesson,
              blocks:
                (lesson.blocks ?? []).length <= 1
                  ? lesson.blocks
                  : lesson.blocks.filter(
                      (_, currentBlockIndex) =>
                        currentBlockIndex !== blockIndex,
                    ),
            }
          : lesson,
      ),
    }));
  }

  function addLesson() {
    setCourseEditor((state) => ({
      ...state,
      lessons: [
        ...state.lessons,
        {
          ...createEmptyCourseForm().lessons[0],
          position: state.lessons.length + 1,
        },
      ],
    }));
  }

  function removeLesson(index) {
    setCourseEditor((state) => ({
      ...state,
      lessons:
        state.lessons.length === 1
          ? state.lessons
          : state.lessons.filter((_, currentIndex) => currentIndex !== index),
    }));
  }

  function updateQuizField(index, field, value) {
    setCourseEditor((state) => ({
      ...state,
      quizzes: state.quizzes.map((quiz, currentIndex) =>
        currentIndex === index ? { ...quiz, [field]: value } : quiz,
      ),
    }));
  }

  function addQuiz() {
    setCourseEditor((state) => ({
      ...state,
      quizzes: [
        ...state.quizzes,
        {
          ...createEmptyCourseForm().quizzes[0],
          position: state.quizzes.length + 1,
        },
      ],
    }));
  }

  function removeQuiz(index) {
    setCourseEditor((state) => ({
      ...state,
      quizzes:
        state.quizzes.length === 1
          ? state.quizzes
          : state.quizzes.filter((_, currentIndex) => currentIndex !== index),
    }));
  }

  function updateQuestionField(quizIndex, questionIndex, field, value) {
    setCourseEditor((state) => ({
      ...state,
      quizzes: state.quizzes.map((quiz, currentQuizIndex) =>
        currentQuizIndex === quizIndex
          ? {
              ...quiz,
              questions: quiz.questions.map((question, currentQuestionIndex) =>
                currentQuestionIndex === questionIndex
                  ? { ...question, [field]: value }
                  : question,
              ),
            }
          : quiz,
      ),
    }));
  }

  function addQuestion(quizIndex) {
    setCourseEditor((state) => ({
      ...state,
      quizzes: state.quizzes.map((quiz, currentQuizIndex) =>
        currentQuizIndex === quizIndex
          ? {
              ...quiz,
              questions: [
                ...quiz.questions,
                {
                  ...createEmptyCourseForm().quizzes[0].questions[0],
                  position: quiz.questions.length + 1,
                },
              ],
            }
          : quiz,
      ),
    }));
  }

  function removeQuestion(quizIndex, questionIndex) {
    setCourseEditor((state) => ({
      ...state,
      quizzes: state.quizzes.map((quiz, currentQuizIndex) =>
        currentQuizIndex === quizIndex
          ? {
              ...quiz,
              questions:
                quiz.questions.length === 1
                  ? quiz.questions
                  : quiz.questions.filter(
                      (_, index) => index !== questionIndex,
                    ),
            }
          : quiz,
      ),
    }));
  }

  function updateOptionField(
    quizIndex,
    questionIndex,
    optionIndex,
    field,
    value,
  ) {
    setCourseEditor((state) => ({
      ...state,
      quizzes: state.quizzes.map((quiz, currentQuizIndex) =>
        currentQuizIndex === quizIndex
          ? {
              ...quiz,
              questions: quiz.questions.map((question, currentQuestionIndex) =>
                currentQuestionIndex === questionIndex
                  ? {
                      ...question,
                      options: question.options.map(
                        (option, currentOptionIndex) =>
                          currentOptionIndex === optionIndex
                            ? { ...option, [field]: value }
                            : option,
                      ),
                    }
                  : question,
              ),
            }
          : quiz,
      ),
    }));
  }

  function setCorrectOption(quizIndex, questionIndex, optionIndex) {
    setCourseEditor((state) => ({
      ...state,
      quizzes: state.quizzes.map((quiz, currentQuizIndex) =>
        currentQuizIndex === quizIndex
          ? {
              ...quiz,
              questions: quiz.questions.map((question, currentQuestionIndex) =>
                currentQuestionIndex === questionIndex
                  ? {
                      ...question,
                      options: question.options.map(
                        (option, currentOptionIndex) => ({
                          ...option,
                          correct: currentOptionIndex === optionIndex,
                        }),
                      ),
                    }
                  : question,
              ),
            }
          : quiz,
      ),
    }));
  }

  function addOption(quizIndex, questionIndex) {
    setCourseEditor((state) => ({
      ...state,
      quizzes: state.quizzes.map((quiz, currentQuizIndex) =>
        currentQuizIndex === quizIndex
          ? {
              ...quiz,
              questions: quiz.questions.map((question, currentQuestionIndex) =>
                currentQuestionIndex === questionIndex
                  ? {
                      ...question,
                      options: [
                        ...question.options,
                        { text: "", correct: false },
                      ],
                    }
                  : question,
              ),
            }
          : quiz,
      ),
    }));
  }

  function removeOption(quizIndex, questionIndex, optionIndex) {
    setCourseEditor((state) => ({
      ...state,
      quizzes: state.quizzes.map((quiz, currentQuizIndex) =>
        currentQuizIndex === quizIndex
          ? {
              ...quiz,
              questions: quiz.questions.map((question, currentQuestionIndex) =>
                currentQuestionIndex === questionIndex
                  ? {
                      ...question,
                      options:
                        question.options.length <= 2
                          ? question.options
                          : question.options.filter(
                              (_, index) => index !== optionIndex,
                            ),
                    }
                  : question,
              ),
            }
          : quiz,
      ),
    }));
  }

  function updateGameField(field, value) {
    setGameEditor((state) => ({ ...state, [field]: value }));
  }

  return (
    <div className="app-shell">
      <div className="bg-grid" />
      <div className="bg-splash bg-splash-one" />
      <div className="bg-splash bg-splash-two" />
      <div className="bg-splash bg-splash-three" />

      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => openPage("home")}
        >
          <span className="brand-mark">Q</span>
          <span>
            <strong>Qalqan Kids</strong>
            <small>
              Цифрлық қауіпсіздік пен кибербуллингтен қорғану платформасы
            </small>
          </span>
        </button>

        <nav className="nav-pills" aria-label="Негізгі навигация">
          {headerNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-pill ${isRouteActive(item.id) ? "is-active" : ""}`}
              onClick={() => openPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <div className="mini-user">
                <strong>{user.fullName}</strong>
                <span>
                  {isAdmin ? "Әкімші" : `${user.safePoints} қауіпсіздік ұпайы`}
                </span>
              </div>
              <button type="button" className="secondary-btn" onClick={logout}>
                Шығу
              </button>
            </>
          ) : (
            <button
              type="button"
              className="primary-btn"
              onClick={() => openPage("auth")}
            >
              Кіру
            </button>
          )}
        </div>
      </header>

      {notice ? (
        <aside className={`notice notice-${notice.tone}`} role="status">
          {notice.text}
        </aside>
      ) : null}

      <main className="main-content">
        {routeRoot === "home" ? (
          <HomePage
            user={user}
            publicLoading={publicLoading}
            publicData={publicData}
            onNavigate={openPage}
          />
        ) : null}
        {isAcademyRoute ? (
          <AcademyPage
            user={user}
            loading={publicLoading || sessionLoading}
            courses={filteredAcademyCourses}
            selectedCourse={selectedCourse}
            selectedLesson={selectedLesson}
            selectedQuiz={selectedQuiz}
            quizDrafts={quizDrafts}
            quizResults={quizResults}
            busyKey={busyKey}
            courseSearch={courseSearch}
            academyView={academyView}
            onCourseSearchChange={setCourseSearch}
            onOpenCatalog={openAcademyCatalog}
            onOpenCourse={openAcademyCourse}
            onOpenLesson={openAcademyLesson}
            onOpenQuiz={openAcademyQuiz}
            onEnroll={handleEnroll}
            onCompleteLesson={handleCompleteLesson}
            onSelectQuizOption={updateQuizDraft}
            onSubmitQuiz={handleSubmitQuiz}
            onNavigate={openPage}
          />
        ) : null}
        {routeRoot === "games" ? (
          <GamesPage
            user={user}
            loading={publicLoading || sessionLoading}
            games={gameCatalog}
            selectedGame={selectedGame}
            selectedGameId={selectedGameId}
            busyKey={busyKey}
            onSelectGame={setSelectedGameId}
            onCompleteGame={handleCompleteGame}
            onNavigate={openPage}
          />
        ) : null}
        {routeRoot === "dashboard" ? (
          <DashboardPage
            user={user}
            loading={sessionLoading}
            dashboard={studentData.dashboard}
            onNavigate={openPage}
          />
        ) : null}
        {routeRoot === "admin" ? (
          adminView === "builder" ? (
            <AdminCourseBuilderPage
              user={user}
              adminData={adminData}
              loading={sessionLoading}
              busyKey={busyKey}
              courseEditor={courseEditor}
              editingCourseId={editingCourseId}
              onOpenAdminDashboard={openAdminDashboard}
              onResetCourse={() => {
                setEditingCourseId(null);
                setCourseEditor(createEmptyCourseForm());
                openAdminCourseBuilder();
              }}
              onCourseFieldChange={updateCourseField}
              onLessonFieldChange={updateLessonField}
              onLessonBlockFieldChange={updateLessonBlockField}
              onAddLessonBlock={addLessonBlock}
              onRemoveLessonBlock={removeLessonBlock}
              onAddLesson={addLesson}
              onRemoveLesson={removeLesson}
              onQuizFieldChange={updateQuizField}
              onAddQuiz={addQuiz}
              onRemoveQuiz={removeQuiz}
              onQuestionFieldChange={updateQuestionField}
              onAddQuestion={addQuestion}
              onRemoveQuestion={removeQuestion}
              onOptionFieldChange={updateOptionField}
              onSetCorrectOption={setCorrectOption}
              onAddOption={addOption}
              onRemoveOption={removeOption}
              onSaveCourse={saveCourse}
              onDeleteCourse={deleteCourse}
              onNavigate={openPage}
            />
          ) : (
            <AdminPage
              user={user}
              adminData={adminData}
              loading={sessionLoading}
              busyKey={busyKey}
              adminSearch={adminSearch}
              onAdminSearchChange={setAdminSearch}
              filteredUsers={filteredAdminUsers}
              editingGameId={editingGameId}
              gameEditor={gameEditor}
              onOpenCourseBuilder={openAdminCourseBuilder}
              onDeleteCourse={deleteCourse}
              onSelectGameToEdit={(game) => {
                setEditingGameId(game.id);
                setGameEditor(gameToForm(game));
              }}
              onResetGame={(type = gameEditor.gameType) => {
                setEditingGameId(null);
                setGameEditor(createEmptyGameForm(type));
              }}
              onGameFieldChange={updateGameField}
              onSaveGame={saveGame}
              onDeleteGame={deleteGame}
              onToggleGamePublished={toggleGamePublished}
              onUpdateUserRole={updateUserRole}
              onDeleteUser={deleteUser}
              onNavigate={openPage}
            />
          )
        ) : null}
        {routeRoot === "auth" ? (
          <AuthPage
            user={user}
            authMode={authMode}
            setAuthMode={setAuthMode}
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            busyKey={busyKey}
            onLoginSubmit={handleLoginSubmit}
            onRegisterSubmit={handleRegisterSubmit}
            onNavigate={openPage}
          />
        ) : null}
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand-block">
            <div className="footer-brand-row">
              <span className="brand-mark footer-mark">Q</span>
              <div>
                <strong>Qalqan Kids</strong>
                <p className="footer-copy">
                  Курстар, ойындар, бейнесабақтар және түсінікті жеке кабинет
                  ұсынатын қауіпсіз балалар платформасы.
                </p>
              </div>
            </div>
            <p className="footer-copy">
              Сайт балаларға цифрлық ортада сенімді жүруге, ал ересектерге оқу
              бағытын анық көруге көмектеседі.
            </p>
          </div>

          <div className="footer-column">
            <span className="footer-title">Бөлімдер</span>
            <div className="footer-links">
              {footerNavItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`footer-link ${isRouteActive(item.id) ? "is-active" : ""}`}
                  onClick={() => openPage(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <span className="footer-title">Егер қауіпті болса</span>
            <div className="footer-note-list">
              <div className="footer-note-card">
                Жағымсыз хат алмасудың скриншотын сақта.
              </div>
              <div className="footer-note-card">
                Жеке деректер мен кодтарды жіберме.
              </div>
              <div className="footer-note-card">
                Жағдайды бірден ересекке көрсет.
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {currentYear} Qalqan Kids</span>
          <span>
            Балаларға, отбасыға және мектепке арналған цифрлық қауіпсіздік.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
