;(function(window) {
    'use strict';

    var CONFIG = {
        endpoints: {
            api: "apidoctoronline.quickblox.com",
            chat: "chatdoctoronline.quickblox.com"
        },
        debug: false,
        webrtc: {
            answerTimeInterval: 30,
            dialingTimeInterval: 5,
            disconnectTimeInterval: 35,
            statsReportTimeInterval: 5
        }
    };

    var CREDENTIALS_backup = {
        'prod': {
            'appId': 42215,
            'authKey': 'Qe5emUZEy6fv43k',
            'authSecret': 'KnxOHdUC79JHV5J'
        },
        'test': {
            'appId': 42215,
            'authKey': 'Qe5emUZEy6fv43k',
            'authSecret': 'KnxOHdUC79JHV5J'
        }
    };
    var CREDENTIALS = {
        'prod': {
            'appId': 8,
            'authKey': 'V2UQBTnpMVOAFkn',
            'authSecret': 'yA658mGWHu3N-Ck'
        },
        'test': {
            'appId': 8,
            'authKey': 'V2UQBTnpMVOAFkn',
            'authSecret': 'yA658mGWHu3N-Ck'
        }
    };

    var MESSAGES = {
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

    window.CONFIG = {
        'CREDENTIALS': CREDENTIALS,
        'APP_CONFIG': CONFIG,
        'MESSAGES': MESSAGES
    };
}(window));
