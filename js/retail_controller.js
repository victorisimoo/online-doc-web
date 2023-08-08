materialAdmin
    .constant('authApi', apiURLBaseJS+'dronline-security-api/api/')
    .constant('adminApi', apiURLBaseJS+'dronline-admin-api/api/')
    .constant('patientApi', apiURLBaseJS+'dronline-patient-api/api/')
    .constant('billingApi', apiURLBaseJS+'dronline-billing-api/api/')
    .constant('domainName', URLBase+'/'+webSiteName)
    .constant('secretKey', 'Dr0$%')
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: true
        });
    }])
    .config(['$translateProvider', function($translateProvider) {
        $translateProvider.translations('translation', JSON.parse(localStorage.getItem('translation')));
        $translateProvider.preferredLanguage('translation');
        translationPrefered = JSON.parse(localStorage.getItem('translation'));
        $translateProvider.useLoader('translationLoader');
        $translateProvider.useSanitizeValueStrategy(null);
    }])
    .factory('translationLoader', function ($q, $timeout) {
        return function (options) {
            var deferred = $q.defer(),
                translations;
            translations = JSON.parse(localStorage.getItem('translation'));
            translationPrefered = JSON.parse(localStorage.getItem('translation'));
            deferred.resolve(translations);
            return deferred.promise;
        };
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/register");
        $stateProvider
            .state('register', {
                url: '/register/{corona}',
                params: { 
                    corona: {value: null, squash: true}
                },
                templateUrl: '../views/retail/register.html'
            })
            .state('plan', {
                url: '/plan',
                templateUrl: '../views/retail/plan.html'
            })
            .state('info', {
                url: '/info',
                templateUrl: '../views/retail/info.html'
            })
            .state('account', {
                url: '/account',
                templateUrl: '../views/retail/account.html'
            })
            .state('pay', {
                url: '/pay',
                templateUrl: '../views/retail/pay.html'
            })
            .state('suscribe', {
                url: '/suscribe',
                templateUrl: '../views/retail/suscribe.html'
            })
            .state('passwordrestore', {
                url: '/passwordrestore/:token',
                templateUrl: '../views/retail/restore.html'
            });
    })
    .controller('RegisterController', function ($scope, $rootScope, $http, $state, $stateParams, SubscriptionResource, PatientResource,
                                                PatProfileResource, LoginResource, $rootScope, $state, $security, $cookies, growlService, BillingResource, secretKey,
                                                $translate) {
        var cookie = $cookies.get('admdron');
        var planSelected;
        var coronavirus; 
        $scope.hasCoupon = localStorage.getItem('hasCoupon');
        $scope.packageCurrencyId = localStorage.getItem('packageCurrencyId');
        $scope.premium = true;
        $scope.price = localStorage.getItem('0');
        $scope.disponibility = localStorage.getItem('1');
        $scope.profilesTile = localStorage.getItem('2');
        $scope.platforms = localStorage.getItem('3');
        $scope.suscriptionChat = localStorage.getItem('4');
        $scope.suscriptionVideo= localStorage.getItem('5');
        $scope.pdf = localStorage.getItem('6');
        $scope.cancel = localStorage.getItem('7');
        $scope.profileSuscription = localStorage.getItem('profilesSuscription');
        $scope.suscriptionPrice = localStorage.getItem('precioSuscription');
        let cookieTotal = document.cookie.split(';').reduce((cookieObject, cookieString) => {
            let splitCookie = cookieString.split('=')
            try {
              cookieObject[splitCookie[0].trim()] = decodeURIComponent(splitCookie[1])
            } catch (error) {
                cookieObject[splitCookie[0].trim()] = splitCookie[1]
            }
            return cookieObject
        }, []);

        if(localStorage.getItem('corporateName')){
            $scope.corporateNameText = "Doctor Virtual";
        }
        if(localStorage.getItem('corporateName')== "doctorvirtual"){
            $scope.isDoctorOnline = false;
        }else{
            $scope.isDoctorOnline = true;
        }

        if(cookie == undefined){
            $(".logout").addClass("hide");
            $(".login").removeClass("hide");
            if ($state.current.name == "pay" || $state.current.name == "suscribe"){
                $state.go('register');
            }
        }
        else{
            $(".logout").removeClass("hide");
            $(".login").addClass("hide");
            if ($state.current.name == "account"){
                $state.go('pay');
            }
            if($state.current.name == "pay"){
                $scope.demoTitle = 'Demo';
                var demoParam = "RETAIL_DEMO_DATE_COVERAGE";
                var demoDays = "RETAIL_DEMO_DAYS";
                planSelected = localStorage.getItem('plan');
                if(planSelected != undefined){
                    if(planSelected == 'coronavirus'){
                        $scope.demoTitle = 'Coronavirus';
                        demoParam = "RETAIL_CORONAVIRUS_DATE_COVERAGE";
                        demoDays = "RETAIL_CORONAVIRUS_DAYS";
                    }
                }
                BillingResource.parameterByName({
                    parameterName: demoParam
                }, function (response) {
                    if(response.value != undefined){
                        $scope.retailDemoDays = response.value;
                        var dt = new Date();
                        if($scope.retailDemoDays >= 30){
                            dt.setMonth( dt.getMonth() + 1 );
                            $scope.lastDate = ("0" + dt.getDate()).slice(-2)+"/"+("0" + (dt.getMonth() + 1)).slice(-2)+"/"+dt.getFullYear();
                        } else {
                            dt.setDate( dt.getDate() + Number($scope.retailDemoDays) );
                            $scope.lastDate = ("0" + dt.getDate()).slice(-2)+"/"+("0" + (dt.getMonth() + 1)).slice(-2)+"/"+dt.getFullYear();
                        }
                        BillingResource.parameterByName({
                            parameterName: demoDays
                        }, function (response) {
                            if(response.value != undefined){
                                if(response.value == 1){
                                    $scope.amountOfAttendence = '1 orientación médica';
                                } else if(response.value >= 2){
                                    $scope.amountOfAttendence = response.value+' orientaciones médicas';
                                }
                            }
                        });
                    }
                });


                if (localStorage.getItem("corporateName")) {
                    let corporateStorage = localStorage.getItem("corporateName") == "dronline" ? "MODIFIED_COST_PACKAGE" : "DEFAULT_RETAIL_PACKAGE" 
                    BillingResource.parameterByName({
                        parameterName: corporateStorage
                    }, function (response) {
                        if(response.value != undefined){
                            $scope.packageId = response.value;
                            if($scope.isDoctorOnline){
                                $scope.priceService = '$'+ response.value + '.00'
                            }else {
                                $scope.priceService =  '50.00 GTQ'
                            }
                        }
                    });
                }

                SubscriptionResource.information(function(res){
                    if(res.remainingAppointments == undefined || (res.remainingAppointments != undefined && res.remainingAppointments < 0)){
                        if($scope.freeAppointment == undefined){
                            if(cookie != undefined && JSON.parse(cookie).freeAppointmentUsed != undefined){
                                if(JSON.parse(cookie).freeAppointmentUsed > 0){
                                    $scope.freeAppointment = JSON.parse(cookie).freeAppointmentUsed;
                                }
                            }
                        }
                    }
                });
            }
            let corporateStorage = localStorage.getItem("corporateName") == "dronline" ? "MODIFIED_COST_PACKAGE" : "DEFAULT_RETAIL_PACKAGE" 
            BillingResource.parameterByName({ 
                parameterName: corporateStorage
            }, function (response) {
                if(response.value != undefined){
                    $scope.packageId = response.value;
                }
            });
        }
        $scope.selectedPackage = function (plan) {
            localStorage.setItem('plan', plan);
            $scope.premium = (plan == 'premium');
            $scope.coronavirus = (plan == 'coronavirus');
        }

        if($state.current.name == "suscribe"){
            if (window.location.origin == "https://app-latam-qa.doctor-online.co" || window.location.origin == "https://localhost" || window.location.origin == "http://localhost") {
                if(!(localStorage.getItem("corporateName") == 'doctorvirtual')){
                    $scope.linkRedirectTermsConditions = "https://app-latam-qa.doctor-online.co/web/views/terminosycondiciones.php"
                }else {
                    $scope.linkRedirectTermsConditions = "https://app-latam-qa.doctor-online.co/web/views/terms/doctorvirtual-terminosycondiciones.php"
                }
            } else {
                if(!(localStorage.getItem("corporateName") == 'doctorvirtual')){
                    $scope.linkRedirectTermsConditions = "https://seguros.doctor-online.co/web/views/terminosycondiciones.php"
                }else {
                    $scope.linkRedirectTermsConditions = "https://seguros.doctor-online.co/web/views/terms/doctorvirtual-terminosycondiciones.php"
                }
            }

            if (localStorage.getItem("corporateName")) {
                let corporateStorage = localStorage.getItem("corporateName") == "dronline" ? "MODIFIED_COST_PACKAGE" : "DEFAULT_RETAIL_PACKAGE" 
                BillingResource.parameterByName({
                    parameterName: corporateStorage
                }, function (response) {
                    if(response.value != undefined){
                        $scope.packageId = response.value;
                        if($scope.isDoctorOnline){
                            $scope.priceService = '$'+ response.value + '.00'
                        }else {
                            $scope.priceService =  '50.00 GTQ'
                        }
                        
                    }
                });
            }
        }

        if($state.current.name == "register"){
            if($stateParams.corona != undefined && $stateParams.corona != null){
                localStorage.setItem('coronavirus','active');
            } else {
                localStorage.removeItem('coronavirus');
            } 
        }
        $scope.coronavirusRegister = (localStorage.getItem('coronavirus') != undefined && localStorage.getItem('coronavirus') != null);
        if(!$scope.coronavirusRegister){
            $scope.selectedPackage('premium');
        } else {
            $scope.selectedPackage('coronavirus');
        }
        if($state.current.name == "plan"){

            if (window.location.origin == "https://app-latam-qa.doctor-online.co" || window.location.origin == "https://localhost" || window.location.origin == "http://localhost") {
                if($scope.isDoctorOnline){
                    $scope.linkRedirectTermsConditions = "https://app-latam-qa.doctor-online.co/web/views/terminosycondiciones.php"
                }else {
                    $scope.linkRedirectTermsConditions = "https://app-latam-qa.doctor-online.co/web/views/terms/doctorvirtual-terminosycondiciones.php"
                }
                
            } else {
                if($scope.isDoctorOnline){
                    $scope.linkRedirectTermsConditions = "https://seguros.doctor-online.co/web/views/terminosycondiciones.php"
                }else {
                    $scope.linkRedirectTermsConditions = "https://seguros.doctor-online.co/web/views/terms/doctorvirtual-terminosycondiciones.php"
                }
            }

            if (localStorage.getItem("corporateName")) {
                let corporateStorage = localStorage.getItem("corporateName") == "dronline" ? "MODIFIED_COST_PACKAGE" : "DEFAULT_RETAIL_PACKAGE" 
                BillingResource.parameterByName({
                    parameterName: corporateStorage
                }, function (response) {
                    if(response.value != undefined){
                        $scope.packageId = response.value;
                        if($scope.isDoctorOnline){
                            $scope.priceService = '$'+ response.value + '.00'
                        }else {
                            $scope.priceService =  '50.00 GTQ'
                        }
                        
                    }
                });
            }
            
            planSelected = localStorage.getItem('plan');
            if(planSelected != undefined){
                $scope.premium = (planSelected == 'premium');
                $scope.coronavirus = (planSelected == 'coronavirus');
            } else {
                if($scope.premium){
                    localStorage.setItem('plan', 'premium');
                }
            }
            BillingResource.parameterByName({
                parameterName: "RETAIL_CORONAVIRUS_DATE_COVERAGE"
            }, function (response) {
                if(response.value != undefined){
                    $scope.retailDemoDays = response.value;
                    var dt = new Date();
                    if($scope.retailDemoDays >= 30){
                        dt.setMonth( dt.getMonth() + 1 );
                        $scope.lastDate = ("0" + dt.getDate()).slice(-2)+"/"+("0" + (dt.getMonth() + 1)).slice(-2)+"/"+dt.getFullYear();
                    } else {
                        dt.setDate( dt.getDate() + Number($scope.retailDemoDays) );
                        $scope.lastDate = ("0" + dt.getDate()).slice(-2)+"/"+("0" + (dt.getMonth() + 1)).slice(-2)+"/"+dt.getFullYear();
                    }
                    BillingResource.parameterByName({
                        parameterName: "RETAIL_CORONAVIRUS_DAYS"
                    }, function (response) {
                        if(response.value != undefined){
                            if(response.value == 1){
                                $scope.demoDaysText = 'Aplica 1 atención';
                            } else if(response.value >= 2){
                                $scope.demoDaysText = 'Aplica '+response.value+' atenciones';
                            }
                        }
                    });
                }
            });
        }
        $scope.showInfo = false; $scope.addCoupon = false; $scope.invalidCoupon = false;
        $scope.textCoupon = 'Añadir cupón'; $scope.invalidCouponText = "";
        $scope.validCreditCard = false; $scope.planValue = 3; $scope.descountAmount; 
        $scope.descount = false; 
        //$scope.ApplyCoupon; $scope.hasCoupon = false;
        $('.alert-warning').hide(); $('.buttonIcon').hide();

        $scope.onCreditCardTypeChanged = function(type) {
            $scope.cardType = type;
            $scope.validCreditCard = (type == 'visa' || type == 'mastercard');
            if($scope.validCreditCard){
                $scope.creditCardType = type;
            }
        };
        $scope.options = {
            expDate: {
                date: true,
                datePattern: ['m', 'y']
            },
            creditCard: {
                creditCard: true,
                onCreditCardTypeChanged: $scope.onCreditCardTypeChanged
            }
        };
        $scope.nextStep1 = function () {
            $state.go('plan');
        }
        $scope.nextStep2 = function () {

            if (cookie == undefined) {
                $state.go('info');
            } else {
                $state.go('pay');
            }
        }
        $scope.nextStep3 = function () {
            if($cookies.get('resource') == '07b3dce8307411eda2610242ac120002'){
                $scope.isDoctorOnline = false;
                if(URLBase.includes('localhost') || URLBase.includes('app-latam-qa')){
                    urlRequest = apiURLBaseJS + "dronline-billing-api/api/payment-gateway/corporate/82";            
                } else {
                    urlRequest = apiURLBaseJS + "dronline-billing-api/api/payment-gateway/corporate/81";             
                }
            }

            var paymentGateway = {
                method: 'GET',
                url: urlRequest,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            };

            $http(paymentGateway).then(function successCallback(response) {
                $rootScope.paymentGateway = response.data;
                for(var i = 0; i < response.data.corporatePlan.planDescription.length; i++){
                    localStorage.setItem(i, response.data.corporatePlan.planDescription[i].description);
                }
                $scope.hasCoupon = response.data.hasCoupon;
                localStorage.setItem("packageCurrencyId", JSON.stringify(response.data.corporatePlan.packageCurrencyId));
                localStorage.setItem("precioSuscription", response.data.corporatePlan.planDescription[0].value);
                localStorage.setItem("hasCoupon", response.data.hasCoupon);
                localStorage.setItem("profilesSuscription", response.data.corporatePlan.planDescription[2].value)
            }, function errorCallback(response) {
                console.log(response);
            });

            $state.go('account');
        }
        $scope.nextStep4 = function () {
            $state.go('pay');
        }
        $scope.nextStep5 = function () {
            $state.go('suscribe');
            $('html,body').scrollTop(0);
        }

        $scope.toogleInfo = function () {
            $scope.showInfo = ($scope.showInfo) ? false : true;
            if ($scope.showInfo) {
                $('html,body').scrollTop(0);
            }
        };

        $scope.openInformationModal = function () {
            if($scope.lastDate == undefined){
                var dt = new Date();
                if($scope.retailDemoDays >= 30){
                    dt.setMonth( dt.getMonth() + 1 );
                    $scope.lastDate = ("0" + dt.getDate()).slice(-2)+"/"+("0" + (dt.getMonth() + 1)).slice(-2)+"/"+dt.getFullYear();
                } else {
                    dt.setDate( dt.getDate() + $scope.retailDemoDays );
                    $scope.lastDate = ("0" + dt.getDate()).slice(-2)+"/"+("0" + (dt.getMonth() + 1)).slice(-2)+"/"+dt.getFullYear();
                }
            }
            $scope.showFreeInfo = ($scope.showFreeInfo) ? false : true;
            if ($scope.showFreeInfo) {
                $('html,body').scrollTop(0);
            }
            PatProfileResource.find({
                profileId: JSON.parse(cookie).userId
            }, function (data) {
                $scope.profile = data;
            });
        };

        
        $scope.showCoupon = function(){
            Boolean($scope.addCoupon)
            $scope.addCoupon = ($scope.addCoupon) ? false : true;
            $scope.textCoupon = ($scope.addCoupon) ? 'Remover cupón' : 'Añadir cupón';
            $scope.hasCoupon = ($scope.addCoupon) ? false : true;
            $scope.descount = false;
            $scope.invalidCoupon = false;
            $scope.coupon = '';
            $scope.monthText = '';
            if($scope.ApplyCoupon != undefined){
                $scope.ApplyCoupon = undefined;
            }
        }

        $scope.newRegister = function () {
            $('.buttonIcon').show();
            $('.buttonText').hide();
            $('#registerButton').attr("disabled", true);
            let newUser ={
                person:{
                    firstName: 'Usuario',
                    lastName: 'Doctor Virtual'
                },
                country:{
                    countryId: 1
                },
                language:{
                    languageId: 1
                },
                email: $scope.email,
                password: $scope.password, 
                corporateResource: $cookies.get('resource')
            }

            var createUser = {
                method: 'POST',
                url:  apiURLBaseJS+'dronline-patient-api/api/patient',
                data: newUser,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            };

            $http(createUser).then(function successCallback(response) {
                if(response != undefined){
                    if(response.data.oldUser){
                        $scope.loginProcess(false);
                    } else{
                        $scope.loginProcess(true);
                    }
                }
            }, function errorCallback(response) {
                console.log(response);
            });
        }

        $scope.encrypt = function (message, secretKey) {
            const codeKey = String.fromCharCode(secretKey.length);
            let arrayMessage = message.split('');
            for (let i=0; i < arrayMessage.length; i++) {
                arrayMessage[i] = String.fromCharCode(arrayMessage[i].charCodeAt(0) + codeKey.charCodeAt(0));
            }
            return arrayMessage.join('');
        }

        $scope.decrypt = function (message, secretKey) {
            const codeKey = String.fromCharCode(secretKey.length);
            let arrayMessage = message.split('');
            for (let i=0; i < arrayMessage.length; i++) {
                arrayMessage[i] = String.fromCharCode(arrayMessage[i].charCodeAt(0) - codeKey.charCodeAt(0));
            }
            return arrayMessage.join('');
        }

        $scope.loginProcess = function(newUser){
            let loginData;
            if(window.innerWidth < window.innerHeight) {
                appName = "webm";
            }
            
            if(!($cookies.get('resource') == '07b3dce8307411eda2610242ac120002')){
                loginData = {
                    principal: $scope.email,
                    credentials: $scope.password,
                    corporateDomain: 'e4c4aa0f523941d2a332d15101f12e9e',
                    appName: appName,
                    appVersionName: appVersionName
                }
            }else {
                loginData = {
                    principal: $scope.email,
                    credentials: $scope.password,
                    corporateDomain: '07b3dce8307411eda2610242ac120002',
                    appName: appName,
                    appVersionName: appVersionName
                }
            }
            
            const dataEncrypt = $scope.encrypt(JSON.stringify(loginData), secretKey)
            const loginDataEncrypt = {
                request: `${dataEncrypt}`
            }

            LoginResource.login(loginDataEncrypt, function(res) {
                const loginResponse = JSON.parse($scope.decrypt(res.response, secretKey));
                console.log(loginResponse);
                if(loginResponse.code == undefined) {
                    if(newUser){
                        if(newUser && loginResponse.activeMember == 0){
                            admCookie ={
                                access_token: loginResponse.access_token,
                                authz : {
                                    permissions: loginResponse.authz.permissions,
                                    roles: loginResponse.authz.roles
                                },
                                userId: loginResponse.userId,
                                corporateId: loginResponse.corporateId,
                                chatProviderId: loginResponse.chatProviderId,
                                videoProviderId: loginResponse.videoProviderId,
                                phoneProviderId: loginResponse.phoneProviderId,
                                appCorporateVersion: loginResponse.appCorporateVersion,
                                notificationAppId: loginResponse.notificationAppId,
                                firstName: loginResponse.firstName,
                                lastName: loginResponse.lastName,
                                freeAppointmentUsed: loginResponse.freeAppointmentUsed,
                                corporateInformation: loginResponse.corporateInformation
                            }
                            $(".logout").removeClass("hide");
                            $(".login").addClass("hide");
                            let d = new Date();
                            d.setFullYear(d.getFullYear() + 10);
                            document.cookie = "admdron=" + JSON.stringify(admCookie) + ";expires="+d+";path=/;domain="+domainBaseJS;
                            $scope.setSecurity();
                            $scope.nextStep4();
                        }
                    } else{
                        $('.buttonIcon').hide();
                        $('.buttonText').show();
                        $('#registerButton').attr("disabled", false);
                        $('.alert-subscription').show();
                        $('.alert-oldUser').hide();  
                    }
                }
                else{
                    $('.buttonIcon').hide();
                    $('.buttonText').show();
                    $('#registerButton').attr("disabled", false);
                }
            });
        };

        $scope.validateCoupon = function(){
            if (typeof $scope.coupon != 'undefined') {
                var token = {
                    coupon: $scope.coupon,
                    packageId: $scope.packageCurrencyId
                }
                SubscriptionResource.tokenValidate(token, function (tokenValidation) {
                    if (tokenValidation.couponId == undefined) {
                        $scope.invalidCoupon = true;
                        $scope.invalidCouponText = tokenValidation.description;
                    } else{
                        $scope.ApplyCoupon = tokenValidation;
                        $scope.CoponToken = tokenValidation.token;
                        $scope.hasCoupon = true;
                        $scope.invalidCoupon = false;
                        $scope.planValue = parseFloat($scope.suscriptionPrice);

                        if (typeof tokenValidation.percentage != 'undefined' && tokenValidation.quantity > 0) {
                            $scope.descount = true;
                            $scope.descountAmount = ($scope.planValue * (1 - tokenValidation.percentage)).toFixed(2);
                            $scope.descountAmount = $scope.descountAmount - tokenValidation.quantity;
                            $scope.descountAmount = "Se cobrará"+parseFloat($scope.descountAmount).toFixed(2) + " " + $scope.suscriptionPrice.replace(/[0-9\.\-\%]/g, '');
                            
                        } else if (typeof tokenValidation.percentage != 'undefined') {
                            $scope.descount = true;
                            $scope.descountAmount = ($scope.planValue * (1 - tokenValidation.percentage)).toFixed(2);
                            $scope.descountAmount = "Se cobrará "+parseFloat($scope.descountAmount).toFixed(2) + " " + $scope.suscriptionPrice.replace(/[0-9\.\-\%]/g, '');
                            
                        }else if(typeof tokenValidation.quantity != 'undefined'){
                            $scope.descount = true;
                            $scope.descountAmount = $scope.planValue - tokenValidation.quantity;
                            $scope.descountAmount = $scope.descountAmount.toFixed(2);
                            $scope.descountAmount = "Se cobrará "+parseFloat($scope.descountAmount).toFixed(2)+ " " + $scope.suscriptionPrice.replace(/[0-9\.\-\%]/g, '');

                        }else if (typeof tokenValidation.month != 'undefined') {
                            if(tokenValidation.month == -1){
                                $scope.descount = true;
                            }
                            if(tokenValidation.month == 1){
                                $scope.monthText = "Se cobrará "+$scope.descountAmount.toFixed(2) + " " + $scope.suscriptionPrice.replace(/[0-9\.\-\%]/g, '');;
                            } else if(tokenValidation.month > 1){
                                $scope.monthText = "Se cobrará "+$scope.descountAmount + " " + $scope.suscriptionPrice.replace(/[0-9\.\-\%]/g, '') + " " + tokenValidation.month+" cobros.";
                            }
                        }
                        
                    }
                });
            }
        }

        $scope.suscribe = function(){
            $('.buttonIcon').show();
            $('.buttonText').hide();
            $('#simplicityPayment').attr("disabled", true);
            var admdron = $cookies.get('admdron');
            admdron = JSON.parse(admdron);
            let expDate = $scope.creditCardExpiration.match(/.{1,2}/g);
            if(expDate[0].indexOf("0") == 0){
                expDate[0] = expDate[0].replace("0", "");
            }
            if(!($cookies.get('resource') == '07b3dce8307411eda2610242ac120002')){
                var subRequest = {
                    "userId": admdron.userId,
                    "packageCurrencyId": $scope.packageId,
                    "accountNumber": $scope.creditCardNumber,
                    "expirationMonth": expDate[0].trim(),
                    "expirationYear": expDate[1].trim(),
                    "cvvCard": $scope.creditCardSecurityCode,
                    "nameCard": $scope.firstName,
                    "provider": $scope.creditCardType
                }

                if($scope.ApplyCoupon != undefined){
                    subRequest.idCoupon = $scope.ApplyCoupon.couponId;
                    subRequest.couponToken = $scope.ApplyCoupon.token;
                }
                const dataEncrypt = $scope.encrypt(JSON.stringify(subRequest), secretKey)
                const subRequestEncrypt = {
                    request: `${dataEncrypt}`
                }
                
                BillingResource.saveTransaction(subRequestEncrypt, function (res) {
                    const {description: result, code} = JSON.parse($scope.decrypt(res.response, secretKey));
                    if (code === 200) {
                        let d = new Date();
                        d.setFullYear(d.getFullYear() + 10);
                        admdron.activeMember = 1;
                        document.cookie = "admdron=" + JSON.stringify(admdron) + ";expires="+d+";path=/;domain="+domainBaseJS;
                        document.cookie = "corpname=dronline;expires="+d+";path=/;domain="+domainBaseJS;
                        document.cookie = "logo=../img/dronline.png;expires="+d+";path=/;domain="+domainBaseJS;
                        window.location = URLBase+webSiteName+confirmPage;
                    } else {
                        $scope.errorDesc = result;
                        $('.alert-warning').show();
                        $('html,body').scrollTop(0);
                        $('.buttonText').show();
                        $('.buttonIcon').hide();
                        $('#simplicityPayment').attr("disabled", false);
                    }
                });
            }else {
                if($cookies.get('resource') == '07b3dce8307411eda2610242ac120002'){
                    $scope.isDoctorOnline = false;
                    if(URLBase.includes('localhost') || URLBase.includes('app-latam-qa')){
                        urlRequest = apiURLBaseJS + "dronline-billing-api/api/payment-gateway/corporate/82";  
                        var subRequestTranz = {
                            "corporateId" : 82,
                            "userId": admdron.userId,
                            "cardNumber": $scope.creditCardNumber,
                            "cardExpirationMonth": expDate[0].trim(),
                            "cardExpirationYear": expDate[1].trim(),
                            "cardCvv": $scope.creditCardSecurityCode,
                            "cardHolderName": $scope.firstName,
                            "provider": $scope.creditCardType,
                        }          
                    } else {
                        var subRequestTranz = {
                            "corporateId" : 81,
                            "userId": admdron.userId,
                            "cardNumber": $scope.creditCardNumber,
                            "cardExpirationMonth": expDate[0].trim(),
                            "cardExpirationYear": expDate[1].trim(),
                            "cardCvv": $scope.creditCardSecurityCode,
                            "cardHolderName": $scope.firstName,
                            "provider": $scope.creditCardType,
                        }       
                    }
                }
                
                if($scope.ApplyCoupon != undefined){
                    subRequestTranz.idCoupon = $scope.ApplyCoupon.couponId;
                }else {
                    subRequestTranz.idCoupon = 0;
                }
                
                const dataEncrypt = $scope.encrypt(JSON.stringify(subRequestTranz), secretKey)
                const subRequestEncrypt = {
                    request: `${dataEncrypt}`
                }
                
                BillingResource.saveTransactionPowerTranz(subRequestEncrypt, function(res){
                    if(!(res.type == "DESCUENTO-TOTAL")){
                        if(res.responseMessage == "SPI Preprocessing complete"){
                            var documentHtml = new Blob([res.redirectData], {type: "text/html"});
                            window.open(URL.createObjectURL(documentHtml), "_blank");
                            
                            var powerTranz = {
                                method: 'GET',
                                url: apiURLBaseJS + "dronline-billing-api/api/powertranz/transaction/autorizacion-status/" + res.transactionIdentifier,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*'
                                },
                            };
                            // process verification
                            setTimeout( function () {$http(powerTranz).then(function successCallback(response) {
                                if(response.data.autorizacionApproved){
                                    spiTokenVerification = {request: response.data.spiToken}
                                    var powerTranzVerification = {
                                        method: 'POST',
                                        url: apiURLBaseJS + "dronline-billing-api/api/powertranz/payment",
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Access-Control-Allow-Origin': '*'
                                        },
                                        data: spiTokenVerification,
                                    };

                                    $http(powerTranzVerification).then(function successCallback(response_verification) {
                                        if(response_verification.data.approved){
                                            let d = new Date();
                                            d.setFullYear(d.getFullYear() + 10);
                                            admdron.activeMember = 1;
                                            document.cookie = "admdron=" + JSON.stringify(admdron) + ";expires="+d+";path=/;domain="+domainBaseJS;
                                            document.cookie = "corpname=doctorvirtual;expires="+d+";path=/;domain="+domainBaseJS;
                                            document.cookie = "logo=../img/doctorvirtual.png;expires="+d+";path=/;domain="+domainBaseJS;
                                            window.location = URLBase+webSiteName+confirmPage;
                                        }
                                    }, function errorCallback(response_verification) {
                                        $scope.errorDesc = response_verification.responseMessage;
                                        $('.alert-warning').show();
                                        $('html,body').scrollTop(0);
                                        $('.buttonText').show();
                                        $('.buttonIcon').hide();
                                        $('#simplicityPayment').attr("disabled", false);
                                    });

                                }else {
                                    $scope.errorDesc = response.responseMessage;
                                    $('.alert-warning').show();
                                    $('html,body').scrollTop(0);
                                    $('.buttonText').show();
                                    $('.buttonIcon').hide();
                                    $('#simplicityPayment').attr("disabled", false);
                                }
                            },function errorCallback(response) {
                                $scope.errorDesc = response.responseMessage;
                                $('.alert-warning').show();
                                $('html,body').scrollTop(0);
                                $('.buttonText').show();
                                $('.buttonIcon').hide();
                                $('#simplicityPayment').attr("disabled", false);
                            })}, 9000);
        
                        }else {
                            $scope.errorDesc = res.responseMessage;
                            $('.alert-warning').show();
                            $('html,body').scrollTop(0);
                            $('.buttonText').show();
                            $('.buttonIcon').hide();
                            $('#simplicityPayment').attr("disabled", false);
                        }
                    }else {
                        let d = new Date();
                        d.setFullYear(d.getFullYear() + 10);
                        admdron.activeMember = 1;
                        document.cookie = "admdron=" + JSON.stringify(admdron) + ";expires="+d+";path=/;domain="+domainBaseJS;
                        document.cookie = "corpname=doctorvirtual;expires="+d+";path=/;domain="+domainBaseJS;
                        document.cookie = "logo=../img/doctorvirtual.png;expires="+d+";path=/;domain="+domainBaseJS;
                        window.location = URLBase+webSiteName+confirmPage;
                    }
                });
                
            }
        };

        $scope.demoSuscribe = function(){
            $scope.loadingProcess = true;
            $('#simplicityPayment').attr("testitbutton", true);
            var profileContactInfo = {
                profileId: JSON.parse(cookie).userId,
                profileName: $scope.personName.trim(),
                profilePhone: $scope.personPhone.trim()
            }
            PatProfileResource.updateContactInformation(profileContactInfo, function (response) {
                admCookie = JSON.parse(cookie);
                admCookie.firstName = response.firstName;
                admCookie.lastName = response.lastName;
                admCookie.activeMember = 1;
                let d = new Date();
                d.setFullYear(d.getFullYear() + 10);
                document.cookie = "admdron=" + JSON.stringify(admCookie) + ";expires="+d+";path=/;domain="+domainBaseJS;
                var type = ($scope.coronavirusRegister)?2:1;
                SubscriptionResource.demo({
                    typeDemo: type
                },function (res) {
                    if (res.code === 200) {
                        let d = new Date();
                        d.setFullYear(d.getFullYear() + 10);
                        document.cookie = "activeMember=true;expires="+d+";path=/;domain="+domainBaseJS;
                        document.cookie = "corpname=dronline;expires="+d+";path=/;domain="+domainBaseJS;
                        document.cookie = "logo=../img/doctorvirtual.png;expires="+d+";path=/;domain="+domainBaseJS;
                        window.location = URLBase+webSiteName+login;
                    }
                });
            });
        };

        $scope.setSecurity = function(){
            var cookie = $cookies.get('admdron');
            cookie = JSON.parse(cookie);
            $security.login(cookie.access_token, cookie, cookie.authz.permissions);
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

        $scope.toLogin = function(){
            if(localStorage.getItem("corporateName") !== undefined){
                if(localStorage.getItem("corporateName") == "doctorvirtual"){
                    window.location = URLBase+webSiteName+'views/login.php?resource=07b3dce8307411eda2610242ac120002';
                }else {
                    window.location = URLBase+webSiteName+login;
                }
            }else {
                window.location = URLBase+webSiteName+login;
            }
        };

        // description: method to logout when creating an account to add a subscription to it. 
        // last modified: 11-04-2023
        $scope.logout = function(){
            $(".logout").addClass("hide");
            $(".login").removeClass("hide");
            localStorage.removeItem('plan');
            document.cookie = "admdron=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain="+domainBaseJS;
            if(localStorage.getItem("corporateName") !== undefined){
                if(localStorage.getItem("corporateName") == "doctorvirtual"){
                    window.location = URLBase+webSiteName+'views/login.php?resource=07b3dce8307411eda2610242ac120002';
                }else {
                    window.location = URLBase+webSiteName+login;    
                }
            }else {
                window.location = URLBase+webSiteName+login;
            }
        };
    })
    .controller('RestorePasswordCtrl', function ($scope, $stateParams, RestorePasswordResource){
        $scope.eye = "fa fa-eye fa-lg";
        $scope.showPassword = false;
        //$scope.tokenExpired = true;
        $scope.tooglePassword = function () {
            if ($scope.showPassword) {
                $scope.eye = "fa fa-eye fa-lg";
                $("#newpassword").attr('type', 'password');
                $scope.showPassword = false;
            } else {
                $scope.eye = "fa fa-eye-slash fa-lg";
                $("#newpassword").attr('type', 'text');
                $scope.showPassword = true;
            }
        };

        $scope.restorePassword = function () {
            $scope.inProcess = true;
            $scope.showError = false;
            if ($scope.password === $scope.confirmPassword) {
                let req = {
                    token: $stateParams.token,
                    newPassword: $scope.password,
                    newPasswordConfirm: $scope.confirmPassword
                }
                RestorePasswordResource.restoreWithToken(req, function (res) {
                    $scope.inProcess = false;
                    if (res.code == 200) {
                        $scope.success = true;
                    } else {
                        $scope.success = false;
                        $scope.tokenExpired = true;

                    }
                });
            } else {
                $scope.inProcess = false;
                $scope.showError = true;
            }
        };

        /*$scope.toLogin = function(){
            window.location = URLBase+webSiteName+login;
        };*/
    });
    var compareTo = function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {
                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };
                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    };
    materialAdmin.directive("compareTo", compareTo);