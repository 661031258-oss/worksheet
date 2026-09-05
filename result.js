/* =========================================
   หน้าผลการฝึกพิมพ์
========================================= */


/* =========================================
   ดึงข้อมูลผลการพิมพ์
========================================= */

const typingTime =
    sessionStorage.getItem("typingTime") || "00:00";

const typingAccuracy =
    Number(
        sessionStorage.getItem("typingAccuracy") || 0
    );

const typingMistakes =
    Number(
        sessionStorage.getItem("typingMistakes") || 0
    );


/* =========================================
   ดึงข้อมูลคำที่พิมพ์ผิด
========================================= */

let wrongWords = [];

try {

    wrongWords = JSON.parse(
        sessionStorage.getItem("wrongWords") || "[]"
    );

} catch (error) {

    wrongWords = [];

}


/* =========================================
   DOM
========================================= */

const timeResult =
    document.getElementById("timeResult");

const accuracyResult =
    document.getElementById("accuracyResult");

const mistakeSummary =
    document.getElementById("mistakeSummary");

const performanceResult =
    document.getElementById("performanceResult");

const correctionResult =
    document.getElementById("correctionResult");


/* =========================================
   แสดงเวลา
========================================= */

if (timeResult) {

    timeResult.textContent =
        typingTime;

}


/* =========================================
   แสดงความถูกต้อง
========================================= */

if (accuracyResult) {

    accuracyResult.textContent =
        typingAccuracy + "%";

}


/* =========================================
   แสดงจำนวนตัวอักษรที่ผิด
========================================= */

if (mistakeSummary) {

    mistakeSummary.textContent =
        "พิมพ์ผิด " +
        typingMistakes +
        " ตัวอักษร";

}


/* =========================================
   ระดับผลการพิมพ์
========================================= */

function getPerformance(accuracy) {

    if (accuracy >= 90) {

        return "ยอดเยี่ยม";

    }

    if (accuracy >= 80) {

        return "ดีมาก";

    }

    if (accuracy >= 70) {

        return "ดี";

    }

    if (accuracy >= 60) {

        return "พอใช้";

    }

    return "ควรฝึกเพิ่มเติม";

}


/* =========================================
   แสดงระดับผลการพิมพ์
========================================= */

if (performanceResult) {

    performanceResult.textContent =
        getPerformance(
            typingAccuracy
        );

}


/* =========================================
   แสดงคำผิด
========================================= */

function showWrongWords() {

    if (!correctionResult) {
        return;
    }


    /* -------------------------------------
       ไม่มีคำผิด
    ------------------------------------- */

    if (
        wrongWords.length === 0
    ) {

        correctionResult.innerHTML = `
            <div class="correct-message">
                ✓ พิมพ์ถูกต้องทั้งหมด
            </div>
        `;

        return;
    }


    /* -------------------------------------
       สร้างรายการคำผิด
    ------------------------------------- */

    let html = "";


    wrongWords.forEach(
        function(item) {

            /*
               ถ้ามีข้อมูลคำผิด
               แสดงเฉพาะคำ
            */

            html += `
                <div class="wrong-word-row">

                    <span class="wrong-text">
                        ${escapeHTML(item.typed)}
                    </span>

                    <span class="arrow">
                        →
                    </span>

                    <span class="correct-text">
                        ${escapeHTML(item.correct)}
                    </span>

                </div>
            `;

        }
    );


    correctionResult.innerHTML =
        html;

}


/* =========================================
   ป้องกัน HTML
========================================= */

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   แสดงคำผิดทันที
========================================= */

showWrongWords();


/* =========================================
   ปุ่มลองอีกครั้ง
========================================= */

const tryAgainButton =
    document.getElementById(
        "tryAgainButton"
    );


if (tryAgainButton) {

    tryAgainButton.addEventListener(
        "click",
        function() {

            /* ล้างผลการพิมพ์รอบก่อน */

            sessionStorage.removeItem(
                "typingTime"
            );

            sessionStorage.removeItem(
                "typingAccuracy"
            );

            sessionStorage.removeItem(
                "typingMistakes"
            );

            sessionStorage.removeItem(
                "wrongWords"
            );

            sessionStorage.removeItem(
                "targetText"
            );

            sessionStorage.removeItem(
                "typedText"
            );


            /*
               กลับไปหน้า index.html
            */

            window.location.href =
                "index.html";

        }
    );

}