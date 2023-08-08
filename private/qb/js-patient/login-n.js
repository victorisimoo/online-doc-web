var resQB;
var medicalAppointmentId;
'use strict';

function Login() {
    this.isLoginPageRendered = true;
    this.isLogin = false;
}

Login.prototype.init = function(){
    var self = this;

    var currentUrl = window.location.href;
    infoLog(currentUrl);
    var url = new URL(currentUrl);
    var qbi = url.searchParams.get("qbi");
    var res = JSON.parse(qbi);
    medicalAppointmentId = res.medicalAppointmentId;
    resQB = res;
    logInfo(medicalAppointmentId, "DRONLINE PATIENT: Se reciben parametros de consulta en el iframe. QBInformation: "+qbi);

    return new Promise(function(resolve, reject) {
        var user = localStorage.getItem('user');
        if(user && !app.user){
            var savedUser = JSON.parse(user);
            app.room = savedUser.tag_list;
            self.login(savedUser)
                .then(function(){
                    resolve(true);
                }).catch(function(error){
                reject(error);
            });
        } else {
            resolve(false);
        }
    });
        
    
};

Login.prototype.login = function (user) {
    var self = this;
    return new Promise(function(resolve, reject) {
        logInfo(medicalAppointmentId, "DRONLINE PATIENT: Empezando proceso de login con QB");
        self.renderLoadingPage();
        QB.createSession(function(csErr, csRes) {
            var userRequiredParams = {
                'login':user.login,
                'password': user.password
            };
            if (csErr) {
                logSevere(medicalAppointmentId,"DRONLINE PATIENT: Error en la creacion de la sesion en QB.createSession().");
                loginError(csErr);
            } else {
                logInfo(medicalAppointmentId, "DRONLINE PATIENT: Se creó la sesion de chat exitosamente en QB.createSession().");
                app.token = csRes.token;
                QB.login(userRequiredParams, function(loginErr, loginUser){
                    if(loginErr) {
                        logSevere(medicalAppointmentId,"Error en QB.login - login: "+user.login+" - password: "+user.password+" - INFO: "+JSON.stringify(loginErr));
                        /** Login failed, trying to create account */
                        //Reintento de login con credenciales quemadas.
                        sendMessage(2);
                    } else {
                        logInfo(medicalAppointmentId,"DRONLINE PATIENT: Login de Quickblox exitoso con el usuario: "+user.login+" - QBId: "+resQB.patient.QBId);
                        /** Update info */
                        if(loginUser.user_tags !== user.tag_list || loginUser.full_name !== user.full_name) {
                            QB.users.update(loginUser.id, {
                                'tag_list': user.tag_list,
                                'full_name': loginUser.full_name,
                            }, function(updateError, updateUser) {
                                if(updateError) {
                                    loginError(updateError);
                                } else {
                                    loginSuccess(updateUser);
                                }
                            });
                        } else {
                            loginSuccess(loginUser);
                        }
                    }
                });
            }
        });

        function loginSuccess(userData){
            app.user = userModule.addToCache(userData);
            app.user.user_tags = userData.user_tags;
            QB.chat.connect({userId: app.user.id, password: user.password}, function(err, roster){
                if (err) {
                    console.error(err);
                    logSevere(medicalAppointmentId, "DRONLINE PATIENT: Error en QB.chat.connect: "+JSON.stringify(err));
                    reject(err);
                } else {
                    self.isLogin = true;
                    logInfo(medicalAppointmentId, "DRONLINE PATIENT: Conexión exitosa en QuickBlox chat.");
                    resolve();
                }
            });
        }

        function loginError(error){
            self.renderLoginPage();
            console.error(error);
            logSevere(medicalAppointmentId, "DRONLINE PATIENT: loginError: "+error);
            alert(error + "\n" + error.detail);
            reject(error);
            return false;
        }
    });
    
};

Login.prototype.renderLoginPage = function(){
    helpers.clearView(app.page);

    app.page.innerHTML = helpers.fillTemplate('tpl_login', {
        version: QB.version + ':' + QB.buildNumber
    });
    this.isLoginPageRendered = true;
    this.setListeners();
};

Login.prototype.renderLoadingPage = function(){
    helpers.clearView(app.page);
    app.page.innerHTML = helpers.fillTemplate('tpl_loading',{
        text: "Loading..."
    });
    logInfo(medicalAppointmentId, "DRONLINE PATIENT: Renderizando mensaje de conectando en QB.");
};

Login.prototype.loginAuto = function(){
    var self = this;
    var user = {
        login: resQB.patient.QBUser,
        password: resQB.patient.QBPass,
        full_name: resQB.patient.name
    };
    logWarning(medicalAppointmentId, "DRONLINE PATIENT: Info de navegador: "+getBrowserInfo());
    localStorage.setItem('user', JSON.stringify(user));

    self.login(user).then(function(){
        router.navigate('/dashboard');
        logInfo(medicalAppointmentId,"DRONLINE PATIENT: Esperando de la creación del chat por parte del doctor.");
    }).catch(function(error){
        logSevere(medicalAppointmentId,"DRONLINE PATIENT: Login error: " + JSON.stringify(error));
        alert('Error\n Error en conectarse a la consulta');
        console.error(error);
    });
};


Login.prototype.setListeners = function(){
    var self = this,
        loginForm = document.forms.loginForm,
        formInputs = [loginForm.userName, loginForm.userGroup],
        loginBtn = loginForm.login_submit;

    // add event listeners for each input;
    _.each(formInputs, function(i){
        i.addEventListener('focus', function(e){
            var elem = e.currentTarget,
                container = elem.parentElement;

            if (!container.classList.contains('filled')) {
                container.classList.add('filled');
            }
        });

        i.addEventListener('focusout', function(e){
            var elem = e.currentTarget,
                container = elem.parentElement;

            if (!elem.value.length && container.classList.contains('filled')) {
                container.classList.remove('filled');
            }
        });

        i.addEventListener('input', function(){
            var userName = loginForm.userName.value.trim(),
                userGroup = loginForm.userGroup.value.trim();
            if(userName.length >=3 && userGroup.length >= 3){
                loginBtn.removeAttribute('disabled');
            } else {
                loginBtn.setAttribute('disabled', true);
            }
        })
    });
};

// Send a message to the parent
var sendMessage = function (type) {
    var msg = {
        reason : type
    };
    window.parent.postMessage(msg, '*');
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

var loginModule = new Login();