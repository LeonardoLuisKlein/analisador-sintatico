$(document).ready(function() {
    $('#analyze-btn').click(function() {
        const inputSentence = $('#input-sentence').val();
        if (inputSentence) {
            analyzeSentence(inputSentence);
        } else {
            $('#output-table tbody').html('<tr><td colspan="4">Por favor, insira uma sentença.</td></tr>');
        }
    });

    $('#generate-btn').click(function() {
        const generatedSentence = generateSentence();
        $('#input-sentence').val(generatedSentence);
    });

    $('#clear-btn').click(function() {
        clearOutput();
    });
});

const parseTable = {
    'S': { 'a': ['a', 'A'], 'b': ['b', 'B'] },
    'A': { 'a': ['a', 'S'], 'c': ['c'], '$': ['ε'] },
    'B': { 'c': ['c', 'A'], 'b': ['b', 'C'] },
    'C': { 'a': ['a'], '$': ['ε'] }
};

function generateSentence() {
    // uma certa que funciona para esta gramática
    return 'aabcaac';
}

function clearOutput() {
    $('#output-table tbody').html('');
}

function analyzeSentence(sentence) {
    let stack = ['S'];
    let index = 0;
    let step = 1;
    let outputRows = '';
    let inputRemaining = sentence + '$';

    while (index < sentence.length || stack.length > 0) {
        let stackDisplay = stack.join(' ');
        let top = stack.pop();
        let action = '';

        if (top === sentence[index]) {
            index++;
            inputRemaining = sentence.substring(index) + '$';
            action = `Lê '${top}'`;
        } else if (parseTable[top] && parseTable[top][sentence[index]]) {
            let production = parseTable[top][sentence[index]];
            stack.push(...production.slice().reverse());
            action = `${top} &rarr; ${production.join(' ')}`;
        } else {
            outputRows += `<tr><td colspan="4">Erro após ${step} iterações</td></tr>`;
            $('#output-table tbody').html(outputRows);
            return;
        }

        outputRows += `<tr><td>${step}</td><td>$${stackDisplay}</td><td>${inputRemaining}</td><td>${action}</td></tr>`;
        step++;
    }

    if (stack.length === 0 && index === sentence.length) {
        outputRows += `<tr><td>${step}</td><td>$</td><td>${inputRemaining}</td><td>Aceito em ${step} iterações</td></tr>`;
    } else {
        outputRows += `<tr><td colspan="4">Erro na análise da sentença após ${step} iterações</td></tr>`;
    }

    $('#output-table tbody').html(outputRows);
}