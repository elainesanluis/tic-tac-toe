const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const viewMatchBtn = document.querySelector("#viewmatch"); // Added viewMatchBtn
const PreviousBtn = document.querySelector("#Previous"); // Added PreviousBtn
const NextBtn = document.querySelector("#Next"); // Added NextBtn
const newGameBtn = document.querySelector("#newGame");
const scorecountDiv = document.querySelector("#scorecount");
// Declaring winning conditions
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let moves = []; // Array to store all moves
let currentMoveIndex = -1; // Track the current move index
let viewingMatch = false; // Flag to indicate if "View Match" has been clicked
let player1Score = 0;
let player2Score = 0;
const player1ScoreDisplay = document.getElementById("player1score");
const player2ScoreDisplay = document.getElementById("player2score");

// Function to view the current move based on the move index
function viewCurrentMove() {
  if (currentMoveIndex >= 0 && currentMoveIndex < moves.length) {
    // Reset the grid to the current move state
    cells.forEach(cell => (cell.textContent = ""));
    for (let i = 0; i <= currentMoveIndex; i++) {
      const move = moves[i];
      const cellIndex = move.cellIndex;
      const cell = cells[cellIndex];
      cell.textContent = move.player;
    }
    statusText.textContent = `${moves[currentMoveIndex].player}'s turn`;

    // Update button disabled states based on move index
    PreviousBtn.disabled = currentMoveIndex === 0;
    NextBtn.disabled = currentMoveIndex === moves.length - 1;
  }
}

// Function to go to the previous move
function previousMove() {
  if (currentMoveIndex > 0) {
    currentMoveIndex--;
    viewCurrentMove();
  }
}

// Function to go to the next move
function nextMove() {
  if (currentMoveIndex < moves.length - 1) {
    currentMoveIndex++;
    viewCurrentMove();
  }
}

// Function to view the entire match
function viewMatch() {
  viewingMatch = true;
  currentMoveIndex = -1; // Reset the move index
  nextMove(); // Go to the first move
  // Show the "Previous" and "Next" buttons
  PreviousBtn.style.display = "block";
  NextBtn.style.display = "block";
}

// Event listener for the "View Match" button
viewMatchBtn.addEventListener("click", viewMatch);

initializeGame();

function initializeGame() {
  cells.forEach(cell => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  viewMatchBtn.addEventListener("click", viewMatch); // Added event listener for viewing match
  PreviousBtn.addEventListener("click", previousMove); // Added event listener for previous move
  NextBtn.addEventListener("click", nextMove); // Added event listener for next move
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
}

function cellClicked() {
  const cellIndex = this.getAttribute("cellIndex");
  if (options[cellIndex] != "" || !running) {
    return;
  }

  updateCell(this, cellIndex);
  moves.push({ player: currentPlayer, cellIndex: cellIndex }); // Store the move in the moves array
  checkWinner();
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
  let roundWon = false;

  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA == "" || cellB == "" || cellC == "") {
      continue;
    }
    if (cellA == cellB && cellB == cellC) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
    // Show buttons
    viewMatchBtn.style.display = "block";
    restartBtn.style.display = "block";
    newGameBtn.style.display = "block";
    scorecount.style.display = "block";
    score.style.display = "none";
    // Update scores based on the winning player
    if (currentPlayer === "X") {
      player1Score++;
    } else if (currentPlayer === "O") {
      player2Score++;
    }
    // Update the score displays
    player1ScoreDisplay.textContent = `Player 1: ${player1Score}`;
    player2ScoreDisplay.textContent = `Player 2: ${player2Score}`;
  } else if (!options.includes("")) {
    statusText.textContent = `Draw!`;
    running = false;
    // Show buttons in case of a draw
    viewMatchBtn.style.display = "block";
    restartBtn.style.display = "block";
    newGameBtn.style.display = "block";
  } else {
    changePlayer();
  }
}

function restartGame() {
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `${currentPlayer}'s turn`;
  cells.forEach(cell => cell.textContent = "");
  running = true;
  moves = []; // Reset moves array on restart
}

// Event listener for the "New Game" button
newGameBtn.addEventListener("click", () => {
  // Hide other buttons
  restartBtn.style.display = "none";
  viewMatchBtn.style.display = "none";
  PreviousBtn.style.display = "none";
  NextBtn.style.display = "none";
  scorecount.style.display = "none";
  score.style.display = "block";
  newGameBtn.style.display = "none";
  // Clear scores
  player1Score = 0;
  player2Score = 0;

  // Reset moves and other game-related data
  moves = [];
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `${currentPlayer}'s turn`;
  cells.forEach(cell => cell.textContent = "");
  running = true;
});

