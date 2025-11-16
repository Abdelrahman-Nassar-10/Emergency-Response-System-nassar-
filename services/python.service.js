const { spawn } = require("child_process");
const path = require("path");

/**
 * تشغيل سكريبت Python للتحقق من البطاقة
 * @param {string} imagePath - مسار الصورة
 * @returns {Promise<Object>} - نتيجة التحقق
 */
function runPythonCheck(imagePath) {
  return new Promise((resolve, reject) => {
    // تحديد مسار سكريبت Python
    const pythonScript = path.join(__dirname, "../aiModel/check_id.py");

    // تشغيل Python
    const pythonProcess = spawn("python", [pythonScript, imagePath]);

    let dataString = "";
    let errorString = "";

    // جمع البيانات من stdout
    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    // جمع الأخطاء من stderr
    pythonProcess.stderr.on("data", (data) => {
      errorString += data.toString();
    });

    // عند انتهاء العملية
    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python stderr:", errorString);
        return reject(
          new Error(`Python process exited with code ${code}: ${errorString}`)
        );
      }

      try {
        // تحويل النتيجة من JSON
        const result = JSON.parse(dataString);
        resolve(result);
      } catch (err) {
        console.error("Failed to parse Python output:", dataString);
        reject(new Error("فشل في تحليل نتيجة Python"));
      }
    });

    // التعامل مع الأخطاء
    pythonProcess.on("error", (err) => {
      console.error("Failed to start Python process:", err);
      reject(new Error("فشل في تشغيل Python"));
    });
  });
}

module.exports = runPythonCheck;
