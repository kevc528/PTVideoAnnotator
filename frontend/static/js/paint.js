var color = "red";
var mouseDownPoint;
var path = null;
var framePaths = [];

// id -> path
var eventsOnScreen = {};

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
        path = new paper.Path();
        path.strokeColor = color;
        mouseDownPoint = event.point;
    }

    tool.onMouseDrag = function (event) {
        path.add(event.point);
    }

    tool.onMouseUp = function (event) {
        if (path != null) {
            framePaths.push(path);
        }
    }

    var durationSlider = document.getElementById('duration-slider');

    var eventId = 0;

    var annotateButton = document.getElementById('annotate-button');
    annotateButton.onclick = function () {
        if (framePaths.length == 0) {
            alert("No annotations!");
            return;
        }

        var duration = Math.round(parseFloat(durationSlider.value) / 100 * 5 * 10) / 10;
        var startTime = video.currentTime;
        var endTime = startTime + duration;

        framePaths.forEach(path => {
            events.push({ "path": path.exportJSON(), "startTime": startTime, "endTime": endTime, "id": eventId++ });
            eventsOnScreen[eventId] = path
        })

        framePaths = [];

        var noteContent = noteTextArea.value === "" ? "Visual Annotation Only" : noteTextArea.value;
        var videoTime = video.currentTime;
        var noteEvent = { "type": "note", "content": noteContent, "timestamp": videoTime, "id": eventId++ };

        events.push(noteEvent);

        redisplayTimeline(video);

        noteTextArea.value = "";
    }

    video.addEventListener('timeupdate', function () {
        var currTime = video.currentTime;
        var toDisplay = events.filter(event => event.type !== "note" && event.startTime <= currTime && event.endTime >= currTime);

        toDisplay.forEach(event => {
            if (!eventsOnScreen.hasOwnProperty(event.id)) {
                drawLayer.activate();
                eventsOnScreen[event.id] = new paper.Path();
                eventsOnScreen[event.id].importJSON(event.path);
            }
        })

        for (var id in eventsOnScreen) {
            var match;

            toDisplay.forEach(event => {
                if (event.id === parseInt(id)) {
                    match = true;
                }
            })
            if (!match) {
                eventsOnScreen[id].remove();
                delete eventsOnScreen[id];
            }
        }
    })

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

    function redisplayTimeline(video) {

        function str_pad_left(string, pad, length) {
            return (new Array(length + 1).join(pad) + string).slice(-length);
        }

        var notesList = document.getElementById("note-list");

        while (notesList.firstChild) {
            notesList.removeChild(notesList.firstChild);
        }

        var notes = events.filter(e => e.type === "note");
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
}
