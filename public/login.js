document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      errorMessage.style.display = "block";
      errorMessage.textContent = "من فضلك أدخل البريد وكلمة المرور";
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:2511/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      const token = data.token;
      localStorage.setItem("token", token);
      console.log("TOKEN SAVED:", token);

      
      if (!res.ok) {
        errorMessage.style.display = "block";
        errorMessage.textContent = data.message || "خطأ أثناء تسجيل الدخول";
        return;
      }

      successMessage.style.display = "block";
      successMessage.textContent = data.message;

      setTimeout(() => {
        window.location.href = "user.html";
      }, 1200);
    } catch (err) {
      errorMessage.style.display = "block";
      errorMessage.textContent = "خطأ في الاتصال بالسيرفر";
    }
  });
});
