var color = "red";
var myPath;
var otherPath;
var mouseDownPoint;

window.onload = function () {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');

    paper.setup(canvas);

    var tool = new paper.Tool();

    var videoLayer = new paper.Layer();
    var drawLayer = new paper.Layer();

    tool.onMouseDown = function (event) {
        video.pause();
        drawLayer.activate();
        myPath = new paper.Path();
        myPath.strokeColor = color;
        mouseDownPoint = event.point;
    }

    tool.onMouseDrag = function (event) {
        myPath.add(event.point);
    }

    tool.onMouseUp = function (event) {
        if (Math.abs(mouseDownPoint.x - event.point.x) < 5 &&
            Math.abs(mouseDownPoint.y - event.point.y) < 5) {
            new paper.Path.Circle({
                center: event.point,
                radius: 5,
                strokeColor: color,
                fillColor: color
            });
        }
    }

    video.addEventListener('play', function () {
        var $this = this;
        (function loop() {
            if (!$this.paused && !$this.ended) {
                var tempCanvas = document.createElement("canvas");
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                tempCanvas.getContext('2d').drawImage($this, 0, 0, tempCanvas.width, tempCanvas.height);
                var dataURL = tempCanvas.toDataURL();

                videoLayer.activate();
                var raster = new paper.Raster(dataURL);
                raster.position = paper.view.center;
                setTimeout(loop, 1000 / 30); // drawing at 30fps
                drawLayer.activate();
            }
        })();
    }, 0);
}
