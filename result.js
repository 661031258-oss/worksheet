/* =========================================
   ผลการฝึกพิมพ์
   แสดงผล + ส่งข้อมูลเข้า Google Sheets
========================================= */


/* =========================================
   รับค่าจากหน้า result.html
========================================= */

const timeResult =
    document.getElementById("timeResult");

const accuracyResult =
    document.getElementById("accuracyResult");

const mistakeResult =
    document.getElementById("mistakeResult");

const performanceResult =
    document.getElementById("performanceResult");


/* =========================================
   ดึงข้อมูลผลการพิมพ์
========================================= */

const time =
    sessionStorage.getItem("typingTime") || "00:00";

const accuracy =
    Number(
        sessionStorage.getItem("typingAccuracy") || 0
    );

const mistakes =
    Number(
        sessionStorage.getItem("typingMistakes") || 0
    );


/* =========================================
   ดึงข้อมูลนักเรียน
========================================= */

const studentNumber =
    sessionStorage.getItem("studentNumber") || "";

const studentClass =
    sessionStorage.getItem("studentClass") || "";


/* =========================================
   แสดงผลบนหน้าผลลัพธ์
========================================= */

if(timeResult){

    timeResult.textContent =
        time;

}


if(accuracyResult){

    accuracyResult.textContent =
        accuracy + "%";

}


if(mistakeResult){

    mistakeResult.textContent =
        mistakes;

}


/* =========================================
   คำนวณระดับผลการพิมพ์
========================================= */

function getPerformance(accuracy){

    if(accuracy >= 95){

        return "ยอดเยี่ยม";

    }

    else if(accuracy >= 85){

        return "ดีมาก";

    }

    else if(accuracy >= 70){

        return "ดี";

    }

    else{

        return "พยายามอีกนิด";

    }

}


const performance =
    getPerformance(accuracy);


if(performanceResult){

    performanceResult.textContent =
        performance;

}


/* =========================================
   URL ของ Google Apps Script
========================================= */

const GOOGLE_SHEET_URL =
    "https://script.google.com/macros/s/AKfycbx9I_ZFIZR6SF3KDDpmrqtCm7EeIy_9a8ZFHK-imxfy2BP988GwYOYMjkR5dlj4eyK0/exec";


/* =========================================
   ส่งข้อมูลเข้า Google Sheets
========================================= */

function sendResultToGoogleSheet(){

    /*
       ป้องกันการส่งข้อมูลซ้ำ
       กรณีผู้ใช้กดรีเฟรชหน้าผลลัพธ์
    */

    const alreadySent =
        sessionStorage.getItem(
            "typingResultSent"
        );


    if(alreadySent === "true"){

        return;

    }


    /*
       ถ้ายังไม่มีเลขที่หรือชั้น
       จะไม่ส่งข้อมูล
    */

    if(
        studentNumber === "" ||
        studentClass === ""
    ){

        console.warn(
            "ไม่พบข้อมูลเลขที่หรือชั้น"
        );

        return;

    }


    /*
       เตรียมข้อมูล
    */

    const formData =
        new URLSearchParams();


    formData.append(
        "studentNumber",
        studentNumber
    );


    formData.append(
        "className",
        studentClass
    );


    formData.append(
        "typingTime",
        time
    );


    formData.append(
        "accuracy",
        accuracy + "%"
    );


    formData.append(
        "mistakes",
        mistakes
    );


    formData.append(
        "performance",
        performance
    );


    /*
       ส่งข้อมูลไป Google Apps Script
    */

    fetch(
        GOOGLE_SHEET_URL,
        {
            method: "POST",

            mode: "no-cors",

            headers:{
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8"
            },

            body:
                formData.toString()
        }
    )
    .then(function(){

        /*
           บันทึกว่าส่งข้อมูลแล้ว
        */

        sessionStorage.setItem(
            "typingResultSent",
            "true"
        );


        console.log(
            "ส่งข้อมูลเข้า Google Sheets แล้ว"
        );

    })
    .catch(function(error){

        console.error(
            "ไม่สามารถส่งข้อมูลไป Google Sheets ได้:",
            error
        );

    });

}


/* =========================================
   ส่งข้อมูลเมื่อเปิดหน้าผลลัพธ์
========================================= */

sendResultToGoogleSheet();


/* =========================================
   ปุ่มลองอีกครั้ง
========================================= */

function tryAgain(){

    /*
       ลบข้อมูลผลลัพธ์เดิม
    */

    sessionStorage.removeItem(
        "typingTime"
    );

    sessionStorage.removeItem(
        "typingAccuracy"
    );

    sessionStorage.removeItem(
        "typingMistakes"
    );


    /*
       ลบข้อมูลสถานะการส่ง
       เพื่อให้การทำครั้งใหม่
       สามารถส่งเข้า Google Sheets ได้อีกครั้ง
    */

    sessionStorage.removeItem(
        "typingResultSent"
    );


    /*
       กลับไปหน้าใบงาน
    */

    window.location.href =
        "index.html";

}