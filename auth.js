// auth.js - نظام تسجيل دخول مبسط باستخدام localStorage

const DB_KEY = "user_database";

// 1. تسجيل مستخدم جديد
async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  // تحميل البيانات الحالية
  const data = await loadData();

  // التحقق إذا كان الإيميل موجود
  if (data.users.find((u) => u.email === email)) {
    alert("Email already exists!");
    return;
  }

  // إضافة مستخدم جديد
  const newUser = {
    id: Date.now(), // معرف فريد
    email: email,
    password: password,
    created: new Date().toISOString(),
  };

  data.users.push(newUser);

  // حفظ البيانات
  const saved = await saveData(data);

  if (saved) {
    // رسالة نجاح التسجيل فقط
    alert("Account created successfully!");

    // تنظيف الحقول
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    // التوجيه لـ screen 4 (صفحة تسجيل الدخول)
    window.location.hash = "#screen4";
  }
}

// 2. تسجيل دخول
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  await performLogin(email, password);
}

// 3. تنفيذ عملية تسجيل الدخول
async function performLogin(email, password) {
  try {
    const data = await loadData();
    const user = data.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // لا تظهر أي رسالة عند تسجيل الدخول
      window.location.hash = "#screen5";

      // حفظ في الجلسة
      sessionStorage.setItem("user", JSON.stringify(user));
      // حفظ في localStorage للاستمرارية
      localStorage.setItem("currentUser", JSON.stringify(user));

      // تحديث واجهة المستخدم
      updateUIAfterLogin(user);
    } else {
      alert("Wrong email or password!");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login error: " + error.message);
  }
}

// 4. تحديث واجهة المستخدم بعد التسجيل/الدخول
function updateUIAfterLogin(user) {
  console.log("User logged in:", user.email);

  // تنظيف حقول الدخول
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  if (loginEmail) loginEmail.value = "";
  if (loginPassword) loginPassword.value = "";

  // تحديث أي عنصر ترحيب في الصفحة
  const welcomeElement = document.getElementById("welcome-message");
  if (welcomeElement) {
    welcomeElement.textContent = `Hello, ${user.email}!`;
  }
}

// 5. تحميل البيانات من localStorage
async function loadData() {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return { users: [] };
  } catch (error) {
    console.error("Error loading data:", error);
    return { users: [] };
  }
}

// 6. حفظ البيانات في localStorage
async function saveData(data) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    console.log("Data saved:", data.users.length, "users");
    return true;
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data: " + error.message);
    return false;
  }
}

// 7. فحص إذا كان هناك مستخدم مسجل بالفعل
function checkLoggedInUser() {
  try {
    const user = localStorage.getItem("currentUser");
    if (user) {
      const userData = JSON.parse(user);

      // تحديث الواجهة إذا كان المستخدم في صفحة الترحيب
      if (window.location.hash === "#screen5") {
        updateUIAfterLogin(userData);
      }

      return userData;
    }
  } catch (e) {
    console.error("Error checking logged in user:", e);
  }
  return null;
}

// 8. تسجيل الخروج
function logout() {
  sessionStorage.removeItem("user");
  localStorage.removeItem("currentUser");
  alert("Logged out successfully!");
  window.location.hash = "#screen1";
}

// 9. إعداد الأزرار والمستمعين للأحداث
document.addEventListener("DOMContentLoaded", function () {
  console.log("Auth system loaded");

  // زر التسجيل
  const signupBtn = document.querySelector("#screen2 button");
  if (signupBtn) {
    signupBtn.addEventListener("click", function (e) {
      e.preventDefault();
      signUp();
    });
  }

  // زر التسجيل البديل
  const signupLink = document.querySelector('#screen2 a[href="#screen4"]');
  if (signupLink) {
    signupLink.addEventListener("click", function (e) {
      e.preventDefault();
      signUp();
    });
  }

  // زر الدخول
  const loginBtn = document.querySelector("#screen3 button");
  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      login();
    });
  }

  // زر الدخول البديل
  const loginLink = document.querySelector('#screen3 a[href="#screen5"]');
  if (loginLink) {
    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      login();
    });
  }

  // زر الدخول في الشاشة 4
  const screen4LoginBtn = document.querySelector("#screen4 button");
  if (screen4LoginBtn) {
    screen4LoginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      login();
    });
  }

  // فحص المستخدم المسجل عند تحميل الصفحة
  const loggedInUser = checkLoggedInUser();
  if (loggedInUser && window.location.hash !== "#screen5") {
    window.location.hash = "#screen5";
  }
});

// 10. دالة لعرض المستخدمين
async function showUsers() {
  const data = await loadData();
  console.log("All users:", data.users);

  if (data.users.length === 0) {
    alert("No users found");
  } else {
    alert(`Total users: ${data.users.length}`);
  }
}
