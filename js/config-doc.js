materialAdmin
        .run(function ($rootScope) {
            var max = new Date();
            max = max.setDate(max.getDate() - 1);
            $rootScope.rootMinBirthday = new Date(1900, 0, 1);
            $rootScope.rootMaxBirthday = new Date(max);
        })
        .config(function ($mdDateLocaleProvider) {
            $mdDateLocaleProvider.formatDate = function (date) {
                return moment(date).format('DD/MM/YYYY');
            };
        })
        .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
                $ocLazyLoadProvider.config({
                    debug: false,
                    events: true
                });
            }])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/register");
            $stateProvider
                    .state('register', {
                        url: '/register',
                        templateUrl: '../views/register-doc.html',
                        resolve: {
                            loadPlugin: function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    {
                                        name: 'css',
                                        insertBefore: '#app-level',
                                        files: ['../private/vendors/bower_components/fullcalendar/dist/fullcalendar.min.css']
                                    },
                                    {
                                        name: 'vendors',
                                        insertBefore: '#app-level-js',
                                        files: [
                                            '../private/vendors/sparklines/jquery.sparkline.min.js',
                                            '../private/vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
                                            '../private/vendors/bower_components/simpleWeather/jquery.simpleWeather.min.js'
                                        ]
                                    }
                                ])
                            }
                        }
                    });
        })
        .controller('RegisterController', function ($scope, $rootScope, $http) {
            $scope.birthday = $rootScope.rootMaxBirthday;
            $http({method: 'GET', url: apiURLBaseJS+'/dronline-doctor-api/api/speciality'})
                    .then(function (response) {
                        console.log(response.data);
                        $scope.specialities = response.data;
                        
                    });
        });
