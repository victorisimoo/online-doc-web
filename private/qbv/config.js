;
(function (window) {
    var currentUrl = window.location.href;
    var parsedUrl = $.url(currentUrl);
    var qbi = parsedUrl.param('qbi');
    var res = $.parseJSON(qbi);
    medicalAppointmentId = res.medicalAppointmentId;
    var QBUsers = [
        {
            id: res.doctor.QBId
            , login: res.doctor.QBUser
            , password: res.doctor.QBPass
            , full_name: res.doctor.name
            , colour: 'FD8209'
            , type: 'doctor'
    }
        , {
            id: res.patient.QBId
            , login: res.patient.QBUser
            , password: res.patient.QBPass
            , full_name: res.patient.name
            , colour: '1765FB'
            , type:'patient'
    }
    ];
    if (typeof res.patMedicalConsultation !== 'undefined' && res.patMedicalConsultation !== null) {
        var currentUser = QBUsers[0];
        var opponentUser = QBUsers[1];
    }
    else {
        var currentUser = QBUsers[1];
        var opponentUser = QBUsers[0];
    }
    var CONFIG_bak = {
        debug: false
        , webrtc: {
            answerTimeInterval: 30
            , dialingTimeInterval: 5
            , disconnectTimeInterval: 30
            , statsReportTimeInterval: 5
        }
    }; //Original Configuration
    var CONFIG = {
        endpoints: {
            api: "apidoctoronline.quickblox.com",
            chat: "chatdoctoronline.quickblox.com"
        },
        debug: {
            mode: qbDebugMode
        }
    };
    var QBAppDefault_bak = {
        appId: 42215
        , authKey: 'Qe5emUZEy6fv43k'
        , authSecret: 'KnxOHdUC79JHV5J'
    }; //Original QB Login
    var QBAppDefault = {
        appId: 8
        , authKey: 'V2UQBTnpMVOAFkn'
        , authSecret: 'yA658mGWHu3N-Ck'  
    }
    var QBApp = QBAppDefault;
    var MESSAGES = {
        'login': ''
        , 'create_session': 'Creando una sesion...'
        , 'connect': 'Conectando'
        , 'connect_error': 'Something wrong with connect to chat. Check internet connection or user info and trying again.'
        , 'login_as': 'Inicio de sesion como '
        , 'title_login': 'Seleccione el usuario que le pertenece:'
        , 'title_callee': 'Escoga el usuario a llamar:'
        , 'calling': 'Llamando...'
        , 'webrtc_not_avaible': 'WebRTC is not available in your browser'
        , 'no_internet': 'Please check your Internet connection and try again'
    };
    window.QBApp = QBApp;
    window.CONFIG = CONFIG;
    window.QBUsers = QBUsers;
    window.MESSAGES = MESSAGES;
    window.currentUser=currentUser;
    window.opponentUser=opponentUser;
    window.medicalAppointmentId=medicalAppointmentId;
}(window));