let probabilities = {
    red: 0.2,
    yellow: 0.2,
    green: 0.6
};

let correctGuesses = 0;
let totalGuesses = 0;
let trials = [];
let highProbColor;
let lowProbColors;

const playerName = prompt("Enter your name:");
const playerAge = prompt("Enter your age:");

// Function to randomly assign probabilities
function assignProbabilities() {
    const colors = ['red', 'yellow', 'green'];
    highProbColor = colors.splice(Math.floor(Math.random() * colors.length), 1)[0];
    lowProbColors = colors;
    probabilities = {
        [highProbColor]: 0.6,
        [lowProbColors[0]]: 0.2,
        [lowProbColors[1]]: 0.2
    };
    console.log(`Initial probabilities assigned: ${JSON.stringify(probabilities)}`);
}

function switchProbabilities() {
    const newHighProbColor = lowProbColors.splice(Math.floor(Math.random() * lowProbColors.length), 1)[0];
    lowProbColors.push(highProbColor);
    highProbColor = newHighProbColor;
    probabilities = {
        [highProbColor]: 0.6,
        [lowProbColors[0]]: 0.2,
        [lowProbColors[1]]: 0.2
    };
    console.log(`Probabilities switched: ${JSON.stringify(probabilities)}`);
}

assignProbabilities();

function getRandomColor() {
    const random = Math.random();
    if (random < probabilities[highProbColor]) {
        return highProbColor;
    } else if (random < probabilities[highProbColor] + probabilities[lowProbColors[0]]) {
        return lowProbColors[0];
    } else {
        return lowProbColors[1];
    }
}

function colorToNumber(color) {
    if (color === 'red') return 1;
    if (color === 'yellow') return 2;
    if (color === 'green') return 3;
}

function guess(color) {
    if (totalGuesses === 151) {
        // Switch probabilities after 151 trials
        switchProbabilities();
    }

    if (totalGuesses < 300) {
        const correctColor = getRandomColor();
        totalGuesses++;
        if (color === correctColor) {
            correctGuesses++;
        }
        trials.push([colorToNumber(color), colorToNumber(correctColor)]);
        updateScore();
    }
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    const trialElement = document.getElementById('trials');
    const scorePercentage = (correctGuesses / totalGuesses) * 100;
    scoreElement.innerText = `${scorePercentage.toFixed(2)}%`;
    trialElement.innerText = `Trials: ${totalGuesses}`;
}

function saveTrials() {
    let trialData = "Player: " + playerName + "\nAge: " + playerAge + "\n\n";
    trialData += "Guessed Color\tCorrect Color\n";
    trials.forEach(trial => {
        trialData += trial[0] + "\t" + trial[1] + "\n";
    });
    const blob = new Blob([trialData], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${playerName}_trials.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

// To save the trials when the window is closed or reloaded
window.onbeforeunload = saveTrials;
