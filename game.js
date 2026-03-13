// TO DO:
    // Timing stuff (start time end time)


// ---- SET UP ----

//Get canvas, context, and score output
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const score = document.getElementById('score');
const data = document.getElementById('data');

//Drawing state
let isDrawing = false;
let brushColour = 'white';
let brushSize = 3;
let feedback = 1;

let error_factor = 1; //1 for default, i think we want to show larger differences on the percentage feedback

//Drawing Data
let dRadii = [];
let accuracy;
let startRadius;
let lastSampledAngle;
const angleInterval = 5 * Math.PI / 180; //degrees
let totalRotation;

//Time Data
let elapsedTime;
let startTime;
let timerInterval;

//Get UI elements
const clearButton = document.getElementById('clearBtn');
const brushSizeSlider = document.getElementById('brushSize');
const sizeValue = document.getElementById('sizeValue');

//Draw circle in center
function drawFixedObject() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 10;
    const startradius = 3;
    const drawRadius = 200;
    
    ctx.save(); //Save current drawing state
    
    //Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fill();
    
    ctx.restore(); //Restore drawing state
    
    ctx.save(); //Save current drawing state
    
    //Draw starter circle
    ctx.beginPath();
    ctx.arc(centerX, centerY-drawRadius, startradius, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fill();
    
    ctx.restore(); //Restore drawing state
}

//Set canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawFixedObject(); //Draw object after resize
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

//Mouse event handlers
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// ---- GAME FUNCTIONS ----

function getDistance(x1, y1, x2, y2){
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx*dx + dy*dy);
}

function getAngle(x1, y1, originX, originY){
    const x = x1 - originX;
    const y = y1 - originY;
    return Math.atan2(y, x);
}

function updateScore(e) {
    const pos = getMousePos(e);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    //Check end conditions
    if (totalRotation >= 2 * Math.PI) {//if circle is complete
        stopDrawing()
        if (curTime <= 5){
            alert("WENT TOO QUICKLY!");
        }
    } 
    else if (curTime >= 20) {
        stopDrawing();
        alert("RAN OUT OF TIME!");
    }

    const angle = getAngle(pos.x, pos.y, centerX, centerY);
    let dAngle = lastSampledAngle - angle;
    if (dAngle > Math.PI) dAngle -= 2 * Math.PI;
    if (dAngle < -Math.PI) dAngle += 2 * Math.PI;
    if (dAngle < 0){
        stopDrawing();
        alert("Wrong Way");
    }

    //Record data every {angleInterval} degrees
    if (dAngle >= angleInterval){
        const distanceToCenter = getDistance(pos.x, pos.y, centerX, centerY);
        dRadii.push(distanceToCenter - startRadius);
        totalRotation += dAngle;
        lastSampledAngle = angle;

        // Record distance
        console.log(distanceToCenter);
        
        //Update feedback
        if (feedback == 1){ //Percentage Feedback
            const rms = Math.sqrt((dRadii.reduce((sum, r) => sum + r*r, 0) / dRadii.length));
            accuracy = 100*(1 - error_factor*rms / startRadius);
            score.textContent = accuracy.toFixed(2);
        } else{ //Colour Feedback
            const accuracy = Math.abs(dRadii[dRadii.length - 1] / startRadius) * 5;
            const redComp = accuracy * 255;
            const greenComp = (1 - accuracy) * 255;
            brushColour = `rgb(${redComp}, ${greenComp}, 0)`;
        }
    }
    data.textContent = `angle: ${angle}\nlast: ${lastSampledAngle}\ndAngle: ${dAngle}\ntotal: ${totalRotation}`;
}

// ---- DRAWING FUNCTIONS ----

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFixedObject(); // Redraw fixed object
}

function startDrawing(e) {
    //Reset
    clearCanvas();
    console.clear();
    isDrawing = true;
    const pos = getMousePos(e);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    totalRotation = 0;

    //Record the start of the circle
    startRadius = getDistance(pos.x, pos.y, centerX, centerY);
    lastSampledAngle = getAngle(pos.x, pos.y, centerX, centerY);
    
    //Start drawing path
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    //start timer
    startTimer();
    console.log(Date.now());
}

function draw(e) { //Function is called every time the mouse moves
    if (!isDrawing) return; //Only draws if left-click is held
    
    const pos = getMousePos(e);
    
    ctx.strokeStyle = brushColour;
    ctx.lineWidth = brushSize;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    updateScore(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function stopDrawing() {
    if (isDrawing) {
        dRadii = [];
    }
    isDrawing = false;
    ctx.beginPath();
    console.log(Date.now());
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// ---- TIMER ----
function startTimer(){
    stopTimer();
    startTime = Date.now(); //returns ms since jan 1 1970
    curTime = 0;
    timerInterval = setInterval(updateTimer, 10); //Calls updateTimer every 10 ms
}
function updateTimer(){
    curTime = (Date.now() - startTime) / 1000; //Gets curTime in seconds
}
function stopTimer(){
    if(timerInterval){
        clearInterval(timerInterval);
        timerInterval = null;
    }
}


// ---- OTHER/TEMPORARY FUNCTIONS ----

//Brush size control
brushSizeSlider.addEventListener('input', (e) => {
    brushSize = e.target.value;
    sizeValue.textContent = brushSize;
});

//Clear canvas
clearButton.addEventListener('click', clearCanvas);

//Optional: Add keyboard shortcut for clearing (press 'C')
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFixedObject(); //Redraw fixed object
    }
});
