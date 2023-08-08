<?php
include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'Registro';
//echo date_format(date_create_from_format('d/m/Y', '18/04/1985'), 'c');
$msg = '';
if (isset($_POST['firstName'])) {
    $url = constant('API_DOCTOR') . 'doctor';	
    $headers = array(
        "Content-Type: application/json",
    );
    $data_to_post = array();
    $person = array(
        'firstName' => $_POST['firstName'],
        'lastName' => $_POST['lastName'],
        'gender' => $_POST['gender'],
        'birthday' => date_format(date_create_from_format('d/m/Y', $_POST['birthday']), 'Y-m-d').'T00:00:00.000'
    );
    $data_to_post['person'] = $person;
    $data_to_post['email'] = $_POST['email'];
    $data_to_post['password'] = $_POST['password'];
    $country = array(
        'countryId' => 1
    );
    $data_to_post['country'] = $country;
    $language = array(
        'languageId' => 1
    );
    $data_to_post['language'] = $language;
    $speciality = array(
        'specialityId' => $_POST['speciality']
    );
    $data_to_post['speciality'] = $speciality;
    $university = array(
        'universityId' => 1
    );
    $data_to_post['university'] = $university;

    $data_string = json_encode($data_to_post);
	//echo $data_string;
    $handle = curl_init();
    curl_setopt($handle, CURLOPT_URL, $url);
    curl_setopt($handle, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($handle, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 0); // On dev server only!
    curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
    $result = curl_exec($handle);
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    $doctor = json_decode($result);
    if ($httpCode == 200) {
        $url = constant('API_ADMIN') . 'parameter/findByName?name=FILE_PATH';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);
        curl_close($ch);

        $path = json_decode($response)->value . '/doctor-cv/' . $doctor->person->personId;
        if (!is_dir($path)) {
            mkdir($path, 0777, true);
        }
        $path = $path . "/" . $_FILES['cv-file']['name'];

        move_uploaded_file($_FILES['cv-file']['tmp_name'], $path);

        $url = constant('API_ADMIN') . 'file-item/doctor-cv/' . $doctor->person->personId;
        $ch = curl_init();
        $doctorCV = array(
            'fileName' => $_FILES['cv-file']['name'],
            'mimeType' => $_FILES['cv-file']['type'],
            'fileSize' => $_FILES['cv-file']['size'],
            'path' => $path
        );
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($doctorCV));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        curl_close($ch);

        header('Location: pending-confirm.php');
    } else {
        echo "<div class=\"alert alert-danger alert-error text-center\">";
        echo "<i class=\"fa fa-exclamation-triangle icons pull-left\"></i>Ocurrió un problema al crear usuario";
        echo '</div>';
    }
}
?>
<!DOCTYPE html>
<!--[if IE 9 ]><html class="ie9" data-ng-app="materialAdmin" data-ng-controller="RegisterController"><![endif]-->
<![if IE 9 ]><html data-ng-app="materialAdmin" data-ng-controller="RegisterController"><![endif]>

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Doctor Online - Registro Doctor</title>
        <link rel="icon" type="image/png" href="img/icono_pestania.png">
        <!-- Vendor CSS -->
        <link href="../private/vendors/bower_components/animate.css/animate.min.css" rel="stylesheet">
        <link href="../private/vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel="stylesheet">
        <link href="../private/vendors/bower_components/bootstrap-sweetalert/lib/sweet-alert.css" rel="stylesheet">
        <link href="../private/vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css" rel="stylesheet">

        <!-- CSS -->
        <link href="../private/css/app.min.1.css" rel="stylesheet" id="app-level">
        <link href="../private/css/app.min.2.css" rel="stylesheet">
        <link href="../private/css/demo.css" rel="stylesheet">
        <link href="../private/vendors/bower_components/star-rating/star-rating.css" rel="stylesheet">
        <link href="../private/css/font-awesome.min.css" rel="stylesheet">
        <link href="../private/vendors/bower_components/font-open-sans/open-sans.css" rel="stylesheet">
        <link rel="stylesheet" href="../private/vendors/bower_components/angular-material/angular-material.min.css">
        <style>
            .divider {
                border-top: 1px solid #d9dadc;
                display: block;
                line-height: 1px;
                margin: 15px 0;
                position: relative;
                text-align: center;
            }
            .divider .divider-title {
                background: #fff;
                font-size: 12px;
                letter-spacing: 1px;
                padding: 0 20px;
                text-transform: uppercase;
            }
            a, a:focus, a:hover {
                text-decoration: none;
            }
            a {
                color: #2ebd59;
            }
            a {
                background-color: transparent;
            }
            body {
                font-family: 'Open Sans', sans-serif;
            }
        </style>
    </head>

    <body style="background-color: rgb(255, 255, 255); text-align: center;">

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

        <!-- Angular -->
        <script src="../private/vendors/bower_components/angular/angular.min.js"></script>
        <script src="../private/vendors/bower_components/angular-animate/angular-animate.min.js"></script>
        <script src="../private/vendors/bower_components/angular-resource/angular-resource.min.js"></script>
        <script src="../private/vendors/bower_components/angular-cookies/angular-cookies.min.js"></script>        
        <script src="../private/vendors/bower_components/angular-aria/angular-aria.min.js"></script>
        <script src="../private/vendors/bower_components/angular-messages/angular-messages.min.js"></script>
        <!-- Angular Material Library -->
        <script src="../private/vendors/bower_components/angular-material/angular-material.min.js"></script>

        <!-- Angular Modules -->
        <script src="../private/vendors/bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
        <script src="../private/vendors/bower_components/angular-loading-bar/build/loading-bar.min.js"></script>
        <script src="../private/vendors/bower_components/oclazyload/dist/ocLazyLoad.min.js"></script>
        <script src="../private/vendors/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
        <script src="../private/vendors/bower_components/angular-mocks/angular-mocks.js"></script>
        <script src="../private/vendors/bower_components/ngsecurity/dist/ngsecurity.js"></script>


        <!-- Common Vendors -->
        <script src="../private/vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js"></script>
        <script src="../private/vendors/bower_components/bootstrap-sweetalert/lib/sweet-alert.min.js"></script>
        <script src="../private/vendors/bower_components/Waves/dist/waves.min.js"></script>
        <script src="../private/vendors/bootstrap-growl/bootstrap-growl.min.js"></script>
        <script src="../private/vendors/bower_components/ng-table/dist/ng-table.min.js"></script>


        <!-- Using below vendors in order to avoid misloading on resolve -->
        <script src="../private/vendors/bower_components/flot/jquery.flot.js"></script>
        <script src="../private/vendors/bower_components/flot.curvedlines/curvedLines.js"></script>
        <script src="../private/vendors/bower_components/flot/jquery.flot.resize.js"></script>
        <script src="../private/vendors/bower_components/moment/min/moment.min.js"></script>
        <script src="../private/vendors/bower_components/fullcalendar/dist/fullcalendar.min.js"></script>
        <script src="../private/vendors/bower_components/flot-orderBars/js/jquery.flot.orderBars.js"></script>
        <script src="../private/vendors/bower_components/flot/jquery.flot.pie.js"></script>
        <script src="../private/vendors/bower_components/flot.tooltip/js/jquery.flot.tooltip.min.js"></script>
        <script src="../private/vendors/bower_components/angular-nouislider/src/nouislider.min.js"></script>
        <script src="../private/vendors/bower_components/ng-password-strength/scripts/vendor.js"></script>
        <script src="../private/vendors/bower_components/ng-password-strength/scripts/ng-password-strength.min.js"></script>


        <!-- App level -->
        <script src="../private/js/app.js"></script>
        <script src="../js/config-doc.js"></script>

        <!-- Template Modules -->
        <script src="../private/js/modules/template.js"></script>
        <script src="../private/js/modules/ui.js"></script>
        <script src="../private/js/modules/charts/flot.js"></script>
        <script src="../private/js/modules/charts/other-charts.js"></script>
        <script src="../private/js/modules/form.js"></script>
        <script src="../private/js/modules/media.js"></script>
        <script src="../private/js/modules/components.js"></script>
        <script src="../private/js/modules/calendar.js"></script>
        <script src="../private/js/modules/demo.js"></script>  
        <script>
            $(document).ready(function () {
                $(".md-datepicker-input").attr("name", "birthday")
            });
        </script>
    </body>
</html>