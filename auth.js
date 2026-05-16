const DB_KEY = "user_database";


async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }
  
  const data = await loadData();


  if (data.users.find((u) => u.email === email)) {
    alert("Email already exists!");
    return;
  }

  const newUser = {
    id: Date.now(),
    email: email,
    password: password,
    created: new Date().toISOString(),
  };

  data.users.push(newUser);

  
  const saved = await saveData(data);

  if (saved) {

    alert("Account created successfully!");

    
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    
    window.location.hash = "#screen4";
  }
}


async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  await performLogin(email, password);
}


async function performLogin(email, password) {
  try {
    const data = await loadData();
    const user = data.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      
      window.location.hash = "#screen5";

      
      sessionStorage.setItem("user", JSON.stringify(user));
      
      localStorage.setItem("currentUser", JSON.stringify(user));

    
    updateUIAfterLogin(user);
    } else {
      alert("Wrong email or password!");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login error: " + error.message);
  }
}


function updateUIAfterLogin(user) {
  console.log("User logged in:", user.email);

  
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  if (loginEmail) loginEmail.value = "";
  if (loginPassword) loginPassword.value = "";


  const welcomeElement = document.getElementById("welcome-message");
  if (welcomeElement) {
    welcomeElement.textContent = `Hello, ${user.email}!`;
  }
}


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


function checkLoggedInUser() {
  try {
    const user = localStorage.getItem("currentUser");
    if (user) {
      const userData = JSON.parse(user);

      
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


function logout() {
  sessionStorage.removeItem("user");
  localStorage.removeItem("currentUser");
  alert("Logged out successfully!");
  window.location.hash = "#screen1";
}


document.addEventListener("DOMContentLoaded", function () {
  console.log("Auth system loaded");

  
  const signupBtn = document.querySelector("#screen2 button");
  if (signupBtn) {
    signupBtn.addEventListener("click", function (e) {
      e.preventDefault();
      signUp();
    });
  }

  
  const signupLink = document.querySelector('#screen2 a[href="#screen4"]');
  if (signupLink) {
    signupLink.addEventListener("click", function (e) {
      e.preventDefault();
      signUp();
    });
  }

  
  const loginBtn = document.querySelector("#screen3 button");
  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      login();
    });
  }

  
  const loginLink = document.querySelector('#screen3 a[href="#screen5"]');
  if (loginLink) {
    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      login();
    });
  }

  
  const screen4LoginBtn = document.querySelector("#screen4 button");
  if (screen4LoginBtn) {
    screen4LoginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      login();
    });
  }

  
  const loggedInUser = checkLoggedInUser();
  if (loggedInUser && window.location.hash !== "#screen5") {
    window.location.hash = "#screen5";
  }
});


async function showUsers() {
  const data = await loadData();
  console.log("All users:", data.users);

  if (data.users.length === 0) {
    alert("No users found");
  } else {
    alert(`Total users: ${data.users.length}`);
  }
}
