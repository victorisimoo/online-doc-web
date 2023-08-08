materialAdmin
    .constant('authApi', apiURLBaseJS+'dronline-security-api/api/')
    .constant('adminApi', apiURLBaseJS+'dronline-admin-api/api/')
    .constant('patientApi', apiURLBaseJS+'dronline-patient-api/api/')
    .constant('billingApi', apiURLBaseJS+'dronline-billing-api/api/')
    .constant('domainName', URLBase+'/'+webSiteName)
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: true
        });
    }])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/success");
        $stateProvider
            .state('success', {
                url: '/success',
                templateUrl: '../views/retail/confirm.html'
            });
    })
    .controller('successConfirmController', function ($scope, $cookies, PatProfileResource){
        var cookie = $cookies.get('admdron');
        if(cookie.corpName == 'dronline'){
            $scope.isDoctor = true;
        }else {
            $scope.isDoctor = false;
        }

        if(cookie != undefined){
            $(".logout").removeClass("hide");
            $(".login").addClass("hide");
            cookie = JSON.parse(cookie);
        } else {
            window.location = URLBase + webSiteName + 'views/register.php';
        }

        $scope.finishSubscription = function () {
            $scope.loadingProcess = true;
            var profileContactInfo = {
                profileId: cookie.userId,
                profileName: $scope.personName.trim(),
                profilePhone: $scope.personPhone.trim()
            }
            PatProfileResource.updateContactInformation(profileContactInfo, function (response) {
                cookie.firstName = response.firstName;
                cookie.lastName = response.lastName;
                cookie.activeMember = 1;
                let d = new Date();
                d.setFullYear(d.getFullYear() + 10);
                $scope.goToHome();
            });
        };

        function isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        $scope.goToHome = function () {

            if(!(typeof $scope.admdron !== 'undefined' && $scope.admdron !== null && typeof $scope.admdron.parentCorporateInformation !== 'undefined')) {
                $scope.goToLogin();
            }else {
                if(!isMobileDevice()){
                    window.location = URLBase+webSiteName+"/private/index.php#/pages/patient";
                }else{
                    window.location = URLBase + 'webm/private/index.php#/pages/patient';
                }
            }   
        }

        $scope.goToLogin = function () {
            $(".logout").addClass("hide");
            $(".login").removeClass("hide");
            localStorage.removeItem('plan');
            document.cookie = "admdron=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain="+domainBaseJS;
            if(!($cookies.get('resource') == '07b3dce8307411eda2610242ac120002')){
                window.location = URLBase+webSiteName+login;
            }else {
                window.location = URLBase+webSiteName+'views/login.php?resource=07b3dce8307411eda2610242ac120002';
            }
        };

        $scope.logout = function(){
            $(".logout").addClass("hide");
            $(".login").removeClass("hide");
            if($scope.isDoctor){
                window.location = "https://www.doctor-online.co";
            }else{
                window.location = "https://seguros.doctor-online.co/web/views/login.php?resource=07b3dce8307411eda2610242ac120002";
            }
        };
    });