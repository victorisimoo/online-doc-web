materialAdmin
    .config(['$httpProvider', '$securityConfigProvider', function ($httpProvider, $securityConfigProvider) {
        $httpProvider.interceptors.push('$securityInterceptor');
        $securityConfigProvider.configure({
            strategy: 'simple',
            token: {
                header: 'Authorization',
                prefix: 'Bearer '
            }
        });
    }])
    .factory('sessionRecoverer', ['$q', '$injector', function($q, $state) {  
        var sessionRecoverer = {
            responseError: function(response) {
                if (response.status == 401){
                    $('.alert-oldUser').show();
                    $('.alert-subscription').hide();
                    $('.buttonIcon').hide();
                    $('.buttonText').show();
                    $('#registerButton').attr("disabled", false);
                }
                return $q.reject(response);
            }
        };
        return sessionRecoverer;
    }])
    .config(['$httpProvider', function($httpProvider) {  
        $httpProvider.interceptors.push('sessionRecoverer');
    }])
    .run(function ($rootScope, $state, $security, $window, $cookies, growlService, domainName) {
        var cookie = $cookies.get('admdron');
        if (typeof cookie === 'undefined' || cookie === null) {
        } else {
            cookie = JSON.parse(cookie);
            $security.login(cookie.access_token, cookie, cookie.authz.permissions);
            
            $rootScope.$on('unauthenticated', function () {
                $security.logout();
                $window.location = domainName+"views/logout.php";
            });
            $rootScope.$on('permissionDenied', function () {
                growlService.growl('Acceso no autorizado', 'danger');
                $state.go("home");
            });
            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                if (toState.authenticate && !$security.isAuthenticated()) {
                    $state.transitionTo("access.signin");
                    event.preventDefault();
                    return;
                }

                if (typeof toState.data !== 'undefined') {
                    var access = false;
                    if("all" === toState.data.type) {
                        access = $security.hasAllPermission(toState.data.perms);
                    } else {
                        access = $security.hasAnyPermission(toState.data.perms);
                    }

                    if(!access) {
                        $state.transitionTo("home");
                        event.preventDefault();
                    }
                }
            });    
        }
    });