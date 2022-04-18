// annotate js file for annotate.html page

const VIDEO_DIR = "../static/videos/"

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
        var noteContent = noteTextArea.value;
        console.log(noteContent);
        noteTextArea.value = "";
    }
})

