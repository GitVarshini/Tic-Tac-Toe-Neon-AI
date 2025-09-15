const cells = document.querySelectorAll('.cell');
const titleHeader = document.querySelector('#titleHeader');
const xPlayerDisplay = document.querySelector('#xPlayerDisplay');
const oPlayerDisplay = document.querySelector('#oPlayerDisplay');
const restartBtn = document.querySelector('#restartBtn');
const resetScoreBtn = document.querySelector('#resetScoreBtn');
const xScoreEl = document.querySelector('#xScore');
const oScoreEl = document.querySelector('#oScore');
const drawScoreEl = document.querySelector('#drawScore');
const winnerModal = document.querySelector('#winnerModal');
const winnerMessage = document.querySelector('#winnerMessage');

let human = 'X';
let ai = 'O';
let player = 'X';
let isPauseGame = false;
let isGameStart = false;
let inputCells = Array(9).fill('');
let scores = { X:0, O:0, Draw:0 };

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// --- Cell clicks ---
cells.forEach(cell => {
    cell.addEventListener('click', () => tapCell(cell, cell.dataset.index));
});

function tapCell(cell, index){
    if(cell.textContent==='' && !isPauseGame && player===human){
        updateCell(cell,index);
        if(!checkWinner()){
            player=ai;
            setTimeout(() => bestMove(), 500);
        }
    }
}

// --- Update cell ---
function updateCell(cell,index){
    cell.textContent = player;
    inputCells[index] = player;
    cell.classList.add('placed');
    setTimeout(()=>cell.classList.remove('placed'),200);
    cell.style.color = (player==='X')? '#1892EA':'#A737FF';
}

// --- Highlight player ---
function highlightPlayer(){
    if(player==='X'){
        xPlayerDisplay.classList.add('player-active');
        oPlayerDisplay.classList.remove('player-active');
    } else {
        oPlayerDisplay.classList.add('player-active');
        xPlayerDisplay.classList.remove('player-active');
    }
}

// --- Choose X or O ---
function choosePlayer(selectedPlayer){
    if(!isGameStart){
        human = selectedPlayer;
        ai = (selectedPlayer==='X')?'O':'X';
        player = 'X';
        isGameStart = true;
        highlightPlayer();
        if(ai==='X') setTimeout(() => bestMove(),500);
    }
}

// --- Check winner ---
function checkWinner(){
    for(const [a,b,c] of winConditions){
        if(inputCells[a] && inputCells[a]===inputCells[b] && inputCells[a]===inputCells[c]){
            declareWinner([a,b,c]);
            return true;
        }
    }
    if(inputCells.every(c=>c!=='')){
        declareDraw();
        return true;
    }
    return false;
}

// --- Declare winner ---
function declareWinner(indices){
    winnerMessage.textContent = `${player} Wins!`;
    winnerModal.style.display = 'flex';
    indices.forEach(i=>cells[i].style.background='#2A2343');
    scores[player]++;
    updateScoreboard();
    isPauseGame=true;
}

// --- Declare draw ---
function declareDraw(){
    winnerMessage.textContent = 'Draw!';
    winnerModal.style.display = 'flex';
    scores.Draw++;
    updateScoreboard();
    isPauseGame=true;
}

// --- Update scoreboard ---
function updateScoreboard(){
    xScoreEl.textContent = scores.X;
    oScoreEl.textContent = scores.O;
    drawScoreEl.textContent = scores.Draw;
}

// --- Restart game ---
restartBtn.addEventListener('click',()=>{
    inputCells.fill('');
    cells.forEach(c=>{c.textContent=''; c.style.background='#17122A';});
    isPauseGame=false;
    player='X';
    highlightPlayer();
    titleHeader.textContent='Choose';
    isGameStart=false;
});

// --- Reset scores ---
resetScoreBtn.addEventListener('click',()=>{
    scores={X:0,O:0,Draw:0};
    updateScoreboard();
});

// --- Close modal ---
function closeModal(){
    winnerModal.style.display='none';
}

// --- AI using Minimax ---
function bestMove(){
    let bestScore = -Infinity;
    let move;
    inputCells.forEach((val,idx)=>{
        if(val===''){
            inputCells[idx]=ai;
            let score=minimax(inputCells,0,false);
            inputCells[idx]='';
            if(score>bestScore){ bestScore=score; move=idx; }
        }
    });
    if(move!==undefined){
        updateCell(cells[move],move);
        if(!checkWinner()){
            player=human;
        }
    }
}

const scoresMap={O:10,X:-10,Draw:0};

function minimax(board,depth,isMax){
    let result=evaluate(board);
    if(result!==null) return scoresMap[result];
    if(isMax){
        let best=-Infinity;
        board.forEach((val,idx)=>{
            if(val===''){
                board[idx]='O';
                best=Math.max(minimax(board,depth+1,false),best);
                board[idx]='';
            }
        });
        return best;
    } else {
        let best=Infinity;
        board.forEach((val,idx)=>{
            if(val===''){
                board[idx]='X';
                best=Math.min(minimax(board,depth+1,true),best);
                board[idx]='';
            }
        });
        return best;
    }
}

function evaluate(board){
    for(const [a,b,c] of winConditions){
        if(board[a] && board[a]===board[b] && board[a]===board[c]) return board[a];
    }
    if(board.every(c=>c!=='')) return 'Draw';
    return null;
}

const welcomeScreen = document.querySelector('#welcomeScreen');
const startBtn = document.querySelector('#startBtn');

startBtn.addEventListener('click', () => {
  welcomeScreen.style.display = 'none';
});

function showConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#33FFFF','#FF66CC','#FFFF66','#00FF99']
  });
}

// Call it when someone wins or draw
function declareWinner(indices) {
  titleHeader.textContent = `${player} Wins!`;
  isPauseGame = true;
  indices.forEach(i => cells[i].style.background = '#3d0044');
  scores[player]++;
  updateScoreboard();
  restartBtn.style.visibility = 'visible';
  showConfetti(); // 🎉 Confetti!
}

function declareDraw() {
  titleHeader.textContent = 'Draw!';
  isPauseGame = true;
  scores.Draw++;
  updateScoreboard();
  restartBtn.style.visibility = 'visible';
  showConfetti(); // 🎉 Confetti!
}