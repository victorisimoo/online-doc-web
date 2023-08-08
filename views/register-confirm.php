<?php
include_once ('../config/constantes.php');

echo "
<script type='text/javascript'>
    var apiURLBaseJS = '".constant('API_URL_BASE')."';
    var domainBaseJS = '".constant('DOMAIN_BASE')."';
    var webSiteName = '".constant('WEB_SITE_NAME')."';
    var URLBase = '".constant('URL_BASE')."';
    var login = '".constant('PAGINA_PACIENTE')."';
    var debugMode = '".constant('DEBUG_MODE')."';
    var appVersionName = '".$appVersionName."';
    var appName = '".$appName."';
    debugMode = JSON.parse(debugMode);
</script>
";

//header('Access-Control-Allow-Origin: *');
//header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
//header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

?>

<!DOCTYPE html>
<!--[if IE 9 ]><html class="ie9" data-ng-app="materialAdmin" data-ng-controller="materialadminCtrl as mactrl"><![endif]-->
<![if IE 9 ]>
<html data-ng-app="materialAdmin">
<![endif]>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Doctor Online - Habla con un médico ahora</title>
    <!-- Faviconos -->
    <link rel="apple-touch-icon" sizes="180x180" href="../css/brands/doctorvirtual/tabicon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../css/brands/doctorvirtual/tabicon.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../css/brands/doctorvirtual/tabicon.png">
    <link rel="mask-icon" href="../css/brands/doctorvirtual/tabicon.png" color="#28b473">
    <link rel="shortcut icon" href="../css/brands/doctorvirtual/tabicon.png">
    <meta name="msapplication-TileColor" content="#28b473">
    <meta name="msapplication-config" content="../img/iconos/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">
    <!-- Vendor CSS -->
    <link href="../private/vendors/bower_components/animate.css/animate.min.css" rel="stylesheet">
    <link
        href="../private/vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css"
        rel="stylesheet">
    <link href="../private/vendors/bower_components/sweetalert/dist/sweetalert.css" rel="stylesheet">
    <!-- CSS -->
    <link href="../private/css/app.min.1.css" rel="stylesheet" id="app-level">
    <link href="../private/css/app.min.2.css" rel="stylesheet">
    <link href="../private/css/demo.css" rel="stylesheet">
    <link href="../private/css/bootstrap-select.min.css" rel="stylesheet">
    <link href="../private/css/font-awesome.min.css" rel="stylesheet">
    <link href="../private/vendors/bower_components/font-open-sans/open-sans.css" rel="stylesheet">
    <link rel="stylesheet" ng-href="../css/brands/doctorvirtual/main.css">
    <link href="../css/brands/doctorvirtual/retail.css" rel="stylesheet">
    <link rel="stylesheet" href="../private/vendors/bower_components/angular-material/angular-material.min.css">
    <link href="../private/css/intlTelInput.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            background: #fff !important;
        }
    </style> <!-- Global site tag (gtag.js) - Google Ads: 726845860 -->
    <!-- Global site tag (gtag.js) - Google Ads: 726845860 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-726845860"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'AW-726845860');
    </script>

</head>
<body data-ng-class="{ 'sw-toggled': mactrl.layoutType === '1'}">
    <?php include_once ('layout/retailConfirmHeader.html'); ?>
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
    <script src="../private/vendors/bower_components/jquery/dist/jquery.min.js"></script>
    <script src="../private/vendors/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="../private/vendors/bower_components/js-cookie/src/js.cookie.js"></script>


    <!-- Angular -->
    <script src="../private/vendors/bower_components/angular/angular.min.js"></script>
    <script src="../private/vendors/bower_components/angular-animate/angular-animate.min.js"></script>
    <script src="../private/vendors/bower_components/angular-resource/angular-resource.min.js"></script>
    <script src="../private/vendors/bower_components/angular-cookies/angular-cookies.min.js"></script>
    <script src="../private/vendors/bower_components/angular-aria/angular-aria.min.js"></script>
    <script src="../private/vendors/bower_components/angular-messages/angular-messages.min.js"></script>
    <script src="../private/lib/cleave-angular.min.js"></script>
    <!-- Angular Material Library -->
    <script src="../private/vendors/bower_components/angular-material/angular-material.min.js"></script>

    <!-- Angular Modules -->
    <script src="../private/vendors/bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="../private/vendors/bower_components/oclazyload/dist/ocLazyLoad.min.js"></script>
    <script src="../private/vendors/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
    <script src="../private/vendors/bower_components/ngsecurity/dist/ngsecurity.js"></script>
    <script src="../private/vendors/bower_components/angular-translate/angular-translate.min.js"></script>



    <!-- Common Vendors -->
    <script src="../private/vendors/bower_components/sweetalert/dist/sweetalert.min.js"></script>
    <script src="../private/vendors/bower_components/Waves/dist/waves.min.js"></script>

    <!-- Using below vendors in order to avoid misloading on resolve -->
    <script src="../private/vendors/bower_components/flot/jquery.flot.js"></script>
    <script src="../private/vendors/bower_components/flot/jquery.flot.resize.js"></script>
    <script src="../private/vendors/bower_components/moment/min/moment.min.js"></script>
    <script src="../private/lib/intlTelInput.js"></script>
    <script src="../private/lib/utils.js"></script>
    <script src="../private/lib/ng-intl-tel-input.min.js"></script>


    <!-- App level -->
    <script src="../js/dronline_retail/app.js?random=<?php echo uniqid(); ?>"></script>
    <script src="../js/retail-confirm-controller.js?random=<?php echo uniqid(); ?>"></script>
    <script src="../js/security_suscribe.js?random=<?php echo uniqid(); ?>"></script>
    <script src="../js/dronline_retail/factories.js?random=<?php echo uniqid(); ?>"></script>
    <script src="../private/js/services.js?random=<?php echo uniqid(); ?>"></script>
    <script src="../js/translations/translation.js?random=<?php echo uniqid(); ?>"></script>

    <!-- Offline Module-->
    <script src="../js/offline/offline.min.js"></script>
    <link href="../js/offline/themes/offline-theme-dark.css" rel="stylesheet">
    <link href="../js/offline/themes/offline-language-spanish.css" rel="stylesheet">
    <!--<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>-->
    <script src="../js/OneSignalSDK.js" async=""></script>
    <script>
        var d = new Date();
        d.setFullYear(d.getFullYear() + 10);
        //document.cookie = "corpname=dronline;expires="+d+";path=/";
        document.cookie = "language=es;expires="+d+";path=/";
        document.cookie = "oneSignalInitialized=false;path=/";
        //document.cookie ="logo=../img/dronline.png;expires="+d+";path=/";
        document.cookie ="buttons=btn btn-xs btn-danger;expires="+d+";path=/";
    </script>
</body>

</html>