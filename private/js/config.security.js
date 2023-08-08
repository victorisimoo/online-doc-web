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
    .run(function ($rootScope, $state, $security, $window, $cookies, growlService, domainName) {
        var cookie = $cookies.get('admdron');
        if (typeof cookie === 'undefined' || cookie === null) {
            $security.logout();
            $window.location = domainName+"views/logout.php";
        } else {
            cookie = JSON.parse(cookie);
            $security.login(cookie.access_token, cookie, cookie.authz.permissions);
            
            $rootScope.$on('unauthenticated', function () {
                let type = JSON.parse($cookies.get('ng-security-permissions'));
                $security.logout();
                if(type =="doctor"){
                    $window.location = domainName+"views/logout.php?type=Doctor";
                }else{
                    $window.location = domainName+"views/logout.php?type=Paciente";
                }
            });
            $rootScope.$on('permissionDenied', function () {
                growlService.growl('Acceso no permitido', 'danger');
                if(JSON.parse($cookies.get('ng-security-permissions'))=="patient"){
                    $state.go("pages.patient");
                }else{
                    $state.go("pages.doctor");
                }
            });
            $rootScope.$on('badRequest', function (request, response) {
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