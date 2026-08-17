document.addEventListener("DOMContentLoaded", () => {
  const resultElement = document.getElementById("result");
  const expressionElement = document.getElementById("expression");
  const keys = document.querySelectorAll(".calc-key");

  let currentInput = "0";
  let storedValue = null;
  let pendingOperator = null;
  let waitingForOperand = false;
  let lastExpression = "";

  const operatorSymbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
  };

  function formatNumber(value) {
    if (!Number.isFinite(value)) return "Error";
    const rounded = Math.round((value + Number.EPSILON) * 10000000000) / 10000000000;
    return String(rounded);
  }

  function updateDisplay() {
    resultElement.textContent = currentInput;
    expressionElement.textContent = pendingOperator && storedValue !== null
      ? formatNumber(storedValue) + " " + operatorSymbols[pendingOperator]
      : lastExpression;
  }

  function clearActiveOperator() {
    document.querySelectorAll("[data-operator]").forEach((button) => {
      button.classList.remove("is-active-operator");
    });
  }

  function showError() {
    currentInput = "Cannot divide by zero";
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = true;
    lastExpression = "";
    clearActiveOperator();
    resultElement.classList.add("error-result");
    updateDisplay();
  }

  function resetErrorIfNeeded() {
    if (currentInput === "Cannot divide by zero") {
      currentInput = "0";
      resultElement.classList.remove("error-result");
    }
  }

  function inputNumber(number) {
    resetErrorIfNeeded();

    if (waitingForOperand) {
      currentInput = number;
      waitingForOperand = false;
      lastExpression = "";
    } else if (currentInput === "0") {
      currentInput = number;
    } else {
      currentInput += number;
    }

    updateDisplay();
  }

  function inputDecimal() {
    resetErrorIfNeeded();

    if (waitingForOperand) {
      currentInput = "0.";
      waitingForOperand = false;
      lastExpression = "";
    } else if (!currentInput.includes(".")) {
      currentInput += ".";
    }

    updateDisplay();
  }

  function calculate(left, right, operator) {
    switch (operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return right === 0 ? null : left / right;
      default:
        return right;
    }
  }

  function chooseOperator(nextOperator) {
    resetErrorIfNeeded();
    const inputValue = parseFloat(currentInput);

    if (pendingOperator && !waitingForOperand) {
      const calculatedValue = calculate(storedValue, inputValue, pendingOperator);

      if (calculatedValue === null) {
        showError();
        return;
      }

      storedValue = calculatedValue;
      currentInput = formatNumber(calculatedValue);
    } else if (storedValue === null) {
      storedValue = inputValue;
    }

    pendingOperator = nextOperator;
    waitingForOperand = true;
    lastExpression = "";
    clearActiveOperator();

    const activeButton = document.querySelector('[data-operator="' + nextOperator + '"]');
    if (activeButton) activeButton.classList.add("is-active-operator");

    updateDisplay();
  }

  function evaluate() {
    resetErrorIfNeeded();

    if (pendingOperator === null || storedValue === null || waitingForOperand) {
      return;
    }

    const inputValue = parseFloat(currentInput);
    const calculatedValue = calculate(storedValue, inputValue, pendingOperator);

    if (calculatedValue === null) {
      showError();
      return;
    }

    lastExpression = formatNumber(storedValue) + " " + operatorSymbols[pendingOperator] + " " + formatNumber(inputValue) + " =";
    currentInput = formatNumber(calculatedValue);
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = true;
    clearActiveOperator();
    updateDisplay();
  }

  function clearCalculator() {
    currentInput = "0";
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = false;
    lastExpression = "";
    resultElement.classList.remove("error-result");
    clearActiveOperator();
    updateDisplay();
  }

  function backspace() {
    if (currentInput === "Cannot divide by zero") {
      clearCalculator();
      return;
    }

    if (waitingForOperand) return;

    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    if (currentInput === "-" || currentInput === "") currentInput = "0";
    updateDisplay();
  }

  keys.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
        return;
      }

      if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
        return;
      }

      switch (button.dataset.action) {
        case "decimal":
          inputDecimal();
          break;
        case "equals":
          evaluate();
          break;
        case "clear":
          clearCalculator();
          break;
        case "backspace":
          backspace();
          break;
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
      inputNumber(key);
    } else if (key === ".") {
      inputDecimal();
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
      event.preventDefault();
      chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
      event.preventDefault();
      evaluate();
    } else if (key === "Escape") {
      clearCalculator();
    } else if (key === "Backspace" || key === "Delete") {
      event.preventDefault();
      backspace();
    }
  });

  updateDisplay();
});