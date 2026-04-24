import { generateReturnsArray } from "./src/investmentGoals.js";
import { Chart } from "chart.js/auto";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");

const form = document.getElementById("investment-form");
const clearFormButon = document.getElementById("clear-form");

let doughnutChartReference = {};
let progressionChartReference = {};

function formatCurrency(value) {
  return value.toFixed(2);
}

function renderProgression(event) {
  event.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  resetCharts();

  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", "."),
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", "."),
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", "."),
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", "."),
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod,
  );

  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total investido", "Rendimento", "Imposto"],
      datasets: [
        {
          data: [
            formatCurrency(finalInvestmentObject.investedAmount),
            formatCurrency(
              finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100),
            ),
            formatCurrency(
              (finalInvestmentObject.totalInterestReturns * taxRate) / 100,
            ),
          ],
          backgroundColor: [
            "rgb(59, 130, 246)",
            "rgb(34, 197, 94)",
            "rgb(239, 68, 68)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: "Total investido",
          data: returnsArray.map((investmentObject) =>
            formatCurrency(investmentObject.investedAmount),
          ),
          backgroundColor: "rgb(59, 130, 246)",
        },
        {
          label: "Retorno do Investimento",
          data: returnsArray.map((investmentObject) =>
            formatCurrency(investmentObject.interestReturns),
          ),
          backgroundColor: "rgb(34, 197, 94)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

function clearForm() {
  form.reset();
  resetCharts();

  const errorInputContainers = document.querySelectorAll(".error");
  for (const errorInputContainer of errorInputContainers) {
    errorInputContainer.classList.remove("error");
    errorInputContainer.parentElement.querySelector("p").remove();
  }
}

function validateInput(event) {
  if (event.target.value === "") {
    return;
  }
  const { parentElement } = event.target;
  const grandParentElement = event.target.parentElement.parentElement;
  const inputValue = event.target.value.replace(",", ".");

  if (
    (isNaN(inputValue) || Number(inputValue) <= 0) &&
    !parentElement.classList.contains("error")
  ) {
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-500");
    errorTextElement.textContent = "Insira um valor numérico e maior que zero";

    parentElement.classList.add("error");
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}

// form.addEventListener("submit", renderProgression);
clearFormButon.addEventListener("click", clearForm);
