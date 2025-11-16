document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";
    successMessage.textContent = "";

    const fullName = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    // تصحيح: استخدام الـ ID الصحيح من HTML
    const idFile = document.getElementById("national_id_image").files[0];

    // التحقق من المدخلات
    if (password !== confirmPassword) {
      errorMessage.textContent = "كلمة المرور وتأكيدها غير متطابقين.";
      return;
    }

    if (!idFile) {
      errorMessage.textContent = "يرجى رفع صورة البطاقة.";
      return;
    }

    // التحقق من نوع الملف
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(idFile.type)) {
      errorMessage.textContent = "يرجى رفع صورة بصيغة JPG أو PNG.";
      return;
    }

    // إظهار حالة التحميل
    const submitBtn = form.querySelector(".register-btn");
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "⏳ جاري التحقق من البطاقة...";
    submitBtn.disabled = true;

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("national_id_image", idFile);

    try {
      const res = await fetch("http://localhost:2511/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        errorMessage.textContent = data.message || data.error || "حدث خطأ.";
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        return;
      }

      successMessage.textContent =
        data.message ||
        `تم التسجيل بنجاح! نسبة التطابق: ${(data.similarity * 100).toFixed(
          2
        )}%`;

      // إعادة تعيين النموذج
      form.reset();

      // تحويل المستخدم بعد 2 ثانية
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } catch (err) {
      errorMessage.textContent =
        "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت.";
      console.error(err);
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });

  // التحقق من كلمة المرور في الوقت الفعلي
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");

  confirmPassword.addEventListener("input", () => {
    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("كلمة المرور غير متطابقة");
    } else {
      confirmPassword.setCustomValidity("");
    }
  });
});
