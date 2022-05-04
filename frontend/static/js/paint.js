var color = "red";
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

    function redisplayNotes(video) {

        function str_pad_left(string, pad, length) {
            return (new Array(length + 1).join(pad) + string).slice(-length);
        }

        var notesList = document.getElementById("note-list");

        while (notesList.firstChild) {
            notesList.removeChild(notesList.firstChild);
        }

        var notes = [];
        for (var timestamp in events) {
            events[timestamp].forEach(e => {
                if (e.type === "note") {
                    notes.push({ "timestamp": timestamp, "content": e.content })
                }
            })
        }
        notes.sort((a, b) => a.timestamp - b.timestamp);

        notes.forEach(note => {
            var li = document.createElement('li');

            var minutes = Math.floor(note.timestamp / 60);
            var seconds = Math.floor(note.timestamp - minutes * 60);

            var finalTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);

            li.innerHTML = `${finalTime}: ${note.content}`;
            li.classList.add('note-item');

            li.onclick = function () {
                video.currentTime = note.timestamp;
                video.pause();
                while (!video.paused) { }

                video.play().then(_ => {
                    video.pause();
                    var tempCanvas = document.createElement("canvas");
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    tempCanvas.getContext('2d').drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
                    var dataURL = tempCanvas.toDataURL();

                    videoLayer.activate();
                    var raster = new paper.Raster(dataURL);
                    raster.position = paper.view.center;
                    drawLayer.activate();
                });
            }

            notesList.appendChild(li);
        })
    }

    var noteTextArea = document.getElementById('note-textarea');
    noteTextArea.onfocus = function () {
        video.pause();
    }

    var addNoteButton = document.getElementById('annotation-button');
    addNoteButton.onclick = function () {
        if (noteTextArea.value === "") {
            alert("Empty note!");
            return;
        }
        var noteContent = noteTextArea.value;
        var videoTime = video.currentTime;
        var noteEvent = { "type": "note", "content": noteContent };

        if (videoTime in events) {
            events[videoTime].push(noteEvent);
        } else {
            events[videoTime] = [noteEvent];
        }

        redisplayNotes(video);

        noteTextArea.value = "";
    }
}
