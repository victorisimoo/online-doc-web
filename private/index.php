<?php
ob_start();
include_once ('../config/constantes.php');
echo "
<script type='text/javascript'>
    var apiURLBaseJS = '".constant('API_URL_BASE')."';
    var domainBaseJS = '".constant('DOMAIN_BASE')."';
    var webSiteName = '".constant('WEB_SITE_NAME')."';
    var URLBase = '".constant('URL_BASE')."';
    var rutaAudiofile = '".constant('URL_AUDIO_FILE')."';
    var debugMode = '".constant('DEBUG_MODE')."';
    var enableSpeedTest = '".constant('ENABLE_SPEED_TEST')."';
    const movilPatientLogin = '".constant('MOVIL_PATIENT_HOME')."';
    debugMode = JSON.parse(debugMode);
    enableSpeedTest = JSON.parse(enableSpeedTest);
</script>
";
if (!isset($_COOKIE['admdron'])) {
    header('Location: ../views/logout.php?type=home');
}
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
ob_end_flush();
?>
<!DOCTYPE html>
<!--[if IE 9 ]><html class="ie9" data-ng-app="materialAdmin" data-ng-controller="materialadminCtrl as mactrl"><![endif]-->
<![if IE 9 ]><html data-ng-app="materialAdmin" data-ng-controller="materialadminCtrl as mactrl"><![endif]>

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">
        <title ng-bind="titulo" ng-show="titulo"></title>
        <link rel="icon" type="image/png" href="../css/brands/<?php echo $_COOKIE['corpclass']; ?>/tabicon.png">
        <!-- Vendor CSS -->
        <link href="vendors/bower_components/animate.css/animate.min.css" rel="stylesheet">
        <link href="vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel="stylesheet">
        <link href="vendors/bower_components/sweetalert/dist/sweetalert.css" rel="stylesheet">
        <link href="vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css" rel="stylesheet">


        <!-- CSS -->
        <link href="css/app.min.1.css" rel="stylesheet" id="app-level">
        <link href="css/app.min.2.css" rel="stylesheet">
        <link href="css/select.min.css" rel="stylesheet">
        <link href="css/customSelect.css" rel="stylesheet">
        <link href="css/intlTelInput.css" rel="stylesheet">
        <link href="css/ngGallery.css" rel="stylesheet">
        <link href="css/demo.css" rel="stylesheet">
        <link href="css/bootstrap-select.min.css" rel="stylesheet">
        <link href="css/toast-alert.css" rel="stylesheet">
        <link href="vendors/bower_components/star-rating/star-rating.css" rel="stylesheet">
        <link href="css/font-awesome.min.css" rel="stylesheet">
        <link href="vendors/bower_components/font-open-sans/open-sans.css" rel="stylesheet">
        <link href="" rel="stylesheet" type="text/css" id="corporateStyle" />

        <link rel="stylesheet" ng-href="../css/brands/{{globalBrand}}/main.css">
        <link rel="stylesheet" href="vendors/bower_components/angular-material/angular-material.min.css">
        <!--Full calendar-->
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/main.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/main.css">
        <style>
            body {
                font-family: 'Open Sans', sans-serif;
            }
            #newPasswordChange:after , #newPassword:after, #newPasswordConfirm:after{
                background-color: #e0e0e0 !important;
            }
        </style>
    </head>

    <body data-ng-class="{ 'sw-toggled': mactrl.layoutType === '1'}">

        <data ui-view></data>

        <!-- Older IE warning message -->
        <!--[if lt IE 9]>
            <div class="ie-warning">
                <h1 class="c-white">Warning!!</h1>
                <p>You are using an outdated version of Internet Explorer, please upgrade <br/>to any of the following web browsers to access this website.</p>
                <div class="iew-container">
                    <ul class="iew-download">
                        <li>
                            <a href="http://www.google.com/chrome/">
                                <img src="img/browsers/chrome.png" alt="">
                                <div>Chrome</div>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.mozilla.org/en-US/firefox/new/">
                                <img src="img/browsers/firefox.png" alt="">
                                <div>Firefox</div>
                            </a>
                        </li>
                        <li>
                            <a href="http://www.opera.com">
                                <img src="img/browsers/opera.png" alt="">
                                <div>Opera</div>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.apple.com/safari/">
                                <img src="img/browsers/safari.png" alt="">
                                <div>Safari</div>
                            </a>
                        </li>
                        <li>
                            <a href="http://windows.microsoft.com/en-us/internet-explorer/download-ie">
                                <img src="img/browsers/ie.png" alt="">
                                <div>IE (New)</div>
                            </a>
                        </li>
                    </ul>
                </div>
                <p>Sorry for the inconvenience!</p>
            </div>
        <![endif]-->


        <!-- Core -->
        <script src="vendors/bower_components/jquery/dist/jquery.min.js"></script>
        <script src="vendors/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="../js/functions.js?random=<?php echo uniqid(); ?>"></script>
        <script src="js/bootstrap-select.js"></script>
        <script src="vendors/bower_components/js-cookie/src/js.cookie.js"></script>


        <!-- Angular -->
        <script src="vendors/bower_components/angular/angular.min.js"></script>
        <script src="vendors/bower_components/angular-sanitize/angular-sanitize.min.js"></script>
        <script src="vendors/bower_components/angular-animate/angular-animate.min.js"></script>
        <script src="vendors/bower_components/angular-resource/angular-resource.min.js"></script>
        <script src="vendors/bower_components/angular-cookies/angular-cookies.min.js"></script>
        <script src="vendors/bower_components/angular-aria/angular-aria.min.js"></script>
        <script src="vendors/bower_components/angular-messages/angular-messages.min.js"></script>
        <!-- Angular Material Library -->
        <script src="vendors/bower_components/angular-material/angular-material.min.js"></script>

        <!-- Angular Modules -->
        <script src="vendors/bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
        <script src="vendors/bower_components/angular-loading-bar/build/loading-bar.min.js"></script>
        <script src="vendors/bower_components/oclazyload/dist/ocLazyLoad.min.js"></script>
        <script src="vendors/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
        <script src="vendors/bower_components/angular-mocks/angular-mocks.js"></script>
        <script src="vendors/bower_components/ngsecurity/dist/ngsecurity.js"></script>
        <script src="vendors/bower_components/angular-translate/angular-translate.min.js"></script>
        <script src="lib/cleave-angular.min.js"></script>



        <!-- Common Vendors -->
        <script src="vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js"></script>
        <script src="vendors/bower_components/sweetalert/dist/sweetalert.min.js"></script>
        <script src="vendors/bower_components/Waves/dist/waves.min.js"></script>
        <script src="vendors/bootstrap-growl/bootstrap-growl.min.js"></script>
        <script src="vendors/bower_components/ng-table/dist/ng-table.min.js"></script>
        <script src="vendors/input-mask/input-mask.js"></script>

        <!-- Using below vendors in order to avoid misloading on resolve -->
        <script src="vendors/bower_components/flot/jquery.flot.js"></script>
        <script src="vendors/bower_components/flot.curvedlines/curvedLines.js"></script>
        <script src="vendors/bower_components/flot/jquery.flot.resize.js"></script>
        <script src="vendors/bower_components/moment/min/moment.min.js"></script>
        <script src="vendors/bower_components/moment/min/moment-with-locales.min.js"></script>
        <script src="vendors/bower_components/flot-orderBars/js/jquery.flot.orderBars.js"></script>
        <script src="vendors/bower_components/flot/jquery.flot.pie.js"></script>
        <script src="vendors/bower_components/flot.tooltip/js/jquery.flot.tooltip.min.js"></script>
        <script src="vendors/bower_components/angular-nouislider/src/nouislider.min.js"></script>
        <script src="vendors/bower_components/ng-password-strength/scripts/vendor.js"></script>
        <script src="vendors/bower_components/ng-password-strength/scripts/ng-password-strength.min.js"></script>
        <script src="vendors/bower_components/angular-file-upload/angular-file-upload.min.js"></script>
        <script src="lib/select.min.js"></script>
        <script src="lib/intlTelInput.js"></script>
        <script src="lib/utils.js"></script>
        <script src="lib/ng-intl-tel-input.min.js"></script>
        <script src="lib/imageviewer.js"></script>
        <script src="lib/lodash.js"></script>

        <!-- App level -->
        <script src="js/app.js?random=<?php echo uniqid(); ?>"></script>
        <script src="js/config.js?random=<?php echo uniqid(); ?>"></script>
        <script src="js/config.security.js?random=<?php echo uniqid(); ?>"></script>
        <script src="js/services/factories.js?random=<?php echo uniqid(); ?>"></script>
        <script src="js/services.js?random=<?php echo uniqid(); ?>"></script>
        <script src="js/controllers/main.js?random=<?php echo uniqid(); ?>"></script>
        <script src="js/fileupload.js?random=<?php echo uniqid(); ?>"></script>
        <script src="../config/statesEnum.js?random=<?php echo uniqid(); ?>"></script>
        <script src="../config/doctorHistoryConstantes.js?random=<?php echo uniqid(); ?>"></script>

        <script src="../js/translations/translation.js?random=<?php echo uniqid(); ?>"></script>
        <script src="lib/jquery.payment.min.js?random=<?php echo uniqid(); ?>"></script>
        <script src="lib/notify.js?random=<?php echo uniqid(); ?>"></script>
        <script src="lib/logs.js?random=<?php echo uniqid(); ?>"></script>
        <script src="js/speedTest.js?random=<?php echo uniqid(); ?>"></script>
        <script src="lib/customSelect.js"></script>

        <!-- Template Modules -->
        <script src="js/modules/template.js"></script>
        <script src="js/modules/ui.js"></script>
        <script src="js/modules/charts/flot.js"></script>
        <script src="js/modules/charts/other-charts.js"></script>
        <script src="js/modules/form.js"></script>
        <script src="js/modules/media.js"></script>
        <script src="js/modules/components.js"></script>
        <script src="js/modules/calendar.js"></script>
        <script src="js/modules/calendar-lang-all.js"></script>
        <script src="js/modules/demo.js"></script>
        <!--<script src="https://sdk.amazonaws.com/js/aws-sdk-2.283.1.min.js"></script>-->
        <script src="js/aws-sdk-2.283.1.min.js"></script>

        <!-- Offline Module-->
        <script src="../js/offline/offline.min.js"></script>
        <link href="../js/offline/themes/offline-theme-dark.css" rel="stylesheet">
        <link href="../js/offline/themes/offline-language-spanish.css" rel="stylesheet">
        <!--<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>-->
        <script src="../js/OneSignalSDK.js" async=""></script>

        <script src='https://unpkg.com/react@16/umd/react.development.js'></script>
        <script src='https://unpkg.com/react-dom@16/umd/react-dom.development.js'></script>
        <script src='https://unpkg.com/prop-types@15.6.1/prop-types.js'></script>
        <script src='https://unpkg.com/react-webcam@next/dist/react-webcam.min.js'></script>

        <script src="lib/ngGallery.js"></script>

        <!--Full Calendar-->
        <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/main.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/main.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/locales-all.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.1/locales-all.js"></script>

    </body>
</html>
