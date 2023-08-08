if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    // Firefox 38+ seems having support of enumerateDevicesx
    navigator.enumerateDevices = function(callback) {
    	navigator.mediaDevices.enumerateDevices().then(callback);
    };
}

var MediaDevices = [];
var isHTTPs = location.protocol === 'https:';
var canEnumerate = false;

if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
	canEnumerate = true;
} else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
	canEnumerate = true;
}

var hasMicrophone = false;
var hasSpeakers = false;
var hasWebcam = false;

var isMicrophoneAlreadyCaptured = false;
var isWebcamAlreadyCaptured = false;

function checkDeviceSupport(callback) {
	if (!canEnumerate) {
		return;
	}

	if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
		navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
	}

	if (!navigator.enumerateDevices && navigator.enumerateDevices) {
		navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
	}

	if (!navigator.enumerateDevices) {
		if (callback) {
			callback();
		}
		return;
	}

	MediaDevices = [];
	navigator.enumerateDevices(function(devices) {
		devices.forEach(function(_device) {
			var device = {};
			for (var d in _device) {
				device[d] = _device[d];
			}

			if (device.kind === 'audio') {
				device.kind = 'audioinput';
			}

			if (device.kind === 'video') {
				device.kind = 'videoinput';
			}

			var skip;
			MediaDevices.forEach(function(d) {
				if (d.id === device.id && d.kind === device.kind) {
					skip = true;
				}
			});

			if (skip) {
				return;
			}

			if (!device.deviceId) {
				device.deviceId = device.id;
			}

			if (!device.id) {
				device.id = device.deviceId;
			}

			if (!device.label) {
				device.label = 'Please invoke getUserMedia once.';
				if (!isHTTPs) {
					device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.';
				}
			} else {
				if (device.kind === 'videoinput' && !isWebcamAlreadyCaptured) {
					isWebcamAlreadyCaptured = true;
				}

				if (device.kind === 'audioinput' && !isMicrophoneAlreadyCaptured) {
					isMicrophoneAlreadyCaptured = true;
				}
			}

			if (device.kind === 'audioinput') {
				hasMicrophone = true;
			}

			if (device.kind === 'audiooutput') {
				hasSpeakers = true;
			}

			if (device.kind === 'videoinput') {
				hasWebcam = true;
			}

            // there is no 'videoouput' in the spec.

            MediaDevices.push(device);
        });

		if (callback) {
			callback();
		}
	});
}

// check for microphone/camera support!
function checkDevices()
{
	checkDeviceSupport(function() {
	$( "#divAlert" ).hide();
	if(isMicrophoneAlreadyCaptured===false || isWebcamAlreadyCaptured === false)
	{
		if(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor))
		{
			navigator.webkitGetUserMedia({ video: true }, checkAudio, onError);
		}
	}
	});
}

function checkDevicesAngular()
{
	checkDeviceSupport(function() {
	$( "#divAlert" ).hide();
	//if(isMicrophoneAlreadyCaptured===false || isWebcamAlreadyCaptured === false)
	{
		//if(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor))
		{
			navigator.webkitGetUserMedia({ video: true }, checkAudioAngular, onErrorAngular);
		}
	}
	});
}

function hasDevices(){
	checkDeviceSupport(function() {
	//if(isMicrophoneAlreadyCaptured===false || isWebcamAlreadyCaptured === false)
	{
		//if(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor))
		{
			navigator.webkitGetUserMedia({ video: true }, function(){hasWebcam=true; }, function(){hasWebcam=false;});
			navigator.webkitGetUserMedia({ audio: true }, function(){hasMicrophone=true;}, function(){hasMicrophone=false;});
		}
	}
	});
}

function checkAudioAngular()
{
	navigator.webkitGetUserMedia({ audio: true }, onSuccess, onErrorAngular);
}



function onErrorAngular()
{
	console.log("On error angular");
	$( "#divAlert" ).show();
	$( "#divAlert" ).append("");
	$( "#showPayVideo" ).hide();
}



function checkAudio()
{
	navigator.webkitGetUserMedia({ audio: true }, onSuccess, onError);
}

function onSuccess()
{
	permissionsCameraMicroPhone = true;
	//console.log("¡Se tiene acceso a cámara y micrófono!");
}

function onError()
{
	$( "#divAlert" ).show();
	$( "#divAlert" ).append("");
}

function getBrowserAndVersion(){
	var ua= navigator.userAgent;
	var tem;
	var M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if(/trident/i.test(M[1])){
		tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE '+(tem[1] || '');
		}
	if(M[1]=== 'Chrome'){
		tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
		if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
		}
	M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
	return M.join(' ');
}
