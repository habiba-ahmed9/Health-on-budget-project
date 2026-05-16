// bmi.js - نظام بسيط لحفظ وحساب BMI

// 1. عندما يضغط على زر Calculate
document.getElementById("calculateBMI").addEventListener("click", function (e) {
  e.preventDefault();

  // 2. جمع البيانات
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;
  const age = document.getElementById("age").value;

  // 3. اختيار الجنس
  let gender = "";
  document.querySelectorAll(".gender-btn").forEach((btn) => {
    if (btn.classList.contains("selected")) {
      gender = btn.dataset.gender;
    }
  });

  // 4. التحقق
  if (!height || !weight || !age || !gender) {
    alert("Please fill all fields!");
    return;
  }

  // 5. حساب BMI
  const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);

  // 6. حفظ في JSON (في الذاكرة أولاً)
  saveToJSON({
    height: height,
    weight: weight,
    age: age,
    gender: gender,
    bmi: bmi,
    date: new Date().toLocaleString(),
  });

  // 7. الانتقال للنتيجة
  window.location.href = "#screen7";

  // 8. عرض النتيجة
  setTimeout(() => {
    document.querySelector(".bmi-number").textContent = bmi;

    // تحديد الفئة
    if (bmi < 18.5) {
      document.querySelector(".bmi-category").textContent = "Underweight";
    } else if (bmi < 25) {
      document.querySelector(".bmi-category").textContent = "Normal";
    } else if (bmi < 30) {
      document.querySelector(".bmi-category").textContent = "Overweight";
    } else {
      document.querySelector(".bmi-category").textContent = "Obese";
    }
  }, 100);
});

// 9. أزرار الجنس
document.querySelectorAll(".gender-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".gender-btn")
      .forEach((b) => b.classList.remove("selected"));
    this.classList.add("selected");
  });
});

// 10. حفظ في JSON (محاكاة)
function saveToJSON(data) {
  // في المتصفح، نحفظ في localStorage
  let history = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
  history.push(data);
  localStorage.setItem("bmiHistory", JSON.stringify(history));

  // طباعة في الكونسول (كأننا نحفظ في ملف)
  console.log("JSON Data:", JSON.stringify(data, null, 2));
  console.log("All History:", JSON.stringify(history, null, 2));

  // رسالة للمستخدم
  alert(`✅ Saved!\nBMI: ${data.bmi}`);
}

// 11. عرض البيانات المحفوظة (اختياري)
function showData() {
  const history = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
  if (history.length === 0) {
    alert("No data saved yet");
    return;
  }

  let message = "📊 Saved Data:\n\n";
  history.forEach((item, i) => {
    message += `${i + 1}. BMI: ${item.bmi} (H:${item.height}cm, W:${
      item.weight
    }kg, Age:${item.age}, ${item.gender})\n`;
  });
  alert(message);
}
