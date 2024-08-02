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

let initialLoad = true;
let gameActive = true;

const playerName = prompt("Masukkan nama anda:");
const playerAge = prompt("Usia ... tahun");
const playerGender = prompt("Jenis kelamin (P/L)");

if (initialLoad) {
    alert("Selamat datang ke probabilistic game.\n\n" +
        "Sebelum bermain mohon untuk membaca dulu informasi berikut:\n" +
        "> Dalam permainan ini anda diminta untuk memilih salah satu dari warna merah, kuning, atau hijau.\n" +
        "> Jumlah tebakan benar relatif terhadap jumlah tebakan akan ditampilkan dalam nilai persen.\n" +
        "> Anda akan mendapatkan jatah 300 kali percobaan.\n\n" +
        "> Rekor tertinggi ini adalah 53.42%\n" +
        "> Nilai rata-rata 48.23%");
    initialLoad = false;
}

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
    if (!gameActive) return;

    if (totalGuesses === 150) {
        // Switch probabilities after 150 trials
        switchProbabilities();
    }

    if (totalGuesses < 300) {
        const correctColor = getRandomColor();
        totalGuesses++;
        let result = "Salah!";
        if (color === correctColor) {
            correctGuesses++;
            result = "Benar!";
        }
        trials.push([colorToNumber(color), colorToNumber(correctColor)]);
        updateScore(result);
    }

    if (totalGuesses === 300) {
        gameActive = false;
        saveTrials();
        playAgain();
    }
}

function updateScore(result) {
    const scoreElement = document.getElementById('score');
    const trialElement = document.getElementById('trials');
    const resultElement = document.getElementById('result');
    const scorePercentage = (correctGuesses / totalGuesses) * 100;
    scoreElement.innerText = `${scorePercentage.toFixed(2)}%`;
    trialElement.innerText = `Percobaan tersisa: ${300 - totalGuesses}`;
    resultElement.innerText = result;
}

function saveTrials() {
    let trialData = "Player: " + playerName + "\nUsia: " + playerAge + "\nJenis kelamin: " + playerGender + "\n\n";
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

function playAgain() {
    const playAgainDiv = document.createElement('div');
    playAgainDiv.id = 'playAgainDiv';
    playAgainDiv.className = 'play-again-container';
    playAgainDiv.innerHTML = `
        <div>
            <span>Play again?</span>
            <button onclick="restartGame(true)">Yes</button>
            <button onclick="restartGame(false)">No</button>
        </div>
    `;
    document.body.appendChild(playAgainDiv);
}

function restartGame(playAgain) {
    if (playAgain) {
        totalGuesses = 0;
        correctGuesses = 0;
        trials = [];
        gameActive = true;
        assignProbabilities();
        document.getElementById('score').innerText = '0%';
        document.getElementById('trials').innerText = 'Percobaan tersisa: 300';
        document.getElementById('result').innerText = '';
        document.getElementById('playAgainDiv').remove();
    } else {
        document.getElementById('playAgainDiv').remove();
        alert("Terima kasih telah bermain!");
    }
}

// To save the trials when the window is closed or reloaded
window.onbeforeunload = saveTrials;
