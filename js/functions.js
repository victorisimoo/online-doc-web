/**
**url: url to get resource
**params: array params
**type: post, get
*/
function getResource(url, params, type){
    var result="";
    //$("#logo").attr("src","../img/loader.gif");
    //console.log(url);
    $.ajax({
        type: type,
        url: url,
        data: params,
        async: false,
        success: function (data) { // Our returned data from PHP is stored in "data" as a JSON Object     
        result = data;
    },
    error: function (xhr, ajaxOptions, thrownError) {
            //alert(textStatus + "," + ex + "," + jqXHR.responseText);
            //console.log(xhr.responseText);
        }
    });
    return result;
}

function doPost(url, params, type){
    var result="";
    //$("#logo").attr("src","../img/loader.gif");
    //console.log(url);
    $.ajax({
        type: type,
        url: url,
        data: params,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) { // Our returned data from PHP is stored in "data" as a JSON Object     
        result = data;
    },
    error: function (xhr, ajaxOptions, thrownError) {
            //alert(textStatus + "," + ex + "," + jqXHR.responseText);
            //console.log(xhr.responseText);
        }
    });
    return result;
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

function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function getOS() {
    var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'],
    os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'MacOS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}

function getBrowser() {
    var browser;
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        browser="Opera";
    } else if (navigator.userAgent.indexOf("Edge") != -1) {
        browser="Edge";
    } else if (navigator.userAgent.indexOf("OPR") != -1) {
        browser="Opera";
    } else if (navigator.userAgent.indexOf("SamsungBrowser") != -1) {
        browser="Samsung";
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
        browser="IE";
    } else if ((navigator.userAgent.includes("MiuiBrowser"))){
        browser="Xiaomi";
    }else if (navigator.userAgent.indexOf("Chrome") != -1) {
        browser="Chrome";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
        browser="Firefox";
    } else if ((navigator.userAgent.indexOf("CriOS") != -1) || (!!document.documentMode == true)) {
        browser="Chrome";
    } else if ((navigator.userAgent.indexOf("FxiOS") != -1) || (!!document.documentMode == true)) {
        browser="Firefox";
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
        browser="Safari";
    } else {
        browser="Unknown";
    }

    return browser;
}

function getDeviceInformation(){
    return getOS() + ' ' + getBrowser() ;
}

