// annotate js file for annotate.html page

const VIDEO_DIR = "../static/videos/"

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

    var playButton = document.getElementById('play-button');
    playButton.onclick = function () {
        durationCanvas.getContext('2d').clearRect(0, 0, durationCanvas.width, durationCanvas.height);
        video.play();
    }
    var pauseButton = document.getElementById('pause-button');
    pauseButton.onclick = function () {
        video.pause();
    }

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

    var pencilIcon = document.getElementById('pencil-icon');
    pencilIcon.onclick = function () {
        drawMode = parseInt(pencilIcon.getAttribute("value"))
        console.log(drawMode);
    }

    var circleIcon = document.getElementById('circle-icon');
    circleIcon.onclick = function () {
        drawMode = parseInt(circleIcon.getAttribute("value"))
    }
})

