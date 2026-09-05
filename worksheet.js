/* =========================================
   ใบงานนักพิมพ์คนเก่ง
   ระบบจับเวลา + ตรวจการพิมพ์ + เฉลยคำผิด
========================================= */


/* =========================================
   ข้อมูลนักเรียน
========================================= */

const studentInfo =
    document.getElementById("studentInfo");

const studentNumberInput =
    document.getElementById("studentNumber");

const studentClassInput =
    document.getElementById("studentClass");

const startWorksheetButton =
    document.getElementById("startWorksheet");


/* =========================================
   ช่องพิมพ์ + ตัวจับเวลา
========================================= */

const typingInput =
    document.getElementById("typingInput");

const timerDisplay =
    document.getElementById("timer");


/* =========================================
   ตัวแปรเวลา
========================================= */

let startTime = null;

let timerInterval = null;

let elapsedSeconds = 0;

let hasStarted = false;


/* =========================================
   ข้อความต้นฉบับ
========================================= */

const targetText =
`คนไปทะเลหาปลา และพบปลามากมาย
แต่ลมพัด ฝนตก คนเลยกลับ โอ้โหโกรธมาก`;


/* =========================================
   คำที่ใช้สำหรับตรวจคำผิด
   แยกตามคำที่ต้องการให้แสดงผล
========================================= */

const expectedWords = [

    "คนไปทะเลหาปลา",
    "และ",
    "พบ",
    "ปลา",
    "มากมาย",

    "แต่",
    "ลม",
    "พัด",
    "ฝน",
    "ตก",
    "คนเลยกลับ",
    "โอ้โห",
    "โกรธ",
    "มาก"

];


/* =========================================
   เริ่มทำใบงาน
========================================= */

if (startWorksheetButton) {

    startWorksheetButton.addEventListener(
        "click",
        function () {

            const studentNumber =
                studentNumberInput.value.trim();

            const studentClass =
                studentClassInput.value.trim();


            /* ตรวจเลขที่ */

            if (studentNumber === "") {

                alert("กรุณากรอกเลขที่");

                studentNumberInput.focus();

                return;
            }


            /* ตรวจชั้น */

            if (studentClass === "") {

                alert("กรุณากรอกชั้น");

                studentClassInput.focus();

                return;
            }


            /* เก็บข้อมูลนักเรียน */

            sessionStorage.setItem(
                "studentNumber",
                studentNumber
            );

            sessionStorage.setItem(
                "studentClass",
                studentClass
            );


            /* ซ่อนหน้าข้อมูล */

            if (studentInfo) {

                studentInfo.style.display =
                    "none";

            }


            /* รีเซ็ตเวลา */

            startTime = null;

            elapsedSeconds = 0;

            hasStarted = false;

            stopTimer();

            updateTimerDisplay();

        }
    );

}


/* =========================================
   จัดรูปแบบข้อความ
========================================= */

function normalizeText(text) {

    return text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim();

}


/* =========================================
   เริ่มจับเวลา
========================================= */

function startTimer() {

    if (hasStarted) {
        return;
    }

    hasStarted = true;

    startTime = Date.now();

    timerInterval =
        setInterval(
            updateTimer,
            1000
        );

}


/* =========================================
   อัปเดตเวลา
========================================= */

function updateTimer() {

    if (!startTime) {
        return;
    }

    elapsedSeconds =
        Math.floor(
            (Date.now() - startTime) / 1000
        );

    updateTimerDisplay();

}


/* =========================================
   แสดงเวลา
========================================= */

function updateTimerDisplay() {

    const minutes =
        Math.floor(
            elapsedSeconds / 60
        );

    const seconds =
        elapsedSeconds % 60;


    const timeText =
        "เวลา "
        +
        String(minutes).padStart(2, "0")
        +
        ":"
        +
        String(seconds).padStart(2, "0");


    if (timerDisplay) {

        timerDisplay.textContent =
            timeText;

    }

}


/* =========================================
   เริ่มจับเวลาเมื่อเริ่มพิมพ์
========================================= */

if (typingInput) {

    typingInput.addEventListener(
        "input",
        function () {

            startTimer();

        }
    );

}


/* =========================================
   หยุดเวลา
========================================= */

function stopTimer() {

    if (timerInterval !== null) {

        clearInterval(timerInterval);

        timerInterval = null;

    }

}


/* =========================================
   ตรวจคำตอบ
========================================= */

function checkAnswer() {

    if (!typingInput) {
        return;
    }


    const typedText =
        typingInput.value;


    /* ยังไม่ได้พิมพ์ */

    if (typedText.trim() === "") {

        alert(
            "กรุณาพิมพ์ข้อความก่อนตรวจคำตอบ"
        );

        typingInput.focus();

        return;
    }


    /* =====================================
       อัปเดตเวลาครั้งสุดท้าย
    ===================================== */

    if (startTime) {

        elapsedSeconds =
            Math.floor(
                (Date.now() - startTime) / 1000
            );

    }


    stopTimer();

    updateTimerDisplay();


    /* =====================================
       เตรียมข้อความ
    ===================================== */

    const cleanTarget =
        normalizeText(targetText);

    const cleanTyped =
        normalizeText(typedText);


    /* =====================================
       คำนวณผล
    ===================================== */

    const result =
        calculateTypingResult(
            cleanTarget,
            cleanTyped
        );


    /* =====================================
       เก็บข้อมูลนักเรียน
    ===================================== */

    sessionStorage.setItem(
        "studentNumber",
        studentNumberInput.value.trim()
    );

    sessionStorage.setItem(
        "studentClass",
        studentClassInput.value.trim()
    );


    /* =====================================
       เก็บผลการพิมพ์
    ===================================== */

    sessionStorage.setItem(
        "typingTime",
        formatTime(elapsedSeconds)
    );

    sessionStorage.setItem(
        "typingAccuracy",
        result.accuracy
    );

    sessionStorage.setItem(
        "typingMistakes",
        result.mistakes
    );


    /* =====================================
       เก็บรายการคำผิด
    ===================================== */

    sessionStorage.setItem(
        "wrongWords",
        JSON.stringify(
            result.wrongWords
        )
    );


    /* เก็บข้อความต้นฉบับ */

    sessionStorage.setItem(
        "targetText",
        cleanTarget
    );


    /* เก็บข้อความที่เด็กพิมพ์ */

    sessionStorage.setItem(
        "typedText",
        cleanTyped
    );


    /* =====================================
       ไปหน้าผลลัพธ์
    ===================================== */

    window.location.href =
        "result.html";

}


/* =========================================
   คำนวณผล
========================================= */

function calculateTypingResult(
    target,
    typed
) {

    const mistakes =
        calculateEditDistance(
            target,
            typed
        );


    let accuracy = 0;


    if (target.length > 0) {

        accuracy =
            Math.round(
                (
                    Math.max(
                        0,
                        target.length - mistakes
                    )
                    /
                    target.length
                )
                * 100
            );

    }


    const wrongWords =
        findWrongWords(
            target,
            typed
        );


    return {

        mistakes:
            mistakes,

        accuracy:
            accuracy,

        wrongWords:
            wrongWords

    };

}


/* =========================================
   ตรวจคำผิดแบบ "ทั้งคำ"
   
   ตัวอย่าง:
   ฝนตด → ฝนตก
   มาหมาย → มากมาย
   
   ไม่แสดง:
   ด → ก
========================================= */

function findWrongWords(
    target,
    typed
) {

    const wrongWords = [];


    /* =====================================
       สร้างข้อมูลคำจากข้อความจริง
    ===================================== */

    const targetWordList =
        buildWordList(
            target
        );


    const typedWordList =
        buildWordList(
            typed
        );


    const maxLength =
        Math.max(
            targetWordList.length,
            typedWordList.length
        );


    /* =====================================
       เปรียบเทียบทีละคำ
    ===================================== */

    for (
        let i = 0;
        i < maxLength;
        i++
    ) {

        const correctWord =
            targetWordList[i] || "";

        const typedWord =
            typedWordList[i] || "";


        /* ถูกต้อง */

        if (
            correctWord === typedWord
        ) {

            continue;

        }


        /* =================================
           พิมพ์ผิด
        ================================= */

        wrongWords.push({

            typed:
                typedWord ||
                "ไม่ได้พิมพ์",

            correct:
                correctWord ||
                "เกินจากโจทย์"

        });

    }


    return wrongWords;

}


/* =========================================
   สร้างรายการคำสำหรับตรวจ
   
   จุดสำคัญ:
   ไม่ได้ใช้ช่องว่างอย่างเดียว
   แต่ใช้ expectedWords เป็นตัวแบ่งคำ
========================================= */

function buildWordList(text) {

    const result = [];


    /*
       ลบการขึ้นบรรทัดเพื่อให้ค้นหาคำต่อเนื่อง
    */

    const cleanText =
        text
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n");


    /*
       ตำแหน่งปัจจุบันในข้อความ
    */

    let position = 0;


    /*
       เดินตามบรรทัด
    */

    const lines =
        cleanText.split("\n");


    lines.forEach(
        function(line) {

            let lineText =
                line.trim();


            /*
               ---------------------------------
               พยายามจับคำตาม expectedWords
               ที่อยู่ในบรรทัดนี้
               ---------------------------------
            */

            let localPosition = 0;


            /*
               หาคำที่ตรงกับบรรทัด
            */

            for (
                let i = 0;
                i < expectedWords.length;
                i++
            ) {

                const expected =
                    expectedWords[i];


                const index =
                    lineText.indexOf(
                        expected,
                        localPosition
                    );


                /*
                   ถ้าพบคำ
                */

                if (
                    index !== -1
                ) {

                    /*
                       ถ้ามีข้อความก่อนหน้าคำ
                       ให้ตรวจข้อความนั้นด้วย
                    */

                    if (
                        index > localPosition
                    ) {

                        const before =
                            lineText.substring(
                                localPosition,
                                index
                            ).trim();


                        if (before !== "") {

                            result.push(
                                before
                            );

                        }

                    }


                    /*
                       เพิ่มคำที่ถูกต้อง
                    */

                    result.push(
                        expected
                    );


                    localPosition =
                        index +
                        expected.length;

                }

            }


            /*
               ---------------------------------
               ถ้ายังเหลือข้อความท้ายบรรทัด
               ---------------------------------
            */

            const remaining =
                lineText
                    .substring(localPosition)
                    .trim();


            if (remaining !== "") {

                /*
                   พยายามแยกคำที่เหลือ
                   ด้วยช่องว่าง
                */

                const remainingWords =
                    remaining
                        .split(/\s+/)
                        .filter(Boolean);


                remainingWords.forEach(
                    function(word) {

                        result.push(word);

                    }
                );

            }

        }
    );


    /*
       ---------------------------------
       ถ้าสร้างรายการไม่ได้
       ใช้การแบ่งตามช่องว่างแทน
       ---------------------------------
    */

    if (result.length === 0) {

        return text
            .split(/\s+/)
            .filter(Boolean);

    }


    /*
       ---------------------------------
       สำหรับข้อความที่เด็กพิมพ์ผิด
       เช่น

       พบปลามาหมาย

       expected:
       พบ
       ปลา
       มากมาย

       ระบบจะไม่สามารถค้นหา "มากมาย"
       ได้ ดังนั้นต้องใช้การจับคู่
       ตามตำแหน่งของคำ
    ---------------------------------
    */

    return result;

}


/* =========================================
   Levenshtein Distance
========================================= */

function calculateEditDistance(
    target,
    typed
) {

    const targetLength =
        target.length;

    const typedLength =
        typed.length;


    const dp =
        Array.from(
            {
                length:
                    targetLength + 1
            },
            function() {

                return Array(
                    typedLength + 1
                ).fill(0);

            }
        );


    for (
        let i = 0;
        i <= targetLength;
        i++
    ) {

        dp[i][0] = i;

    }


    for (
        let j = 0;
        j <= typedLength;
        j++
    ) {

        dp[0][j] = j;

    }


    for (
        let i = 1;
        i <= targetLength;
        i++
    ) {

        for (
            let j = 1;
            j <= typedLength;
            j++
        ) {

            if (
                target[i - 1] ===
                typed[j - 1]
            ) {

                dp[i][j] =
                    dp[i - 1][j - 1];

            } else {

                const replace =
                    dp[i - 1][j - 1] + 1;

                const insert =
                    dp[i][j - 1] + 1;

                const remove =
                    dp[i - 1][j] + 1;


                dp[i][j] =
                    Math.min(
                        replace,
                        insert,
                        remove
                    );

            }

        }

    }


    return dp[
        targetLength
    ][
        typedLength
    ];

}


/* =========================================
   แปลงเวลา
========================================= */

function formatTime(
    totalSeconds
) {

    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    return (
        String(minutes).padStart(2, "0")
        +
        ":"
        +
        String(seconds).padStart(2, "0")
    );

}