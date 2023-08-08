;
(function (window, $) {
    'use strict';
    $(function () {
        var ui = {
            $usersTitle: $('.j-users__title'),
            $usersList: $('.j-users__list'),
            $panel: $('.j-pl'),
            $callees: $('.j-callees'),
            $btnCall: $('.j-call'),
            $btnHangup: $('.j-hangup'),
            $ctrlBtn: $('.j-caller__ctrl'),
            filterClassName: '.j-filter',
            modal: {
                'income_call': '#income_call'
            },
            sounds: {
                'call': 'callingSignal',
                'end': 'endCallSignal',
                'rington': 'ringtoneSignal'
            },
            setPositionFooter: function () {
                var $footer = $('.j-footer'),
                        invisibleClassName = 'invisible',
                        footerFixedClassName = 'footer-fixed';

                if ($(window).outerHeight() > $('.j-wrapper').outerHeight()) {
                    $footer.addClass(footerFixedClassName);
                } else {
                    $footer.removeClass(footerFixedClassName);
                }

                $footer.removeClass(invisibleClassName);
            },
            togglePreloadMain: function (action) {
                var $main = $('.j-main'),
                        preloadClassName = 'main-preload';

                if (action === 'show') {
                    $main.addClass(preloadClassName);
                } else {
                    $main.removeClass(preloadClassName);
                }
            },
            createUsers: function (users, $node) {
                var tpl = _.template($('#user_tpl').html()),
                        usersHTML = '';

                $node.empty();

                _.each(users, function (user, i, list) {
                    usersHTML += tpl(user);
                });

                $node.append(usersHTML);
            },
            showCallBtn: function () {
                //this.$btnHangup.addClass('hidden');
                this.$btnCall.removeClass('hidden');
            },
            hideCallBtn: function () {
                this.$btnHangup.removeClass('hidden');
                this.$btnCall.addClass('hidden');
            },
            toggleRemoteVideoView: function (userID, action) {
                var $video = $('#remote_video_' + userID);

                if (!_.isEmpty(app.currentSession) && $video.length) {
                    if (action === 'show') {
                        $video.parents('.j-callee').removeClass('callees__callee-wait');
                    } else if (action === 'hide') {
                        $video.parents('.j-callee').addClass('callees__callee-wait');
                    } else if (action === 'clear') {
                        /** detachMediaStream take videoElementId */
                        app.currentSession.detachMediaStream('remote_video_' + userID);
                        $video.removeClass('fw-video-wait');
                    }
                }
            },
            classesNameFilter: 'no aden reyes perpetua inkwell toaster walden hudson gingham mayfair lofi xpro2 _1977 brooklyn',
            changeFilter: function (selector, filterName) {
                $(selector)
                        .removeClass(this.classesNameFilter)
                        .addClass(filterName);
            },
            callTime: 0,
            updTimer: function () {
                this.callTime += 1000;

                $('#timer').removeClass('hidden')
                        .text(new Date(this.callTime).toUTCString().split(/ /)[4]);
            }
        },
        app = {
            caller: {},
            callees: {},
            currentSession: {},
            mainVideo: 0
        },
        isDeviceAccess = true,
                takedCallCallee = [],
                remoteStreamCounter = 0,
                authorizationing = false,
                callTimer,
                network = {
                    users: {}
                },
        is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

        window.app = app;

        function initializeUI(arg) {
            var params = arg || {};

            ui.createUsers(QBUsers, ui.$usersList);
            ui.$usersTitle.text(MESSAGES.title_login);
        }

        function showErrorAccessPermission(error) {
            var errorTitle = 'Error: ',
                    errorMsg = 'Failed to get access to your camera or microphone. Please check your hardware configuration.';

            if (error && error.message) {
                alert(errorTitle + error.message);
            } else {
                alert(errorTitle + errorMsg);
            }
        }

        function isBytesReceivedChanges(userId, inboundrtp) {
            var res = true,
                    inbBytesRec = inboundrtp.bytesReceived;

            if (network[userId] === undefined) {
                network[userId] = {
                    'bytesReceived': inbBytesRec
                };
            } else {
                if (network[userId].bytesReceived === inbBytesRec) {
                    res = false;
                } else {
                    network[userId] = {
                        'bytesReceived': inbBytesRec
                    };
                }
            }

            return res;
        }

        function notifyIfUserLeaveCall(session, userId, reason, title) {
            /** It's for p2p call */
            var userInfo = _.findWhere(QBUsers, {id: +userId}),
                    currentUserInfo = _.findWhere(QBUsers, {id: session.currentUserID});

            $('.j-callee_status_' + userId).text(title);
        }

        ui.setPositionFooter();
        QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, CONFIG);

        if (!QB.webrtc) {
            alert('Error: ' + window.MESSAGES.webrtc_not_avaible);
            return;
        }

        initializeUI({withoutUpdMsg: false, msg: 'login'});

        login();

        //login 
        function login() {

            var $el = $(this),
                    usersWithoutCaller = [],
                    user = {},
                    classNameCheckedUser = 'users__user-active';

            if (!window.navigator.onLine) {
            } else {
                if (_.isEmpty(app.caller)) {
                    authorizationing = true;
                    ui.togglePreloadMain('show');
                    app.caller = {
                        id: +$.trim(currentUser.id)
                        , login: $.trim(currentUser.login)
                        , password: $.trim(currentUser.password)
                        , full_name: $.trim(currentUser.full_name)
                    };
                    app.callees[opponentUser.id] = opponentUser.full_name;
                    usersWithoutCaller = _.filter(QBUsers, function (i) {
                        return i.id !== app.caller.id;
                    });

                    ui.$usersList.empty();

                    QB.chat.connect({
                        jid: QB.chat.helpers.getUserJid(app.caller.id, QBApp.appId),
                        password: app.caller.password
                    }, function (err, res) {
                        if (err !== null) {
                            app.caller = {};

                            ui.setPositionFooter();
                            ui.togglePreloadMain('hide');
                            QB.chat.disconnect();
                        } else {
                            QB.webrtc.onUpdateCallListener = function(session, userId, extension) {
                                countdown();
                            };
                            ui.createUsers(usersWithoutCaller, ui.$usersList);

                            ui.$usersTitle.text(MESSAGES.title_callee);

                            ui.$panel.removeClass('hidden');
                            ui.setPositionFooter();
                            ui.togglePreloadMain('hide');

                            if (currentUser.type === 'doctor') {
                                call();
                            }
                        }

                        authorizationing = false;
                    });
                } else {
                    user.id = +$.trim($el.data('id'));
                    user.name = $.trim($el.data('name'));

                    if ($el.hasClass(classNameCheckedUser)) {
                        delete app.callees[user.id];
                        $el.removeClass(classNameCheckedUser);
                    } else {
                        app.callees[user.id] = user.name;
                        $el.addClass(classNameCheckedUser);
                    }
                }
            }

            return false;
        }
        ;

        function call() {
            var videoElems = '',
                    mediaParams = {
                        audio: true,
                        video: true,
                        options: {
                            muted: true,
                            mirror: true
                        },
                        elemId: 'localVideo'
                    };

            if (!window.navigator.onLine) {
            } else {
                if (_.isEmpty(app.callees)) {
                    $('#error_no_calles').modal();
                } else {
                    app.currentSession = QB.webrtc.createNewSession(Object.keys(app.callees), QB.webrtc.CallType.VIDEO);

                    app.currentSession.getUserMedia(mediaParams, function (err, stream) {
                        if (err || !stream.getAudioTracks().length || !stream.getVideoTracks().length) {
                            var errorMsg = '';

                            if (err && err.message) {
                                errorMsg += 'Error: ' + err.message;
                            } else {
                                errorMsg += 'device_not_found';
                            }
                            app.currentSession.stop({});

                            showErrorAccessPermission(err);
                        } else {
                            app.currentSession.call({}, function (error) {
                                if (error) {
                                    console.warn(error.detail);
                                } else {
                                    var compiled = _.template($('#callee_video').html());

                                    document.getElementById(ui.sounds.call).play();

                                    Object.keys(app.callees).forEach(function (userID, i, arr) {
                                        videoElems += compiled({userID: userID, name: app.callees[userID]});
                                    });
                                    ui.$callees.append(videoElems);

                                    ui.hideCallBtn();
                                    ui.setPositionFooter();
                                }
                            });
                        }
                    });
                }
            }
        }
        ;

        $(document).on('click', '.j-hangup', function () {
            swal({
                title: "Salir",
                text: "¿Esta segúro que desea salir?",
                showCancelButton: true,
                confirmButtonColor: "#F8B73F",
                confirmButtonText: "Si, aceptar!",
                closeOnConfirm: false
            }, function () {
                if (!_.isEmpty(app.currentSession)) {
                    app.currentSession.stop({});
                    app.currentSession = {};
                }
                //logout();
            });

        });

        function accept() {
            var mediaParams = {
                audio: true,
                video: true,
                elemId: 'localVideo',
                options: {
                    muted: true,
                    mirror: true
                }
            },
            videoElems = '';

            $(ui.modal.income_call).modal('hide');

            document.getElementById(ui.sounds.rington).pause();

            app.currentSession.getUserMedia(mediaParams, function (err, stream) {
                if (err || !stream.getAudioTracks().length || !stream.getVideoTracks().length) {
                    var errorMsg = '';

                    if (err && err.message) {
                        errorMsg += 'Error: ' + err.message;
                    } else {
                        errorMsg += 'device_not_found';
                    }

                    showErrorAccessPermission(err);

                    isDeviceAccess = false;
                    app.currentSession.stop({});
                } else {
                    var opponents = [app.currentSession.initiatorID],
                            compiled = _.template($('#callee_video').html());

                    ui.hideCallBtn();

                    app.currentSession.opponentsIDs.forEach(function (userID, i, arr) {
                        if (userID != app.currentSession.currentUserID) {
                            opponents.push(userID);
                        }
                    });

                    opponents.forEach(function (userID, i, arr) {
                        var peerState = app.currentSession.connectionStateForUser(userID),
                                userInfo = _.findWhere(QBUsers, {id: userID});

                        if ((document.getElementById('remote_video_' + userID) === null)) {
                            videoElems += compiled({userID: userID, name: userInfo.full_name});

                            if (peerState === QB.webrtc.PeerConnectionState.CLOSED) {
                                ui.toggleRemoteVideoView(userID, 'clear');
                            }
                        }
                    });

                    ui.$callees.append(videoElems);
                    ui.setPositionFooter();

                    app.currentSession.accept({});
                    app.currentSession.update("");
                    countdown();
                }
            });
        }
        ;

        $(document).on('click', '.j-caller__ctrl', function () {
            var $btn = $(this),
                    isActive = $btn.hasClass('active');

            if (_.isEmpty(app.currentSession)) {
                return false;
            } else {
                if (isActive) {
                    $btn.removeClass('active');
                    app.currentSession.unmute($btn.data('target'));
                } else {
                    $btn.addClass('active');
                    app.currentSession.mute($btn.data('target'));
                }
            }
        });


        $(document).on('click', '.j-callees__callee_video', function () {
            var $that = $(this),
                    userID = +($(this).data('user')),
                    classesName = [],
                    activeClass = [];

            if (app.currentSession.peerConnections[userID].stream && !_.isEmpty($that.attr('src'))) {
                if ($that.hasClass('active')) {
                    $that.removeClass('active');

                    app.currentSession.detachMediaStream('main_video');
                    ui.changeFilter('#main_video', 'no');
                    app.mainVideo = 0;
                } else {
                    $('.j-callees__callee_video').removeClass('active');
                    $that.addClass('active');

                    ui.changeFilter('#main_video', 'no');

                    activeClass = _.intersection($that.attr('class').split(/\s+/), ui.classesNameFilter.split(/\s+/));

                    if (activeClass.length) {
                        ui.changeFilter('#main_video', activeClass[0]);
                    }
                    app.currentSession.attachMediaStream('main_video', app.currentSession.peerConnections[userID].stream);
                    app.mainVideo = userID;
                }
            }
        });

        $(document).on('change', ui.filterClassName, function () {
            var val = $.trim($(this).val());

            ui.changeFilter('#localVideo', val);

            if (!_.isEmpty(app.currentSession)) {
                app.currentSession.update({filter: val});
            }
        });

        $(window).on('resize', function () {
            ui.setPositionFooter();
        });

        //*****************************************QB Event Listener *****************************************************
        QB.chat.onDisconnectedListener = function () {
            /*
             var initUIParams = authorizationing ? {withoutUpdMsg: false, msg: 'no_internet'} : {withoutUpdMsg: false, msg: 'login'};
             
             app.caller = {};
             app.callees = [];
             app.mainVideo = 0;
             remoteStreamCounter = 0;
             
             ui.togglePreloadMain('hide');
             initializeUI(initUIParams);
             ui.$panel.addClass('hidden');
             
             $('.j-callee').remove();
             
             ui.setPositionFooter();
             authorizationing = false;*/
        };

        QB.webrtc.onCallStatsReport = function onCallStatsReport(session, userId, stats) {
            /**
             * Hack for Firefox
             * (https://bugzilla.mozilla.org/show_bug.cgi?id=852665)
             */
            /*if(is_firefox) {
             var inboundrtp = _.findWhere(stats, {type: 'inboundrtp'});
             
             if(!inboundrtp || !isBytesReceivedChanges(userId, inboundrtp)) {
             
             console.warn("This is Firefox and user " + userId + " has lost his connection.");
             
             if(!_.isEmpty(app.currentSession)) {
             app.currentSession.closeConnection(userId);
             
             notifyIfUserLeaveCall(session, userId, 'disconnected', 'Disconnected');
             }
             }
             }*/
        };

        QB.webrtc.onSessionCloseListener = function onSessionCloseListener(session) {
            //logout();
            /*
             document.getElementById(ui.sounds.call).pause();
             document.getElementById(ui.sounds.end).play();
             
             ui.showCallBtn();
             
             if (!isDeviceAccess) {
             isDeviceAccess = true;
             } else {
             if (session.opponentsIDs.length > 1) {
             }
             }
             
             
             document.getElementById('localVideo').src = '';
             
             ui.$ctrlBtn.removeClass('active');
             
             $('.j-callee').remove();
             app.currentSession.detachMediaStream('main_video');
             app.mainVideo = 0;
             remoteStreamCounter = 0;*/
        };

        QB.webrtc.onUserNotAnswerListener = function onUserNotAnswerListener(session, userId) {
            var userInfo = _.findWhere(QBUsers, {id: +userId}),
                    currentUserInfo = _.findWhere(QBUsers, {id: app.currentSession.currentUserID});

            /** It's for p2p call */
            if (session.opponentsIDs.length === 1) {
            }

            $('.j-callee_status_' + userId).text('No Answer');
        };

        QB.webrtc.onUpdateCallListener = function onUpdateCallListener(session, userId, extension) {
            ui.changeFilter('#remote_video_' + userId, extension.filter);
            if (+(app.mainVideo) === userId) {
                ui.changeFilter('#main_video', extension.filter);
            }
        };

        QB.webrtc.onCallListener = function onCallListener(session, extension) {
            $(ui.modal.income_call).modal('hide');
            var userInfo = _.findWhere(QBUsers, {id: session.initiatorID});
            app.currentSession = session;

            $('.j-ic_initiator').text(userInfo.full_name);

            document.getElementById(ui.sounds.rington).play();
            accept();
        };

        QB.webrtc.onAcceptCallListener = function onAcceptCallListener(session, userId, extension) {
            var userInfo = _.findWhere(QBUsers, {id: userId}),
                    filterName = $.trim($(ui.filterClassName).val());

            document.getElementById(ui.sounds.call).pause();

            app.currentSession.update({filter: filterName});

            takedCallCallee.push(userInfo);

            if (app.currentSession.currentUserID === app.currentSession.initiatorID) {
            }
        };

        QB.webrtc.onRejectCallListener = function onRejectCallListener(session, userId, extension) {
            var userInfo = _.findWhere(QBUsers, {id: userId}),
                    currentUserInfo = _.findWhere(QBUsers, {id: app.currentSession.currentUserID});

            /** It's for p2p call */
            if (session.opponentsIDs.length === 1) {
            }

            /** It's for groups call */
            $('.j-callee_status_' + userId).text('Rejected');
        };

        QB.webrtc.onStopCallListener = function onStopCallListener(session, userId, extension) {
            notifyIfUserLeaveCall(session, userId, 'hung up the call', 'Hung Up');
        };

        QB.webrtc.onRemoteStreamListener = function onRemoteStreamListener(session, userID, stream) {
            app.currentSession.peerConnections[userID].stream = stream;

            app.currentSession.attachMediaStream('remote_video_' + userID, stream);

            if (remoteStreamCounter === 0) {
                $('#remote_video_' + userID).click();

                app.mainVideo = userID;
                ++remoteStreamCounter;
            }

            if (!callTimer) {
                callTimer = setInterval(function () {
                    ui.updTimer.call(ui);
                }, 1000);
            }
        };

        QB.webrtc.onSessionConnectionStateChangedListener = function onSessionConnectionStateChangedListener(session, userID, connectionState) {
            var connectionStateName = _.invert(QB.webrtc.SessionConnectionState)[connectionState],
                    $calleeStatus = $('.j-callee_status_' + userID),
                    isCallEnded = false;

            //Prototype States

            if (connectionState === QB.webrtc.SessionConnectionState.CONNECTING) {
                $calleeStatus.text(connectionStateName);
                console.log("Prototype: "+connectionState+":CONNECTING");
            }

            if (connectionState === QB.webrtc.SessionConnectionState.CONNECTED) {
                ui.toggleRemoteVideoView(userID, 'show');
                $calleeStatus.text(connectionStateName);
                console.log("Prototype: "+connectionState+":CONNECTED");
            }

            if (connectionState === QB.webrtc.SessionConnectionState.COMPLETED) {
                ui.toggleRemoteVideoView(userID, 'show');
                $calleeStatus.text('connected');
                console.log("Prototype: "+connectionState+":COMPLETED");
            }

            if (connectionState === QB.webrtc.SessionConnectionState.DISCONNECTED) {
                logout();
                console.log("Prototype: "+connectionState+":DISCONNECTED");
            }

            if (connectionState === QB.webrtc.SessionConnectionState.FAILED) {
                console.log("Prototype: "+connectionState+":FAILED");
            }

            if (connectionState === QB.webrtc.SessionConnectionState.CLOSED) {
                console.log("Prototype: "+connectionState+":CLOSED");
                ui.toggleRemoteVideoView(userID, 'clear');
                document.getElementById(ui.sounds.rington).pause();

                if (app.mainVideo === userID) {
                    $('#remote_video_' + userID).removeClass('active');

                    ui.changeFilter('#main_video', 'no');
                    app.currentSession.detachMediaStream('main_video');
                    app.mainVideo = 0;
                }

                if (!_.isEmpty(app.currentSession)) {
                    if (Object.keys(app.currentSession.peerConnections).length === 1 || userID === app.currentSession.initiatorID) {
                        $(ui.modal.income_call).modal('hide');
                    }
                }

                isCallEnded = _.every(app.currentSession.peerConnections, function (i) {
                    return i.iceConnectionState === 'closed';
                });

                /** remove filters */
                if (isCallEnded) {
                    ui.changeFilter('#localVideo', 'no');
                    ui.changeFilter('#main_video', 'no');
                    $(ui.filterClassName).val('no');

                    takedCallCallee = [];
                }

                if (app.currentSession.currentUserID === app.currentSession.initiatorID && !isCallEnded) {
                    /** get array if users without user who ends call */
                    takedCallCallee = _.reject(takedCallCallee, function (num) {
                        return num.id === +userID;
                    });

                }

                if (_.isEmpty(app.currentSession) || isCallEnded) {
                    if (callTimer) {
                        $('#timer').addClass('hidden');
                        clearInterval(callTimer);
                        callTimer = null;
                        ui.callTime = 0;

                        network = {};
                    }
                }
            }
        };

        //*****************************************END QB Event Listener *****************************************************


        function countdown() {
            var timeInMinutes = 15;
            var currentTime = Date.parse(new Date());
            var deadline = new Date(currentTime + timeInMinutes * 60 * 1000);
            var clock = document.getElementById('clockdiv');
            var timeinterval = setInterval(function () {
                var t = getTimeRemaining(deadline);
                clock.innerHTML = '<h1>' + t.minutes + ' : ' + t.seconds + '<h1/>';
                if (t.total <= 0) {
                    clearInterval(timeinterval);
                    logout();
                }
            }, 1000);
        }
        function logout() {
            if (currentUser.type === 'doctor') {
                var url = apiURLBaseJS + "dronline-doctor-api/api/doctor/end-medical-appointment";
            } else {
                var url = apiURLBaseJS + "dronline-patient-api/api/patient/end-medical-appointment";
            }
            var data = {
                medicalAppointmentId: medicalAppointmentId
            };
            var cookie = JSON.parse($.cookie("admdron"));
            $.ajax({
                url: url,
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + cookie.access_token,
                },
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function () {
                    QB.chat.disconnect();
                    if (currentUser.type === 'doctor') {
                         window.top.location.href = "../index.php#/pages/rating-doc/"+medicalAppointmentId;
                    } else {
                        window.top.location.href = "../index.php#/pages/rating/"+medicalAppointmentId;
                    }
                }
            });
        }

        function getTimeRemaining(endtime) {
            var t = Date.parse(endtime) - Date.parse(new Date());
            var seconds = Math.floor((t / 1000) % 60);
            if (seconds < 10)
                var seconds = '0' + seconds;
            var minutes = Math.floor((t / 1000 / 60) % 60);
            if (minutes < 10)
                var minutes = '0' + minutes;
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }
    });
}(window, jQuery));
