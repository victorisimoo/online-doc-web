var QBconfig = {
    credentials: {
        appId: 8,
        authKey: 'V2UQBTnpMVOAFkn',
        authSecret: 'yA658mGWHu3N-Ck'
    },
    appConfig: {
        endpoints: {
            api: "apidoctoronline.quickblox.com",
            chat: "chatdoctoronline.quickblox.com"
        },
        chatProtocol: {
            active: 2
        },
        streamManagement: {
            enable: true
        },
        debug: {
            mode: qbDebugMode,
            file: null
        }
    }
};

var appConfig = {
    dilogsPerRequers: 15,
    messagesPerRequest: 50,
    usersPerRequest: 15,
    typingTimeout: 3 // 3 seconds
};

var CONSTANTS = {
    DIALOG_TYPES: {
        CHAT: 3,
        GROUPCHAT: 2,
        PUBLICCHAT: 1
    },
    ATTACHMENT: {
        TYPE: 'image',
        BODY: '[imagen]',
        MAXSIZE: 5 * 1000000, // set 2 megabytes,
        MAXSIZEMESSAGE: 'La imagen es muy pesada. Tamaño maximo de 5 mb.'
    },
    NOTIFICATION_TYPES: {
        NEW_DIALOG: '1',
        UPDATE_DIALOG: '2'
    }
};

window.onbeforeunload = function(event) { 
    logWarning(medicalAppointmentId, 'DRONLINE PATIENT: Se ejecutó el evento window.onbeforeunload().');
    return "Seguro?";
};

history.pushState(null, null, location.href);
    window.onpopstate = function () {
        $('#closeViewer').hide();
        $("#iv-container").hide();
        history.go(1);
};

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        $('#closeViewer').hide();
        $("#iv-container").hide();
    }
};

var viewer;
$(function() {
  viewer = ImageViewer();
});

function closeViewer(){
    $('#closeViewer').hide();
    $("#iv-container").hide();
}

$('#closeViewer').hide();
$('#closeViewer').click(closeViewer);