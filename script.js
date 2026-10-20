
// ========================================
// لعبة تجربة العمل تحت الضغط
// ========================================

// الصفحات الأساسية
const homePage = document.getElementById("homePage");
const instructionsPage = document.getElementById("instructionsPage");
const readyPage = document.getElementById("readyPage");

const startBtn = document.getElementById("startBtn");
const readyBtn = document.getElementById("readyBtn");
const playBtn = document.getElementById("playBtn");

// التنقل بين الصفحات
function showPage(page) {
    document.querySelectorAll(".page").forEach(function(item) {
        item.classList.add("hidden");
    });

    page.classList.remove("hidden");
    window.scrollTo(0, 0);
}

startBtn.addEventListener("click", function() {
    showPage(instructionsPage);
});

readyBtn.addEventListener("click", function() {
    showPage(readyPage);
});

playBtn.addEventListener("click", function() {
    startLevelOne();
});

// ========================================
// دوال مساعدة
// ========================================

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleNumbers(items) {
    for (let i = items.length - 1; i > 0; i--) {
        const j = randomNumber(0, i);
        [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
}

// ========================================
// المستوى الأول: تحدي الأرقام
// ========================================

const levelOnePage = document.getElementById("levelOnePage");
const numbersGrid = document.getElementById("numbersGrid");
const targetNumber = document.getElementById("targetNumber");
const timerDisplay = document.getElementById("timer");
const gameMessage = document.getElementById("gameMessage");
const timeProgress = document.getElementById("timeProgress");

const LEVEL_ONE_TIME = 50;

let timeLeft = LEVEL_ONE_TIME;
let timerInterval = null;
let transitionTimeout = null;
let correctNumber = null;
let levelLocked = false;

function startLevelOne() {
    clearInterval(timerInterval);
    clearTimeout(transitionTimeout);

    levelLocked = false;
    timeLeft = LEVEL_ONE_TIME;

    gameMessage.textContent = "";
    gameMessage.style.color = "#174e65";

    timerDisplay.textContent = timeLeft;
    timeProgress.style.width = "100%";
    numbersGrid.innerHTML = "";

    correctNumber = randomNumber(1, 99);
    targetNumber.textContent = correctNumber;

    const numbers = [];

    for (let i = 0; i < 23; i++) {
        let number;

        do {
            number = randomNumber(1, 99);
        } while (number === correctNumber);

        numbers.push(number);
    }

    numbers.push(correctNumber);
    shuffleNumbers(numbers);

    numbers.forEach(function(number) {
        const button = document.createElement("button");

        button.className = "number-btn";
        button.textContent = number;
        button.type = "button";

        button.addEventListener("click", function() {
            checkNumber(number);
        });

        numbersGrid.appendChild(button);
    });

    showPage(levelOnePage);

    timerInterval = setInterval(function() {
        timeLeft--;

        timerDisplay.textContent = timeLeft;
        timeProgress.style.width =
            ((timeLeft / LEVEL_ONE_TIME) * 100) + "%";

        if (timeLeft <= 0) {
            failLevelOne("انتهى الوقت! إعادة المحاولة...");
        }
    }, 1000);
}

function checkNumber(selectedNumber) {
    if (levelLocked) return;

    if (selectedNumber === correctNumber) {
        levelLocked = true;
        clearInterval(timerInterval);

        gameMessage.textContent = "ممتاز! إجابة صحيحة ✓";
        gameMessage.style.color = "#21836c";

        disableNumberButtons();

        transitionTimeout = setTimeout(function() {
            startLevelTwo();
        }, 1000);

    } else {
        failLevelOne("إجابة خاطئة! إعادة المحاولة...");
    }
}

function failLevelOne(message) {
    if (levelLocked) return;

    levelLocked = true;
    clearInterval(timerInterval);

    gameMessage.textContent = message;
    gameMessage.style.color = "#c34b4b";

    disableNumberButtons();

    transitionTimeout = setTimeout(function() {
        startLevelOne();
    }, 1200);
}

function disableNumberButtons() {
    numbersGrid.querySelectorAll("button").forEach(function(button) {
        button.disabled = true;
    });
}

// ========================================
// المستوى الثاني: تحدي الأشكال
// ========================================

const levelTwoPage = document.getElementById("levelTwoPage");
const shapesGrid = document.getElementById("shapesGrid");
const targetShape = document.getElementById("targetShape");
const shapeTimer = document.getElementById("shapeTimer");
const shapeMessage = document.getElementById("shapeMessage");
const shapeTimeProgress =
    document.getElementById("shapeTimeProgress");

const LEVEL_TWO_TIME = 50;

const shapeTypes = [
    { id: "circle", name: "الدائرة" },
    { id: "square", name: "المربع" },
    { id: "triangle", name: "المثلث" },
    { id: "rectangle", name: "المستطيل" }
];

let correctShape = null;
let shapeTimeLeft = LEVEL_TWO_TIME;
let shapeTimerInterval = null;
let shapeTransitionTimeout = null;
let shapeLocked = false;

function startLevelTwo() {
    clearInterval(shapeTimerInterval);
    clearTimeout(shapeTransitionTimeout);

    stopListeningAudio();

    if (shapeAudioPanel) {
        shapeAudioPanel.hidden = true;
    }

    shapeLocked = false;
    shapeTimeLeft = LEVEL_TWO_TIME;

    shapeTimer.textContent = shapeTimeLeft;
    shapeTimeProgress.style.width = "100%";

    shapeMessage.textContent = "";
    shapeMessage.style.color = "#174e65";

    shapesGrid.innerHTML = "";

    correctShape = shapeTypes[
        randomNumber(0, shapeTypes.length - 1)
    ];

    targetShape.textContent = correctShape.name;

    const shapes = [...shapeTypes];

    for (let i = 0; i < 20; i++) {
        shapes.push(
            shapeTypes[randomNumber(0, shapeTypes.length - 1)]
        );
    }

    shuffleNumbers(shapes);

    shapes.forEach(function(shape) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "shape-btn";
        button.setAttribute("aria-label", shape.name);

        const shapeElement = document.createElement("span");
        shapeElement.className = "shape " + shape.id;

        button.appendChild(shapeElement);

        button.addEventListener("click", function() {
            checkShape(shape.id);
        });

        shapesGrid.appendChild(button);
    });

    showPage(levelTwoPage);

    shapeTimerInterval = setInterval(function() {
        shapeTimeLeft--;

        shapeTimer.textContent = shapeTimeLeft;
        shapeTimeProgress.style.width =
            ((shapeTimeLeft / LEVEL_TWO_TIME) * 100) + "%";

        if (shapeTimeLeft <= 0) {
            failLevelTwo("انتهى الوقت! إعادة المحاولة...");
        }
    }, 1000);
}

function checkShape(selectedShape) {
    if (shapeLocked) return;

    if (selectedShape === correctShape.id) {
        shapeLocked = true;
        clearInterval(shapeTimerInterval);

        shapeMessage.textContent =
            "ممتاز! اخترت الشكل الصحيح ✓";

        shapeMessage.style.color = "#21836c";

        disableShapeButtons();

        // تشغيل الصوت مباشرة داخل صفحة الأشكال
        startListeningStage();

    } else {
        failLevelTwo("شكل خاطئ! إعادة المحاولة...");
    }
}

function failLevelTwo(message) {
    if (shapeLocked) return;

    shapeLocked = true;
    clearInterval(shapeTimerInterval);

    shapeMessage.textContent = message;
    shapeMessage.style.color = "#c34b4b";

    disableShapeButtons();

    shapeTransitionTimeout = setTimeout(function() {
        startLevelTwo();
    }, 1200);
}

function disableShapeButtons() {
    shapesGrid.querySelectorAll("button").forEach(function(button) {
        button.disabled = true;
    });
}

// ========================================
// مرحلة الاستماع واختبار الذاكرة
// ========================================

const listeningPage = document.getElementById("listeningPage");
let shapeAudioPanel = null;

const memoryPage = document.getElementById("memoryPage");
const finalPage = document.getElementById("finalPage");

const listeningStatus =
    document.getElementById("listeningStatus");

const retryAudioBtn =
    document.getElementById("retryAudioBtn");

const soundAnimation =
    document.querySelector(".sound-animation");

const memoryForm =
    document.getElementById("memoryForm");

const memoryAnswer =
    document.getElementById("memoryAnswer");

const memoryTimer =
    document.getElementById("memoryTimer");

const memoryMessage =
    document.getElementById("memoryMessage");

const memoryTimeProgress =
    document.getElementById("memoryTimeProgress");

const checkMemoryBtn =
    document.getElementById("checkMemoryBtn");

const restartGameBtn =
    document.getElementById("restartGameBtn");

const MEMORY_TIME = 50;

const arabicDigits = [
    "صفر",
    "واحد",
    "اثنين",
    "ثلاثة",
    "أربعة",
    "خمسة",
    "ستة",
    "سبعة",
    "ثمانية",
    "تسعة"
];

let spokenDigits = [];
let memoryTimeLeft = MEMORY_TIME;
let memoryTimerInterval = null;
let memoryTransitionTimeout = null;
let memoryLocked = false;

// ========================================
// أصوات التشتيت الحقيقية
// ========================================

const distractionFiles = [
    "audio/birds.mp3",
    "audio/crowd.mp3",
    "audio/wind.mp3"
];

let distractionAudios = [];

// تشغيل صوتين عشوائيين من الأصوات الثلاثة
function startDistractionSound() {
    stopDistractionSound();

    const shuffledFiles = [...distractionFiles];
    shuffleNumbers(shuffledFiles);

    const selectedFiles = shuffledFiles.slice(0, 2);

    selectedFiles.forEach(function(file) {
        const audio = new Audio(file);

        audio.loop = true;
        audio.volume = 0.45;

        distractionAudios.push(audio);

        audio.play().catch(function(error) {
            console.warn(
                "تعذر تشغيل صوت التشتيت:",
                file,
                error
            );
        });
    });
}

// إيقاف جميع أصوات التشتيت
function stopDistractionSound() {
    distractionAudios.forEach(function(audio) {
        audio.pause();
        audio.currentTime = 0;
    });

    distractionAudios = [];
}

// ========================================
// إدارة جلسة الاستماع
// ========================================

let audioSession = 0;
let audioWatchdog = null;
let listeningFinished = false;

function generateSpokenDigits() {
    spokenDigits = [];

    for (let i = 0; i < 3; i++) {
        spokenDigits.push(randomNumber(0, 9));
    }
}

function stopListeningAudio() {
    audioSession++;

    clearTimeout(audioWatchdog);
    audioWatchdog = null;

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    stopDistractionSound();

    soundAnimation.classList.remove("playing");
}

function startListeningStage() {
    clearInterval(shapeTimerInterval);
    clearTimeout(shapeTransitionTimeout);

    stopListeningAudio();
    generateSpokenDigits();

    listeningFinished = false;

    // إنشاء مساحة الاستماع داخل صفحة الأشكال
    if (!shapeAudioPanel) {
        shapeAudioPanel = document.createElement("div");
        shapeAudioPanel.className = "shape-audio-panel";
        shapeAudioPanel.setAttribute("role", "status");

        Object.assign(shapeAudioPanel.style, {
            textAlign: "center",
            padding: "22px 16px",
            marginTop: "24px",
            borderRadius: "22px",
            background: "#eef8fb",
            border: "1px solid #d9edf2"
        });

        // نسخ صورة السماعات من صفحة الاستماع القديمة
        const headphones =
            listeningPage.querySelector(".audio-card img");

        if (headphones) {
            const headphonesCopy = headphones.cloneNode(true);

            Object.assign(headphonesCopy.style, {
                display: "block",
                width: "110px",
                maxWidth: "35%",
                height: "auto",
                objectFit: "contain",
                margin: "0 auto 12px"
            });

            shapeAudioPanel.appendChild(headphonesCopy);
        }

        const title = document.createElement("h2");
        title.textContent = "استمع إلى الأرقام الثلاثة!";
        title.style.margin = "0 0 12px";

        shapeAudioPanel.appendChild(title);

        // نقل عناصر الاستماع إلى صفحة الأشكال
        shapeAudioPanel.appendChild(soundAnimation);
        shapeAudioPanel.appendChild(listeningStatus);
        shapeAudioPanel.appendChild(retryAudioBtn);

        shapesGrid.insertAdjacentElement(
            "afterend",
            shapeAudioPanel
        );
    }

    shapeAudioPanel.hidden = false;

    listeningStatus.textContent =
        "استمع للأرقام وحاول تذكر ترتيبها...";

    retryAudioBtn.classList.add("hidden");

    // نبقى في صفحة الأشكال دون الانتقال لصفحة أخرى
    playSpokenDigits();
}

// ========================================
// نطق الأرقام العربية
// ========================================

function playSpokenDigits() {
    if (!("speechSynthesis" in window)) {
        listeningStatus.textContent =
            "المتصفح لا يدعم النطق الصوتي. جربي Chrome أو Edge.";

        retryAudioBtn.classList.remove("hidden");
        return;
    }

    stopListeningAudio();

    listeningFinished = false;

    const currentSession = audioSession;

    retryAudioBtn.classList.add("hidden");

    listeningStatus.textContent = "استمع جيدًا...";
    soundAnimation.classList.add("playing");

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    const arabicVoice = voices.find(function(voice) {
        return voice.lang.toLowerCase().startsWith("ar");
    });

    const phrase = spokenDigits.map(function(digit) {
        return arabicDigits[digit];
    }).join("، ");

    const utterance = new SpeechSynthesisUtterance(phrase);

    utterance.lang = "ar-SA";
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (arabicVoice) {
        utterance.voice = arabicVoice;
    }

    function finishAudio() {
        if (currentSession !== audioSession) return;
        if (listeningFinished) return;

        listeningFinished = true;

        clearTimeout(audioWatchdog);
        audioWatchdog = null;

        stopDistractionSound();
        soundAnimation.classList.remove("playing");

        listeningStatus.textContent =
            "انتهى الصوت! استعد لاختبار الذاكرة...";

        setTimeout(function() {
            if (currentSession === audioSession) {
                startMemoryStage();
            }
        }, 700);
    }

    utterance.onend = finishAudio;

    utterance.onerror = function() {
        if (currentSession !== audioSession) return;

        clearTimeout(audioWatchdog);
        audioWatchdog = null;

        stopDistractionSound();
        soundAnimation.classList.remove("playing");

        listeningStatus.textContent =
            "تعذر تشغيل الصوت. اضغطي تشغيل الصوت للمحاولة مرة أخرى.";

        retryAudioBtn.classList.remove("hidden");
    };

    try {
        // تشغيل الأصوات المشتتة
        startDistractionSound();

        // نطق الأرقام الثلاثة
        synth.speak(utterance);

        // الحماية من توقف النطق
        audioWatchdog = setTimeout(function() {
            if (currentSession !== audioSession) return;
            if (listeningFinished) return;

            synth.cancel();
            stopDistractionSound();

            soundAnimation.classList.remove("playing");

            listeningStatus.textContent =
                "لم يكتمل تشغيل الصوت. اضغطي تشغيل الصوت لإعادة المحاولة.";

            retryAudioBtn.classList.remove("hidden");
        }, 15000);

    } catch (error) {
        stopDistractionSound();

        listeningStatus.textContent =
            "حدثت مشكلة في تشغيل الصوت.";

        retryAudioBtn.classList.remove("hidden");
    }
}

// زر إعادة تشغيل الصوت عند الحاجة
retryAudioBtn.addEventListener("click", function() {
    playSpokenDigits();
});

// ========================================
// اختبار الذاكرة
// ========================================

function startMemoryStage() {
    clearInterval(memoryTimerInterval);
    clearTimeout(memoryTransitionTimeout);

    memoryLocked = false;
    memoryTimeLeft = MEMORY_TIME;

    memoryTimer.textContent = memoryTimeLeft;
    memoryTimeProgress.style.width = "100%";

    memoryAnswer.value = "";
    memoryAnswer.disabled = false;

    checkMemoryBtn.disabled = false;

    memoryMessage.textContent = "";
    memoryMessage.style.color = "#174e65";

    showPage(memoryPage);
    memoryAnswer.focus();

    memoryTimerInterval = setInterval(function() {
        memoryTimeLeft--;

        memoryTimer.textContent = memoryTimeLeft;

        memoryTimeProgress.style.width =
            ((memoryTimeLeft / MEMORY_TIME) * 100) + "%";

        if (memoryTimeLeft <= 0) {
            failMemoryStage(
                "انتهى الوقت! ستعيد المستوى الثاني..."
            );
        }
    }, 1000);
}

// تحويل الأرقام العربية والفارسية إلى الإنجليزية
function normalizeDigits(value) {
    const arabic = "٠١٢٣٤٥٦٧٨٩";
    const persian = "۰۱۲۳۴۵۶۷۸۹";

    return value.replace(/[٠-٩۰-۹]/g, function(char) {
        let index = arabic.indexOf(char);

        if (index !== -1) {
            return String(index);
        }

        index = persian.indexOf(char);
        return String(index);

    }).replace(/\s/g, "");
}

// التحقق من إجابة اللاعب
memoryForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (memoryLocked) return;

    const answer = normalizeDigits(memoryAnswer.value);
    const correctAnswer = spokenDigits.join("");

    if (answer === correctAnswer) {
        memoryLocked = true;

        clearInterval(memoryTimerInterval);

        memoryAnswer.disabled = true;
        checkMemoryBtn.disabled = true;

        memoryMessage.textContent =
            "رائع! تذكرت الأرقام بالترتيب الصحيح ✓";

        memoryMessage.style.color = "#21836c";

        memoryTransitionTimeout = setTimeout(function() {
            showPage(finalPage);
        }, 1200);

    } else {
        failMemoryStage(
            "الإجابة غير صحيحة! ستعيد المستوى الثاني..."
        );
    }
});

function failMemoryStage(message) {
    if (memoryLocked) return;

    memoryLocked = true;
    clearInterval(memoryTimerInterval);

    memoryAnswer.disabled = true;
    checkMemoryBtn.disabled = true;

    memoryMessage.textContent = message;
    memoryMessage.style.color = "#c34b4b";

    memoryTransitionTimeout = setTimeout(function() {
        startLevelTwo();
    }, 1200);
}

// ========================================
// إعادة اللعبة من البداية
// ========================================

restartGameBtn.addEventListener("click", function() {
    stopListeningAudio();

    clearInterval(timerInterval);
    clearInterval(shapeTimerInterval);
    clearInterval(memoryTimerInterval);

    clearTimeout(transitionTimeout);
    clearTimeout(shapeTransitionTimeout);
    clearTimeout(memoryTransitionTimeout);

    showPage(homePage);
});
