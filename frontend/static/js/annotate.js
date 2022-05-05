// annotate js file for annotate.html page

const VIDEO_DIR = "../static/videos/"
const PLAY_SRC = "https://cdn-icons-png.flaticon.com/512/727/727245.png"
const PAUSE_SRC = "https://cdn-icons-png.flaticon.com/512/1214/1214679.png"

window.addEventListener("load", function () {
    var video = document.getElementById('video');
    var source = document.createElement('source');
    source.setAttribute('src', VIDEO_DIR + this.window.location.pathname.split('/').pop() + '.mp4');
    source.setAttribute('type', 'video/mp4');
    video.appendChild(source);

    var videoDouble = document.getElementById('video-double');
    var sourceDouble = document.createElement('source');
    sourceDouble.setAttribute('src', VIDEO_DIR + this.window.location.pathname.split('/').pop() + '.mp4');
    sourceDouble.setAttribute('type', 'video/mp4');
    videoDouble.appendChild(sourceDouble);

    var durationSlider = document.getElementById('duration-slider');
    var durationLabel = document.getElementById('duration-label');
    var durationCanvas = document.getElementById('duration-canvas');

    durationSlider.value = "0";

    var playPauseButton = document.getElementById('play-pause-button');
    playPauseButton.onclick = function () {
        if (video.paused) {
            durationCanvas.getContext('2d').clearRect(0, 0, durationCanvas.width, durationCanvas.height);
            playPauseButton.src = PAUSE_SRC;
            video.play();
        } else {
            video.pause();
        }
    }

    video.addEventListener('pause', () => {
        playPauseButton.src = PLAY_SRC;
    })

    durationSlider.addEventListener('change', (event) => {
        if (video.paused) {
            var seconds = parseFloat(event.target.value) / 100 * 5;
            durationLabel.innerText = `Duration: ${Math.round(seconds * 10) / 10} seconds`
            videoDouble.currentTime = video.currentTime + seconds;
            videoDouble.play().then(_ => {
                videoDouble.pause();
                durationCanvas.getContext('2d').drawImage(videoDouble, 0, 0, durationCanvas.width, durationCanvas.height);
            })
        }
    });

    var colorPicker = document.getElementById('color-picker');
    colorPicker.addEventListener('change', (event) => {
        color = event.target.value;
    })

    var widthInput = document.getElementById('width-input');
    widthInput.addEventListener('change', (event) => {
        width = parseInt(event.target.value);
    })

    var pencilIcon = document.getElementById('pencil-icon');
    pencilIcon.onclick = function () {
        drawMode = parseInt(pencilIcon.getAttribute("value"))
    }

    var lineIcon = document.getElementById('line-icon');
    lineIcon.onclick = function () {
        drawMode = parseInt(lineIcon.getAttribute("value"))
        console.log(drawMode);
    }

    var circleIcon = document.getElementById('circle-icon');
    circleIcon.onclick = function () {
        drawMode = parseInt(circleIcon.getAttribute("value"))
    }

    var rectangleIcon = document.getElementById('rectangle-icon');
    rectangleIcon.onclick = function () {
        drawMode = parseInt(rectangleIcon.getAttribute("value"))
    }
})

