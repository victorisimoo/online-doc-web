var statesEnum = {
    'PENDING':'PENDING',
    'FINISHED':'FINISHED',
    'ERROR':'ERROR',
    'ESTABLISHED':'ESTABLISHED',
    'ESTABLISHED_PA':'ESTABLISHED',
    'ESTABLISHED_DO':'ESTABLISHED IN DOCTOR',
    'NEW':'NEW',
    'CANCELED_PA':'CANCELED BY PATIENT',
    'CANCELED_DO':'CANCELED BY DOCTOR',
    'ERROR_PA':'ERROR IN PATIENT',
    'ERROR_DO':'ERROR IN DOCTOR',
    'DENY_DO' :'DENIED BY DOCTOR',
    'OUT_OF_TIME': 'OUT OF SERVICE TIME',
    'DOC_OFFLINE' : 'CANCELLED DOCTOR OFFLINE',
    'FINISHED_DO_ERROR':'FINISHED CAUSED BY PATIENT ERROR',
    'RETRY': 'RETRYING IN PATIENT',
    'RETRY_FINISHED_PA': 'FINISHED IN SECOND TRY',
    'CLOSED_TIMEOUT':'CLOSED IN DOCTOR BY PATIENT UNREACHABLE',
    'ERROR_AUTH_DO':'ERROR ON AUTHENTICATION ON DOCTOR',
    'ERROR_AUTH_PA':'ERROR ON AUTHENTICATION ON PATIENT',
};

var errorsEnum = {
    'CAMERA':{'description':'Camera not recognized','code':'CAM01'},
    'ERROR_QBSESSION': {'description':'Cant connect with QuickBlox User','code':'QB01'}
};

function updateSessionStatus(callState, token, type, codeError='', descError=''){
    try
    {
        var url = apiURLBaseJS + "dronline-call-api/sessioncall/";
        var cookie;
        try{
            cookie = JSON.parse($.cookie("admdron"));
        }
        catch(ex){
            cookie = getCookie("admdron");
        }
        var idSessionAppointment = 1;
        var requestType = "POST";
        infoLog("state: "+callState);
        if(codeError == '' || descError == ''){
            var data = {
                id: idSessionAppointment,
                token: 1,
                state: callState,
                time: 600,
                idMedicalAppointment: medicalAppointmentId,
                typeMedicalAppointment: type,
                errors: []
            };
        }
        else{
            var data = {
                id: idSessionAppointment,
                token: 1,
                state: callState,
                time: 600,
                idMedicalAppointment: medicalAppointmentId,
                typeMedicalAppointment: type,
                errors: [{code:codeError,description:descError}]
            };
        }
        $.ajax({
            url: url,
            type: requestType,
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer ' + cookie.access_token,
            },
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (res) {                    
                infoLog("Estado actualizado!");
            }
        });
    }
    catch(err)
    {
        warningLog("Error in updateSessionStatus " + err);
    }
    
}

function updateSessionStatusVideoCall(medicalAppointmentId, callState, token){
    try
    {
        var url = apiURLBaseJS + "dronline-call-api/sessioncall/";
        var cookie;
        try{
            cookie = JSON.parse($.cookie("admdron"));
        }
        catch(ex){
            cookie = getCookie("admdron");
        }
        var idSessionAppointment = 1;
        var requestType = "POST";
        infoLog("state: "+callState);
        var data = {
            id: idSessionAppointment,
            token: 1,
            state: callState,
            time: 600,
            idMedicalAppointment: medicalAppointmentId,
            typeMedicalAppointment: 2,
            errors: []
        };
        $.ajax({
            url: url,
            type: requestType,
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer ' + cookie.access_token,
            },
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (res) {                    
                infoLog("Estado actualizado!");
            }
        });
    }
    catch(err)
    {
        warningLog("Error in updateSessionStatus " + err);
    }
    
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getBrowserInfo(){
    var navigator_info = window.navigator;
    var screen_info = window.screen;
    var navigatorString;
    navigatorString = "Browser: "+fingerprint_browser()+" - UserAgent: "+navigator_info.appVersion;
    if(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)){
        navigatorString += " / NetworkInfo - Downlink: "+navigator_info.connection.downlink;
        navigatorString += " - EffectiveType: "+navigator_info.connection.effectiveType;
    } 
    navigatorString += " / Screen: "+fingerprint_display();

    return navigatorString;
}

function fingerprint_browser(){"use strict";var e,r,t;e=null,r=null,t=null;try{return e=navigator.userAgent.toLowerCase(),/msie (\d+\.\d+);/.test(e)?(r=Number(RegExp.$1),e.indexOf("trident/6")>-1&&(r=10),e.indexOf("trident/5")>-1&&(r=9),e.indexOf("trident/4")>-1&&(r=8),t="Internet Explorer "+r):t=e.indexOf("trident/7")>-1?"Internet Explorer "+(r=11):/firefox[\/\s](\d+\.\d+)/.test(e)?"Firefox "+(r=Number(RegExp.$1)):/opera[\/\s](\d+\.\d+)/.test(e)?"Opera "+(r=Number(RegExp.$1)):/chrome[\/\s](\d+\.\d+)/.test(e)?"Chrome "+(r=Number(RegExp.$1)):/version[\/\s](\d+\.\d+)/.test(e)?"Safari "+(r=Number(RegExp.$1)):/rv[\/\s](\d+\.\d+)/.test(e)?"Mozilla "+(r=Number(RegExp.$1)):/mozilla[\/\s](\d+\.\d+)/.test(e)?"Mozilla "+(r=Number(RegExp.$1)):/binget[\/\s](\d+\.\d+)/.test(e)?"Library (BinGet) "+(r=Number(RegExp.$1)):/curl[\/\s](\d+\.\d+)/.test(e)?"Library (cURL) "+(r=Number(RegExp.$1)):/java[\/\s](\d+\.\d+)/.test(e)?"Library (Java) "+(r=Number(RegExp.$1)):/libwww-perl[\/\s](\d+\.\d+)/.test(e)?"Library (libwww-perl) "+(r=Number(RegExp.$1)):/microsoft url control -[\s](\d+\.\d+)/.test(e)?"Library (Microsoft URL Control) "+(r=Number(RegExp.$1)):/peach[\/\s](\d+\.\d+)/.test(e)?"Library (Peach) "+(r=Number(RegExp.$1)):/php[\/\s](\d+\.\d+)/.test(e)?"Library (PHP) "+(r=Number(RegExp.$1)):/pxyscand[\/\s](\d+\.\d+)/.test(e)?"Library (pxyscand) "+(r=Number(RegExp.$1)):/pycurl[\/\s](\d+\.\d+)/.test(e)?"Library (PycURL) "+(r=Number(RegExp.$1)):/python-urllib[\/\s](\d+\.\d+)/.test(e)?"Library (Python URLlib) "+(r=Number(RegExp.$1)):/appengine-google/.test(e)?"Cloud (Google AppEngine) "+(r=Number(RegExp.$1)):"Unknown",t}catch(e){return"Error"}}function fingerprint_display(){"use strict";var e,r;e=null,r=null;try{return(e=window.screen)&&(r=e.colorDepth+"|"+e.width+"|"+e.height+"|"+e.availWidth+"|"+e.availHeight),r}catch(e){return"Error"}}
