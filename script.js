const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const addTextBtn = document.getElementById('addText');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const fontSizeSelect = document.getElementById('fontSize');
const fontStyleSelect = document.getElementById('fontStyle');
const applyChangesBtn = document.getElementById('applyChanges');

let undoStack = [];
let redoStack = [];
let currentText = null;

addTextBtn.addEventListener('click', () => {
    const text = prompt("Enter text:");
    if (text) {
        const fontSize = fontSizeSelect.value;
        const fontStyle = fontStyleSelect.value;

        currentText = { text, x: 50, y: 50, fontSize, fontStyle };
        addToUndoStack();
        draw();
    }
});

canvas.addEventListener('mousedown', (e) => {
    if (currentText) {
        const { x, y, fontSize } = currentText;
        const textWidth = ctx.measureText(currentText.text).width;
        const textHeight = parseInt(fontSize, 10); // Approximate height based on font size

        if (e.offsetX >= x && e.offsetX <= x + textWidth && e.offsetY >= y - textHeight && e.offsetY <= y) {
            canvas.addEventListener('mousemove', moveText);
            canvas.addEventListener('mouseup', () => {
                canvas.removeEventListener('mousemove', moveText);
            });
        }
    }
});

function moveText(e) {
    currentText.x = e.offsetX;
    currentText.y = e.offsetY;
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentText) {
        ctx.font = `${currentText.fontSize}px ${currentText.fontStyle}`;
        ctx.fillText(currentText.text, currentText.x, currentText.y);
    }
}

function addToUndoStack() {
    undoStack.push(JSON.stringify(currentText));
    redoStack = [];
}

undoBtn.addEventListener('click', () => {
    if (undoStack.length > 0) {
        redoStack.push(undoStack.pop());
        currentText = undoStack.length > 0 ? JSON.parse(undoStack[undoStack.length - 1]) : null;
        draw();
    }
});

redoBtn.addEventListener('click', () => {
    if (redoStack.length > 0) {
        currentText = JSON.parse(redoStack.pop());
        undoStack.push(JSON.stringify(currentText));
        draw();
    }
});

applyChangesBtn.addEventListener('click', () => {
    if (currentText) {
        // Update the current text properties
        currentText.fontSize = fontSizeSelect.value;
        currentText.fontStyle = fontStyleSelect.value;
        
        // Add the change to the undo stack
        addToUndoStack();
        
        // Redraw the canvas
        draw();
    }
});