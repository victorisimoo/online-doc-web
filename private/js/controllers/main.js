var doctorHeartbeat;
var getMedicalAppointment = null;
var AppointmentTime = null;
var AppointmentInterval = null;
var ratingTimer = null;
var queueTimer = null;
var modalShow = false;
var tipsInterval = null;
var currentTip = 0;
var wifiInterval = null;

var speedTestInterval = null;
var doctorOnline = false;
var patientOnline = false;
var internetConnectionPatient = true;
var internetConnectionDoctor = true;
var checkcameraMicroPhonePermissions = false;
var permissionsCameraMicroPhone = false;
var codeResult = null;
var codeWorked = false;
var hasValidCode;
materialAdmin
    .controller('loginCtrl', function ($scope) {
        //Status
        this.login = 1;
        this.register = 0;
        this.forgot = 0;
    })
    .controller('patientCtrl', async function ($scope, $state, $q, $location, $cookies, $translate, $interval, $stateParams, $http, $timeout,
        $rootScope, $sce, SpecialityResource, BillingResource, AppointmentResource, PatientResource, PatProfileResource,
        DoctorResource, IntegrationResource, DeviceResource, formatService, ScheduleResource, $window, SubscriptionResource, FollowupResource, FileUploader, adminApi, AttachmentResource, ConfigurationCorporate
        ) {
        $scope.nameCorporation = $cookies.get('corpname');

        if($scope.nameCorporation == 'doctorvirtual'){
            $cookies.put('resource', '07b3dce8307411eda2610242ac120002');
        }

        $scope.myHtmlTooltipNotUse = translationPrefered.TOOLTIP_HAZ_VIDEO_AND_HAZ_CHAT;
        /**
         * date: 2023-01-17
         * Enable payment gateway
         * Description: This variable is used to enable or disable the payment gateway
         */
        $rootScope.enablePaymentGateway = $cookies.get('enablePaymentGateway');

        if($rootScope.enablePaymentGateway != 0){
            getPaymentGatewayStatus();
        }

        $scope.showCalendar1 = false;

        if ($scope.nameCorporation === 'vivawell' && localStorage.getItem('reloadPageAppointment')) {
            localStorage.removeItem('reloadPageAppointment')
            setTimeout(() => {
                window.location.reload()
            }, 100);
        }
        $scope.showCTAforMaps = 0;
        $scope.enableCalendar = 0;
        ConfigurationCorporate.findConfiguration({idCorporate: $cookies.get('resource')}, function (res) {
            $scope.enableCalendar = res.enableCalendar;
            $rootScope.enableCalendar = res.enableCalendar;
            if( Object.keys(res).length > 0 )
                $scope.showCTAforMaps = res.showPharmacyMaps;
        })

        const buttonChat = document.getElementById("tooltipVivawellNotUseIdentifierChat");
        const buttonVideo = document.getElementById("tooltipVivawellNotUseIdentifierVideo");
        const chat = document.getElementById("tooltipVivawellNotUseChat");
        const video = document.getElementById("tooltipVivawellNotUseVideo");
        if(buttonChat && buttonVideo){
            buttonChat.addEventListener("mouseover", () => {
                if ($scope.nameCorporation == 'vivawell') chat.className = "tooltip-custom tooltip-custom-show";
            }, false)
            buttonChat.addEventListener("mouseout", () => {
                if ($scope.nameCorporation == 'vivawell') chat.className = "tooltip-custom";
            }, false)
    
            buttonVideo.addEventListener("mouseover", () => {
                if ($scope.nameCorporation == 'vivawell') video.className = "tooltip-custom tooltip-custom-show";
            }, false)
            buttonVideo.addEventListener("mouseout", () => {
                if ($scope.nameCorporation == 'vivawell') video.className = "tooltip-custom";
            }, false)
        }
        
        if(localStorage.getItem("hasValidCode")){
            $rootScope.hasValidCode = localStorage.getItem("hasValidCode");
        }
        else{
            localStorage.setItem("hasValidCode", "false")
            $rootScope.hasValidCode = "false";
        }

        //Uploader
        var patientUploader = $scope.patientUploader = new FileUploader({
            url: adminApi + "attachment"
        });

        function getPaymentGatewayStatus() {
            var paymentGateway = {
                method: 'GET',
                url: apiURLBaseJS + "dronline-billing-api/api/payment-gateway/corporate/" + $scope.admdron.corporateId,
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
                
                /**
                 * Check if the user is a doctor online user for sucription validation
                 */
                if (response.data.paymentGatewayId == 1) {
                    if($scope.admdron.corporateId == 9){
                        $scope.isDoctorOnline = true;
                        $scope.pricePlan = response.data.corporatePlan.planDescription[0].value;
                        $scope.remainingAppointments = -1;
                        $scope.activeMember = $scope.admdron.activeMember;
                        if ($scope.activeMember == undefined || $scope.activeMember == 0) {
                            $scope.disableAppointment = true;
                            $scope.remainingAppointments = 0;
                        } else {
                            if ($state.current.name != "pages.medical-appointment") {
                                checkSubscriptionInfo();
                                $scope.checkSubscriptionInterval = $interval(checkSubscriptionInfo, 3500);
                            }
                        }
                    }
                }else if (response.data.paymentGatewayId == 3){
                    if($scope.admdron.parentCorporateInformation.corporateName == "doctorvirtual"){
                        $scope.isDoctorVirtual = true;
                        $scope.isDoctorOnline = false;
                        $scope.pricePlan = response.data.corporatePlan.planDescription[0].value;
                        $scope.remainingAppointments = -1;
                        $scope.activeMember = $scope.admdron.activeMember;

                        if ($scope.activeMember == undefined || $scope.activeMember == 0) {
                            $scope.disableAppointment = true;
                            $scope.remainingAppointments = 0;

                        } else {
                            if ($state.current.name != "pages.medical-appointment") {
                                checkSubscriptionInfo();
                                $scope.checkSubscriptionInterval = $interval(checkSubscriptionInfo, 3500);
                            }
                        }
                    }
                }
            },function errorCallback(response) {
                errorLog("Error creating check call status." + response);
            });
        }  
 
        var token = JSON.parse($cookies.get('admdron')).access_token;
        $rootScope.enableIAStatus = $cookies.get('enableIA');

        if(getDeviceInformation().includes("Safari")){
            $rootScope.enableIAStatus = 0;
        }

        patientUploader.headers.Authorization = 'Bearer ' + token;

        patientUploader.onWhenAddingFileFailed = function (item, filter, options) {
            swal(translationPrefered.INVALID_FILE, (item.name + '\n'+translationPrefered.INVALID_FILE_EXT), "error");      
        };

        patientUploader.onAfterAddingFile = function (fileItem) {
            fileItem.formData.push({patMedicalAppointmentId: $scope.actualAppointmentId});     
            fileItem.upload();
        };

        patientUploader.onProgressItem = function (fileItem, progress) {
            swal({
                title: "<img src='../img/loading-short.gif'></img>",
                html: true,
                showConfirmButton: false
            });
        };

        patientUploader.onSuccessItem = function (fileItem, response, status, headers) {
            swal.close();
            showNotify(translationPrefered.FILE_SENT, "success");
            $scope.getAttachments();
        };

        patientUploader.onErrorItem = function (fileItem, response, status, headers) {
            swal(translationPrefered.AVISO, translationPrefered.ERROR_UPLOAD + '\n' + response.description, "error");
        };

        //End uploader

        $scope.attachments = [];

        if (window.innerWidth < window.innerHeight) {
            window.location.replace(movilPatientLogin);
        }        

        $scope.admdron = JSON.parse($cookies.get('admdron'));
        $scope.chatProvider = $scope.admdron.chatProviderId;
        $scope.videoProvider = $scope.admdron.videoProviderId;
        $scope.phoneProvider = $scope.admdron.phoneProviderId;
        $scope.browserInfo = getDeviceInformation();
        $scope.osName = getOS();
        $scope.finishedFindingQueue = false;
        $rootScope.chatCompatibility = true;
        $rootScope.videoCompatibility = true;
        $scope.compatibilityMessage;
        $scope.firstAlertTime = 120;
        $scope.secondAlertTime = 60;
        $scope.thirdAlertTime = 30;
        $scope.firstAlertShown = false;
        $scope.secondAlertShown = false;
        $scope.thirdAlertShown = false;
        $scope.numberProfilesAllowed = $scope.admdron.numberProfilesAllowed;
        // ACEPTA TÉRMINOS Y CONDICIONES
        $scope.termsAccepted = 0;
        // FIN ACEPTA TÉRMINOS Y CONDICIONES
        $scope.disableAppointment = false;
        if($cookies.get('corpname')===undefined || $cookies.get('corpname') === ""){
            $scope.corpName = $scope.admdron.corporateInformation.corporateName.toLowerCase();
            $cookies.put("corpname",$scope.corpName);
            window.location.reload(true);
        }else{
            $scope.corpName = $cookies.get('corpname').toLowerCase();       
        }        
        $scope.userId = parseInt($scope.admdron.userId);
        $rootScope.corporateId = parseInt($scope.admdron.corporateId);
        $rootScope.showHeader = 1;

        $scope.cancelFollowup = function(followupId){
            swal({
                title: translationPrefered.CANCEL_FOLLOWUP,
                text: translationPrefered.CANCEL_FOLLOWUP_TEXT,
                showCancelButton: true,
                confirmButtonText: translationPrefered.CANCEL_FOLLOWUP_CONFIRM,
                cancelButtonText: translationPrefered.REGRESAR,
                showCancelButton: true,
                closeOnConfirm: false
            }, function (inputValue) {
                if (inputValue === true) {
                    FollowupResource.cancel({
                        followupId: followupId
                    }, function(response){
                        showSwal("success", translationPrefered.AVISO, translationPrefered.CANCEL_FOLLOWUP_SUCCESS);
                    });
                }
            });
        };
        $scope.initChatAppointment = function(){
            localStorage.setItem("optionSelectedUser", 1);
            if ($scope.admdron.parentCorporateInformation.corporateName != 'vivawell') {
                if(($scope.admdron.parentCorporateInformation.corporateName =='dronlinetdb' || $scope.admdron.parentCorporateInformation.corporateName =='viya' || $scope.admdron.parentCorporateInformation.corporateName =='viyasv' || $scope.admdron.parentCorporateInformation.corporateName =='viyani' || $scope.admdron.parentCorporateInformation.corporateName =='viyahn' || $scope.admdron.parentCorporateInformation.corporateName =='viyado') &&  $scope.numberAppointments == 0){
                    $state.go('pages.enter-code', {
                        optionId: 1
                    });      
                }
                if(($scope.admdron.parentCorporateInformation.corporateName =='dronlinetdb' || $scope.admdron.parentCorporateInformation.corporateName =='viya' || $scope.admdron.parentCorporateInformation.corporateName =='viyasv' || $scope.admdron.parentCorporateInformation.corporateName =='viyani' || $scope.admdron.parentCorporateInformation.corporateName =='viyahn' || $scope.admdron.parentCorporateInformation.corporateName =='viyado') &&  $scope.numberAppointments > 0){                   
                    $state.go('pages.speciality', {
                        optionId: 1
                    });
                }
                if($scope.admdron.parentCorporateInformation.corporateName !== 'dronlinetdb' && $scope.admdron.parentCorporateInformation.corporateName !== 'viya' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyasv' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyani' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyahn' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyado'){
                    $state.go('pages.speciality', {
                        optionId: 1
                    });     
                }
            }
        }
      
        
        $scope.initVideoCallAppointment = function(){
            localStorage.setItem("optionSelectedUser", 2);
            if ($scope.admdron.parentCorporateInformation.corporateName != 'vivawell') {
                if(($scope.admdron.parentCorporateInformation.corporateName =='dronlinetdb' || $scope.admdron.parentCorporateInformation.corporateName =='viya'|| $scope.admdron.parentCorporateInformation.corporateName =='viyasv' || $scope.admdron.parentCorporateInformation.corporateName =='viyani' || $scope.admdron.parentCorporateInformation.corporateName =='viyahn' || $scope.admdron.parentCorporateInformation.corporateName =='viyado') &&  $scope.numberAppointments == 0){
                    $state.go('pages.enter-code', {
                        optionId: 2
                    });      
                }
                if(($scope.admdron.parentCorporateInformation.corporateName =='dronlinetdb' || $scope.admdron.parentCorporateInformation.corporateName =='viya' || $scope.admdron.parentCorporateInformation.corporateName =='viyasv' || $scope.admdron.parentCorporateInformation.corporateName =='viyani' || $scope.admdron.parentCorporateInformation.corporateName =='viyahn' || $scope.admdron.parentCorporateInformation.corporateName =='viyado') &&  $scope.numberAppointments > 0){
                                   
                    
                    $state.go('pages.speciality', {
                            optionId: 2
                    });
                    
                }
                if($scope.admdron.parentCorporateInformation.corporateName !=='dronlinetdb' && $scope.admdron.parentCorporateInformation.corporateName !=='viya'&& $scope.admdron.parentCorporateInformation.corporateName !== 'viyasv' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyani' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyahn' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyado'){
                    $state.go('pages.speciality', {
                        optionId: 2
                    }); 
                }
            }
        }
       
        $scope.skipFlowIfhasOnlyOneProfile = function(){
            if( $stateParams.optionId  ) { 
                if( $scope.profiles.length == 1 ){
                    $scope.profileFunction($scope.profiles[0].profileId, $scope.profiles[0].admPerson, $scope.profiles[0]);                    
                }
            }
        }

        var checkSubscriptionInfo = function () {
            if ($state.current.name != "pages.patient") {
                $interval.cancel($scope.checkSubscriptionInterval);
            }
            if(!$scope.isDoctorVirtual){
                SubscriptionResource.information(function (res) {
                    if (res.subscription == undefined) {
                        if (res.remainingAppointments != undefined) {
                            $scope.remainingAppointments = res.remainingAppointments;
                            if (res.remainingAppointments == 0) {
                                $scope.disableAppointment = true;
                            } else {
                                $rootScope.showHeader = 1;
                                $scope.countText = res.remainingAppointments;
                                $scope.disableAppointment = false;
                            }
                        } else {
                            $scope.disableAppointment = true;
                            $scope.remainingAppointments = 0;
                        }
                        return true;
                    } else {
                        return false;
                    }
                });
            }else {
                return false;
            }
            
        };

        $scope.statusGDPRPatient = false;

        PatientResource.find({
            patientId: $scope.userId
        }, function (data) {
            $scope.statusGDPRPatient = data.corporateGDPR;
            if (!data.isPasswordRestored && !(JSON.parse($cookies.get('admdron')).corporateInformation.corporateName == "doctorvirtual")) {
                $state.go("pages.restore");
            }
        });
        

        if($scope.corpName == "cruzblanca"){
            $scope.isCruzBlanca = true;
        }

        PatientResource.parameterByName({
            parameterName: "QB_CHAT_COMPATIBILITY"
        }, function (response) {
            if ($scope.chatProvider == 1) {
                if (!response.value.includes($scope.browserInfo)) {
                    $rootScope.chatCompatibility = false;
                }
            }
            PatientResource.parameterByName({
                parameterName: "QB_VIDEO_COMPATIBILITY"
            }, function (response) {
                $scope.qbVideoCompatbility = response.value;
                if ($scope.videoProvider == 1) {
                    if (!response.value.includes($scope.browserInfo)) {
                        $rootScope.videoCompatibility = false;
                    }
                }
                PatientResource.parameterByName({
                    parameterName: "ZOOM_VIDEO_COMPATIBILITY"
                }, function (response) {
                    $rootScope.zoomVideoCompatibility = response.value;
                    if ($scope.videoProvider == 2) {
                        if (!response.value.includes($scope.browserInfo)) {
                            $rootScope.videoCompatibility = false;
                        }
                    }
                    if (!$rootScope.chatCompatibility || !$rootScope.videoCompatibility) {
                        $scope.browserSource = $scope.osName;
                        if ($scope.browserSource != "Android" && $scope.browserSource != "iOS") {
                            $scope.browserSource = "Web";
                        }
                        $scope.appMarket;
                        if ($scope.browserSource == "iOs") {
                            $scope.appMarket = "AppStore_URL";
                        }
                        if ($scope.browserSource == "Android") {
                            $scope.appMarket = "PlayStore_URL";
                        }
                        PatientResource.parameterByName({
                            parameterName: getCookie("language") + "_" + $scope.browserSource + "_SUGGESTION"
                        }, function (response) {
                            if ($scope.browserSource == "iOs" || $scope.browserSource == "Android") {
                                PatientResource.parameterByName({
                                    parameterName: $cookies.get('corpname') + "_" + $scope.appMarket
                                }, function (response2) {
                                    if (response2.value) {
                                        $rootScope.compatibilityMessage = response.value.replace("@", response2.value)
                                    } else {
                                        PatientResource.parameterByName({
                                            parameterName: getCookie("language") + "_WEB_SUGGESTION"
                                        }, function (response3) {
                                            $rootScope.compatibilityMessage = response3.value;
                                        });
                                    }
                                });
                            } else {
                                $rootScope.compatibilityMessage = response.value;
                            }
                        });
                    }
                });
            });
        });

        $scope.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

        $scope.option = parseInt($stateParams.optionId);

        $rootScope.showFooter = true;
        $rootScope.fromView = "pages.speciality";
        $rootScope.fromViewParams = {
            optionId: $stateParams.optionId
        };
        $rootScope.profId;
        $rootScope.specialityId;
        $rootScope.optionId;
        $rootScope.reconnect = false;
        $rootScope.secondTime = false;
        $scope.queueInformation;
        $scope.hasQueue = false;
        $scope.isOnCall = false;
        $rootScope.extraURLSessionCallActive = "";
        $scope.appointmentInformation;
        $scope.hasInvitation = false;
        $scope.doctorInfo;
        $scope.corporateAds;
        $scope.remainingSeconds = 0;
        $scope.emailChanged = false;
        $scope.currentEmail;
        $scope.patientEmail;
        $scope.affiliationNumber;
        $scope.currentPhone;
        $scope.patientPhone;
        $scope.currentAddress;
        $scope.patientAddress;
        $scope.patientBirthday;
        $scope.changeEmailClicked;
        $scope.changeText = translationPrefered.CAMBIAR;
        $scope.doctorProfileURL = "";
        $scope.minutesRemaining;
        $scope.appVersion = $scope.admdron.appCorporateVersion;
        $scope.appointmentType;
        $scope.loadingPay = false;
        $scope.minutesRemaining;
        $scope.remainingAppointments;
        $scope.userStatus;
        $scope.subscriptionResponse;
        $scope.isMiDoctor = false;
        $scope.timesPulled = 0;
        $scope.numberAppointments;
        $rootScope.codeToCheck;
        $rootScope.showProfiles = true;
        $rootScope.showPayChat = false;
        $rootScope.showPayVideo = false;
        $rootScope.specialityId;
        PatProfileResource.findAll(function (data) {
            $scope.profiles = data;

            $scope.skipFlowIfhasOnlyOneProfile();

        });

        window.onbeforeunload = null;

        $rootScope.movil = $cookies.get('movil');

        $rootScope.playerId;
        $rootScope.deviceId;

        infoLog("notificationAppId: " + $scope.admdron.notificationAppId);

        $(document).ready(function () {
            var oneSingalCookie = Cookies.get('oneSignalInitialized');
            if (typeof oneSingalCookie != 'undefined' && oneSingalCookie == 'false') {
                var OneSignal = window.OneSignal || [];
                OneSignal.push(function () {
                    OneSignal.init({
                        appId: $scope.admdron.notificationAppId
                    });
                    OneSignal.getUserId(function (id) {
                        $rootScope.playerId = id;
                        subscribeNotification();
                    });
                    OneSignal.on('subscriptionChange', function (isSubscribed) {
                        if (isSubscribed) {
                            OneSignal.getUserId(function (id) {
                                $rootScope.playerId = id;
                                subscribeNotification();
                            });
                        }
                    });
                });
                document.cookie = "oneSignalInitialized=true;path=/";
            }
        });


        var subscribeNotification = function () {
            infoLog("playerId: " + $rootScope.playerId);

            var req = {
                userId: $scope.userId,
                providerId: 1,
                deviceDescription: navigator.appVersion,
                appId: 1,
                token: $rootScope.playerId
            };


            DeviceResource.registerDevice(req,
                function (data) {
                    $rootScope.deviceId = data.deviceId;
                });
        }

        if ($cookies.get('corpname') == "midoctor") {
            $scope.isMiDoctor = true;
            PatProfileResource.find({
                profileId: parseInt(JSON.parse($cookies.get('admdron')).userId)
            }, function (data) {
                IntegrationResource.find({
                    msisdn: data.admPerson.poliza,
                    resource: $cookies.get('resource')
                }, function (data2) {
                    infoLog(data2);
                    $scope.subscriptionResponse = data2;
                    $scope.remainingAppointments = data2.remainingAppointments;
                    if (data2.remainingAppointments == 0) {
                        $scope.disableAppointment = true;
                        if ($state.current.name != "pages.patient") {
                            $state.go("pages.patient");
                        }
                    } else {
                        $scope.countText = data2.remainingAppointments;
                    }
                    if (data2.status == "INACTIVE") {
                        $scope.disableAppointment = true;
                        $scope.userStatus = false;
                    } else {
                        $scope.userStatus = true;
                    }
                });
            });
        }

        if ($state.name = "medical-appointment") {
            $rootScope.showFooter = false;
        }

        PatientResource.getCorporateAds({
            corpDomain: $cookies.get('resource')
        }, function (res) {
            if (res.length > 0) {
                $scope.corporateAds = res;
                $('.carousel').carousel({
                    interval: 4500
                });
            }
        });

        PatientResource.checkAttentionTime({
            corpName: $cookies.get('corpname')
        }, function (result) {
            if ((typeof result.value != "undefined") && (result.value != "")) {
                $scope.outOfAttentionTime = result.value;
                PatientResource.parameterByName({
                    parameterName: $cookies.get('corpname') + "_TELEPHONE_INFORMATION"
                }, function (response) {
                    $scope.phoneInfo = response.value;
                });
            }
        });

        $scope.trustSrcurl = function(data) {
            return $sce.trustAsResourceUrl(data);
        }

        $scope.notifyAdClick = function (noti, adId, buttonUrl) {
            if (noti === 1) {
                let adNotify = {
                    corporateAdId: adId,
                    userId: $scope.userId
                };
                PatientResource.sendAdNotification(adNotify, function (res) {});
            }
            window.open(buttonUrl, '_blank');
        };

        $scope.registerForm = function () {
            document.cookie = 'activeMember=false;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
            localStorage.setItem("corporateName", $scope.corpName)
            window.location = URLBase + webSiteName + 'views/register.php';
        };

        $scope.hideInvite = true;

        $scope.waitHome = function () {
            window.location.reload(true);
        };

        var findQueueFunction = function () {
            if ($state.current.name != "pages.patient") {
                $interval.cancel($scope.findHasQueue);
                $scope.finishedFindingQueue = true;
            }

            AppointmentResource.findCallbackOrInvitation({
                userId: $scope.userId,
                appCorporateVersionId: $scope.admdron.appCorporateVersion,
                deviceId: $rootScope.deviceId,
                termsAccepted: !$scope.termsAccepted ? 0 : $scope.termsAccepted
            }, function (res) {
                $scope.numberAppointments = res.numberAppointments;
                $rootScope.numberAppointments = res.numberAppointments;
                if(window.location.hash == '#/pages/speciality/1' && $scope.numberAppointments == 0  && ($cookies.get('corpname') == "dronlinetdb" || $cookies.get('corpname') == "viya" || $cookies.get('corpname') == "viyasv" || $cookies.get('corpname') == "viyani" || $cookies.get('corpname') == "viyahn" || $cookies.get('corpname') == "viyado") || window.location.hash == '#/pages/speciality/2' && $scope.numberAppointments == 0 && ($cookies.get('corpname') == "dronlinetdb" || $cookies.get('corpname') == "viya" || $cookies.get('corpname') == "viyasv" || $cookies.get('corpname') == "viyani" || $cookies.get('corpname') == "viyado" || $cookies.get('corpname') == "viyahn")){
                    $state.go('pages.patient');
                }
                $scope.finishedFindingQueue = true;
                $scope.queueInformation = res;
                /*if(JSON.parse($cookies.get('admdron')).corporateInformation.attentionPlan == 4 && $state.current.name != 'pages.enter-code' && $scope.termsAccepted != 1 &&
                    $scope.queueInformation.scheduled.first === undefined){
                    $state.go("pages.calendar");
                }*/
                if (window.location.origin == 'https://app-latam-qa.doctor-online.co' || window.location.host == 'localhost') {
                    if($scope.queueInformation.scheduled.indications){
                    $scope.queueInformation.scheduled.indications = $scope.queueInformation.scheduled.indications.replace("https://doctor-directory.doctor-online.co", 'https://doctor-directory-qa.doctor-online.co')
                    }
                }
                if($scope.queueInformation.scheduled !== undefined && $scope.queueInformation.scheduled.first !== undefined){
                    if($scope.queueInformation.scheduled.first.disableOnDemand){
                        $rootScope.showChangeAttendance = false;
                        $rootScope.corpAttentionType = 2;
                    } else {
                        $rootScope.showChangeAttendance = true;
                    }
                    $scope.getDoctorPhoto($scope.queueInformation.scheduled.first.doctorId);
                } else if($scope.queueInformation.followup !== undefined && $scope.queueInformation.followup.first !== undefined){
                    $rootScope.showChangeAttendance = false;
                    $rootScope.corpAttentionType = 1;
                }
                 else {
                    $rootScope.showChangeAttendance = true;
                }
                if($cookies.get('corpname') == "cruzblanca"){
                    $scope.remainingAppointments = res.remainingAppointments;
                    $scope.countText = res.remainingAppointments;
                    $scope.disableAppointment = ($scope.remainingAppointments == 0);
                }
                $scope.hasInvitation = res.hasInvitation;
                $scope.hasQueue = res.hasQueue;

                if( $scope.termsAccepted == 1 && $scope.showChangeAttendance
                    && ( $scope.admdron.parentCorporateInformation.corporateName == "vivawell"
                    || $scope.admdron.parentCorporateInformation.corporateName == "drnn" )  ) {
                    document.location.reload(true)
                }

                if (res.hasQueue == false && res.hasInvitation == false) {
                    $scope.isOnCall = res.isOnCall;
                    if($scope.isOnCall){
                        $rootScope.showChangeAttendance = false;
                    }
                    if ($state.current.name == "pages.speciality" && $scope.isOnCall) {
                        $state.go("pages.patient");
                    }
                    return;
                }
                
                if ($scope.hasQueue == true) {
                    $rootScope.showChangeAttendance = false;
                    if ($scope.queueInformation.queueInformation.timeEstimated == 0) {
                        if ($scope.queueInformation.appointment.serviceTypeId != 3) {
                            if (($rootScope.corpAttentionType === 2 && $scope.termsAccepted) || $rootScope.corpAttentionType === 1) {
                                $('#successModal').modal('hide');
                                $interval.cancel($scope.findHasQueue);
                                $timeout($scope.redireccionar, 500);
                                
                            }
                        }
                    }
                }
                if ($scope.hasInvitation == true) {
                    $rootScope.showChangeAttendance = false;
                    $rootScope.profId = res.invitation.patProfile.profileId;
                    $rootScope.specialityId = res.invitation.specialityId.specialityId;
                    $rootScope.optionId = res.invitation.serviceTypeId;
                    $rootScope.extraURLSessionCallActive = "/" + res.invitation.patMedicalAppointmentInvitationId;
                    $scope.isOnCall = false;
                    $scope.hasQueue = false;
                } else {
                    $rootScope.extraURLSessionCallActive = "";
                }
            });
        };

        $scope.getTimeString = function(seconds){
            if(seconds == undefined){
                return "";
            }
            var date = new Date(0);
            date.setSeconds(seconds);
            var timeString = date.toISOString().substr(11, 8);
            return timeString;
        }

        $scope.currentDoctor = {};
        $scope.getDoctorPhoto = function(doctorId){
            if($scope.currentDoctor.doctorId !== doctorId){
                DoctorResource.find({
                    doctorId: doctorId
                }, function (data) {
                    $scope.currentDoctor = data;
                });
            }            
        }

        $scope.redireccionar = function () {
            $rootScope.parametro1 = $scope.queueInformation.appointment.patMedicalAppointmentId;
            $rootScope.parametro2 = "PATIENTHASAPPOINTMENT";
            $rootScope.parametro3 = $scope.queueInformation.appointment.patMedicalAppointmentId;
            $rootScope.parametro4 = $scope.queueInformation.appointment.docSpecialityId.specialityId;
            $state.go("pages.medical-appointment");
            $scope.termsAccepted = 0;
        }
        if ($state.current.name == "pages.patient" || $state.current.name == "pages.speciality") {
            findQueueFunction();
            $scope.findHasQueue = $interval(findQueueFunction, 5000);
        }
        if($state.current.name == "pages.enter-code"){
            findQueueFunction();
        }
        if($state.current.name == "pages.speciality" && ($scope.corpName == "dronlinetdb")){ 
            
            SpecialityResource.findAll(function (res) {
                $scope.specialitiesTDB = res;
                if ($scope.specialitiesTDB.length > 1) {
                    //$scope.showSpeciality = true;
                    $scope.showPayChat = false;
                    $scope.showPayVideo = false;
                } else {
                    $scope.specialityFunction($scope.specialitiesTDB[0].specialityId, $scope.specialitiesTDB[0]);
                }

                $rootScope.showProfiles = false;

            if ($scope.option == 2 && $scope.specialitiesTDB.length < 2) {
                $scope.showPayVideo = true;
                $scope.enablePatientPermissions = true;
                checkcameraMicroPhonePermissions = true;
                //checkAudioLevel();
                checkDevicesAngular();
                ReactDOM.render(
                    React.createElement(Webcam, null),
                    document.getElementById('root'));
                $('video').addClass("videoPreview");
                $('video').css("padding", "0px");
                $('video').css("margin", "0px");
                $('video').css("box-sizing", "content-box");
                $('video').css("width", "100%");
                $('video').css("height", "20%");
                $('svg').css("width", "25%");
                $('svg').css("height", "7%");
                $('svg').css("display", "inline-block");
                $('svg').css("padding", "0px");
                $('svg').css("margin", "0px");
                $('svg').css("box-sizing", "content-box");
                $('.pl-circular').css("height", "");
                $('.pl-circular').css("width", "");
                $rootScope.profId = $rootScope.currentUserId
                var req = {
                    patProfileId: $rootScope.profId
                }
               
                PatProfileResource.createQuickbloxUser(req, function (res) {
                });

            }
            else if ( $scope.specialitiesTDB.length < 2 ){
                $scope.showPayChat = true;
                $rootScope.profId = $rootScope.currentUserId
                var req = {
                    patProfileId: $rootScope.profId
                }

                PatProfileResource.createQuickbloxUser(req, function (res) {
                });
            }

            });
            
            
        } //specialty and corp = dronlinetdb
        $scope.declineInvitation = function () {
            $scope.hasInvitation = false;
            $scope.hasQueue = false;
            AppointmentResource.declineInvitation({
                invitationId: $scope.queueInformation.invitation.patMedicalAppointmentInvitationId
            }, function (res) {
                $scope.hasInvitation = false;
            });
        }

        $scope.showChangeEmailNotification = function () {
            $.notify({
                title: '<strong>'+translationPrefered.EMAIL_UPDATED+'</strong><br>',
                message: '',
            }, {
                type: 'success',
                delay: 1000,
                classname: 'corporate',
                animate: {
                    enter: 'animated fadeInRight',
                    exit: 'animated fadeOutRight',
                },
                placement: {
                    from: 'bottom'
                }
            });
        };

        $scope.showChangeDataNotification = function () {
            $.notify({
                title: '<strong>'+translationPrefered.DATA_UPDATED+'</strong><br>',
                message: '',
            }, {
                type: 'success',
                delay: 2000,
                classname: 'corporate',
                animate: {
                    enter: 'animated fadeInRight',
                    exit: 'animated fadeOutRight',
                },
                placement: {
                    from: 'bottom'
                }
            });
        };

        $scope.viewDoctorProfile = function () {
            $window.open($scope.doctorProfileURL, '_blank');
            logInfo($scope.actualAppointmentId, "PACIENTE: Revisó el perfil del doctor");
        }


        $scope.cancelQueue = function () {
            $scope.actualAppointmentId = $scope.queueInformation.appointment.patMedicalAppointmentId;
            $scope.cancelByFilter(false);
            $scope.hasQueue = false;
        }

        $scope.showSpeciality = false;
        $scope.NoSub = false;
        $scope.noAvailable = false;
        $scope.specialities = SpecialityResource.findAll();
        $scope.pass = false;
        $scope.done = false;
        $scope.zoomURL = "";
        $scope.corporateName = URLBase + webSiteName + "views/terms/" + $cookies.get('corpclass');
        $scope.profileFunction = function (id, admPerson, profile) { 
            $scope.showProfiles = false;
            $scope.showOption = false;
            $scope.showLoader = true;
            $scope.profileId = id;
            $rootScope.profId = $scope.profileId;
            admPerson.patientFiles = profile.patientFiles;
            $scope.profileAdmPerson = admPerson;
            infoLog(admPerson);
            $scope.name = admPerson.firstName + " " + admPerson.lastName;
            $scope.hasEmail = admPerson.emailPerson != null;
            if ($scope.hasEmail) {
                $scope.email = admPerson.emailPerson;
                $scope.currentEmail = admPerson.emailPerson;
            }
            $scope.hasPhone = admPerson.mobilePhone != null;
            if ($scope.hasPhone) {
                $scope.currentPhone = admPerson.mobilePhone;
            }
            $scope.address = admPerson.address;
            $scope.currentAddress = admPerson.address;
            var req = {
                patProfileId: id
            }
            
            if ($scope.option == 2) { 
                if ($scope.videoProvider == 1) {
                    PatProfileResource.createQuickbloxUser(req, function (res) {
                        $scope.showLoader = false;
                    });
                } else {
                    $scope.showLoader = false;
                }
            } else {
                if ($scope.chatProvider == 1) {
                    PatProfileResource.createQuickbloxUser(req, function (res) {
                        $scope.showLoader = false;
                    });
                } else {
                    $scope.showLoader = false;
                }
            }

            $scope.specialities = SpecialityResource.findAll(function (res) { 
                $scope.specialities = res;
                if ($scope.specialities.length > 1) {
                    if($scope.option != 4){
                        $scope.showSpeciality = true;
                    }else {
                        $scope.specialityFunction($scope.specialities[0].specialityId, $scope.specialities[0]);
                    }
                } else {
                    $scope.specialityFunction($scope.specialities[0].specialityId, $scope.specialities[0]);
                }
            });
        };

        if (typeof $rootScope.idPerson !== 'undefined' && typeof $rootScope.objePerson !== 'undefined') {
            if ($rootScope.idPerson !== '' && $rootScope.objePerson !== '') {
                $scope.profileFunction($rootScope.idPerson, $rootScope.objePerson, $rootScope.objePerson.patProfile);
                $rootScope.idPerson = '';
                $rootScope.objePerson = '';
            }
        }

        $scope.specialityFunction = function (id, speciality) {

            $scope.speciality = id;
            $rootScope.specialityId = $scope.speciality;
            $scope.selectedSpeciality = speciality;
            $scope.showProfiles = false;
            $scope.showOption = false;
            $scope.showSpeciality = false;
            if ($scope.selectedSpeciality.name == 'Médico General') {
                $translate(['Médico General']).then(function (translationsES) {
                    $scope.selectedSpeciality.name = translationsES['Médico General'];
                }, function (translationsEN) {
                    $scope.selectedSpeciality.name = translationsEN['Médico General'];
                }, function (translationsFR) {
                    $scope.selectedSpeciality.name = translationsFR['Médico General'];
                });
            }
            
            if ($scope.option === 1) {
                $rootScope.optionId = 1;
                $scope.showPayChat = true;
                $scope.showPayVideo = false;
                if ($rootScope.corporateId==59 && ($scope.speciality==126 || $scope.speciality==70)) {
                    const date = new Date()
                    if (((date.getUTCHours()<6 || date.getUTCHours()>8)&&(date.getDay()===2 || date.getDay()===4)) || (date.getDay()!==2 && date.getDay()!==4)) {
                        swal('Σημείωση:', `${translationPrefered.PEDIATRICAN_ALERT}`)
                        $scope.showSpeciality = true;
                        $scope.showPayChat = false;
                    }
                }
            } else if ($scope.option === 2) {
                $rootScope.optionId = 2;
                $scope.showPayChat = false;
                $scope.showPayVideo = true;
                if ($rootScope.corporateId==59 && ($scope.speciality==126 || $scope.speciality==70)) {
                    const date = new Date()
                    if (((date.getUTCHours()<6 || date.getUTCHours()>8)&&(date.getDay()===2 || date.getDay()===4)) || (date.getDay()!==2 && date.getDay()!==4)) {
                        swal('Σημείωση:', `${translationPrefered.PEDIATRICAN_ALERT}`)
                        $scope.showSpeciality = true;
                        $scope.showPayVideo = false;
                    }
                }
                $scope.enablePatientPermissions = true;
                checkcameraMicroPhonePermissions = true;
                checkAudioLevel();
                checkDevicesAngular();
                ReactDOM.render(
                    React.createElement(Webcam, null),
                    document.getElementById('root'));
                $('video').addClass("videoPreview");
                $('video').css("padding", "0px");
                $('video').css("margin", "0px");
                $('video').css("box-sizing", "content-box");
                $('video').css("width", "100%");
                $('video').css("height", "20%");
                $('svg').css("width", "25%");
                $('svg').css("height", "7%");
                $('svg').css("display", "inline-block");
                $('svg').css("padding", "0px");
                $('svg').css("margin", "0px");
                $('svg').css("box-sizing", "content-box");
                $('.pl-circular').css("height", "");
                $('.pl-circular').css("width", "");

            }else if($scope.option === 4){
                $rootScope.optionId = 4;
                $scope.showPayChat = false;
                $scope.showPayVideo = true;
                if ($rootScope.corporateId==59 && ($scope.speciality==126 || $scope.speciality==70)) {
                    const date = new Date()
                    if (((date.getUTCHours()<6 || date.getUTCHours()>8)&&(date.getDay()===2 || date.getDay()===4)) || (date.getDay()!==2 && date.getDay()!==4)) {
                        swal('Σημείωση:', `${translationPrefered.PEDIATRICAN_ALERT}`)
                        $scope.showSpeciality = true;
                        $scope.showPayVideo = false;
                    }
                }
                /*$scope.enablePatientPermissions = true;
                checkcameraMicroPhonePermissions = true;
                checkAudioLevel();
                checkDevicesAngular();
                ReactDOM.render(
                    React.createElement(Webcam, null),
                    document.getElementById('root'));
                $('video').addClass("videoPreview");
                $('video').css("padding", "0px");
                $('video').css("margin", "0px");
                $('video').css("box-sizing", "content-box");
                $('video').css("width", "100%");
                $('video').css("height", "20%");
                $('svg').css("width", "25%");
                $('svg').css("height", "7%");
                $('svg').css("display", "inline-block");
                $('svg').css("padding", "0px");
                $('svg').css("margin", "0px");
                $('svg').css("box-sizing", "content-box");
                $('.pl-circular').css("height", "");
                $('.pl-circular').css("width", "");*/
            }
        };

        $scope.$watch(function () {
            return $state.$current.name
        }, function (newVal, oldVal) {
            if (newVal == "pages.patient" || newVal == "pages.medical-appointment") {
                try {
                    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
                } catch (error) {
                    errorLog("Error al quitar camara de pulling. " + error);
                }
            }
        });

        $scope.changeEmail = function () {
            updateEmail();
        };

        $scope.acceptTerms = function () {
            $scope.enablePay = true;
            $scope.enableRecord = true;
        };
        $scope.acceptTestResource = function () {
            $scope.enablePayResource = true;
        };

        $scope.subscriptionView = function () {
            $state.go('pages.subscription');
        };

        updateEmail = function () {
            if ($scope.currentEmail == ""){
                $scope.currentEmail == $scope.profileAdmPerson.emailPerson
            }
            if ($scope.currentEmail == ""){
                $scope.currentPhone == $scope.profileAdmPerson.mobilePhone
            }
            if ($scope.currentEmail == ""){
                $scope.currentAddress == $scope.profileAdmPerson.address
            }
            var profileContactInfo = {
                profileId: $scope.profileAdmPerson.personId,
                profileEmail: $scope.currentEmail,
                profilePhone: $scope.currentPhone,
                profileAddress: $scope.currentAddress
            }
            PatProfileResource.updateContactInformation(profileContactInfo, function (response) {
                $scope.hasPhone = (response.profilePhone);
                $scope.hasEmail = (response.profileEmail);
                $scope.currentPhone = response.profilePhone;
                $scope.currentEmail = response.profileEmail;
                $scope.currentAddress = response.profileAddress;
                $scope.profileAdmPerson.mobilePhone = response.profilePhone;
                $scope.profileAdmPerson.address = response.profileAddress;
                $scope.email = response.profileEmail;
                //$('#changeEmail').modal('hide');
                $scope.showChangeDataNotification();
            });
        };

        $scope.changePatientEmail = function () {
            if ($scope.hasEmail) {
                if ($scope.patientEmail == undefined || $scope.patientEmail == null || $scope.patientEmail == "") {
                    return;
                }
            }
            if ($scope.hasPhone) {
                if ($scope.patientPhone == undefined || $scope.patientPhone == null || $scope.patientPhone == "") {
                    return;
                }
            }
            var profileContactInfo = {
                profileId: $scope.patientId,
                profileEmail: $scope.patientEmail,
                profilePhone: $scope.patientPhone,
                profileAddress: $scope.patientAddress,
                profileBirthday: $scope.patientBirthday
            }
            PatProfileResource.updateContactInformation(profileContactInfo, function (response) {
                $scope.hasPhone = (response.profilePhone);
                $scope.hasEmail = (response.profileEmail);
                $scope.currentPhone = response.profilePhone;
                $scope.patientPhone = response.profilePhone;
                $scope.patientEmail = response.profileEmail;
                $scope.currentEmail = response.profileEmail;
                $scope.patientAddress = response.profileAddress;
                $scope.patientBirthday = response.patientBirthday;
                $scope.currentAddress = response.profileAddress;
                $scope.showChangeEmailNotification();
                logInfo($scope.actualAppointmentId, "PATIENT: Registró un correo electrónico.");
            });
        };

        updateEmailPatient = function () {
            var reqEmail = {
                method: 'GET',
                url: apiURLBaseJS + "dronline-patient-api/api/patient/updatePatientEmail/" + $scope.patientId + "/" + $scope.patientEmail
            };
            $http(reqEmail).then(function successCallback(response) {
                $scope.patientEmail = response.data.emailPerson;
                $scope.currentEmail = response.data.emailPerson;
                $scope.emailChanged = true;
            }, function errorCallback(response) {
                $scope.currentEmail = $scope.email;
            });
            //$('#changeEmail').modal('hide');
        };

        $scope.cancelByFilter = function (doctorUnavailable) {
            var token = JSON.parse($cookies.get('admdron')).access_token;
            var reqCancel = {
                method: 'POST',
                url: apiURLBaseJS + "dronline-patient-api/api/patient/end-medical-appointment-error",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                data: {
                    medicalAppointmentId: $scope.actualAppointmentId,
                    doctorUnavailable: doctorUnavailable
                }
            };
            $http(reqCancel).then(function successCallback(response) {});
        };

        appointmentValidation = function () {
            var deferred = $q.defer();
            var reqHours = {
                method: 'GET',
                url: apiURLBaseJS + "dronline-admin-api/api/parameter/checkAttentionTime?corporateName=" + $cookies.get('corpname')
            };
            $http(reqHours).then(function successCallback(response) {
                if ((typeof response.data.value != "undefined") && (response.data.value != "")) {
                    //PENDIENTE CHANGE SENDEMAIL AND SET STATUS
                    infoLog(response);
                    $scope.waitingMessage = response.data.value;
                    deferred.resolve(false);
                } else {
                    var reqOffline = {
                        method: 'GET',
                        url: apiURLBaseJS + "dronline-doctor-api/api/doctor/findDoctorDisponibility/" + $rootScope.corporateId + "/" + $rootScope.specialityId + "/" + $cookies.get('corpname'),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    infoLog(reqOffline);
                    $http(reqOffline).then(function successCallback(response) {
                        infoLog(response);
                        if ((typeof response.data.value != "undefined") && (response.data.value != "")) {
                            $scope.waitingMessage = response.data.value;
                            deferred.resolve(false);
                        } else {
                            $scope.pass = true;
                            deferred.resolve(true);
                        }
                    });
                }
            });
            $scope.done = true;
            return deferred.promise;
        };

        $scope.cancelAppointment = function () {
            $scope.canceled = true;
            if ($scope.actualAppointmentId != "") {
                var token = JSON.parse($cookies.get('admdron')).access_token;
                var reqCancel = {
                    method: 'POST',
                    url: apiURLBaseJS + "dronline-patient-api/api/patient/end-medical-appointment",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    data: {
                        medicalAppointmentId: $scope.actualAppointmentId,
                        doctorUnavailable: false
                    }
                };
                $http(reqCancel).then(function successCallback(response) {
                    logWarning($scope.actualAppointmentId, "PATIENT2: Canceló la consulta, estando en pantalla de espera.");
                    $interval.cancel(getMedicalAppointment);
                    $interval.cancel(tipsInterval);
                    getMedicalAppointment = null;
                    updateSessionStatusVideoCall($scope.actualAppointmentId, statesEnum.CANCELED_PA, "");
                    window.location.reload(true);
                });
            }
        };

        $scope.endAppointment = function () {
            if ($scope.actualAppointmentId != "") {
                var token = JSON.parse($cookies.get('admdron')).access_token;
                var reqCancel = {
                    method: 'POST',
                    url: apiURLBaseJS + "dronline-patient-api/api/patient/end-medical-appointment",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    data: {
                        medicalAppointmentId: $scope.actualAppointmentId
                    }
                };
                $http(reqCancel).then(function successCallback(response) {
                    $interval.cancel(AppointmentInterval);
                    $interval.cancel(AppointmentTime);
                    AppointmentInterval = null;
                    AppointmentTime = null;
                });
            }
        };

        $scope.confirm = function () {
            if(checkcameraMicroPhonePermissions && !permissionsCameraMicroPhone) {
                if($scope.option === 2){
                    alert("No se pudo obtener acceso al camera y/o Microfono");
                    return;
                }
            }
            $scope.loadingPay = true;
            AppointmentResource.findCallbackOrInvitation({
                userId: $scope.userId,
                termsAccepted: !$scope.termsAccepted ? 0 : $scope.termsAccepted
            }, function (res) {
                if (!res.hasQueue && !res.isOnCall && !(res.followup && res.followup.first)) {
                    if ($cookies.get('corpname') == "midoctor") {
                        PatProfileResource.find({
                            profileId: parseInt(JSON.parse($cookies.get('admdron')).userId)
                        }, function (data) {
                            IntegrationResource.find({
                                msisdn: data.admPerson.poliza,
                                resource: $cookies.get('resource')
                            }, function (data2) {
                                infoLog(data2);
                                if (data2.remainingAppointments == 0 || data2.status == "INACTIVE") {
                                    $state.go("pages.patient");
                                    return;
                                } else {
                                    $scope.changeEmail();
                                    $scope.pay();
                                }
                            });
                        });
                    } else {
                        FollowupResource.getProfileFollowup({
                            profileId: $rootScope.profId
                        }, function(response){
                            if(response.patMedicalAppointmentFollowupId !== undefined){
                                $scope.loadingPay = false;
                                swal({
                                    title: translationPrefered.HAS_FOLLOWUP,
                                    text: translationPrefered.CANCEL_FOLLOWP_ON_NEW_APPOINTMENT,
                                    showCancelButton: true,
                                    confirmButtonText: translationPrefered.CANCEL_FOLLOWUP_CONFIRM,
                                    cancelButtonText: translationPrefered.REGRESAR,
                                    showCancelButton: true,
                                    closeOnConfirm: true
                                }, function (inputValue) {
                                    if (inputValue === true) {
                                        $scope.loadingPay = true;
                                        $scope.pay();
                                    }
                                });
                            }else{
                                $scope.pay();
                            }                           
                        });                  
                    }
                } else {
                    swal({
                        title: translationPrefered.LO_SENTIMOS,
                        text: translationPrefered.PATIENT_NEW_REQ,
                        type: 'error',
                        confirmButtonText: translationPrefered.buttonOK,
                        closeOnConfirm: true
                    }, function () {
                        $state.go('pages.patient');
                    });
                }
            });
        };

        $scope.updateProfilePhone = function () {
            $state.go('pages.update-phone', {
                profileId: $rootScope.profId
            });
        };

        $scope.getAttachments = function(){
            $scope.attachments = AttachmentResource.getAppointmentAttachments({appointmentId: $scope.actualAppointmentId});                        
        }

        $scope.openAttachment = function(attachment){
            if(attachment.url !== undefined){
                window.open(attachment.url, '_blank');
                return;
            }
            AttachmentResource.getAttachment({attachmentId: attachment.patMedicalAppointmentAttachmentId}, function(res){
                attachment = res;
                window.open(attachment.url, '_blank');
            })
        }

        $scope.pay = function () {
            PatientResource.parameterByName({
                parameterName: "FIRST_ALERT_SECONDS"
            }, function (response) {
                $scope.firstAlertTime = response.value;
            });

            PatientResource.parameterByName({
                parameterName: "SECOND_ALERT_SECONDS"
            }, function (response) {
                $scope.secondAlertTime = response.value;
            });

            PatientResource.parameterByName({
                parameterName: "THIRD_ALERT_SECONDS"
            }, function (response) {
                $scope.thirdAlertTime = response.value;
            });

            $scope.firstAlertShown = false;
            $scope.secondAlertShown = false;
            $scope.thirdAlertShown = false;

            $scope.timesPulled = 0;
            $scope.enablePay = true;
            $scope.enableRecord = true;
            if ($rootScope.deviceId == undefined) {
                $rootScope.deviceId = 0;
            }
            //CHECK
            $scope.isNonSubscription = false;
            appointmentValidation().then(function (result) {
                if (result) {
                    creationMedicalAppointment();
                } else {
                    if($rootScope.optionId != 4){
                        $scope.noAvailable = true;
                    }else {
                        creationMedicalAppointment();
                    }
                }
            });
        };
        $scope.payReconnect = function () {
            //CHECK
            appointmentValidation().then(function (result) {
                if (result) {
                    var reqCHECK = {
                        method: 'GET',
                        url: apiURLBaseJS + "dronline-call-api/sessioncallactive/retry/" + $rootScope.cancelAppointmentId,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        data: {
                            chatProviderId: $scope.chatProvider,
                            videoProviderId: $scope.videoProvider,
                            phoneProviderId: $scope.phoneProvider,
                            appCorporateVersion: $scope.appVersion,
                            deviceId: $rootScope.deviceId
                        }
                    };

                    $http(reqCHECK).then(function successCallback(response) {
                        logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: Se registró una nueva consulta de reintento.");

                        if (response.data.codigo == 6) {
                            logInfo(response.data.resultado.idMedicalAppointment, "DRONLINE PATIENT: Se confirmó la creación de la consulta en navegador");
                            var checkMedicalAppointmentId = response.data.resultado.idMedicalAppointment;
                            var checkSpecialTag = "PATIENTHASAPPOINTMENT";
                            var checkIdsessionAppoinintment = response.data.resultado.id;
                            $rootScope.parametro1 = checkMedicalAppointmentId;
                            $rootScope.parametro2 = checkSpecialTag;
                            $rootScope.parametro3 = checkIdsessionAppoinintment;
                            $rootScope.parametro4 = $scope.speciality;
                            $scope.loading();
                            $rootScope.showHeader = 1;
                            $rootScope.showFooter = true;
                            logInfo(response.data.resultado.idMedicalAppointment, 'DRONLINE PATIENT: Se detectó la creación de la consulta en navegador.');
                        } else if (response.data.codigo == 8) {
                            warningLog("No se puede realizar la consulta");
                        } else {
                            var req = {
                                "serviceType": $scope.option,
                                "medicalAppointment": {
                                    "profileId": {
                                        "profileId": $scope.profileId
                                    },
                                    "docSpecialityId": {
                                        "specialityId": $scope.speciality
                                    },
                                    "geoLatitude": 14.598769,
                                    "geoLongitude": -90.5091886
                                }
                            }
                            BillingResource.save(req, function (res) {
                                window.location = res.urlTransaction;
                                //https://'+domainBaseJS+'/seguros/web/views/redirect-confirm.php?parameter1=c6929b34ebcb689bf68145dda7529f04&parameter2=2075DRONLINE229DRONLINE2001
                            });
                        }
                    }, function errorCallback(response) {
                        errorLog("Error creating check call status.");
                    });
                } else {
                    $scope.showLoading = true;
                    $scope.waitingMessage = "";
                }
            });
        };

        function creationMedicalAppointment() {
            var reqCHECK = {
                method: 'POST',
                url: apiURLBaseJS + "dronline-call-api/sessioncallactive/" + $rootScope.profId + "/" + $rootScope.specialityId + "/" + $rootScope.optionId + $rootScope.extraURLSessionCallActive,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                data: {
                    chatProviderId: $scope.chatProvider,
                    videoProviderId: $scope.videoProvider,
                    phoneProviderId: $scope.phoneProvider,
                    appCorporateVersion: $scope.appVersion,
                    deviceId: $rootScope.deviceId
                }
            };

            $http(reqCHECK).then(function successCallback(response) {
                if (response.data.codigo == 6) {
                    logInfo(response.data.resultado.idMedicalAppointment, "DRONLINE PATIENT: Se confirmó la creación de la consulta de análisis en el navegador");
                    var checkMedicalAppointmentId = response.data.resultado.idMedicalAppointment;
                    var checkSpecialTag = "PATIENTHASAPPOINTMENT";
                    var checkIdsessionAppoinintment = response.data.resultado.id;
                    $rootScope.parametro1 = checkMedicalAppointmentId;
                    $rootScope.parametro2 = checkSpecialTag;
                    $rootScope.parametro3 = checkIdsessionAppoinintment;
                    $rootScope.parametro4 = $scope.speciality;
                    if (!$rootScope.reconnect) {
                        if($rootScope.optionId == 4){
                            var license_code_vitalsigns = {
                                method: 'POST',
                                url: apiURLBaseJS + "dronline-binah-api/api/binah/init-analyse/" + checkMedicalAppointmentId,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*'
                                },
                            };

                            $http(license_code_vitalsigns).then(function successCallback(response) {
                                const binah_json = {
                                    "red" : URLBase +"web/private/index.php#/pages/patient",
                                    "pcolor" : rgbToHex(getHeaderColor()[0],getHeaderColor()[1],getHeaderColor()[2]),
                                    "log" : "./assets/img/" + document.getElementById("patient-logo").src.split("/").pop().split(".")[0] + ".png",
                                    "bg": "./assets/css/brands/" + getBackgroundImage().split('/')[getBackgroundImage().split('/').length - 2] + "/" +  getBackgroundImage().split('/')[getBackgroundImage().split('/').length - 1],
                                    "mz": window.btoa(response.data.binahLicense),
                                    "apid": checkMedicalAppointmentId,
                                    "fic": "./assets" + getFavIcon().slice(2),
                                    "cord": $cookies.get('resource'),
                                    "cnam": document.title,
                                    "tok" : token,
                                };
                                if (window.location.origin == "https://app-latam-qa.doctor-online.co" || window.location.origin == "https://localhost" || window.location.origin == "http://localhost") {
                                    window.location.href = "https://vitalsigns-qa.doctor-online.co?" + "conf=" + encodeURIComponent(JSON.stringify(binah_json));
                                }else {
                                    window.location.href = "https://vitalsigns.doctor-online.co?" + "conf=" + encodeURIComponent(JSON.stringify(binah_json));
                                }
                            },function errorCallback(response) {
                                errorLog("Error creating check call status." + response);
                            });

                        }else {
                            logInfo(checkMedicalAppointmentId, 'DRONLINE PATIENT: Redireccionando a la página de espera de atención.');
                            $state.go('pages.medical-appointment');
                        }
                    }
                } else if (response.data.codigo == 8) {
                    $scope.noActiveSubscriptionText = "Actualmente no posees una suscripción activa para poder realizar tu orientación médica.";
                    $scope.subscriptionAvailableText = "Puedes suscribirte y disfrutar de todos los beneficios de la plataforma.";
                    $scope.NoSub = true;
                    $scope.noAvailable = true;

                } else if (response.data.codigo == 9) {
                    if ($rootScope.optionId == 1) {
                        $scope.waitingMessage = "Has llegado al límite de orientaciones para chat con fotos en el rango de suscripción. Espera a que se renueve tu suscripción.";
                    } else {
                        $scope.waitingMessage = "Has llegado al límite de orientaciones para videollamadas en el rango de suscripción. Espera a que se renueve tu suscripción.";
                    }
                    $scope.NoSub = true;
                    $scope.noAvailable = true;
                } else {
                    var req = {
                        "serviceType": $scope.option,
                        "medicalAppointment": {
                            "profileId": {
                                "profileId": $scope.profileId
                            },
                            "docSpecialityId": {
                                "specialityId": $scope.speciality
                            },
                            "geoLatitude": 14.598769,
                            "geoLongitude": -90.5091886
                        }
                    }
                    BillingResource.save(req, function (res) {
                        window.location = res.urlTransaction;
                    });
                }
            }, function errorCallback(response) {
                errorLog("Error creating check call status.");
            });
        }

        function bindEvent(element, eventName, eventHandler) {
            if (element.addEventListener) {
                element.addEventListener(eventName, eventHandler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + eventName, eventHandler);
            }
        }

        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        function rgbToHex(red, green, blue) {
            const rgb = (red << 16) | (green << 8) | (blue << 0);
            return '#' + (0x1000000 + rgb).toString(16).slice(1);
          }

        function getHeaderColor() {
            var element = document.getElementById('header'),
                style = window.getComputedStyle(element),
                top = style.getPropertyValue('background-color');
            return top.match(/(\d+)/g);
        }

        function getBackgroundImage() {
            var body = document.querySelector('body');
            var my_style = window.getComputedStyle(body);
            var my_background = my_style.getPropertyValue('background-image');
            return my_background.replace('url(','').replace(')','').replace("'",'').replace(/[ '"]+/g, ' ').replace(' ','').trimEnd();
        }

        function getFavIcon(){
            var favicon = undefined;
            var nodeList = document.getElementsByTagName("link");
            for (var i = 0; i < nodeList.length; i++) {
                if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon")){
                    favicon = nodeList[i].getAttribute("href");
                }
            }
            return favicon;
        }

        bindEvent(window, 'message', function (e) {
            if (e.data.reason == 2) {
                $scope.isPass = true;
            } else if (e.data.reason == 3) {
                $scope.reject = true;
            } else if (e.data.reason == 4) {
                if ($scope.doctorInfo != undefined && $scope.doctorInfo != null) {
                    var iframeEl = document.getElementById('iframe');
                    var request = {
                        reason: 3,
                        doctorName: $scope.doctorName,
                        photo: $scope.doctorInfo.doctorFiles.photoURL
                    }
                    iframeEl.contentWindow.postMessage(request, '*');
                }
            }
        });

        $scope.drawTip = function (tip) {
            $('#tipDiv').fadeOut(1500, function () {
                $scope.tipObject = tip;
                $timeout(function () {
                    $('#tipDiv').fadeIn(1500);
                }, 100);
            });
        };

        $scope.loading = function () {
            $rootScope.showHeader = 3;
            currentTip = 0;
            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    if (fromState.name == "pages.medical-appointment") {
                        $interval.cancel(getMedicalAppointment);
                        $interval.cancel(tipsInterval);
                        tipsInterval = null;
                    }
                });

            $scope.tipList = PatientResource.findTips();

            $timeout(function () {
                if ($scope.tipList !== undefined) {
                    $scope.drawTip($scope.tipList[0])
                }
            }, 3000);

            tipsInterval = $interval(function () {
                if ($scope.tipList !== undefined) {
                    currentTip++;
                    if (currentTip == $scope.tipList.length) {
                        currentTip = 0;
                    }
                    $scope.drawTip($scope.tipList[currentTip]);
                }
            }, 15000);

            if ($rootScope.redirect && $rootScope.redirect === true) {
                swal({
                    title: "<img src='../img/loading-short.gif'></img>",
                    html: true,
                    showConfirmButton: false
                });
            }
            window.onbeforeunload = null;
            var parametro1 = $rootScope.parametro1;
            if (parametro1 != null) {
                $scope.showLoading = true;
                $scope.isPass = false;
                $scope.waitingMessage = "";
                $scope.actualAppointmentId;
                $scope.urlAppointment = "";
                if ($rootScope.reconnect) {
                    $scope.urlAppointment = "";
                    $scope.showAppointment = false;
                    $scope.showLoading = true;
                }
            }
            var parametro2 = $rootScope.parametro2;
            var parametro3 = $rootScope.parametro3;
            var parametro4 = $rootScope.parametro4;
            if (typeof parametro1 === undefined) {
                parametro1 = $location.search().parametro1;
            }
            if (typeof parametro2 === undefined) {
                parametro2 = $location.search().parametro2;
            }
            if (typeof parametro3 === undefined) {
                parametro3 = $location.search().parametro3;
            }
            if (typeof parametro4 === undefined) {
                parametro4 = $location.search().parametro4;
            }

            if (parametro1 != null) {
                AppointmentResource.findMessage({
                    medicalAppointmentId: parametro1
                }, function (res) {
                    $scope.waitingMessage = res.value;
                });
            }
            var par1 = parametro1;
            var par2 = parametro2;
            if (par2 == "PATIENTHASAPPOINTMENT") {
                var checkIdsessionAppoinintment = -1;
                var checkMedicalAppointmentId = -1;

                checkIdsessionAppoinintment = parametro3;
                checkMedicalAppointmentId = parametro1;
                $scope.actualAppointmentId = parametro1;

                AppointmentTime = null;
                AppointmentInterval = null;

                $scope.attachments = [];
                $scope.getAttachments();

                getMedicalAppointment = $interval(function () {

                    $rootScope.medicalAppointmentRating = checkMedicalAppointmentId;

                    var req = {
                        medicalAppointmentId: checkMedicalAppointmentId
                    };

                    AppointmentResource.find(req, function (res) {
                        $scope.minutesRemaining = res.minutesRemaining;
                        $scope.appointmentInformation = res;
                        $scope.changeText = translationPrefered.CAMBIAR;
                        $scope.patientFullName = res.profilePatient.admPerson.firstName + " " + res.profilePatient.admPerson.lastName;
                        $scope.patientEmail = res.profilePatient.admPerson.emailPerson;
                        $scope.currentEmail = res.profilePatient.admPerson.emailPerson;
                        $scope.currentPhone = res.profilePatient.admPerson.mobilePhone;
                        $scope.patientPhone = res.profilePatient.admPerson.mobilePhone;
                        $scope.currentAddress = res.profilePatient.admPerson.address;
                        $scope.patientAddress = res.profilePatient.admPerson.address;
                        $scope.patientBirthday = res.profilePatient.admPerson.birthday? new Date(res.profilePatient.admPerson.birthday) : '';
                        $scope.hasEmail = res.profilePatient.admPerson.emailPerson != null;
                        $scope.hasPhone = res.profilePatient.admPerson.mobilePhone != null;
                        $scope.changeEmailClicked = false;
                        $scope.patientId = res.profilePatient.profileId;
                        $scope.waitingMessage = res.waitingMessage;
                        $scope.appointmentType = res.serviceType;
                        $scope.corporateName = $scope.appointmentInformation.profilePatient.corporateId.corporateName;
                        if(res.showAppointmentButton !== undefined){
                            $scope.showAppointmentButton = res.showAppointmentButton;
                        }else{
                            $scope.showAppointmentButton = false;
                        }

                        if ((res.doctor !== undefined && res.doctor !== null) || (res.doctorId !== undefined && res.doctorId !== null)) {
                            logInfo(checkMedicalAppointmentId, 'DRONLINE PATIENT: Se confirmó la atención por parte del doctor en el navegador.');
                            $interval.cancel(getMedicalAppointment);
                            $interval.cancel(tipsInterval);
                            getMedicalAppointment = null;
                            logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: Cancelando la busqueda de ser atendido por un doctor, porque se detectó que un doctor ya atendió. (PULLING)");
                            DoctorResource.find({
                                doctorId: res.doctorId
                            }, function (data) {
                                swal.close();
                                $rootScope.redirect = false;
                                $scope.doctorInfo = data;
                                $scope.doctorName = formatService.formatDoctorNameShort(data);
                                $scope.doctorPhotoURL = (data.doctorFiles.photoURL !== undefined) ? data.doctorFiles.photoURL : "images/default.jpg";
                                if (typeof getBrowserInfo === 'function') {
                                    logWarning($scope.actualAppointmentId, 'DRONLINE PATIENT: Info de navegador: ' + getBrowserInfo());
                                }
                                if (res.serviceType === 1) {
                                    $scope.titleText = translationPrefered.CHAT_HA_FIN;
                                    if (res.providerCommunicationId === 1) {
                                        var QBinformation = {
                                            patient: res.patient,
                                            doctor: res.doctor,
                                            medicalAppointmentId: checkMedicalAppointmentId,
                                            dialogId: res.dialogId
                                        };
                                        var stringUrl = JSON.stringify(QBinformation);
                                        $scope.urlAppointment = ($scope.urlAppointment != "qb/chat-patient-n.php?qbi=" + stringUrl) ? "qb/chat-patient-n.php?qbi=" + stringUrl : $scope.urlAppointment;
                                        $scope.urlAppointment = $scope.urlAppointment + '&securityToken=' + token
                                        logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: QBinformation sended to iframe: " + stringUrl);
                                    } else if (res.providerCommunicationId === 3) {
                                        const tempUrlAppointment = res.firebaseRequest.baseURL + '&securityToken=' + token;
                                        //$scope.urlAppointment = $sce.trustAsResourceUrl(res.firebaseRequest.baseURL);
                                        $scope.urlAppointment = $sce.trustAsResourceUrl(tempUrlAppointment);
                                        logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: Firebase URL: " + $scope.urlAppointment);
                                    }
                                    logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: Embebiendo estructura de chat en el iframe.");
                                    $rootScope.showFooter = false;
                                    $scope.showLoading = true;
                                    window.onbeforeunload = function (event) {
                                        logWarning($scope.actualAppointmentId, "DRONLINE PATIENT: Se ejecutó el evento window.onbeforeunload().");
                                        return "Seguro?";
                                    };
                                    history.pushState(null, null, location.href);
                                    window.onpopstate = function () {
                                        history.go(1);
                                    };
                                    $scope.doctorProfileURL = URLBase + webSiteName + "private/index.php#/pages/doctor-profile/" + res.doctorId;
                                    $scope.imageUrl = "../img/" + $scope.appointmentInformation.profilePatient.corporateName + ".png";
                                    $scope.showAppointment = true;
                                    $rootScope.showHeader = 4;
                                    $("#main").addClass("medic-video");
                                    $("#content").addClass("no-top");
                                    $scope.AppointmentAttended = false;
                                    $scope.showLoading = false;
                                    logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: Se oculta mensaje de espera a ser atendido y se muestra la pantalla de consulta médica.");
                                    if (AppointmentTime == null) {
                                        AppointmentTime = $interval(function () {
                                            AppointmentResource.getAppointmentStatus({
                                                medicalAppointmentId: res.medicalAppointmentId
                                            }, function (res) {
                                                if(res.newFileUploaded && res.newFileUploaded == 1){
                                                    $scope.getAttachments();
                                                    showNotify(translationPrefered.FILE_RECEIVED_FROM_DOCTOR, "success");
                                                }
                                                //logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: Información de estado de consulta: " + JSON.stringify(res)); 
                                                var date = new Date(null);
                                                $scope.remainingSeconds = res.remainingSeconds;
                                                date.setSeconds($scope.remainingSeconds);
                                                var timeString = date.toISOString().substr(14, 5);
                                                $scope.remainingTime = timeString;
                                                if ((res.patientEmail != undefined && res.patientEmail != $scope.currentEmail) ||
                                                    (res.patientPhone != undefined && res.patientPhone != $scope.currentPhone) ||
                                                    (res.patientAddress != undefined && res.patientAddress != $scope.currentAddress)) {
                                                    $scope.currentEmail = res.patientEmail;
                                                    $scope.affiliationNumber = res.affiliationNumber;
                                                    $scope.patientEmail = res.patientEmail;
                                                    $scope.currentPhone = res.patientPhone;
                                                    $scope.patientPhone = res.patientPhone;
                                                    $scope.currentAddress = res.patientAddress;
                                                    $scope.patientAddress = res.patientAddress;
                                                    $scope.patientBirthday = res.patientBirthday;
                                                    $scope.hasPhone = (res.patientPhone);
                                                    $scope.hasEmail = (res.patientEmail);
                                                    $scope.showChangeEmailNotification();
                                                }

                                                if ($scope.remainingSeconds > 0) {
                                                    $scope.AppointmentAttended = true;
                                                }
                                                if (res.finished) {
                                                    logWarning($scope.actualAppointmentId, "DRONLINE PATIENT: Se detectó que la consulta fue finalizada por motivos externos al paciente.");
                                                    modalShow = false;
                                                    $scope.hangup();
                                                }

                                                if (($scope.urlAppointment === undefined || $scope.urlAppointment === "") && $scope.remainingSeconds > 0) {
                                                    $scope.urlAppointment = $scope.zoomURL;
                                                }
                                                if(res.serviceType !== undefined && res.serviceType === 1){
                                                    $scope.showIFrame = true;
                                                }
                                            });
                                        }, 5000);
                                    }

                                    if (AppointmentInterval == null) {
                                        AppointmentInterval = $interval(function () {
                                            var date = new Date(null);
                                            $scope.remainingSeconds = $scope.remainingSeconds - 1;
                                            date.setSeconds($scope.remainingSeconds);
                                            var timeString = date.toISOString().substr(14, 5);
                                            if ($scope.remainingSeconds == $scope.firstAlertTime && !$scope.firstAlertShown) {
                                                $scope.firstAlertShown = true;
                                                showNotify(translationPrefered.TIME_REMAINING +" " + timeString + ", "+translationPrefered.END_SOON, "danger");
                                            }
                                            if ($scope.remainingSeconds == $scope.secondAlertTime && !$scope.secondAlertShown) {
                                                $scope.secondAlertShown = true;
                                                showNotify(translationPrefered.TIME_REMAINING +" " + timeString + ", "+translationPrefered.END_SOON, "danger");
                                            }
                                            if ($scope.remainingSeconds == $scope.thirdAlertTime && !$scope.thirdAlertShown) {
                                                $scope.thirdAlertShown = true;
                                                showNotify(translationPrefered.TIME_REMAINING +" " + timeString + ", "+translationPrefered.END_DANGER, "danger");
                                            }
                                            $scope.remainingTime = timeString;
                                            if ($scope.AppointmentAttended && $scope.remainingSeconds <= 0) {
                                                logWarning($scope.actualAppointmentId, "DRONLINE PATIENT: Se finaliza la consulta porque se terminó el tiempo de la consulta.");
                                                modalShow = false;
                                                $scope.hangup();
                                            }
                                        }, 1000);
                                    }
                                } else if (res.serviceType === 2) {
                                    $scope.titleText = translationPrefered.VIDEO_HA_FIN;
                                    if ($rootScope.showHeader != 3) {
                                        $scope.isVideoCall = true;
                                        $rootScope.showHeader = 3;
                                        $scope.successCall = false;
                                    }
                                    if (res.providerCommunicationId === 1) {
                                        //Quickblox
                                        var stringUrl = JSON.stringify(res);
                                        $scope.successCall = true;
                                        window.onbeforeunload = function (event) {
                                            logWarning($scope.actualAppointmentId, "DRONLINE PATIENT: Se ejecutó el evento window.onbeforeunload().");
                                            return "Seguro?";
                                        };
                                        history.pushState(null, null, location.href);
                                        window.onpopstate = function () {
                                            history.go(1);
                                        };
                                        $scope.urlAppointment = "qbv/patient/patient.php?qbi=" + stringUrl + '&securityToken=' + token;
                                        logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: Embebiendo estructura de videollamada de quickblox en el iframe.");
                                    } else {
                                        logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: ZoomURL - " + res.zoomMeeting.urlWeb);
                                        if (res.providerCommunicationId === 2 && res.zoomMeeting !== undefined && res.zoomMeeting !== null && res.zoomMeeting.urlWeb !== undefined && res.zoomMeeting.urlWeb !== null) {
                                            //Zoom paciente
                                            $scope.zoomURL = $sce.trustAsResourceUrl(res.zoomMeeting.urlWeb);
                                            $("#iframe").prop("allow", true);
                                            $("#iframe").attr("allow", "microphone;camera;");
                                            $scope.successCall = true;
                                            logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: Embebiendo estructura de zoom en el iframe.");
                                        }
                                    }
                                    if ($scope.successCall === true) {
                                        $scope.doctorProfileURL = URLBase + webSiteName + "private/index.php#/pages/doctor-profile/" + res.doctorId;
                                        $scope.imageUrl = "../img/" + $scope.appointmentInformation.profilePatient.corporateName + ".png";
                                        $scope.showAppointment = true;
                                        $rootScope.showHeader = 4;
                                        $("#main").addClass("medic-video");
                                        $("#content").addClass("no-top");
                                        $scope.AppointmentAttended = false;
                                        $scope.showLoading = false;
                                        logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: Se oculta mensaje de espera a ser atendido y se muestra la pantalla de consulta médica.");
                                        if (AppointmentTime == null) {
                                            AppointmentTime = $interval(function () {
                                                AppointmentResource.getAppointmentStatus({
                                                    medicalAppointmentId: res.medicalAppointmentId
                                                }, function (res) {

                                                    if(res.newFileUploaded && res.newFileUploaded == 1){
                                                        $scope.getAttachments();
                                                        showNotify(translationPrefered.FILE_RECEIVED_FROM_DOCTOR, "success");
                                                    }

                                                    var date = new Date(null);
                                                    $scope.remainingSeconds = res.remainingSeconds;
                                                    date.setSeconds($scope.remainingSeconds);
                                                    var timeString = date.toISOString().substr(14, 5);
                                                    $scope.remainingTime = timeString;
                                                    if ((res.patientEmail != undefined && res.patientEmail != $scope.currentEmail) ||
                                                        (res.patientPhone != undefined && res.patientPhone != $scope.currentPhone) ||
                                                        (res.patientAddress != undefined && res.patientAddress != $scope.currentAddress)) {
                                                        $scope.currentEmail = res.patientEmail;
                                                        $scope.patientEmail = res.patientEmail;
                                                        $scope.currentPhone = res.patientPhone;
                                                        $scope.patientPhone = res.patientPhone;
                                                        $scope.currentAddress = res.patientAddress;
                                                        $scope.patientAddress = res.patientAddress;
                                                        $scope.patientBirthday = res.patientBirthday;
                                                        $scope.hasPhone = (res.patientPhone);
                                                        $scope.hasEmail = (res.patientEmail);
                                                        $scope.showChangeEmailNotification();
                                                    }

                                                    if ($scope.remainingSeconds > 0) {
                                                        $scope.AppointmentAttended = true;
                                                    }
                                                    if (res.finished) {
                                                        logInfo($scope.actualAppointmentId, "DRONLINE PATIENT: Se detectó que la consulta fue finalizada por motivos externos al paciente.");
                                                        modalShow = false;
                                                        $scope.hangup();
                                                    }
                                                    if (($scope.urlAppointment === undefined || $scope.urlAppointment === "") && $scope.remainingSeconds > 0) {
                                                        $scope.urlAppointment = $scope.zoomURL;
                                                    }

                                                    if(res.communicationProvider !== undefined && res.doctorOnline !== undefined && res.communicationProvider === 2){
                                                        if(res.doctorOnline){
                                                            $scope.showIFrame = true;
                                                        }
                                                        else{
                                                            $scope.showIFrame = false;
                                                        }  
                                                    }

                                                    if(res.communicationProvider !== undefined && res.doctorOnline !== undefined && res.communicationProvider === 1){
                                                        if(res.doctorOnline){
                                                            $scope.showIFrame = true;
                                                        }
                                                        else{
                                                            $scope.showIFrame = false;
                                                        }
                                                        if(!doctorOnline && res.doctorOnline){
                                                            var iframe = document.getElementById('iframe');
                                                            iframe.src = iframe.src;
                                                        }
                                                        doctorOnline = res.doctorOnline;
                                                    }   
                                                });
                                                if($scope.showIFrame && window.navigator.onLine){
                                                    $scope.showIFrame = true;
                                                }
                                                else{
                                                    $scope.showIFrame = false;
                                                }  
                                                if(!internetConnectionPatient && window.navigator.onLine){
                                                    var iframe = document.getElementById('iframe');
                                                    iframe.src = iframe.src;
                                                } 
                                                internetConnectionPatient = window.navigator.onLine;
                                            }, 5000);
                                        }

                                        if (AppointmentInterval == null) {
                                            AppointmentInterval = $interval(function () {
                                                var date = new Date(null);
                                                $scope.remainingSeconds = $scope.remainingSeconds - 1;
                                                date.setSeconds($scope.remainingSeconds);
                                                var timeString = date.toISOString().substr(14, 5);
                                                if ($scope.remainingSeconds == $scope.firstAlertTime && !$scope.firstAlertShown) {
                                                    $scope.firstAlertShown = true;
                                                    showNotify(translationPrefered.TIME_REMAINING +" "+ timeString + ", "+translationPrefered.END_SOON, "danger");
                                                }
                                                if ($scope.remainingSeconds == $scope.secondAlertTime && !$scope.secondAlertShown) {
                                                    $scope.secondAlertShown = true;
                                                    showNotify(translationPrefered.TIME_REMAINING +" "+ timeString + ", "+translationPrefered.END_SOON, "danger");
                                                }
                                                if ($scope.remainingSeconds == $scope.thirdAlertTime && !$scope.thirdAlertShown) {
                                                    $scope.thirdAlertShown = true;
                                                    showNotify(translationPrefered.TIME_REMAINING +" "+ timeString + ", "+translationPrefered.END_DANGER, "danger");
                                                }
                                                $scope.remainingTime = timeString;
                                                if ($scope.AppointmentAttended && $scope.remainingSeconds <= 0) {
                                                    logWarning($scope.actualAppointmentId, "DRONLINE PATIENT: Se finaliza la consulta porque se terminó el tiempo.");
                                                    modalShow = false;
                                                    $scope.hangup();
                                                }
                                                // Procesos que se utilizan para cerrar consulta que viene desde el iframe de Quickblox

                                                /*Incia bloque de procesos*/
                                                if ($scope.isPass) {
                                                    $interval.cancel(AppointmentInterval);
                                                    $interval.cancel(AppointmentTime);
                                                    logWarning($scope.actualAppointmentId, 'DRONLINE PATIENT: Se finaliza la consulta porque se detectó un error con el login de Quickblox.');
                                                    $scope.titleMsg = translationPrefered.NO_CONN_DOCTOR;
                                                    swal({
                                                        title: $scope.titleMsg,
                                                        showCancelButton: true,
                                                        confirmButtonColor: "#26AD6E",
                                                        confirmButtonText: translationPrefered.ACEPTAR,
                                                        closeOnConfirm: true,
                                                        showCancelButton: false,
                                                        allowEscapeKey: false,
                                                        allowEnterKey: false
                                                    }, function (inputValue) {
                                                        if (inputValue === true) {
                                                            $scope.cancelByFilter(false);
                                                            logInfo($scope.actualAppointmentId, 'DRONLINE PATIENT: Redireccionando a la pantalla de actualización de información de contacto.');
                                                        }
                                                    });
                                                } else if ($scope.reject) {
                                                    $interval.cancel(AppointmentInterval);
                                                    $interval.cancel(AppointmentTime);
                                                    AppointmentInterval = null;
                                                    AppointmentTime = null;
                                                    logWarning($scope.actualAppointmentId, 'DRONLINE PATIENT: Se finaliza la consulta porque se detectó que el paciente rechazó atender la videollamada.');
                                                    $scope.endAppointment();
                                                    $state.go('pages.patient');
                                                }
                                                /*Termina bloque de procesos*/
                                            }, 1000);
                                        }
                                    }
                                }
                            });
                        } else {
                            if ($scope.timesPulled == 0) {
                                logInfo(checkMedicalAppointmentId, "DRONLINE PATIENT: Esperando a ser atendido por el doctor.");
                            }
                            $scope.timesPulled += 1;
                            if ($scope.timesPulled == 5) {
                                $scope.timesPulled = 0;
                            }
                        }
                        if ($scope.isPass || ((res.doctor === undefined || res.doctor === null) && (res.endDate !== undefined && res.endDate !== null))) {
                            if($scope.isPass){
                                $scope.cancelByFilter(false);
                            }
                            $scope.isPass = true;
                            $interval.cancel(getMedicalAppointment);
                            $interval.cancel(tipsInterval);
                            $scope.urlAppointment = "";
                            $scope.waitingMessage = translationPrefered.DOCTOR_EMERGENCY;
                            logWarning(checkMedicalAppointmentId, 'DRONLINE PATIENT: Se mostró el mensaje: "Nuestro doctor esta atendiendo una emergencia".');
                        }
                    });
                }, 2500);
            } else {
                $state.go('pages.patient');
            }
        };

        $scope.hangupByPatient = function () {
            logWarning($scope.actualAppointmentId, 'PATIENT: Presionó el botón finalizar y se el muestra modal de confirmación.');
            $scope.titleSwal = ($scope.appointmentType === 1) ? translationPrefered.DESEA_FIN_CHAT : translationPrefered.DESEA_FIN_VIDEO;
            swal({
                title: $scope.titleSwal,
                showCancelButton: true,
                cancelButtonText: translationPrefered.CANCELAR,
                confirmButtonText: translationPrefered.Salir_Accept,
                closeOnConfirm: true,
                allowEscapeKey: false
            }, function (inputValue) {
                if (inputValue === true) {
                    $scope.endAppointment();
                    logInfo($scope.actualAppointmentId, 'PATIENT: Confirmó finalizar la consulta y se hace redirección a página de rating');
                    updateSessionStatusVideoCall($scope.actualAppointmentId, statesEnum.CANCELED_PA, "");
                    $state.go('pages.rating', {
                        patMedicalAppointmentId: $scope.actualAppointmentId,
                        profileId: $scope.patientId
                    });
                } else {
                    logInfo($scope.actualAppointmentId, 'PATIENT: Rechazó finalizar la consulta');
                }
            });
        };

        $scope.endDataAnalysis = function () {
            $scope.titleSwal = translationsES.DESEA_FIN_ANALYSIS;
            swal({
                title: $scope.titleSwal,
                showCancelButton: true,
                cancelButtonText: translationPrefered.CANCELAR,
                confirmButtonText: translationPrefered.Salir_Accept,
                closeOnConfirm: true,
                allowEscapeKey: false
            }, function (inputValue) {
                if (inputValue === true) {
                    $scope.actualAppointmentId = $rootScope.parametro1;
                    $scope.endAppointment();
                    $state.go('pages.rating', {
                        patMedicalAppointmentId: $rootScope.parametro1,
                        profileId: $scope.userId
                    });
                }
            });
        };

        $scope.hangup = function () {
            if (!modalShow) {
                modalShow = true;
                $interval.cancel(AppointmentInterval);
                $interval.cancel(AppointmentTime);
                $('#iframe').remove();
                logInfo($scope.actualAppointmentId, 'DRONLINE PATIENT: Se muestra el modal de finalización de consulta.');
                swal({
                    title: $scope.titleText,
                    showCancelButton: true,
                    confirmButtonColor: "#26AD6E",
                    confirmButtonText: translationPrefered.ACEPTAR,
                    closeOnConfirm: true,
                    showCancelButton: false,
                    allowEscapeKey: false
                }, function (inputValue) {
                    if (inputValue === true) {
                        $scope.endAppointment();
                        logInfo($scope.actualAppointmentId, 'DRONLINE PATIENT: Se hace redirección a la página de rating');
                        $state.go('pages.rating', {
                            patMedicalAppointmentId: $scope.actualAppointmentId,
                            profileId: $scope.patientId
                        });
                    }
                });
            } else {
                $interval.cancel(AppointmentInterval);
                $interval.cancel(AppointmentTime);
                AppointmentInterval = null;
                AppointmentTime = null;
            }
        };

        $scope.continueHere = function () {
            swal({
                title: translationPrefered.CONTINUAR_PREGUNTA,
                showCancelButton: true,
                cancelButtonText: translationPrefered.CANCELAR,
                confirmButtonText: translationPrefered.Salir_Accept,
                closeOnConfirm: true,
                allowEscapeKey: false
            }, function (inputValue) {
                if (inputValue === true) {
                    $rootScope.redirect = true;
                    $timeout($scope.redireccionar, 500);
                }
            });

        };

        $scope.sendForm = function () {
            /* $rootScope.codeResult = true */
            $rootScope.codeWorked;
            /*             console.log() */
            $rootScope.codeToCheck =  $scope.code;

            var codeToCheck = $scope.code
            var codeToCheck = $scope.code

            if($rootScope.corporateId == 73){
                $rootScope.codeToCheck =  $scope.code;
                $rootScope.codeUserAppoment = $scope.code;
                codeToCheck = document.getElementById('code').value;
            }else{
                codeToCheck = document.getElementById('codeviya').value;
            }

            localStorage.setItem("codeTDB", codeToCheck);
            localStorage.setItem("appointmedTDB", codeToCheck);

            var reqCHECK = {
                method: 'POST',
                url: apiURLBaseJS + "dronline-patient-api/api/subscription/coupon-tdb",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'                        },
                data: {
                    "personId": $rootScope.currentUserId,
                    "coupon":codeToCheck
                }
            };

            // option selected verification
            if($rootScope.fromViewParams.optionId == null || $rootScope.fromViewParams.optionId == undefined 
                || $rootScope.fromViewParams.optionId == ""){
                $rootScope.fromViewParams.optionId = localStorage.getItem('optionSelectedUser');
            }
            
            $http(reqCHECK).then(function successCallback(response) {                
                localStorage.setItem("couponMessage",  response.data.description);

                if(response.data.code == "200"){
                    $rootScope.codeResult = response.data.description;
                    $rootScope.codeWorked = true;
                    localStorage.setItem("hasValidCode", true)
                }
                $state.go('pages.code-successed', {
                    optionId: $rootScope.fromViewParams.optionId,
                });
                
            }, function errorCallback(response) {
                localStorage.setItem("couponMessage",  response.data.description);
                if(response.data.code == "400"){                    
                    $rootScope.codeResult = response.data.description;
                    $rootScope.codeWorked = false;
                    localStorage.setItem("hasValidCode", false)
                }
                $state.go('pages.code-successed', {
                    optionId: $rootScope.fromViewParams.optionId,
                });               
            });
            
        };
             
        $scope.showCalendar = async function () {
            $scope.showLoading = false;
            $scope.showCalendar1 = true;
            var calendarEl = document.getElementById('calendar');
            var calendar;
            moment.locale('es');
            $scope.dataAppointmets = [];
            $scope.patientSelected = '0';
            $scope.doctorSelected = '0';
            $scope.dataEvent = '';
            $scope.notesSchedule = '';
            $scope.profiles = [];
            $scope.typeServiceSelected = '0'
            $scope.loadingAppointment = false;
            const idProfile = JSON.parse($cookies.get('admdron')).userId;
            var date = new Date();
            const differenceUTCToLocale = -date.getTimezoneOffset() / 60;
            const currentDate = {
                profileId: idProfile,
                scheduleDate: moment(date).format('YYYY-MM-DDT00:00.000'),
                scheduleDateTime: date.getTime(),
                app: 'OTHERS',
                differenceHours: differenceUTCToLocale,
                appointmentId: $rootScope.parametro1
            }
            $scope.getEventsCalendar = function (date) {
                return new Promise((resolve, reject) => {
                    ScheduleResource.getAppointmentBlocks(
                        /*appointmentId: $rootScope.parametro1,
                        differenceHour: differenceUTCToLocale*/
                        currentDate
                    , function (responseList) {
                        $scope.dataAppointmets = [];
                        if (responseList.length > 0) {
                            responseList.forEach((appointment, i) => {
                                $scope.patientSelected = appointment.profileId;
                                $scope.doctorSelected = appointment.doctorId;
                                const lblDate = new Date();
                                const dateInit = appointment.startDate.split('T');
                                const timeCalendar = dateInit[1].split(':');
                                const dateFinal = appointment.endDate.split('T');
                                const requestDate = date.scheduleDate.split('T')[0];
                                const myDate = moment(lblDate.getFullYear() + moment().format('MM') + lblDate.getDate() + ' ' + lblDate.getHours() + ':' + lblDate.getMinutes(), "YYYYMMDD HH:mm");
                                const dateCalendar = moment(requestDate.split('-')[0] + requestDate.split('-')[1] + requestDate.split('-')[2] + ' ' + timeCalendar[0] + ':' + timeCalendar[1], "YYYYMMDD HH:mm");
                                const differenceDays = dateCalendar.diff(myDate, 'days');
                                const differenceMinutes = dateCalendar.diff(myDate, 'minutes');
                                if (differenceDays > 0) {
                                    $scope.dataAppointmets.push({
                                        title: appointment.title,
                                        start: dateInit[0] + 'T' + dateInit[1].split(':')[0] + ':' + dateInit[1].split(':')[1],
                                        end: dateFinal[0] + 'T' + dateFinal[1].split(':')[0] + ':' + dateFinal[1].split(':')[1],
                                        backgroundColor: appointment.backgroundColor,
                                        borderColor: appointment.borderColor,
                                        idAppointment: appointment.medicalSchedulerId > 0 ? appointment.medicalSchedulerId : 0,
                                        idPatient: appointment.profileId,
                                        idDoctor: appointment.doctorId,
                                        available: appointment.available
                                    })
                                } else {
                                    if (appointment.available && differenceMinutes < 20) {
                                        $scope.dataAppointmets.push({
                                            title: translationPrefered.HOUR_NOT_AVAILABLE,
                                            start: dateInit[0] + 'T' + dateInit[1].split(':')[0] + ':' + dateInit[1].split(':')[1],
                                            end: dateFinal[0] + 'T' + dateFinal[1].split(':')[0] + ':' + dateFinal[1].split(':')[1],
                                            backgroundColor: '#79B178',
                                            borderColor: '#79B178',
                                            idAppointment: appointment.medicalSchedulerId > 0 ? appointment.medicalSchedulerId : 0,
                                            idPatient: appointment.profileId,
                                            idDoctor: appointment.doctorId,
                                            available: appointment.available
                                        })
                                    } else if(!appointment.available){
                                        $scope.dataAppointmets.push({
                                            title: translationPrefered.HOUR_NOT_AVAILABLE,
                                            start: dateInit[0] + 'T' + dateInit[1].split(':')[0] + ':' + dateInit[1].split(':')[1],
                                            end: dateFinal[0] + 'T' + dateFinal[1].split(':')[0] + ':' + dateFinal[1].split(':')[1],
                                            backgroundColor: '#79B178',
                                            borderColor: '#79B178',
                                            idAppointment: appointment.medicalSchedulerId > 0 ? appointment.medicalSchedulerId : 0,
                                            idPatient: appointment.profileId,
                                            idDoctor: appointment.doctorId,
                                            available: appointment.available
                                        })
                                    } else {
                                        $scope.dataAppointmets.push({
                                            title: appointment.title,
                                            start: dateInit[0] + 'T' + dateInit[1].split(':')[0] + ':' + dateInit[1].split(':')[1],
                                            end: dateFinal[0] + 'T' + dateFinal[1].split(':')[0] + ':' + dateFinal[1].split(':')[1],
                                            backgroundColor: appointment.backgroundColor,
                                            borderColor: appointment.borderColor,
                                            idAppointment: appointment.medicalSchedulerId > 0 ? appointment.medicalSchedulerId : 0,
                                            idPatient: appointment.profileId,
                                            idDoctor: appointment.doctorId,
                                            available: appointment.available
                                        })
                                    }
                                }

                            });
                            resolve(date)
                        } else {
                            $scope.dataAppointmets = [];
                            resolve(date);
                        }
                    });
                })
            }

            $scope.setEventsCalendar = function (date) {
                calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'timeGridDay',
                    initialDate: date,
                    eventMinHeight: 8,
                    headerToolbar: {
                        left: '',
                        center: 'title',
                        right: ''
                    },
                    titleFormat:{
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                    },
                    locale: 'es',
                    nowIndicator: true,
                    eventClick: function (date) {
                        const dateEvent = moment(date.event.start);
                        const myDate = moment(new Date());
                        const diff = dateEvent.diff(myDate, 'minutes')
                        $scope.loadingAppointment = false;
                            if (diff > 19) {
                                if (date.event.extendedProps.available) {
                                    $scope.dataEvent = date;
                                    $('#dateSelected').val(moment(date.event.start).format('LL'));
                                    $('#timeSelected').val(moment(date.event.start).format('h:mm a') + ' - ' + moment(date.event.end).format('h:mm a'));
                                    $('#dateScheduller').val(moment(date.event.start));
                                    $('#calendar-modal').modal('show');
                                    $('#patientSelected').val($scope.patientFullName);
                                    $scope.patientSelected = $scope.patientSelected;
                                    $scope.selectedDate =date.event.start;
                                } else {
                                    showSwal("error", translationPrefered.LO_SENTIMOS, translationPrefered.HOUR_NOT_AVAILABLE_SCHEDULLER);
                                }
                            } else {
                                showSwal("error", translationPrefered.LO_SENTIMOS, translationPrefered.HOUR_NOT_AVAILABLE_SCHEDULLER);
                            }

                    },
                    dateClick: function (date) {
                        console.log('')
                    },
                    events: $scope.dataAppointmets,
                });
                let timeslots = $scope.dataAppointmets.length;
                //define height of calendar

                if( timeslots >= 720 ) {
                    $("#calendar").addClass("max-size");
                }else  if( timeslots == 144 ) {
                    $("#calendar").addClass("ten");
                } else if( timeslots > 144 ) {
                    $("#calendar").addClass("more-than-ten");
                }
                else
                {
                    $("#calendar").addClass("normal-fix");
                }
                calendar.render();
                //$('#calendar-modal').modal('show');
            }

            const data = $scope.getEventsCalendar(currentDate);
            await data.then(({scheduleDate}) => {
                $scope.setEventsCalendar(scheduleDate.split('T')[0]);
            })

            PatProfileResource.findAll(function (data) {
                $scope.profiles = data;
            });



            $scope.clearModal = function () {
                $scope.patientSelected = '0';
                $scope.notesSchedule = '';
                $scope.typeServiceSelected = '0'
            }



            $scope.showLoading = false;
            $scope.showCalendar1 = true;
        };

        $scope.cancelCalendar = function(){
            $scope.showLoading = true;
            $scope.showCalendar1 = false;
        };
           /* startDateSchedulerAppointment: date.split('T')[0] + 'T' + date.split('T')[1].split(':')[0] + ':' + date.split('T')[1].split(':')[1] + '.000Z',
            schedulerAppointmentTime: new Date($scope.dataEvent.event.start).getTime(),
            serviceTypeId : parseInt($scope.typeServiceSelected),
            app: 'OTHERS',
            differenceHours: differenceUTCToLocale*/
        $scope.programar12 = function () {
            var d = new Date($('#dateScheduller').val()),
                dformat = [d.getFullYear(),
                        d.getMonth()+1,
                        d.getDate(),].join('-')+'T'+
                    [d.getHours(),
                        d.getMinutes(),
                        d.getSeconds()].join(':')+'Z';
            const appointmentReq = {
                profileId: $rootScope.profId,
                doctorId: $scope.doctorSelected,
                scheduleDate: $scope.selectedDate,
                scheduleTimeL: new Date($scope.selectedDate).getTime(),
                scheduleTime: new Date($scope.selectedDate).getTime(),
                date: $scope.selectedDate,
                enableQueue: true
            };
            DoctorResource.requestAppointment(appointmentReq, function (response) {
                showSwal("success", translationPrefered.AVISO,  translationPrefered.SUCCESFUL_SCHEDULE);
                $scope.cancelAppointment();
            }, function (error) {
                showSwal("error", translationPrefered.LO_SENTIMOS, translationPrefered.ALERT_INSERT_SCHEDULE);
            });
        }

    })
    .controller('code-validated', function ($scope,$rootScope, $state) {

        $scope.couponMessage = localStorage.getItem("couponMessage");
        
        $scope.goToAppointment = function() {
            
            if($rootScope.fromViewParams.optionId == null || $rootScope.fromViewParams.optionId == undefined 
                || $rootScope.fromViewParams.optionId == ""){
                $rootScope.fromViewParams.optionId = localStorage.getItem('optionSelectedUser');
            }
            if($rootScope.fromViewParams.optionId == 3){
                $state.go("pages.calendar");
            }else{
                $state.go('pages.speciality', {
                    optionId: $rootScope.fromViewParams.optionId,
                });
            }
          
        }        
    })
    .controller('doctorCtrl', function (adminApi, FileUploader, AppointmentInformationResource, $filter, $state, $scope, $rootScope, $sce, $cookies, $http, $uibModal, $interval, $timeout, DoctorResource, AppointmentDrResource, ClinicalHistoryCategoryResource, PatProfileResource, $window, DiseaseResource, DiseaseResourceLaboratory, $q, AppointmentResource, AttachmentResource, MedicalPrescriptionResource, DoctorSessionResource, CorporateInformationConfiguration, AdminApiResource) {

        var doctorUploader = $scope.doctorUploader = new FileUploader({
            url: adminApi + "attachment"
        });

        $scope.lastHeartbeat = false;
        $scope.staticFieldsConfig = {};
        $scope.staticFieldsConfigDysplay2 = {};

        initiateSpeedDetection().then(function(speed) {
            DoctorSessionResource.updateSpeedAndBrowser({ 'speed': speed, 'browser': getBrowserAndVersion() });
        });

        setInterval(function(){
            DoctorSessionResource.lastHeartbeat(function(response){
                $scope.lastHeartbeat = false;
            }, function(error){
                $scope.lastHeartbeat = true;
            });
        }, 15000);

        $scope.getFieldConfigStatic = function(corporateId, specialityId, visualDisplayId){
            window.localStorage.setItem("staticFieldsConfig",null);
            const languages = {
                es: 1,
                en: 2,
                fr: 3,
                grc: 4,
                es_u: 5
            }; 

            let languageId = languages[$cookies.get('language')];
            let options = {
                corporateId: corporateId,
                specialityId: specialityId,
                visualDisplayId: visualDisplayId,
                languageId: languageId
            };
            AdminApiResource.getFieldConfigStatic(options, function (response) {
                if( response && Object.keys(response).length > 0 && response.hasOwnProperty('fields') ) {
                    const {fields} = response;
                    const fieldSize = fields.length;
                    
                    let fieldsConfig = {NAME:{},REASON:{},VITAL_SIGNS:{},HISTORY_DISEASE:{},MEDICAL_GUIDANCE:{},MEDICAL_RECOMMENDATION:{},RECOMMENDED_DIAGNOSTIC_STUDIES:{},EDUCATIONAL_PLAN:{},FOLLOW_UP:{},DRUGSTORE:{},CERTIFICATE:{}};
                    let fieldsConfigDisplay2 = {MEDICAMENTOS:{}};
                    for(let index = 0; index < fieldSize; index ++){
                        
                        const { name, visible, description } = fields[index];
                        if(visualDisplayId === 1){
                            if( fieldsConfig.hasOwnProperty(name) ) {
                                fieldsConfig[name] = { isVisible: visible, labelTranslate: description };

                                if( fields[index].hasOwnProperty('maxValue') && fields[index].hasOwnProperty('minValue')  ) {
                                    const {minValue, maxValue} = fields[index];
                                    fieldsConfig[name].minValue = minValue;
                                    fieldsConfig[name].maxValue = maxValue;
                                }
                            }
                        }
                        if(visualDisplayId === 2){
                            if( fieldsConfigDisplay2.hasOwnProperty(name) ) {
                                fieldsConfigDisplay2[name] = { isVisible: visible, labelTranslate: description };

                                if( fields[index].hasOwnProperty('maxValue') && fields[index].hasOwnProperty('minValue')  ) {
                                    const {minValue, maxValue} = fields[index];
                                    fieldsConfigDisplay2[name].minValue = minValue;
                                    fieldsConfigDisplay2[name].maxValue = maxValue;
                                }
                            }
                        }

                    }
                    if(visualDisplayId === 1){
                        $scope.staticFieldsConfig = fieldsConfig;
                        window.localStorage.setItem("staticFieldsConfig",JSON.stringify(fieldsConfig));

                    }
                    if(visualDisplayId === 2){
                        $scope.staticFieldsConfigDysplay2 = fieldsConfigDisplay2;
                        window.localStorage.setItem("staticFieldsConfigDisplay2",JSON.stringify(fieldsConfigDisplay2));
                    }


                }
            });
        }

        $scope.tryNowSendHeartbeat =function(){
            $scope.lastHeartbeat = false;
            DoctorSessionResource.lastHeartbeat(function(response){
                    $scope.lastHeartbeat = false;
                }, function(error){
                    $scope.lastHeartbeat = true;
                });
        };
        $scope.dismissAlert = function() {
            $scope.lastHeartbeat = false;
        };

        var token = JSON.parse($cookies.get('admdron')).access_token;
        
        doctorUploader.headers.Authorization = 'Bearer ' + token;

        doctorUploader.onWhenAddingFileFailed = function (item, filter, options) {
            swal(translationPrefered.INVALID_FILE, (item.name + '\n'+translationPrefered.INVALID_FILE_EXT), "error");      
        };

        doctorUploader.onAfterAddingFile = function (fileItem) {
            fileItem.formData.push({patMedicalAppointmentId: $scope.appointmentInformation.medicalAppointmentId});     
            fileItem.upload();
        };

        doctorUploader.onProgressItem = function (fileItem, progress) {
            swal({
                title: "<img src='../img/loading-short.gif'></img>",
                html: true,
                showConfirmButton: false
            });
        };

        doctorUploader.onSuccessItem = function (fileItem, response, status, headers) {
            swal.close();
            showNotify(translationPrefered.FILE_SENT, "success");
            $scope.getAttachments();
        };

        doctorUploader.onErrorItem = function (fileItem, response, status, headers) {
            swal(translationPrefered.AVISO, translationPrefered.ERROR_UPLOAD + '\n' + response.description, "error");
        };

        $scope.currentDate = new Date();
        $scope.minimumDate = new Date();
        $scope.minimumDate.setFullYear( $scope.currentDate.getFullYear() - 100 );
        $scope.attachments = [];

        

        $scope.searchDiseases = function (search) {
            if (search !== undefined && search !== "") {
                var deferred = $q.defer();
                DiseaseResource.find({
                    corporateId: $scope.actualMedicalAppointment.profilePatient.corporateId.corporateId,
                    name: search
                }, function (response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
            }
        };

        $scope.searchLaboratories = function (search, corporateId) {
            if (search !== undefined && search !== "") {
                var deferred = $q.defer();
                DiseaseResourceLaboratory.find({
                    name: search,
                    corporateId: corporateId
                }, function (response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
            }
        };

        $scope.clearFollowup = function(){
            $scope.annotation.followupTime = null;
            $scope.annotation.followup.reason = "";
            $scope.saveAllNotesVideoCall();
        }

        $scope.addDisease = function (item) {
            if ($scope.annotation === undefined) {
                $scope.annotation = {};
            }
            if ($scope.annotation.diseaseList === undefined) {
                $scope.annotation.diseaseList = [];
            }
            var exists = false;
            $scope.annotation.diseaseList.forEach(function (value) {
                if (value.code === item.code) {
                    exists = true;
                }
            });
            if (exists) {
                $.notify({
                    title: '<strong>'+translationPrefered.DIAGNOSTICO_REGISTRADO+'</strong><br>',
                    message: '',
                }, {
                    type: 'warning',
                    delay: 1000,
                    animate: {
                        enter: 'animated fadeInRight',
                        exit: 'animated fadeOutRight',
                    },
                    placement: {
                        from: 'bottom'
                    }
                });
            } else {
                $scope.annotation.diseaseList.push(item);
                $scope.diseaseList = null;
                $scope.saveAllNotesVideoCall();
            }
            $scope.newDisease = null;
        }

        $scope.removeDisease = function (item) {
            var index = $scope.annotation.diseaseList.indexOf(item);
            $scope.annotation.diseaseList.splice(index, 1);
            $scope.saveAllNotesVideoCall();
        }

        $scope.labAdditionalInfo = "";

        $scope.addDiagnosticStudyLab = function (item) {
            var existsDiagnosticStudy = false;
            if ($scope.annotation === undefined) {
                $scope.annotation = {};
            }
            if ($scope.annotation.diagnosticStudy === undefined) {
                $scope.annotation.diagnosticStudy = [];
            } else {
                $scope.annotation.diagnosticStudy.forEach(function (value) {
                    let arrValue = value.split(" | ");
                    value = arrValue[0];
                    if(item.hasOwnProperty('laboratoryName') && item.hasOwnProperty('laboratoryDescription') ){
                        if (value.toLowerCase().trim() === (item.laboratoryName.toLowerCase().trim() + " - " + item.laboratoryDescription.toLowerCase().trim())) {
                            existsDiagnosticStudy = true;
                        }
                    } else{
                        if (value.toLowerCase().trim() === item.toLowerCase().trim()) {
                            existsDiagnosticStudy = true;
                        }
                    }
                });
            }
            if (!existsDiagnosticStudy) {
                if( $scope.labAdditionalInfo.length > 0 )
                    $scope.labAdditionalInfo = " | "+$scope.labAdditionalInfo;
                item2 = item.laboratoryName + " - " + item.laboratoryDescription + " " +  $scope.labAdditionalInfo; 
                $scope.annotation.diagnosticStudy.push(item2);
                $scope.saveAllNotesVideoCall();
                $scope.labAdditionalInfo = "";
            } else {
                $.notify({
                    title: '<strong>'+translationPrefered.ESTUDIO_REGISTRADO+'</strong><br>',
                    message: '',
                }, {
                    type: 'warning',
                    delay: 1000,
                    animate: {
                        enter: 'animated fadeInRight',
                        exit: 'animated fadeOutRight',
                    },
                    placement: {
                        from: 'bottom'
                    }
                });
            }
            $("#additionalInfo").hide();
            $scope.newLaboratory = null;
        }

        $scope.addDiagnosticStudy = function (item) {
            var existsDiagnosticStudy = false;
            if ($scope.annotation === undefined) {
                $scope.annotation = {};
            }
            if ($scope.annotation.diagnosticStudy === undefined) {
                $scope.annotation.diagnosticStudy = [];
            } else {
                $scope.annotation.diagnosticStudy.forEach(function (value) {
                    if (value.toLowerCase().trim() === item.toLowerCase().trim()) {
                        existsDiagnosticStudy = true;
                    }
                });
            }
            if (!existsDiagnosticStudy) {
                $scope.annotation.diagnosticStudy.push(item);
                $scope.newDiagnosticStudy = null;
                $scope.saveAllNotesVideoCall();
            } else {
                $.notify({
                    title: '<strong>'+translationPrefered.ESTUDIO_REGISTRADO+'</strong><br>',
                    message: '',
                }, {
                    type: 'warning',
                    delay: 1000,
                    animate: {
                        enter: 'animated fadeInRight',
                        exit: 'animated fadeOutRight',
                    },
                    placement: {
                        from: 'bottom'
                    }
                });
            }
        }

        $scope.removeDiagnosticStudy = function (item) {
            var index = $scope.annotation.diagnosticStudy.indexOf(item);
            $scope.annotation.diagnosticStudy.splice(index, 1);
            $scope.saveAllNotesVideoCall();
        }

        $scope.admdron = JSON.parse($cookies.get('admdron'));
        $scope.attentionType = $scope.admdron.attentionType;
        var ruta = rutaAudiofile;
        $scope.audiofile = new Audio(ruta);
        $rootScope.showHeader = 1;
        $("#main").removeClass("medic");
        $rootScope.showFooter = true;
        $rootScope.medicalTypeAttended = 0;
        $scope.queueSize = "";
        $scope.appointmentInformation;
        $scope.timePassed = false;
        $scope.patientName;
        $scope.patientEmail = '';
        $scope.affiliationNumber = '';
        $scope.currentPatientEmail = '';
        $scope.patientPhone = '';
        $scope.currentPatientPhone = '';
        $scope.patientAddress = '';
        $scope.patientBirthday = '';
        $scope.currentPatientAddress = '';
        $scope.patientAge;
        $scope.remainingSeconds = 0;
        $scope.remainingTime = "";
        $scope.patientHistoryURL = "";
        $scope.cameraText = "";
        $scope.microText = "";
        $scope.hasUnprocessed = false;
        $scope.appointmentCount = 0;
        $scope.showDiagnostic = true;
        $scope.showDiagnosticStudy = $scope.showEducationalPlan = $scope.showDrugstore = true;
        $scope.showPrescription = true;
        $scope.showRecommendation = true;
        $scope.showMotive = true;
        $scope.showName = true;
        $scope.showObservation = true;
        $scope.parameters = "";
        $scope.showMedical = true;
        $scope.showAlergic = true;
        $scope.showTraumatics = true;
        $scope.showFamily = true;
        $scope.showGine = true;
        $scope.showQuir = true;
        $scope.normalForm = true;
        $scope.showCertificate = true;
        $scope.showDiagnosticHistory = true;
        $scope.medicalList = [];
        $scope.usersListIds = [];
        $scope.actualMedicalAppointment = null;
        $scope.actualPatientQbId = null;
        $scope.firtsAppointment = true;
        $scope.maxOfChats = 4;
        $scope.maxofChatsAttended = 0;
        $scope.sendDocPhoto = null;
        $scope.continueSearching = true;
        $scope.annotations = {};
        $scope.manualCall = true;
        $scope.medicalRecommendations = [];
        $scope.medicalPrescriptionComponents = [];
        $scope.medicalPresentations = [];
        $scope.medicalDoses = [];
        $scope.medicalTypes = [];
        $scope.medicalPrescription = [
            {}
        ];
        $scope.medicalPrescriptionDisabled = [];
        $scope.allRecomendations = {}
        $scope.monodrugIDSelected = '';
        $scope.monodrugsRecomends = [];
        $scope.medicalMedicaments = [{}];
        $scope.medicalMedicamentsDisabled = [];

        var medicalMedicamentsRetrieved = localStorage.getItem("dataMedicalMedicaments");
        $scope.medicalMedicaments = JSON.parse(medicalMedicamentsRetrieved);
        $scope.medicalMedicaments = $scope.medicalMedicaments == null ? $scope.medicalMedicaments = [] : $scope.medicalMedicaments;

        DoctorResource.find({
            doctorId: $rootScope.currentUserId
        }, function (data) {
            if (!data.isPasswordRestored) {
                $state.go("pages.restore-doctor");
            }
            
        });

        $scope.getUnprocessedAppointments = function(){
            DoctorResource.unprocessedAppointments({
                doctorId: $rootScope.currentUserId
            }, function (data) {
                if (data.length > 0) {
                    $scope.hasUnprocessed = true;
                } else {
                    $scope.hasUnprocessed = false;
                }
            });
        };
        $scope.getMedicalPrescriptionData = function(id){
            $scope.successfullyAdded()
            /* var json = JSON.stringify( $scope.medicalPrescription, function( key, value ) {
                if( key === "$$hashKey" ) {
                    return undefined;
                }
            
                return value;
            }); */
            data = angular.toJson($scope.medicalPrescription);
            localStorage.setItem("dataMedicalPrescription",  JSON.stringify($scope.medicalPrescription) )
        }
        $scope.deletePrescriptionDataItem = function(id){
            $scope.medicalPrescription.splice(id, 1);
            data = angular.toJson($scope.medicalPrescription);
            localStorage.setItem("dataMedicalPrescription",  JSON.stringify($scope.medicalPrescription))
        }
        $scope.deleteMedicamentDataItem = function(id){
            $scope.medicalMedicaments.splice(id, 1);
            data = angular.toJson($scope.medicalMedicaments);
            localStorage.setItem("dataMedicalMedicaments",  JSON.stringify($scope.medicalMedicaments))
        }
        $scope.selectedPresentation = function(id) {
            let medicineCodeFiltered = $scope.medicalPrescription[id];

            document.getElementById(`presentationType${id}`).value = medicineCodeFiltered.presentation;

            // use $scope.selectedItem.code and $scope.selectedItem.name here
            // for other stuff ...
        }
        $scope.addMedicalRecommedation = function (item) {
            /* $scope.medicalPrescriptionDisabled.push(medicineCodeFiltered.medicamentName.description)
            console.log($scope.medicalPrescriptionDisabled) */
            $scope.medicalPrescription.forEach(element => {
                $scope.medicalPrescriptionDisabled.push(element.medicamentName.description)
             });
            $scope.medicalPrescription.push({})
            
        }
        /* MEDICAMENTOS */

        $scope.addMedicalMedicaments = function (item) {
            $scope.medicalMedicaments.forEach(element => {
                let medicamentRecomendated = element.medicamentName.description;
                if(element.quantityActiveIngredient !== undefined){
                    medicamentRecomendated += ", " + element.quantityActiveIngredient + " mg"
                }
                if(element.quantityDoses !== undefined){
                    medicamentRecomendated += ", " + element.quantityDoses
                }
                if(element.presentationType !== undefined){
                    medicamentRecomendated += " " + element.presentationType
                }
                if(element.medicineHours !== undefined){
                    medicamentRecomendated += " " + " cada " + element.medicineHours + " " + translationPrefered.HOUR_SCHEDULED_APPOINTMENT
                }
                if(element.treatementDuration !== undefined){
                    medicamentRecomendated += " " + " por " + element.treatementDuration + " " + translationPrefered.DAY
                }
                $scope.medicalMedicamentsDisabled.push(medicamentRecomendated);
            });
            $scope.medicalMedicaments.push({})
        }
        $scope.getMedicalMedicamentsData = function(id){
            $scope.successfullyAddedMedicament()
            data = angular.toJson($scope.medicalMedicaments);
            localStorage.setItem("dataMedicalMedicaments",  JSON.stringify($scope.medicalMedicaments) )
        }
        $scope.successfullyAddedMedicament = function () {
            $.notify({
                title: '<strong>Guardado correctamente</strong><br>',
                message: '',
            }, {
                type: 'success',
                delay: 1000,
                animate: {
                    enter: 'animated fadeInRight',
                    exit: 'animated fadeOutRight',
                },
                placement: {
                    from: 'bottom'
                }
            });
            logInfo($scope.actualMedicalAppointment.medicalAppointmentId, "DOCTOR: Guardó información en el resumen de la consulta.");
            data = angular.toJson($scope.medicalMedicaments);
            localStorage.setItem("dataMedicalMedicaments",  JSON.stringify($scope.medicalMedicaments));
        };
        /* FIN MEDICAMENTOS */

        var dt = new Date();
        $scope.checkDate = function(){
            if(dt === undefined){
                $scope.scheduledApppointments = {};
                return;
            }
            DoctorSessionResource.actionHistory({'idAction': docHistory.ACTUALIZAR_CALENDARIO_CITAS_PROGRAMDAS});

            $(".glyphicon-refresh").show();
            let request = {
                doctorId: {
                    doctorId: $scope.admdron.userId
                },
                scheduleDate: dt
            };
            DoctorResource.checkDate(request, function(response){
                let grouping = _.groupBy(response, element => ($filter('date')(element.scheduledDate, "dd/MM/yyyy")))
                let sections = _.map(grouping, (items, scheduledDate) => ({
                  date: scheduledDate,
                  items: items
                }));
                $scope.scheduledApppointments = sections;
                $(".glyphicon-refresh").hide();
            });
            $scope.getUnprocessedAppointments();
        };

        $scope.$watch(function () {
            return $state.$current.name
        }, function (newVal, oldVal) {
            if (newVal == "pages.medical-appointment-doc") {
                $scope.getUnprocessedAppointments();
                checkAudioLevel();
                ReactDOM.render(
                    React.createElement(Webcam, null),
                    document.getElementById('root'));
                $('video').addClass("videoPreview");
                $('svg').css("width", "100%");
                $('svg').css("height", "10%");
                $('.pl-circular').css("height", "");
                $('.pl-circular').css("width", "");
                if($scope.attentionType != 1){
                    $scope.checkDate();
                }
            }
        });

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                if (fromState.name == "pages.medical-appointment-doc") {
                    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
                }
            });


        if ($state.current.name == "pages.doctor") {
            if($scope.attentionType != 1){
                $state.go("pages.medical-appointment-doc");
            }
            $scope.getUnprocessedAppointments();
        }

        if ($state.current.name == "pages.medical-appointment-doc") {
            $scope.getUnprocessedAppointments();
        }

        $scope.goRating = function () {
            $interval.cancel(getMedicalAppointment);
            $interval.cancel(wifiInterval);
            $interval.cancel(speedTestInterval);
            getMedicalAppointment = null;
            window.location.href = URLBase + webSiteName + "private/index.php#/pages/rating-doc/";
        }

        $scope.showParameters = function (corpId) {
            DoctorResource.getParameters({
                corporateId: corpId
            }, function (res) {
                var lista = "";
                var bien = false;
                $(jQuery.parseJSON(JSON.stringify(res))).each(function () {
                    bien = true;
                    lista += "<h5 class='corporate-color'><b>" + this.name.toUpperCase() + "</b></h5>";
                    lista += "<ul>";
                    var item = this.value.split(",");
                    for (var i = 0; i < item.length; i++) {
                        lista += "<li>" + item[i] + "</li>";
                    }
                    lista += "</ul>";
                    $scope.parameters = lista;
                });
                if (!bien) {
                    $scope.parameters = "<h5><b>"+translationPrefered.NO_PARAMETROS+"</b></h5>";
                }
            });
        }

        $scope.viewPatientHistory = function (update) {
            if(update == 1){
                DoctorSessionResource.actionHistory({'idAction': docHistory.VER_PERFIL_PACIENTE});
            }
            $scope.newURL = (update == 1) ? $scope.patientHistoryURL + "/1" : $scope.patientHistoryURL + "/0";
            if ($rootScope.medicalTypeAttended == 2) {
                try {
                    var iframe = document.getElementById('iframe');
                    var innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
                    innerDoc.getElementById('main_video').requestPictureInPicture();
                } catch (err) {
                    console.error(err);
                }
                $timeout(function () {
                    $window.open($scope.newURL, '_blank');
                }, 1000);
                DoctorSessionResource.actionHistory({'idAction': docHistory.VER_HISTORIAL_CLINICO});
                logInfo($scope.actualMedicalAppointment.medicalAppointmentId, 'DOCTOR: Revisó el historial clínico del paciente.');
            } else if ($rootScope.medicalTypeAttended == 1) {
                $window.open($scope.newURL, '_blank');
                logInfo($scope.actualMedicalAppointment.medicalAppointmentId, 'DOCTOR: Revisó el historial clínico del paciente.');
            }
        }

        if ($state.name = "medical-appointment-doc") {
            $rootScope.showFooter = false;
        }

        function timePassed() {
            if ($state.current.name == "pages.doctor") {
                $scope.timePassed = true;
                $scope.playAudio();
            }
        }

        function findQueueSize() {
            if ($state.current.name == "pages.doctor") {
                AppointmentDrResource.getQueueSize({
                    doctorId: $rootScope.currentUserId
                }, function (data) {
                    $scope.queueSize = data != null ? data.value : "0";
                    if ($scope.queueSize != "0") {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'views/doctor-alert.html',
                            controller: 'DoctorAlertCtrl',
                            backdrop: 'static',
                            keyboard: false
                        });
                    }
                });
            }
        }

        $scope.changeActualMedicalAppointment = function (patientQbId) {

            if (typeof $scope.medicalList[patientQbId] !== 'undefined' && typeof $scope.actualMedicalAppointment !== 'undefined') {
                $scope.actualMedicalAppointment = $scope.medicalList[patientQbId];
                $scope.actualPatientQbId = patientQbId;
                $scope.imageUrl = "../img/" + $scope.actualMedicalAppointment.profilePatient.corporateName + ".png";
                $scope.patientName = $scope.actualMedicalAppointment.profilePatient.admPerson.firstName + ' ' + $scope.actualMedicalAppointment.profilePatient.admPerson.lastName;
                $scope.patientEmail = $scope.actualMedicalAppointment.profilePatient.admPerson.emailPerson;
                $scope.currentPatientEmail = $scope.actualMedicalAppointment.profilePatient.admPerson.emailPerson;
                $scope.patientPhone = $scope.actualMedicalAppointment.profilePatient.admPerson.mobilePhone;
                $scope.currentPatientPhone = $scope.actualMedicalAppointment.profilePatient.admPerson.mobilePhone;
                $scope.patientAddress = $scope.actualMedicalAppointment.profilePatient.admPerson.address;
                $scope.patientBirthday = $scope.actualMedicalAppointment.profilePatient.admPerson.birthday;
                if($scope.patientBirthday !== null && $scope.patientBirthday !== undefined){
                    var str = $scope.patientBirthday;
                    var res = str.substring(0, 10);
                    $scope.patientBirthday = new Date(res);
                }
                $scope.currentPatientAddress = $scope.actualMedicalAppointment.profilePatient.admPerson.address;
                $scope.hasEmail = ($scope.actualMedicalAppointment.profilePatient.admPerson.emailPerson);
                $scope.hasPhone = ($scope.actualMedicalAppointment.profilePatient.admPerson.mobilePhone);
                $scope.corpoId = $scope.actualMedicalAppointment.profilePatient.corporateId.corporateId;
                $scope.actualCorporateName = $scope.actualMedicalAppointment.profilePatient.corporateName.toUpperCase();
                if($scope.actualMedicalAppointment.profilePatient.corporateId.enableMonodrug == undefined){
                    $scope.enableMonodrug = 0;
                }else{
                    $scope.enableMonodrug = $scope.actualMedicalAppointment.profilePatient.corporateId.enableMonodrug;
                }
                $rootScope.enableMonodrug = $scope.enableMonodrug;
                $scope.patientSex = ($scope.actualMedicalAppointment.profilePatient.admPerson.gender == 1) ? translationPrefered.MALE_SHORTCUT : translationPrefered.FEMALE_SHORTCUT;
                $scope.appointmentCount = $scope.actualMedicalAppointment.numberAppointments;
                $scope.affiliationNumber = $scope.actualMedicalAppointment.affiliationNumber;
                $scope.showParameters($scope.corpoId);
                $scope.patientHistoryURL = URLBase + webSiteName + "private/index.php#/pages/pat-appointments/" + $scope.actualMedicalAppointment.profilePatient.profileId;
                if ($scope.actualCorporateName == "DRADISA") {
                    $scope.normalForm = false;
                    $scope.annotation = {};
                    $scope.annotation.confirmName = $scope.actualMedicalAppointment.profilePatient.admPerson.firstName + ' ' + $scope.actualMedicalAppointment.profilePatient.admPerson.lastName;
                } else {
                    $scope.normalForm = true;
                }
                ClinicalHistoryCategoryResource.findAll({
                    profileId: $scope.actualMedicalAppointment.profilePatient.profileId
                }, function (data) {
                    $scope.clinicalList = data;
                });
                $('#corporateStyle').attr('href', '');
                $scope.cssUrl = "../css/brands/" + $scope.actualCorporateName.toLowerCase() + '/doctor_appointment.css';
                $('#corporateStyle').attr('href', $scope.cssUrl);
                $scope.setFormValues();
                
            }
        };
        $scope.fillComponents = function (){

            MedicalPrescriptionResource.getComponents(function (res) {
                $scope.medicalRecommendations = res;
/*                 $scope.medicalPrescription.push([])
 */            },  function (err) {
                console.error("Error al actualizar información de consulta");
                console.error(err);
            })

            MedicalPrescriptionResource.findMedicamentPresentation(function(res){
                $scope.medicalPresentations = res;
            });
            MedicalPrescriptionResource.findMedicamentDose(function(res){
                $scope.medicalDoses = res;
            })
            MedicalPrescriptionResource.findMedicamentType(function(res){
                $scope.medicalTypes = res;
            })

        }
        $scope.setFormValues = function () {
            $scope.drugstoreList = {};
            if ($scope.actualMedicalAppointment !== null) {
                if ($scope.actualMedicalAppointment.profilePatient.corporateId !== undefined) {
                    AppointmentDrResource.findCorporateDrugstore({
                        id: $scope.actualMedicalAppointment.profilePatient.corporateId.corporateId
                    }, function (response) {
                        $scope.drugstoreList = response;
                        infoLog($scope.drugstoreList);
                        $scope.annotation = $scope.annotations[$scope.actualMedicalAppointment.medicalAppointmentId];
                    });
                } else {
                    $scope.annotation = $scope.annotations[$scope.actualMedicalAppointment.medicalAppointmentId];
                }
            }
            $scope.fillComponents();
        };

        $scope.audiofile = new Audio("../audio/queue-alert.mp3");

        $scope.playAudio = function () {
            $scope.audiofile.play();
        };

        //$scope.audiofileV = new Audio("../audio/alarm-doctor.mp3");

        $scope.playAudioV = function () {
            var sounds = {
                'call': 'callingSignal'
            };
            document.getElementById(sounds.call).play();
            //$scope.audiofileV.play();
        };

        $scope.detenerAudio = function () {
            $scope.audiofile.pause();
            $scope.audiofile.loop = false;
            $scope.audiofile.currentTime = 0;
        };

        $scope.detenerAudioV = function () {
            var sounds = {
                'call': 'callingSignal'
            };
            document.getElementById(sounds.call).pause();
        };

        $scope.offlineAudio = function () {
            var sounds = {
                'call': 'offline'
            };
            document.getElementById(sounds.call).play();
        };

        $scope.onlineAudio = function () {
            var sounds = {
                'call': 'online'
            };
            document.getElementById(sounds.call).play();
        };

        if ($state.current.name == "pages.doctor") {
            $timeout(findQueueSize, 30000);
            $timeout(timePassed, 120000);
        }

        $timeout($scope.detenerAudio, 122300);

        function calculateAge(birthMonth, birthDay, birthYear) {
            var todayDate = new Date();
            var todayYear = todayDate.getFullYear();
            var todayMonth = todayDate.getMonth();
            var todayDay = todayDate.getDate();
            var age = todayYear - birthYear;

            if (todayMonth < birthMonth - 1) {
                age--;
            }

            if (birthMonth - 1 == todayMonth && todayDay < birthDay) {
                age--;
            }
            return age;
        }

        $scope.updateViews = function (element) {
            switch (element) {
                case 1:
                    $scope.showDiagnostic = ($scope.showDiagnostic) ? false : true;
                    break;
                case 2:
                    $scope.showPrescription = ($scope.showPrescription) ? false : true;
                    break;
                case 3:
                    $scope.showRecommendation = ($scope.showRecommendation) ? false : true;
                    break;
                case 4:
                    $scope.showObservation = ($scope.showObservation) ? false : true;
                    break;
                case 5:
                    $scope.showName = ($scope.showName) ? false : true;
                    break;
                case 6:
                    $scope.showMotive = ($scope.showMotive) ? false : true;
                    break;
                case 7:
                    $scope.showDrugstore = ($scope.showDrugstore) ? false : true;
                    break;
                case 8:
                    $scope.showDiagnosticStudy = ($scope.showDiagnosticStudy) ? false : true;
                    break;
                case 9:
                    $scope.showEducationalPlan = ($scope.showEducationalPlan) ? false : true;
                    break;
                case 10:
                    $scope.showCertificate = ($scope.showCertificate) ? false : true;
                    break;
                case 11:
                    $scope.showDiagnosticHistory = ($scope.showDiagnosticHistory) ? false : true;
                    break;
            }
        }

        $scope.hideElements = function (element) {
            switch (element) {
                case 1:
                    $scope.showRecommendation = false;
                    $scope.showPrescription = false;
                    $scope.showMotive = false;
                    $scope.showName = false;
                    $scope.showObservation = false;
                    break;
                case 2:
                    $scope.showRecommendation = false;
                    $scope.showDiagnostic = false;
                    $scope.showMotive = false;
                    $scope.showName = false;
                    $scope.showObservation = false;
                    break;
                case 3:
                    $scope.showDiagnostic = false;
                    $scope.showPrescription = false;
                    $scope.showMotive = false;
                    $scope.showName = false;
                    $scope.showObservation = false;
                    break;
                case 4:
                    $scope.showRecommendation = false;
                    $scope.showDiagnostic = false;
                    $scope.showPrescription = false;
                    $scope.showMotive = false;
                    $scope.showName = false;
                    break;
                case 5:
                    $scope.showRecommendation = false;
                    $scope.showDiagnostic = false;
                    $scope.showPrescription = false;
                    $scope.showMotive = $scope.showObservation = false;
                    break;
                case 6:
                    $scope.showRecommendation = false;
                    $scope.showDiagnostic = false;
                    $scope.showPrescription = false;
                    $scope.showName = false;
                    $scope.showObservation = false;
                    break;
            }
        }

        $scope.updateViewsPatient = function (element) {
            switch (element) {
                case 1:
                    $scope.showMedical = ($scope.showMedical) ? false : true;
                    break;
                case 2:
                    $scope.showAlergic = ($scope.showAlergic) ? false : true;
                    break;
                case 3:
                    $scope.showQuir = ($scope.showQuir) ? false : true;
                    break;
                case 4:
                    $scope.showTraumatics = ($scope.showTraumatics) ? false : true;
                    break;
                case 5:
                    $scope.showFamily = ($scope.showFamily) ? false : true;
                    break;
                case 6:
                    $scope.showGine = ($scope.showGine) ? false : true;
                    break;
            }
        }

        function bindEvent(element, eventName, eventHandler) {
            if (element.addEventListener) {
                element.addEventListener(eventName, eventHandler, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + eventName, eventHandler);
            }
        }

        bindEvent(window, 'message', function (e) {
            if (e.data == "loaded") {
                $scope.msgSended = true;
                if ($scope.sendDocPhoto != null) {
                    var iframeEl = document.getElementById('iframe');
                    iframeEl.contentWindow.postMessage($scope.sendDocPhoto, '*');
                }
            } else {
                $scope.changeActualMedicalAppointment(e.data);
                $scope.continueSearching = true;
            }
        });

        $scope.finishActualAppointment = function () {
            logWarning($scope.actualMedicalAppointment.medicalAppointmentId, "DOCTOR: Presionó el botón para finalizar la consulta y se muestra el modal de confirmación.");
            swal({
                title: "<b>"+translationPrefered.DESEA_FIN_CHAT+"</b>",
                html: true,
                text: translationPrefered.CHAT_CON_PATIENT+ "<b>" + $scope.patientName + "</b>",
                showCancelButton: true,
                confirmButtonColor: "#FF0000",
                confirmButtonText: translationPrefered.FINALIZAR,
                cancelButtonText: translationPrefered.CANCELAR,
                closeOnConfirm: true,
                allowEscapeKey: false
            }, function (inputValue) {
                if (inputValue === true) {
                    clearInterval(intervalSleepAlert)
                    logWarning($scope.actualMedicalAppointment.medicalAppointmentId, 'DOCTOR: Aceptó finalizar la consulta.');
                    $scope.endActualAppointment($scope.actualMedicalAppointment.medicalAppointmentId);
                } else {
                    logInfo($scope.actualMedicalAppointment.medicalAppointmentId, 'DOCTOR: Rechazó finalizar la consulta.');
                }
            });
        };

        $scope.endActualAppointment = function (medicalAppId) {
            DoctorSessionResource.actionHistory({'idAction': docHistory.FINALIZAR_CONSULTA});
            if (Object.keys($scope.medicalList).length == 1) {
                var req = {
                    medicalAppointmentId: medicalAppId
                };
                AppointmentDrResource.endMedicalAppointment(req, function (res) {
                    if (res.code == 200) {
                        try {
                            var QBuser = $scope.usersListIds[medicalAppId].patient.QBId;
                            delete $scope.medicalList[QBuser];
                            $interval.cancel(getMedicalAppointment);
                        } catch (error) {
                            errorLog(error);
                        }

                        logInfo(medicalAppId, 'DRONLINE DOCTOR: Redireccionando a pagina de calificación.');
                        //window.location.href = URLBase + webSiteName + "private/index.php#/pages/rating-doc/";
                        $state.go("pages.rating-doc");
                    }
                });
            } else {
                var QBuser = $scope.usersListIds[medicalAppId].patient.QBId;
                delete $scope.medicalList[QBuser];
                var iframeEl = document.getElementById('iframe');
                var request = {
                    reason: 2,
                    patient: QBuser,
                    medicalId: medicalAppId
                }
                if (iframeEl != null) {
                    iframeEl.contentWindow.postMessage(request, '*');
                }
                var req = {
                    medicalAppointmentId: medicalAppId
                };
                AppointmentDrResource.endMedicalAppointment(req, function () {});
            }
        };

        $scope.createFollowupHourList = function(){
            $scope.followupHourList = [
                {value:null, name: translationPrefered.HOUR_UNDEFINED}, {value:12, name: translationPrefered.FOLLOWUP_12H},{value:1,name: translationPrefered.FOllOWUP_24H},{value:2,name: translationPrefered.FOllOWUP_48H},{value:3,name: translationPrefered.FOllOWUP_72H},
                {value:7,name: translationPrefered.FOllOWUP_1W},{value:14,name: translationPrefered.FOllOWUP_2W},{value: 31, name: translationPrefered.FOLLOWUP_1M}
            ];
        }

        $scope.showHistory = function(){
            DoctorSessionResource.actionHistory({'idAction': docHistory.VER_HISTORIAL_ANTECEDENTES});
            $scope.loadingHistory = true;
            ClinicalHistoryCategoryResource.historyLog({
                profileId: $scope.actualMedicalAppointment.profilePatient.profileId
            }, function (response) {
                let grouping = _.groupBy(response, element => (element.category))
                let sections = _.map(grouping, (items, category) => ({
                category: category,
                items: items
                }));
                $scope.historyLog = sections;
                $scope.loadingHistory = false;
            });
            $('#antHistory').modal('show');
        }

        $scope.getAttachments = function(){
            $scope.attachments = AttachmentResource.getAppointmentAttachments({appointmentId: $scope.medicalAppointmentId});                        
        }

        $scope.requestUpload = function(){
            AttachmentResource.requestUpload({appointmentId: $scope.medicalAppointmentId}, function(res){
                showNotify(translationPrefered.FILE_REQUESTED, "success");
            })
        }

        $scope.openAttachment = function(attachment){
            if(attachment.url !== undefined){
                window.open(attachment.url, '_blank');
                return;
            }
            AttachmentResource.getAttachment({attachmentId: attachment.patMedicalAppointmentAttachmentId}, function(res){
                attachment = res;
                window.open(attachment.url, '_blank');
            })
        }

        $scope.searchAppointment = function () {

            window.onbeforeunload = null;

            /*$scope.urlAppointment =   $sce.trustAsResourceUrl("https://localhost");
            $scope.showAppointment = true;
            $scope.showLoading = false;
            $rootScope.showHeader=3;*/
            /*$scope.urlAppointment =   $sce.trustAsResourceUrl("https://localhost");*/
            if ($rootScope.medicalTypeAttended == 0) {
                clearInterval(AppointmentTime);
                clearInterval(AppointmentInterval);
                $interval.cancel(AppointmentTime);
                $interval.cancel(AppointmentInterval);
                AppointmentInterval = AppointmentTime = null;
            }
            $scope.medicalList = [];
            $scope.usersListIds = [];
            $scope.appointmentsAttended = [];
            $scope.appointmentInformation = null;

            DoctorResource.findParameterByName({
                doctorId: "1",
                parameterName: 'MAX_SIMULTANEOUS_CHATS'
            }, function (data) {
                $scope.maxOfChats = data != null ? data.value : $scope.maxOfChats;
            });
            getMedicalAppointment = $interval(function () {


                AppointmentDrResource.find(function (res) {

                    $scope.hasUnprocessed = res.hasUnprocessed;
                    if(res.hasUnprocessed !== undefined && res.hasUnprocessed == true){                        
                        return;
                    }

                    $scope.appointmentErrorList = res.appointmentErrorList;
                    infoLog("AppointmentDrResource.find:res = at " + new Date().toLocaleTimeString());
                    if (typeof res.medicalAppointmentId !== 'undefined' && res.medicalAppointmentId !== null) {
                        if (res.serviceType === 1 && ($rootScope.medicalTypeAttended != 2) && (Object.keys($scope.medicalList).length < $scope.maxOfChats) && ($scope.maxofChatsAttended < $scope.maxOfChats) && $scope.continueSearching) {
                            if (res.profilePatient !== 'undefined' && res.profilePatient !== null) {
                                $scope.appointmentInformation = res;
                            }
                            if ($rootScope.medicalTypeAttended === 0) {
                                $rootScope.showHeader = 3;
                            }
                            clearInterval(intervalSleepAlert)
                            $scope.detenerAudio();
                            $scope.playAudioV();
                            $scope.continueSearching = false;
                            $scope.medicalAppointmentId = res.medicalAppointmentId;
                            $scope.corporateName = res.profilePatient.corporateName.toUpperCase();
                            $scope.corporateName = res.profilePatient.subcorporateName == undefined? $scope.corporateName : $scope.corporateName + " (" + res.profilePatient.subcorporateName +")";
                            $scope.patientName = res.profilePatient.admPerson.firstName + " " + res.profilePatient.admPerson.lastName;
                            $scope.genderName = (res.profilePatient.admPerson.gender == 1) ? translationPrefered.MASCULINO : translationPrefered.FEMENINO;
                            $scope.subCorporateName = res.profilePatient.admPerson.subcorporation !== undefined ? (res.profilePatient.admPerson.subcorporation !==  null ? res.profilePatient.admPerson.subcorporation.toUpperCase() : "") : "";
                            var edadText = "";
                            
                            if (res.profilePatient.admPerson.birthday != undefined || res.profilePatient.admPerson.birthday != null) {
                                var birthday = new Date(res.profilePatient.admPerson.birthday),
                                    age = calculateAge(birthday.getMonth(), birthday.getDay(), birthday.getFullYear());
                                edadText = age;
                                $scope.patientAge = edadText;
                            }
                            $scope.mensaje = (res.numberAppointments <= 1) ? "<br>"+translationPrefered.PATIENT_FIRST_USE+"</b>" : "<b>"+translationPrefered.PATIENT_USE+"<b>";
                            
                            $scope.informationPatient = "<b>"+translationPrefered.CORPORATE+": </b>" + (($scope.corporateName.toUpperCase() == 'DRNN') ? 'Doctor Online' : $scope.corporateName.toUpperCase()) + "<br>" +
                                ($scope.subCorporateName !=="" ? "<b>"+ ($scope.corporateName.toUpperCase() == 'VIVAWELL' ? translationPrefered.VIVAWELL_PLAN : translationPrefered.SUB_CORPORATE) +": <b/>" + (($scope.subCorporateName.toUpperCase() == 'DRNN') ? 'Doctor Online' : $scope.subCorporateName) +"<br>" : "") +
                                "<b>"+translationPrefered.PACIENTE+":</b> " + $scope.patientName + "<br>" + "<b>"+translationPrefered.GENDER+":</b> " + $scope.genderName + "<br>" +
                                "<b>"+translationPrefered.PATIENT_TABLE_YEARS_OLD+":</b> " + $scope.patientAge;
                            if (res.reconnection == 1) {
                                $scope.informationPatient = $scope.informationPatient + "<br>" + translationPrefered.RECONNECT_CHAT;
                            } else {
                                $scope.informationPatient = $scope.informationPatient + "<br>" + $scope.mensaje + "<br>" + translationPrefered.ATTEND;
                            }
                            logInfo($scope.medicalAppointmentId, 'DRONLINE DOCTOR: Se muestra el modal inicial con la información de la consulta para ser atentida.');

                            swal({
                                title: res.reconnection == 1 ? translationPrefered.RECONNECT_CHAT_TITTLE+"</b>" : "<b>"+translationPrefered.NEW_CHAT+"</b>",
                                html: true,
                                text: $scope.informationPatient,
                                showCancelButton: true,
                                confirmButtonColor: "#26AD6E",
                                confirmButtonText: translationPrefered.Salir_Accept,
                                cancelButtonText: translationPrefered.DECLINE,
                                closeOnConfirm: true,
                                allowEscapeKey: false,
                                allowEnterKey: false
                            }, function (inputValue) {
                                if (inputValue === true) {
                                    DoctorSessionResource.actionHistory({'idAction': docHistory.ACEPTAR_CONSULTA});
                                    clearInterval(intervalSleepAlert);
                                    $scope.detenerAudio();
                                    logInfo($scope.medicalAppointmentId, 'DOCTOR: Aceptó atender consulta entrante.');
                                    var req = {
                                        "medicalAppointmentId": $scope.medicalAppointmentId,
                                        "reconnection": res.reconnection
                                    };
                                    $interval.cancel(wifiInterval);
                                    $interval.cancel(speedTestInterval);
                                    AppointmentDrResource.save(req, function (result) {
                                        $scope.attachments = [];
                                        $scope.getAttachments();
                                        var continueAccept = true;
                                        $scope.detenerAudioV();
                                        $scope.createFollowupHourList();
                                        if (typeof result.description !== 'undefined' && result.description == 'appointment_cancelled') {
                                            $timeout($scope.showPatientCancelleMessage, 500);
                                            continueAccept = false;
                                            $scope.continueSearching = true;
                                            $rootScope.showHeader = 1;
                                        }
                                        if (continueAccept) {
                                           
                                            try {
                                                ReactDOM.unmountComponentAtNode(document.getElementById('root'));
                                            } catch (error) {
                                                errorLog("Error al quitar camara de pulling. " + error);
                                            }
                                            if (result.providerCommunicationId === 1) {
                                                $scope.medicalList[result.patient.QBId] = $scope.appointmentInformation;
                                                $scope.changeActualMedicalAppointment(result.patient.QBId);
                                            } else if (result.providerCommunicationId === 3) {
                                                $scope.medicalList[result.medicalAppointmentId] = $scope.appointmentInformation;
                                                $scope.changeActualMedicalAppointment(result.medicalAppointmentId);
                                            }
                                            $scope.usersListIds[$scope.appointmentInformation.medicalAppointmentId] = result;
                                            $scope.maxofChatsAttended++;
                                            if ($rootScope.medicalTypeAttended === 0) {
                                                $rootScope.medicalTypeAttended = 1;
                                                if (result.providerCommunicationId === 1) {
                                                    var stringUrl = JSON.stringify(result);
                                                    $scope.urlAppointment = "qb/chat-doctor-n.php?qbi=" + stringUrl;
                                                    $scope.urlAppointment = $scope.urlAppointment  + '&securityToken=' + token;
                                                    logInfo($scope.appointmentInformation.medicalAppointmentId, 'DRONLINE DOCTOR: Embebiendo estructura de chat en el iframe.');
                                                } else if (result.providerCommunicationId === 3) {
                                                    const tempUrlAppointment = result.firebaseRequest.baseURL + '&securityToken=' + token;
                                                    $scope.urlAppointment = $sce.trustAsResourceUrl(tempUrlAppointment);
                                                    logInfo($scope.appointmentInformation.medicalAppointmentId, "DRONLINE DOCTOR: Firebase URL: " + $scope.urlAppointment);
                                                }
                                                window.onbeforeunload = function () {
                                                    logWarning($scope.appointmentInformation.medicalAppointmentId, 'DRONLINE DOCTOR: Se ejecutó el evento window.onbeforeunload().');
                                                    return "Seguro?";
                                                };
                                                history.pushState(null, null, location.href);
                                                window.onpopstate = function () {
                                                    history.go(1);
                                                };
                                                DoctorResource.find({
                                                    doctorId: result.doctorId
                                                }, function (data) {
                                                    var doctorPhoto = (data.doctorFiles.photoURL == undefined) ? "img/profile-pics/4.jpg" : data.doctorFiles.photoURL;
                                                    $scope.sendDocPhoto = {
                                                        reason: 3,
                                                        photo: doctorPhoto
                                                    }
                                                    if ($scope.msgSended) {
                                                        var iframeEl = document.getElementById('iframe');
                                                        iframeEl.contentWindow.postMessage($scope.sendDocPhoto, '*');
                                                    }
                                                });
                                            } else if ($rootScope.medicalTypeAttended === 1) {
                                                $scope.firtsAppointment = false;
                                                var iframeEl = document.getElementById('iframe');
                                                var request = {
                                                    reason: 1,
                                                    patient: result.patient.QBId,
                                                    medicalId: result.medicalAppointmentId,
                                                    patientName: result.patient.name
                                                }
                                                iframeEl.contentWindow.postMessage(request, '*');
                                                logInfo($scope.appointmentInformation.medicalAppointmentId, 'DRONLINE DOCTOR: Enviando información de conexión de la consulta al iframe.');
                                                //Send message to iframe and change actualMedicalAppointment
                                            }

                                            if ($scope.firtsAppointment) {
                                                $scope.showAppointment = true;
                                                $scope.showLoading = false;
                                                $rootScope.showHeader = 4;
                                                $("#main").addClass("medic");
                                                $scope.AppointmentAttended = false;                                                
                                                logInfo($scope.appointmentInformation.medicalAppointmentId, "DRONLINE DOCTOR: Se muestra la pantalla de consulta médica.");
                                            }

                                             //chat started
                                             const {speciality} = $scope.actualMedicalAppointment;
                                             const {corporateId} = $scope.actualMedicalAppointment.profilePatient.corporateId;                                             
                                             $scope.enableMonodrug = $scope.actualMedicalAppointment.profilePatient.corporateId.enableMonodrug;
                                             $scope.getFieldConfigStatic(corporateId, speciality, 1);
                                             $scope.getFieldConfigStatic(corporateId, speciality, 2);

                                                 

                                            if (AppointmentTime == null) {
                                                $scope.medicalList.forEach(function (item) {
                                                    AppointmentDrResource.getAppointmentStatus({
                                                        medicalAppointmentId: item.medicalAppointmentId
                                                    }, function (response) {
                                                        if(response.newFileUploaded && response.newFileUploaded == 1){
                                                            $scope.getAttachments();
                                                            showNotify(translationPrefered.FILE_RECEIVED_FROM_PATIENT, "success");
                                                        }

                                                        if ($scope.actualMedicalAppointment.medicalAppointmentId === item.medicalAppointmentId) {
                                                            var date = new Date(null);
                                                            $scope.remainingSeconds = (response.remainingSeconds > 0) ? response.remainingSeconds : 0;
                                                            date.setSeconds($scope.remainingSeconds);
                                                            var timeString = date.toISOString().substr(14, 5);
                                                            $scope.remainingTime = timeString;
                                                            if ($scope.remainingSeconds > 0) {
                                                                if (Object.keys($scope.medicalList).length === 1) {
                                                                    $scope.AppointmentAttended = true;
                                                                }
                                                                if ($scope.appointmentsAttended.indexOf(item.medicalAppointmentId) == -1) {
                                                                    $scope.appointmentsAttended.push(item.medicalAppointmentId);
                                                                }

                                                            }
                                                        }
                                                    });
                                                });

                                                AppointmentTime = $interval(function () {
                                                    $scope.medicalList.forEach(function (item) {
                                                        AppointmentDrResource.getAppointmentStatus({
                                                            medicalAppointmentId: item.medicalAppointmentId
                                                        }, function (response) {
                                                            if(response.serviceType == 1){
                                                                $scope.patientOnline1 = !response.patientOnline;
                                                            }
                                                            if(response.newFileUploaded && response.newFileUploaded == 1){
                                                                $scope.getAttachments();
                                                                showNotify(translationPrefered.FILE_RECEIVED_FROM_PATIENT, "success");
                                                            }
                                                            if ($scope.actualMedicalAppointment.medicalAppointmentId === item.medicalAppointmentId) {
                                                                var date = new Date(null);
                                                                $scope.remainingSeconds = (response.remainingSeconds > 0) ? response.remainingSeconds : 0;
                                                                date.setSeconds($scope.remainingSeconds);
                                                                var timeString = date.toISOString().substr(14, 5);
                                                                $scope.remainingTime = timeString;
                                                                if ($scope.remainingSeconds > 0) {
                                                                    if (Object.keys($scope.medicalList).length === 1) {
                                                                        $scope.AppointmentAttended = true;
                                                                    }
                                                                    if ($scope.appointmentsAttended.indexOf(item.medicalAppointmentId) == -1) {
                                                                        $scope.appointmentsAttended.push(item.medicalAppointmentId);
                                                                    }

                                                                }
                                                                if (((response.patientEmail != undefined) && (response.patientEmail != $scope.currentPatientEmail)) ||
                                                                    ((response.patientPhone != undefined) && (response.patientPhone != $scope.currentPatientPhone)) ||
                                                                    ((response.patientAddress != undefined) && (response.patientAddress != $scope.currentPatientAddress))) {
                                                                    $scope.currentPatientEmail = response.patientEmail;
                                                                    $scope.affiliationNumber = response.affiliationNumber;
                                                                    $scope.patientEmail = response.patientEmail;
                                                                    $scope.currentPatientPhone = response.patientPhone;
                                                                    $scope.patientPhone = response.patientPhone;
                                                                    $scope.currentPatientAddress = response.patientAddress;
                                                                    $scope.patientAddress = response.patientAddress;
                                                                    $scope.patientBirthday = response.patientBirthday;
                                                                    $scope.hasPhone = (response.patientPhone);
                                                                    $scope.hasEmail = (response.patientEmail);
                                                                    if ($scope.medicalList[$scope.actualPatientQbId] != null && $scope.medicalList[$scope.actualPatientQbId] != 'undefined') {
                                                                        $scope.medicalList[$scope.actualPatientQbId].profilePatient.admPerson.emailPerson = response.patientEmail;
                                                                        $scope.medicalList[$scope.actualPatientQbId].profilePatient.admPerson.mobilePhone = response.patientPhone;
                                                                        $scope.medicalList[$scope.actualPatientQbId].profilePatient.admPerson.address = response.patientAddress;
                                                                    }
                                                                    $scope.showEmailChangeNotification($scope.actualMedicalAppointment.medicalAppointmentId);
                                                                }
                                                            }
                                                            if (response.finished) {
                                                                logWarning(item.medicalAppointmentId, 'DRONLINE DOCTOR: Se detectó que la consulta fue finalizada por motivos externos al doctor.');
                                                                if (response.withoutConn) {
                                                                    logInfo(item.medicalAppointmentId, 'DRONLINE DOCTOR: Se muestra el modal de finalización de consulta.');
                                                                    swal({
                                                                        title: "<b>"+translationPrefered.CHAT_HA_FIN+"</b>",
                                                                        html: true,
                                                                        text: response.withoutConnText,
                                                                        showCancelButton: false,
                                                                        confirmButtonColor: "#FF0000",
                                                                        confirmButtonText: translationPrefered.ACEPTAR,
                                                                        closeOnConfirm: true,
                                                                        allowEscapeKey: false
                                                                    }, function (inputValue) {
                                                                        if (inputValue === true) {
                                                                            $scope.endActualAppointment(item.medicalAppointmentId);
                                                                        }
                                                                    });
                                                                } else {
                                                                    logInfo(item.medicalAppointmentId, 'DRONLINE DOCTOR: Se muestra el modal de finalización de consulta.');
                                                                    swal({
                                                                        title: "<b>"+translationPrefered.CHAT_HA_FIN+"</b>",
                                                                        html: true,
                                                                        text: translationPrefered.PATIENT_ENDED,
                                                                        showCancelButton: false,
                                                                        confirmButtonColor: "#26AD6E",
                                                                        confirmButtonText: translationPrefered.ACEPTAR,
                                                                        closeOnConfirm: true,
                                                                        allowEscapeKey: false
                                                                    }, function (inputValue) {
                                                                        if (inputValue === true) {
                                                                            $scope.endActualAppointment(item.medicalAppointmentId);
                                                                        }
                                                                    });
                                                                }
                                                            } else if (response.remainingSeconds <= 0) {
                                                                if ($scope.appointmentsAttended.indexOf(item.medicalAppointmentId) > -1) {
                                                                    logInfo(item.medicalAppointmentId, "DRONLINE DOCTOR: Se terminó el tiempo de la consulta, se muestra el modal de finalización'");
                                                                    swal({
                                                                        title: "<b>"+translationPrefered.CHAT_TIME_ENDED+"</b>",
                                                                        html: true,
                                                                        text: response.withoutConnText,
                                                                        showCancelButton: false,
                                                                        confirmButtonColor: "#FF0000",
                                                                        confirmButtonText: translationPrefered.ACEPTAR,
                                                                        closeOnConfirm: true,
                                                                        allowEscapeKey: false
                                                                    }, function (inputValue) {
                                                                        if (inputValue === true) {
                                                                            logInfo(item.medicalAppointmentId, "DRONLINE DOCTOR: Confirmó el modal de finalización de consulta médica'");
                                                                            $scope.endActualAppointment(item.medicalAppointmentId);
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                            if(response.serviceType !== undefined && response.serviceType === 1){
                                                                $scope.showIFrameDoctor = true;
                                                            }
                                                        });
                                                    });
                                                }, 5000);

                                                AppointmentInterval = $interval(function () {
                                                    var date = new Date(null);
                                                    if ($scope.remainingSeconds > 0) {
                                                        $scope.remainingSeconds = $scope.remainingSeconds - 1;
                                                        date.setSeconds($scope.remainingSeconds);
                                                        var timeString = date.toISOString().substr(14, 5);
                                                        $scope.remainingTime = timeString;
                                                    }
                                                }, 1000);
                                            }
                                        }
                                    });
                                } else {
                                    DoctorSessionResource.actionHistory({'idAction': docHistory.DECLINAR_CONSULTA});
                                    logWarning($scope.medicalAppointmentId, 'DOCTOR: Rechazó atender consulta entrante y se cierra el modal inicial.');
                                    $scope.continueSearching = true;
                                    $rootScope.showHeader = 1;
                                    $scope.detenerAudioV();
                                }
                            });
                        } else if ((res.serviceType === 2 || res.serviceType == 3) && ($rootScope.medicalTypeAttended != 1) && $scope.continueSearching) {
                            $scope.continueSearching = false;
                            $scope.appointmentInformation = res;                            
                            $scope.actualMedicalAppointment = res;


                            $scope.setFormValues();
                            $scope.detenerAudio();
                            $scope.playAudioV();
                            clearInterval(intervalSleepAlert)
                            $scope.medicalAppointmentId = res.medicalAppointmentId;
                            $scope.imageUrl = "../img/" + res.profilePatient.corporateName + ".png";
                            $scope.patientEmail = res.profilePatient.admPerson.emailPerson;
                            $scope.affiliationNumber = res.affiliationNumber;
                            $scope.currentPatientEmail = res.profilePatient.admPerson.emailPerson;
                            $scope.patientPhone = res.profilePatient.admPerson.mobilePhone;
                            $scope.currentPatientPhone = res.profilePatient.admPerson.mobilePhone;
                            $scope.patientAddress = res.profilePatient.admPerson.address;
                            $scope.patientBirthday = res.profilePatient.admPerson.birthday;
                            if($scope.patientBirthday != null && $scope.patientBirthday != undefined){
                                var str = $scope.patientBirthday;
                                var subs = str.substring(0, 10);
                                $scope.patientBirthday = new Date(subs);
                            }
                            $scope.currentPatientAddress = res.profilePatient.admPerson.address;
                            $scope.hasEmail = (res.profilePatient.admPerson.emailPerson != null);
                            $scope.hasPhone = (res.profilePatient.admPerson.mobilePhone != null);
                            $scope.corpoId = res.profilePatient.corporateId.corporateId;
                            $scope.corporateName = res.profilePatient.corporateName.toUpperCase();
                            $scope.corporateName = res.profilePatient.subcorporateName == undefined? $scope.corporateName : $scope.corporateName + " (" + res.profilePatient.subcorporateName +")";
                            $scope.subCorporateName = res.profilePatient.admPerson.subcorporation !== undefined ? (res.profilePatient.admPerson.subcorporation !==  null ? res.profilePatient.admPerson.subcorporation.toUpperCase() : "") : "";
                            $scope.actualCorporateName = res.profilePatient.corporateName.toUpperCase();
                            $scope.appointmentCount = res.numberAppointments;

                            if (res.profilePatient.admPerson.gender == 1) {
                                $scope.genderName = translationPrefered.MASCULINO;
                                $scope.patientSex = "M";
                            } else {
                                $scope.genderName = translationPrefered.FEMENINO;
                                $scope.patientSex = "F";
                            }

                            $scope.patientName = res.profilePatient.admPerson.firstName + " " + res.profilePatient.admPerson.lastName;

                            var edadText = "";
                            if (res.profilePatient.admPerson.birthday != undefined || res.profilePatient.admPerson.birthday != null) {
                                var birthday = new Date(res.profilePatient.admPerson.birthday);

                                var age = calculateAge(birthday.getMonth(), birthday.getDay(), birthday.getFullYear());
                                edadText = age;

                                $scope.patientAge = edadText;
                            }

                            $scope.mensaje = (res.numberAppointments <= 1) ? "<br>"+translationPrefered.PATIENT_FIRST_USE+"</b>" : "<b>"+translationPrefered.PATIENT_USE+"<b>";

                            $scope.informationPatient = "<b>"+translationPrefered.CORPORATE+": </b>" + (($scope.corporateName.toUpperCase() == 'DRNN') ? 'Doctor Online' : $scope.corporateName.toUpperCase()) + "<br>" +
                                ($scope.subCorporateName !=="" ? "<b>"+ ($scope.corporateName.toUpperCase() == 'VIVAWELL' ? translationPrefered.VIVAWELL_PLAN : translationPrefered.SUB_CORPORATE) +": <b/>" + (($scope.subCorporateName.toUpperCase() == 'DRNN') ? 'Doctor Online' : $scope.subCorporateName) +"<br>" : "") +
                                "<b>"+translationPrefered.PACIENTE+":</b> " + $scope.patientName + "<br>" +
                                "<b>"+translationPrefered.GENDER+":</b> " + $scope.genderName + "<br>" +
                                "<b>"+translationPrefered.PATIENT_TABLE_YEARS_OLD+":</b> " + $scope.patientAge + "<br>";
                            $scope.informationPatient = (res.serviceType === 3) ? $scope.informationPatient + "<b>"+translationPrefered.LBL_PHONE+":</b> " + $scope.currentPatientPhone + "<br>" + $scope.mensaje + "<br>"+translationPrefered.ATTEND : $scope.informationPatient + $scope.mensaje + "<br>"+translationPrefered.ATTEND;
                            $scope.titleModal = (res.serviceType === 2) ? "<b>"+translationPrefered.NEW_VIDEO+"</b>" : "<b>"+translationPrefered.NEW_MANUAL_CALL+"</b>";
                            logInfo($scope.medicalAppointmentId, 'DRONLINE DOCTOR: Se muestra el modal inicial con la información de la consulta para ser atentida.');
                            swal({
                                title: res.reconnection == 1 ? "<b>"+translationPrefered.RECONNECTION+"</b>" : $scope.titleModal,
                                html: true,
                                text: $scope.informationPatient,
                                showCancelButton: true,
                                confirmButtonColor: "#26AD6E",
                                confirmButtonText: translationPrefered.Salir_Accept,
                                cancelButtonText: translationPrefered.DECLINE,
                                closeOnConfirm: true,
                                allowEscapeKey: false
                            }, function (inputValue) {
                                if (inputValue === true) {   
                                    clearInterval(intervalSleepAlert)
                                    $scope.detenerAudio();
                                    logInfo($scope.medicalAppointmentId, 'DOCTOR: Aceptó atender consulta entrante.');

                                    var req = {
                                        "medicalAppointmentId": $scope.medicalAppointmentId,
                                        "reconnection": res.reconnection
                                    };
                                    AppointmentDrResource.save(req, function (result) {
                                        $scope.manualCall = true; 
                                            $scope.attachments = [];
                                            $scope.getAttachments();
                                            var continueAccept = true;
                                            logInfo($scope.medicalAppointmentId, "DRONLINE DOCTOR: Se recibe respuesta exitosa de aceptación de consulta médica.");
                                            $scope.detenerAudioV();
                                            $scope.createFollowupHourList();
                                            if (typeof result.description !== 'undefined' && result.description == 'appointment_cancelled') {
                                                $timeout($scope.showPatientCancelleMessage, 500);
                                                continueAccept = false;
                                                $scope.continueSearching = true;
                                            }
                                            if (continueAccept) {
                                                try {
                                                    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
                                                } catch (error) {
                                                    errorLog("Error al quitar camara de pulling. " + error);
                                                }
                                                logInfo($scope.medicalAppointmentId, "DRONLINE DOCTOR: Se continua el proceso de aceptación de consulta.");
                                                $interval.cancel(getMedicalAppointment);
                                                $interval.cancel(wifiInterval);
                                                $interval.cancel(speedTestInterval);
                                                getMedicalAppointment = null;
                                                $rootScope.medicalTypeAttended = 2;
                                                if (result.providerCommunicationId === 1) {
                                                    var stringUrl = JSON.stringify(result);
                                                    window.onbeforeunload = function (event) {
                                                        logWarning($scope.medicalAppointmentId, "DRONLINE DOCTOR: Se ejecutó el evento window.onbeforeunload()");
                                                        return "Seguro?";
                                                    };
                                                    history.pushState(null, null, location.href);
                                                    window.onpopstate = function () {
                                                        history.go(1);
                                                    };
                                                    if(res.serviceType === 3){
                                                        $scope.urlAppointment = "";
                                                        $scope.manualCall = false;
                                                    }else{
                                                        $scope.urlAppointment = "qbv/doctor/doctor.php?qbi=" + stringUrl + '&securityToken=' + token;
                                                    }
                                                    
                                                    logInfo($scope.medicalAppointmentId, "DRONLINE DOCTOR: Embebiendo estructura de quickblox en el iframe.");
                                                    $scope.showParameters($scope.corpoId);
                                                    $scope.patientHistoryURL = URLBase + webSiteName + "private/index.php#/pages/pat-appointments/" + $scope.appointmentInformation.profilePatient.profileId;
                                                } else {
                                                    $("#iframe").prop("allow", true);
                                                    $("#iframe").attr("allow", "microphone;camera;");
                                                    infoLog("ZOOM URL DOCTOR: " + result.zoomMeeting.urlWeb);
                                                    $scope.showParameters($scope.corpoId);
                                                    $scope.patientHistoryURL = URLBase + webSiteName + "private/index.php#/pages/pat-appointments/" + $scope.appointmentInformation.profilePatient.profileId;
                                                    const tempUrlAppointment = result.zoomMeeting.urlWeb;
                                                    $scope.urlAppointment = $sce.trustAsResourceUrl(tempUrlAppointment);
                                                    logInfo($scope.medicalAppointmentId, 'DRONLINE DOCTOR: Embebiendo estructura de zoom en el iframe.');
                                                }

                                                $scope.normalForm = true;
                                                if ($scope.corporateName == "DRADISA") {
                                                    $scope.normalForm = false;
                                                    $scope.annotation = {};
                                                    $scope.annotation.confirmName = $scope.patientName;
                                                }
                                                DoctorResource.findParameterByName({
                                                    doctorId: "1",
                                                    parameterName: $scope.actualCorporateName + '_PLATFORM_NAME'
                                                }, function (data) {
                                                    if ($scope.actualMedicalAppointment.serviceType === 2) {
                                                        $rootScope.tituloMsg = data != null ? translationPrefered.WELCOME_TO +" "+ data.value : translationPrefered.WELCOME;
                                                    } else {
                                                        //$rootScope.tituloMsg = data != null ? 'Bienvenido a ' + data.value : "Bienvenido";
                                                        $rootScope.tituloMsg = translationPrefered.PLEASE_CALL +" "+ $scope.currentPatientPhone;
                                                    }
                                                });
                                                ClinicalHistoryCategoryResource.findAll({
                                                    profileId: $scope.appointmentInformation.profilePatient.profileId
                                                }, function (data) {
                                                    $scope.clinicalList = data;
                                                });

                                                $scope.cssUrl = "../css/brands/" + $scope.actualCorporateName.toLowerCase() + '/doctor_appointment.css';
                                                $('#corporateStyle').attr('href', $scope.cssUrl);
                                                $scope.showAppointment = true;
                                                const {speciality} = $scope.actualMedicalAppointment;                                              
                                                //videocall started
                                                const {corporateId} = $scope.actualMedicalAppointment.profilePatient.corporateId;                                                                                          
                                                $scope.enableMonodrug = $scope.actualMedicalAppointment.profilePatient.corporateId.enableMonodrug;                                                
                                                $scope.getFieldConfigStatic(corporateId, speciality, 1);
                                                $scope.getFieldConfigStatic(corporateId, speciality, 2);


                                                $scope.showLoading = false;
                                                logInfo($scope.medicalAppointmentId, 'DRONLINE DOCTOR: Se muestra la pantalla de consulta médica.');
                                                $rootScope.showHeader = 4;
                                                $("#main").addClass("medic");
                                                $scope.AppointmentAttended = false;
                                                AppointmentTime = $interval(function () {
                                                    AppointmentDrResource.getAppointmentStatus({
                                                        medicalAppointmentId: res.medicalAppointmentId
                                                    }, function (response) {
                                                        if(response.newFileUploaded && response.newFileUploaded == 1){
                                                            $scope.getAttachments();
                                                            showNotify(translationPrefered.FILE_RECEIVED_FROM_PATIENT, "success");
                                                        }
                                                        var date = new Date(null);
                                                        $scope.remainingSeconds = response.remainingSeconds;
                                                        date.setSeconds($scope.remainingSeconds);
                                                        var timeString = date.toISOString().substr(14, 5);
                                                        $scope.remainingTime = timeString;
                                                        if ($scope.remainingSeconds > 0) {
                                                            $scope.AppointmentAttended = true;
                                                        }
                                                        if (((response.patientEmail != undefined) && (response.patientEmail != $scope.currentPatientEmail)) ||
                                                            ((response.patientPhone != undefined) && (response.patientPhone != $scope.currentPatientPhone)) ||
                                                            ((response.patientAddress != undefined) && (response.patientAddress != $scope.currentPatientAddress))) {
                                                            $scope.currentPatientEmail = response.patientEmail;
                                                            $scope.patientEmail = response.patientEmail;
                                                            $scope.affiliationNumber = response.affiliationNumber;
                                                            $scope.currentPatientPhone = response.patientPhone;
                                                            $scope.patientPhone = response.patientPhone;
                                                            $scope.currentPatientAddress = response.patientAddress;
                                                            $scope.patientAddress = response.patientAddress;
                                                            $scope.patientBirthday = repsonse.patientBirthday;
                                                            $scope.hasPhone = (response.patientPhone);
                                                            $scope.hasEmail = (response.patientEmail);
                                                            $scope.showEmailChangeNotification($scope.actualMedicalAppointment.medicalAppointmentId);
                                                        }
                                                        if (response.finished) {
                                                            logWarning($scope.medicalAppointmentId, 'DRONLINE DOCTOR: Se detectó que la consulta fue finalizada por motivos externos al doctor.');
                                                            $interval.cancel(AppointmentTime);
                                                            $scope.hangup();
                                                        }

                                                        if(response.communicationProvider !== undefined && response.patientOnline !== undefined && response.communicationProvider === 2){
                                                            if(response.serviceType == 1){
                                                                $scope.patientOnline1 = !response.patientOnline;
                                                            }
                                                            if(response.patientOnline){
                                                                $scope.showIFrameDoctor = true;
                                                            }
                                                            else{
                                                                $scope.showIFrameDoctor = false;
                                                            }
                                                        }

                                                        if(response.communicationProvider !== undefined && response.patientOnline !== undefined && response.communicationProvider === 1){
                                                            if(response.patientOnline){
                                                                $scope.showIFrameDoctor = true;
                                                            }
                                                            else{
                                                                $scope.showIFrameDoctor = false;
                                                            }
                                                            if(!patientOnline && response.patientOnline){
                                                                if(response.serviceType !== 3){
                                                                    var iframe = document.getElementById('iframe');
                                                                    iframe.src = iframe.src;
                                                                }
                                                            }
                                                            patientOnline = response.patientOnline;
                                                        }

                                                        if(response.serviceType === 3 && response.communicationProvider === 1){
                                                            $scope.manualCall = false;
                                                        } else{
                                                            $scope.manualCall = true;
                                                        }
                                                    });
                                                    if($scope.showIFrameDoctor && window.navigator.onLine){
                                                        $scope.showIFrameDoctor = true;
                                                    }
                                                    else{
                                                        $scope.showIFrameDoctor = false;
                                                    }  
                                                    if(!internetConnectionDoctor && window.navigator.onLine){
                                                        var iframe = document.getElementById('iframe');
                                                        iframe.src = iframe.src;
                                                    } 
                                                    internetConnectionDoctor = window.navigator.onLine;
                                                }, 5000);

                                                AppointmentInterval = $interval(function () {
                                                    var date = new Date(null);
                                                    $scope.remainingSeconds = $scope.remainingSeconds - 1;
                                                    date.setSeconds($scope.remainingSeconds);
                                                    var timeString = date.toISOString().substr(14, 5);
                                                    $scope.remainingTime = timeString;
                                                    if ($scope.AppointmentAttended && $scope.remainingSeconds <= 0) {
                                                        $interval.cancel(AppointmentInterval);
                                                        $scope.hangup();
                                                    }
                                                }, 1000);
                                            }

                                        },
                                        function (error) {
                                            logSevere($scope.medicalAppointmentId, "Error al aceptar atender la consulta médica. " + JSON.stringify(error));
                                            $scope.detenerAudioV();
                                            $scope.continueSearching = true;
                                            $rootScope.showHeader = 1;
                                        });
                                } else {
                                    logWarning($scope.medicalAppointmentId, 'DOCTOR: Rechazó atender consulta entrante y se cierra el modal inicial.');
                                    $rootScope.showHeader = 1;
                                    $scope.continueSearching = true;
                                    $scope.detenerAudioV();
                                }
                            });
                        }
                    }
                });
                $scope.getUnprocessedAppointments();
            }, 10000);
        };

        if ($state.current.name == "pages.medical-appointment-doc") {
            DoctorResource.updateHeartbeat({
                doctorId: $rootScope.currentUserId
            }, function (data) {
                infoLog("Heartbeat of doctor updated");
            });
            doctorHeartbeat = $interval(function () {
                DoctorResource.updateHeartbeat({
                    doctorId: $rootScope.currentUserId
                }, function (data) {
                    infoLog("Heartbeat of doctor updated");
                });
            }, 15000);

            var intervalSleepAlert;
            const idDoctor = $cookies.get('admdron') ? JSON.parse($cookies.get('admdron')).userId : null
            if (idDoctor) {
                CorporateInformationConfiguration.getInformation({id: idDoctor}, function (res) {
                    const corporationList = res;
                    for (let index = 0; index < corporationList.length; index++) {
                        if (corporationList[index].docStayAwareAlert > 0) {
                            startAlertSuspense(corporationList[index].docStayAwareAlert)
                            break;
                        }
                    }
                })
            }            
            var startAlertSuspense = function (milliseconds) {
                milliseconds = milliseconds * 60000;
                if (!intervalSleepAlert) {
                    clearInterval(intervalSleepAlert)
                    intervalSleepAlert = setInterval(()=> {
                        const location = window.location.href.split('/');
                        if (location[location.length-1] == 'medical-appointment-doc') {
                            $scope.playAudio();                    
                            swal({
                                title: translationPrefered.ALERT_STAY_AWARE_DOCTOR,
                                html: false,
                                showCancelButton: false,
                                confirmButtonColor: "#26AD6E",
                                confirmButtonText: translationPrefered.ACEPTAR,
                                closeOnConfirm: true,
                                allowEscapeKey: true,
                                allowEnterKey: true,
                                allowDismiss: true
                            }, function (value) {
                                $scope.detenerAudio()
                            })
                        } else {
                            clearInterval(intervalSleepAlert)
                            $scope.detenerAudio()
                        }
                    }, milliseconds)
                }
            }
        }

        $scope.showPatientCancelleMessage = function () {
            swal({
                title: translationPrefered.LO_SENTIMOS,
                text: translationPrefered.DR_PATIENT_CANCELED,
                type: "error",
                confirmButtonColor: "#26AD6E",
                confirmButtonText: translationPrefered.buttonOK,
                closeOnConfirm: true
            });
        };

        $scope.endAppointment = function () {
            $interval.cancel(AppointmentInterval);
            $interval.cancel(AppointmentTime);
            if ($scope.medicalAppointmentId != "") {
                var token = JSON.parse($cookies.get('admdron')).access_token;
                var reqCancel = {
                    method: 'POST',
                    url: apiURLBaseJS + "dronline-doctor-api/api/doctor/end-medical-appointment",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    data: {
                        medicalAppointmentId: $scope.medicalAppointmentId
                    }
                };
                $http(reqCancel).then(function successCallback(response) {
                    $interval.cancel(AppointmentInterval);
                    $interval.cancel(AppointmentTime);
                    window.location.href = URLBase + webSiteName + "private/index.php#/pages/rating-doc/";
                });
            }
        };

        $scope.hangupByDoctor = function () {
            logWarning($scope.medicalAppointmentId, "DOCTOR: Presionó el botón finalizar y se muestra el modal de confirmación.");
            let swalEndTitle = ($scope.actualMedicalAppointment.serviceType === 2) ? translationPrefered.DESEA_FIN_VIDEO : translationPrefered.DESEA_FIN_MANUAL;
            swal({
                title: swalEndTitle,
                showCancelButton: true,
                confirmButtonColor: "#26AD6E",
                confirmButtonText: translationPrefered.Salir_Accept,
                cancelButtonText: translationPrefered.CANCELAR,
                closeOnConfirm: true,
                allowEscapeKey: false
            }, function (inputValue) {
                if (inputValue === true) {
                    logInfo($scope.medicalAppointmentId, 'DOCTOR: Confirmó finalizar la consulta.');
                    $scope.endAppointment();
                    $("#main").removeClass("medic");
                    $("#main").removeClass("no-top");
                } else {
                    logInfo($scope.medicalAppointmentId, 'DOCTOR: Rechazó finalizar la consulta.');
                }
            });
        };

        $scope.hangup = function () {
            $('#iframe').remove();
            $scope.endAppointment();
            $interval.cancel(AppointmentInterval);
            $interval.cancel(AppointmentTime);
            $("#main").removeClass("medic");
            $("#main").removeClass("no-top");
            logInfo($scope.medicalAppointmentId, "DRONLINE DOCTOR: Se muestra el modal de finalización de consulta.");
            let swalEndedTitle = ($scope.actualMedicalAppointment.serviceType === 2) ? translationPrefered.VIDEO_HA_FIN : translationPrefered.MANUAL_HA_FIN;
            swal({
                title: swalEndedTitle,
                showCancelButton: true,
                confirmButtonColor: "#26AD6E",
                confirmButtonText: translationPrefered.ACEPTAR,
                closeOnConfirm: true,
                showCancelButton: false,
                allowEscapeKey: false
            }, function (inputValue) {
                if (inputValue === true) {

                }
            });
        };

        $scope.savePatientInfo = function () {
            DoctorSessionResource.actionHistory({'idAction': docHistory.ACTUALIZAR_ANTECEDENTES});
            var profile = {
                profile: $scope.actualMedicalAppointment.profilePatient,
                clinicalHistoryList: $scope.clinicalList
            };
            PatProfileResource.update(profile);
            $scope.showChangeNotification();
            logInfo($scope.actualMedicalAppointment.medicalAppointmentId, 'DOCTOR: Guardó información clinica del paciente.');
        }

        updateEmailPatient = function () {
            if ($scope.hasEmail) {
                if ($scope.patientEmail == undefined || $scope.patientEmail == null || $scope.patientEmail == "") {
                    return;
                }
            }
            if ($scope.hasPhone) {
                if ($scope.patientPhone == undefined || $scope.patientPhone == null || $scope.patientPhone == "") {
                    return;
                }
            }
            
            var profileContactInfo = {
                profileId: $scope.actualMedicalAppointment.profilePatient.profileId,
                profileEmail: $scope.patientEmail,
                profilePhone: $scope.patientPhone,
                profileAddress: $scope.patientAddress,
                profileBirthday: $scope.patientBirthday
            }

            PatProfileResource.updateContactInformation(profileContactInfo, function (response) {
                $scope.showChangeNotification();
                $scope.hasPhone = (response.profilePhone);
                $scope.hasEmail = (response.profileEmail);
                $scope.currentPhone = response.profilePhone;
                $scope.patientEmail = response.profileEmail;
                $scope.patientAddress = response.profileAddress;
                $scope.patientBirthday = response.profileBirthday;
                $scope.currentPatientEmail = response.profileEmail;
                $scope.currentPatientPhone = response.profilePhone;
                $scope.currentPatientAddress = response.profileAddress;
                if ($rootScope.medicalTypeAttended == 1) {
                    if ($scope.medicalList[$scope.actualPatientQbId].profilePatient != null && (typeof $scope.medicalList[$scope.actualPatientQbId].profilePatient != "undefined")) {
                        $scope.medicalList[$scope.actualPatientQbId].profilePatient.admPerson.emailPerson = response.profileEmail;
                        $scope.medicalList[$scope.actualPatientQbId].profilePatient.admPerson.mobilePhone = response.profilePhone;
                        $scope.medicalList[$scope.actualPatientQbId].profilePatient.admPerson.address = response.profileAddress;
                    }
                } else if ($rootScope.medicalTypeAttended == 2) {
                    $scope.actualMedicalAppointment.profilePatient.admPerson.emailPerson = response.profileEmail;
                    $scope.actualMedicalAppointment.profilePatient.admPerson.mobilePhone = response.profilePhone;
                    $scope.actualMedicalAppointment.profilePatient.admPerson.address = response.profileAddress;
                }

                if (response.profileBirthday != undefined || response.profileBirthday != null) {
                    var birthday = new Date(response.profileBirthday),
                    age = calculateAge(birthday.getMonth(), birthday.getDay(), birthday.getFullYear());
                    edadText = age;
                    $scope.patientAge = edadText;
                }

                logInfo($scope.actualMedicalAppointment.medicalAppointmentId, 'DOCTOR: Registró correo electrónico del paciente.');
            });
        };

        $scope.addPatientEmail = function () {
            DoctorSessionResource.actionHistory({'idAction': docHistory.ACTUALIZAR_DATOS_PACIENTE});
            updateEmailPatient();
        }
        $scope.searchMedicamentByName = function (search) {
            if (search !== undefined && search !== "") {
                var deferred = $q.defer();
                MedicalPrescriptionResource.findMedicamentByMonodrugOrPresentation({
                    description: search,
                    corporateId: $scope.corpoId,
                    type: 'monodrug'
                }, function (response) {
                    let superArry = []
                    response.forEach(element => {
                        const findSame = superArry.find(medical => medical.monodrug.monodrugID === element.monodrug.monodrugID)
                        if (findSame) {
                        } else {
                            superArry.push({
                                description: element.description,
                                monodrug: {
                                    monodrugID: element.monodrug.monodrugID,
                                    monodrugName: element.monodrug.monodrugName
                                },
                                presentationID: element.presentationID
                            })
                        }
                    });
                    deferred.resolve(superArry);
                });
                return deferred.promise;
            }
        };
        $scope.changeMedicamentByName = function (medicament) {
            //var monodrugIDSelected = medicament.monodrug.monodrugID;
            var monodrugName = medicament.monodrug.monodrugName;
            var monodrugID = medicament.monodrug.monodrugID;
            MedicalPrescriptionResource.findMedicamentByDescription({
                name: ' ',
                idMonodrogrug: monodrugID
            }, function (response) {
                $scope.monodrugsRecomends = []
                $scope.monodrugsRecomends = response
                $scope.searchMedicamentByDescription('');
            })
        }

        $scope.searchMedicamentByDescription = function (search) {
            let data = [];
            if (search !== undefined && search !== "") {
                var deferred = $q.defer();
                MedicalPrescriptionResource.findMedicamentByMonodrugOrPresentation({
                    description: search,
                    corporateId: $scope.corpoId,
                    type: 'presentation'
                }, function (response) {
                    let superArry = []
                    response.forEach(element => {
                        const findSame = superArry.find(medical => medical.monodrug.monodrugID === element.monodrug.monodrugID)
                        if (findSame) {} else {
                            superArry.push({
                                description: element.description,
                                monodrug: {
                                    monodrugID: element.monodrug.monodrugID,
                                    monodrugName: element.monodrug.monodrugName
                                },
                                presentationID: element.presentationID
                            })
                        }
                    });
                    deferred.resolve(superArry);
                });
                return deferred.promise;
            }
            if (search !== undefined && search !== "") {
                let val = search.toLowerCase();
                data = $scope.monodrugsRecomends.filter(item => {
                    let subCorp = item.description;
                    let a = subCorp.toString()
                    if (a) {
                      if (a.toLowerCase().indexOf(val) !== -1) {
                        return true;
                      }
                    }
                    return false;
                })
            }
            else if ($scope.monodrugsRecomends) { 
                data = $scope.monodrugsRecomends
            } else {
                data = []
            };
            return data;
            
        };


        $scope.searchMedicamentPresentation = function (search) {
            if (search !== undefined && search !== "") {
                let val = search.toLowerCase();
                return $scope.medicalPresentations.filter(item => {
                    let subCorp = item;
                    let a = subCorp.toString()
                    if (a) {
                      if (a.toLowerCase().indexOf(val) !== -1) {
                          console.log(a, val)
                        return true;
                      }
                    }
                    return false;
                })
            }
            else if ($scope.medicalPresentations) { 
                return $scope.medicalPresentations
            } else return [];
        };
        $scope.searchMedicamentDoses = function (search) {
            if (search !== undefined && search !== "") {
                let val = search.toLowerCase();
                return $scope.medicalDoses.filter(item => {
                    let subCorp = item;
                    let a = subCorp.toString()
                    if (a) {
                      if (a.toLowerCase().indexOf(val) !== -1) {
                          console.log(a, val)
                        return true;
                      }
                    }
                    return false;
                })
            }
            else if ($scope.medicalDoses) { 
                return $scope.medicalDoses
            } else return [];
        };
        $scope.searchMedicamentType = function (search) {
            if (search !== undefined && search !== "") {
                let val = search.toLowerCase();
                return $scope.medicalTypes.filter(item => {
                    let subCorp = item;
                    let a = subCorp.toString()
                    if (a) {
                      if (a.toLowerCase().indexOf(val) !== -1) {
                          console.log(a, val)
                        return true;
                      }
                    }
                    return false;
                })
            }
            else if ($scope.medicalTypes) {
                return $scope.medicalTypes
            } else return [];
        };

        $scope.saveAllNotesVideoCall = function () {
            DoctorSessionResource.actionHistory({'idAction': docHistory.GUARDAR_DATOS_CONSULTA});
            if ($scope.annotation !== undefined) {
                $scope.annotation.appointmentId = $scope.actualMedicalAppointment.medicalAppointmentId;
                $scope.annotation.previous = ($scope.annotation.previous ? 1 : 0);
                AppointmentInformationResource.update($scope.annotation, function (response) {
                    $scope.annotation.previous = ($scope.annotation.previous == 1 ? true : false);
                    $scope.annotations[$scope.actualMedicalAppointment.medicalAppointmentId] = $scope.annotation;
                    $scope.showChangeNotification();
                }, function (err) {
                    console.error("Error al actualizar información de consulta");
                    console.error(err);
                });
            }
        }
        $scope.successfullyAdded = function () {
            if($scope.actualMedicalAppointment.profilePatient.corporateName == 'vivawell'){
                $.notify({
                    title: '<strong>Guardado correctamente</strong><br>',
                    message: '',
                }, {
                    type: 'success',
                    delay: 1000,
                    animate: {
                        enter: 'animated fadeInRight',
                        exit: 'animated fadeOutRight',
                    },
                    placement: {
                        from: 'bottom'
                    }
                });
                logInfo($scope.actualMedicalAppointment.medicalAppointmentId, "DOCTOR: Guardó información en el resumen de la consulta.");
                data = angular.toJson($scope.medicalPrescription);
                localStorage.setItem("dataMedicalPrescription",  JSON.stringify($scope.medicalPrescription) )
            }
        };

        $scope.showChangeNotification = function () {
            $.notify({
                title: '<strong>'+translationPrefered.SAVED_SUCCESS+'</strong><br>',
                message: '',
            }, {
                type: 'success',
                delay: 1000,
                animate: {
                    enter: 'animated fadeInRight',
                    exit: 'animated fadeOutRight',
                },
                placement: {
                    from: 'bottom'
                }
            });
            logInfo($scope.actualMedicalAppointment.medicalAppointmentId, "DOCTOR: Guardó información en el resumen de la consulta.");
        };

        $scope.showEmailChangeNotification = function (medicalId) {
            $.notify({
                title: '<strong>'+translationPrefered.PATIENT_UPDATE_EMAIL+'</strong><br>',
                message: '',
            }, {
                type: 'success',
                delay: 1000,
                animate: {
                    enter: 'animated fadeInRight',
                    exit: 'animated fadeOutRight',
                },
                placement: {
                    from: 'bottom'
                }
            });
            logInfo(medicalId, "DRONLINE DOCTOR: Se detectó que el paciente registró un correo electrónico.");
        };

        $scope.viewMedicalAppointments = function () {
            $scope.detenerAudio();
            $state.go('pages.medical-appointment-doc');
        };

        function checkInternetConnection() {
            if (navigator.onLine != $scope.connected) {
                if (navigator.onLine) {
                    $scope.onlineAudio();
                } else {
                    $scope.offlineAudio();
                }
            }
            $scope.connected = (navigator.onLine);

            if (enableSpeedTest) {
                if (!$scope.connected && speedTestInterval != null) {
                    $interval.cancel(speedTestInterval);
                    speedTestInterval = null;
                } else if ($scope.connected && speedTestInterval == null) {
                    startTest();
                    speedTestInterval = $interval(startTest, 180000);
                }
            }
        };

        $scope.loading = function () {
            $scope.showLoading = true;
            $scope.showChat = false;
            $scope.connected = true;
            wifiInterval = $interval(checkInternetConnection, 1000);
            this.searchAppointment();
        };
        $scope.home = function () {
            $state.go('pages.doctor');
        };
        $scope.endChat = function () {
            $state.go('pages.doctor');
        };
        $scope.detenerAudio = function () {
            $scope.audiofile.pause();
            $scope.audiofile.currentTime = 0;

        };
        $scope.playAudio = function () {
            $scope.audiofile.play();
            $scope.audiofile.loop = true;
        };

        $scope.confirmManualCall = function (appointmentId) {
            swal({
                title: translationPrefered.CREATE_MANUAL_CALL,
                showCancelButton: true,
                confirmButtonColor: "#26AD6E",
                confirmButtonText: translationPrefered.ACEPTAR,
                cancelButtonText: translationPrefered.CANCELAR,
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            }, function (inputValue) {
                if (inputValue) {
                    $scope.manualCallCreated = true;
                    $scope.createManualCall(appointmentId);
                }
            });
        }

        $scope.createManualCall = function (appointmentId) {
            AppointmentResource.findCallbackOrInvitation({
                userId: appointmentId.userId,
                termsAccepted: !$scope.termsAccepted ? 0 : $scope.termsAccepted
            }, function (res) {
                let swalTitle = '', swalType = '', swalText = '';
                if (!res.hasQueue && !res.isOnCall) {
                    $scope.downStatus = true;
                    $scope.profile = appointmentId.profileId;
                    $scope.speciality = appointmentId.specialityId;
                    $scope.option = 3;
                    var reqCHECK = {
                        method: 'POST',
                        url: apiURLBaseJS + "dronline-call-api/sessioncallactive/callme/" + $scope.profile + "/" + $scope.option,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    };
                    $http(reqCHECK).then(function successCallback(response) {
                        if (response.data.codigo == 6) {
                            logInfo(response.data.resultado.idMedicalAppointment, "DRONLINE DOCTOR: Se confirmó la creación de la consulta en navegador");
                            swalTitle = translationPrefered.MANUAL_CALL_CREATED;
                            swalText = translationPrefered.ATTENTION_IN_WAITING_SC;
                            swalType = 'success';
                            logWarning(appointmentId.medicalAppointmentId, "DOCTOR: Creó llamada manual.");

                        } else {
                            swalTitle = translationPrefered.LO_SENTIMOS;
                            swalText = translationPrefered.PATIENT_DISABLED;
                            swalType = 'error';
                            logWarning(appointmentId.medicalAppointmentId, "DOCTOR: Solicitó crear llamada manual, pero no tiene consultas disponibles.");
                        }
                        swal({
                            title: swalTitle,
                            type: swalType,
                            text: swalText,
                            confirmButtonColor: "#26AD6E",
                            confirmButtonText: translationPrefered.buttonOK,
                            closeOnConfirm: true,
                            allowEscapeKey: false,
                            allowEnterKey: false
                        }, function () {
                            //confirmConsultation(true);
                        });
                    }, function errorCallback(response) {
                        errorLog("Error creating check call status.");
                    });
                } else {
                    logWarning(appointmentId.medicalAppointmentId, "DOCTOR: Solicitó crear llamada manual pero ya existia una consulta para la cuenta.");
                    swalTitle = translationPrefered.LO_SENTIMOS;
                    swalText = translationPrefered.PATIENT_NEW_REQ;
                    swalType = 'error';
                    swal({
                        title: swalTitle,
                        text: swalText,
                        type: swalType,
                        confirmButtonColor: "#26AD6E",
                        confirmButtonText: translationPrefered.buttonOK,
                        closeOnConfirm: true
                    });
                }
            });
        };
    })
    .controller('DatepickerDemoCtrl', function ($scope) {
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();
        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
        $scope.open = function ($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope[opened] = true;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
    })
    .controller('materialadminCtrl', function ($state, $cookies, $scope, $rootScope, DoctorResource, TranslationResource, $translate) {
        var langVersion, corpVersion = null;
        if(localStorage.getItem("langTranslationVersion")) {
            langVersion = localStorage.getItem("langTranslationVersion");
        }
        if(localStorage.getItem("corpTranslationVersion")) {
           if($cookies.get('ng-security-permissions') == "patient") {
                corpVersion = localStorage.getItem("corpTranslationVersion");
           }
        }
        let request = {
            resource: getCookie("resource"),
            corpTranslationVersion: langVersion,
            langTranslationVersion: corpVersion,
            type: (JSON.parse($cookies.get('ng-security-permissions')) == "patient"?1:2)
        };

        TranslationResource.find(request, function(response){
            if(response.translations !== undefined){
                let userTranslations = response.translations.reduce(function(acc, curr) {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {});
                localStorage.setItem('translation', JSON.stringify(userTranslations));
                localStorage.setItem('corpTranslationVersion', response.corpTranslationVersion);
                localStorage.setItem('langTranslationVersion', response.langTranslationVersion);
                $translate.refresh();
            }                
        });          


        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            angular.element('html').addClass('ismobile');
        }

        $rootScope.titulo = "";
        var cookie = JSON.parse($cookies.get('admdron'));
        if ($cookies.get("corpname") != "vanilla" && cookie.parentCorporateInformation !== undefined) {            
            DoctorResource.findParameterByName({
                doctorId: "1",
                parameterName: cookie.parentCorporateInformation.corporateName + '_PLATFORM_NAME'
            }, function (data) {
                $rootScope.titulo = data != null ? data.value : "NOT FOUND";
            });
        } else {
            $rootScope.titulo = "Doctor Online";
        }

        $rootScope.showHeader = 1;

        $scope.fechaActual = new Date();

        // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
        this.sidebarToggle = {
            left: false,
            right: false
        }
        // By default template has a boxed layout
        this.layoutType = 1;
        // For Mainmenu Active Class
        this.$state = $state;
        //Close sidebar on click
        this.sidebarStat = function (event) {
            if (!angular.element(event.target).parent().hasClass('active')) {
                this.sidebarToggle.left = false;

            }
        }


        //Listview Search (Check listview pages)
        this.listviewSearchStat = false;
        this.lvSearch = function () {
            this.listviewSearchStat = true;
        };
        this.currentYear = new Date().getFullYear();
        $scope.admdron = JSON.parse($cookies.get('admdron'));

        if($scope.admdron.corporateInformation != undefined){
            if($scope.admdron.corporateInformation.attentionPlan == 1){
                $rootScope.corpAttentionType = 1;
                $rootScope.attendanceText =   translationPrefered.ONDEMAND_MSG;
            } else if($scope.admdron.corporateInformation.attentionPlan == 2){
                //$rootScope.corpAttentionType = 2;
                $rootScope.attendanceText =   translationPrefered.ONDEMAND_MSG;
            } else {
                $rootScope.corpAttentionType = 1;
                $rootScope.attendanceText =  ($rootScope.corpAttentionType == 1 || $rootScope.enableCalendar == 1) ? translationPrefered.CITAS_MSG : translationPrefered.ONDEMAND_MSG;
                if ($scope.admdron.corporateInformation.corporateName.toLowerCase() === 'vivawell') {
                    $rootScope.attendanceText = translationPrefered.ONDEMAND_MSG;
                }
            }
            $scope.changeAttendance = function(){
                var validAttendance = false;
                if(($scope.admdron.parentCorporateInformation.corporateName =='dronlinetdb' || $scope.admdron.parentCorporateInformation.corporateName =='viya' || $scope.admdron.parentCorporateInformation.corporateName =='viyasv' || $scope.admdron.parentCorporateInformation.corporateName =='viyani' || $scope.admdron.parentCorporateInformation.corporateName =='viyahn' || $scope.admdron.parentCorporateInformation.corporateName =='viyado') &&  $scope.numberAppointments == 0){
                    validAttendance = false;
                }
                if(($scope.admdron.parentCorporateInformation.corporateName =='dronlinetdb' || $scope.admdron.parentCorporateInformation.corporateName =='viya' || $scope.admdron.parentCorporateInformation.corporateName =='viyasv' || $scope.admdron.parentCorporateInformation.corporateName =='viyani' || $scope.admdron.parentCorporateInformation.corporateName =='viyahn' || $scope.admdron.parentCorporateInformation.corporateName =='viyado') &&  $scope.numberAppointments > 0){
                    validAttendance = true;
                }
                if($scope.admdron.parentCorporateInformation.corporateName !== 'dronlinetdb' && $scope.admdron.parentCorporateInformation.corporateName !== 'viya' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyasv' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyani' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyahn' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyado'){
                    validAttendance = true;
                }
                if(validAttendance){
                    if ($scope.admdron.corporateInformation.corporateName.toLowerCase() === 'vivawell') {
                        $state.go("pages.calendar");
                    } else {
                        var link_logo = $("#link-logo-1");
                        var link_logo2 = $("#link-logo-2");
                        if ($rootScope.corpAttentionType == 2){
                            $rootScope.corpAttentionType = 1;
                            link_logo.css("position", "relative").css("left", 0);
                            link_logo2.css("position", "absolute").css("left", -9999);
                        }
                        else{
                            $rootScope.corpAttentionType = 2;
                            link_logo.css("position", "absolute").css("left", -9999);
                            link_logo2.css("position", "relative").css("left", 0);
                        }
                        $rootScope.attendanceText =  ($rootScope.corpAttentionType == 1 || $rootScope.enableCalendar == 1) ? translationPrefered.CITAS_MSG : translationPrefered.ONDEMAND_MSG;
                    }
                }else{
                    $state.go('pages.enter-code', {
                        optionId: 3
                    });
                }
            };
            $scope.goCalendar = function() {
                var validAttendance = false;
                if (($scope.admdron.parentCorporateInformation.corporateName == 'dronlinetdb' || $scope.admdron.parentCorporateInformation.corporateName == 'viya' || $scope.admdron.parentCorporateInformation.corporateName == 'viyasv' || $scope.admdron.parentCorporateInformation.corporateName == 'viyani' || $scope.admdron.parentCorporateInformation.corporateName == 'viyahn' || $scope.admdron.parentCorporateInformation.corporateName == 'viyado') && $scope.numberAppointments == 0) {
                    validAttendance = false;
                }
                if (($scope.admdron.parentCorporateInformation.corporateName == 'dronlinetdb' || $scope.admdron.parentCorporateInformation.corporateName == 'viya' || $scope.admdron.parentCorporateInformation.corporateName == 'viyasv' || $scope.admdron.parentCorporateInformation.corporateName == 'viyani' || $scope.admdron.parentCorporateInformation.corporateName == 'viyahn' || $scope.admdron.parentCorporateInformation.corporateName == 'viyado') && $scope.numberAppointments > 0) {
                    validAttendance = true;
                }
                if ($scope.admdron.parentCorporateInformation.corporateName !== 'dronlinetdb' && $scope.admdron.parentCorporateInformation.corporateName !== 'viya' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyasv' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyani' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyahn' && $scope.admdron.parentCorporateInformation.corporateName !== 'viyado') {
                    validAttendance = true;
                }
                if (validAttendance) {
                    if ($rootScope.enableCalendar == 1) {
                        $state.go("pages.calendar");
                    }
                } else {
                    $state.go('pages.enter-code', {
                        optionId: 3
                    });
                }
            };
        }

        
        $scope.changePharmacy = function  () {
            $state.go("pages.pharmacy");            
        }
    })
    .controller('headerCtrl', function ($scope, $interval, $state, $window, $security, $cookies, $rootScope, domainName,
        formatService, DoctorResource, DeviceResource, LoginResource, DoctorSessionResource) {
        this.actionMiAccount = function() {
            DoctorSessionResource.actionHistory({'idAction': docHistory.MI_CUENTA});
        }


        this.getBack = function () {
            window.top.close();
        };

        this.openSearch = function () {
            angular.element('#header').addClass('search-toggled');
            angular.element('#top-search-wrap').find('input').focus();
        };
        this.closeSearch = function () {
            angular.element('#header').removeClass('search-toggled');
        };

        $scope.logoutDoctor = function(){
            $interval.cancel(doctorHeartbeat);
            $interval.cancel(getMedicalAppointment);
            doctorHeartbeat = null;
            getMedicalAppointment = null;
            DoctorResource.logout({
                doctorId: $rootScope.currentUserId
            }, function (data) {
                LoginResource.logout(function(response){
                    $security.logout();
                    $window.location = domainName + 'views/logout.php?type=Doctor';
                });
            });
        }

        this.logout = function (tipo) {
            if(tipo == 'doctor'){
                DoctorSessionResource.logout();
                DoctorResource.getQueue(function(response){
                    if(response && response.length > 0){
                        var confirmLogout = confirm(translationPrefered.CONFIRM_LOGOUT + "\n" + translationPrefered.ATENTION_MSG);
                        if (confirmLogout == true) {
                            $scope.logoutDoctor();
                        }
                    }else{
                        $scope.logoutDoctor();
                    }
                }, function(error){
                    console.log(error);
                });    
            }else{
                if ($rootScope.playerId !== undefined) {
                    DeviceResource.unregisterDevice({
                        token: $rootScope.playerId
                    }, function (data) {
                        infoLog(data);
                    });
                }
                LoginResource.logout(function(response){
                    $security.logout();
                    $window.location = domainName + 'views/logout.php?type=Paciente';
                });
            }            
        };

	    $scope.initDataAnalysis = function(){
            $state.go('pages.speciality', {
                optionId: 4
            });
        }

        this.confirmLogOut = function () {
            swal({
                title: translationPrefered.LOGOUT,
                text: translationPrefered.LOGOUT_CONFIRM,
                showCancelButton: true,
                confirmButtonColor: "#26AD6E",
                confirmButtonText: translationPrefered.ACEPTAR,
                cancelButtonText: translationPrefered.CANCELAR,
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            }, function (inputValue) {
                if (inputValue) {
                    DoctorSessionResource.logout();
                    DoctorResource.getQueue(function(response){
                        if(response && response.length > 0){
                            var confirmLogout = confirm(translationPrefered.CONFIRM_LOGOUT + "\n" + translationPrefered.ATENTION_MSG);
                            if (confirmLogout == true) {
                                $scope.logoutDoctor();
                            }
                        }else{
                            $scope.logoutDoctor();
                        }
                    }, function(error){
                        console.log(error);
                    });
                }
            });
        }

        $scope.home = function () {
            try {
                $interval.cancel(doctorHeartbeat);
                $interval.cancel(getMedicalAppointment);
                $interval.cancel(wifiInterval);
                $interval.cancel(speedTestInterval);

            } catch (error) {
                console.error(error);
            }
            $state.go('pages.doctor');
        }

        var cookie = $cookies.getObject('admdron');
        if ($cookies.get('corpname') == "dronline") {
            var member = JSON.parse($cookies.get('admdron')).activeMember;
            if (member == undefined || member == 0) {
                if($state.current.name !== 'pages.profiles' && $state.current.name !== 'pages.pataccount' 
                && $state.current.name !== 'pages.patient' && $state.current.name !== 'pages.medical-appointment'){
                    $state.go("pages.patient");
                }
            }
        }

        if(JSON.parse($cookies.get('admdron')).parentCorporateInformation != undefined){
            if(JSON.parse($cookies.get('admdron')).corporateInformation.corporateName == "doctorvirtual"){
                //
                let d = new Date();
                d.setFullYear(d.getFullYear() + 10);
                $rootScope.imageSrc = "../img/doctorvirtual.png";
                document.cookie = "logo=../img/doctorvirtual.png;expires="+d+";path=/;domain="+domainBaseJS;
            }else{
                $rootScope.imageSrc = $cookies.get('logo');
            }
        }else if (JSON.parse($cookies.get('admdron')).corporateInformation != undefined){
            if(JSON.parse($cookies.get('admdron')).corporateInformation.corporateName == "doctorvirtual"){
                let d = new Date();
                d.setFullYear(d.getFullYear() + 10);
                $rootScope.imageSrc = "../img/doctorvirtual.png";
                document.cookie = "admdron=" + JSON.stringify(JSON.parse($cookies.get('admdron'))) + ";expires="+d+";path=/;domain="+domainBaseJS;
                document.cookie = "corpname=doctorvirtual;expires="+d+";path=/;domain="+domainBaseJS;
                document.cookie = "logo=../img/doctorvirtual.png;expires="+d+";path=/;domain="+domainBaseJS;
            }
        }
        
        var userName = "";
        if (cookie.firstName != undefined) {
            userName = cookie.firstName.replaceAll('+', ' ');
        }
        if (cookie.lastName != undefined) {
            userName += ' ' + cookie.lastName.replaceAll('+', ' ');
        }
        $rootScope.currentUser = userName;
        $rootScope.currentUserId = cookie.userId;

        $scope.formatDoctorName = function (doctor) {
            return formatService.formatDoctorNameShort(doctor);
        };

        /*Implementation my patients*/
        $scope.listPatients = function () {
            $state.go('pages.patient-doctor');
        };
    })
    .controller('RatingController', function ($scope, $rootScope, $uibModal, $state, $cookies, $rootScope, $translate, $interval, $http, $stateParams, RatingResource, PatientResource, PatProfileResource, AppointmentResource, $rootScope, SubscriptionResource) {
        $scope.nameCorporation = $cookies.get('corpname');
        if ($scope.nameCorporation === 'vivawell') {
            localStorage.setItem('reloadPageAppointment', 'true')
        }
        window.onbeforeunload = null;
        $scope.isReadonly = true;
        $scope.showRating = true;
        $scope.optionSelected = $rootScope.optionId;
        $scope.rating = 5;
        $rootScope.appointment = $stateParams.patMedicalAppointmentId;
        $rootScope.showHeader = 1;
        localStorage.removeItem('user');
        localStorage.removeItem('hasValidCode')
        $scope.admdron = JSON.parse($cookies.get('admdron'));
        $scope.corpCookieName = $cookies.get('corpname');
        $scope.userId = parseInt($scope.admdron.userId);
        if (AppointmentInterval) {
            $interval.cancel(AppointmentTime);
        }
        if (AppointmentTime) {
            $interval.cancel(AppointmentInterval);
        }
        if ($stateParams.profileId) {
            PatientResource.find({
                patientId: $stateParams.profileId
            }, function (data) {
                $scope.email = data.email;
                $scope.hasPhone = (data.phoneNumber);
                $scope.hasEmail = (data.email);
                $scope.phoneNumber = data.phoneNumber;
                $scope.address = data.address;
                $scope.currentPhone = data.phoneNumber;
                $scope.currentEmail = $scope.email;
                $scope.currentAddress = data.address;
            });
        } else {
            $state.go("pages.patient");
        }
        $scope.getAppointmentInformation = function () {
            AppointmentResource.getAppointmentInformation({
                medicalAppointmentId: $rootScope.appointment
            }, function (res) {
                $scope.enableRating = res.showManualCall;
            });
        };
        if($scope.admdron.corporateInformation.attentionPlan == 3){
            $scope.getAppointmentInformation();
        } else if($scope.corpCookieName == "cruzblanca") {
            $scope.getAppointmentInformation();
        } else {
            $scope.enableRating = true;
        }
        var permission = JSON.parse($cookies.get('ng-security-permissions'));
        if (permission != "patient") {
            $("#main").removeClass("medic");
            $interval.cancel(doctorHeartbeat);
        }
        var permission = JSON.parse($cookies.get('ng-security-permissions'));
        if (permission == "patient") {
            $("#main").removeClass("upd-main");
            $("#main").removeClass("medic");
            $("#main").removeClass("medic-video");
            var reqRatingMessage = {
                method: 'GET',
                url: apiURLBaseJS + "dronline-admin-api/api/parameter/findByName?name=" + $cookies.get('corpname').toUpperCase() + "_PLATFORM_NAME",
            };
            $http(reqRatingMessage).then(function successCallback(response) {
                $scope.corpName = translationPrefered.THANKS_FOR_USING.replaceAll('##', response.data.value);
                //$scope.corpName = response.data.value;
            }, function errorCallback(response) {
                errorLog("Error showing rating message");
            });
        } else {
            $scope.corpName = "¡Gracias por utilizar Doctor Online!";
        }

        RatingResource.getRandom(function (data) {
            $scope.aspectCategory = data;
        });

        $scope.sendRating = function () {
            var rating = {
                medicalAppointmentId: $stateParams.patMedicalAppointmentId,
                aspectCategoryId: $scope.aspectCategory.aspectCategoryId,
                rating: $scope.rating,
                comment: $scope.comment
            };
            if ($state.current.name === 'pages.rating') {
                RatingResource.ratePatient(rating);
                $state.go('pages.patient');
            } else {
                RatingResource.rateDoctor(rating);
                $state.go('pages.medical-appointment-doc');
            }
        };

        $scope.cancel = function () {
            if ($state.current.name === 'pages.rating') {
                //$state.go("pages.favorite-doctor", {patMedicalAppointmentId: $stateParams.patMedicalAppointmentId});
                $state.go("pages.update-patient-email", {
                    patMedicalAppointmentId: $stateParams.patMedicalAppointmentId
                });
            } else {
                $state.go('pages.medical-appointment-doc');
            }
        };

        $scope.changeRatingView = function () {
            $scope.showRating = !$scope.showRating;
        }

        $scope.report = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/report-issue.html',
                controller: 'ReportIssueCtrl',
                backdrop: 'static',
                keyboard: false
            });
        };

        $scope.callMe = function () {
            AppointmentResource.findCallbackOrInvitation({
                userId: $scope.userId,
                termsAccepted: !$scope.termsAccepted ? 0 : $scope.termsAccepted
            }, function (res) {
                console.log("findCallbackOrInvitation")
                console.log(res)
                if (!res.isOnCall && !res.hasQueue) {
                    $scope.option = 3;
                    $scope.admdron = JSON.parse($cookies.get('admdron'));
                    $scope.chatProvider = $scope.admdron.chatProviderId;
                    $scope.videoProvider = $scope.admdron.videoProviderId;
                    $scope.phoneProvider = $scope.admdron.phoneProviderId;
                    $scope.appVersion = $scope.admdron.appCorporateVersion;
                    var profileContactInfo = {
                        profileId: $stateParams.profileId,
                        profileEmail: $scope.currentEmail,
                        profilePhone: $scope.currentPhone,
                        profileAddress: $scope.currentAddress
                    }
                    PatProfileResource.updateContactInformation(profileContactInfo, function (response) {
                        $scope.hasPhone = (response.phoneNumber);
                        $scope.hasEmail = (response.email);
                        $scope.currentEmail = response.profileEmail;
                        $scope.currentPhone = response.profilePhone;
                        $scope.currentAddress = response.profileAddress;
                        var reqCHECK = {
                            method: 'POST',
                            url: apiURLBaseJS + "dronline-call-api/sessioncallactive/callme/" + $stateParams.profileId + "/" + $scope.option,
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            data: {
                                chatProviderId: $scope.chatProvider,
                                videoProviderId: $scope.videoProvider,
                                phoneProviderId: $scope.phoneProvider,
                                appCorporateVersion: $scope.appVersion,
                                deviceId: $rootScope.deviceId
                            }
                        };
                        $http(reqCHECK).then(function successCallback(response) {
                            infoLog(response);
                            $state.go('pages.patient');
                        }, function errorCallback(err) {
                            errorLog(err);
                        });
                    });
                } else {
                    swalTitle = translationPrefered.LO_SENTIMOS;
                    swalText = translationPrefered.PATIENT_NEW_REQ;
                    swalType = 'error';
                    swal({
                        title: swalTitle,
                        text: swalText,
                        type: swalType,
                        confirmButtonText: translationPrefered.buttonOK,
                        closeOnConfirm: true
                    }, function () {
                        $scope.showRating = true;
                    });
                    $scope.showRating = true;
                }
            });
        }
    })
    .controller('RatingDocController', function ($scope, $rootScope, $uibModal, $state, $rootScope, $interval, $cookies, $stateParams, DoctorResource, ReportIssueResource, AppointmentDrResource, AppointmentResource, AppointmentInformationResource, DiseaseResource, DiseaseResourceLaboratory, $q, $http, MedicalPrescriptionResource, DoctorSessionResource) {
     
        $scope.medicalRecommendations = [];
        $scope.medicalPrescriptionComponents = [];
        $scope.medicalPresentations = [];
        $scope.medicalDoses = [];
        $scope.medicalTypes = [];
        $scope.medicalPrescription = [
            {}
        ];
        $scope.medicalPrescriptionDisabled = [];
        $scope.medicalMedicaments = [{}];
        $scope.medicalMedicamentsDisabled = [];
        $scope.allRecomendations = {}
        $scope.monodrugsRecomends = []
        $scope.followupHourList = [
            {value:null, name: translationPrefered.HOUR_UNDEFINED}, {value:12, name: translationPrefered.FOLLOWUP_12H},{value:1,name: translationPrefered.FOllOWUP_24H},{value:2,name: translationPrefered.FOllOWUP_48H},{value:3,name: translationPrefered.FOllOWUP_72H},
            {value:7,name: translationPrefered.FOllOWUP_1W},{value:14,name: translationPrefered.FOllOWUP_2W},{value: 31, name: translationPrefered.FOLLOWUP_1M}
        ];

        $scope.staticFieldsConfig = window.localStorage.getItem("staticFieldsConfig") != null? JSON.parse(window.localStorage.getItem("staticFieldsConfig")):null;
        $scope.staticFieldsConfigDysplay2 = window.localStorage.getItem("staticFieldsConfigDisplay2") != null? JSON.parse(window.localStorage.getItem("staticFieldsConfigDisplay2")):null;
        var retrievedData = localStorage.getItem("dataMedicalPrescription");
        var medicalMedicamentsRetrieved = localStorage.getItem("dataMedicalMedicaments");
        $scope.medicalMedicaments = JSON.parse(medicalMedicamentsRetrieved);
        $scope.medicalPrescription = JSON.parse(retrievedData);
        if($scope.medicalPrescription == null){
            $scope.medicalPrescription = [
                
            ];
        }
        $scope.medicalMedicaments = $scope.medicalMedicaments == null ? $scope.medicalMedicaments = [] : $scope.medicalMedicaments;
        $scope.deletePrescriptionDataItem = function(id){
            $scope.medicalPrescription.splice(id, 1);
            data = angular.toJson($scope.medicalPrescription);
            localStorage.setItem("dataMedicalPrescription",  JSON.stringify($scope.medicalPrescription))
        }
        $scope.deleteMedicamentDataItem = function(id){
            $scope.medicalMedicaments.splice(id, 1);
            data = angular.toJson($scope.medicalMedicaments);
            localStorage.setItem("dataMedicalMedicaments",  JSON.stringify($scope.medicalMedicaments))
        }
        $scope.selectedPresentation = function(id) {
            console.log(id,  $scope.medicalPrescription[id])
            let medicineCodeFiltered = $scope.medicalPrescription[id];

            document.getElementById(`presentationType${id}`).value = medicineCodeFiltered.presentation;

            // use $scope.selectedItem.code and $scope.selectedItem.name here
            // for other stuff ...
        }
        $scope.getMedicalPrescriptionData = function(id){
            $scope.successfullyAdded()
            data = angular.toJson($scope.medicalPrescription);
            localStorage.setItem("dataMedicalPrescription",  JSON.stringify($scope.medicalPrescription))
        }

        $scope.addMedicalRecommedation = function (item) {
            /* $scope.medicalPrescriptionDisabled.push(medicineCodeFiltered.medicamentName.description)
            console.log($scope.medicalPrescriptionDisabled) */
            $scope.medicalPrescription.forEach(element => {
                console.log(element.medicamentName.description) 
                $scope.medicalPrescriptionDisabled.push(element.medicamentName.description)
                console.log($scope.medicalPrescriptionDisabled)
             });
             console.log(item)
            $scope.medicalPrescription.push({})
            
        }

        /* MEDICAMENTOS */

        $scope.addMedicalMedicaments = function (item) {
            $scope.medicalMedicaments.forEach(element => {
                let medicamentRecomendated = element.medicamentName.description;
                if(element.quantityActiveIngredient !== undefined){
                    medicamentRecomendated += ", " + element.quantityActiveIngredient + " mg"
                }
                if(element.quantityDoses !== undefined){
                    medicamentRecomendated += ", " + element.quantityDoses
                }
                if(element.presentationType !== undefined){
                    medicamentRecomendated += " " + element.presentationType
                }
                if(element.medicineHours !== undefined){
                    medicamentRecomendated += " " + " cada " + element.medicineHours + " " + translationPrefered.HOUR_SCHEDULED_APPOINTMENT
                }
                if(element.treatementDuration !== undefined){
                    medicamentRecomendated += " " + " por " + element.treatementDuration + " " + translationPrefered.DAY
                }
                $scope.medicalMedicamentsDisabled.push(medicamentRecomendated);
                console.log($scope.medicalMedicamentsDisabled);
            });
            $scope.medicalMedicaments.push({})
        }
        $scope.getMedicalMedicamentsData = function(id){
            $scope.successfullyAddedMedicament()
            data = angular.toJson($scope.medicalMedicaments);
            localStorage.setItem("dataMedicalMedicaments",  JSON.stringify($scope.medicalMedicaments) )
        }
        $scope.successfullyAddedMedicament = function () {
            $.notify({
                title: '<strong>Guardado correctamente</strong><br>',
                message: '',
            }, {
                type: 'success',
                delay: 1000,
                animate: {
                    enter: 'animated fadeInRight',
                    exit: 'animated fadeOutRight',
                },
                placement: {
                    from: 'bottom'
                }
            });
            logInfo($scope.annotation.appointment.patMedicalAppointmentId, "DOCTOR: Guardó información en el resumen de la consulta.");
            console.log($scope.medicalMedicaments);
            data = angular.toJson($scope.medicalMedicaments);
            localStorage.setItem("dataMedicalMedicaments",  JSON.stringify($scope.medicalMedicaments));
        };
        /* FIN MEDICAMENTOS */


        $scope.successfullyAdded = function () {
                $.notify({
                    title: '<strong>Guardado correctamente</strong><br>',
                    message: '',
                }, {
                    type: 'success',
                    delay: 1000,
                    animate: {
                        enter: 'animated fadeInRight',
                        exit: 'animated fadeOutRight',
                    },
                    placement: {
                        from: 'bottom'
                    }
                });
                logInfo($scope.annotation.appointment.patMedicalAppointmentId, "DOCTOR: Guardó información en el resumen de la consulta.");
                data = angular.toJson($scope.medicalPrescription);
                localStorage.setItem("dataMedicalPrescription",  JSON.stringify($scope.medicalPrescription))
        };

        $scope.fillComponents = function (){
            MedicalPrescriptionResource.getComponents(function (res) {
                $scope.medicalRecommendations = res;
/*                 $scope.medicalPrescription.push([])
 */            },  function (err) {
                console.error("Error al actualizar información de consulta");
                console.error(err);
            })

            MedicalPrescriptionResource.findMedicamentPresentation(function(res){
                $scope.medicalPresentations = res;
                console.log($scope.medicalPresentations)
            });
            MedicalPrescriptionResource.findMedicamentDose(function(res){
                $scope.medicalDoses = res;
            })
            MedicalPrescriptionResource.findMedicamentType(function(res){
                $scope.medicalTypes = res;
            })

        }
        $scope.fillComponents();
        $scope.searchMedicamentByName = function (search) {
            if (search !== undefined && search !== "") {
                var deferred = $q.defer();
                MedicalPrescriptionResource.findMedicamentByName({
                    name: search,
                    corporateId: $scope.appointmentInformation[0].appointment.profileId.corporateId.corporateId
                }, function (response) {
                    let superArry = []
                    response.forEach(element => {
                        /* if ($scope.medicalPrescriptionDisabled.indexOf(element.description) !== -1) {
                            console.log("EXISTE", element.description)
                        } */
                        const findSame = superArry.find(medical => medical.monodrug.monodrugID === element.monodrug.monodrugID)
                        if (findSame) {
                            console.log('exist')
                        } else {
                            superArry.push({
                                description: element.description,
                                monodrug: {
                                    monodrugID: element.monodrug.monodrugID,
                                    monodrugName: element.monodrug.monodrugName
                                },
                                presentationID: element.presentationID
                            })
                        }
                    });
                    deferred.resolve(superArry);
                });
                return deferred.promise;
            }
        };
        $scope.changeMedicamentByName = function (medicament) {
            //var monodrugIDSelected = medicament.monodrug.monodrugID;
            var monodrugName = medicament.monodrug.monodrugName;
            var monodrugID = medicament.monodrug.monodrugID;
            MedicalPrescriptionResource.findMedicamentByDescription({
                name: ' ',
                idMonodrogrug: monodrugID
            }, function (response) {
                console.log('response', response);
                $scope.monodrugsRecomends = []
                $scope.monodrugsRecomends = response
                $scope.searchMedicamentByDescription('');
            })
        }

        $scope.searchMedicamentByDescription = function (search) {
            if (search !== undefined && search !== "") {
                var deferred = $q.defer();
                MedicalPrescriptionResource.findMedicamentByMonodrugOrPresentation({
                    description: search,
                    corporateId: $scope.corpoId,
                    type: 'presentation'
                }, function (response) {
                    let superArry = []
                    response.forEach(element => {
                        /* if ($scope.medicalPrescriptionDisabled.indexOf(element.description) !== -1) {
                            console.log("EXISTE", element.description)
                        } */
                        const findSame = superArry.find(medical => medical.monodrug.monodrugID === element.monodrug.monodrugID)
                        if (findSame) {
                            console.log('exist')
                        } else {
                            superArry.push({
                                description: element.description,
                                monodrug: {
                                    monodrugID: element.monodrug.monodrugID,
                                    monodrugName: element.monodrug.monodrugName
                                },
                                presentationID: element.presentationID
                            })
                        }
                    });
                    deferred.resolve(superArry);
                });
                return deferred.promise;
            }
            if (search !== undefined && search !== "") {
                let val = search.toLowerCase();
                return $scope.monodrugsRecomends.filter(item => {
                    let subCorp = item.description;
                    let a = subCorp.toString()
                    if (a) {
                      if (a.toLowerCase().indexOf(val) !== -1) {
                          console.log(a, val)
                        return true;
                      }
                    }
                    return false;
                })
            }
            else if ($scope.monodrugsRecomends) { 
                return $scope.monodrugsRecomends
            } else {
                return []
            };
        };
        $scope.searchMedicamentPresentation = function (search) {
            if (search !== undefined && search !== "") {
                let val = search.toLowerCase();
                console.log($scope.medicalPresentations)
                return $scope.medicalPresentations.filter(item => {
                    let subCorp = item;
                    let a = subCorp.toString()
                    if (a) {
                      if (a.toLowerCase().indexOf(val) !== -1) {
                          console.log(a, val)
                        return true;
                      }
                    }
                    return false;
                })
            }
            else if ($scope.medicalPresentations) { 
                return $scope.medicalPresentations
            } else return [];
        };

        $scope.searchMedicamentType = function (search) {
            if (search !== undefined && search !== "") {
                let val = search.toLowerCase();
                console.log($scope.medicalTypes)
                return $scope.medicalTypes.filter(item => {
                    let subCorp = item;
                    let a = subCorp.toString()
                    if (a) {
                      if (a.toLowerCase().indexOf(val) !== -1) {
                          console.log(a, val)
                        return true;
                      }
                    }
                    return false;
                })
            }
            else if ($scope.medicalTypes) {
                return $scope.medicalTypes
            } else return [];
        };
        $scope.searchMedicamentDoses = function (search) {
            if (search !== undefined && search !== "") {
                let val = search.toLowerCase();
                console.log($scope.medicalDoses)
                return $scope.medicalDoses.filter(item => {
                    let subCorp = item;
                    let a = subCorp.toString()
                    if (a) {
                      if (a.toLowerCase().indexOf(val) !== -1) {
                          console.log(a, val)
                        return true;
                      }
                    }
                    return false;
                })
            }
            else if ($scope.medicalDoses) { 
                return $scope.medicalDoses
            } else return [];
        };
        function findQueue(){
            DoctorResource.getQueue(function(response){
                $scope.queueList = response;
            }, function(error){
                console.log(error);
            });
        }         

        //findQueue();

        $scope.searchLaboratories = function (search, corporateId) {
            
            if (search !== undefined && search !== "") {
                var deferred = $q.defer();
                DiseaseResourceLaboratory.find({
                    name: search,
                    corporateId: $scope.annotation.appointment.profileId.corporateId.corporateId
                }, function (response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
            }
        };



        $scope.searchDiseases = function (search) {
            if (search !== undefined && search !== "") {
                var deferred = $q.defer();
                DiseaseResource.find({
                    corporateId: $scope.annotation.appointment.profileId.corporateId.corporateId,
                    name: search
                }, function (response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
            }
        };

        $scope.labAdditionalInfo = "";
        $scope.addDiagnosticStudyLab = function (item) {
            var existsDiagnosticStudy = false;
            if ($scope.annotation === undefined) {
                $scope.annotation = {};
            }
            if ($scope.annotation.diagnosticStudy === undefined) {
                $scope.annotation.diagnosticStudy = [];
            } else {
                $scope.annotation.diagnosticStudy.forEach(function (value) {
                    
                    let arrValue = value.split(" | ");
                    value = arrValue[0];

                    if(item.hasOwnProperty('laboratoryName') && item.hasOwnProperty('laboratoryDescription') ){
                        if (value.toLowerCase().trim() === (item.laboratoryName.toLowerCase().trim() + " - " + item.laboratoryDescription.toLowerCase().trim())) {
                            existsDiagnosticStudy = true;
                        }
                    } else{
                        if (value.toLowerCase().trim() === item.toLowerCase().trim()) {
                            existsDiagnosticStudy = true;
                        }
                    }
                });
            }
            if (!existsDiagnosticStudy) {

                if( $scope.labAdditionalInfo.length > 0 )
                    $scope.labAdditionalInfo = " | "+$scope.labAdditionalInfo;

                item2 = item.laboratoryName + " - " + item.laboratoryDescription + " " +  $scope.labAdditionalInfo;     

                $scope.annotation.diagnosticStudy.push(item2);
                $scope.saveAllNotes();
                $scope.labAdditionalInfo = "";
            } else {
                $.notify({
                    title: '<strong>'+translationPrefered.ESTUDIO_REGISTRADO+'</strong><br>',
                    message: '',
                }, {
                    type: 'warning',
                    delay: 1000,
                    animate: {
                        enter: 'animated fadeInRight',
                        exit: 'animated fadeOutRight',
                    },
                    placement: {
                        from: 'bottom'
                    }
                });
            }
            
            $("#additionalInfo").hide();
            $scope.newLaboratory = null;
        }

        $scope.addDiagnosticStudy = function (item) {
            if ($scope.annotation.diagnosticStudy === undefined) {
                $scope.annotation.diagnosticStudy = [];
            }
            var existsDiagnosticStudy = false;
            $scope.annotation.diagnosticStudy.forEach(function (value) {
                if (value.toLowerCase().trim() === item.toLowerCase().trim()) {
                    existsDiagnosticStudy = true;
                }
            });
            if (!existsDiagnosticStudy) {
                $scope.annotation.diagnosticStudy.push(item);
                $scope.saveAllNotes();
                $scope.newDiagnosticStudy = null;
            } else {
                $.notify({
                    title: '<strong>'+translationPrefered.ESTUDIO_REGISTRADO+'</strong><br>',
                    message: '',
                }, {
                    type: 'warning',
                    delay: 1000,
                    animate: {
                        enter: 'animated fadeInRight',
                        exit: 'animated fadeOutRight',
                    },
                    placement: {
                        from: 'bottom'
                    }
                });
            }
        }

        $scope.removeDiagnosticStudy = function (item) {
            var index = $scope.annotation.diagnosticStudy.indexOf(item);
            $scope.annotation.diagnosticStudy.splice(index, 1);
            $scope.saveAllNotes();
        }

        $scope.clearFollowup = function() {
            $scope.annotation.followupTime = null;
            $scope.annotation.followup.reason = "";
            $scope.saveAllNotes();
        }

        $scope.addDisease = function (item) {
            if ($scope.annotation === undefined) {
                $scope.annotation = {};
            }
            if ($scope.annotation.diseaseList === undefined) {
                $scope.annotation.diseaseList = [];
            }
            var exists = false;
            $scope.annotation.diseaseList.forEach(function (value) {
                if (value.code === item.code) {
                    exists = true;
                }
            });
            if (exists) {
                $.notify({
                    title: '<strong>'+translationPrefered.DIAGNOSTICO_REGISTRADO+'</strong><br>',
                    message: '',
                }, {
                    type: 'warning',
                    delay: 1000,
                    animate: {
                        enter: 'animated fadeInRight',
                        exit: 'animated fadeOutRight',
                    },
                    placement: {
                        from: 'bottom'
                    }
                });
            } else {
                $scope.annotation.diseaseList.push(item);
                $scope.diseaseList = null;
                $scope.saveAllNotes();
            }
            $scope.newDisease = null;
        }

        $scope.removeDisease = function (item) {
            var index = $scope.annotation.diseaseList.indexOf(item);
            $scope.annotation.diseaseList.splice(index, 1);
            $scope.saveAllNotes();
        }

        $("#main").addClass("medic");
        $rootScope.medicalTypeAttended = 0;
        $scope.isReadonly = true;
        $scope.errorText = "";
        $scope.upStatus = false;
        $scope.downStatus = false;
        $scope.rating = 5;
        $scope.isTest = false;
        $rootScope.appointment = $stateParams.patMedicalAppointmentId;
        $rootScope.showHeader = 4;
        $interval.cancel(AppointmentTime);
        $interval.cancel(AppointmentInterval);
        $scope.current = true;
        $scope.currentIndex;
        $scope.currentAppointment;
        $scope.totalAppointment;
        $scope.appointmentInformation;
        $scope.corporateImg = "";
        $scope.age;
        $scope.maxTime;
        $scope.normalForm = true;
        $scope.withoutCheck = false;
        localStorage.removeItem('user');
        $scope.optionsselectedChat;
        $scope.optionsselectedVideo;
        $scope.language = $cookies.get('language');
        $scope.language = $scope.language.toLowerCase();

        $scope.verOpciones = function () {
            alert($scope.optionsselectedVideo);
            $('.selectpicker').val('');
            $('.selectpicker').selectpicker('refresh');
        }

        $scope.serviceType = 1;
        $scope.errorListChat;
        $scope.errorListVideo;

        DoctorResource.getCommonIssuesList({
            serviceType: 1
        }, function (res) {
            $scope.errorListChat = res;
            $('.selectpicker').selectpicker('refresh');
        });

        DoctorResource.getCommonIssuesList({
            serviceType: 2
        }, function (res) {
            $scope.errorListVideo = res;
            $('.selectpicker').selectpicker('refresh');
        });

        DoctorResource.unprocessedAppointments({
            doctorId: $rootScope.currentUserId
        }, function (data) {
            infoLog("Heartbeat of doctor updated");
            if (data.length > 0) {
                if ($scope.currentIndex == undefined) {
                    $scope.currentIndex = 0;
                }
                $scope.totalAppointment = data.length;
            }

            if (data.length == 0) {
                $state.go('pages.medical-appointment-doc');
                return;
            }
            $scope.appointmentInformation = data;
            showInfo();
            $scope.maxTime = $scope.appointmentInformation[$scope.currentIndex].timeToEnd;
            $scope.remainingTime = $scope.maxTime;
            ratingTimer = $interval(timerF, 1000);
            queueTimer = $interval(findQueue, 5000);
        });

        function timerF() {
            if ($scope.remainingTime != 0) {
                $scope.remainingTime--;
                var date = new Date(null);
                date.setSeconds($scope.remainingTime);
                var timeString = date.toISOString().substr(14, 5);
                $scope.remainingTimeMin = timeString;
            } else if ($scope.current == true) {
                $scope.current = false;
                $scope.send();
            }

        }

        $scope.downClick = function () {
            $scope.downStatus = true;
            if ($scope.downStatus == true) {
                $scope.upStatus = false;
            }
            $('.selectpicker').selectpicker('refresh');
        };

        $scope.upClick = function () {
 
            $scope.upStatus = true;
            if ($scope.upStatus == true) {
                $scope.downStatus = false;
            }
            $('.selectpicker').selectpicker('refresh');
        };

        $scope.testClick = function () {
            $scope.isTest = !$scope.isTest;
        };

        $scope.send = function () {
            DoctorSessionResource.actionHistory({'idAction': docHistory.CLACIFICAR_CONSULTA});
            window.localStorage.removeItem('dataMedicalPrescription');
            if ($scope.downStatus && $scope.errorText !== "") {
                $scope.issue = {
                    appointment: $scope.annotation.appointment.patMedicalAppointmentId,
                    description: $scope.errorText
                };

                ReportIssueResource.save($scope.issue,
                    function () {
                        infoLog("Reportado exitosamente");
                    },
                    function () {
                        warningLog("Error al reportar");
                    });
            }

            $scope.errorText = "";
            if ($scope.remainingTime == 0) {
                $scope.withoutCheck = true;
                if ($scope.currentIndex + 1 !== $scope.totalAppointment) {
                    swal({
                        title: translationPrefered.RATING_TIME_ENDED,
                        timer: 2000
                    });
                }
                $scope.saveAllNotes();
                confirmConsultation(false);
            } else {
                swal({
                    title: translationPrefered.RATING_CONFIRM_DATA,
                    showCancelButton: true,
                    confirmButtonColor: "#26AD6E",
                    confirmButtonText: translationPrefered.ACEPTAR,
                    cancelButtonText: translationPrefered.CANCELAR,
                    closeOnConfirm: true
                }, function (inputValue) {
                    if (inputValue) {
                        confirmConsultation(true);
                    }
                });
            }

            if($scope.isTest || $scope.downStatus){
                $scope.appointmentCalification = false;
            }else {
                $scope.appointmentCalification = true;
            }

            var reqCHECK = {
                method: 'PUT',
                url: apiURLBaseJS + "dronline-patient-api/api/subscription/update-coupon-tdb",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                data: {
                    personId: $scope.appointmentInformation[0].appointment.profileId.admPerson.personId,
                    medicalAppointmentId: $scope.appointmentInformation[0].appointment.patMedicalAppointmentId,
                    isSuccess: $scope.appointmentCalification
                }
            };
            $http(reqCHECK).then(function successCallback(response) {
                console.log(response)
            }, function errorCallback(err) {
                console.log(err)
            });
        };

        $scope.confirmManualCall = function () {
            swal({
                title: translationPrefered.CREATE_MANUAL_CALL,
                text: translationPrefered.ACCEPT_MANUAL_CALL,
                showCancelButton: true,
                confirmButtonColor: "#26AD6E",
                confirmButtonText: translationPrefered.ACEPTAR,
                cancelButtonText: translationPrefered.CANCELAR,
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            }, function (inputValue) {
                if (inputValue) {
                    $scope.manualCallCreated = true;
                    $scope.createManualCall();
                }
            });
        }

        $scope.createManualCall = function () {
            DoctorSessionResource.actionHistory({'idAction': docHistory.GENERAR_LLAMADA_MANUAL});
            AppointmentResource.findCallbackOrInvitation({
                userId: $scope.appointmentInformation[$scope.currentIndex].appointment.profileId.userId.userId,
                termsAccepted: !$scope.termsAccepted ? 0 : $scope.termsAccepted
            }, function (res) {
                console.log("findCallbackOrInvitation")
                console.log(res)
                let swalTitle = '',
                    swalType = '',
                    swalText = '';
                if (!res.hasQueue && !res.isOnCall) {
                    $scope.downStatus = true;
                    $scope.profile = $scope.appointmentInformation[$scope.currentIndex].appointment.profileId.profileId;
                    $scope.speciality = $scope.appointmentInformation[$scope.currentIndex].appointment.docSpecialityId.specialityId;
                    $scope.option = 3;
                    var reqCHECK = {
                        method: 'POST',
                        url: apiURLBaseJS + "dronline-call-api/sessioncallactive/callme/" + $scope.profile + "/" + $scope.option,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    };
                    $http(reqCHECK).then(function successCallback(response) {
                        if (response.data.codigo == 6) {
                            logInfo(response.data.resultado.idMedicalAppointment, "DRONLINE DOCTOR: Se confirmó la creación de la consulta en navegador");
                            swalTitle = translationPrefered.MANUAL_CALL_CREATED;
                            swalText = translationPrefered.ATTENTION_IN_WAITING_SC;
                            swalType = 'success';
                            logWarning($scope.appointmentInformation[$scope.currentIndex].appointment.patMedicalAppointmentId, "DOCTOR: Creó llamada manual.");

                        } else {
                            swalTitle = translationPrefered.LO_SENTIMOS;
                            swalText = translationPrefered.PATIENT_DISABLED;
                            swalType = 'error';
                            logWarning($scope.appointmentInformation[$scope.currentIndex].appointment.patMedicalAppointmentId, "DOCTOR: Solicitó crear llamada manual, pero no tiene consultas disponibles.");
                        }
                        swal({
                            title: swalTitle,
                            type: swalType,
                            text: swalText,
                            confirmButtonColor: "#26AD6E",
                            confirmButtonText: translationPrefered.buttonOK,
                            closeOnConfirm: true,
                            allowEscapeKey: false,
                            allowEnterKey: false
                        }, function () {
                            confirmConsultation(true);
                        });
                    }, function errorCallback(response) {
                        errorLog("Error creating check call status.");
                    });
                } else {
                    logWarning($scope.appointmentInformation[$scope.currentIndex].appointment.patMedicalAppointmentId, "DOCTOR: Solicitó crear llamada manual pero ya existia una consulta para la cuenta.");
                    swalTitle = translationPrefered.LO_SENTIMOS;
                    swalText = translationPrefered.PATIENT_NEW_REQ;
                    swalType = 'error';
                    swal({
                        title: swalTitle,
                        text: swalText,
                        type: swalType,
                        confirmButtonColor: "#26AD6E",
                        confirmButtonText: translationPrefered.buttonOK,
                        closeOnConfirm: true
                    });
                }
            });
        };

        $scope.report = function () {
            $rootScope.appointment = $scope.annotation.appointment.patMedicalAppointmentId;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/report-issue.html',
                controller: 'ReportIssueCtrl',
                backdrop: 'static',
                keyboard: false
            });
        };
        $scope.saveMedicalPrescription = function() {
            let stringAppointmentId =  $scope.annotation.appointment.patMedicalAppointmentId.toString();
            let finalData = {
                appointmentID: stringAppointmentId,
                medicineList: [],
                amountList: [],
            } 
                $scope.medicalPrescription.forEach(element => {   
                    let quantityDoses = element?.quantityDoses;
/*                     let quantityActiveIngredient = element?.quantityActiveIngredient;
 */                    if(quantityDoses){
                        let amount = quantityDoses;
                        let medicineId =  element.medicamentName.presentationID.toString()
                        finalData.medicineList.push(medicineId)
                        finalData.amountList.push(amount)
                    }
                });
            MedicalPrescriptionResource.sendPrescription(finalData, function (response) {
                
/*                 localStorage.setItem("dataMedicalPrescription",  JSON.stringify($scope.medicalPrescription) )
 */
                //console.log(response)
                if (response.code == 200) {
                    try {
                        $scope.showChangeNotification();
                    } catch (error) {
                        errorLog(error);
                    }
                } else {
                    $scope.showErrorCreatePrescription();
                }
            }, function (err) {
                console.error("Error al actualizar información de consulta");
                console.error(err);
            });
        };

        $scope.showErrorCreatePrescription = function () {
            $.notify({
                title: '<strong>'+'Ocurrió un inconveniente al crear la receta'+'</strong><br>',
                message: '',
            }, {
                type: 'danger',
                delay: 5500,
                animate: {
                    enter: 'animated fadeInRight',
                    exit: 'animated fadeOutRight',
                },
                placement: {
                    from: 'top'
                }
            });
        }

        function confirmConsultation(isChecked) {
            if (isChecked) {
                $scope.issues;
                if ($scope.annotation.appointment.serviceTypeId == 1) {
                    if (typeof $scope.optionsselectedChat != 'undefined' && $scope.optionsselectedChat != "") {
                        $scope.issues = $scope.optionsselectedChat;
                        $scope.issues = JSON.parse("[" + $scope.issues + "]");
                    }
                } else {
                    if (typeof $scope.optionsselectedVideo != 'undefined' && $scope.optionsselectedVideo != "") {
                        $scope.issues = $scope.optionsselectedVideo;
                        $scope.issues = JSON.parse("[" + $scope.issues + "]");
                    }
                }

                $scope.annotation.previous = ($scope.annotation.previous) ? 1 : 0;
                $scope.annotation.success = $scope.upStatus;
                $scope.annotation.isTest = $scope.isTest;
                $scope.annotation.commonIssues = $scope.issues;

                DoctorResource.confirmInformation($scope.annotation, function (res) {
                    $scope.remainingTime = 0;
                    $scope.current = false;
                    if ($scope.currentIndex + 1 === $scope.totalAppointment) {
                        $('#corporateStyle').attr('href', '');
                        if ($scope.withoutCheck) {
                            $state.go('pages.doctor');
                        } else {
                            $interval.cancel(ratingTimer);
                            $interval.cancel(queueTimer);
                            $state.go('pages.medical-appointment-doc');
                        }
                        // appointmentInformation[currentIndex].appointment.profileId.corporateName
                        if($scope.medicalPrescription.length && $scope.appointmentInformation[0].appointment.profileId.corporateId.enableMonodrug == 1){
                            $scope.saveMedicalPrescription();
                        }
                    } else {
                        nextPatient();
                    }
                });
                if($scope.staticFieldsConfigDysplay2.MEDICAMENTOS.isVisible && $scope.medicalMedicaments.length){
                    $scope.saveMedicalMedicaments();
                }
            } else {
                if ($scope.currentIndex + 1 === $scope.totalAppointment) {
                    $('#corporateStyle').attr('href', '');
                    if ($scope.withoutCheck) {
                        $state.go('pages.doctor');
                    } else {
                        $state.go('pages.medical-appointment-doc');
                    }
                } else {
                    nextPatient();
                }
            }
            $('.selectpicker').val('');
            $('.selectpicker').selectpicker('refresh');
        }

        $scope.saveMedicalMedicaments = function() {
            let stringAppointmentId =  $scope.annotation.appointment.patMedicalAppointmentId;
            $scope.medicalMedicaments;
            $scope.medicalMedicamentsDisabled = [];
            $scope.medicalMedicaments.forEach(element => {
                let medicamentRecomendated =  element.medicamentName.description;
                if(element.quantityActiveIngredient !== undefined){
                    medicamentRecomendated += ", " + element.quantityActiveIngredient + " mg"
                }
                if(element.quantityDoses !== undefined){
                    medicamentRecomendated += ", " + element.quantityDoses
                }
                if(element.presentationType !== undefined){
                    medicamentRecomendated += " " + element.presentationType
                }
                if(element.medicineHours !== undefined){
                    medicamentRecomendated += " " + " cada " + element.medicineHours + " " + translationPrefered.HOUR_SCHEDULED_APPOINTMENT
                }
                if(element.treatementDuration !== undefined){
                    medicamentRecomendated += " " + " por " + element.treatementDuration + " " + translationPrefered.DAY
                }
                $scope.medicalMedicamentsDisabled.push(medicamentRecomendated);
            });
            let finalData = {
                appointmentId: stringAppointmentId,
                medicalMedicaments: $scope.medicalMedicamentsDisabled
            }
            MedicalPrescriptionResource.sendMedicaments(finalData, function (response){
                if(response.code == 200){
                    logInfo(response.data.resultado.idMedicalAppointment, "DRONLINE DOCTOR: Se guardaron los medicamentos");
                }else{
                    logInfo(response.data.resultado.idMedicalAppointment, "DRONLINE DOCTOR: Error al guardar los medicamenteos");
                }
            })
            $scope.medicalMedicaments = [{}];
            localStorage.setItem("dataMedicalMedicaments",  JSON.stringify($scope.medicalMedicaments) );
            //localStorage.removeItem('dataMedicalMedicaments');
        }

        function nextPatient() {
            $scope.currentIndex++;
            showInfo();
        }

        $scope.continueAppointments = function(){
            $interval.cancel(ratingTimer);
            $interval.cancel(queueTimer);
            $state.go('pages.medical-appointment-doc');
        }

        $scope.saveAllNotes = function () {
            if ($scope.annotation !== undefined) {
                $scope.annotation.appointmentId = $scope.annotation.appointment.patMedicalAppointmentId;
                $scope.annotation.previous = ($scope.annotation.previous) ? 1 : 0;
                AppointmentInformationResource.update($scope.annotation, function (response) {
                    infoLog('Guardado exitosamente!');
                }, function (err) {
                    errorLog("Error al actualizar información de consulta");
                    errorLog(err);
                });
            }
        }

        function showInfo() {
            $scope.drugstoreList = [];
            AppointmentDrResource.findCorporateDrugstore({
                id: $scope.appointmentInformation[$scope.currentIndex].appointment.profileId.corporateId.corporateId
            }, function (response) {
                $scope.drugstoreList = response;
                $scope.annotation = $scope.appointmentInformation[$scope.currentIndex];
                $scope.hasPhone = ($scope.appointmentInformation[$scope.currentIndex].appointment.profileId.admPerson.mobilePhone != undefined);
                $scope.manualCallCreated = ($scope.appointmentInformation[$scope.currentIndex].appointment.serviceTypeId == 3);
                $scope.normalForm = ($scope.annotation.appointment.profileId.corporateId.corporateName == "dradisa") ? false : true;
                var birthday = new Date($scope.annotation.appointment.profileId.admPerson.birthday);
                var age = calculateAge(birthday.getMonth(), birthday.getDay(), birthday.getFullYear());
                $scope.annotation.previous = ($scope.annotation.previous == 1) ? true : false;
                $scope.cssUrl = "../css/brands/" + $scope.annotation.appointment.profileId.corporateName.toLowerCase() + '/doctor_appointment.css';
                $('#corporateStyle').attr('href', $scope.cssUrl);
                $scope.corporateImg = '../img/' + $scope.annotation.appointment.profileId.corporateName + '.png';
                $scope.age = (!isNaN(age)) ? age : "-";
                $scope.isTest = false;
                $scope.upStatus = false;
                $scope.downStatus = false;
                $scope.remainingTime = $scope.maxTime;
                $scope.current = true;
                if ($scope.annotation.confirmName === "") {
                    $scope.confirmName = $scope.annotation.appointment.profileId.admPerson.firstName + " " +
                        $scope.annotation.appointment.profileId.admPerson.lastName;
                }
                $scope.patientHistoryURL = URLBase + webSiteName + "private/index.php#/pages/pat-appointments/" + $scope.annotation.appointment.profileId.profileId + '/0';
            });


        }

        $scope.myHtmlTooltipCallToAction = translationPrefered.TOOLTIP_CALL_TO_ACTION
        const cardCallToAction = document.getElementById("tooltipCallToAction");
        const tooltipContent = document.getElementById("tooltipContentText");
        if(cardCallToAction){
            cardCallToAction.addEventListener("mouseover", () => {
                if ($scope.annotation.appointment.profileId.corporateName == 'vivawell') tooltipContent.className = "tooltip-custom tooltip-custom-show";
            }, false)
            cardCallToAction.addEventListener("mouseout", () => {
                if ($scope.annotation.appointment.profileId.corporateName == 'vivawell') tooltipContent.className = "tooltip-custom";
            }, false)
        }

        function calculateAge(birthMonth, birthDay, birthYear) {
            var todayDate = new Date();
            var todayYear = todayDate.getFullYear();
            var todayMonth = todayDate.getMonth();
            var todayDay = todayDate.getDate();
            var age = todayYear - birthYear;

            if (todayMonth < birthMonth - 1) {
                age--;
            }

            if (birthMonth - 1 == todayMonth && todayDay < birthDay) {
                age--;
            }
            return age;
        }
    })
    .controller('UpdateEmailPatientController', function ($scope, $stateParams, $state, UpdatePatientEmailResource) {
        $scope.render = false;
        $scope.showLoading = false;
        $scope.userEmail = {
            email: ''
        };
        $scope.userEmailBean = {};
        if (!$stateParams.patMedicalAppointmentId) {
            $state.go("pages.patient");
            return;
        }

        UpdatePatientEmailResource.requestUpdateEmail(function (data) {
            if (data.has_email == "true") {
                $state.go("pages.patient");
                return;
            } else {
                $scope.userEmailBean = data;
                $scope.render = true;
            }
        });

        $scope.updatePatientEmail = function () {
            if ($scope.userEmail.email == "") {
                swal(translationPrefered.ERROR_TITLE, translationPrefered.MENS_ERROR, "error");
            } else {
                $scope.showLoading = true;
                $scope.render = false;
                $scope.userEmailBean.email = $scope.userEmail.email;
                $scope.userEmailBean.has_email = $stateParams.patMedicalAppointmentId;

                UpdatePatientEmailResource.responseUpdateEmail($scope.userEmailBean, function () {
                    $scope.render = true;
                    $scope.showLoading = false;
                    swal(translationPrefered.OPER, translationPrefered.MENS_SUCC, "success");
                    $state.go("pages.patient");
                });
            }
        };

        $scope.cancel = function () {
            $state.go("pages.patient");
        };
    })
    .controller('updatePhoneController', function ($scope, $stateParams, $state, $rootScope, PatientResource, PatProfileResource) {
        $rootScope.showHeader = 1;
        $("#main").removeClass("medic");
        $scope.hasPhone = false;
        $scope.hasEmail = false;
        $scope.patProfileId = $stateParams.profileId;
        PatientResource.find({
            patientId: $scope.patProfileId
        }, function (data) {
            $scope.email = data.email;
            $scope.hasPhone = (data.phoneNumber);
            $scope.hasEmail = (data.email);
            $scope.phoneNumber = data.phoneNumber;
            $scope.address = data.address;
            $scope.currentPhone = data.phoneNumber;
            $scope.currentEmail = $scope.email;
            $scope.currentAddress = $scope.address;
            $scope.render = true;
        });

        $scope.savePhone = function () {
            var profileContactInfo = {
                profileId: $scope.patProfileId,
                profileEmail: $scope.currentEmail,
                profilePhone: $scope.currentPhone,
                profileAddress: $scope.currentAddress,
                enableNotification: true
            }
            PatProfileResource.updateContactInformation(profileContactInfo, function (response) {
                $scope.hasPhone = (response.phoneNumber);
                $scope.hasEmail = (response.email);
                $scope.currentEmail = response.profileEmail;
                $scope.currentPhone = response.profilePhone;
                $scope.currentAddress = response.profileAddress;
                swal(translationPrefered.OPER, translationPrefered.MENS_SUCC, "success");
                $state.go("pages.patient");
            });
        };

        $scope.cancel = function () {
            $state.go("pages.patient");
        };
    })
    .controller('MyDoctorController', function ($scope, $stateParams, $state,
        formatService, DoctorResource) {
        DoctorResource.find({
            doctorId: $stateParams.doctorId
        }, function (data) {
            $scope.doctor = data;
            $scope.doctorName = formatService.formatDoctorNameShort(data);
        });
    })
    .controller('DoctorProfileController', function ($scope, $stateParams, $cookies,
        formatService, DoctorResource, $rootScope) {
        $scope.corpName = $cookies.get('corpname');
        $rootScope.showHeader = 2;

        DoctorResource.find({
            doctorId: $stateParams.doctorId
        }, function (data) {
            $scope.doctor = data;
            $scope.doctorName = formatService.formatDoctorNameShort(data);
            $scope.doctorPhotoURL = (data.doctorFiles.photoURL !== undefined) ? data.doctorFiles.photoURL : "images/default.jpg";
        });
    })
    .controller('CalendarCtrl', async function ($scope, $rootScope, $interval, ScheduleResource, $state, PatProfileResource, $cookies, AppointmentResource) {
        $scope.userId = parseInt($scope.admdron.userId);
        $scope.termsAccepted = 0;
        /*var findQueueFunction = function (){
            AppointmentResource.findCallbackOrInvitation({
                userId: $scope.userId,
                termsAccepted: !$scope.termsAccepted ? 0 : $scope.termsAccepted
            }, function (res) {
                $scope.numberAppointments = res.numberAppointments;
                $rootScope.numberAppointments = res.numberAppointments;
                if(window.location.hash == '#/pages/speciality/1' && $scope.numberAppointments == 0  && ($cookies.get('corpname') == "dronlinetdb" || $cookies.get('corpname') == "viya" || $cookies.get('corpname') == "viyasv" || $cookies.get('corpname') == "viyani" || $cookies.get('corpname') == "viyahn" || $cookies.get('corpname') == "viyado") || window.location.hash == '#/pages/speciality/2' && $scope.numberAppointments == 0 && ($cookies.get('corpname') == "dronlinetdb" || $cookies.get('corpname') == "viya" || $cookies.get('corpname') == "viyasv" || $cookies.get('corpname') == "viyani" || $cookies.get('corpname') == "viyado" || $cookies.get('corpname') == "viyahn")){
                    $state.go('pages.patient');
                }
                $scope.finishedFindingQueue = true;
                $scope.queueInformation = res;

                if(JSON.parse($cookies.get('admdron')).corporateInformation.attentionPlan == 4 && $state.current.name != 'pages.enter-code' && $scope.termsAccepted != 1 &&
                    $scope.queueInformation.scheduled.first === undefined){
                    $state.go("pages.calendar");
                }else{
                    $state.go("pages.patient");
                }
                if (window.location.origin == 'https://app-latam-qa.doctor-online.co' || window.location.host == 'localhost') {
                    if($scope.queueInformation.scheduled.indications){
                        $scope.queueInformation.scheduled.indications = $scope.queueInformation.scheduled.indications.replace("https://doctor-directory.doctor-online.co", 'https://doctor-directory-qa.doctor-online.co')
                    }
                }
                if($scope.queueInformation.scheduled !== undefined && $scope.queueInformation.scheduled.first !== undefined){
                    if($scope.queueInformation.scheduled.first.disableOnDemand){
                        $rootScope.showChangeAttendance = false;
                        $rootScope.corpAttentionType = 2;
                    } else {
                        $rootScope.showChangeAttendance = true;
                    }
                    $scope.getDoctorPhoto($scope.queueInformation.scheduled.first.doctorId);
                } else if($scope.queueInformation.followup !== undefined && $scope.queueInformation.followup.first !== undefined){
                    $rootScope.showChangeAttendance = false;
                    $rootScope.corpAttentionType = 1;
                }
                else {
                    $rootScope.showChangeAttendance = true;
                }
                if($cookies.get('corpname') == "cruzblanca"){
                    $scope.remainingAppointments = res.remainingAppointments;
                    $scope.countText = res.remainingAppointments;
                    $scope.disableAppointment = ($scope.remainingAppointments == 0);
                }
                $scope.hasInvitation = res.hasInvitation;
                $scope.hasQueue = res.hasQueue;

                if( $scope.termsAccepted == 1 && $scope.showChangeAttendance
                    && ( $scope.admdron.parentCorporateInformation.corporateName == "vivawell"
                        || $scope.admdron.parentCorporateInformation.corporateName == "drnn" )  ) {
                    document.location.reload(true)
                }

                if (res.hasQueue == false && res.hasInvitation == false) {
                    $scope.isOnCall = res.isOnCall;
                    if($scope.isOnCall){
                        $rootScope.showChangeAttendance = false;
                    }
                    if ($state.current.name == "pages.speciality" && $scope.isOnCall) {
                        $state.go("pages.patient");
                    }
                    return;
                }

                if ($scope.hasQueue == true) {
                    $rootScope.showChangeAttendance = false;
                    if ($scope.queueInformation.queueInformation.timeEstimated == 0) {
                        if ($scope.queueInformation.appointment.serviceTypeId != 3) {
                            if (($rootScope.corpAttentionType === 2 && $scope.termsAccepted) || $rootScope.corpAttentionType === 1) {
                                $('#successModal').modal('hide');
                                $interval.cancel($scope.findHasQueue);
                                $timeout($scope.redireccionar, 500);

                            }
                        }
                    }
                }
                if ($scope.hasInvitation == true) {
                    $rootScope.showChangeAttendance = false;
                    $rootScope.profId = res.invitation.patProfile.profileId;
                    $rootScope.specialityId = res.invitation.specialityId.specialityId;
                    $rootScope.optionId = res.invitation.serviceTypeId;
                    $rootScope.extraURLSessionCallActive = "/" + res.invitation.patMedicalAppointmentInvitationId;
                    $scope.isOnCall = false;
                    $scope.hasQueue = false;
                } else {
                    $rootScope.extraURLSessionCallActive = "";
                }

            });
        }
        $scope.findHasQueue = $interval(findQueueFunction, 5000);*/

        var calendarEl = document.getElementById('calendar');
        var calendar;
        moment.locale('es');
        $scope.dataAppointmets = [];
        $scope.patientSelected = '0'
        $scope.dataEvent = '';
        $scope.notesSchedule = '';
        $scope.profiles = [];
        $scope.typeServiceSelected = '0'
        $scope.loadingAppointment = false;
        const idProfile = JSON.parse($cookies.get('admdron')).userId;
        var date = new Date();
        const differenceUTCToLocale = -date.getTimezoneOffset()/60;
        const currentDate = {profileId: idProfile, scheduleDate: moment(date).format('YYYY-MM-DDT00:00.000'), scheduleDateTime: date.getTime(), app: 'OTHERS', differenceHours: differenceUTCToLocale}

        $scope.getEventsCalendar = function (date) {
            return new Promise((resolve, reject) => {
                ScheduleResource.getAppointmentListDoctor(date, function (responseList) {
                    $scope.dataAppointmets = [];
                    if (responseList.length > 0) {
                        responseList.forEach((appointment, i) => {
                            const lblDate = new Date();
                            const dateInit = appointment.startDate.split('T');
                            const timeCalendar = dateInit[1].split(':');
                            const dateFinal = appointment.endDate.split('T');
                            const requestDate = date.scheduleDate.split('T')[0];
                            const myDate = moment(lblDate.getFullYear()+moment().format('MM')+lblDate.getDate()+' '+lblDate.getHours()+':'+lblDate.getMinutes(), "YYYYMMDD HH:mm");
                            const dateCalendar = moment(requestDate.split('-')[0]+requestDate.split('-')[1]+requestDate.split('-')[2]+' '+timeCalendar[0]+':'+timeCalendar[1], "YYYYMMDD HH:mm");
                            const differenceDays = dateCalendar.diff(myDate, 'days');
                            const differenceMinutes = dateCalendar.diff(myDate, 'minutes');
                            if (differenceDays > 0) {
                                $scope.dataAppointmets.push({
                                    title: appointment.title,
                                    start: dateInit[0]+'T'+dateInit[1].split(':')[0]+':'+dateInit[1].split(':')[1],
                                    end: dateFinal[0]+'T'+dateFinal[1].split(':')[0]+':'+dateFinal[1].split(':')[1],
                                    backgroundColor: appointment.backgroundColor,
                                    borderColor: appointment.borderColor,
                                    idAppointment: appointment.medicalSchedulerId > 0 ? appointment.medicalSchedulerId : 0,
                                    idPatient: appointment.profileId,
                                    idDoctor: appointment.doctorId,
                                    available: appointment.available
                                })
                            } else {
                                if (appointment.available && differenceMinutes < 20) {
                                    $scope.dataAppointmets.push({
                                        title: translationPrefered.HOUR_NOT_AVAILABLE,
                                        start: dateInit[0]+'T'+dateInit[1].split(':')[0]+':'+dateInit[1].split(':')[1],
                                        end: dateFinal[0]+'T'+dateFinal[1].split(':')[0]+':'+dateFinal[1].split(':')[1],
                                        backgroundColor: '#79B178',
                                        borderColor: '#79B178',
                                        idAppointment: appointment.medicalSchedulerId > 0 ? appointment.medicalSchedulerId : 0,
                                        idPatient: appointment.profileId,
                                        idDoctor: appointment.doctorId,
                                        available: appointment.available
                                    })
                                } else {
                                    $scope.dataAppointmets.push({
                                        title: appointment.title,
                                        start: dateInit[0]+'T'+dateInit[1].split(':')[0]+':'+dateInit[1].split(':')[1],
                                        end: dateFinal[0]+'T'+dateFinal[1].split(':')[0]+':'+dateFinal[1].split(':')[1],
                                        backgroundColor: appointment.backgroundColor,
                                        borderColor: appointment.borderColor,
                                        idAppointment: appointment.medicalSchedulerId > 0 ? appointment.medicalSchedulerId : 0,
                                        idPatient: appointment.profileId,
                                        idDoctor: appointment.doctorId,
                                        available: appointment.available
                                    })
                                }
                            }
                            
                        });
                        resolve(date)
                        /* ScheduleResource.getAppointmentList(date, function (dayList) {
                            if (dayList.length > 0) {
                                dayList.forEach(day => {
                                    const dateInit = day.startDateSchedulerAppointment.split('T');
                                    let dateFinal = parseInt(dateInit[1].split(':')[1])+30
                                    const hourFinal = dateFinal === 60 ? parseInt(dateInit[1].split(':')[0])+1 : dateInit[1].split(':')[0];
                                    dateFinal = dateFinal === 60 ? '00' : dateFinal;
                                    $scope.dataAppointmets.push({
                                        title: day.patientName,
                                        start: dateInit[0]+'T'+dateInit[1].split(':')[0]+':'+dateInit[1].split(':')[1],
                                        end: dateInit[0]+'T'+hourFinal.toString()+':'+dateFinal.toString(),
                                        backgroundColor: '#fab1b0',
                                        borderColor: '#ff0000',
                                        idAppointment: day.appointmentSchedulerId,
                                        idPatient: day.profileId,
                                        idDoctor: day.doctorId,
                                        available: false,
                                    })
                                })
                                resolve(date);
                            } else {
                                resolve(date);
                            }
                        }, error => {
                            resolve(date)
                        }); */
                        //resolve(date);
                    } else {
                        $scope.dataAppointmets = [];
                        resolve(date);
                    }
                });
            })
        }

        $scope.setEventsCalendar = function (date) {
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'timeGridDay',
                initialDate: date,
                customButtons: {
                    myCustomButtonNext: {
                        text: '>',
                        click: function() {
                            $scope.nextDay();
                        }
                    },
                    myCustomButtonPrev: {
                        text: '<',
                        click: function() {
                            $scope.prevDay();
                        }
                    },
                    myCustomButtonToday: {
                        text: translationPrefered.TODAY,
                        click: function() {
                            $scope.toDay();
                        }
                    }
                },
                eventMinHeight: 8,
                headerToolbar: {
                    left: 'myCustomButtonPrev,myCustomButtonNext myCustomButtonToday',
                    center: 'title',
                    right: ''
                },
                titleFormat:{
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                },
                locale: 'es',
                nowIndicator: true,
                eventClick: function(date) {
                    if(($scope.admdron.parentCorporateInformation.corporateName =='dronlinetdb' || $scope.admdron.parentCorporateInformation.corporateName =='viya' || $scope.admdron.parentCorporateInformation.corporateName =='viyasv' || $scope.admdron.parentCorporateInformation.corporateName =='viyani' || $scope.admdron.parentCorporateInformation.corporateName =='viyahn' || $scope.admdron.parentCorporateInformation.corporateName =='viyado') &&  $scope.numberAppointments == 0){
                        $state.go('pages.enter-code', {
                            optionId: 3
                        });
                    }else{
                        const dateEvent = moment(date.event.start);
                        const myDate = moment(new Date());
                        const diff =  dateEvent.diff(myDate, 'minutes')
                        $scope.loadingAppointment = false;
                        if (date.event.extendedProps.idPatient === idProfile || date.event.extendedProps.idPatient === 0) {
                            if (diff > 19) {
                                if (date.event.extendedProps.available) {
                                    $scope.dataEvent = date;
                                    $('#dateSelected').val(moment(date.event.start).format('LL'))
                                    $('#timeSelected').val(moment(date.event.start).format('H:mm') + ' - ' + moment(date.event.end).format('H:mm'))
                                    $('#calendar-modal').modal('show');
                                } else if (!date.event.extendedProps.available && date.event.extendedProps.idAppointment) {
                                    ScheduleResource.find({idAppointment: date.event.extendedProps.idAppointment}, function(res){
                                        $('#patientRegistered').val(res.patientName)
                                        $('#dateRegistered').val(moment(date.event.start).format('LL'))
                                        $('#timeRegistered').val(moment(date.event.start).format('H:mm') + ' - ' + moment(date.event.end).format('H:mm'))
                                        $('#notesRegistered').val(res.note)
                                        $('#calendar-modal-detail').modal('show')
                                    });
                                } else {
                                    showSwal("error", translationPrefered.LO_SENTIMOS, translationPrefered.HOUR_NOT_AVAILABLE_SCHEDULLER);
                                }
                            } else if (!date.event.extendedProps.available && date.event.extendedProps.idAppointment) {
                                ScheduleResource.find({idAppointment: date.event.extendedProps.idAppointment}, function(res){
                                    $('#patientRegistered').val(res.patientName)
                                    $('#dateRegistered').val(moment(date.event.start).format('LL'))
                                    $('#timeRegistered').val(moment(date.event.start).format('H:mm') + ' - ' + moment(date.event.end).format('H:mm'))
                                    $('#notesRegistered').val(res.note)
                                    $('#calendar-modal-detail').modal('show')
                                });
                            } else {
                                showSwal("error", translationPrefered.LO_SENTIMOS, translationPrefered.HOUR_NOT_AVAILABLE_SCHEDULLER);
                            }
                        }
                    }
                },
                dateClick : function (date) {
                    console.log('')
                },
                events: $scope.dataAppointmets,
            });
            
            let timeslots = $scope.dataAppointmets.length;
            //define height of calendar

            if( timeslots >= 720 ) {
                $("#calendar").addClass("max-size");
            }else  if( timeslots == 144 ) {
                $("#calendar").addClass("ten");
            } else if( timeslots > 144 ) {
                $("#calendar").addClass("more-than-ten");
            }
            else 
            {
                $("#calendar").addClass("normal-fix");
            }
            calendar.render();
        }

        const data = $scope.getEventsCalendar(currentDate);
        await data.then(({scheduleDate}) => {
            $scope.setEventsCalendar(scheduleDate.split('T')[0]);
        })

        PatProfileResource.findAll(function (data) {
            $scope.profiles = data;
        });
        
        $scope.nextDay = async function () {
            calendar.next();
            const date = {profileId: idProfile, scheduleDate: moment(calendar.getDate()).format('YYYY-MM-DDT00:00.000'), scheduleDateTime: calendar.getDate().getTime(), app: 'OTHERS', differenceHours: differenceUTCToLocale}
            const data = $scope.getEventsCalendar(date)
            await data.then(({scheduleDate}) => {
                calendar.destroy();
                $scope.setEventsCalendar(scheduleDate.split('T')[0]);
            })
        }

        $scope.prevDay = async function () {
            calendar.prev();
            const myDate = moment(new Date()).format('YYYY-MM-DD');
            const dateCalendar = moment(calendar.getDate()).format('YYYY-MM-DD');
            const diff = moment(dateCalendar).diff(myDate, 'days');
            if (diff >= 0) {
                const date = {profileId: idProfile, scheduleDate: moment(calendar.getDate()).format('YYYY-MM-DDT00:00.000'), scheduleDateTime: calendar.getDate().getTime(), app: 'OTHERS', differenceHours: differenceUTCToLocale}
                const data = $scope.getEventsCalendar(date)
                await data.then(({scheduleDate}) => {
                    calendar.destroy();
                    $scope.setEventsCalendar(scheduleDate.split('T')[0]);
                })
            } else calendar.next();
            
        }

        $scope.toDay = async function () {
            calendar.today();
            const date = {profileId: idProfile, scheduleDate: moment(calendar.getDate()).format('YYYY-MM-DDT00:00.000'), scheduleDateTime: calendar.getDate().getTime(), app: 'OTHERS', differenceHours: differenceUTCToLocale}
            const data = $scope.getEventsCalendar(date)
            await data.then(({scheduleDate}) => {
                calendar.destroy();
                $scope.setEventsCalendar(scheduleDate.split('T')[0]);
            })
        }

        $scope.programar = function () {
            if ($scope.patientSelected !== '0' && $scope.typeServiceSelected !== '0') {
                $scope.loadingAppointment = true;
                const date = $scope.dataEvent.event.startStr;
                const schedule = {
                    profileId: parseInt($scope.patientSelected),
                    doctorId: $scope.dataEvent.event.extendedProps.idDoctor,
                    notes: $scope.notesSchedule,
                    startDateSchedulerAppointment: date.split('T')[0] + 'T' + date.split('T')[1].split(':')[0] + ':' + date.split('T')[1].split(':')[1] + '.000Z',
                    schedulerAppointmentTime: new Date($scope.dataEvent.event.start).getTime(),
                    serviceTypeId : parseInt($scope.typeServiceSelected),
                    app: 'OTHERS',
                    differenceHours: differenceUTCToLocale 
                }
        
                ScheduleResource.save(schedule, async function (responseSchedule) {
                    if (responseSchedule.code === '0') {
                        $scope.clearModal();
                        const date = {profileId: idProfile, scheduleDate: moment(calendar.getDate()).format('YYYY-MM-DDT00:00.000'), scheduleDateTime: calendar.getDate().getTime(), app: 'OTHERS', differenceHours: differenceUTCToLocale}
                        const data = $scope.getEventsCalendar(date)
                        $scope.loadingAppointment = false;
                        await data.then(({scheduleDate}) => {
                            calendar.destroy();
                            $scope.setEventsCalendar(scheduleDate.split('T')[0]);
                        })
                        $('#calendar-modal').modal('hide');
                        showSwal("success", translationPrefered.SCHEDULLER_SUCCESS,  '');
                    } else {
                        $scope.loadingAppointment = false;
                        $('#calendar-modal').modal('hide');
                    }
                }, (error) => {
                    $scope.loadingAppointment = false;
                    $scope.clearModal()
                    $('#calendar-modal').modal('hide');
                    showSwal("error", translationPrefered.LO_SENTIMOS, 'Ocurrio un inconveniente al programar la cita');
                });
            } else if ($scope.patientSelected === '0') {
                $scope.clearModal()
                showSwal("error", translationPrefered.LO_SENTIMOS, 'Debes seleccionar un paciente');
            } else if ($scope.typeServiceSelected === '0') {
                $scope.clearModal()
                showSwal("error", translationPrefered.LO_SENTIMOS, 'Debes seleccionar el tipo de consulta que quieres agendar');
            }
            setTimeout(() => {
                $scope.loadingAppointment = false;
            }, 1500);
        }

        $scope.clearModal = function () {
            $scope.patientSelected = '0';
            $scope.notesSchedule = '';
            $scope.typeServiceSelected = '0'
        }


    })
    .controller('PharmacyCtrl', function ($scope, $cookies, $sce, ConfigurationCorporate) {
        $scope.urlPharmacy = '';
        const heightIframe = (window.innerHeight-78);
        const corporateColor = $cookies.get('color').replaceAll("|",",");
        let urlPharmacy = 'https://location-qa.doctor-online.co?';
        let environmentDomain = document.location.host;

        if ( environmentDomain == "seguros.doctor-online.co" ) {
            urlPharmacy = 'https://location.doctor-online.co?';
        }

        ConfigurationCorporate.findConfiguration({idCorporate: $cookies.get('resource')}, function (res) {
            if (!res.googleApiKey) {
                swal(translationPrefered.INVALID_KEY_MAPS_TITLE, translationPrefered.INVALID_KEY_MAPS_DESCRIPTION, 'error')
                return true
            }
            const iframe = document.getElementById('pharmacy')
            iframe.style.height = heightIframe + 'px';
            $scope.admdron = JSON.parse($cookies.get('admdron'));
            urlPharmacy += 'Maps=' + res.googleApiKey + '&color='+corporateColor+'&CorporateId='+$scope.admdron.corporateId+'&TokenSecurity='+$scope.admdron.access_token+'&Platform=web&';
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    console.log(position.coords.latitude)
                    console.log(position.coords.longitude)
                    const lat = position.coords.latitude;
                    const lng =position.coords.longitude;
                    urlPharmacy += `Request=geolocation&Lat=${lat}&Lng=${lng}&height=${heightIframe}`
                    console.log(urlPharmacy)
                    $scope.urlPharmacy = $sce.trustAsResourceUrl(urlPharmacy)
                    $scope.foreUpdate()
                }, (error) => {
                    console.log(error)
                    $scope.getMyIp()
                });
            } else {
                $scope.getMyIp()
            }
        })

        $scope.getMyIp = function () {
            fetch('../private/getIp.php')
            .then(function (response) {
                return response.text();
            })
            .then(function (myIp) {
                console.log(myIp);
                urlPharmacy += `Request=ip&MyIp=${myIp}&height=${heightIframe}`
                console.log(urlPharmacy)
                $scope.urlPharmacy = $sce.trustAsResourceUrl(urlPharmacy)
                $scope.foreUpdate()
            });
        }

        $scope.foreUpdate = function () {
            $scope.$apply();
        }
    })
    /*ADDIN LIST PATIENT CONTROLLER FOR MAINTENANCE FOR PATIENT*/
    .controller('ListPatientController', function ($scope, $cookies, $uibModal, ngTableParams, PatientResource, $rootScope) {
        $scope.userId = parseInt(JSON.parse($cookies.get('admdron')).userId);
        $scope.patient = {}

        $rootScope.$on("CallListAllPatient", function () {
            $scope.listAllPatient();
        });

        $scope.listAllPatient = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,
                count: 5
            }, {
                getData: function ($defer, params) {
                    var receiveData = function (data) {
                        params.total(data.recordsTotal);
                        $defer.resolve(data.data);
                    };

                    var queryParams = {
                        draw: 1,
                        length: params.count(),
                        start: params.count() * (params.page() - 1),
                        userId: $scope.userId
                    };
                    PatientResource.findAll(queryParams, receiveData);
                }
            });
        };

        $scope.listAllPatient();

        //INICIO MODAL
        function modalInstances(animation, size, backdrop, keyboard) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    patient: function () {
                        return $scope.patient;
                    }
                }

            });
        }

        $scope.open = function (size) {
            $scope.patient = {};
            modalInstances(true, size, true, true)
        }

        $scope.delete = function (patientId) {
            $scope.size;
            $scope.find = PatientResource.find({
                    patientId: patientId
                }, function (data) {
                    $scope.patient = {
                        "person": {
                            "firstName": data.firstName,
                            "lastName": data.lastName,
                            "gender": data.gender,
                            "birthday": new Date(data.birthday)
                        },
                        "status": data.status,
                        "userId": data.userId,
                        "email": data.email,
                        "country": {
                            "countryId": 1
                        },
                        "language": {
                            "languageId": 1
                        },
                        "doctorId": $scope.userId,
                        "isEditar": 0
                    };

                    modalInstances(true, $scope.size, true, true)
                }


            );
        }

        $scope.edit = function (patientId) {
            $scope.size;
            $scope.find = PatientResource.find({
                    patientId: patientId
                }, function (data) {
                    $scope.patient = {
                        "person": {
                            "firstName": data.firstName,
                            "lastName": data.lastName,
                            "gender": data.gender,
                            "birthday": new Date(data.birthday)
                        },
                        "status": data.status,
                        "userId": data.userId,
                        "email": data.email,
                        "country": {
                            "countryId": 1
                        },
                        "language": {
                            "languageId": 1
                        },
                        "doctorId": $scope.userId,
                        "isEditar": 1
                    };

                    modalInstances(true, $scope.size, true, true)
                }


            );

        }

        //FIN MODAL

    })
    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, patient, PatientResource, $cookies, $rootScope) {
        $scope.userId = parseInt(JSON.parse($cookies.get('admdron')).userId);
        $scope.patient = patient;

        $scope.fechaActual = new Date();

        if ($scope.patient.userId === undefined) {
            $scope.patient = {
                "country": {
                    "countryId": 1
                },
                "language": {
                    "languageId": 1
                },
                "doctorId": $scope.userId,
                "status": "PENDING_CONFIRMATION",
            };
        }

        $scope.tituloSWAL = "";
        $scope.contenidoSWAL = "";
        $scope.tipoSWAL = "";

        var successCallback = function () {
            $rootScope.$emit("CallListAllPatient", {});
            swal($scope.tituloSWAL, $scope.contenidoSWAL, $scope.tipoSWAL);
        };

        $scope.ok = function () {
            if (($scope.patient.userId != null || $scope.patient.userId != undefined) && $scope.patient.isEditar == 1) {
                $scope.tituloSWAL = "¡Paciente modificado!";
                $scope.contenidoSWAL = "Se ha modificado la información del paciente exitosamente.";
                $scope.tipoSWAL = "success";
                PatientResource.update($scope.patient, successCallback);
            } else if (($scope.patient.userId != null || $scope.patient.userId != undefined) && $scope.patient.isEditar == 0) {
                $scope.tituloSWAL = "¡Paciente eliminado";
                $scope.contenidoSWAL = "Se ha eliminado al paciente exitosamente.";
                $scope.tipoSWAL = "success";
                PatientResource.delete($scope.patient, successCallback);
            } else {
                PatientResource.save($scope.patient, successCallback);
                $scope.tituloSWAL = "¡Invitación Enviada!";
                $scope.contenidoSWAL = "Se ha enviado la invitación al paciente exitosamente.";
                $scope.tipoSWAL = "success";

            }

            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('ListPatProfileController', function ($scope, PatProfileResource, $rootScope, $state, PatientResource, $cookies, AppointmentResource, SubscriptionResource) {
        
        // When camera is active on previewing permissions
        try {
            ReactDOM.unmountComponentAtNode(document.getElementById('root'));
        } catch (error) {
            errorLog("Error al quitar camara de pulling. " + error);
        }

        $scope.admdron = JSON.parse($cookies.get('admdron'));
        $scope.corpName = $cookies.get('corpname');
        $scope.chatProvider = $scope.admdron.chatProviderId;
        $scope.videoProvider = $scope.admdron.videoProviderId;
        $scope.phoneProvider = $scope.admdron.phoneProviderId;
        $scope.userId = parseInt($scope.admdron.userId);
        $rootScope.chatCompatibility = true;
        $rootScope.videoCompatibility = true;
        $scope.showAddButton = ($scope.corpName != "dronline");
        $scope.numberProfilesAllowed = $scope.admdron.numberProfilesAllowed;
        
            $scope.browserInfo = getDeviceInformation();
            PatientResource.parameterByName({
                parameterName: "QB_CHAT_COMPATIBILITY"
            }, function (response) {
                if ($scope.chatProvider == 1) {
                    if (!response.value.includes($scope.browserInfo)) {
                        $rootScope.chatCompatibility = false;
                    }
                }
                PatientResource.parameterByName({
                    parameterName: "QB_VIDEO_COMPATIBILITY"
                }, function (response) {
                    $scope.qbVideoCompatbility = response.value;
                    if ($scope.videoProvider == 1) {
                        if (!response.value.includes($scope.browserInfo)) {
                            $rootScope.videoCompatibility = false;
                        }
                    }
                    PatientResource.parameterByName({
                        parameterName: "ZOOM_VIDEO_COMPATIBILITY"
                    }, function (response) {
                        $rootScope.zoomVideoCompatibility = response.value;
                        if ($scope.videoProvider == 2) {
                            if (!response.value.includes($scope.browserInfo)) {
                                $rootScope.videoCompatibility = false;
                            }
                        }
                        if (!$rootScope.chatCompatibility || !$rootScope.videoCompatibility) {
                            $scope.browserSource = $scope.osName;
                            if ($scope.browserSource != "Android" && $scope.browserSource != "iOS") {
                                $scope.browserSource = "Web";
                            }
                            $scope.appMarket;
                            if ($scope.browserSource == "iOs") {
                                $scope.appMarket = "AppStore_URL";
                            }
                            if ($scope.browserSource == "Android") {
                                $scope.appMarket = "PlayStore_URL";
                            }
                            PatientResource.parameterByName({
                                parameterName: getCookie("language") + "_" + $scope.browserSource + "_SUGGESTION"
                            }, function (response) {
                                if ($scope.browserSource == "iOs" || $scope.browserSource == "Android") {
                                    PatientResource.parameterByName({
                                        parameterName: $cookies.get('corpname') + "_" + $scope.appMarket
                                    }, function (response2) {
                                        if (response2.value) {
                                            $rootScope.compatibilityMessage = response.value.replace("@", response2.value)
                                        } else {
                                            PatientResource.parameterByName({
                                                parameterName: getCookie("language") + "_WEB_SUGGESTION"
                                            }, function (response3) {
                                                $rootScope.compatibilityMessage = response3.value;
                                            });
                                        }
                                    });
                                } else {
                                    $rootScope.compatibilityMessage = response.value;
                                }
                            });
                        }
                    });
                });
            });

        AppointmentResource.findCallbackOrInvitation({
            userId: $scope.userId,
            termsAccepted: !$scope.termsAccepted ? 0 : $scope.termsAccepted
        }, function (res) {
            if (res.hasQueue || res.isOnCall) {
                $rootScope.chatCompatibility = false;
                $rootScope.videoCompatibility = false;
            } else {
                if(res.scheduled !== undefined && res.scheduled.first !== undefined){
                    if(res.scheduled.first.disableOnDemand){
                        $rootScope.chatCompatibility = false;
                        $rootScope.videoCompatibility = false;
                    }
                }
                if(res.followup !== undefined && res.followup.first !== undefined){
                    $rootScope.chatCompatibility = false;
                    $rootScope.videoCompatibility = false;
                }
            }
            if($cookies.get('corpname') == "cruzblanca" && res.remainingAppointments == 0){
                $rootScope.chatCompatibility = false;
                $rootScope.videoCompatibility = false;
            }
        });

        if ($scope.admdron.corporateId == 9) {
            $scope.isDoctorOnline = true;
            $scope.activeMember = $scope.admdron.activeMember;
            if ($scope.activeMember == undefined || $scope.activeMember == 0) {
                $rootScope.chatCompatibility = false;
                $rootScope.videoCompatibility = false;
            } else {
                SubscriptionResource.information(function (res) {
                    if (res.subscription == undefined) {
                        if (res.remainingAppointments != undefined) {
                            $scope.remainingAppointments = res.remainingAppointments;
                            if (res.remainingAppointments == 0) {
                                $rootScope.chatCompatibility = false;
                                $rootScope.videoCompatibility = false;
                            }
                        } else {
                            $rootScope.chatCompatibility = false;
                            $rootScope.videoCompatibility = false;
                        }
                    }
                });
            }
        }else if ($scope.admdron.corporateInformation.corporateName.toLowerCase() === 'doctorvirtual'){
            $scope.isDoctorVirtual = true;
            $scope.isDoctorOnline = false;
            $scope.activeMember = $scope.admdron.activeMember;
            if ($scope.activeMember == undefined || $scope.activeMember == 0) {
                $rootScope.chatCompatibility = false;
                $rootScope.videoCompatibility = false;
            } else {
                SubscriptionResource.information(function (res) {
                    if (res.subscription == undefined) {
                        if (res.remainingAppointments != undefined) {
                            $scope.remainingAppointments = res.remainingAppointments;
                            if (res.remainingAppointments == 0) {
                                $rootScope.chatCompatibility = false;
                                $rootScope.videoCompatibility = false;
                            }
                        } else {
                            $rootScope.chatCompatibility = false;
                            $rootScope.videoCompatibility = false;
                        }
                    }
                });
            }
        }

        $rootScope.fromView = "pages.profiles";
        PatProfileResource.findAll(function (data) {
            $scope.profiles = data;            
            if ($scope.corpName == "dronline") {
                $scope.showAddButton = ($scope.profiles.length < 5);
            }
        });

        $scope.goTo = function (param, idPerson, objePerson, profile) {

            $rootScope.idPerson = idPerson;
            $rootScope.objePerson = objePerson;
            $rootScope.objePerson.patProfile = profile;
            
            if($scope.corpName == "viya" || $scope.corpName == "viyasv" || $scope.corpName == "viyani" || $scope.corpName == "viyahn" ||
             $scope.corpName == "viyado" || $scope.corpName == "dronlinetdb" ){
                AppointmentResource.findCallbackOrInvitation({
                    userId: profile.userId.userId,
                    termsAccepted: !$scope.termsAccepted ? 0 : $scope.termsAccepted
                }, function (res) {
                    if(res.numberAppointments > 0){
                        $state.go('pages.speciality', {
                            optionId: param
                        });
                    }else {
                        $state.go('pages.enter-code', {
                            optionId: param
                        });   
                    }
                    
                });
            }else {
                $state.go('pages.speciality', {
                    optionId: param
                });
            }
        };
    })
    .controller('ViewPatProfileController', function ($scope, $stateParams, $window, $http, $filter, $cookies, $translate, $state, $rootScope,
        PatProfileResource, KinshipResource, ClinicalHistoryCategoryResource, MedicalConsultationResource, AttachmentResource, FileUploader, adminApi, DoctorSessionResource) {

        $scope.attachments = [];
        //Uploader
        var patientUploader = $scope.patientUploader = new FileUploader({
            url: adminApi + "attachment/upload-profile"
        });


        var token = JSON.parse($cookies.get('admdron')).access_token;
        patientUploader.headers.Authorization = 'Bearer ' + token;

        patientUploader.onWhenAddingFileFailed = function (item, filter, options) {
            swal(translationPrefered.INVALID_FILE, (item.name + '\n'+translationPrefered.INVALID_FILE_EXT), "error");
        };

        patientUploader.onAfterAddingFile = function (fileItem) {
            fileItem.formData.push({profileId:  $stateParams.profileId });
            fileItem.upload();
            $scope.showUpload = false;
        };

        patientUploader.onProgressItem = function (fileItem, progress) {
            swal({
                title: "<img src='../img/loading-short.gif'></img>",
                html: true,
                showConfirmButton: false
            });
        };

        patientUploader.onSuccessItem = function (fileItem, response, status, headers) {
            swal.close();
            showNotify(translationPrefered.FILE_SENT, "success");
            $scope.getAttachments();
            $scope.showUpload = false;
        };

        patientUploader.onErrorItem = function (fileItem, response, status, headers) {
            swal(translationPrefered.AVISO, translationPrefered.ERROR_UPLOAD + '\n' + response.description, "error");
        };
        //End uploader
        $scope.attachments = [];

        var uploader = $scope.uploader = new FileUploader({
            url: adminApi + "file-item"
        });

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        var permission = JSON.parse($cookies.get('ng-security-permissions'));
        if (permission != "patient") {
            $rootScope.showHeader = 2;
        } else {
            $scope.corporateParentName = JSON.parse($cookies.get('admdron')).parentCorporateInformation.corporateName;
        }
        var token = JSON.parse($cookies.get('admdron')).access_token;
        
        uploader.headers.Authorization = 'Bearer ' + token;

        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            swal(translationPrefered.INVALID_FILE, (item.name + '\n'+translationPrefered.INVALID_FILE_EXT), "error");      
        };

        uploader.onAfterAddingFile = function (fileItem) {    
            readURL("#profilePhotoUploader", "#photoPreview");    
            if($stateParams.profileId){
                fileItem.formData.push({profileId: $stateParams.profileId});
            }            
            fileItem.upload();
        };

        uploader.onProgressItem = function (fileItem, progress) {
            swal({
                title: "<img src='../img/loading-short.gif'></img>",
                html: true,
                showConfirmButton: false
            });
        };

        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            swal(translationPrefered.OPER, translationPrefered.SUCCESS_PHOTO_UPLOADED, "success");
        };

        uploader.onErrorItem = function (fileItem, response, status, headers) {
            swal(translationPrefered.AVISO, translationPrefered.ERROR_UPLOAD + '\n' + response.description, "error");
        };

        $scope.showMedia = false;
        $scope.showUpload = false;
        $scope.showGifLoadingAttachment = false;
        $scope.addingProfile = ($stateParams.profileId === undefined);

        $scope.getCategoryName = function (name) {
            try {
                var corporate = $scope.profile.corporateId.corporateName;
                if (corporate === "sercomed") {
                    if (name === "TRAUMÁTICOS") {
                        name = "MEDICAMENTOS";
                    }
                    if (name === "ALÉRGICOS") {
                        name = "ALERGIAS";
                    }
                }
            } catch (e) {}
            return name;
        }

        $rootScope.fromView = $rootScope.fromView || "pages.profiles";
        $rootScope.fromViewParams = $rootScope.fromViewParams || {};
        $scope.corpName = $cookies.get('corpname');
        $scope.editProfile = false;
        $scope.newProfile = (!$stateParams.profileId);
        $scope.hasEmail = false;
        $scope.hasPhone = false;
        $scope.saving = false;
        $scope.normalForm = ($scope.corpName != 'dradisa');
        $("#gifLoading").hide();
        $("#noCons").hide();
        $("#noMore").hide();
        $scope.counter = 0;
        $scope.limit = 0;
        $('html,body').scrollTop(0);
        $scope.disableCallMe = false;
        $scope.profileNameCorporation = ''
        $scope.profile = {
            admPerson: {
                gender: 0,
                birthday: $rootScope.rootMaxBirthday
            }
        };

        KinshipResource.findAll(function (data) {
            $scope.kinships = $filter('filter')(data, function (value) {
                return value.kinshipId > 0;
            });
        });

        $scope.searchProfile = function () {
            if ($stateParams.profileId) {
                PatProfileResource.find({
                    profileId: $stateParams.profileId
                }, function (data) {
                    $scope.amazonConfig = data.patientFiles.config;
                    if (data.patientFiles.photoURL !== undefined) {
                        $("#photoPreview").css('background-image', 'url(' + data.patientFiles.photoURL + ')');
                        $("#photoPreview").hide();
                        $("#photoPreview").fadeIn(650);
                    }
                    $scope.profile = data;
                    if (data?.admPerson?.subcorporation && data?.admPerson?.subcorporation !== '') {
                        $scope.profileNameCorporation = data.admPerson.subcorporation;
                    } else {
                        $scope.profileNameCorporation = data.corporateId.description;
                    }

                    $scope.hasPhone = ($scope.profile.admPerson.mobilePhone != undefined);
                    $scope.hasEmail = ($scope.profile.admPerson.emailPerson != undefined);

                    $scope.profile.admPerson.birthday = $scope.profile.admPerson.birthday.replace("T"," ");
                    $scope.profile.admPerson.birthday = $scope.profile.admPerson.birthday.replace("Z","");
                    

                    $scope.profile.admPerson.birthday = new Date($scope.profile.admPerson.birthday);
                    
                    if (permission != "patient") {
                        $scope.corporateParentName = $scope.profile.corporateName;
                        $scope.normalForm = ($scope.corporateParentName != 'dradisa');
                    }
                });
                ClinicalHistoryCategoryResource.findAll({
                    profileId: $stateParams.profileId
                }, function (data) {
                    $scope.clinicalHistoryCategories = data;
                });
                var queryParams = {
                    draw: 1,
                    length: 5,
                    start: $scope.counter,
                    profileId: $stateParams.profileId
                };
                MedicalConsultationResource.findAll(queryParams, function (data) {
                    $scope.limit = data.recordsTotal;
                    if ($scope.limit != 0) {
                        $scope.medicalList = data.data; 
                    } else {
                        $("#noCons").show();
                    }
                });
            } else {
                ClinicalHistoryCategoryResource.findAll(function (data) {
                    $scope.clinicalHistoryCategories = [];
                    $scope.clinicalHistoryCategories = data;
                });
            }
            if ($stateParams.edit == 1) {
                $scope.editProfile = true;
            }

            
        };

        $scope.showHistory = function(){
            $scope.loadingHistory = true;
            ClinicalHistoryCategoryResource.historyLog({
                profileId: $stateParams.profileId
            }, function (response) {
                let grouping = _.groupBy(response, element => (element.category))
                let sections = _.map(grouping, (items, category) => ({
                category: category,
                items: items
                }));
                $scope.historyLog = sections;
                $scope.loadingHistory = false;
            });
            $('#antHistory').modal('show');
        }

        $scope.searchProfile();

        var viewer;
        $(function () {
            viewer = ImageViewer();
        });

        $scope.images = [];

        var reqPic = {
            profileId: $stateParams.profileId,
            filter: [{
                relation: "=",
                name: "fileType",
                value: "1"
            }],
            orderBy: [{
                name: "timestamp",
                order: "DESC"
            }],
            page: 1,
            pageSize: 30
        };

        if(!$scope.addingProfile){
            $scope.showGifLoadingAttachment = true;
            AttachmentResource.getOrderedAttachments(reqPic, function (response) {
                if (response.length == 0) {
                    $scope.picLimitReached = true;
                }                
                $scope.viewPictures = true;
                $scope.imageList = response;

                $scope.imageList.forEach(function (item) {
                    var image = [];
                    image.thumb = image.img = item.url;
                    image.description = item.fileName;
                    image.timestamp = item.timeStamp;
                    image.sendDate = image.timestamp;
                    $scope.images.push(image);
                });
                $scope.showGifLoadingAttachment = false;
            });
            
        }

        $scope.getAttachments = function(){
            $scope.showGifLoadingAttachment = true;
            $scope.images = [];
            reqFile.page = 1;
            reqPic.page = 1;

            AttachmentResource.getOrderedAttachments(reqFile, function (response) {
                if (response.length == 0) {
                    $scope.fileLimitReached = true;
                }
                $scope.fileList = response;
            })

            AttachmentResource.getOrderedAttachments(reqPic, function (response) {
                $scope.showGifLoadingAttachment = true;
                if (response.length == 0) {
                    $scope.picLimitReached = true;
                }
                $scope.viewPictures = true;
                $scope.imageList = response;

                $scope.imageList.forEach(function (item) {
                    var image = [];
                    image.thumb = image.img = item.url;
                    image.description = item.fileName;
                    image.timestamp = item.timeStamp;
                    image.sendDate = image.timestamp;
                    $scope.images.push(image);
                });
            });

            $scope.attachments = AttachmentResource.getOrderedAttachments(reqPic, function (response) {
                $scope.imageList = response;
                $scope.imageList.forEach(function (item) {
                    var image = [];
                    image.thumb = image.img = item.url;
                    image.description = item.fileName;
                    image.timestamp = item.timeStamp;
                    image.sendDate = image.timestamp;                    
                    $scope.images.push(image);
                });
                $scope.showGifLoadingAttachment = false;
            });
        }

        $scope.openAttachment = function(attachment){
            if(attachment.url !== undefined){
                window.open(attachment.url, '_blank');
                return;
            }
            AttachmentResource.getAttachmentById({attachmentId: attachment.patMedicalAppointmentAttachmentId,profileId: $stateParams.profileId}, function(res){
                attachment = res;
                window.open(attachment.url, '_blank');
            })
        }
        

        $scope.picLimitReached = false;
        jQuery(function ($) {
            $('#picturesDiv').on('scroll', function () {
                if ((($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight) - 1)) && !$scope.picLimitReached) {
                    swal({
                        title: '<div class="preloader pls-green" style="width: 100px;"><svg class="pl-circular" viewbox="25 25 50 50"><circle class="plc-path" cx="50" cy="50" r="20" /></svg></div>',
                        html: true,
                        showConfirmButton: false
                    });
                    $(".sweet-alert").css('background-color', 'transparent');
                    reqPic.page = (reqPic.page + 1);
                    $scope.showGifLoadingAttachment = true;
                    AttachmentResource.getOrderedAttachments(reqPic, function (response) {
                        if (response.length > 0) {
                            $scope.viewPictures = true;
                            $scope.imageList = response;

                            $scope.imageList.forEach(function (item) {
                                var image = [];
                                image.thumb = image.img = item.url;
                                image.description = item.fileName;
                                image.timestamp = item.timeStamp;
                                image.sendDate = $filter('date')(new Date(image.timestamp.seconds * 1000), 'dd/MM/yyyy hh:mm a');
                                $scope.images.push(image);
                            });
                        } else {
                            $scope.picLimitReached = true;
                        }
                        swal.close();
                        $scope.showGifLoadingAttachment = false;
                    });
                }
            })
        });


        var reqFile = {
            profileId: $stateParams.profileId,
            filter: [{
                relation: "=",
                name: "fileType",
                value: "2"
            }],
            orderBy: [{
                name: "timestamp",
                order: "DESC"
            }],
            page: 1,
            pageSize: 30
        };

        if(!$scope.addingProfile){
            $scope.showGifLoadingAttachment = true;
            AttachmentResource.getOrderedAttachments(reqFile, function (response) {
                if (response.length == 0) {
                    $scope.fileLimitReached = true;
                }
                $scope.fileList = response;
                $scope.showGifLoadingAttachment = false;
            })
        }
        

        $scope.fileLimitReached = false;
        jQuery(function ($) {
            $('#filesDiv').on('scroll', function () {
                if ((($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight) - 1)) && !$scope.fileLimitReached) {
                    swal({
                        title: '<div class="preloader pls-green" style="width: 100px;"><svg class="pl-circular" viewbox="25 25 50 50"><circle class="plc-path" cx="50" cy="50" r="20" /></svg></div>',
                        html: true,
                        showConfirmButton: false
                    });
                    $(".sweet-alert").css('background-color', 'transparent');
                    reqFile.page = (reqFile.page + 1);
                    $scope.showGifLoadingAttachment = true;
                    AttachmentResource.getOrderedAttachments(reqFile, function (response) {
                        if (response.length > 0) {
                            response.forEach(function (item) {
                                $scope.fileList.push(item);
                            });
                        } else {
                            $scope.fileLimitReached = true;
                        }
                        swal.close();
                        $scope.showGifLoadingAttachment = false;
                    });
                }
            })
        });


        $scope.viewImage = function (item) {
            viewer.show(item.url, item.url);
        }

        $scope.changeMediaView = function (id) {
            if (id == 0) {
                $scope.viewPictures = true;
                $scope.viewFiles = false;
                $("#picturesDiv").animate({
                    scrollTop: 0
                }, "fast");
            } else {
                $scope.viewPictures = false;
                $scope.viewFiles = true;
                $("#filesDiv").animate({
                    scrollTop: 0
                }, "fast");
            }
        }

        $scope.showSize = function (size) {
            if (size == undefined) {
                return "";
            }
            size = size / 1024;
            symbol = "kB";
            if (size > 1024) {
                size = size / 1024;
                symbol = "MB";
            }
            return (Math.round(size * 100) / 100) + symbol;
        }

        jQuery(function ($) {
            $('#appointmentCard').on('scroll', function () {
                 if ((($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight) - 1))) {
                    if (!$scope.editProfile && !$scope.newProfile) {
                        if ($stateParams.profileId) {
                            if ($scope.limit != 0) {
                                if ($scope.limit >= $scope.counter) {
                                    $("#gifLoading").show();
                                    $scope.counter += 5;
                                    var queryParams = {
                                        draw: 1,
                                        length: 5,
                                        start: $scope.counter,
                                        profileId: $stateParams.profileId
                                    };

                                    MedicalConsultationResource.findAll(queryParams, function (data) {
                                        data.data.forEach(item => {
                                            $scope.medicalList.push(item);
                                        });
                                        $scope.loading = false;
                                        $("#gifLoading").hide();
                                    });
                                }
                            }
                        }
                    }
                }
            })
        });

        var successCallback = function () {
            if ($scope.editProfile == true) {
                $scope.editProfile = false;
                if ($stateParams.profileId == $rootScope.currentUserId) {
                    var admCookie = $cookies.getObject('admdron');
                    admCookie.firstName = $scope.profile.admPerson.firstName;
                    admCookie.lastName = $scope.profile.admPerson.lastName;
                    var d = new Date();
                    d.setFullYear(d.getFullYear() + 10);
                    document.cookie = 'admdron=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    document.cookie = "admdron=" + JSON.stringify(admCookie) + ";expires=" + d + ";domain=." + domainBaseJS + ";path=/";
                    $rootScope.currentUser = $scope.profile.admPerson.firstName + ' ' + $scope.profile.admPerson.lastName;
                    $scope.saving = false;
                }
                //$state.go($rootScope.fromView, $rootScope.fromViewParams);
            } else {
                $scope.saving = false;
                $state.go($rootScope.fromView, $rootScope.fromViewParams);
            }

        };

        $scope.save = function () {
            DoctorSessionResource.actionHistory({'idAction': docHistory.GUARDAR_INFO_PACIENTE});
            $scope.saving = true;
            var profile = {
                profile: $scope.profile,
                clinicalHistoryList: $scope.clinicalHistoryCategories
            }
            if ($stateParams.profileId) {
                PatProfileResource.update(profile, successCallback);
                $scope.saving = false;
            } else {
                PatProfileResource.save(profile, successCallback);
                $scope.saving = false;
            }
            if (permission == "patient" && $stateParams.profileId) {
                if ($scope.profile.admPerson.mobilePhone != undefined && $scope.profile.admPerson.mobilePhone.length > 0) {
                    PatProfileResource.lastAppointment({
                        profileId: $stateParams.profileId
                    }, function (res) {
                        if (res.code == 200) {
                            //Show modal para llamada
                            $scope.patientName = $scope.profile.admPerson.firstName + ' '+ $scope.profile.admPerson.lastName
                            $scope.$apply()
                            $('#callMeModal').modal('show');
                        }
                    });
                }
            }
            $scope.patientName = $scope.profile.admPerson.firstName + ' '+ $scope.profile.admPerson.lastName
            $scope.$apply()
            $('html,body').scrollTop(0);
        };

        $scope.cancel = function () {
            if ($stateParams.profileId) {
                if (!$scope.editProfile) {
                    $state.go($rootScope.fromView, $rootScope.fromViewParams);
                } else {
                    $scope.searchProfile();
                    $scope.editProfile = false;
                    $('html,body').scrollTop(0);
                }
            } else {
                $state.go($rootScope.fromView, $rootScope.fromViewParams);
            }
        };

        $scope.changeView = function () {
            $scope.editProfile = true;
        };

        $scope.openFile = function (medicalAppointmentId,pdfType) {
            swal({
                title: "<img src='../img/loading-short.gif'></img>",
                html: true,
                showConfirmButton: false
            });
            MedicalConsultationResource.findPdfByMedicalAppointmentId({
                medicalAppointmentId: medicalAppointmentId
            }, function (data) {
                
                if(pdfType==1){
                    if((data.urlPDF == undefined || data.urlPDF == "")){
                        swal({
                            html: true,
                            title: `<h1> ${translationPrefered.AVISO} </h1> <br> <p>${translationPrefered.APPOINTMENT_NO_PDF}</p>`,
                            type: "error",
                        });
                    }else {
                        swal.close();
                        window.open(data.urlPDF, '_blank');
                    } 
                }else if (pdfType==2) {
                    if((data.urlDiagnosticPDF == undefined || data.urlDiagnosticPDF == "")){
                        swal({
                            type: "error",
                            html: true,
                            title: `<h1> ${translationPrefered.AVISO} </h1> <br> <p>${translationPrefered.APPOINTMENT_NO_PDF}</p>`,
                            
                        });
                    }else {
                        swal.close();
                        window.open(data.urlDiagnosticPDF, '_blank');
                    } 
                }
            });
        };

        $scope.callMe = function () {
            $scope.disableCallMe = true;
            $scope.option = 3;
            $scope.admdron = JSON.parse($cookies.get('admdron'));
            $scope.chatProvider = $scope.admdron.chatProviderId;
            $scope.videoProvider = $scope.admdron.videoProviderId;
            $scope.phoneProvider = $scope.admdron.phoneProviderId;
            $scope.appVersion = $scope.admdron.appCorporateVersion;
            var reqCHECK = {
                method: 'POST',
                url: apiURLBaseJS + "dronline-call-api/sessioncallactive/callme/" + $stateParams.profileId + "/" + $scope.option,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                data: {
                    chatProviderId: $scope.chatProvider,
                    videoProviderId: $scope.videoProvider,
                    phoneProviderId: $scope.phoneProvider,
                    appCorporateVersion: $scope.appVersion,
                    deviceId: $rootScope.deviceId
                }
            };
            $http(reqCHECK).then(function successCallback(response) {
                $('#callMeModal').modal('hide');
                $('.modal-backdrop').remove();
                $state.go('pages.patient');
            }, function errorCallback(err) {
                errorLog(err);
            });
        };

    })
    .controller('PatAccountCtrl', function ($scope, $cookies, $state, $uibModal, PatientResource, SubscriptionResource, PatProfileResource,ValidatorPassword) {

        // When camera is active on previewing permissions
        try {
            ReactDOM.unmountComponentAtNode(document.getElementById('root'));
        } catch (error) {
            errorLog("Error al quitar camara de pulling. " + error);
        }

        var cookie = JSON.parse($cookies.get('admdron'));
        $scope.showSub = false;
        $scope.email = "";
        $scope.phoneNumber = "";
        $scope.address = "";
        $scope.corporateGDPR = false;
        $scope.corporateValidator = false;

        PatientResource.find({
            patientId: cookie.userId
        }, function (data) {
            $scope.email = data.email;
            $scope.hasPhone = (data.phoneNumber);
            $scope.hasEmail = (data.email);
            $scope.phoneNumber = data.phoneNumber;
            $scope.address = data.address;
            $scope.currentPhone = data.phoneNumber;
            $scope.currentEmail = $scope.email;
            $scope.currentAddress = data.address;
            $scope.corporateGDPR = data.corporateGDPR;
            $scope.validatorStatus = data.validatorStatus;
            $scope.statusValidator = $scope.validatorStatus == 2 ? true : false;
            $scope.corporateValidator = data.corporateValidator == 1 ? true : false;
            $scope.emailValidator = data.emailUser;

            if($scope.statusValidator){
                $scope.status_text = translationPrefered.DISABLE_VALIDATOR;
                console.log("STATUS: "+$scope.status_text);
            }else{
                $scope.status_text = translationPrefered.ENABLE_VALIDATOR;
                console.log("STATUS: "+$scope.status_text);
            }

        });

        $scope.checkSub = function () {
            $scope.activeMember = JSON.parse($cookies.get('admdron')).activeMember;
            if(!(JSON.parse($cookies.get('admdron')).corporateInformation.corporateName == "doctorvirtual")){
                SubscriptionResource.information(function (res) {
                    if (typeof res.subcription === 'undefined') {
                        $scope.haveSub = false;
                    } else {
                        $scope.haveSub = true;
                        $scope.subName = res.subcription.packageCurrencyId.packageId.name;
                        $scope.totalVideo = res.videos;
                        $scope.totalChat = res.chats;
                        $scope.totalVideo = ($scope.totalVideo == -1) ? "ILIMITADO" : $scope.totalVideo;
                        $scope.totalChat = ($scope.totalChat == -1) ? "ILIMITADO" : $scope.totalChat;
                        $scope.fechaFin = res.paymentDate;
                    }
                });
            }else {
                if($scope.activeMember == 1){
                    $scope.haveSub = true;
                    $scope.subName = 'Suscripción Doctor Virtual';
                    $scope.totalVideo =  "Ilimitado";
                    $scope.totalChat = "Ilimitado";
                    $scope.fechaFin = Date.now() + 31536000000;
                }
            }
            
        }

        if ($cookies.get('corpname') == "dronline") {
            $scope.showSub = true;
            $scope.checkSub();
        }else if ($cookies.get('corpname') == "doctorvirtual") {
            $scope.showSub = true;
            $scope.checkSub();
        }

        $scope.subscriptionView = function () {
            $state.go('pages.subscription');
        };

        if (cookie.firstName != undefined) {
            $scope.userName = cookie.firstName.replaceAll('+', ' ');
        }
        if (cookie.lastName != undefined) {
            $scope.userName += ' ' + cookie.lastName.replaceAll('+', ' ');
        }
        $scope.changePassword = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/change-password.html',
                controller: 'ChangePasswordCtrl',
                backdrop: 'static',
                keyboard: false
            });
        };

        $scope.updateEmail = function () {
            var profileContactInfo = {
                profileId: cookie.userId,
                profileEmail: $scope.currentEmail,
                profilePhone: $scope.currentPhone,
                profileAddress: $scope.currentAddress
            }
            PatProfileResource.updateContactInformation(profileContactInfo, function (response) {
                $scope.hasPhone = (response.phoneNumber);
                $scope.hasEmail = (response.email);
                $scope.email = response.profileEmail;
                $scope.phoneNumber = response.profilePhone;
                $scope.address = response.profileAddress;
                $('#changeEmail').modal('hide');
            });
        };
        $scope.cancel = function () {
            $scope.currentEmail = $scope.email;
        };
        $scope.exportAccount = function () {
            var profileEmail = {
                emailUser: $scope.currentEmail,
            }
            PatProfileResource.getExportAccount(profileEmail, function (response) {
                if(response.code == 200){
                    swal({
                        title: translationPrefered.ACCOUNT_EXPORTED,
                        text: translationPrefered.CHECK_YOUR_EMAIL,
                        type: 'success',
                        confirmButtonText: translationPrefered.buttonOK
                    });
                }
                else{
                    swal({
                        title: translationPrefered.ACCOUNT_NO_EXPORTED,
                        type: 'error',
                        confirmButtonText: translationPrefered.buttonOK
                    });
                }
            });
        }
        $scope.confirmDeleteAccount = function () {
            var emailToDelete = {
                emailUser: $scope.email,
            }
            PatProfileResource.deleteAccountData(emailToDelete, function (response) {
                $('#deleteAccountModal').modal('hide');
                if(response.code == 200){
                    showSwal("success", translationPrefered.ACCOUNT_DELETED);
                }
                else{
                    showSwal("error", translationPrefered.ACCOUNT_NO_DELETED);
                }
            });
        }

        var regexWeak = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,30}$");

        var regexStrong = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%^*#?&=])[A-Za-z\\d@$!%*#?&]{6,30}$");
            
        var regexMedium = new RegExp("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{6,16}$");

        var element = document.getElementById('progressBar');

        $scope.patternAccepted = false;


        $scope.validationInputPwdText = function(value) {
            if (regexStrong.test(value)) {
                element.style["width"] = "100%"; 
                element.innerHTML  = translationPrefered.HIGH_COMPLEX;
                element.className = "progress-bar progress-bar-success"; 
                $scope.patternAccepted = true;
                
            } else if (regexMedium.test(value)) {
                element.style["width"] = "60%";
                element.className = "progress-bar progress-bar-info"; 
                element.innerHTML  = translationPrefered.MEDIUM_COMPLEX;
                if($scope.corporateGDPR){
                    $scope.patternAccepted = false;
                }else{
                    $scope.patternAccepted = true;
                }
            } else if (regexWeak.test(value)) {
                element.style["width"] = "30%";
                element.className = "progress-bar progress-bar-warning";
                element.innerHTML  = translationPrefered.LOW_COMPLEX;
                if($scope.corporateGDPR){
                    $scope.patternAccepted = false;
                }else{
                    $scope.patternAccepted = true;
                }
            }else {
                element.style["width"] = "0%";
                element.className = "progress-bar progress-bar-danger";
                element.innerHTML  = "";
                if($scope.corporateGDPR){
                    $scope.patternAccepted = false;
                }else{
                    $scope.patternAccepted = true;
                }
            }
          };

        $scope.validProcess = true;
        $scope.eye = "fa fa-eye fa-lg";
        $scope.showPassword = false;
        
        $scope.tooglePassword = function () {
            if ($scope.showPassword) {
                $scope.eye = "fa fa-eye fa-lg";
                $("#passwordValidator").attr('type', 'password');
                $scope.showPassword = false;
            } else {
                $scope.eye = "fa fa-eye-slash fa-lg";
                $("#passwordValidator").attr('type', 'text');
                $scope.showPassword = true;
            }
        };

        $scope.updateValidator = function () {
    
            let req = {
                email: $scope.emailValidator,
                emailConfirm: $scope.emailValidator,
                password: $scope.passwordValidator,
                statusValidator: $scope.statusValidator == true ? 2 : 1
            }
            
            ValidatorPassword.validator(req, function (res) {
                $('#updateValidator').modal('hide');
                if (res.code == 200) {
                    swal({
                        title: translationPrefered.OPER,
                        text: translationPrefered.PASSWORD_RESTARTED,
                        type: 'success',
                        confirmButtonText: translationPrefered.buttonOK
                    });
                } else {
                    $scope.inProcess = false;
                    $scope.showError = true;
                }
            },function (error) {
                $('#updateValidator').modal('hide');
                $scope.inProcess = false;
                $scope.showError = true;
                $scope.errorUpdate = false;
                if(error.data.code == 406){
                    $scope.errorUpdate = true;
                }
            });
        };

        $scope.changeStatus = function(){
            if($scope.statusValidator){
                $scope.status_text = translationPrefered.DISABLE_VALIDATOR;
                document.getElementById("statusVal").innerHTML = $scope.status_text;
            }else{
                $scope.status_text = translationPrefered.ENABLE_VALIDATOR;
                document.getElementById("statusVal").innerHTML = $scope.status_text;
            }
            
        }
    })
    .controller('ChangePasswordCtrl', function ($cookies, $scope, $modalInstance, PasswordResource, $http, $rootScope) {
        
        // author: @victorisimoo
        // date: 2023-03-23
        // description: Parameterizable secure password verification method. 

        // Si el login fue desde un doctor
        if($rootScope.currentUser.includes("Dr")){
            var reqChangePassword = {
                method: 'GET',
                url: apiURLBaseJS + "dronline-admin-api/api/corporate/getPasswordConfigs/"+$rootScope.currentUserId,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            };

            $http(reqChangePassword).then(function successCallback(response) {
                if(response.status == 200){
                    if(response.data[3].statusId == 1){
                        $scope.passwordPattern = "^"+response.data[3].value; //pattern
                    }else {
                        $scope.passwordPattern = "^\\S*$";
                    }

                    if(response.data[1].statusId == 1){
                        $scope.passwordMaxLength = response.data[1].value; //max length
                    }else {
                        $scope.passwordMaxLength = 30;
                    }

                    if(response.data[2].statusId == 1){
                        $scope.passwordMinLength = response.data[2].value; //min length
                    }else {
                        $scope.passwordMinLength = 8;
                    }
                }else {
                    $scope.passwordPattern = "^\\S*$";
                    $scope.passwordMaxLength = 30;
                    $scope.passwordMinLength = 8;
                }
            });
        }

        $scope.ok = function () {
            PasswordResource.save($scope.changePassword,
                function () {
                    $modalInstance.close();
                    swal(translationPrefered.RESTART_PASSWORD_DOC, translationPrefered.PASSWORD_RESTARTED, "success");
                },
                function () {
                    swal(translationPrefered.PASSWORD_ERROR, translationPrefered.PASSWORD_ERROR_MSG, "error");
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('ReportIssueCtrl', function ($scope, $modalInstance, ReportIssueResource, $rootScope) {
        $scope.issue = {
            appointment: $rootScope.appointment,
            description: ""
        };
        $scope.ok = function () {
            ReportIssueResource.save($scope.issue,
                function () {
                    $modalInstance.close();
                    swal(translationPrefered.REPORTAR, translationPrefered.CASO_SUCC, "success");
                },
                function () {
                    $modalInstance.close();
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('DoctorAlertCtrl', function ($scope, $modalInstance, $timeout) {
        $scope.audiofile = new Audio("../audio/queue-alert.mp3");

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            $scope.detenerAudio();
        };

        function playAudio() {
            $scope.audiofile.play();
            $scope.audiofile.loop = true;
        };

        $scope.detenerAudio = function () {
            $scope.audiofile.pause();
            $scope.audiofile.currentTime = 0;

        };

        $timeout(playAudio, 500);
    })
    .controller('settingSubCtrl', function ($scope, $rootScope, $cookies, SubscriptionResource, BillingResource, $http) {
        $scope.userId = parseInt(JSON.parse($cookies.get('admdron')).userId);
        $scope.amex = false;
        $scope.visa = false;
        $scope.mastercard = false;
        $scope.updateCard = false;
        $scope.options = true;
        $scope.cancelSubs = false;
        $scope.paymentConfirm = false;
        $scope.configSub = function () {
            SubscriptionResource.find({
                userId: $rootScope.currentUserId
            }, function (res) {
                if (typeof res.subcription == 'undefined') {

                } else {
                    $scope.paymentList = res.paymentsList;
                    $scope.provider = res.provider;
                    $scope.card = "•••• •••• •••• " + res.lastCardDigits;
                    $scope.firstname = res.firstName;
                    $scope.lastname = res.lastName;
                    $scope.exp = res.expDate;
                    if ($scope.provider == 1) {
                        $scope.visa = true;
                    } else if ($scope.provider == 2) {
                        $scope.mastercard = true;
                    } else if ($scope.provider == 3) {
                        $scope.amex = true;
                    }
                }
            });
        }

        $scope.updatePayCard = function () {
            $scope.options = false;
            $scope.updateCard = true;
            $scope.actualCard = $scope.card;
        }

        $scope.cancelMembership = function () {
            $scope.options = false;
            $scope.cancelSubs = true;
            $scope.updateCard = false;
            $scope.cancelForm = true;
            $scope.cancelSuccess = false;
        }

        $scope.backOptions = function () {
            $scope.options = true;
            $scope.updateCard = false;
            $scope.cancelSubs = false;
            $scope.card = $scope.actualCard;
        }

        $scope.cardUpdate = function () {
            $scope.paymentConfirm = true;
            $scope.cardUpdateConfirm = true;
            $scope.cardTrim = $scope.card.replaceAll(' ', '');
            var res = $scope.exp.split("/");
            var req = {
                "userId": $scope.userId,
                "accountNumber": $scope.cardTrim,
                "expirationMonth": res[0].trim(),
                "expirationYear": res[1].trim(),
                "cvvCard": $scope.cvv,
                "nameCard": $scope.firstname + " " + $scope.lastname,
                "provider": $scope.provider
            }
            BillingResource.updateCardToken(req, function (res) {
                if (res.code === 200) {
                    $scope.paymentConfirm = false;
                    $scope.lastDigits = $scope.card.substr($scope.card.length - 4);
                    $scope.card = "•••• •••• •••• " + $scope.lastDigits;
                    if ($scope.provider == "visa") {
                        $scope.visa = true;
                    } else if ($scope.provider == "mastercard") {
                        $scope.mastercard = true;
                    } else if ($scope.provider == "amex") {
                        $scope.amex = true;
                    }
                    swal("Operación exitosa", "Tarjeta de crédito o débito actualizada exitosamente.", "success");
                    $scope.backOptions();
                } else {
                    $scope.paymentConfirm = false;
                }
            });
        }

        $scope.billingCancel = function () {
            if(!(JSON.parse($cookies.get('admdron')).corporateInformation.corporateName == "doctorvirtual")){
                $scope.cancelConfirm = true;
                BillingResource.cancel({
                    userId: $scope.userId
                }, function (res) {
                    if (res.code === 200) {
                        $scope.cancelForm = false;
                        $scope.cancelSuccess = true;
                        $scope.cancelConfirm = false;
                        $rootScope.showHeader = 5;
                    } else {
                        errorLog("Error en cancelacion de suscripcion");
                        $scope.cancelConfirm = false;
                    }
                });

            } else{
                var cancelSuscription = {
                    method: 'GET',
                    url: apiURLBaseJS + "dronline-billing-api/api/powertranz/cancel-subscription/" + $scope.userId,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                };

                $http(cancelSuscription).then(function (response) {
                    if (response.data.code === 200) {
                        $scope.cancelForm = false;
                        $scope.cancelSuccess = true;
                        $scope.cancelConfirm = false;
                        $rootScope.showHeader = 5;
                    } else {
                        errorLog("Error en cancelacion de suscripcion");
                        $scope.cancelConfirm = false;
                    }
                }, function (error) {
                    errorLog("Error en cancelacion de suscripcion");
                    $scope.cancelConfirm = false;
                });
            }
        }

        $scope.backToRegister = function () {
            document.cookie = "admdron=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=" + domainBaseJS;
            document.cookie = "activeMember=false;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=" + domainBaseJS;
            if($scope.isDoctorOnline){
                window.location = URLBase + webSiteName + 'views/login.php?resource=e4c4aa0f523941d2a332d15101f12e9e';
            }else {
                window.location = URLBase + webSiteName + 'views/login.php?resource=07b3dce8307411eda2610242ac120002';
            }
            
        };

    })
    .controller('changePhotoCtrl', function ($scope, $stateParams, $state, $cookies, DoctorResource) {

        $scope.photoFolder = "";
        $scope.state = $stateParams.changeState;

        DoctorResource.findParameterByName({
            doctorId: $stateParams.doctorId,
            parameterName: 'DOCTOR_PHOTO_PATH'
        }, function (data) {
            $scope.photoFolder = data != null ? data.value : "NOT FOUND";
        });

        $scope.userId = parseInt(JSON.parse($cookies.get('admdron')).userId);
        $scope.doctor = {};

        DoctorResource.find({
            doctorId: $scope.userId
        }, function (data) {
            $scope.doctor = data;

            if ($scope.doctor.profilePicture.base64 == undefined) {
                $scope.doctor.profilePicture.base64 = "images/default.jpg";
            } else {
                $scope.doctor.profilePicture.base64 = "data:image/jpeg;base64," + $scope.doctor.profilePicture.base64;
            }
            $scope.email = $scope.doctor.admUser.email;
            $scope.userName = $scope.doctor.admUser.admPerson.firstName.replaceAll("+", " ") + " " + $scope.doctor.admUser.admPerson.lastName.replaceAll("+", " ");
        });

        $scope.cancel = function () {
            $state.go("pages.docaccount");
        };
    })
    .controller('DocAccountCtrl', function ($scope, $state, $cookies, $uibModal, DoctorResource, $rootScope, FileUploader, adminApi, DoctorSessionResource, $http, $timeout, $window, $location, $anchorScroll, $translate) {
        $scope.userId = parseInt(JSON.parse($cookies.get('admdron')).userId);
        $scope.doctor = {};

        var uploader = $scope.uploader = new FileUploader({
            url: adminApi + "file-item"
        });

        var token = JSON.parse($cookies.get('admdron')).access_token;
        uploader.headers.Authorization = 'Bearer ' + token;

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            swal(translationPrefered.INVALID_FILE, (item.name + '\n'+translationPrefered.INVALID_FILE_EXT), "error");      
        };

        uploader.onAfterAddingFile = function (fileItem) {   
            readURL((fileItem.type=="profile"?"#photoUpload":"#signatureUpload"), (fileItem.type=="profile"?"#photoPreview":"#signaturePreview"));    
            fileItem.formData.push({type: (fileItem.type=="profile"?1:2)});
            fileItem.upload();
        };

        uploader.onProgressItem = function (fileItem, progress) {
            swal({
                title: "<img src='../img/loading-short.gif'></img>",
                html: true,
                showConfirmButton: false
            });
        };

        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            swal({
                title: translationPrefered.OPER,
                text: translationPrefered.SUCCESS_PHOTO_UPLOADED,
                type: "success",
                confirmButtonColor: "#26AD6E",
                confirmButtonText: translationPrefered.buttonOK,
                closeOnConfirm: true
            });
        };

        uploader.onErrorItem = function (fileItem, response, status, headers) {            
            if(status === 413){
                swal(translationPrefered.AVISO, (translationPrefered.ERROR_UPLOAD + '\n' + translationPrefered.IMAGE_EXCEEDS_SIZE), "error");
            }else{
                swal(translationPrefered.AVISO, (translationPrefered.ERROR_UPLOAD + '\n' + response.description), "error");
            }
        };

        $scope.closeUpdateResources = function(){
            $('#modal-photo').modal('hide');
        }


        DoctorResource.find({
            doctorId: $scope.userId
        }, function (data) {
            $scope.doctor = data;
            if (data.doctorFiles.photoURL !== undefined) {
                $("#photoPreview").css('background-image', 'url(' + data.doctorFiles.photoURL + ')');
                $("#photoPreview").hide();
                $("#photoPreview").fadeIn(650);
            }
            if (data.doctorFiles.signatureURL !== undefined) {
                $("#signaturePreview").css('background-image', 'url(' + data.doctorFiles.signatureURL + ')');
                $("#signaturePreview").hide();
                $("#signaturePreview").fadeIn(650);
            }
            $scope.amazonConfig = data.doctorFiles.config;
            $scope.email = $scope.doctor.admUser.email;            
            $scope.userName = $scope.doctor.admUser.admPerson.firstName.replaceAll("+", " ") + " " + $scope.doctor.admUser.admPerson.lastName.replaceAll("+", " ");
            $rootScope.currentUser = $scope.userName;
        });

        $scope.changePhoto = function () {
            $state.go("pages.changephoto", {
                changeState: 1
            });
        };

        $scope.showFilesModal = function () {
            DoctorSessionResource.actionHistory({'idAction': docHistory.CAMBIAR_FOTO_FIRMA});
            $('#modal-photo').modal('show');
        };

        $scope.changePassword = function () {

            DoctorSessionResource.actionHistory({'idAction': docHistory.CAMBIAR_CONTRASENIA});
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/change-password.html',
                controller: 'ChangePasswordCtrl',
                backdrop: 'static',
                keyboard: false
            });
        };

        

        $scope.exportAccount = function () {
            DoctorSessionResource.actionHistory({'idAction': docHistory.EXPORTAR_MIS_DATOS});
            swal({
                title: "<img src='../img/loading-short.gif'></img>",
                html: true,
                showConfirmButton: false
            });
            var profileEmail = {
                emailUser: $scope.currentEmail,
            }
            DoctorResource.getExportAccount(profileEmail, function (response) {
                if(response.code == 200){
                    showSwal("success", translationPrefered.ACCOUNT_EXPORTED,translationPrefered.CHECK_YOUR_EMAIL );
                }
                else{
                    showSwal("error", translationPrefered.ACCOUNT_NO_EXPORTED);
                }
            });
        }
        $scope.confirmDeleteAccount = function () {
            swal({
                title: "<img src='../img/loading-short.gif'></img>",
                html: true,
                showConfirmButton: false
            });
            var emailToDelete = {
                emailUser: $scope.email,
            }
            DoctorSessionResource.actionHistory({'idAction': docHistory.ELIMINAR_MI_CUENTA});
            DoctorResource.deleteAccountData(emailToDelete, function (response) {
                $('#deleteAccountModal').modal('hide');
                if(response.code == 200){
                    showSwal("success", translationPrefered.ACCOUNT_DELETED);
                }
                else{
                    showSwal("error", translationPrefered.ACCOUNT_NO_DELETED);
                }
            });
        }

        


    })
    .controller('ViewDocAccountController', function ($scope, $state, $cookies, DoctorResource, DoctorSessionResource) {
        $scope.userId = parseInt(JSON.parse($cookies.get('admdron')).userId);
        $scope.doctor = {};


        var minAge = new Date();
        minAge.setDate(minAge.getDate() - (365 * 70));
        minAge.setDate(1);
        minAge.setMonth(0);
        minAge.setYear(minAge.getFullYear());
        $scope.minBirthday = new Date(minAge);


        var maxAge = new Date();
        maxAge.setDate(maxAge.getDate() - (365 * 20));
        maxAge.setDate(31);
        maxAge.setMonth(11);
        maxAge.setYear(maxAge.getFullYear());
        $scope.maxBirthday = new Date(maxAge);

        DoctorResource.find({
            doctorId: $scope.userId
        }, function (data) {
            $scope.doctor = data;
            $scope.doctor.admUser.admPerson.birthday = new Date($scope.doctor.admUser.admPerson.birthday);
            $scope.doctor.admUser.admPerson.mobilePhone = ($scope.doctor.admUser.admPerson.mobilePhone);
            $scope.doctor.admUser.admPerson.officePhone = ($scope.doctor.admUser.admPerson.officePhone);
            $scope.doctor.professionalId = ($scope.doctor.professionalId);
        });

        var successCallback = function () {
            $state.go("pages.docaccount");
        };

        $scope.save = function () {
            DoctorSessionResource.actionHistory({'idAction': docHistory.ADMINISTRAR_PERFIL});
            if ($scope.doctor.doctorId != null || $scope.doctor.doctorId != undefined) {
                DoctorResource.update($scope.doctor, successCallback);
            } else {
                DoctorResource.save($scope.doctor, successCallback)
            }
        };

        $scope.cancel = function () {
            $state.go("pages.docaccount");
        };
    })
    .controller('ListMedConsController', function ($scope, $rootScope, $cookies, $stateParams, $uibModal, ngTableParams,
        MedicalConsultationResource, PatProfileResource) {
        var permission = JSON.parse($cookies.get('ng-security-permissions'));
        if (permission != "patient") {
            $rootScope.showHeader = 2;
        }
        PatProfileResource.find({
            profileId: $stateParams.profileId
        }, function (data) {
            $scope.profile = data;
            $scope.profile.admPerson.birthday = new Date($scope.profile.admPerson.birthday);
        });

        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 4
        }, {
            counts: [],
            getData: function ($defer, params) {
                var receiveData = function (data) {
                    params.total(data.recordsTotal);
                    $defer.resolve(data.data);

                };

                var queryParams = {
                    draw: 1,
                    length: params.count(),
                    start: params.count() * (params.page() - 1),
                    profileId: $stateParams.profileId
                };

                MedicalConsultationResource.findAll(queryParams, receiveData);
            }
        });

        $scope.openDetail = function (medicalAppointmentId) {
            $uibModal.open({
                animation: true,
                templateUrl: 'views/patient/medcons/view.html',
                controller: 'MedicalAppointmentViewController',
                size: 'lg',
                resolve: {
                    medicalAppointmentId: function () {
                        return medicalAppointmentId;
                    }
                }

            });
        };

        $scope.openFile = function (medicalAppointmentId) {
            $rootScope.fileOpen = 0;
            $uibModal.open({
                animation: true,
                templateUrl: 'views/patient/viewPDF.html',
                controller: 'ViewPDFController',
                size: 'lg',
                resolve: {
                    medicalAppointmentId: function () {
                        return medicalAppointmentId;
                    }
                }
            });
        };
    })
    .controller('ViewPDF', function ($scope, $rootScope, $modalInstance, MedicalConsultationResource, medicalAppointmentId, $sce) {

        MedicalConsultationResource.findPdfByMedicalAppointmentId({
            medicalAppointmentId: medicalAppointmentId
        }, function (data) {
            $scope.detail = data;
            $scope.file = "data:application/pdf;base64," + $scope.detail.base64PDF;
            $scope.file = $sce.trustAsResourceUrl($scope.file);
            $rootScope.fileOpen = 1;
        });


        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('MedicalAppointmentViewController', function ($scope, $modalInstance, MedicalConsultationResource, medicalAppointmentId) {
        $scope.normalForm = true;
        MedicalConsultationResource.findByMedicalAppointmentId({
            medicalAppointmentId: medicalAppointmentId
        }, function (data) {
            if (data.medicalAppointment.profileId.corporateId.corporateName === "dradisa") {
                $scope.normalForm = false;
                document.getElementsByTagName("md-pagination-wrapper")[1].setAttribute("class", "fixWrapper");
            }
            $scope.detail = data;
            $scope.tipo = (data.medicalAppointment.serviceTypeId === 1) ? "CHAT" : "VIDEO LLAMADA";
        });

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('RestorePasswordCtrl', function ($scope, $cookies, $state, $rootScope, PatientResource, RestorePasswordResource, DoctorResource, $http) {
        
        $scope.validProcess = true;
        $scope.eye = "fa fa-eye fa-lg";
        $scope.showPassword = false;

        //@author: victorisimoo
        //description: obtain password configuration information

        var reqChangePassword = {
            method: 'GET',
            url: apiURLBaseJS + "dronline-admin-api/api/corporate/getPasswordConfigs/"+$rootScope.currentUserId,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };

        $http(reqChangePassword).then(function successCallback(response) {
            if(response.status == 200){

                // password pattern configuration
                if(response.data && response.data.PASSWORD_PATTERN_DOCTOR){
                    $scope.passwordPattern = "^" + response.data.PASSWORD_PATTERN_DOCTOR;
                }else {
                    $scope.passwordPattern = "^\\S*$";
                }

                // max length configuration
                if(response.data && response.data.PASSWORD_MAX_LENGTH){
                    $scope.passwordMaxLength = response.data.PASSWORD_MAX_LENGTH;
                }else {
                    $scope.passwordMaxLength = 30;
                }

                // min length configuration
                if(response.data && response.data.PASSWORD_MIN_LENGTH){
                    $scope.passwordMinLength = response.data.PASSWORD_MIN_LENGTH;
                }else {
                    $scope.passwordMinLength = 8;
                }

            }else {
                $scope.passwordPattern = "^\\S*$";
                $scope.passwordMaxLength = 30;
                $scope.passwordMinLength = 8;
            }
            
        });       
        
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

        $scope.getPatientInformation = function () {
            $scope.userId = parseInt(JSON.parse($cookies.get('admdron')).userId);
            $scope.name = JSON.parse($cookies.get('admdron')).firstName.replaceAll("+"," ");
            PatientResource.find({
                patientId: $scope.userId
            }, function (data) {
                if (data.isPasswordRestored) {
                    $state.go("pages.patient");
                } else {
                    if(JSON.parse($cookies.get('admdron')).corporateInformation.corporateName == "doctorvirtual"){
                        $state.go("pages.patient");
                    }else {
                        $rootScope.showHeader = 5;
                    }
                    
                }
            });
        };

        $scope.getDoctorInformation = function () {
            $scope.userId = parseInt(JSON.parse($cookies.get('admdron')).userId);
            $scope.name = JSON.parse($cookies.get('admdron')).firstName.replaceAll("+"," ");
            DoctorResource.find({
                doctorId: $scope.userId
            }, function (data) {
                if (data.isPasswordRestored) {
                    $state.go("pages.doctor");
                } else {
                    $rootScope.showHeader = 1;
                }
            });
        };

        $scope.restorePassword = function () {
            $scope.inProcess = true;
            $scope.showError = false;
            $scope.errorUpdate = false;
            if ($scope.password === $scope.confirmPassword) {
                let req = {
                    newPassword: $scope.password,
                    newPasswordConfirm: $scope.confirmPassword
                }
                RestorePasswordResource.restore(req, function (res) {
                    if (res.code == 200) {
                        swal({
                            title: translationPrefered.OPER,
                            text: translationPrefered.PASSWORD_RESTARTED,
                            type: 'success',
                            confirmButtonText: translationPrefered.buttonOK
                        });
                        $rootScope.showHeader = 1;
                        var rol = JSON.parse($cookies.get('admdron')).authz.roles[0];
                        if(rol === 'PATIENT'){
                            $state.go("pages.patient");
                        }else{
                            $state.go("pages.doctor");
                        }
                        
                    } else {
                        $scope.inProcess = false;
                        $scope.showError = true;
                    }
                },function (error) {
                    $scope.inProcess = false;
                    $scope.showError = true;
                    $scope.errorUpdate = false;
                    if(error.data.code == 406){
                        $scope.errorUpdate = true;
                    }

                  });
            } else {
                $scope.inProcess = false;
                $scope.showError = true;
            }
        };
    })
    .controller('ValidatorLoginCtrl', function ($scope, $cookies, $state, $rootScope, PatientResource, RestorePasswordResource, DoctorResource) {
        $scope.validProcess = true;
        $scope.eye = "fa fa-eye fa-lg";
        $scope.showPassword = false;

        $scope.regex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%^*#?&=])[A-Za-z\\d@$!%*#?&]{6,30}$";
      
    })
    .controller('ValidatorPasswordCtrl', function ($scope, $cookies, $state, $rootScope, PatientResource, ValidatorPassword, DoctorResource,LoginResource,$security,$window,domainName) {
        $scope.validProcess = true;
        $scope.eye = "fa fa-eye fa-lg";
        $scope.showPassword = false;
        $scope.alreadyExist = false;

        $scope.getPatientInformation = function () {
            $scope.userId = parseInt(JSON.parse($cookies.get('admdron')).userId);
            $scope.name = JSON.parse($cookies.get('admdron')).firstName.replaceAll("+"," ");
            PatientResource.find({
                patientId: $scope.userId
            }, function (data) {
                $scope.corporateGDPR = data.corporateGDPR;
            });
        };

        var regexWeak = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,30}$");

        var regexStrong = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%^*#?&=])[A-Za-z\\d@$!%*#?&]{6,30}$");
            
        var regexMedium = new RegExp("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{6,16}$");

        var element = document.getElementById('progressBar');

        $scope.patternAccepted = false;

        $scope.validationInputPwdText = function(value) {
            if (regexStrong.test(value)) {
                element.style["width"] = "100%"; 
                element.innerHTML  = translationPrefered.HIGH_COMPLEX;
                element.className = "progress-bar progress-bar-success";
                
                $scope.patternAccepted = true;
                
            } else if (regexMedium.test(value)) {
                element.style["width"] = "60%";
                element.className = "progress-bar progress-bar-info"; 
                element.innerHTML  = translationPrefered.MEDIUM_COMPLEX;
                if($scope.corporateGDPR){
                    $scope.patternAccepted = false;
                }else{
                    $scope.patternAccepted = true;
                }
            } else if (regexWeak.test(value)) {
                element.style["width"] = "30%";
                element.className = "progress-bar progress-bar-warning"; 
                element.innerHTML  = translationPrefered.LOW_COMPLEX;
                if($scope.corporateGDPR){
                    $scope.patternAccepted = false;
                }else{
                    $scope.patternAccepted = true;
                }
            }else {
                element.style["width"] = "0%"; 
                element.className = "progress-bar progress-bar-danger"; 
                element.innerHTML  = "";
                if($scope.corporateGDPR){
                    $scope.patternAccepted = false;
                }else{
                    $scope.patternAccepted = true;
                }
            }
          };
        
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

        $scope.confirmValidator = function () {
            $scope.inProcess = true;
            $scope.showError = false;
            $scope.errorUpdate = false;
            if ($scope.email === $scope.confirmemail) {
                let req = {
                    email: $scope.confirmemail,
                    emailConfirm: $scope.confirmemail,
                    password: $scope.password,
                    statusValidator: 2
                }
                ValidatorPassword.validator(req, function (res) {
                    if (res.code == 200) {
                        swal({
                            title: translationPrefered.OPER,
                            text: translationPrefered.PASSWORD_RESTARTED,
                            type: 'success',
                            confirmButtonText: translationPrefered.buttonOK
                        });
                        $rootScope.showHeader = 2;
                        var rol = JSON.parse($cookies.get('admdron')).authz.roles[0];
                        logout();
                    } else {
                        $scope.inProcess = false;
                        $scope.showError = true;
                    }
                },function (error) {
                    $scope.inProcess = false;
                    $scope.showError = true;
                    $scope.errorUpdate = false;
                    if(error.data.code == 406){
                        $scope.errorUpdate = true;
                        $scope.alreadyExist = true;
                    }else{
                        $scope.alreadyExist = true;
                    }

                  });
            } else {
                $scope.inProcess = false;
                $scope.showError = true;
            }
        };

        $scope.skipValidator = function () {
            let req = {
                newEmail: $scope.confirmemail,
                confirmEmail: $scope.confirmemail,
                newPassword: $scope.password,
                statusValidator: 1
            }

            ValidatorPassword.setStatus(req, function (res) {
                if (res.code == 200) {
                    $state.go("pages.patient");
                }
            });
        };

        function logout() {
            LoginResource.logout(function(response){
                $security.logout();
                $window.location = domainName + 'views/logout.php?type=Paciente';
            });
        }



    })
    .controller('LoginValidatorCtrl', function ($scope, $cookies, $state, $rootScope, PatientResource, ValidatorPassword, DoctorResource) {
        $scope.validProcess = true;
        $scope.eye = "fa fa-eye fa-lg";
        $scope.showPassword = false;
        $scope.messageError = "";
        $scope.showError = false;


        $scope.regex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%^*#?&=])[A-Za-z\\d@$!%*#?&]{6,30}$";

        $scope.tooglePassword = function () {
            if ($scope.showPassword) {
                $scope.eye = "fa fa-eye fa-lg";
                $("#password").attr('type', 'password');
                $scope.showPassword = false;
            } else {
                $scope.eye = "fa fa-eye-slash fa-lg";
                $("#password").attr('type', 'text');
                $scope.showPassword = true;
            }
        };

        $scope.getPatientInformation = function () {
            $scope.userId = parseInt(JSON.parse($cookies.get('admdron')).userId);
            $scope.name = JSON.parse($cookies.get('admdron')).firstName.replaceAll("+"," ");
            PatientResource.find({
                patientId: $scope.userId
            }, function (data) {
                $scope.validatorStatus = data.validatorStatus;
            });
        };

        $scope.validatorLogin = function () {
            $scope.inProcess = true;
            $scope.showError = false;
            $scope.errorUpdate = false;

            let req = {
                validatorPassword: $scope.password,
            }
            ValidatorPassword.loginValidator(req, function (res) {
                if (res.code == 200) {
                    swal({
                        title: translationPrefered.OPER,
                        text: translationPrefered.PASSWORD_RESTARTED,
                        type: 'success',
                        confirmButtonText: translationPrefered.buttonOK
                    });
                    $rootScope.showHeader = 2;
                    var rol = JSON.parse($cookies.get('admdron')).authz.roles[0];
                    $state.go("pages.patient");
                } else {
                    $scope.showError = true;
                    $scope.attemptsRemaining = res.attemptsRemaining;
                    $scope.messageError = translationPrefered.label_DatosInco_Intentos +" " + res.attemptsRemaining;
                    if(res.attemptsRemaining == 0){
                        $state.go("pages.reset-validator");
                    }
                }
            });
        };
    })
    .directive('starRating', starRating)
    .directive("formatDate", function(){
    return {
    require: 'ngModel',
        link: function(scope, elem, attr, modelCtrl) {
        modelCtrl.$formatters.push(function(modelValue){
            return new Date(modelValue);
        })
        }
    }
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

function starRating() {
    return {
        restrict: 'EA',
        template: '<ul class="star-rating" ng-class="{readonly: readonly}">' + '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' + '    <i class="fa fa-star"></i>' + // or &#9733
            '  </li>' + '</ul>',
        scope: {
            ratingValue: '=ngModel',
            max: '=?', // optional (default is 5)
            onRatingSelect: '&?',
            readonly: '=?'
        },
        link: function (scope, element, attributes) {
            if (scope.max == undefined) {
                scope.max = 5;
            }

            function updateStars() {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };
            scope.toggle = function (index) {
                if (scope.readonly == undefined || scope.readonly === false) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelect({
                        rating: index + 1
                    });
                }
            };
            scope.$watch('ratingValue', function (oldValue, newValue) {
                if (newValue) {
                    updateStars();
                }
            });
        }
    };
}

function getLogObject(appointment, isError, logText) {
    var req = {
        medicalAppointmentId: appointment,
        isError: isError,
        logText: logText
    };
    infoLog(req);
    return req;
}

function showNotify(textNotification, typeNotification) {
    $.notify({
        title: '<strong>'+translationPrefered.AVISO+'</strong><br>',
        message: textNotification,
        icon: 'glyphicon glyphicon-warning-sign'
    }, {
        type: typeNotification,
        delay: 5000,
        allow_dismiss: true,
        animate: {
            enter: 'animated fadeInRight',
            exit: 'animated fadeOutRight',
        },
        placement: {
            from: 'bottom'
        }
    });
}

function readURL(inputName, imagePreview) {
    let input = $(inputName)[0];
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(imagePreview).css('background-image', 'url(' + e.target.result + ')');
            $(imagePreview).hide();
            $(imagePreview).fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
};

function showSwal(type, title, text) {
  swal({
    type: type,
    title: title,
    text: text
  });
};