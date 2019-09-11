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
        draw(lastX, lastY, x, y, true, document.querySelector('input[name="colorOptions"]:checked').id, document.getElementById('width').value);
    });

    canvas.addEventListener('mousemove', (e) => {
        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;

        if (mousePressed) {
            let color = document.querySelector('input[name="colorOptions"]:checked').id;
            draw(lastX, lastY, x, y, true, color, document.getElementById('width').value);
            sendDrawing(lastX, lastY, x, y, color, toolType, document.getElementById('width').value);
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

const draw = function (prevX, prevY, x, y, isDown, color, lineWidth) {
    if (isDown) {
        ctx.beginPath();
        if (toolType === 'draw') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
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

connection.on('draw', function (lastX, lastY, currentX, currentY, color, tool, lineWidth) {
    updateTool(tool)
    draw(lastX, lastY, currentX, currentY, true, color, lineWidth);
});

connection.on('receiveDraw', function (drawList) {
    drawList.forEach(x => {
        updateTool(x.tool);
        draw(x.lastX, x.lastY, x.currentX, x.currentY, true, x.color, x.lineWidth);
    });
});

const sendDrawing = (prevX, prevY, currentX, currentY, color, tool, lineWidth) => {
    connection.invoke('draw', prevX, prevY, currentX, currentY, color, tool, lineWidth)
        .catch(function (err) {
            console.error(err.toString());
        });
};