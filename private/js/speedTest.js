/*
  Para poder poner este script en tu server tienes que poner tambien un archivo en tu server y saber de que tamaño es para poner la informacion en imageAddr y downloadSize.
*/

var startTime, endTime;
var downloadSize = 5616998;
var download = new Image();
var roundedDecimals = 2;
var bytesInAKilobyte = 1024;
var imageOverride = null;

function getImage() {
    return "https://webdev.doctor-online.co/doctoronline/seguros/web/img/download-test.jpg" + "?n=" + Math.random();
}

function showResults() {
  var duration = (endTime - startTime) / 1000;
  console.log(duration);

  var bitsLoaded = downloadSize * 8;
  var speedBps = ( bitsLoaded / duration ).toFixed(roundedDecimals);
  var displaySpeed = speed(speedBps);
  var color;
  if(displaySpeed.units == "Mbps"){
    if(displaySpeed.value >= 8){
        color = "dronline-color";
    } else if(displaySpeed.value >= 5){
        color = "text-warning";
    } else {
        color = "text-danger";
    }
  }
  else{
    color = "text-danger";
  }
  var results = "<h4>Tu velocidad de conexión es<h4><h2 class='"+color+"'><b>" + displaySpeed.value + " " + displaySpeed.units + "</b></h2>"

  $('#results').html(results);
}

function speed( bitsPerSecond ){
  var KBps = (bitsPerSecond / bytesInAKilobyte).toFixed(roundedDecimals);
  if ( KBps <= 1 ) return { value: bitsPerSecond, units: "Bps" };
  var MBps = (KBps / bytesInAKilobyte).toFixed(roundedDecimals);
  if ( MBps <= 1 ) return { value: KBps, units: "Kbps" };
  else return { value: MBps, units: "Mbps" };
}

function startTest() {
    download = new Image();
    startTime = endTime = null;
    duration = null;

    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
      }
      startTime = (new Date()).getTime();
      download.src = getImage();
      console.log('Speed test started');

};

var imageAddr = "https://doctor-online.co/assets/img/logo.png";
var downloadSize = 4995374; //bytes

function initiateSpeedDetection() {
    var promise = new Promise(function (resolve, reject){
        window.setTimeout(function (){
            var startTime, endTime;
            var download = new Image();
            download.onload = function () {
                endTime = (new Date()).getTime();
                showResults();
            }

            download.onerror = function (err, msg) {
                console.log("we cannot measure your internet speed");
            }
            startTime = (new Date()).getTime();
            var cacheBuster = "?nnn=" + startTime;
            download.src = imageAddr + cacheBuster;
            function showResults() {
                    var duration = (endTime - startTime) / 1000;
                    var bitsLoaded = downloadSize * 8;
                    var speedBps = (bitsLoaded / duration).toFixed(2);
                    var speedKbps = (speedBps / 1024).toFixed(2);
                    var speedMbps = (speedKbps / 1024).toFixed(2);
                    speed = "BPS: " + speedBps + " - KBPS: " + speedKbps + " - MBPS: " + speedMbps;
                     resolve(speed);
                    }
            }, 1);
        });
    return promise;
}
