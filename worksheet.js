/* =========================================
   ใบงานนักพิมพ์คนเก่ง
   ระบบจับเวลา + ตรวจการพิมพ์
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
   เริ่มทำใบงาน
========================================= */

if(startWorksheetButton){

    startWorksheetButton.addEventListener(
        "click",
        function(){

            const studentNumber =
                studentNumberInput.value.trim();

            const studentClass =
                studentClassInput.value.trim();


            /* ตรวจเลขที่ */

            if(studentNumber === ""){

                alert("กรุณากรอกเลขที่");

                studentNumberInput.focus();

                return;

            }


            /* ตรวจชั้น */

            if(studentClass === ""){

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


            /* ปิดหน้าข้อมูล */

            studentInfo.style.display =
                "none";


            /* เริ่มต้นเวลา */

            if(timerDisplay){

                timerDisplay.textContent =
                    "เวลา 00:00";

            }

        }
    );

}
/* =========================================
   ตัวแปร
========================================= */

let startTime = null;
let timerInterval = null;
let elapsedSeconds = 0;

let hasStarted = false;


/* =========================================
   DOM
========================================= */

const typingInput =
    document.getElementById("typingInput");

const timerDisplay =
    document.getElementById("timer");


/* =========================================
   ข้อความต้นฉบับ
   ไม่ดึงช่องว่างจาก HTML
========================================= */

const targetText =
`วันนี้คุณครูพานักเรียนไปเรียนรู้การใช้แป้นพิมพ์
ทุกคนตั้งใจฝึกพิมพ์และช่วยกันทำกิจกรรมจนสำเร็จ`;


/* =========================================
   เตรียมข้อความก่อนตรวจ
   ไม่คิดช่องว่างและการขึ้นบรรทัดเป็นความผิด
========================================= */

function normalizeText(text){

    return text
        .replace(/\s/g, "");

}


/* =========================================
   เริ่มจับเวลา
========================================= */

function startTimer(){

    if(hasStarted){
        return;
    }

    hasStarted = true;

    startTime = Date.now();

    timerInterval =
        setInterval(updateTimer, 1000);

}


/* =========================================
   อัปเดตเวลา
========================================= */

function updateTimer(){

    if(!startTime){
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

function updateTimerDisplay(){

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


    if(timerDisplay){

        timerDisplay.textContent =
            timeText;

    }

}


/* =========================================
   เริ่มจับเวลาเมื่อเด็กเริ่มพิมพ์
========================================= */

if(typingInput){

    typingInput.addEventListener(
        "input",
        function(){

            startTimer();

        }
    );

}


/* =========================================
   หยุดเวลา
========================================= */

function stopTimer(){

    if(timerInterval !== null){

        clearInterval(timerInterval);

        timerInterval = null;

    }

}


/* =========================================
   ตรวจคำตอบ
========================================= */

function checkAnswer(){

    if(!typingInput){
        return;
    }


    const typedText =
        typingInput.value;


    if(typedText.trim() === ""){

        alert(
            "กรุณาพิมพ์ข้อความก่อนตรวจคำตอบ"
        );

        return;

    }


    /* อัปเดตเวลาครั้งสุดท้าย */

    if(startTime){

        elapsedSeconds =
            Math.floor(
                (Date.now() - startTime) / 1000
            );

    }


    /* หยุดเวลา */

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
       เก็บข้อมูล
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
       ไปหน้าผลลัพธ์
    ===================================== */

    window.location.href =
        "result.html";

}


/* =========================================
   คำนวณความผิดแบบจัดแนวข้อความ
========================================= */

function calculateTypingResult(
    target,
    typed
){

    const targetLength =
        target.length;

    const typedLength =
        typed.length;


    /*
       ตารางสำหรับหาจำนวนการแก้ไข
       เช่น
       เพิ่มตัวอักษร
       ลบตัวอักษร
       เปลี่ยนตัวอักษร
    */

    const dp =
        Array.from(
            {
                length:
                    targetLength + 1
            },
            () =>
                Array(
                    typedLength + 1
                ).fill(0)
        );


    /* กรณีข้อความว่าง */

    for(
        let i = 0;
        i <= targetLength;
        i++
    ){

        dp[i][0] = i;

    }


    for(
        let j = 0;
        j <= typedLength;
        j++
    ){

        dp[0][j] = j;

    }


    /* =====================================
       เปรียบเทียบข้อความ
    ===================================== */

    for(
        let i = 1;
        i <= targetLength;
        i++
    ){

        for(
            let j = 1;
            j <= typedLength;
            j++
        ){

            if(
                target[i - 1] ===
                typed[j - 1]
            ){

                dp[i][j] =
                    dp[i - 1][j - 1];

            }

            else{

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


    /* =====================================
       จำนวนตัวอักษรที่ผิด
    ===================================== */

    const mistakes =
        dp[targetLength][typedLength];


    /* =====================================
       ความถูกต้อง
    ===================================== */

    let accuracy = 0;


    if(targetLength > 0){

        accuracy =
            Math.round(
                (
                    Math.max(
                        0,
                        targetLength - mistakes
                    )
                    /
                    targetLength
                )
                * 100
            );

    }


    return {

        mistakes:
            mistakes,

        accuracy:
            accuracy

    };

}


/* =========================================
   แปลงเวลา
========================================= */

function formatTime(totalSeconds){

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