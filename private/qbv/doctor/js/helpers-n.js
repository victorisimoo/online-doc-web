;(function(window, QB) {
    'use strict';

    /** GLOBAL */
    window.app = {};
    app.helpers = {};
    app.filter = {
        'names': 'no _1977 inkwell moon nashville slumber toaster walden'
    };
    app.network = {};

    /**
     * [Set fixed of relative position on footer]
     */
    app.helpers.setFooterPosition = function() {
        var $footer = $('.j-footer'),
            invisibleClassName = 'invisible',
            footerFixedClassName = 'footer-fixed';

        if( $(window).outerHeight() > $('.j-wrapper').outerHeight() ) {
          $footer.addClass(footerFixedClassName);
        } else {
          $footer.removeClass(footerFixedClassName);
        }

        $footer.removeClass(invisibleClassName);
    };

    app.helpers.notifyIfUserLeaveCall = function(session, userId, reason, title) {
        var userRequest = _.findWhere(app.users, {'id': +userId}),
            userCurrent = _.findWhere(app.users, {'id': +session.currentUserID});

        /** It's for p2p call */
        if(session.opponentsIDs.length === 1) {
            app.helpers.stateBoard.update({
                'title': 'p2p_call_stop',
                'property': {
                    'name': title,
                    'currentName': title,
                    'reason': reason
                }
            });
        } else {
            /** It's for groups call */

            $('.j-callee_status_' + userId).text(title);
        }
    };

    app.helpers.changeFilter = function(selector, filterName) {
        $(selector).removeClass(app.filter.names)
            .addClass( filterName );
    };

    app.helpers.getConStateName = function(num) {
        var answ;

        switch (num) {
            case QB.webrtc.PeerConnectionState.DISCONNECTED:
            case QB.webrtc.PeerConnectionState.FAILED:
            case QB.webrtc.PeerConnectionState.CLOSED:
                answ = 'DISCONNECTED';
                break;
            default:
                answ = 'CONNECTING';
        }

        return answ;
    };

    app.helpers.toggleRemoteVideoView = function(userId, action) {
      var $video = $('#remote_video_' + userId);

      if(!_.isEmpty(app.currentSession) && $video.length){
          if(action === 'show') {
              $video.parents('.j-callee').removeClass('wait');
          } else if(action === 'hide') {
              $video.parents('.j-callee').addClass('wait');
          } else if(action === 'clear') {
              /** detachMediaStream take videoElementId */
              app.currentSession.detachMediaStream('remote_video_' + userId);
              $video.parents('.j-callee').removeClass('wait');
          }
        }
    };

    /**
     * [getUui - generate a unique id]
     * @return {[string]} [a unique id]
     */
    function _getUui(identifyAppId) {
        var navigator_info = window.navigator;
        var screen_info = window.screen;
        var uid = navigator_info.mimeTypes.length;

        uid += navigator_info.userAgent.replace(/\D+/g, '');
        uid += navigator_info.plugins.length;
        uid += screen_info.height || '';
        uid += screen_info.width || '';
        uid += screen_info.pixelDepth || '';
        uid += identifyAppId;
        
        return uid;
    }

    app.helpers.join = function(data) {
        var userRequiredParams = {
            'login': data.login,
            'password': data.password
        };
        logWarning(medicalAppointmentId, "DRONLINE DOCTOR: Info de navegador: "+getBrowserInfo());
        return new Promise(function(resolve, reject) {
            QB.createSession(function(csErr, csRes){
                if(csErr) {
                    reject(csErr);
                } else {
                    /** In first trying to login */
                    QB.login(userRequiredParams, function(loginErr, loginUser){
                        if(loginErr) {
                            /** Login failed, trying to create account */
                            logSevere(medicalAppointmentId, "DRONLINE DOCTOR: Error en login de Quickblox - Info: "+JSON.stringify(loginErr));
                            /*QB.users.create({
                                'login': userRequiredParams.login,
                                'password': userRequiredParams.password,
                                'full_name': userRequiredParams.login,
                                'tag_list': data.room
                            }, function(createErr, createUser){
                                if(createErr) {
                                    console.log('[create user] Error:', createErr);
                                    reject(createErr);
                                } else {
                                    QB.login(userRequiredParams, function(reloginErr, reloginUser) {
                                        if(reloginErr) {
                                            console.log('[relogin user] Error:', reloginErr);
                                        } else {
                                            resolve(reloginUser);
                                        }
                                    });
                                }
                            });*/
                        } else {
                            /** Update info */
                            logInfo(medicalAppointmentId, "DRONLINE DOCTOR: Login de Quickblox exitoso con el usuario: "+userRequiredParams.login);
                            if(loginUser.user_tags !== data.room) {
                                QB.users.update(loginUser.id, {
                                    'tag_list': data.room
                                }, function(updateError, updateUser) {
                                    if(updateError) {
                                        infoLog('APP [update user] Error:', updateError);
                                        reject(updateError);
                                    } else {
                                        resolve(updateUser);
                                    }
                                });
                            } else {
                                resolve(loginUser);
                            }
                        }
                    });
                }
            });
        });
    };

    app.helpers.renderUsers = function() {
        return new Promise(function(resolve, reject) {
            var tpl = _.template( $('#user_tpl').html() ),
                usersHTML = '',
                users = [];

            QB.users.get({'tags': [app.caller.user_tags], 'per_page': 100}, function(err, result){
                if (err) {
                    reject(err);
                } else {
                    _.each(result.items, function(item) {
                        users.push(item.user);

                        if( item.user.id !== app.caller.id ) {
                            usersHTML += tpl(item.user);
                        }
                    });

                    if(result.items.length < 2) {
                        reject({
                            'title': 'not found',
                            'message': 'Not found users by tag'
                        });
                    } else {
                        resolve({
                            'usersHTML': usersHTML,
                            'users': users
                        });
                    }
                }
            });
        });
    };

    app.helpers.getUsersStatus = function(){
        var users = {};

        if(app.calleesAnwered.length){
            users.accepted = app.calleesAnwered;
        }

        if(app.calleesRejected.length){
            users.rejected = app.calleesRejected;
        }

        return users;
    };

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


}(window, window.QB));
