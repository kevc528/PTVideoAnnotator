// annotate js file for annotate.html page

const VIDEO_DIR = "../static/videos/"

var events = {};

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
        }

        notesList.appendChild(li);
    })
}

window.addEventListener("load", function () {
    var video = document.getElementById('video');
    var source = document.createElement('source');

    source.setAttribute('src', VIDEO_DIR + this.window.location.pathname.split('/').pop() + '.mp4');
    source.setAttribute('type', 'video/mp4');

    video.appendChild(source);

    var noteTextArea = document.getElementById('note-textarea');
    noteTextArea.onfocus = function () {
        video.pause();
    }

    var addNoteButton = document.getElementById('note-button');
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
})

