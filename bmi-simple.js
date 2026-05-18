document.getElementById("calculateBMI").addEventListener("click", function (e) {
  e.preventDefault();

  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;
  const age = document.getElementById("age").value;

 
  let gender = "";
  document.querySelectorAll(".gender-btn").forEach((btn) => {
    if (btn.classList.contains("selected")) {
      gender = btn.dataset.gender;
    }
  });

  
  if (!height || !weight || !age || !gender) {
    alert("Please fill all fields!");
    return;
  }

  
  const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);

  
  saveToJSON({
    height: height,
    weight: weight,
    age: age,
    gender: gender,
    bmi: bmi,
    date: new Date().toLocaleString(),
  });

  
  window.location.href = "#screen7";

  
  setTimeout(() => {
    document.querySelector(".bmi-number").textContent = bmi;

    
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


document.querySelectorAll(".gender-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".gender-btn")
      .forEach((b) => b.classList.remove("selected"));
    this.classList.add("selected");
  });
});


function saveToJSON(data) {
  
  let history = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
  history.push(data);
  localStorage.setItem("bmiHistory", JSON.stringify(history));

  
  console.log("JSON Data:", JSON.stringify(data, null, 2));
  console.log("All History:", JSON.stringify(history, null, 2));

  
  alert(`✅ Saved!\nBMI: ${data.bmi}`);
}


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
