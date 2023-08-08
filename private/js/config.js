materialAdmin
.constant('authApi', apiURLBaseJS+'dronline-security-api/api/')
.constant('adminApi', apiURLBaseJS+'dronline-admin-api/api/')
.constant('patientApi', apiURLBaseJS+'dronline-patient-api/api/')
.constant('billingApi', apiURLBaseJS+'dronline-billing-api/api/')
.constant('doctorApi', apiURLBaseJS+'dronline-doctor-api/api/')
.constant('ratingApi', apiURLBaseJS+'dronline-rating-api/api/')
.constant('integrationApi', apiURLBaseJS+'dronline-integration-api/api/')
.constant('callApi', apiURLBaseJS+'dronline-call-api/')
.constant('messageApi', apiURLBaseJS+'dronline-message-api/api/')
.constant('firebaseApi', apiURLBaseJS+'dronline-firebase-api/api/')
.constant('appointmentApi', apiURLBaseJS+'dronline-appointment-api/api/')
        /*.constant('authApi', apiURLBaseJS+'dronline-security-api/api/')
        .constant('adminApi', apiURLBaseJS+'dronline-admin-api/api/')
        .constant('patientApi', apiURLBaseJS+'dronline-patient-api/api/')
        .constant('billingApi', apiURLBaseJS+'dronline-patient-api/api/')
        .constant('doctorApi', apiURLBaseJS+'dronline-doctor-api/api/')
        .constant('ratingApi', apiURLBaseJS+'dronline-rating-api/api/')*/
        .constant('domainName', 'https://'+domainBaseJS+'/'+webSiteName)

        .run(function ($rootScope, $cookies, domainName) {
            var max = new Date();
            max = max.setDate(max.getDate() - 1);
            $rootScope.domainName = domainName;
            $rootScope.rootMinBirthday = new Date(1900, 0, 1);
            $rootScope.rootMaxBirthday = new Date(max);
            $rootScope.currentUser = "";
            $rootScope.language="fr";
            var corpname = $cookies.get("corpclass");
            if(typeof corpname != 'undefined' && corpname != null){
               $rootScope.globalBrand = corpname;
           }else{
            $rootScope.globalBrand = "vanilla";
        }

    })

        .filter('to_trusted', ['$sce', function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }])
        .config(['$translateProvider', function($translateProvider) {
            $translateProvider.translations('translation', JSON.parse(localStorage.getItem('translation')));
            $translateProvider.preferredLanguage('translation');
            translationPrefered = JSON.parse(localStorage.getItem('translation'));
            $translateProvider.useLoader('translationLoader');            
            $translateProvider.useSanitizeValueStrategy(null);
        }])
        .run(['customSelectDefaults', function(customSelectDefaults) {
            customSelectDefaults.displayText = translationPrefered.SEARCH;
            customSelectDefaults.emptyListText = translationPrefered.NO_RESULT;
            customSelectDefaults.emptySearchResultText = translationPrefered.NOT_FOUND+' "$0"';
            customSelectDefaults.addText = 'Add';
            customSelectDefaults.searchDelay = 500;
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
        .config(function ($mdDateLocaleProvider) {
            $mdDateLocaleProvider.formatDate = function (date) {
                return moment(date).format('DD/MM/YYYY');
            };
            $mdDateLocaleProvider.parseDate = function(dateString) {
                var m = moment(dateString, 'DD/MM/YYYY', true);
                return m.isValid() ? m.toDate() : new Date(NaN);
            };
        })
        .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                debug: false,
                events: true
            });
        }])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/home");
            $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                        {
                            name: 'css',
                            insertBefore: '#app-level',
                            files: ['vendors/bower_components/fullcalendar/dist/fullcalendar.min.css']
                        },
                        {
                            name: 'vendors',
                            insertBefore: '#app-level-js',
                            files: [
                            'vendors/sparklines/jquery.sparkline.min.js',
                            'vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
                            'vendors/bower_components/simpleWeather/jquery.simpleWeather.min.js'
                            ]
                        }
                        ])
                    }
                }
            })
            .state('pages', {
                url: '/pages',
                templateUrl: 'views/common.html'
            })
            .state('pages.patient', {
                url: '/patient',
                templateUrl: 'views/patient/home.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.restore', {
                url: '/restorepassword',
                templateUrl: 'views/patient/restore-password.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.validator', {
                url: '/validatorPassword',
                templateUrl: 'views/patient/validator-password.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.validator-login', {
                url: '/validatorLogin',
                templateUrl: 'views/patient/validator-login.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.restore-doctor', {
                url: '/restoredoctorpassword',
                templateUrl: 'views/doctor/restore-password.html',
                data: {
                    perms: ["doctor"]
                }
            })
            .state('pages.son', {
                url: '/son',
                templateUrl: 'views/patient/son.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.speciality', {
                url: '/speciality/:optionId',
                templateUrl: 'views/patient/speciality.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.enter-code', {
                url: '/enter-code/:optionId',
                templateUrl: 'views/patient/enter-code.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.code-successed', {
                url: '/code-successed/:optionId',
                templateUrl: 'views/patient/code-successed.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.data-analysis', {
                url: '/data-analysis',
                templateUrl: 'views/patient/data-analysis.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.medical-appointment', {
                url: '/medical-appointment',
                templateUrl: 'views/patient/medical-appointment.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.medical-appointment-connect', {
                url: '/medical-appointment-connect',
                templateUrl: 'views/patient/medical-appointment-connect.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.subscription', {
                url: '/subscription',
                templateUrl: 'views/patient/subscription.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.subactive', {
                url: '/subactive',
                templateUrl: 'views/patient/subs-active.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.patsubscription', {
                url: '/patsubscription',
                templateUrl: 'views/patient/settings-sub.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.doctor', {
                url: '/doctor',
                templateUrl: 'views/doctor/home.html',
                data: {
                    perms: ["doctor"]
                }
            })
            .state('pages.medical-appointment-doc', {
                url: '/medical-appointment-doc',
                templateUrl: 'views/doctor/medical-appointment.html',
                data: {
                    perms: ["doctor"]
                }
            })
            .state('pages.patient-doctor', {
                url: '/patient-doctor',
                templateUrl: 'js/appmodules/patient/list.html',
                data: {
                    perms: ["doctor"]
                }
            })
            .state('pages.login', {
                url: '/login',
                templateUrl: 'views/login.html'
            })
            .state('pages.rating', {
                url: '/rating/:patMedicalAppointmentId/:profileId',
                templateUrl: 'views/rating.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.rating-doc', {
                url: '/rating-doc/:patMedicalAppointmentId',
                templateUrl: 'views/rating-doc.html',
                data: {
                    perms: ["doctor"]
                }
            })
            .state('pages.update-patient-email', {
                url: '/update-patient-email/:patMedicalAppointmentId',
                templateUrl: 'views/patient/updateEmail.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.update-phone', {
                url: '/update-phone/:profileId',
                templateUrl: 'views/patient/updatePhone.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.my-doctor', {
                url: '/my-doctor/:doctorId',
                templateUrl: 'views/patient/my-doctor.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.doctor-profile', {
                url: '/doctor-profile/:doctorId',
                templateUrl: 'views/patient/doctor-profile.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.view-doctor', {
                url: '/view-doctor/:doctorId',
                templateUrl: 'views/patient/view-doctor.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.pataccount', {
                url: '/pataccount',
                templateUrl: 'views/patient/myaccount.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.profiles', {
                url: '/profiles',
                templateUrl: 'views/patient/profile/list.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.profile-add', {
                url: '/profile-add',
                templateUrl: 'views/patient/profile/view.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.profile-edit', {
                url: '/profile-edit/:profileId',
                templateUrl: 'views/patient/profile/view.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.docaccount', {
                url: '/docaccount',
                templateUrl: 'views/doctor/myaccount.php',
                data: {
                    perms: ["doctor"]
                }
            })
            .state('pages.changephoto', {
                url: '/changephoto/:changeState',
                templateUrl: 'views/doctor/change-photo.php',
                data: {
                    perms: ["doctor"]
                }
            })
            .state('pages.docprofile', {
                url: '/docprofile',
                templateUrl: 'views/doctor/profile/view.html',
                data: {
                    perms: ["doctor"]
                }
            })
            .state('pages.medcons-list', {
                url: '/medcons-list/:profileId',
                templateUrl: 'views/patient/medcons/list.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.pat-appointments', {
                url: '/pat-appointments/:profileId/:edit',
                templateUrl: 'views/doctor/patient-appointments.html',
                data: {
                    perms: ["doctor"]
                }
            })
            .state('pages.medcons-view', {
                url: '/medcons-view/:medConsId',
                templateUrl: 'views/patient/medcons/view.html',
                data: {
                    perms: ["patient"]
                }
            })
            .state('pages.calendar', {
                url: '/calendar',
                templateUrl: 'views/patient/calendar.html',
            })
            .state('pages.pharmacy', {
                url: '/pharmacy',
                templateUrl: 'views/patient/pharmacy.html'
            })
        });
