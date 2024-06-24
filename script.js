let currentStack = [];
let currentIndex = 0;
let currentStep = 1;
let currentOutputRows = "";
let currentInputRemaining = "";
let currentSentence = "";
let analysisInitialized = false;

$(document).ready(function () {
  $("#analyze-btn").click(function () {
    const inputSentence = $("#input-sentence").val();
    if (inputSentence) {
      analyzeSentence(inputSentence);
    } else {
      $("#output-table tbody").html(
        '<tr><td colspan="4">Por favor, insira uma sentença.</td></tr>'
      );
    }
  });

  $("#generate-btn").click(function () {
    const generatedSentence = generateSentence();
    $("#input-sentence").val(generatedSentence);
  });

  $("#clear-btn").click(function () {
    clearOutput();
  });

  $("#step-btn").click(function () {
    const inputSentence = $("#input-sentence").val();
    if (!analysisInitialized && inputSentence) {
      initializeAnalysis(inputSentence);
      analysisInitialized = true;
    }
    stepAnalysis();
  });
});

const parseTable = {
  S: { a: ["a", "A"], b: ["b", "B"] },
  A: { a: ["a", "S"], c: ["c"], $: ["ε"] },
  B: { c: ["c", "A"], b: ["b", "C"], $: ["ε"] },
  C: { a: ["a"], $: ["ε"] },
};

function generateSentence() {
  let stack = ["S"];
  let sentence = "";

  while (stack.length > 0) {
    let top = stack.pop();

    if (parseTable[top]) {
      let options = Object.keys(parseTable[top]);
      let chosenOption = options[Math.floor(Math.random() * options.length)];
      let production = parseTable[top][chosenOption];

      for (let i = production.length - 1; i >= 0; i--) {
        if (production[i] !== "ε") {
          stack.push(production[i]);
        }
      }
    } else {
      sentence += top;
    }
  }

  return sentence;
}

function clearOutput() {
  $("#output-table tbody").html("");
  currentStack = [];
  currentIndex = 0;
  currentStep = 1;
  currentOutputRows = "";
  currentInputRemaining = "";
  currentSentence = "";
  analysisInitialized = false;
}

function analyzeSentence(sentence) {
  initializeAnalysis(sentence);

  while (true) {
    if (currentStack.length === 0 && currentIndex === sentence.length) {
      currentOutputRows += `<tr><td>${currentStep}</td><td>$</td><td>${currentInputRemaining}</td><td>Aceito em ${currentStep} iterações</td></tr>`;
      $("#output-table tbody").html(currentOutputRows);
      return;
    }

    if (currentStack.length === 0 || currentIndex > sentence.length) {
      currentOutputRows += `<tr><td>${currentStep}</td><td>$</td><td>${currentInputRemaining}</td><td>Erro em ${currentStep} iterações</td></tr>`;
      $("#output-table tbody").html(currentOutputRows);
      return;
    }

    let stackDisplay = currentStack.join(" ");
    let top = currentStack.pop();
    let action = "";

    if (top === sentence[currentIndex]) {
      action = `Lê '${top}'`;
      currentOutputRows += `<tr><td>${currentStep}</td><td>$${stackDisplay}</td><td>${currentInputRemaining}</td><td>${action}</td></tr>`;
      currentIndex++;
      currentInputRemaining = sentence.substring(currentIndex) + "$";
    } else if (parseTable[top] && parseTable[top][sentence[currentIndex]]) {
      let production = parseTable[top][sentence[currentIndex]];
      currentStack.push(...production.slice().reverse());
      action = `${top} &rarr; ${production.join(" ")}`;
      currentOutputRows += `<tr><td>${currentStep}</td><td>$${stackDisplay}</td><td>${currentInputRemaining}</td><td>${action}</td></tr>`;
    } else if (
      parseTable[top] &&
      parseTable[top]["$"] &&
      parseTable[top]["$"][0] === "ε"
    ) {
      action = `${top} &rarr; ε`;
      currentOutputRows += `<tr><td>${currentStep}</td><td>$${stackDisplay}</td><td>${currentInputRemaining}</td><td>${action}</td></tr>`;
    } else {
      currentOutputRows += `<tr><td>${currentStep}</td><td>$</td><td>${currentInputRemaining}</td><td>Erro em ${currentStep} iterações</td></tr>`;
      $("#output-table tbody").html(currentOutputRows);
      return;
    }

    currentStep++;
    $("#output-table tbody").html(currentOutputRows);
  }
}

function initializeAnalysis(sentence) {
  currentStack = ["S"];
  currentIndex = 0;
  currentStep = 1;
  currentOutputRows = "";
  currentInputRemaining = sentence + "$";
  currentSentence = sentence;
  $("#output-table tbody").html("");
}

function stepAnalysis() {
  if (!currentSentence) {
    $("#output-table tbody").html(
      '<tr><td colspan="4">Por favor, inicialize a análise primeiro.</td></tr>'
    );
    return;
  }

  if (currentStack.length === 0 && currentIndex === currentSentence.length) {
    currentOutputRows += `<tr><td>${currentStep}</td><td>$</td><td>${currentInputRemaining}</td><td>Aceito em ${currentStep} iterações</td></tr>`;
    $("#output-table tbody").html(currentOutputRows);
    return;
  }

  if (currentStack.length === 0 || currentIndex > currentSentence.length) {
    currentOutputRows += `<tr><td>${currentStep}</td><td>$</td><td>${currentInputRemaining}</td><td>Erro em ${currentStep} iterações</td></tr>`;
    $("#output-table tbody").html(currentOutputRows);
    return;
  }

  let stackDisplay = currentStack.join(" ");
  let top = currentStack.pop();
  let action = "";

  if (top === currentSentence[currentIndex]) {
    action = `Lê '${top}'`;
    currentOutputRows += `<tr><td>${currentStep}</td><td>$${stackDisplay}</td><td>${currentInputRemaining}</td><td>${action}</td></tr>`;
    currentIndex++;
    currentInputRemaining = currentSentence.substring(currentIndex) + "$";
  } else if (
    parseTable[top] &&
    parseTable[top][currentSentence[currentIndex]]
  ) {
    let production = parseTable[top][currentSentence[currentIndex]];
    currentStack.push(...production.slice().reverse());
    action = `${top} &rarr; ${production.join(" ")}`;
    currentOutputRows += `<tr><td>${currentStep}</td><td>$${stackDisplay}</td><td>${currentInputRemaining}</td><td>${action}</td></tr>`;
  } else if (
    parseTable[top] &&
    parseTable[top]["$"] &&
    parseTable[top]["$"][0] === "ε"
  ) {
    action = `${top} &rarr; ε`;
    currentOutputRows += `<tr><td>${currentStep}</td><td>$${stackDisplay}</td><td>${currentInputRemaining}</td><td>${action}</td></tr>`;
  } else {
    currentOutputRows += `<tr><td>${currentStep}</td><td>$</td><td>${currentInputRemaining}</td><td>Erro em ${currentStep} iterações</td></tr>`;
    $("#output-table tbody").html(currentOutputRows);
    return;
  }

  currentStep++;
  $("#output-table tbody").html(currentOutputRows);
}
