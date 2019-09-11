// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
let mousePressed = false;
let lastX = lastY = 0;
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext("2d");
let toolType = 'draw';

const initCanvas = function () {

    canvas.addEventListener('mousedown', (e) => {
        mousePressed = true;
        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;
        draw(lastX, lastY, x, y, true, document.getElementById('color').value);
    });

    canvas.addEventListener('mousemove', (e) => {
        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;

        if (mousePressed) {
            let color = document.getElementById('color').value;
            draw(lastX, lastY, x, y, true, color);
            sendDrawing(lastX, lastY, x, y, color, toolType);
        }

        lastX = x;

        lastY = y;
    });

    canvas.addEventListener('mouseup', () => {
        mousePressed = false;
    });

    canvas.addEventListener('mouseleave', (e) => {
        mousePressed = false;
    });
}

const draw = function (prevX, prevY, x, y, isDown, color) {
    if (isDown) {
        ctx.beginPath();
        if (toolType === 'draw') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
            ctx.lineWidth = document.getElementById('width').value;
        } else {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 10;
        }
        ctx.lineJoin = "round";
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }

}

const updateTool = function (tool) {
    toolType = tool;
}

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/drawHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.start()
    .then(function () {
        console.log("Connected");
    })
    .catch(function (err) {
        return console.error(err.toString());
    });

connection.on('draw', function (lastX, lastY, currentX, currentY, color, tool) {
    updateTool(tool)
    draw(lastX, lastY, currentX, currentY, true, color);
});

connection.on('receiveDraw', function (drawList) {
    drawList.forEach(x => {
        draw(x.lastX, x.lastY, x.currentX, x.currentY, true, x.color);
    });
});

function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const sendDrawing = (prevX, prevY, currentX, currentY, color, tool) => {
    connection.invoke('draw', prevX, prevY, currentX, currentY, color, tool)
        .catch(function (err) {
            console.error(err.toString());
        });
};
