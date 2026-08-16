document.addEventListener("DOMContentLoaded", function () {

  if (window.lucide) {
    lucide.createIcons();
  }
  let form = document.getElementById("converter-form");
  let temperatureInput = document.getElementById("temperature-input");
  let unitDropdown = document.getElementById("unit-select");
  let messageBox = document.getElementById("validation-message");

  let celsiusOutput = document.getElementById("celsius-result");
  let fahrenheitOutput = document.getElementById("fahrenheit-result");
  let kelvinOutput = document.getElementById("kelvin-result");

  function showMessage(text, type) {
    messageBox.textContent = text;

    if (type === "error") {
      messageBox.className = "status-message error";
    } else if (type === "success") {
      messageBox.className = "status-message success";
    } else {
      messageBox.className = "status-message";
    }
  }

  function convertToCelsius(value, unit) {
    if (unit === "fahrenheit") {
      return (value - 32) * 5 / 9;
    } else if (unit === "kelvin") {
      return value - 273.15;
    } else {
      return value;
    }
  }

  function roundNumber(value) {
    return value.toFixed(2);
  }

  function handleConvert(event) {
    event.preventDefault();

    let typedValue = temperatureInput.value.trim();

    if (typedValue === "") {
      showMessage("Please enter a temperature value.", "error");
      temperatureInput.setAttribute("aria-invalid", "true");
      return;
    }
    let numberValue = Number(typedValue);

    if (isNaN(numberValue)) {
      showMessage("That's not a valid number. Try something like 21.5 or -4.", "error");
      temperatureInput.setAttribute("aria-invalid", "true");
      return;
    }

    let chosenUnit = unitDropdown.value;

    let celsius = convertToCelsius(numberValue, chosenUnit);
    if (celsius < -273.15) {
      showMessage("That temperature is below absolute zero. Please enter a real value.", "error");
      temperatureInput.setAttribute("aria-invalid", "true");
      return;
    }

    temperatureInput.setAttribute("aria-invalid", "false");
    showMessage("Converted successfully!", "success");

    let fahrenheit = (celsius * 9 / 5) + 32;
    let kelvin = celsius + 273.15;

    celsiusOutput.textContent = roundNumber(celsius) + " °C";
    fahrenheitOutput.textContent = roundNumber(fahrenheit) + " °F";
    kelvinOutput.textContent = roundNumber(kelvin) + " K";
  }
  form.addEventListener("submit", handleConvert);
});