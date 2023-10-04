document.addEventListener("DOMContentLoaded", function() {
    const gridSize = 9;
    const checkBtn = document.getElementById("check-btn");
    checkBtn.addEventListener("click", solve);

    const sudokuGrid = document.getElementById("sudoku-grid");
    // Create the grid
    for (let row=0; row<gridSize; row++) {
        const newRow = document.createElement("tr");
        for (let col=0; col<gridSize; col++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
});

async function solve() {
    const gridSize = 9;
    const sudokuArr = [];

    // Get the values from the grid
    for (let row=0; row<gridSize; row++) {
        sudokuArr[row] = [];
        for (let col=0; col<gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArr[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
        }
    }

    //Identify user input cells
    for (let row=0; row<gridSize; row++){
        for (let col=0; col<gridSize; col++){
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);
            
            if(sudokuArr[row][col] !== 0){
                cell.classList.add("user-input");
            }
        }
    }

    //Solve the sudoku and display the solution
    if (solveSudoku(sudokuArr)){
        for (let row=0; row<gridSize; row++){
            for (let col=0; col<gridSize; col++){
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);
                
                // Fill solved values in 
                if (!cell.classList.contains("user-input")){
                    cell.value = sudokuArr[row][col];
                    cell.classList.add("solved");
                    await sleep(20);
                }
            }
        }
    }else{
        alert("Invalid Sudoku");
    }
}

function solveSudoku(board){
    const gridSize = 9;

    for (let row=0; row<gridSize; row++){
        for (let col=0; col<gridSize; col++){
            if (board[row][col] === 0){
                for (let num=1; num<=gridSize; num++){
                    if (isValid(board, row, col, num)){
                        board[row][col] = num;
                        //Recursively solve the sudoku
                        if (solveSudoku(board)){
                            return true;
                        }else{
                            //Backtrack
                            board[row][col] = 0;
                        }
                    }
                }
                return false; //No valid number found
            }
        }
    }
    return true; // All cells filled
}

function isValid(){
    const gridSize = 9;

    //Check row and column
    for(let i=0; i<gridSize; i++){
        if (board[row][i] === num || board[i][col] === num){
            return false; // Conflict
        }
    }

    //Check subgrid
    const subgridRow = Math.floor(row/3)*3;
    const subgridCol = Math.floor(col/3)*3;

    for (let i = subgridRow; i<subgridRow+3; i++){
        for (let j = subgridCol; j<subgridCol+3; j++){
            if (board[i][j] === num){
                return false; // Conflict
            }
        }
    }

    return true; // No conflict
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}