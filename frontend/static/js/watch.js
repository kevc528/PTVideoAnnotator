// annotate js file for annotate.html page

const VIDEO_DIR = "../static/videos/"
const PLAY_SRC = "https://cdn-icons-png.flaticon.com/512/727/727245.png"
const PAUSE_SRC = "https://cdn-icons-png.flaticon.com/512/1214/1214679.png"

window.addEventListener("load", function () {
    var video = document.getElementById('video');
    var source = document.createElement('source');
    var filename = this.window.location.pathname.split('/').pop();

    source.setAttribute('src', VIDEO_DIR + filename + '.mp4');
    source.setAttribute('type', 'video/mp4');
    video.appendChild(source);

    var playPauseButton = document.getElementById('play-pause-button');
    playPauseButton.onclick = function () {
        if (video.paused) {
            playPauseButton.src = PAUSE_SRC;
            video.play();
        } else {
            video.pause();
        }
    }

    video.addEventListener('pause', () => {
        playPauseButton.src = PLAY_SRC;
    })
})

