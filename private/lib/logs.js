var qbDebugMode = (debugMode) ? 1 : 0;
function infoLog(text){
    if(debugMode){
        console.log(text);
    }
};

function warningLog(text){
    if(debugMode){
        console.warn(text);
    }
};

function errorLog(text){
    if(debugMode){
        console.error(text);
    }
};
function createLog(medicalAppointmentId, isError, logText){
    var log = {
        "medicalAppointmentId": medicalAppointmentId,
        "isError": isError,
        "logText": logText
    };
    var url = apiURLBaseJS + "dronline-call-api/sessioncall/createLog";
    var xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(log));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(debugMode){
                console.log("log guardado exitosamente: "+logText);
            }
        }
    };
};

function saveLog(medicalAppointmentId, isError, logText, logType){
    try{
        var log = {
            "medicalAppointmentId": medicalAppointmentId,
            "isError": isError,
            "logText": logText,
            "logType": logType
        };
        var url = apiURLBaseJS+"dronline-call-api/sessioncall/createLog";
        var xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(log));
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(debugMode){
                    console.log("log guardado exitosamente: "+logText);
                }
            }
        };
    }catch(err){
        console.log("Error al guardar log: " + err);
    }
};

function logInfo(medicalAppointmentId, logText){
    saveLog(medicalAppointmentId,0,logText,1);
}

function logWarning(medicalAppointmentId, logText){
    saveLog(medicalAppointmentId,0,logText,2);
}

function logSevere(medicalAppointmentId, logText){
    saveLog(medicalAppointmentId,1,logText,3);
}

function networkStatusLog(medicalAppointmentId, userType, statusInfo){
    infoLog(statusInfo);
    var stats= {
        local:{
            audio: {
                bitrate: statusInfo.local.audio.bitrate,
                bytesSent: statusInfo.local.audio.bytesSent,
                packetsSent: statusInfo.local.audio.packetsSent
            },
            video: {
                framesPerSecond: statusInfo.local.video.framesPerSecond,
                bitrate: statusInfo.local.video.bitrate,
                bytesSent: statusInfo.local.video.bytesSent,
                packetsSent: statusInfo.local.audio.packetsSent
            }
        },
        remote:{
            audio: {
                bitrate: statusInfo.remote.audio.bitrate,
                bytesReceived: statusInfo.remote.audio.bytesReceived,
                packetsReceived: statusInfo.remote.audio.packetsReceived
            },
            video: {
                framesPerSecond: statusInfo.remote.video.framesPerSecond,
                bitrate: statusInfo.remote.video.bitrate,
                bytesReceived: statusInfo.remote.video.bytesReceived,
                packetsReceived: statusInfo.remote.audio.packetsReceived
            }
        }
    }
    var logs = {
        "medicalAppointmentId": medicalAppointmentId,
        "userType": userType,
        "stats": JSON.stringify(stats)
    };
    var url = apiURLBaseJS + "dronline-call-api/sessioncall/statsReportLog";
    var xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(logs));
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(debugMode){
                console.log("guardando network status info!");
            }
        }
    };
};