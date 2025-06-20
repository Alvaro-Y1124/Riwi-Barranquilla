/**
 * Age Verification System
 * This function validates user input for name and age
 * Shows appropriate messages based on validation results
 */

// Main validation function
function validateData() {
  const age = document.getElementById("enter_your_age").value;
  const result = document.getElementById("result");
  const names = document.getElementById("enter_your_name").value;

  // Check if name is empty
  if(names === ""){
    alert("You must enter your name");
    result.innerHTML = "";
    return;
  }

  // Check if age is empty
  if (age === "") {
    alert("Please enter a number");
    result.innerHTML = "";
    return;
  }

  // Convert age to number and validate
  const enter_age = Number(age);
  if (enter_age < 0) {
    alert("You cannot enter a negative age. Please enter a valid age");
    result.innerHTML = "";
  } else if (age < 18) {
    result.textContent = `Hello ${names}, you are underage. Keep learning and enjoying coding!`;
  } else if (age >= 18) {
    result.textContent = `Hello ${names}, you are an adult. Get ready for great opportunities in programming!`;
  }
}

// Prevent form from reloading the page when button is clicked
document.addEventListener("click", (event) => {
  event.preventDefault();
});