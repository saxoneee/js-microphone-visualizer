var thresholdSlider = document.querySelector('#thresholdScale')
    thresholdInput = document.querySelector('#thresholdInput'),
    threshold = thresholdSlider.value;

thresholdInput.value = thresholdSlider.value;

console.log(threshold);

thresholdSlider.addEventListener('change', () => {
    console.log('sliderChange');
    thresholdInput.value = thresholdSlider.value;
    threshold = thresholdInput.value;
});

thresholdInput.addEventListener('change', () => {
    threshold = thresholdInput.value;
});

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
if (navigator.getUserMedia) {
  navigator.getUserMedia({
      audio: true
    },
    function(stream) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
            

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = () => {
            drawBarCanvas(analyser, document.querySelector("#canvas").getContext("2d"));
            drawCircleCanvas(analyser, document.querySelector("#canvasCircle").getContext("2d"));
        };
      
    },
    function(err) {
      console.log("The following error occured: " + err.name)
    });
} else {
  console.log("getUserMedia not supported");
}

function drawBarCanvas(analyser, canvasContext) {
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var values = 0;

    var length = array.length;
    for (var i = 0; i < length; i++) {
        values += (array[i]);
    }

    var average = Math.round(values / length) * threshold;

    canvasContext.clearRect(0, 0, 150, 300);
    canvasContext.fillStyle = '#BadA55';
    canvasContext.fillRect(0, 300 - average, 150, 300);
    canvasContext.fillStyle = '#fff';
    canvasContext.font = "48px impact";
    canvasContext.fillText(average, -2, 300);
}

function drawCircleCanvas(analyser, canvasContext) {
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    canvasContext.clearRect(0, 0, 300, 300);

    var circleOptions = [ {
        color: '#6f6',
        arrayElMaxValue: 50,
        lineWidth: 4
    },{
        color: '#efefef',
        arrayElMaxValue: null,
        lineWidth: 1
    }, {
        color: '#999',
        arrayElMaxValue: 30,
        lineWidth: 2
    }];

    circleOptions.forEach((opt) => {
        canvasContext.drawImage(getSubCircleCanvas(array, opt), 0, 0);
    });
}

function getSubCircleCanvas(array, options) {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    canvas.width = 300;
    canvas.height = 300;

    var values1 = 0;

    var length1 = 0;
    for (var i = 0; i < array.length; i++) {

        if(options.arrayElMaxValue == null || array[i] < options.arrayElMaxValue) {
            values1 += (array[i]);
            length1++;
        }
    }

    var average1 = Math.round(values1 / length1) * threshold;

    var centerX = 150,
        centerY = 150;

    
    context.beginPath();
    context.arc(centerX, centerY, average1, 0, 2 * Math.PI, false);
    context.lineWidth = options.lineWidth;
    context.strokeStyle = options.color;
    context.stroke();
    context.closePath();

    return canvas;
}

