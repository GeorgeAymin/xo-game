class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'x';
        this.gameActive = true;
        this.scores = {
            player: 0,
            computer: 0,
            tie: 0
        };
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.cells = document.querySelectorAll('.cell');
        this.statusElement = document.getElementById('status');
        this.restartBtn = document.getElementById('restart-btn');
        this.resetScoreBtn = document.getElementById('reset-score-btn');
        
        this.updateScoreDisplay();
        this.addEventListeners();
        this.updateStatus();
    }
    
    addEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.resetScoreBtn.addEventListener('click', () => this.resetScores());
    }
    
    handleCellClick(e) {
        const index = parseInt(e.target.dataset.index);
        
        if (this.board[index] !== '' || !this.gameActive || this.currentPlayer !== 'x') {
            return;
        }
        
        this.makeMove(index, 'x');
        
        if (this.gameActive) {
            setTimeout(() => this.computerMove(), 500);
        }
    }
    
    makeMove(index, player) {
        this.board[index] = player;
        this.cells[index].textContent = player.toUpperCase();
        this.cells[index].classList.add(player);
        
        if (this.checkWinner()) {
            this.handleGameEnd(player);
        } else if (this.isBoardFull()) {
            this.handleGameEnd('tie');
        } else {
            this.currentPlayer = player === 'x' ? 'o' : 'x';
            this.updateStatus();
        }
    }
    
    computerMove() {
        if (!this.gameActive || this.currentPlayer !== 'o') return;
        
        let move = this.findWinningMove('o') || 
                  this.findWinningMove('x') || 
                  this.findCenterMove() || 
                  this.findRandomMove();
        
        if (move !== -1) {
            this.makeMove(move, 'o');
        }
    }
    
    findWinningMove(player) {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            const line = [this.board[a], this.board[b], this.board[c]];
            
            if (line.filter(cell => cell === player).length === 2) {
                const emptyIndex = condition.find(index => this.board[index] === '');
                if (emptyIndex !== undefined) return emptyIndex;
            }
        }
        return null;
    }
    
    findCenterMove() {
        return this.board[4] === '' ? 4 : null;
    }
    
    findRandomMove() {
        const emptyCells = this.board
            .map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);
        
        return emptyCells.length > 0 ? 
            emptyCells[Math.floor(Math.random() * emptyCells.length)] : -1;
    }
    
    checkWinner() {
        return this.winningConditions.some(condition => {
            const [a, b, c] = condition;
            return this.board[a] !== '' && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }
    
    isBoardFull() {
        return this.board.every(cell => cell !== '');
    }
    
    handleGameEnd(winner) {
        this.gameActive = false;
        
        if (winner === 'x') {
            this.scores.player++;
            this.statusElement.textContent = '🎉 فزت! أحسنت!';
            this.statusElement.style.background = '#d4edda';
            this.statusElement.style.color = '#155724';
        } else if (winner === 'o') {
            this.scores.computer++;
            this.statusElement.textContent = '🤖 الكمبيوتر فاز! حاول مرة أخرى';
            this.statusElement.style.background = '#f8d7da';
            this.statusElement.style.color = '#721c24';
        } else {
            this.scores.tie++;
            this.statusElement.textContent = 'تعادل! حاول مرة أخرى';
            this.statusElement.style.background = '#fff3cd';
            this.statusElement.style.color = '#856404';
        }
        
        this.highlightWinningCells();
        this.updateScoreDisplay();
    }
    
    highlightWinningCells() {
        if (!this.checkWinner()) return;
        
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] !== '' && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                
                [a, b, c].forEach(index => {
                    this.cells[index].classList.add('winner');
                });
                break;
            }
        }
    }
    
    updateStatus() {
        if (this.gameActive) {
            this.statusElement.textContent = this.currentPlayer === 'x' ? 
                'دورك: اختر خانة' : 'الكمبيوتر يفكر...';
        }
    }
    
    updateScoreDisplay() {
        document.getElementById('player-score').textContent = this.scores.player;
        document.getElementById('computer-score').textContent = this.scores.computer;
        document.getElementById('tie-score').textContent = this.scores.tie;
    }
    
    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'x';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
        
        this.statusElement.style.background = '#e3f2fd';
        this.statusElement.style.color = '#1976d2';
        this.updateStatus();
    }
    
    resetScores() {
        this.scores = { player: 0, computer: 0, tie: 0 };
        this.updateScoreDisplay();
        this.restartGame();
    }
}

// بدء اللعبة عندما يتم تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});