var medicalAppointmentId;
(function (window) {
    'use strict';
    var currentUrl = window.location.href;
    infoLog(currentUrl);
    var url = new URL(currentUrl);
    var qbi = url.searchParams.get("qbi");
    var res = JSON.parse(qbi);
    medicalAppointmentId = res.medicalAppointmentId;
    logInfo(medicalAppointmentId,"DRONLINE DOCTOR: Se reciben parametros de consulta en el iframe.");
    var currentUser;
    var QBUsers = [{
        id: res.doctor.QBId,
        login: res.doctor.QBUser,
        password: res.doctor.QBPass,
        full_name: res.doctor.name,
        type: 'doctor'
    }, {
        id: res.patient.QBId,
        login: res.patient.QBUser,
        password: res.patient.QBPass,
        full_name: res.patient.name,
        type: 'patient'
    }];

    if (typeof res.patMedicalConsultation !== 'undefined' && res.patMedicalConsultation !== null) {
        currentUser = QBUsers[0];
        var opponentUser = QBUsers[1];
    }
    else {
        currentUser = QBUsers[1];
        var opponentUser = QBUsers[0];
    }

    const MESSAGES = {
        'login': 'Login as any user on this computer and another user on another computer.',
        'create_session': 'Creating a session...',
        'connect': 'Connecting...',
        'connect_error': 'Something went wrong with the connection. Check internet connection or user info and try again.',
        'login_as': 'Logged in as ',
        'title_login': 'Choose a user to login with:',
        'title_callee': 'Choose users to call:',
        'calling': 'Calling...',
        'webrtc_not_avaible': 'WebRTC is not available in your browser',
        'no_internet': 'Please check your Internet connection and try again'
    };

    /** Test server / app by defaults */
    const creds = {
        'appId': 8,
        'authKey': 'V2UQBTnpMVOAFkn',
        'authSecret': 'yA658mGWHu3N-Ck'
    };

    const config = {
        debug: qbDebugMode,
        webrtc: {
            answerTimeInterval: 300,
            dialingTimeInterval: 5,
            disconnectTimeInterval: 900,
            statsReportTimeInterval: 10
        },
        endpoints: {
            api: "apidoctoronline.quickblox.com",
            chat: "chatdoctoronline.quickblox.com"
        }
    };

    /**
     * Could set appCreds and endpoints throw URL string by search part
     * ?appId={Number}&authKey={String}&authSecret={String}&endpoints.api={String}&endpoints.chat={String}
     */

    /**
     * Get value of key from search string of url
     * 
     * @param  {string} q - name of query
     * @returns {string|number} - value of query
     */
    function getQueryVar(q) {
        var query = window.location.search.substring(1),
            vars = query.split('&'),
            answ = null;

        vars.forEach(function (el, i) {
            var pair = el.split('=');

            if (pair[0] === q) {
                answ = pair[1];
            }
        });

        return answ;
    };

    if (getQueryVar('appId')) {
        const customCreds = {
            'appId': getQueryVar('appId'),
            'authKey': getQueryVar('authKey'),
            'authSecret': getQueryVar('authSecret')
        };

        Object.assign(creds, customCreds);
    }

    if (getQueryVar('endpoints.api')) {
        const customEndpoints = {
            'endpoints': {
                'api': getQueryVar('endpoints.api'),
                'chat': getQueryVar('endpoints.chat')
            }
        }

        Object.assign(config, customEndpoints);
    }

    window.CONFIG = {
        'CREDENTIALS': creds,
        'APP_CONFIG': config,
        'MESSAGES': MESSAGES,
        'QBUsers':QBUsers,
        'currentUser':currentUser,
        'opponentUser':opponentUser,
        'medicalAppointmentId':medicalAppointmentId
    };
}(window));