// id -> path
var eventsOnScreen = {};

window.onload = function () {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');

    paper.setup(canvas);

    var videoLayer = new paper.Layer();
    var drawLayer = new paper.Layer();

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

    var tempCanvas = document.getElementById("temp-canvas");

    video.addEventListener("loadedmetadata", function (e) {
        tempCanvas.width = this.videoWidth;
        tempCanvas.height = this.videoHeight;
    }, false);

    video.addEventListener('play', function () {
        var $this = this;
        (function loop() {
            if (!$this.paused && !$this.ended) {
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

    var filename = this.window.location.pathname.split('/').pop();
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", `/events/${filename}`, false); // false for synchronous request
    xmlHttp.send(null);
    events = JSON.parse(xmlHttp.responseText)["events"];
    redisplayTimeline(video);
}
