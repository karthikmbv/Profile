const cells = document.querySelectorAll(".cell");
const currstatus = document.querySelector("#status");
const resetgrid = document.querySelector("#reset");
const autoreset = document.querySelector("#autoreset");
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
let currPlayer = "X";
let running = false;

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    resetgrid.addEventListener("click", resetGame);
    currstatus.textContent = `${currPlayer}'s turn`;
    running = true;
}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");
    if(options[cellIndex] != "" || !running){
        return;
    }
    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index){
    options[index] = currPlayer;
    cell.textContent = currPlayer;
}

function changePlayer(){
    currPlayer = (currPlayer == "X") ? "O" : "X";
    currstatus.textContent = `${currPlayer}'s turn`;
}

function checkWinner(){
    let roundWon = false;
    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        currstatus.textContent = `${currPlayer} wins!`;
        running = false;
    }
    else if(!options.includes("")){
        currstatus.textContent = `Draw!`;
        running = false;
    }
    else{
        changePlayer();
    }
}

function AutoReset(){
    setInterval(resetGame, 3000);
}

function resetGame(){
    currPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    currstatus.textContent = `${currPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}