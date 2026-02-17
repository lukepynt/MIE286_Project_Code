// Get canvas and context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Get output
const output = document.getElementById('output');

// Drawing state
let isDrawing = false;
let currentColor = 'white';
let brushSize = 3;

// Data
let distances = [];
let accuracy;
let startDistance;

// Get UI elements
const clearButton = document.getElementById('clearBtn');
const brushSizeSlider = document.getElementById('brushSize');
const sizeValue = document.getElementById('sizeValue');

// Draw fixed object in center
function drawFixedObject() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 10;
    
    ctx.save(); // Save current drawing state
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Fill circle
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fill();
    
    ctx.restore(); // Restore drawing state
}

// Set canvas to fullscreen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawFixedObject(); // Draw object after resize
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mouse event handlers
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch support for mobile devices
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(e);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    startDistance = getDistance(pos.x, pos.y, centerX, centerY);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    updateDistance(e);
}

function stopDrawing() {
    if (isDrawing) {
        distances = [];
    }
    isDrawing = false;
    ctx.beginPath();
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function getDistance(x1, y1, x2, y2){
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx*dx + dy*dy);
}

function updateDistance(e) {
    const pos = getMousePos(e);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const distance = getDistance(pos.x, pos.y, centerX, centerY) - startDistance;
    distances.push(distance);
    const rms = Math.sqrt((distances.reduce((sum, d) => sum + d*d, 0) / distances.length));
    accuracy = 100 * (1 - rms / startDistance);
    output.textContent = accuracy.toFixed(2);
}

// Brush size control
brushSizeSlider.addEventListener('input', (e) => {
    brushSize = e.target.value;
    sizeValue.textContent = brushSize;
});

// Clear canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFixedObject(); // Redraw fixed object
});

// Optional: Add keyboard shortcut for clearing (press 'C')
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFixedObject(); // Redraw fixed object
    }
});
