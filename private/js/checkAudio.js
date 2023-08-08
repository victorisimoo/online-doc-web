function checkAudioLevel(){
    "use strict";
    var paths = document.getElementsByTagName('path');
    var visualizer = document.getElementById('visualizer');
    var mask = visualizer.getElementById('mask');
    var path;
    var report = 0;
    
    var soundAllowed = function (stream) {
        window.persistAudioStream = stream;
        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource( stream );
        var analyser = audioContent.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = 1024;

        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        visualizer.setAttribute('viewBox', '0 0 255 255');
        for (var i = 0 ; i < 255; i++) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('stroke-dasharray', '4,1');
            mask.appendChild(path);
        }
        var doDraw = function () {
            try{
                requestAnimationFrame(doDraw);
                analyser.getByteFrequencyData(frequencyArray);
                var adjustedLength;
                for (var i = 0 ; i < 255; i++) {
                    adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
                    paths[i].setAttribute('d', 'M '+ (i) +',255 l 0,-' + adjustedLength);
                }
            }catch(ex){
                cancelAnimationFrame(doDraw);
                stream.getTracks().forEach(track => track.stop());
            }
        }
        doDraw();
    }

    var soundNotAllowed = function (error) {
        //alert("No se pudo obtener acceso al micrófono");
    }

    navigator.webkitGetUserMedia({audio:true}, soundAllowed, soundNotAllowed);
}