;
(function (window, QB, app, CONFIG, $, Backbone) {
    'use strict';

    $(function () {
        var sounds = {
            'call': 'callingSignal',
            'end': 'endCallSignal',
            'rington': 'ringtoneSignal'
        };
        var logs = null;
        var isAudio = false;
        var ui = {
            'income_call': '#income_call',
            'decline': '.j-decline',
            'accept': '.j-accept',
            'filterSelect': '.j-filter',
            'videoSourceFilter': '.j-video_source',
            'audioSourceFilter': '.j-audio_source',
            'insertOccupants': function () {
                var $occupantsCont = $('.j-users');

                function cb($cont, res) {
                    $cont.empty()
                    .append(res)
                    .removeClass('wait');
                }

                return new Promise(function (resolve, reject) {
                    $occupantsCont.addClass('wait');

                    app.helpers.renderUsers().then(function (res) {
                        cb($occupantsCont, res.usersHTML);
                        resolve(res.users);
                    }, function (error) {
                        cb($occupantsCont, error.message);
                        reject('Not found users by tag');
                    });
                });
            }
        };

        var call = {
            callTime: 0,
            callTimer: null,
            updTimer: function () {
                this.callTime += 1000;
                //$('#timer').removeClass('invisible').text( new Date(this.callTime).toUTCString().split(/ /)[4] );
            }
        };

        var remoteStreamCounter = 0;

        var Router = Backbone.Router.extend({
            'routes': {
                'join': 'join',
                'dashboard': 'dashboard',
                '*query': 'relocated'
            },
            'container': $('.page'),
            'relocated': function () {
                var path = app.caller ? 'dashboard' : 'join';

                app.router.navigate(path, {
                    'trigger': true
                });
            },
            'join': function () {
                /** Before use WebRTC checking WebRTC is avaible */
                if (!QB.webrtc) {
                    logWarning(medicalAppointmentId, "DRONLINE PATIENT: El navegador no soporta webRTC.");
                    alert('Error: ' + CONFIG.MESSAGES.webrtc_not_avaible);
                    sendMessage(3);
                    return;
                }

                if (!_.isEmpty(app.caller)) {
                    app.router.navigate('dashboard');
                    return false;
                }

                this.container
                .removeClass('page-dashboard')
                .addClass('page-join');

                //app.helpers.setFooterPosition();

                app.caller = {};
                app.callees = {};
                app.calleesAnwered = [];
                app.calleesRejected = [];
                app.users = [];
                app.devices = [];
            },
            'dashboard': function () {
                if (_.isEmpty(app.caller)) {
                    app.router.navigate('join', {
                        'trigger': true
                    });
                    return false;
                }

                /** render page */
                this.container
                .removeClass('page-join')
                .addClass('page-dashboard')
                .find('.j-dashboard').empty();

                /** render skelet */
                $('.j-dashboard').append($('#dashboard_tpl').html());
                /** render stateBoard */
                app.helpers.stateBoard = new app.helpers.StateBoard('.j-state_board', {
                    title: 'tpl_default',
                    property: {
                        'tag': app.caller.user_tags,
                        'name': app.caller.full_name,
                    }
                });
                /** render users wrapper */
                $('.j-users_wrap').append($('#users_tpl').html());
                ui.insertOccupants().then(function (users) {
                    app.users = users;
                }, function (err) {
                    warningLog(err);
                });


                /** render frames */
                var framesTpl = _.template($('#frames_tpl').html());
                $('.j-board').append(framesTpl({
                    'nameUser': app.caller.full_name,
                    'refe': app.caller.full_name
                }));

                fillMediaSelects();

            }
        });

        /**
         * INIT
         */

         var CREDS = CONFIG.CREDENTIALS.prod;
         var currentUser;
         var opponentUser;
         var medicalAppointmentId;

         QB.init(
            CONFIG.CREDENTIALS.appId,
            CONFIG.CREDENTIALS.authKey,
            CONFIG.CREDENTIALS.authSecret,
            CONFIG.APP_CONFIG
            );

         /* Insert version + versionBuild to sample for QA */
         $('.j-version').text('v.' + QB.version + '.' + QB.buildNumber);
         /* Insert info about creds and endpoints */
         let configTxt = 'Uses: ' + JSON.stringify(CONFIG.CREDENTIALS) + ',';
         configTxt += ' endpoints: ' + (CONFIG.APP_CONFIG.endpoints ? JSON.stringify(CONFIG.APP_CONFIG.endpoints) : 'test server');
         $('.j-config').text(configTxt);

         var statesPeerConn = _.invert(QB.webrtc.PeerConnectionState);

         app.router = new Router();
         Backbone.history.start();

        /**
         * JOIN
         */
         $(document).ready(function () {
            currentUser = CONFIG.currentUser;
            opponentUser = CONFIG.opponentUser;
            medicalAppointmentId = CONFIG.medicalAppointmentId;

            /** Check internet connection */
            if (!window.navigator.onLine) {
                alert(CONFIG.MESSAGES['no_internet']);
                return false;
            }

            var data = _.object(["login", "password", "room"], [currentUser.login, currentUser.password, ("DrOnline" + medicalAppointmentId)]);

            if (localStorage.getItem('isAuth')) {
                localStorage.removeItem('isAuth');
            }
            if (localStorage.getItem('data')) {
                localStorage.removeItem('data');
            }

            localStorage.setItem('data', JSON.stringify(data));

            app.helpers.join(data).then(function (user) {
                app.caller = user;
                QB.chat.connect({
                    jid: QB.chat.helpers.getUserJid(app.caller.id, CONFIG.CREDENTIALS.appId),
                    password: currentUser.password
                }, function (err, res) {
                    if (err) {
                        logSevere(medicalAppointmentId, "DRONLINE PATIENT: Error en QB.chat.connect: " + JSON.stringify(err));
                        if (!_.isEmpty(app.currentSession)) {
                            logInfo(medicalAppointmentId, "DRONLINE PATIENT: Se detiene la sesión actual.");
                            app.currentSession.stop({});
                            app.currentSession = {};
                        }

                        app.helpers.changeFilter('#localVideo', 'no');
                        app.helpers.changeFilter('#main_video', 'no');
                        app.mainVideo = 0;

                        $(ui.filterSelect).val('no');
                        app.calleesAnwered = [];
                        app.calleesRejected = [];
                        if (call.callTimer) {
                            $('#timer').addClass('invisible');
                            clearInterval(call.callTimer);
                            call.callTimer = null;
                            call.callTime = 0;
                            app.helpers.network = {};
                        }
                    } else {
                        localStorage.setItem('isAuth', true);
                        logInfo(medicalAppointmentId, "DRONLINE PATIENT: Se carga la estructura de videollamada de Quickblox.");
                        app.router.navigate('dashboard', {
                            trigger: true
                        });
                    }
                });
            }).catch(function (error) {
                console.error(error);
            });

            return false;
        });

        /**
         * DASHBOARD
         */

         /** DECLINE */
         $(document).on('click', '.j-decline', function () {
            if (!_.isEmpty(app.currentSession)) {
                app.currentSession.reject({});

                logWarning(medicalAppointmentId, "PATIENT: Rechazó la llamada entrante.");
                $(ui.income_call).modal('hide');
                document.getElementById(sounds.rington).pause();
                sendMessage(3);
            }
            //enviar cancelacion de consulta
        });

         /** ACCEPT */
         $(document).on('click', '.j-accept', function () {
            var $videoSourceFilter = $(ui.videoSourceFilter),
            $audioSourceFilter = $(ui.audioSourceFilter),
            mediaParams;

            mediaParams = {
                audio: {
                    deviceId: $audioSourceFilter.val() ? $audioSourceFilter.val() : undefined
                },
                video: {
                    deviceId: $videoSourceFilter.val() ? $videoSourceFilter.val() : undefined
                },
                elemId: 'localVideo',
                options: {
                    muted: true,
                    mirror: true
                }
            };

            logInfo(medicalAppointmentId, "PATIENT: Acepto la llamada entrante.");
            $(ui.income_call).modal('hide');
            logInfo(medicalAppointmentId, "DRONLINE PATIENT: Se oculta modal de confirmación.");
            document.getElementById(sounds.rington).pause();
            var isAudio = false;
            var videoElems = '';
            app.currentSession.getUserMedia(mediaParams, function (err, stream) {
                if (err || !stream.getAudioTracks().length || (isAudio ? false : !stream.getVideoTracks().length)) {
                    console.error(err);
                    if(!stream.getAudioTracks().length){
                        logWarning(medicalAppointmentId, "DRONLINE PATIENT: Error en obtener dispositivo de audio - "+JSON.stringify(err));
                    }
                    if(!stream.getVideoTracks().length){
                        logWarning(medicalAppointmentId, "DRONLINE PATIENT: Error en obtener dispositivo de video - "+JSON.stringify(err));
                    }
                    if(err){
                        logWarning(medicalAppointmentId, "DRONLINE PATIENT: Recursos (cámara or micrófono) no fueron encontrados. Proceso de currentSession.getUserMedia: "+JSON.stringify(err));
                    }
                    logWarning(medicalAppointmentId, "DRONLINE PATIENT: Se finaliza la consulta por falta de recursos: "+JSON.stringify(err));
                    app.currentSession.stop({});

                    app.helpers.stateBoard.update({
                        'title': 'tpl_device_not_found',
                        'isError': 'qb-error',
                        'property': {
                            'name': app.caller.full_name
                        }
                    });
                } else {
                    var opponents = [app.currentSession.initiatorID],
                    compiled = _.template($('#callee_video').html());

                    $('.j-actions').addClass('hangup');
                    $(ui.bandwidthSelect).attr('disabled', true);

                    /** get all opponents */
                    app.currentSession.opponentsIDs.forEach(function (userID, i, arr) {
                        if (userID != app.currentSession.currentUserID) {
                            opponents.push(userID);
                        }
                    });
                    opponents.forEach(function (userID, i, arr) {

                        var peerState = app.currentSession.connectionStateForUser(userID),
                        userInfo = _.findWhere(app.users, {
                            'id': +userID
                        });
                        if ((document.getElementById('remote_video_' + userID) === null)) {
                            videoElems += compiled({
                                'userID': userID,
                                'name': userInfo ? userInfo.full_name : 'userID ' + userID,
                                'state': app.helpers.getConStateName(peerState)
                            });
                            if (peerState === QB.webrtc.PeerConnectionState.CLOSED) {
                                app.helpers.toggleRemoteVideoView(userID, 'clear');
                            }
                        }
                    });
                    $('.j-callees').append(videoElems);
                    app.helpers.stateBoard.update({
                        'title': 'tpl_during_call',
                        'property': {
                            'name': app.caller.full_name
                        }
                    });
                    app.currentSession.accept({});
                }
            });
        });

/** CHANGE FILTER */
$(document).on('change', ui.filterSelect, function () {
    var filterName = $.trim($(this).val());

    app.helpers.changeFilter('#localVideo', filterName);

    if (!_.isEmpty(app.currentSession)) {
        app.currentSession.update({
            'filter': filterName
        });
    }
});

$(document).on('change', ui.videoSourceFilter, function () {
    switchMediaTracks();
});

$(document).on('change', ui.audioSourceFilter, function () {
    switchMediaTracks();
});


/** CHANGE SOURCE */
$(document).on('click', '.j-confirm_media', function () {
    switchMediaTracks();
});

$(document).on('click', '.j-callees__callee__video', function () {
    var $that = $(this),
    userId = +($(this).data('user')),
    activeClass = [];

    if (app.currentSession.peerConnections[userId].stream && !$that.srcObject) {
        if ($that.hasClass('active')) {
            $that.removeClass('active');

            app.currentSession.detachMediaStream('main_video');
            app.helpers.changeFilter('#main_video', 'no');
            app.mainVideo = 0;
            remoteStreamCounter = 0;
        } else {
            $('.j-callees__callee_video').removeClass('active');
            $that.addClass('active');

            app.helpers.changeFilter('#main_video', 'no');

            activeClass = _.intersection($that.attr('class').split(/\s+/), app.filter.names.split(/\s+/));

            /** set filter to main video if exist */
            if (activeClass.length) {
                app.helpers.changeFilter('#main_video', activeClass[0]);
            }

            app.currentSession.attachMediaStream('main_video', app.currentSession.peerConnections[userId].stream);
            app.mainVideo = userId;
        }
    }
});

$(document).on('click', '.j-caller__ctrl', function () {
    var $btn = $(this),
    isActive = $btn.hasClass('active');

    if (_.isEmpty(app.currentSession)) {
        return false;
    } else {
        if (isActive) {
            if ($btn.data('target') === 'video') {
                logInfo(medicalAppointmentId, "PATIENT: Encendió la cámara.");
            } else {
                logInfo(medicalAppointmentId, "PATIENT: Puso en unmute el micrófono.");
            }
            $btn.removeClass('active');
            app.currentSession.unmute($btn.data('target'));
        } else {
            if ($btn.data('target') === 'video') {
                logWarning(medicalAppointmentId, "PATIENT: Apagó la cámara.");
            } else {
                logWarning(medicalAppointmentId, "PATIENT: Puso en mute el micrófono.");
            }
            $btn.addClass('active');
            app.currentSession.mute($btn.data('target'));
        }
    }
});

/** LOGOUT */
$(document).on('click', '.j-logout', function () {
    QB.users.delete(app.caller.id, function (err, user) {
        if (!user) {
            console.error('Can\'t delete user by id: ' + app.caller.id + ' ', err);
        }

        app.caller = {};
        app.users = [];

        QB.chat.disconnect();
        localStorage.removeItem('isAuth');
        localStorage.removeItem('data');
        app.router.navigate('join', {
            'trigger': true
        });
        app.helpers.setFooterPosition();
    });
});

/** Close tab or browser */
window.onunload = unloadPage;

function unloadPage() {
    logWarning(medicalAppointmentId, "DRONLINE PATIENT: Se cerró la ventana o el navegador.");
    QB.chat.disconnect();
    localStorage.removeItem('data');
    localStorage.removeItem('isAuth');
    app.helpers.notifyIfUserLeaveCall(app.currentSession, opponentUser.id, 'disconnected', 'Disconnected');
    app.currentSession.closeConnection(opponentUser.id);
};

        /**
         * QB Event listener.
         *
         * [Recommendation]
         * We recomend use Function Declaration
         * that SDK could identify what function(listener) has error
         *
         * Chat:
         * - onDisconnectedListener
         * WebRTC:
         * - onCallListener
         * - onCallStatsReport
         * - onUpdateCallListener
         *
         * - onAcceptCallListener
         * - onRejectCallListener
         * - onUserNotAnswerListener
         *
         * - onRemoteStreamListener
         *
         * - onStopCallListener
         * - onSessionCloseListener
         * - onSessionConnectionStateChangedListener
         * 
         * - onDevicesChangeListener
         */

         QB.chat.onDisconnectedListener = function () {
            infoLog('onDisconnectedListener.');
        };

        QB.webrtc.onCallStatsReport = function onCallStatsReport(session, userId, stats, error) {
            if(debugMode){
                console.group('onCallStatsReport');
                console.log('userId: ', userId);
                console.log('session: ', session);
                console.log('stats: ', stats);
                console.groupEnd();
            }

            networkStatusLog(medicalAppointmentId, 1, stats);
            if (stats.remote.video.bitrate) {
                $('#bitrate_' + userId).text('video bitrate: ' + stats.remote.video.bitrate);
            } else if (stats.remote.audio.bitrate) {
                $('#bitrate_' + userId).text('audio bitrate: ' + stats.remote.audio.bitrate);
            }
        };

        QB.webrtc.onSessionCloseListener = function onSessionCloseListener(session) {
            logWarning(medicalAppointmentId, "DRONLINE PATIENT: Se ejecutó el evento QB.webrtc.onSessionCloseListener.");
            infoLog('onSessionCloseListener: ', session);

            document.getElementById(sounds.call).pause();
            document.getElementById(sounds.end).play();

            $('.j-actions').removeClass('hangup');
            $('.j-caller__ctrl').removeClass('active');
            $(ui.bandwidthSelect).attr('disabled', false);

            $('.j-callees').empty();
            $('.frames_callee__bitrate').hide();

            app.currentSession.detachMediaStream('main_video');
            app.currentSession.detachMediaStream('localVideo');
            logInfo(medicalAppointmentId, "DRONLINE PATIENT: Removiendo videos de pantalla.");
            remoteStreamCounter = 0;

            if (session.opponentsIDs.length > 1) {
                app.helpers.stateBoard.update({
                    'title': 'tpl_call_stop',
                    'property': {
                        'name': app.caller.full_name
                    }
                });
            } else {
                app.helpers.stateBoard.update({
                    title: 'tpl_default',
                    property: {
                        'tag': app.caller.user_tags,
                        'name': app.caller.full_name,
                    }
                });
            }

            if (document.querySelector('.j-actions[hidden]')) {
                document.querySelector('.j-actions[hidden]').removeAttribute('hidden');
            }
            if (document.querySelector('.j-caller__ctrl')) {
                document.querySelector('.j-caller__ctrl').removeAttribute('hidden');
            }

        };

        QB.webrtc.onUserNotAnswerListener = function onUserNotAnswerListener(session, userId) {
            if(debugMode){
                console.group('onUserNotAnswerListener.');
                console.log('UserId: ', userId);
                console.log('Session: ', session);
                console.groupEnd();
            }
            logWarning(medicalAppointmentId, "DRONLINE PATIENT: Se ejecutó el evento QB.webrtc.onUserNotAnswerListener.");

            var opponent = _.findWhere(app.users, {
                'id': +userId
            });

            /** It's for p2p call */
            if (session.opponentsIDs.length === 1) {
                app.helpers.stateBoard.update({
                    'title': 'p2p_call_stop',
                    'property': {
                        'name': opponent.full_name,
                        'currentName': app.caller.full_name,
                        'reason': 'not answered'
                    }
                });
            } else {
                $('.j-callee_status_' + userId).text('No Answer');
            }
        };

        QB.webrtc.onCallListener = function onCallListener(session, extension) {
            if(debugMode){
                console.group('onCallListener.');
                console.log('Session: ', session);
                console.log('Extension: ', extension);
                console.groupEnd();
            }

            app.currentSession = session;

            ui.insertOccupants().then(function (users) {
                app.users = users;
                var initiator = _.findWhere(app.users, {
                    id: session.initiatorID
                });
                app.callees = {};
                /** close previous modal */
                $(ui.income_call).modal('hide');

                $('.j-ic_initiator').text(opponentUser.full_name);

                // check the current session state
                if (app.currentSession.state !== QB.webrtc.SessionConnectionState.CLOSED) {
                    logInfo(medicalAppointmentId, "DRONLINE PATIENT: Mostrando modal de confirmación de llamada entrante.");
                    $(ui.decline).text(parent.translationPrefered.DECLINE);
                    $(ui.accept).text(parent.translationPrefered.ACEPTAR);
                    $(ui.income_call).modal('show');
                    $("#settingsButton").text(parent.translationPrefered.CERRAR);
                    document.getElementById(sounds.rington).play();
                }
            });
        };

        QB.webrtc.onRejectCallListener = function onRejectCallListener(session, userId, extension) {
            if(debugMode){
                console.group('onRejectCallListener.');
                console.log('UserId: ' + userId);
                console.log('Session: ' + session);
                console.log('Extension: ' + JSON.stringify(extension));
                console.groupEnd();
            }

            var user = _.findWhere(app.users, {
                'id': +userId
            }),
            userCurrent = _.findWhere(app.users, {
                'id': +session.currentUserID
            });

            /** It's for p2p call */
            if (session.opponentsIDs.length === 1) {
                app.helpers.stateBoard.update({
                    'title': 'p2p_call_stop',
                    'property': {
                        'name': user.full_name,
                        'currentName': userCurrent.full_name,
                        'reason': 'rejected the call'
                    }
                });
            } else {
                var userInfo = _.findWhere(app.users, {
                    'id': +userId
                });
                app.calleesRejected.push(userInfo);
                $('.j-callee_status_' + userId).text('Rejected');
            }
        };

        QB.webrtc.onStopCallListener = function onStopCallListener(session, userId, extension) {
            if(debugMode){
                console.group('onStopCallListener.');
                console.log('UserId: ', userId);
                console.log('Session: ', session);
                console.log('Extension: ', extension);
                console.groupEnd();
            }

            app.helpers.notifyIfUserLeaveCall(session, userId, 'hung up the call', 'Hung Up');
            logWarning(medicalAppointmentId, "DRONLINE PATIENT: QB.webrtc.onStopCallListener ejecutado.");
            if (recorder) {
                recorder.stop();
            }
        };

        QB.webrtc.onAcceptCallListener = function onAcceptCallListener(session, userId, extension) {
            if(debugMode){
                console.group('onAcceptCallListener.');
                console.log('UserId: ', userId);
                console.log('Session: ', session);
                console.log('Extension: ', extension);
                console.groupEnd();
            }

            var userInfo = _.findWhere(app.users, {
                'id': +userId
            }),
            filterName = $.trim($(ui.filterSelect).val());

            document.getElementById(sounds.call).pause();
            app.currentSession.update({
                'filter': filterName
            });

            /** update list of callee who take call */
            app.calleesAnwered.push(userInfo);

            if (app.currentSession.currentUserID === app.currentSession.initiatorID) {
                app.helpers.stateBoard.update({
                    'title': 'tpl_call_status',
                    'property': {
                        'users': app.helpers.getUsersStatus()
                    }
                });
            }
        };

        QB.webrtc.onRemoteStreamListener = function onRemoteStreamListener(session, userId, stream) {
            if(debugMode){
                console.group('onRemoteStreamListener.');
                console.log('userId: ', userId);
                console.log('Session: ', session);
                console.log('Stream: ', stream);
                console.groupEnd();
            }

            var state = app.currentSession.connectionStateForUser(userId),
            peerConnList = QB.webrtc.PeerConnectionState;

            if (state === peerConnList.DISCONNECTED || state === peerConnList.FAILED || state === peerConnList.CLOSED) {
                return false;
            }

            app.currentSession.peerConnections[userId].stream = stream;

            infoLog('onRemoteStreamListener add video to the video element', stream);
            logInfo(medicalAppointmentId, "DRONLINE PATIENT: Se muestra el video del doctor.");
            app.currentSession.attachMediaStream('remote_video_' + userId, stream);

            if (remoteStreamCounter === 0) {
                $('#remote_video_' + userId).click();

                app.mainVideo = userId;
                ++remoteStreamCounter;
            }

            if (!call.callTimer) {
                call.callTimer = setInterval(function () {
                    call.updTimer.call(call);
                }, 1000);
            }

            $('.frames_callee__bitrate').show();
        };

        QB.webrtc.onUpdateCallListener = function onUpdateCallListener(session, userId, extension) {
            if(debugMode){
                console.group('onUpdateCallListener.');
                console.log('UserId: ' + userId);
                console.log('Session: ' + session);
                console.log('Extension: ' + JSON.stringify(extension));
                console.groupEnd();
            }

            app.helpers.changeFilter('#remote_video_' + userId, extension.filter);

            if (+(app.mainVideo) === userId) {
                app.helpers.changeFilter('#main_video', extension.filter);
            }
        };

        QB.webrtc.onSessionConnectionStateChangedListener = function onSessionConnectionStateChangedListener(session, userId, connectionState) {
            if(debugMode){
                console.group('onSessionConnectionStateChangedListener.');
                console.log('UserID:', userId);
                console.log('Session:', session);
                console.log('Сonnection state:', connectionState, statesPeerConn[connectionState]);
                console.groupEnd();
            }

            var connectionStateName = _.invert(QB.webrtc.SessionConnectionState)[connectionState],
            $calleeStatus = $('.j-callee_status_' + userId),
            isCallEnded = false;

            if (connectionState === QB.webrtc.SessionConnectionState.CONNECTING) {
                logInfo(medicalAppointmentId, "DRONLINE PATIENT: Estado de la conexión: CONECTANDO.");
                $calleeStatus.text(connectionStateName);
            }

            if (connectionState === QB.webrtc.SessionConnectionState.CONNECTED) {
                app.helpers.toggleRemoteVideoView(userId, 'show');
                logInfo(medicalAppointmentId, "DRONLINE PATIENT: Estado de la conexión: CONECTADO.");
                $calleeStatus.text(connectionStateName);
            }

            if (connectionState === QB.webrtc.SessionConnectionState.COMPLETED) {
                app.helpers.toggleRemoteVideoView(userId, 'show');
                logInfo(medicalAppointmentId, "DRONLINE PATIENT: Estado de la conexión: COMPLETADO.");
                $calleeStatus.text('connected');
            }

            if (connectionState === QB.webrtc.SessionConnectionState.DISCONNECTED) {
                app.helpers.toggleRemoteVideoView(userId, 'hide');
                logWarning(medicalAppointmentId, "DRONLINE PATIENT: Estado de la conexión: DESCONECTADO.");
                $calleeStatus.text('disconnected');
                logWarning(medicalAppointmentId, "DRONLINE PATIENT: Se desconectó el doctor.");
            }

            if (connectionState === QB.webrtc.SessionConnectionState.CLOSED) {
                app.helpers.toggleRemoteVideoView(userId, 'clear');
                logWarning(medicalAppointmentId, "DRONLINE PATIENT: Estado de la conexión: CERRADA.");
                if (app.mainVideo === userId) {
                    $('#remote_video_' + userId).removeClass('active');

                    app.helpers.changeFilter('#main_video', 'no');
                    app.mainVideo = 0;
                }

                if (!_.isEmpty(app.currentSession)) {
                    if (Object.keys(app.currentSession.peerConnections).length === 1 || userId === app.currentSession.initiatorID) {
                        $(ui.income_call).modal('hide');
                        document.getElementById(sounds.rington).pause();
                    }
                }

                isCallEnded = _.every(app.currentSession.peerConnections, function (i) {
                    return i.iceConnectionState === 'closed';
                });

                /** remove filters */

                if (isCallEnded) {
                    app.helpers.changeFilter('#localVideo', 'no');
                    app.helpers.changeFilter('#main_video', 'no');
                    $(ui.filterSelect).val('no');

                    app.calleesAnwered = [];
                    app.calleesRejected = [];
                    app.network[userId] = null;
                }

                if (app.currentSession.currentUserID === app.currentSession.initiatorID && !isCallEnded) {
                    var userInfo = _.findWhere(app.users, {
                        'id': +userId
                    });

                    /** get array if users without user who ends call */
                    app.calleesAnwered = _.reject(app.calleesAnwered, function (num) {
                        return num.id === +userId;
                    });
                    app.calleesRejected.push(userInfo);

                    app.helpers.stateBoard.update({
                        'title': 'tpl_call_status',
                        'property': {
                            'users': app.helpers.getUsersStatus()
                        }
                    });
                }

                if (_.isEmpty(app.currentSession) || isCallEnded) {
                    if (call.callTimer) {
                        $('#timer').addClass('invisible');
                        clearInterval(call.callTimer);
                        call.callTimer = null;
                        call.callTime = 0;
                        app.helpers.network = {};
                    }
                }
            }
        };

        QB.webrtc.onDevicesChangeListener = function onDevicesChangeListeners() {
            fillMediaSelects().then(switchMediaTracks);
        };

        // private functions
        function closeConn(userId) {
            if (recorder && recorderTimeoutID) {
                recorder.stop();
            }

            app.helpers.notifyIfUserLeaveCall(app.currentSession, userId, 'disconnected', 'Disconnected');
            app.currentSession.closeConnection(userId);
        }

        function showMediaDevices(kind) {
            warningLog("showMediaDevices " + kind);
            return new Promise(function (resolve, reject) {
                QB.webrtc.getMediaDevices(kind).then(function (devices) {
                    var isVideoInput = (kind === 'videoinput'),
                    $select = isVideoInput ? $(ui.videoSourceFilter) : $(ui.audioSourceFilter);

                    $select.empty();

                    if (devices.length) {
                        for (var i = 0; i !== devices.length; ++i) {
                            var deviceInfo = devices[i],
                            option = document.createElement('option');

                            option.value = deviceInfo.deviceId;

                            if (deviceInfo.kind === kind) {
                                option.text = deviceInfo.label || (isVideoInput ? 'Camera ' : 'Mic ') + (i + 1);

                                $select.append(option);
                            }
                        }

                        $('.j-media_sources').removeClass('invisible');
                    } else {
                        errorLog("NO RECONOCE RECURSOS PARA VIDEOLLAMADA");
                        $('.j-media_sources').addClass('invisible');
                    }

                    resolve();
                }).catch(function (error) {
                    warningLog('getMediaDevices', error);

                    reject();
                });
            });
        }

        function fillMediaSelects() {
            return new Promise(function (resolve, reject) {
                navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                }).then(function (stream) {
                    showMediaDevices('videoinput').then(function () {
                        return showMediaDevices('audioinput');
                    }).then(function () {
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });

                        resolve();
                    });
                }).catch(function (error) {
                    warningLog('Video devices were shown without names (getUserMedia error)', error);

                    showMediaDevices('videoinput').then(function () {
                        return showMediaDevices('audioinput');
                    }).then(function () {
                        resolve();
                    });
                });
            });
        }

        function switchMediaTracks() {
            if (!document.getElementById('localVideo').srcObject || !app.currentSession) {
                return true;
            }

            var isAudio = false;

            var audioDeviceId = $(ui.audioSourceFilter).val() ? $(ui.audioSourceFilter).val() : undefined,
            videoDeviceId = $(ui.videoSourceFilter).val() ? $(ui.videoSourceFilter).val() : undefined,
            deviceIds = {
                audio: audioDeviceId,
                video: videoDeviceId
            };

            var cambiado = true;

            if(typeof audioDeviceId == 'undefined' || typeof videoDeviceId == 'undefined'){
                errorLog("Error al obtener dispositivos");
            }

            var callback = function (err, stream) {
                if (err || !stream.getAudioTracks().length ||
                    (isAudio ? false : !stream.getVideoTracks().length)
                    ) {
                    warningLog(medicalAppointmentId,0,"DRONLINE PATIENT: Se finalizo la consulta por falta de recursos.")
                app.currentSession.stop({});

                app.helpers.stateBoard.update({
                    'title': 'tpl_device_not_found',
                    'isError': 'qb-error',
                    'property': {
                        'name': app.caller.full_name
                    }
                });
            }
        };

        if(typeof audioDeviceId != 'undefined' && typeof videoDeviceId != 'undefined'){
            logInfo(medicalAppointmentId, "PATIENT: Tratando de cambiar dispositivos");
            app.currentSession.switchMediaTracks(deviceIds, callback);
            logInfo(medicalAppointmentId, "PATIENT: Cambió sus dispositivos.");
            var elems = document.querySelectorAll(".j-caller__ctrl");
            [].forEach.call(elems, function(el) {
                el.classList.remove("active");
            });
        }else{
            logWarning(medicalAppointmentId, "PATIENT: Trató de cambiar sus dispositivos pero no se reconocieron correctamente");
        }
        
    }
});

    // Send a message to the parent
    var sendMessage = function (type) {
        var msg = {
            reason: type
        };
        window.parent.postMessage(msg, '*');
    };
}(window, window.QB, window.app, window.CONFIG, jQuery, Backbone));