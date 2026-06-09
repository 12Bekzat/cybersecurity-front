function parseJson(rawValue, fallback = null) {
  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return fallback;
  }
}

function stringifyJson(value) {
  return JSON.stringify(value, null, 2);
}

function mapByPosition(items = [], translations = []) {
  const translationMap = new Map(translations.map((item, index) => [item.position ?? index + 1, item]));
  return items.map((item, index) => ({ ...item, ...(translationMap.get(item.position ?? index + 1) ?? {}) }));
}

function localizeQuizQuestions(questions = [], translations = []) {
  const translationMap = new Map(translations.map((item, index) => [item.position ?? index + 1, item]));
  return questions.map((question, questionIndex) => {
    const translation = translationMap.get(question.position ?? questionIndex + 1);
    if (!translation) {
      return question;
    }

    const optionMap = new Map((translation.options ?? []).map((option, optionIndex) => [optionIndex, option]));
    return {
      ...question,
      prompt: translation.prompt ?? question.prompt,
      explanation: translation.explanation ?? question.explanation,
      options: (question.options ?? []).map((option, optionIndex) => ({
        ...option,
        ...(optionMap.get(optionIndex) ?? {}),
      })),
    };
  });
}

const COURSE_TRANSLATIONS = {
  'cyber-shield-basics': {
    title: 'Киберқалқанның алғашқы қадамдары',
    subtitle: '8-11 жастағы балаларға арналған қауіпсіз цифрлық бағыт',
    description: 'Курс мықты құпиясөз құруға, жеке деректерді қорғауға және күмәнді сілтемелерді танып білуге үйретеді.',
    longDescription:
      'Бұл бағыт цифрлық қауіпсіздікпен жұмсақ әрі түсінікті таныстырады. Оқушы алдымен аккаунтын қорғауды, кейін жеке деректерді бөліспеуді, содан соң қауіпті сілтемелер мен жалған уәделерді байқауды үйренеді.\n\nӘр сабақта қысқа бейне, нақты жағдайдың талдауы және қолдануға болатын әрекет жоспары бар. Біз қорқытпаймыз, керісінше күнделікті есте сақталатын қауіпсіз әдеттерді қалыптастырамыз.',
    level: 'Бастапқы деңгей',
    category: 'Негіздер',
    coverTag: 'Қалқан',
    lessons: [
      {
        position: 1,
        title: 'Құпиясөзді дұрыс құру',
        summary: 'Ұзақ әрі есте сақталатын құпиясөзді қалай ойлап табуға болатынын үйренеміз.',
        content:
          'Құпиясөзді бөлменің кілті сияқты елестет. Өте қарапайым кілтті көшіріп алу оңай, ал күрделірек кілт жақсырақ қорғайды.\n\nСенімді құпиясөз міндетті түрде түсініксіз таңбалар жиыны болмауы керек. Ең жақсысы 3-4 күтпеген сөзден тұратын құпиясөз сөйлемін құру, оған сан немесе белгі қосу. Мұндай нұсқаны есте сақтау жеңіл, ал табу әлдеқайда қиын.\n\nТағы бір маңызды ереже: бір құпиясөзді барлық сервисте қолданба. Бір жерде жария болып кетсе, басқа аккаунттарың да қауіпке ұшырайды.',
        safetyChecklist:
          '3-4 сөзден тұратын құпиясөз сөйлемін ойлап тап.\nАтыңды, туған күніңді және мектеп нөмірін қолданба.\nҚұпиясөзді чатта ешкімге жіберме.\nҚұпиясөз белгілі болып қалса, оны ересекпен бірге бірден ауыстыр.',
      },
      {
        position: 2,
        title: 'Жеке дерек сыйлық емес',
        summary: 'Қандай мәліметті бөгде адамға беруге болмайтынын және неліктен қауіпті екенін түсінеміз.',
        content:
          'Интернетте мекенжай, мектеп атауы, телефон нөмірі, құжаттың суреті немесе геолокация секілді ұсақ мәліметтердің өзі бірігіп, сен туралы толық сурет құрауы мүмкін.\n\nЖеке дерекке тек телефон мен мекенжай емес, мектеп рұқсат қағазы, сабақ кестесі, фото ішіндегі көрінетін белгілер де жатады. Алаяқтар дәл осындай ұсақ мәліметтерді жинауды ұнатады.\n\nКез келген нәрсені жіберер алдында өзіңе екі сұрақ қой: мұны көшедегі кез келген адамға көрсетер ме едім? Мұны сенетін ересек адам мақұлдар ма еді? Егер күмән болса, жіберме.',
        safetyChecklist:
          'Мекенжайды, телефон нөмірін және құжат фотосын жіберме.\nБейтаныс қосымшаларда геолокацияны өшір.\nФото жіберер алдында артық мәлімет көрініп тұрмағанын тексер.\nБіреу қысым жасаса, әңгімені тоқтатып, ересекке айт.',
      },
      {
        position: 3,
        title: 'Сілтемені баспас бұрын',
        summary: 'Күмәнді сілтемені ашпас бұрын кідіріп, тексеруді үйренеміз.',
        content:
          'Қауіпті сілтеме көбіне асықтырады: сыйлық ұсынады, бұғаттаймыз деп қорқытады немесе бірден басуды сұрайды. Алаяқтың мақсаты сені ойландырмай әрекет етуге итермелеу.\n\nҚауіпсіз әдет өте қарапайым: тоқта, тексер, сұра. Алдымен хабарламаның кімнен келгенін қара. Мәтінде оғаш қате, түсініксіз домен немесе артық қысым бар ма? Қажет болса, досыңнан не ересектен басқа арна арқылы нақтылап ал.\n\nЕгер сілтеме ашылып кетсе, ештеңе енгізбе, еш файл жүктеме және рұқсат берме. Бірден ересекке айт.',
        safetyChecklist:
          '«ШҰҒЫЛ» деген хабарламалардағы сілтемені бірден ашпа.\nЖіберушіні басқа арна арқылы тексер.\nБейтаныс сайтқа құпиясөз енгізбе.\nКүмән болса, ересек адамнан көмек сұра.',
      },
    ],
    quizzes: [
      {
        position: 1,
        title: 'Киберқалқанды тексеру',
        description: 'Құпиясөз, жеке дерек және сілтемелер туралы негізгі ережелерді қайталаймыз.',
        questions: [
          {
            position: 1,
            prompt: 'Қай құпиясөз қауіпсіздеу?',
            explanation: 'Ұзын құпиясөз сөйлемі қысқа әрі оңай сөздерден сенімдірек.',
            options: [
              { text: '12345678' },
              { text: 'Күн-Жапырақ-17-Ай' },
              { text: 'МеніңАтым' },
            ],
          },
          {
            position: 2,
            prompt: 'Бейтаныс адам мектеп рұқсат қағазының фотосын сұраса не істеу керек?',
            explanation: 'Құжаттар мен жеке деректерді бөгде адамға жіберуге болмайды.',
            options: [
              { text: 'Бірден жіберу' },
              { text: 'Ересекпен ақылдасып, жібермеу' },
              { text: 'Тек достарым көрсе болды деп жіберу' },
            ],
          },
          {
            position: 3,
            prompt: '«ҚАЗІР БАС!» деген сілтемеге қалай әрекет еткен дұрыс?',
            explanation: 'Цифрлық қауіпсіздікте асығыстықтан бұрын кідіріп, тексеру маңызды.',
            options: [
              { text: 'Бірден басу' },
              { text: 'Хабарламаны достарға тарату' },
              { text: 'Тоқтап, жіберушіні тексеру' },
            ],
          },
          {
            position: 4,
            prompt: 'Бір құпиясөзді барлық сервисте қолдануға бола ма?',
            explanation: 'Бір жерден жария болса, қалған аккаунттар да қауіпке түседі.',
            options: [
              { text: 'Жоқ, маңызды сервистерде бөлек құпиясөз болғаны дұрыс' },
              { text: 'Иә, егер ол ұзын болса жеткілікті' },
              { text: 'Тек ойындарға ғана болады' },
            ],
          },
        ],
      },
    ],
  },
  'stop-cyberbullying': {
    title: 'Кибербуллингті тоқтат',
    subtitle: 'Шекара, дәлел және көмек сұрау туралы практикалық курс',
    description: 'Курс онлайн әңгіме қауіпті жағдайға айналған сәтті тануға және сабырмен әрекет етуге үйретеді.',
    longDescription:
      'Кибербуллинг жай ғана дөрекілік емес. Ол қайталанатын қысым, кемсіту, қорқыту және біреуді күлкі етуге бағытталған әрекеттерден тұрады.\n\nБұл бағытта оқушы қарапайым жанжал мен кибербуллингтің айырмасын көреді, дәлел сақтауды, бос сөз таласына түспеуді және көмек тізбегін дұрыс құруды үйренеді: скриншот, бұғаттау, шағым, ересек адамның көмегі.',
    level: 'Негізгі деңгей',
    category: 'Кибербуллинг',
    coverTag: 'Қамқорлық',
    lessons: [
      {
        position: 1,
        title: 'Әзіл қашан шектен шығады?',
        summary: 'Кибербуллингтің негізгі белгілерін және қайталанатын қысымды байқауды үйренеміз.',
        content:
          'Бір реттік жағымсыз сөз де ауыр тиюі мүмкін, бірақ кибербуллинг көбіне қайта-қайта қайталанып, адамды әдейі қорлауға бағытталады. Егер сені үнемі мазақ етсе, қорлайтын мемдер жіберсе немесе басқаларды да қосса, бұл жай әзіл емес.\n\nЕң маңызды өлшем агрессордың сөзі емес, сенің жағдайың: өзіңді қауіпсіз сезінесің бе, әлде үрейленіп қаласың ба? Егер чаттан кейін мазасызданып, аккаунтты өшіргің келсе немесе мектепке барғың келмесе, бұл көмек сұрауға белгі.\n\nМәселені байқау әлсіздік емес. Керісінше, ол әрекетке көшуге мүмкіндік береді.',
        safetyChecklist:
          'Тек сөзге емес, оның қаншалықты жиі қайталанатынына қара.\nЧаттан кейін мазасыздансаң, оны маңызды белгі деп қабылда.\n«Бұл жай әзіл» деген сөзге бірден сенбе.\nСкриншотты кімге көрсететініңді алдын ала ойла.',
      },
      {
        position: 2,
        title: 'Скриншот, бұғаттау, шағым',
        summary: 'Агрессиядан кейінгі алғашқы минуттарда не істеу керегін қадамдап үйренеміз.',
        content:
          'Қатты сөз естігенде бірден жауап қайтарғың келуі мүмкін. Бірақ мұндай тартыс көбіне агрессорға тиімді. Қауіпсіз жоспар қысқа: скриншот жаса, бұғатта, шағым түсір, ересекке хабарла.\n\nСкриншот дәлелді сақтау үшін керек. Кейін хабарламалар өшіріліп қалса да, сенде факті қалады. Бұғаттау қысымды азайтады, ал шағым платформаға ереженің бұзылғанын көрсетеді.\n\nХатты бірден өшіріп тастама. Алдымен дәлелді сақтап ал.',
        safetyChecklist:
          'Алдымен скриншот жаса.\nАгрессорға сол тонда жауап берме.\nПлатформадағы шағым функциясын қолдан.\nСол күні ересек адамға көрсет.',
      },
      {
        position: 3,
        title: 'Досыңа қалай көмектесуге болады?',
        summary: 'Кибербуллингке куә болғанда қауіпсіз қолдау көрсету жолдарын үйренеміз.',
        content:
          'Егер досыңды ренжітіп жатқанын көрсең, үндемей қалу да жағдайға әсер етеді. Қысқа қолдау сөзінің өзі көп нәрсені өзгертеді.\n\nКөмек көрсету жалғыз батыр болу деген сөз емес. Ең қауіпсіз жол: досыңа жеке жазу, дәлелді бірге сақтау және ересек адамға бірге жүгіну.\n\nҚорлайтын материалды «дәлел үшін» деп әрі қарай таратуға болмайды. Бұл қысымды күшейтеді.',
        safetyChecklist:
          'Досыңа жеке қолдау білдір.\nҚорлайтын материалды қайта таратпа.\nЕресек адамға бірге баруды ұсын.\nКемсітетін жазбаға лайк та, пікір де қалдырма.',
      },
    ],
    quizzes: [
      {
        position: 1,
        title: 'Кибербуллингке қарсы әрекет',
        description: 'Қысым жағдайында қауіпсіз реакцияны таңдай алатыныңды тексереміз.',
        questions: [
          {
            position: 1,
            prompt: 'Қай жағдай кибербуллингке көбірек ұқсайды?',
            explanation: 'Қайталанатын кемсіту мен қысым жай жанжалдан әлдеқайда қауіпті.',
            options: [
              { text: 'Ойын ережесі жайлы бір реттік дау' },
              { text: 'Бір баланы үнемі мазақ ететін хабарламалар мен мемдер' },
              { text: 'Чаттағы дыбысты өшіруді сұрау' },
            ],
          },
          {
            position: 2,
            prompt: 'Чатта қорлағаннан кейінгі алғашқы қауіпсіз қадам қандай?',
            explanation: 'Ең әуелі дәлелді сақтау керек, ал сөз таласына араласпау маңызды.',
            options: [
              { text: 'Қаттырақ жауап беру' },
              { text: 'Скриншот жасап, бұғаттау' },
              { text: 'Хатты бірден өшіріп тастау' },
            ],
          },
          {
            position: 3,
            prompt: 'Досың кибербуллингті көрсе, не істегені дұрыс?',
            explanation: 'Қолдау мен ересекке жүгіну үндемей қалудан жақсырақ көмектеседі.',
            options: [
              { text: 'Жәбірленушіні қолдап, ересекке бірге бару' },
              { text: 'Ештеңе болмағандай үндемеу' },
              { text: 'Хатты бүкіл сыныпқа тарату' },
            ],
          },
          {
            position: 4,
            prompt: 'Неге хатты бірден өшірмеу керек?',
            explanation: 'Дәлелсіз агрессорды тоқтату қиындайды.',
            options: [
              { text: 'Скриншот дәлелді сақтап қалады' },
              { text: 'Чат әдемірек көрінеді' },
              { text: 'Қосымша рұқсат етпейді' },
            ],
          },
        ],
      },
    ],
  },
  'internet-detective': {
    title: 'Интернет-детектив',
    subtitle: 'Фейк, сыйлық-тұзақ және цифрлық ізді тануға арналған бағыт',
    description: 'Бұл курс жалған аккаунттарды, күмәнді сыйлықтарды және интернеттегі ізді байқап жүруге үйретеді.',
    longDescription:
      'Интернет жылтыр уәделерді жақсы көреді: сыйлық, жеңіс, сирек скин, құпия акция. Бірақ дәл осы тартымдылықтың артында алдау жатуы мүмкін.\n\nБұл бағытта оқушы жалған дос, фейк ұтыс және цифрлық із секілді сценарийлерді талдайды. Соңында тоқтау, дереккөзді тексеру және ештеңені асығыс жібермеу дағдыларын бекітеді.',
    level: 'Негізгі деңгей',
    category: 'Фейк пен фишинг',
    coverTag: 'Детектив',
    lessons: [
      {
        position: 1,
        title: 'Жалған дос',
        summary: 'Таныс адамның атын жамылған аккаунтты қалай тануға болатынын үйренеміз.',
        content:
          'Жалған аккаунт көбіне таныс адамның аты-жөнін, суретін және сөйлеу мәнерін көшіріп алады. Бірақ мұқият қарасаң, ұсақ айырмашылықтар байқалады: бос профиль, аз жазба, күмәнді тіркелу күні немесе бірден бірдеңе сұрауы.\n\nЕгер хабарлама досыңнан келгендей көрінсе де, оны басқа арна арқылы тексеруге болады. Нағыз дос сақтыққа ренжімейді.\n\nАватарға емес, тексеруге сен.',
        safetyChecklist:
          'Профильдің қашан ашылғанын және қаншалықты толтырылғанын қара.\nДосыңнан басқа байланыс арнасы арқылы нақтыла.\nРастау кодтарын ешкімге жіберме.\nТек таныс фотосы бар екеніне сеніп қалма.',
      },
      {
        position: 2,
        title: 'Тым жақсы сыйлыққа сенбе',
        summary: 'Тегін бонус, сирек скин және жалған ұтыс схемаларын танимыз.',
        content:
          '«Тегін» деген сөз абайлықты әлсіретіп, қызығушылықты күшейтеді. Егер біреу күмәнді сайтқа кіріп, аккаунтыңмен кіруді немесе форма толтыруды сұраса, бұл көбіне тұзақ болады.\n\nШынайы платформалар құпиясөзді кездейсоқ форма арқылы сұрамайды және «тек бес минут» деп асықтырмайды.\n\nКез келген тым жомарт ұсынысты ресми сайтпен салыстыр, домен атауын тексер және ересекпен ақылдас.',
        safetyChecklist:
          'Тексерілмеген сыйлыққа сақ бол.\nБонус үшін құпиясөз енгізбе.\nСілтемені ресми сайтпен салыстыр.\nСені асықтырса, бұл қауіпті белгі болуы мүмкін.',
      },
      {
        position: 3,
        title: 'Цифрлық із',
        summary: 'Жариялаған нәрсең интернетте ұзақ сақталуы мүмкін екенін түсінеміз.',
        content:
          'Фото, пікір, репост, лақап ат және лайктың бәрі цифрлық ізді құрайды. Пост өшірілсе де, біреу оның көшірмесін сақтап қалуы мүмкін.\n\nЦифрлық із тек қауіпсіздікке емес, беделге де әсер етеді. Сыпайы сөйлеу, шекараны құрметтеу және ұқыпты әрекет сен туралы жақсы әсер қалдырады.\n\nЖарияламас бұрын өзіңе сұрақ қой: бұл маған не басқа адамға зиян тигізбей ме?',
        safetyChecklist:
          'Постың уақыт өте қалай көрінетінін ойла.\nБасқа адамның суретін рұқсатсыз жариялама.\nЕресекке көрсетуге ұялатын нәрсені жүктеме.\nМақтануға болатын цифрлық із қалдыр.',
      },
    ],
    quizzes: [
      {
        position: 1,
        title: 'Интернет-детектив сынағы',
        description: 'Фейк пен цифрлық тәуекелдерді қаншалықты жақсы байқайтыныңды тексереміз.',
        questions: [
          {
            position: 1,
            prompt: 'Шынымен досың жазып тұрғанын қалай тексерген дұрыс?',
            explanation: 'Басқа арна арқылы нақтылау аватарға сене салудан қауіпсіз.',
            options: [
              { text: 'Тек аватарына қарап сену' },
              { text: 'Қоңырау шалу немесе басқа қосымшада жазу' },
              { text: 'Бірден код жіберу' },
            ],
          },
          {
            position: 2,
            prompt: 'Жалған ұтыстың ең жиі белгісі қандай?',
            explanation: 'Асықтыру мен құпиясөз сұрау қауіпті белгілердің бірі.',
            options: [
              { text: 'Ұзақ түсіндірме' },
              { text: '«2 минутта сыйлық ал, құпиясөзіңді енгіз» деген хабарлама' },
              { text: 'Ресми сайттағы хабарландыру' },
            ],
          },
          {
            position: 3,
            prompt: 'Цифрлық із деген не?',
            explanation: 'Бұл интернетте адам өзі туралы қалдыратын ақпараттың жиынтығы.',
            options: [
              { text: 'Тек электрондық пошта мекенжайы' },
              { text: 'Интернеттегі барлық жазба, пікір, фото және әрекет' },
              { text: 'Тек ойын никнеймі' },
            ],
          },
          {
            position: 4,
            prompt: 'Неге өзгенің фотосын рұқсатсыз жариялауға болмайды?',
            explanation: 'Бұл жеке шекараны бұзады және жанжал мен буллингке әкелуі мүмкін.',
            options: [
              { text: 'Себебі фото тез өшіп кетеді' },
              { text: 'Себебі бұл шекараны бұзады' },
              { text: 'Себебі лайк аз жиналады' },
            ],
          },
        ],
      },
    ],
  },
  'digital-leader-lab': {
    title: 'Цифрлық көшбасшы зертханасы',
    subtitle: 'Интернетте қауіпсіз орта құруға дайын жасөспірімдерге арналған курс',
    description: 'Бұл бағыт жекелік, сыпайы қарым-қатынас және отбасылық қауіпсіздік жоспары туралы.',
    longDescription:
      'Қорғанудың негізгі ережелерін білгеннен кейін келесі қадам басталады: тек өзіңді қорғау емес, айналаңдағы цифрлық ортаны да жақсарту.\n\nКурс үш маңызды дағдыны дамытады: құрметпен пікір білдіру, жекелікті баптау және отбасы не команда ішінде ортақ қауіпсіздік жоспарын құру.',
    level: 'Жетілдірілген деңгей',
    category: 'Көшбасшылық',
    coverTag: 'Зертхана',
    lessons: [
      {
        position: 1,
        title: 'Усыз пікір жазу',
        summary: 'Өз қадіріңді де, өзгенің қадірін де сақтай отырып пікірталас жүргізуді үйренеміз.',
        content:
          'Экранның ар жағында тірі адам отырғанын интернетте ұмытып кету оңай. Сол себепті пікірлер шынайы әңгімеден де қатқыл болып кетеді.\n\nЦифрлық көшбасшы келіспесе де, келемежсіз және қорламай сөйлейді. «Мен бұған басқаша қараймын», «Фактілерді бірге қарайық», «Маған мұндай тон ұнамайды» деген тіркестер шекараны сақтауға көмектеседі.\n\nЕгер диалог тым қызса, ең дұрыс шешім кейде кідіріс жасау болады.',
        safetyChecklist:
          'Келемеж тілімен жазба.\nФактіні талқыла, адамды емес.\nТон нашарласа, шекара қой немесе диалогтан шық.\nӨзгені көпшілік алдында ұялтуға қатыспа.',
      },
      {
        position: 2,
        title: 'Жекелік баптаулары',
        summary: 'Профиль, фото және хат алмасуға кім қол жеткізе алатынын басқаруды үйренеміз.',
        content:
          'Жекелік дегеніміз қорқу емес, есікті өзің баптау. Профильді бәріне бірдей ашық ұстау міндет емес.\n\nЖаңа қосымшаларды орнатқаннан кейін олардың қандай рұқсат сұрайтынын тексер. Кейбір сервистерге камера, микрофон, байланыстар тізімі немесе геолокация шын мәнінде қажет болмауы мүмкін.\n\nАйына бір рет кішігірім тексеріс жасап тұр: профиліңді кім көреді, қандай құрылғылар кіріп тұр және құпиясөзді жаңарту керек пе.',
        safetyChecklist:
          'Профильді бөгде адамдардан жап.\nҚосымшалардың рұқсаттарын тексер.\nЕскі құрылғыларды аккаунттан шығар.\nАйына бір рет баптауларды қарап шық.',
      },
      {
        position: 3,
        title: 'Отбасылық қауіпсіздік жоспары',
        summary: 'Бұзу, буллинг немесе күмәнді хабарлама кезінде не істейтінімізді алдын ала келісеміз.',
        content:
          'Қауіпсіздік тек тыйыммен емес, түсінікті жоспармен жақсы жұмыс істейді. Мысалы: қорқыту келсе, скриншот жасаймыз және ересекке айтамыз; ақша не код сұралса, ешкім бірден жауап бермейді; аккаунт бұзылса, бірден құпиясөзді ауыстырамыз.\n\nСтресс кезінде ойлап табудан гөрі алдын ала келісілген жоспар әлдеқайда тиімді. Бала жалғыз қалмайды және не істеу керегін тезірек есіне түсіреді.\n\nМұндай жоспарды қағазда да, жазбада да сақтауға болады. Ең бастысы, ол қысқа, түсінікті және үнемі жаңартылып тұруы керек.',
        safetyChecklist:
          'Алдымен кімге хабарласатыныңды келісіп ал.\nБұзу мен буллинг кезіндегі қадамдарды жазып қой.\nЖоспарды бірнеше ай сайын жаңарт.\nЕрежелерді қысқа әрі түсінікті ет.',
      },
    ],
    quizzes: [
      {
        position: 1,
        title: 'Цифрлық көшбасшы тесті',
        description: 'Интернеттегі жауапкершілік пен жекелік дағдыларын тексереміз.',
        questions: [
          {
            position: 1,
            prompt: 'Цифрлық көшбасшы дөрекі пікірге қалай жауап береді?',
            explanation: 'Ол шекара қояды немесе әңгімені тоқтатады, жанжалды ушықтырмайды.',
            options: [
              { text: 'Одан да қаттырақ жазады' },
              { text: 'Шекара қойып, сабырмен жауап береді немесе тоқтатады' },
              { text: 'Барлық достарын араластырады' },
            ],
          },
          {
            position: 2,
            prompt: 'Қосымша рұқсаттарын неге тексеру керек?',
            explanation: 'Кей қосымша артық қолжетімділік сұрауы мүмкін.',
            options: [
              { text: 'Себебі барлық рұқсат әрқашан пайдалы' },
              { text: 'Себебі қосымшаға қажеттен көп дерек беріп қоюың мүмкін' },
              { text: 'Себебі бұл интернетті тездетеді' },
            ],
          },
          {
            position: 3,
            prompt: 'Отбасыға не үшін цифрлық қауіпсіздік жоспары қажет?',
            explanation: 'Алаңдаған сәтте дайын жоспар жылдам және сабырмен әрекет етуге көмектеседі.',
            options: [
              { text: 'Тек телефонды шектеу үшін' },
              { text: 'Қауіпті жағдайда кім не істейтінін алдын ала білу үшін' },
              { text: 'Қосымшаларды көбірек орнату үшін' },
            ],
          },
          {
            position: 4,
            prompt: 'Айына бір рет не істеген пайдалы?',
            explanation: 'Жекелік пен кіру баптауларын тексеру аккаунтты ретте ұстайды.',
            options: [
              { text: 'Барлық құпиясөзді достармен салыстыру' },
              { text: 'Жекелік баптаулары мен кірген құрылғыларды тексеру' },
              { text: 'Барлық постты өшіріп тастау' },
            ],
          },
        ],
      },
    ],
  },
};

const GAME_TRANSLATIONS = {
  'inbox-defender': {
    title: 'Қауіпсіз шешімдер',
    description: 'Күнделікті өмірдегі цифрлық жағдайларда дұрыс әрекет таңда.',
    instructions: '5 кездейсоқ жағдайдан өт. Әр таңдаудың салдары финалда бірге көрсетіледі.',
    gameType: 'life-scenarios',
    thumbnailLabel: 'LIFE',
    accentColor: '#2aa7a1',
    rewardPoints: 60,
    estimatedMinutes: 5,
    difficulty: 'Орташа',
  },
  'trust-sorter': {
    title: 'Сенім сүзгісі',
    description: 'Жағдай карталарын қауіпсіз және қауіпті аймақтарға бөліп үйрен.',
    instructions: '10 кездейсоқ картаны оқы. Қауіпсіз әрекеттерді бір аймаққа, күмәнді сұрауларды екінші аймаққа орналастыр.',
    thumbnailLabel: 'СҮЗГІ',
    accentColor: '#2f8f83',
    difficulty: 'Орташа',
  },
};

const USER_OVERRIDES = {
  admin: {
    fullName: 'Платформа әкімшісі',
    city: 'Алматы',
    gradeLevel: 'қызметкер',
  },
  alina: {
    fullName: 'Алина Серік',
    city: 'Қызылорда',
    gradeLevel: '4Б',
  },
};

const MESSAGE_TRANSLATIONS = {
  'Course not found': 'Курс табылмады.',
  'Lesson not found': 'Сабақ табылмады.',
  'Quiz not found': 'Тест табылмады.',
  'Game not found': 'Ойын табылмады.',
  'User not found': 'Пайдаланушы табылмады.',
  'Invalid credentials': 'Логин немесе құпиясөз қате.',
  'Username already exists': 'Мұндай логин бұрыннан бар.',
  'Quiz configuration is invalid': 'Тест баптауы қате.',
  'At least one admin must remain': 'Кемінде бір әкімші қалуы керек.',
  'Cannot delete the last admin': 'Соңғы әкімшіні өшіруге болмайды.',
  'Seed admin account cannot be deleted': 'Негізгі әкімші аккаунтын өшіруге болмайды.',
  'Course slug already exists': 'Мұндай курс сілтемесі бұрыннан бар.',
  'Game slug already exists': 'Мұндай ойын сілтемесі бұрыннан бар.',
  'Unknown role: ADMIN': 'Белгісіз рөл көрсетілді: ADMIN.',
  'Unknown role: STUDENT': 'Белгісіз рөл көрсетілді: STUDENT.',
  'Курс добавлен в личный маршрут': 'Курс жеке оқу бағытыңа қосылды.',
  'Урок отмечен как завершенный': 'Сабақ аяқталды деп белгіленді.',
  'Игра завершена, ты получил новый опыт безопасности': 'Ойын аяқталды, қауіпсіздік бойынша жаңа тәжірибе жинадың.',
  'Результат сохранен, попробуй побить свой рекорд': 'Нәтиже сақталды. Енді рекордыңды жаңартуға тырысып көр.',
};

export function normalizeRole(role) {
  return String(role ?? '').trim().toUpperCase();
}

export function localizeUserSummary(user) {
  if (!user) {
    return user;
  }

  const override = USER_OVERRIDES[user.username];
  return override ? { ...user, ...override } : user;
}

export function localizeCourseCard(course) {
  const translation = COURSE_TRANSLATIONS[course?.slug];
  if (!translation) {
    return course;
  }

  return {
    ...course,
    title: translation.title ?? course.title,
    subtitle: translation.subtitle ?? course.subtitle,
    description: translation.description ?? course.description,
    level: translation.level ?? course.level,
    category: translation.category ?? course.category,
    coverTag: translation.coverTag ?? course.coverTag,
  };
}

export function localizeCourse(course) {
  const translation = COURSE_TRANSLATIONS[course?.slug];
  if (!translation) {
    return course;
  }

  // Build a position-keyed map of quiz translations WITHOUT spreading questions,
  // so backend question/option IDs are never overwritten.
  const quizTranslationMap = new Map(
    (translation.quizzes ?? []).map((q, i) => [q.position ?? i + 1, q])
  );

  return {
    ...course,
    title: translation.title ?? course.title,
    subtitle: translation.subtitle ?? course.subtitle,
    description: translation.description ?? course.description,
    longDescription: translation.longDescription ?? course.longDescription,
    level: translation.level ?? course.level,
    category: translation.category ?? course.category,
    coverTag: translation.coverTag ?? course.coverTag,
    lessons: mapByPosition(course.lessons, translation.lessons),
    quizzes: (course.quizzes ?? []).map((quiz, quizIndex) => {
      const quizTranslation = quizTranslationMap.get(quiz.position ?? quizIndex + 1);
      if (!quizTranslation) {
        return quiz;
      }
      return {
        ...quiz,
        title: quizTranslation.title ?? quiz.title,
        description: quizTranslation.description ?? quiz.description,
        // Use the BACKEND questions (with real IDs) as the base — only overlay text
        questions: localizeQuizQuestions(quiz.questions, quizTranslation.questions),
      };
    }),
  };
}

export function localizeGame(game) {
  const translation = GAME_TRANSLATIONS[game?.slug];
  if (!translation) {
    return game;
  }

  const parsedContent = parseJson(game.contentJson, {});
  const translatedGame = {
    ...game,
    title: translation.title ?? game.title,
    description: translation.description ?? game.description,
    instructions: translation.instructions ?? game.instructions,
    gameType: translation.gameType ?? game.gameType,
    difficulty: translation.difficulty ?? game.difficulty,
    accentColor: translation.accentColor ?? game.accentColor,
    rewardPoints: translation.rewardPoints ?? game.rewardPoints,
    estimatedMinutes: translation.estimatedMinutes ?? game.estimatedMinutes,
    thumbnailLabel: translation.thumbnailLabel ?? game.thumbnailLabel,
  };

  // Only overlay scenario text if this game actually uses scenarios.
  // Newer games (like inbox-defender) store other keys such as rounds and should not be mutated here.
  const hasScenarioData =
    Array.isArray(parsedContent?.scenarios) ||
    Array.isArray(translation.scenarios);
  if (!hasScenarioData) {
    return translatedGame;
  }

  const scenarios = Array.isArray(parsedContent?.scenarios) ? parsedContent.scenarios : [];
  const scenarioMap = new Map((translation.scenarios ?? []).map((scenario) => [scenario.id, scenario]));
  const localizedScenarios = scenarios.map((scenario, scenarioIndex) => {
    const localizedScenario = scenarioMap.get(scenario.id) ?? translation.scenarios?.[scenarioIndex];
    if (!localizedScenario) {
      return scenario;
    }

    if (Array.isArray(scenario.choices)) {
      const choiceMap = new Map((localizedScenario.choices ?? []).map((choice) => [choice.id, choice]));
      return {
        ...scenario,
        prompt: localizedScenario.prompt ?? scenario.prompt,
        choices: scenario.choices.map((choice, choiceIndex) => ({
          ...choice,
          ...(choiceMap.get(choice.id) ?? localizedScenario.choices?.[choiceIndex] ?? {}),
        })),
      };
    }

    return {
      ...scenario,
      title: localizedScenario.title ?? scenario.title,
      message: localizedScenario.message ?? scenario.message,
      explanation: localizedScenario.explanation ?? scenario.explanation,
    };
  });

  return {
    ...translatedGame,
    contentJson: stringifyJson({
      ...parsedContent,
      scenarios: localizedScenarios,
    }),
  };
}

export function localizePublicState(state) {
  return {
    ...state,
    courseCards: (state.courseCards ?? []).map(localizeCourseCard),
    courses: (state.courses ?? []).map(localizeCourse),
    games: (state.games ?? []).map(localizeGame),
  };
}

export function localizeStudentState(state) {
  if (!state) {
    return state;
  }

  return {
    ...state,
    dashboard: localizeDashboard(state.dashboard),
    courses: (state.courses ?? []).map(localizeCourse),
    games: (state.games ?? []).map(localizeGame),
  };
}

export function localizeAdminState(state) {
  if (!state) {
    return state;
  }

  return {
    ...state,
    users: (state.users ?? []).map(localizeUserSummary),
    courses: (state.courses ?? []).map(localizeCourse),
    games: (state.games ?? []).map(localizeGame),
  };
}

export function localizeDashboard(dashboard) {
  if (!dashboard) {
    return dashboard;
  }

  const completedGames = (dashboard.games ?? []).filter((game) => game.completed).length;
  return {
    ...dashboard,
    user: localizeUserSummary(dashboard.user),
    featuredCourses: (dashboard.featuredCourses ?? []).map(localizeCourseCard),
    myCourses: (dashboard.myCourses ?? []).map(localizeCourseCard),
    games: (dashboard.games ?? []).map(localizeGame),
    achievements: [
      {
        title: 'Қауіпсіздік ұпайлары',
        description: `${dashboard.user?.safePoints ?? 0} қауіпсіздік ұпайын жинадың.`,
        theme: 'sun',
      },
      {
        title: 'Курстардағы ілгерілеу',
        description: `${(dashboard.myCourses ?? []).length} курс бойынша прогресің көрсетіліп тұр.`,
        theme: 'mint',
      },
      {
        title: 'Аяқталған ойындар',
        description: `${completedGames} ойын бойынша нәтиже сақталды.`,
        theme: 'berry',
      },
    ],
  };
}

export function translateApiMessage(message) {
  return MESSAGE_TRANSLATIONS[message] ?? message;
}
