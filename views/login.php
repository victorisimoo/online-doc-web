<?php
ini_set( 'session.cookie_httponly', 1 );
ob_start();
function getIp()
{
    $ip = $_SERVER['REMOTE_ADDR'];

    if (empty($ip) && !empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        // omit private IP addresses which a proxy forwarded
        $tmpIp = $_SERVER['HTTP_X_FORWARDED_FOR'];
        $tmpIp = filter_var(
            $tmpIp,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        );
        if ($tmpIp != false) {
            $ip = $tmpIp;
        }
    }
    return $ip;
}
include_once('../config/constantes.php');
$isLoggedIn = false;
if (isset($_GET['movil']) && $_GET['movil'] == 'true') {
    header('Location: ' . $movilLogin . $_GET['resource']);
}
if (isset($_COOKIE['admdron'])) {
    $isLoggedIn = true;
}
if ($_GET['resource'] == "4385e7b559064a98bf63cd3452e04c46") {
    header('Location: midoctor.php');
}
include_once('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'Login';
?>

<script src="../private/vendors/bower_components/jquery/dist/jquery.min.js"></script>
<script src="../private/vendors/bower_components/jquery-ui/jquery-ui.min.js"></script>
<script src="../private/vendors/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="../private/vendors/input-mask/input-mask.js"></script>     
<script src="../js/bootstrap-datepicker.min.js"></script>
<script src="../js/bootstrap-datepicker.el.min.js"></script>
<script src="../js/bootstrap-datepicker.es.min.js"></script>
<?php
    $codeKeyEncrypt = "Dr0$%";
    $typeMethod = "normal";
    $resource = "";
    $movil = "";
    $corporateResponse = null;
    if (isset($_GET['movil'])) {
        $movil = "true";
    } else {
        $movil = "false";
    }

    if (isset($_GET['resource']) && !empty($_GET['resource'])) {
        $resource = preg_replace('/[^-a-zA-Z0-9_]/', '', $_GET["resource"]);
        
        if (
            $resource == 'e4c4aa0f523941d2a332d15101f12e9e' ||
            $resource == '6b781f80962111eba8b30242ac130003' ||
            $resource == '395f96262ae211ec8d3d0242ac130003' ||
            $resource == '3d64ce80170f11ec96210242ac130002' ||
            $resource == '07b3dce8307411eda2610242ac120002' ||
            $resource == 'f87f8371c9c24f81a9b31738a68950e1' ||
            $resource == '12bca8b78b47461ebe4ea486820c1eff' ||
            $resource == "d63abbb251ed4666881673eccbc4ef57" ||
            $resource == "43870cab10c449d9b8c6ee53b8b5e3ae" ||
            $resource == "8df1b8111f2847648186931a7f591477" ||
            $resource == "e57ad6d779b440a0b81f575fe871e0c2" ||
            $resource == "91a77918502a4480af6ae2407eeb0e39" ||
            $resource == "ed4b405a8b5d11eca8a30242ac120002"
        ) {
            $typeMethod = 'normal';
            $url = constant('API_SECURITY') . 'auth/patient';
        } else {
            $typeMethod = 'normal';
            $url = constant('API_SECURITY') . 'auth/corporatePatientLogin';
        }
        $urlCorporate = constant('API_ADMIN') . 'corporate/' . $resource;
        $curlAdmin = curl_init($urlCorporate);
        curl_setopt($curlAdmin, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curlAdmin, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($curlAdmin, CURLOPT_SSL_VERIFYPEER, false);
        $corporateResponse = curl_exec($curlAdmin);
        $resp = $corporateResponse;
        curl_close($curlAdmin);
        $corporateResponse = json_decode($corporateResponse);
        $stateGDPR = $corporateResponse->{'stateGDPR'};
        $urlTranslations = constant('API_ADMIN') . 'translations';
        $data_to_post_trans = array();
        $data_to_post_trans['resource'] = $resource;
        $data_to_post_trans['type'] = 1;
        if(isset($_COOKIE["resource"]) && $resource == $_COOKIE["resource"]){
            if(isset($_COOKIE["corpTranslationVersion"])) {
                $data_to_post_trans['corpTranslationVersion'] = $_COOKIE["corpTranslationVersion"];
            }
            if(isset($_COOKIE["langTranslationVersion"])) {
                $data_to_post_trans['langTranslationVersion'] = $_COOKIE["langTranslationVersion"];
            }
        }
        $trans_string = json_encode($data_to_post_trans);
        $handleTranslation = curl_init();
        curl_setopt($handleTranslation, CURLOPT_URL, $urlTranslations);
        curl_setopt($handleTranslation, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($handleTranslation, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handleTranslation, CURLOPT_POSTFIELDS, $trans_string);
        curl_setopt($handleTranslation, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($handleTranslation, CURLOPT_SSL_VERIFYPEER, false);
        $resultTrans = curl_exec($handleTranslation);
        $resultTranslations = $resultTrans;
        $httpCodeTrans = curl_getinfo($handleTranslation, CURLINFO_HTTP_CODE);
        curl_close($handleTranslation);
        $textTranslations = json_decode($resultTrans);
    } else {
        $typeMethod = 'normal';
        $url = constant('API_SECURITY') . 'auth/patient';
    }
    
    setcookie("statusGDPR", $corporateResponse->{'stateGDPR'}, time() + (10 * 365 * 24 * 60 * 60), "/","", true, 0);
    setcookie("resource", $resource, time() + (10 * 365 * 24 * 60 * 60), "/", "", true, 0);
    setcookie("enableIA", $corporateResponse->{'enableIA'}, time() + (10 * 365 * 24 * 60 * 60), "/", "", true, 0);
    setcookie("configs", json_encode($corporateResponse->{'configs'}), time() + (10 * 365 * 24 * 60 * 60), "/", "", true, 0);
    setcookie("enablePaymentGateway", $corporateResponse->{'enablePaymentGateway'}, time() + (10 * 365 * 24 * 60 * 60), "/", "", true, 0);
    setcookie("oneSignalInitialized", "false", time() + (10 * 365 * 24 * 60 * 60), "/", "", true, 0);
    setcookie("movil", $movil, time() + (10 * 365 * 24 * 60 * 60), "/","", true, 0);
    if (isset($corporateResponse)) {
        setcookie("language", $corporateResponse->{'languageId'}->{'isoCode'}, time() + (10 * 365 * 24 * 60 * 60), "/","", true, 0);
        setrawcookie("logo", $corporateResponse->{'corporateLogoUrl'}, time() + (10 * 365 * 24 * 60 * 60), "/","", true, 0);        
        $corporateColor =  str_replace(",","|",$corporateResponse->{'corporateColor'});
        $corporateColor =  str_replace(" ","",$corporateColor);
        setrawcookie("color", $corporateColor, time() + (10 * 365 * 24 * 60 * 60), "/","", true, 0);
    }
    $msg = '';
    if ((isset($_POST['login']) && (!empty($_POST['username']) || $_POST['username'] == '0' ) && (!empty($_POST['password']) || $_POST['password'] == '0' )) || (isset($_GET['token']) && isset($_GET['principal']))) {
        $ip = getIp();
        $headers = array(
            "Content-Type: application/json",
            "x-forwarded-for:".$ip,
        );
        $data_to_post = array();
        if (isset($_GET['token'])) {
            $data_to_post['token'] = $_GET['token'];
        }
        $data_to_post['principal'] = isset($_POST['username']) ? $_POST['username'] : $_GET['principal'];
        $data_to_post['credentials'] = isset($_POST['password']) ? $_POST['password'] : "";
        $data_to_post['corporateDomain'] = $_GET['resource'];
        $data_to_post['loginType'] = $_POST['loginType'];
        if ($_POST['loginType'] == '') {
            $data_to_post['loginType'] = null;
        } else {
            $data_to_post['loginType'] = $_POST['loginType'];
        }
        if (isset($_POST['userId']) && isset($_POST['birthYear'])) {
            $data_to_post['userId'] = $_POST['userId'];
            $data_to_post['birthYear'] = $_POST['birthYear'];
        }
        $data_to_post['appName'] = $appName;
        $data_to_post['appVersionName'] = $appVersionName;
        if (isset($_POST['subcorporationInput'])) {
            $data_to_post['subcorporation'] = $_POST['subcorporationInput'];
        }
        if(isset($_POST['loginTypeBiOrAm']) && $data_to_post['corporateDomain'] == "c97881c61ccc4f80bf15b1311708d301"){
            $data_to_post['subcorporation'] = (!isset($_POST['loginTypeBiOrAm']) || $_POST['loginTypeBiOrAm'] =="" )?"am":$_POST['loginTypeBiOrAm'];
            $data_to_post['subcorporationInput'] = (!isset($_POST['loginTypeBiOrAm']) || $_POST['loginTypeBiOrAm'] =="" )?"am":$_POST['loginTypeBiOrAm'];
        }
        if($data_to_post['corporateDomain'] == "8df1b8111f2847648186931a7f591477" &&  $_POST['subcorporationInput'] == "MULTIBANK"){
            $url = constant('API_SECURITY') . 'auth/corporatePatientLogin';
            $data_to_post['subcorporation'] = "";
        }
        $data_string2 = '';
        $data_to_post['subcorporation'] = $_POST['subcorporationInput'];
        $data_string = json_encode($data_to_post, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($typeMethod == 'encrypt') {
            $data_string2 = encryptRequest($data_string, $codeKeyEncrypt);
        } else {
            $data_string2 = $data_string;
        }

        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $data_string2);
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($handle, CURLOPT_CAINFO, "/var/www/html/imovesdronline/doctor-al-instante-web/gd_bundle_ca.crt");
        $result = curl_exec($handle);
        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
        
        //DEBUG PETICION LOGIN
        /*var_dump($_GET);
        echo "<pre>curl_url: " . $url . "</pre>";
        echo "<pre>curl_mode: POST</pre>";
        echo "<pre>curl_headers: " . json_encode($headers) . "</pre>";
        echo "<pre>curl_data: " . $data_string2 . "</pre>";
        echo "<pre>curl_result: " . $result . "</pre>";
        echo "<pre>curl_http_code: " . $httpCode . "</pre>";*/
        
        if ($httpCode == 200) {
            if ($typeMethod == 'encrypt') $data = decryptRequest($result, $codeKeyEncrypt);
            else $data = json_decode($result);
            if (isset($data->{'access_token'})) {
                curl_close($handle);
                if ($typeMethod == 'encrypt') {
                    setcookie("admdron", json_encode($data), time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                    setcookie("corpname", $data->{'corporateInformation'}['corporateName'], time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                    setcookie("corpclass", $data->{'parentCorporateInformation'}['corporateName'], time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                } else {
                    $data = json_decode($result);
                    setcookie("admdron", $result, time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                    setcookie("corpname", $data->{'corporateInformation'}->{'corporateName'}, time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                    setcookie("corpclass", $data->{'parentCorporateInformation'}->{'corporateName'}, time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                }
                if ( isset($data->{'isLoginEmail'}) && $data->{'isLoginEmail'} ) {
                    header('Location: ../private/index.php#/pages/patient');
                } else if ($data->{'isPasswordRestored'} == false) {
                    setcookie("activeMember", "true", time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                    header('Location: ../private/index.php#/pages/restorepassword');
                } else {
                    setcookie("activeMember", "true", time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                    if($_GET['resource'] != "f87f8371c9c24f81a9b31738a68950e1" || ($_GET['resource'] == "f87f8371c9c24f81a9b31738a68950e1" && !isset($_GET['token']))) {
                        if($data->{'statusValidatorCorporate'} == 1) {
                            if($data->{'statusValidator'} == 0) {
                                //header('Location: ../private/index.php#/pages/validatorPassword');
?>
                                <script type="text/javascript">window.location.replace("<?php echo $URLBase. $webSiteName ."private/index.php#/pages/validatorPassword"?>");
                                </script>
<?php
                            } else if ($data->{'statusValidator'} == 1) {
                                header('Location: ../private/index.php#/pages/patient');
                            }
                        } else {
                            header('Location: ../private/index.php#/pages/patient');
                        }
                    }
                }
            } else {
                $subcorporateUsers = json_decode(json_encode($data), true);
                $subcorporateUsers = $subcorporateUsers["subcorporationUserList"];
                if($subcorporateUsers == null) {
                    if($data->{'statusValidatorCorporate'} == 1) {
                        if($data->{'statusValidator'} == 2) {
                            setcookie("admdron", $result, time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                            setcookie("corpname", $data->{'corporateInformation'}->{'corporateName'}, time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                            setcookie("corpclass", $data->{'parentCorporateInformation'}->{'corporateName'}, time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                            header('Location:'.$URLBase . $webSiteName . "views/validator-login.php?resource=" . $resource);
                        }
                    }
                }       
?>
                <script type="text/javascript">
                    $(document).ready(function() {
                        $('#subcorporationModal').modal('show');
                    });
                </script>
<?php
            }
?>
            <script type="text/javascript">
                $(document).ready(function() {
                    $('#successModal').modal('show');
                });
            </script>
<?php 
        } else {
            $blockedLogin = json_decode($result, true);
            $hasFuntionAttemps = false;
            if (isset($blockedLogin["attemptsRemaining"]) && $stateGDPR == 1 ) {
                $hasFuntionAttemps = true;
                setcookie("countFailedAttemps", $blockedLogin["attemptsRemaining"], time() + (10 * 365 * 24 * 60 * 60), "/", constant('DOMAIN_BASE'), true, 0);
                $failedsAttemps = "countFailedAttemps";
            }
            if ($hasFuntionAttemps && $blockedLogin["blockedLogin"] && $stateGDPR == 1) {
?>
                <script type="text/javascript">
                    $(document).ready(function() {
                        $('#accountBlokedModal').modal('show');
                    });
                </script>
<?php 
            } else {
?>
                <script type="text/javascript">
                    $(document).ready(function() {
                        var subcorporationInput = <?php echo json_encode($_POST['subcorporationInput'] ?? null) ?>;
                        var corporateDomain = <?php echo json_encode($data_to_post['corporateDomain'] ?? null) ?>;
                        if(corporateDomain == "8df1b8111f2847648186931a7f591477"){
                            selectSubCorporation(subcorporationInput)
                        }
                        if(corporateDomain =="c97881c61ccc4f80bf15b1311708d301" && subcorporationInput == "" ){
                            subcorporationInput="am";  
                        }
                        $('#errorModal').modal('show');
                        function getCookieUserBlocked(name) {
                            let cookie = {};
                            document.cookie.split(';').forEach(function(el) {
                                let [k, v] = el.split('=');
                                cookie[k.trim()] = v;
                            })
                            return cookie[name];
                        }
                        let count = getCookieUserBlocked('countFailedAttemps');
                        if(count) {
                            $("#countAttempsFaileds").text("Datos incorrectos, Intentos restantes: " + count)
                        }
                    });
                </script>
<?php
            }
?>
        </script>
<?php 
        }
    }
    include_once('layout/head-private.php');
?>

<style>
    .fa-li {
        position: initial;
    }
    #download-recommendation{
            width: 100%;
            background-color: #000;
            padding: 15px;
        }
        #download-recommendation .row{
            display: flex;
            flex-direction: row;   
        }
        #download-recommendation .row  .wrap-install{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #download-recommendation .row span{
            color: #fff;
            padding: 8px 12px;
        }
        .text-download-recommendation{
            color: #fff;
        }
</style>

<body class="login-lp">
                <div id="download-recommendation">
                    <div class="row">
                        <div>
                            <p class="text-download-recommendation"></p>
                        </div>
                        <div style="margin-left: auto;">
                            <div style="display: inline-block">
                                <a class="iOsApp" target="_blank" style=" display: none;">
                                    <img id="iosImage" style="width: 140px;margin-right: 5px;">
                                </a>
                                <a class="iOsApp" target="_blank">
                                    <button style="border-bottom: 0;" class="btn btn-default install-btn">
                                    </button>
                                </a>
                            </div>
                            <div style="display: inline-block; margin-left: 30px">
                                <a class="androidApp" target="_blank" style=" display: none;">
                                    <img id="androidImage" style="width: 140px;margin-right: 5px;">
                                </a>
                                <a class="androidApp" target="_blank">
                                    <button style="border-bottom: 0;" class="btn btn-default install-btn">
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
    <div id="brand-header" class="text-center">
        <img class="i-logo img-responsive" id="logo" src="" alt="">
    </div>

    <script type="text/javascript">
        if (window.innerWidth < window.innerHeight) {
            window.location.replace("<?php echo $movilLogin . $_GET['resource'] . (isset($_GET['corp']) ? '&corp=' . $_GET['corp'] : '') ?>");
        } else if ("<?php echo $isLoggedIn ?>") {
            window.location.replace("../private/index.php#/pages/patient");
        }
    </script>
    <style>
        .overlay {
            background-color: #fff;
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            z-index: 1000;
        }
    </style>

    <div class="modal fade" id="daviviendaModal" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content modal-content-error">
                <div class="modal-header">                    
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-12" style="text-align: center;">
                            <h2 style="margin-bottom: 10px; font-weight: bold;">Bienvenido a Doctor en Línea Davivienda Seguros</h2>
                            <h3>Por favor selecciona la manera en la que quieres iniciar sesión</h3>
                        </div>                        
                    </div>
                    <div class="row" style="text-align: center; margin-top: 10px">                        
                        <div class="col-xs-6">
                            <div style="cursor: pointer;" onclick="pickLoginType(1)">
                                <i class="zmdi zmdi-card" style="font-size: 120px"></i>
                                <br>
                                <h3>Póliza y Certificado</h3>
                            </div>                            
                        </div>
                        <div class="col-xs-6">
                            <div style="cursor: pointer;" onclick="pickLoginType(2)">
                                <i class="zmdi zmdi-key" style="font-size:120px"></i>
                                <br>
                                <h3>Identidad</h3>
                            </div>                            
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-close-modal" data-dismiss="modal" id="close-modal-button">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modals -->
    <div class="modal fade" id="errorModal" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content modal-content-error">
                <div class="modal-header">
                    <div id="brand-header" class="text-center">
                        <img class="i-logo text-center logo-error" src="" alt="">
                    </div>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-3" style="text-align: center;">
                            <p class="dialog-logo-error">
                                <i class="fa fa-times-circle" style="font-size:65px"></i>
                            </p>
                        </div>
                        <div class="col-xs-9">
                            <h2 id="text-login-error" style="margin-bottom: 10px; font-weight: bold; margin-top: 15px;">{{ ALERTS_TITLES_ERROR_ENTER_DATA }}</h2>
                            <h4 id="text-try-again">{{ MENS_ERROR }}</h4>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default btn-close-modal-2" data-dismiss="modal" id="close-modal-button">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="accountBlokedModal" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content modal-content-error">
                <div class="modal-header">
                    <div id="brand-header" class="text-center">
                        <img class="i-logo text-center logo-error" src="" alt="">
                    </div>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-3" style="text-align: center;">
                            <p class="dialog-logo-error">
                                <i class="fa fa-times-circle" style="font-size:65px"></i>
                            </p>
                        </div>
                        <div class="col-xs-9">
                            <h2 id="account-blocked-modal-title" style="margin-bottom: 10px; font-weight: bold;">
                            Tu privacidad es importante para nosotros
                        </h2>
                            <h4 id="account-blocked-modal-text">
                            Utilizamos cookies técnicas para mejorar tu experiencia en nuestra plataforma. Llevaremos registro de toda la actividad que realices dentro de la plataforma, estos registros son completamente anónimos y no serán compartidos con ningún tercero.
                            </h4>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="subcorporationModal" role="dialog" data-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content modal-content-error">
                <div class="modal-header text-center" style="padding: 15px !important">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 id = "titleSubcorporate"><strong> </strong></h4>
                </div>
                <div class="modal-body">
                    <div class="row" id="tablediv">
                        <table class="table table-striped">
                            <tr>
                                <th id="typeSubcorp"></th>
                                <th id="nameSubcorp"></th>
                                <th id="lastSubcorp"></th>
                                <th><strong></strong></th>
                            </tr>
                            <?php
foreach ($subcorporateUsers as $key => $obj) {
    echo '<tr>
                                <td>' . (isset($obj['subcorporation']) ? $obj['subcorporation'] : '') . '</td>
                                <td>' . (isset($obj['firstName']) ? $obj['firstName'] : '') . '</td>
                                <td>' . (isset($obj['lastName']) ? $obj['lastName'] : '') . '</td>
                                <td><button class="btn btn-default" onclick="selectUser(' . $obj["userId"] . ', ' . "'" . $obj["firstName"] . "'" . ', ' . "'" . $obj["lastName"] . "'" . ')" name ="selectSubcorp"></button></td>
                                </tr>';
}
?>
                        </table>
                    </div>
                    <div class="row" id="inputdiv" hidden>
                        <form id="subCorpForm" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) . "?resource=" . $resource; ?>" method="post">
                            <input type="hidden" name="username" id="formUsername">
                            <input type="hidden" name="password" id="formPassword">
                            <input type="hidden" name="userId" id="formUserId">

                            <div class="form-group" style="margin-bottom: 10px">
                                <label for="birthYear" style="font-weight: normal;" id="secureSubcorp"><b id="userName2"></b>:</label>
                                <input type="tel" class="form-control" placeholder="Año de nacimiento" name="birthYear" id="formBirthYear" maxlength="4" required>
                            </div>

                            <a class="btn btn-danger pull-left" onclick='backToList()' id="backSubcorp">Regresar</a>
                            <button class="btn btn-default pull-right" id="login_button2" type="submit" name="login">
                                <span id="loginSpinner2" class="spinner-border" role="status" style="margin-right:5px;" aria-hidden="true" hidden></span>
                                <span id="login_button_text2">Iniciar Sen</span></button>
                        </form>

                    </div>
                </div>
                <div class="modal-footer">
                </div>
            </div>
        </div>
    </div>
    <!-- Accept cookies modal -->
    <div class="modal fade" id="acceptCookiesModal" role="dialog" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-content-error">
                <div class="modal-header text-center">
                    <h4><strong id="accept-cookies-modal-title"></strong></h4>
                </div>
                <div class="modal-body" style="max-height: 500px !important;">
                    <div class="row">
                        <p id="accept-cookies-modal-first-text"></p>
                        <p id="accept-cookies-modal-second-text"></p>
                        <button onclick='acceptCookies()' id="accept-and-continue">
                        </button>
                </div>
                <div class="row text-center" style="width; 100%; margin-top: 7px;">
                <a onclick='viewMoreCookies()' id="view-cookies-policy" style="cursor: pointer;"></a>
                </div>
                <div class="row" id="cookiePolicyDiv" style="width; 100%; margin-top: 7px;" hidden>
                    <p id="more-cookie" style="height: 250px !important; overflow: auto !important; margin-bottom: 0px !important;"></p>
                </div>
            </div>
        </div>
    </div>
</div>
    <div id='gifDiv' class='overlay'>
        <img src="../img/loading2.gif" style='position: fixed; top: 50%; left: 50%; margin-top: -150px; margin-left: -200px;' alt="Flowers in Chania">
    </div>
    <div id='login-body' class="card-body card-padding" hidden>


        <!--<div class="row" style="height: 1px ; overflow: hidden;">
            <div class="col-3">
            </div>
            <div class="col-6">
                <div class="col-3">
                </div>
                <div class="col-6" style="text-align:center;">
                    <div class="fg-line form-group">
                        <fb:login-button id="btn-fb" class="inner-page-butt-blue-con-margen-blanco medium-but" scope="public_profile,email" onlogin="checkLoginState();" data-size="large" data-auto-logout-link="false" login_text=" INICIA SESIÓN CON FACEBOOK ">
                        </fb:login-button>
                        <<a class="btn btn-block btn-social btn-facebook" href="javascript:checkLoginState();"></i>INICIA SESIÓN CON FACEBOOK</a>
                    </div>
                </div>

            </div>
        </div>-->

        <div class="row">
            <div class="col-3">
            </div>
            <div class="col-6">
                <div class="login-content">
                    <!-- Login -->
                    <div class="lc-block toggled" id="l-login">
                        <div id="loginTypeDocTDB" style="cursor: pointer; text-align: center;">
                                <a style="color: #000 !important;" onclick="backToSelection()">
                                    <i style="vertical-align: middle; cursor: pointer;" class="fa fa-chevron-left" aria-hidden="true"></i>
                                    <p class="di-block" style="margin: auto; vertical-align: bottom; font-size: 20px; vertical-align: middle;"><strong>Regresar</strong></p>
                                </a>
                        </div>
                        <div id="validation_message_box"></div>
                        <div class="lcb-form">

                            <div class="card-body card-padding" id="timeValidator" style="display: none">
                                <div class="alert alert-danger curved-borders" id="msgTimeValidator" role="alert">

                                </div>
                            </div>

                            <form id="formIngreso" name="formIngreso" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) . "?resource=" . $resource; ?>" method="post">
                                <div id="corpDiv" style="margin-top: -15px !important; margin-bottom: 25px !important; display: inline-flex;" hidden>
                                    <h3 id="text-edoctor"><b id="corpSelected"></b></h3><a class="text-corporate" style="margin: auto; padding-left: 7px; cursor: pointer;" onclick="backToSelection()">Cambiar</a>
                                </div>

                                <div id="loginType" class="text-left" hidden>
                                    <button class="btn btn-danger waves-effect" id="changeLoginType" type="button">
                                        Cambiar tipo de login
                                    </button>
                                </div>

                                <div class="form-group m-b-20" id="login-div">
                                    <div class="fg-line">
                                        <h2 class="text-login" id="text-login"></h2>
                                    </div>
                                    <div class="fg-line">
                                        <input type="text" class="form-control input-lg input-lg-login" name="username" id="username">
                                    </div>
                                </div>

                                <div class="form-group m-b-20" id="password_div">
                                    <div class="fg-line">
                                        <h2 id="text-password"></h2>
                                    </div>
                                    <div class="fg-line">
                                        <input type="text" id="password_text" class="form-control input-lg input-lg-login" required name="password">
                                    </div>
                                </div>

                                <input type="text" id="txtLoginType" name="loginType" hidden>

                                <input type="text" id="loginTypeBiOrAm" name="loginTypeBiOrAm"  hidden>

                                <input type="hidden" id="subcorporationInput" name="subcorporationInput">
                                <div id="countAttempsFaileds">

                                </div>
                                <button class="btn btn-lg btn-login" id="login_button" type="submit" name="login" style="text-align:center;">
                                    <span id="loginSpinner" class="spinner-border" role="status" style="margin-right:5px;" aria-hidden="true" hidden></span>
                                    <span id="login_button_text">Iniciar Sesión</span></button>
                            </form>
                            <br>
                            <div id="loginTypeBi" class="text-center">
                                <button class="btn-default btn btn-sm waves-effect" id="changeLoginTypeBi" type="button">
                                </button>
                            </div>
                            
                            <div id="restore" class="hidden">
                                <a class="btn btn-danger btn-sm" id="restoreButton" style='cursor:pointer; color: #2196F3;'>¿Olvidaste tu contraseña?</a>
                                <a class="btn btn-danger btn-sm hidden" id="createAccount" style='cursor:pointer; color: #2196F3;'>Registrarse</a>
                            </div>
                                
                            
                        </div>
                        <br>
                        <div style="padding-bottom: 20px;">
                            <div>
                                <button class="btn btn-danger btn-sm" id="tour">¿Necesitas ayuda? ¡Haz click aquí!</button>
                            </div>
                            <div class="card-body card-padding" id="browserValidator" style="margin-top: 15px; display: none;">
                                <div class="alert alert-danger curved-borders" id="msgBrowserText" role="alert">
                                </div>
                            </div>
                            <div class="card-body card-padding" id="movilValidator" style="margin-top: 15px; display: none;">
                                <div class="alert alert-danger curved-borders" id="msgMovilText" role="alert">
                                </div>
                            </div>
                            <div style="display: inline-block;">
                                <br>
      <!--                           <div id="apps-div">
                                    <a id="androidApp" target="_blank" style=" display: none;"><img id="androidImage" style="padding-right: 20px; height: 60px;"></a>
                                    <a id="iOsApp" target="_blank" style=" display: none;"><img id="iosImage" style="height: 60px;"></a>
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <div id="l-selection">
                        <div class="lc-block toggled" style="max-width: none !important;">
                            <div class="row" id="subcorporationMapfre">
                                <h3 style="margin-bottom: 40px !important;"><b>Selecciona tu corporación<b></h3>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                    <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('SS')">
                                        <img src="../css/brands/edoctor/mapfre-personas-icon.png" alt="Mapfre salud" style="max-width:120px">
                                        <p style="font-size:1.5rem">Mapfre Personas</p>
                                    </button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                    <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('MAPFRESV-202')">
                                        <img src="../css/brands/edoctor/mapfre-autos-icon.png" alt="Mapfre salud" style="max-width:125px">
                                        <p style="font-size:1.5rem">Mapfre Autos</p>
                                    </button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                    <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('MAPFRESV-228')">
                                        <img src="../css/brands/edoctor/mapfre-hogar-icon.png" alt="Mapfre salud" style="max-width:125px">
                                        <p style="font-size:1.5rem">Mapfre Hogar</p>
                                    </button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">

                                    <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('MAPFRESV-224')">
                                        <img src="../css/brands/edoctor/segurviaje-icon.png" alt="Mapfre salud" style="max-width:125px">
                                        <p style="font-size:1.5rem">Segurviaje</p>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="lc-block toggled" style="max-width: none !important; margin-top: 10px;">
                            <div class="row hidden" id="servicesMapfreSalud">
                            <h3 style="margin-bottom: 20px !important;"><b>Selecciona un servicio<b>
                                        <a class="text-corporate" style="margin: auto; padding-left: 7px; cursor: pointer; font-size:13px;" id="backToMapfreServices">regresar</a></h3>

                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('MAPFRESV-108')">
                                    <p style="font-size:1.5rem">Colectivo Médico <br> Hospitalario</p>
                                </button>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('MAPFRESV-115')">
                                    <p style="font-size:1.5rem">Mediseguro <br> Familiar</p>
                                </button>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('MAPFRESV-116')">
                                    <p style="font-size:1.5rem">ACCIDENTES <br> PERSONALES</p>
                                </button>
                            </div>
                            </div>
                        </div>

                        <!-- This rows displays when the user selects ACCIDENTES PERSONALES -->
                        <div class="lc-block toggled" style="max-width: none !important; margin-top: 0px;">
                            <div class="row hidden" id="servicesAccidentesPersonales">
                                <h3 style="margin-bottom: 15px !important;"><b>Accidentes personales</b></h3>
                                <h3 style="margin-bottom: 1px !important;"><b>Selecciona un servicio<b>
                                    <a class="text-corporate" style="margin: auto; padding-left: 7px; cursor: pointer; font-size:13px;" id="backToMapfreSalud">regresar</a>
                                </h3>

                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                    <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('MAPFRESV-117')">
                                        <p style="font-size:1.5rem">Accidente <br> individual</p>
                                    </button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                    <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('MAPFRESV-112')">
                                        <p style="font-size:1.5rem">Accidente colectivo <br> empresa</p>
                                    </button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                    <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('MAPFRESV-113')">
                                        <p style="font-size:1.5rem">Accidente colectivo <br> escolar</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="l-selection-bmi">
                        <div class="lc-block toggled" style="max-width: none !important;">
                            <h3 style="margin-bottom: 40px !important;"><b>Selecciona tu corporación<b></h3>
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('VI')">Vida Individual</button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <button class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('AC')">Agente o Corredor</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="l-selection-dronlinetdb">
                        <div class="lc-block toggled" style="max-width: none !important;">
                            <div class="row" id="subcorporationMapfre" style="display: flex; flex-direction: column;">
                                <h3 style="margin-bottom: 40px !important;"><b>¿Cómo deseas iniciar sesión?</b></h3>
                                <div  onclick="location.href = 'login.php?resource=c6d16db0ccc111ebb8bc0242ac130003&corp=dronlinetdb';" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 card-login-type" style="margin: 1rem auto; background-color: #26ad6e!important; cursor:hand;" >
                                        <img src="../img/dpi-number.png" alt="doctor online" style="max-width:120px">
                                        <h4 style="color: #fff">Número de DPI y Código raspable </h4>
                                </div>
                                <div onclick="selectSubCorporation('dronlineretail')" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 card-login-type" style="margin: 1rem auto; background-color: #26ad6e!important; cursor:hand;">
                                        <img src="../img/email.png" alt="doctor online" style="max-width:120px">
                                        <h4 style="color: #fff">Correo electrónico</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="l-selection-drvida">
                        <div class="lc-block toggled" style="max-width: none !important;">
                            <div class="row" id="subcorporationDrvida">
                                <h3 style="margin-bottom: 40px !important;"><b>Selecciona tu país<b></h3>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                    <button style="background-color: #EFEFEF !important;" class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('DRSV')">
                                        <img src="../css/brands/drvida/SV.png" alt="Drvida salvador" style="max-width:120px; margin-top: 2rem;">
                                        <p style="font-size:1.5rem">El Salvador</p>
                                    </button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                    <button style="background-color: #EFEFEF !important;" class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('DRNI')">
                                        <img src="../css/brands/drvida/NI.png" alt="Drvida Nicaragua" style="max-width:125px; margin-top: 2rem;">
                                        <p style="font-size:1.5rem">Nicaragua</p>
                                    </button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                    <button style="background-color: #EFEFEF !important;" class="btn btn-danger btn-action-touch" onclick="selectSubCorporation('DRHN')">
                                        <img src="../css/brands/drvida/HN.png" alt="Drvida Honduras" style="max-width:125px; margin-top: 2rem;">
                                        <p style="font-size:1.5rem">Honduras</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="l-selection-viya">
                        <div class="lc-block toggled" style="max-width: none !important;">
                            <div class="row" id="subcorporationDrvida">
                                <h3 style="margin-bottom: 40px !important;"><b>Selecciona tu país<b></h3>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <button style="background-color: #EFEFEF !important;" class="btn btn-danger btn-action-touch" onclick="selectSubCorporationViya('VIYA-GT')">
                                        <img src="../css/brands/viya/GT.png" alt="Viya Guatemala" style="max-width:120px; margin-top: 2rem;">
                                        <p style="font-size:1.5rem">Guatemala</p>
                                    </button>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <button style="background-color: #EFEFEF !important;" class="btn btn-danger btn-action-touch" onclick="selectSubCorporationViya('VIYA-SV')">
                                        <img src="../css/brands/viya/SV.png" alt="Viya El Salvador" style="max-width:120px; margin-top: 2rem;">
                                        <p style="font-size:1.5rem">El Salvador</p>
                                    </button>
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <button style="background-color: #EFEFEF !important;" class="btn btn-danger btn-action-touch" onclick="selectSubCorporationViya('VIYA-NI')">
                                        <img src="../css/brands/viya/NI.png" alt="Viya Nicaragua" style="max-width:125px; margin-top: 2rem;">
                                        <p style="font-size:1.5rem">Nicaragua</p>
                                    </button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                    <button style="background-color: #EFEFEF !important;" class="btn btn-danger btn-action-touch" onclick="selectSubCorporationViya('VIYA-HN')">
                                        <img src="../css/brands/viya/HN.png" alt="Viya Honduras" style="max-width:125px; margin-top: 2rem;">
                                        <p style="font-size:1.5rem">Honduras</p>
                                    </button>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="margin: 3rem 0;">
                                    <button style="background-color: #EFEFEF !important;" class="btn btn-danger btn-action-touch" onclick="selectSubCorporationViya('VIYA-RD')">
                                        <img src="../css/brands/viya/RD.png" alt="Viya República Dominicana" style="max-width:125px; margin-top: 2rem;">
                                        <p style="font-size:1.5rem">República Dominicana</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="l-selection-doctorline">
                        <div class="lc-block toggled" style="max-width: none !important;">
                            <div class="row" id="subcorporationDoctorLine" style="display: flex; flex-direction: column;">
                                <h3 style="margin-bottom: 40px !important;"><b>¿Cómo deseas iniciar sesión?</b></h3>
                                <div onclick="selectSubCorporation('DRLINE-EMAIL')" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 card-login-type" style="margin: 1rem auto; background-color: #e51815!important">
                                        <img src="../img/email.png" alt="doctor online" style="max-width:120px">
                                        <h4 style="color: #fff">Correo electrónico y contraseña</h4>
                                </div>
                                <div  onclick="selectSubCorporation('MULTIBANK')" class="col-lg-4 col-md-4 col-sm-4 col-xs-12 card-login-type" style="margin: 1rem auto; background-color: #e51815!important" >
                                        <img src="../img/dpi-number.png" alt="doctor online" style="max-width:120px">
                                        <h4 style="color: #fff">Número de cédula y primer apellido </h4>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Javascript Libraries -->
        <script src="../private/vendors/bower_components/Waves/dist/waves.min.js"></script>
        <!-- Placeholder for IE9 -->
        <!--[if IE 9 ]>
        <script src="vendors/bower_components/jquery-placeholder/jquery.placeholder.min.js"></script>
    <![endif]-->
        <script src="../private/js/app.min.js?random=<?php echo uniqid(); ?>"></script>
        <!--script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script-->
        <script src="../js/functions.js?random=<?php echo uniqid(); ?>"></script>
        <script src="../private/lib/bootstrap-tour.min.js"></script>
        <?php if ($resource != "") {?>
            <!--?php echo "IS NOT EMPTY" ?-->
            <script>
                $('#changeLoginType').on('click', function(event) {
                    $('#daviviendaModal').modal('show');
                });
                $( "#changeLoginTypeBi" ).on('click', function(event) {
                    var date_input = $("#password_text");

                    if($('#loginTypeBiOrAm').val() == "am"){
                        $('#loginTypeBiOrAm').val("bi") 
                        $("#subcorporationInput").val("bi");  
                        subcorporationInput = 'bi';
                        $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE_TYPE_2);
                        $("#username").attr("placeholder", userTranslations.LOGIN_POLICY_NUMBER_TYPE_2);
                        $("#text-password").text(userTranslations.LOGIN_CERTIFY_TITLE_TYPE_2);
                        $("#username").val("")
                        date_input.attr('type', 'text');
                        date_input.attr('autocomplete', 'off');
                        date_input.attr("placeholder", userTranslations.LOGIN_CERTIFY_TYPE_2);
                        date_input.removeAttr('pattern');
                        $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                        $("#text-try-again").text(userTranslations.ALERTS_TITLES_USER_NOT_FOUND);
                        $("#changeLoginTypeBi").text(userTranslations.ALERTA_MEDICA_CORPORATE_SWITCH_ALERTAMEDICA_TYPE);
      
                        date_input.val("");
                                var options = {
                                    format: 'dd/mm/yyyy',
                                    todayHighlight: true,
                                    autoclose: true,
                                    language: 'en'
                                };
                                switch(getCookie("language")){
                                    case "es":
                                        options.language = "es";
                                        break;
                                    case "grc":
                                        options.language = "el";
                                        break;
                                    default:
                                        options.language = "en";
                                        break;
                                }
                                /* date_input.datepicker(options); */
                                /* date_input.attr('maxlength', '10'); */
                                if(date_input.val() == "am"){
                                    date_input.bind('keyup','keydown', function(event) {
                                        var inputLength = event.target.value.length;
                                        if (event.keyCode != 8){
                                            if(inputLength === 2 || inputLength === 5){
                                            var thisVal = event.target.value;
                                            thisVal += '/';
                                            $(event.target).val(thisVal)}
                                        }
                                    });
                                }                                
                    }
                    else if($('#loginTypeBiOrAm').val() == "bi"){
                        $('#loginTypeBiOrAm').val("am");
                        $("#subcorporationInput").val("am");
                        subcorporationInput = 'am';
                        $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE);
                        $("#username").attr("placeholder", userTranslations.LOGIN_POLICY_NUMBER);
                        $("#username").val("")
                        $("#text-password").text(userTranslations.LOGIN_CERTIFY_TITLE);
                        date_input.attr("placeholder", userTranslations.LOGIN_CERTIFY);
                        date_input.removeAttr('pattern');
                        $("#changeLoginTypeBi").text(userTranslations.ALERTA_MEDICA_CORPORATE_SWITCH_BI_TYPE);
                        date_input.attr('type', 'tel');
                        date_input.datepicker( "destroy" );
                        date_input.removeAttr( "maxlength" )
                        date_input.val("");

                    }
                    
                });
                function pickLoginType(loginType){
                    $('#txtLoginType').val(loginType);
                    $('#daviviendaModal').modal('hide');
                    if(loginType == 1){
                        $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE);
                        $("#username").attr("placeholder", userTranslations.POLIZA);
                        $("#password_div").show();
                        $("#password_text").val("");
                        $("#text-password").text(userTranslations.LOGIN_CERTIFY_TITLE);
                        $("#password_text").attr("placeholder", userTranslations.CERTIFICADO);
                        $("#password_text").attr('type', 'password');
                    }
                    else if(loginType == 2){
                        $("#text-login").text(userTranslations.HELP_LOGIN_STEP1_TYPE2);
                        $("#username").attr("placeholder", userTranslations.IDENTITY_NUMBER);
                        $("#password_div").hide();
                        $("#password_text").val('<?php echo $resource; ?>');
                        $("#password_text").attr('type', 'password');
                        $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                        $("#text-try-again").text(userTranslations.ALERTS_TITLES_USER_NOT_FOUND);
                    }

                    return;
                }

                function getCookie(name) {
                    var dc = document.cookie;
                    var prefix = name + "=";
                    var begin = dc.indexOf("; " + prefix);
                    if (begin == -1) {
                        begin = dc.indexOf(prefix);
                        if (begin != 0) return null;
                    }
                    else
                    {
                        begin += 2;
                        var end = document.cookie.indexOf(";", begin);
                        if (end == -1) {
                        end = dc.length;
                        }
                    }
                    // because unescape has been deprecated, replaced with decodeURI
                    //return unescape(dc.substring(begin + prefix.length, end));
                    return decodeURI(dc.substring(begin + prefix.length, end));
                }
                const resourceDomain = "<?php echo $resource ?>";
                var paramUrlCorp = location.search.split('corp=')[1]
                const token = "<?php echo isset($_GET['token']) ?>";
                const trans = <?php echo $resultTranslations ?>;
                var userTranslations;
                if(trans.translations != undefined && trans.translations != null) {
                    userTranslations = trans.translations.reduce(function(acc, curr) {
                    acc[curr.key] = curr.value;
                    return acc;
                    }, {});
                    localStorage.setItem('translation', JSON.stringify(userTranslations));
                    localStorage.setItem('corpTranslationVersion', trans.corpTranslationVersion);
                    localStorage.setItem('langTranslationVersion', trans.langTranslationVersion);
                    if(localStorage.getItem('translation')){
                        userTranslations = JSON.parse(localStorage.getItem('translation'));
                    }
                }
                $("#titleSubcorporate").text(userTranslations.TITLE_SUBCORP);
                $("#typeSubcorp").text(userTranslations.SUBCORP_TYPE);
                $("#nameSubcorp").text(userTranslations.SUBCORP_NAME);
                $("#lastSubcorp").text(userTranslations.SUBCORP_LAST);
                $("#secureSubcorp").text(userTranslations.SUBCORP_SECURE);
                $("#backSubcorp").text(userTranslations.SUBCORP_BACK);
                $('button[name="selectSubcorp"]').html(userTranslations.USERFORLOGIN_SELECT);
                $('#login_button_text2').html(userTranslations.LOGIN);
                $("#formBirthYear").attr("placeholder", userTranslations.USERFORLOGIN_INPUT_BIRTHYEAR);

                if(resourceDomain == 'f87f8371c9c24f81a9b31738a68950e1' && token && getCookie("admdron") != null){
                    location.reload();
                }
                if (resourceDomain == 'b27e6e8af2ae40d3bf07f6bc1253bd12') {
                    $("#l-login").hide();
                    $("#l-selection-bmi").hide();
                    $("#l-selection-dronlinetdb").hide();
                    $('#l-selection-drvida').hide();
                    $('#l-selection-viya').hide();
                    $('#l-selection-doctorline').hide();
                } else if (resourceDomain == '5f5f16ccdca911ea87d00242ac130003') {
                    $("#l-login").hide();
                    $("#l-selection-bmi").hide();
                    $("#l-selection-dronlinetdb").hide();
                    $("#l-selection").hide();
                    $('#l-selection-doctorline').hide();
                    $("#l-selection-viya").hide();
                }else if(resourceDomain == 'c66bbf2a3f4211edb8780242ac120002'){ //Viya corporation: @victorisimoo - 03/10/2022
                    $("#l-login").hide();
                    $("#l-selection-bmi").hide();
                    $("#l-selection-dronlinetdb").hide();
                    $("#l-selection").hide();
                    $('#l-selection-drvida').hide();
                    $('#l-selection-doctorline').hide();
                }else if(resourceDomain == '8df1b8111f2847648186931a7f591477'){
                    $("#l-login").hide();
                    $("#l-selection-bmi").hide();
                    $("#l-selection-dronlinetdb").hide();
                    $("#l-selection").hide();
                    $('#l-selection-viya').hide();
                    $('#l-selection-drvida').hide();
                }
                else if (resourceDomain == '1287dcacf358411f95f31b6f61ce597a') {
                    $("#l-login").hide();
                    $("#l-selection").hide();
                    $("#l-selection-dronlinetdb").hide();
                    $('#l-selection-viya').hide();
                    $('#l-selection-drvida').hide();
                    $('#l-selection-doctorline').hide();
                } 
                else if(resourceDomain == 'c6d16db0ccc111ebb8bc0242ac130003' && paramUrlCorp == 'dronlinetdb'){
                    $("#l-selection").hide();
                    $("#l-selection-dronlinetdb").hide();
                    $("#l-selection-bmi").hide();
                    $("#corpDiv").hide()
                    $("#loginTypeDocTDB a").removeAttr("onclick")
                    $("#loginTypeDocTDB a").attr("href", "javascript:history.back(1)")
                    $("#login-body #l-login .lcb-form").css("margin-top", "30px")
                    $('#l-selection-drvida').hide();
                    $('#l-selection-viya').hide();
                    $('#restoreButton').addClass('hidden');
                    $('#l-selection-doctorline').hide();
                }
                else if(resourceDomain == 'c6d16db0ccc111ebb8bc0242ac130003'){
                    $("#l-login").hide();
                    $("#l-selection").hide();
                    $("#l-selection-bmi").hide();
                    $('#l-selection-viya').hide();
                    $('#l-selection-drvida').hide();
                    $('#l-selection-doctorline').hide();
                }
                else if (resourceDomain == 'e4c4aa0f523941d2a332d15101f12e9e' && paramUrlCorp == 'dronlineretail') {
                    $("#l-selection").hide();
                    $("#l-selection-dronlinetdb").hide();
                    $("#l-selection-bmi").hide();
                    $("#corpDiv").hide()
                    $("#loginTypeDocTDB a").removeAttr("onclick")
                    $("#loginTypeDocTDB a").attr("href", "javascript:history.back(1)")
                    $("#login-body #l-login .lcb-form").css("margin-top", "30px")
                    $('#l-selection-drvida').hide();
                    $('#l-selection-viya').hide();
                    $('#l-selection-doctorline').hide();

                }
                else {
                    $("#l-selection").hide();
                    $("#l-selection-bmi").hide();
                    $("#l-selection-dronlinetdb").hide();
                    $("#corpDiv").hide();
                    $("#loginTypeDocTDB").hide();
                    $('#l-selection-viya').hide();
                    $('#l-selection-drvida').hide();
                    $('#l-selection-doctorline').hide();
                }

                
                if (resourceDomain == 'e4c4aa0f523941d2a332d15101f12e9e' || resourceDomain == 'f87f8371c9c24f81a9b31738a68950e1' ||
                    resourceDomain == '12bca8b78b47461ebe4ea486820c1eff' || resourceDomain == '43870cab10c449d9b8c6ee53b8b5e3ae' ||
                    resourceDomain == 'e57ad6d779b440a0b81f575fe871e0c2' || resourceDomain == 'c6d16db0ccc111ebb8bc0242ac130003') {
                    $('#restore').removeClass('hidden');
                    $('#tour').addClass('hidden');
                }
                $('#formIngreso').on('submit', function(event) {
                    document.getElementById("loginSpinner").removeAttribute("hidden");
                });
                $('#subCorpForm').on('submit', function(event) {
                    document.getElementById("loginSpinner2").removeAttribute("hidden");
                });
                var titleCor;
                var exist_apps = false;
                var _successFound = function() {
                    //console.logo('SUCCESS')
                    $('#successModal').modal('show');
                }
                var _errorFound = function() {
                    //console.log('ERROR')
                    $('#errorModal').modal('show');
                }
                $(document).ready(function() {
                    function getCookieName(name) {
                        let cookie = {};
                        document.cookie.split(';').forEach(function(el) {
                            let [k, v] = el.split('=');
                            cookie[k.trim()] = v;
                        })
                        return cookie[name];
                    }
                    <?php if ($stateGDPR == 1) {?>
                        if (!getCookieName('cookiesAccepted')) {
                            $('#acceptCookiesModal').modal('show');
                        } else if (getCookieName('cookiesAccepted')) {
                            document.cookie = "cookiesAccepted=true;Secure";
                        }
                    <?php }?>

                    //console.log("IS NOT EMPTY")
                    (function($) {
                    $.fn.inputFilter = function(inputFilter) {
                        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
                            if (inputFilter(this.value)) {
                                this.oldValue = this.value;
                                this.oldSelectionStart = this.selectionStart;
                                this.oldSelectionEnd = this.selectionEnd;
                            } else if (this.hasOwnProperty("oldValue")) {
                                if (this.type !== 'date') {
                                    this.value = this.oldValue;
                                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                                }
                            }
                        });
                    };
                }(jQuery));
                    var isMobile = {
                        Android: function() {
                            return navigator.userAgent.match(/Android/i);
                        },
                        iOS: function() {
                            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                        }
                    };
                    /*if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                        $("#movilValidator").show();
                    }else{
                        $("#movilValidator").hide();
                    }*/
                    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                    if (!(is_chrome || is_firefox)) {
                        //console.log("El navegador es distinto a Chrome o Firefox");
                        $("#browserValidator").show();
                    } else {
                        //console.log("El navegador es chrome: "+is_chrome+", or Firefox: "+is_firefox);
                        $("#browserValidator").hide();
                    }
                    var response = JSON.parse('<?php echo $resp ?>');
                    if (response.corporateCssUrl != "" && response.corporateName != "") {
                        var d = new Date();
                        d.setFullYear(d.getFullYear() + 10);
                        document.cookie = "corpname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        $("#icono").attr("href", '../css/brands/' + response.corporateName + '/tabicon.png');
                        $('#password_text').on('change invalid', function() {
                                var textfield = $(this).get(0);
                                
                                // 'setCustomValidity not only sets the message, but also marks
                                // the field as invalid. In order to see whether the field really is
                                // invalid, we have to remove the message first
                                textfield.setCustomValidity('');
                                
                                if (!textfield.validity.valid) {
                                    textfield.setCustomValidity(userTranslations.PLEASE_FILL);  
                                }
                        });
                        //console.warn("ADEED BRAND CSS",response.corporateCssUrl);
                        var baseBrandsURL = "../css/brands/" + response.corporateName;
                        var cssUrl = baseBrandsURL + '/main.css';
                        var imgUrl = baseBrandsURL + '/logo.png';
                        $("#login-body").removeAttr('hidden');
                        $("#gifDiv").attr('hidden', true);
                        //console.log(cssUrl)
                        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', cssUrl));
                        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '../private/css/bootstrap-tour.min.css'));
                        $("#logo").attr("src", imgUrl);
                        $("#logo-success").attr("src", imgUrl);
                        $(".logo-error").attr("src", imgUrl);
                        var url = "<?php echo constant('API_URL_BASE') ?>dronline-admin-api/api/parameter/findByName?name=" + response.corporateName + "_PLATFORM_NAME";
                        var data = getResource(url, "", "GET");
                        titleCor = data.value;
                        $("#msgBrowserText").append(userTranslations.IMPORTANT + " " + data.value + " " + userTranslations.ONLY_WORK_C_AND_F);
                        $("#msgMovilText").append(userTranslations.IMPORTANT + " " + data.value + " " + userTranslations.APPS_FOR_BETTER_EXPERIENCE);
                        if (response.languageId.isoCode === "fr") {
                            $("#iosImage").attr("src", "../img/appstore-en.png");
                            $("#androidImage").attr("src", "../img/playstore-en.png");
                            $(".install-btn").text("Installer");
                        }
                        else if(response.corporateName == "drtui"){
                            $("#iosImage").attr("src", "../img/appstore-en.png");
                            $("#androidImage").attr("src", "../img/playstore-en.png");
                            $(".install-btn").text("Install");
                        }
                        else if(response.corporateName == "drnn"){
                            $("#iosImage").attr("src", "../img/appstore-en.png");
                            $("#androidImage").attr("src", "../img/playstore-en.png");
                            $(".install-btn").text("Install");
                        }
                        else if(response.corporateName == "metlife"){
                            $("#iosImage").attr("src", "../img/appstore-en.png");
                            $("#androidImage").attr("src", "../img/playstore-en.png");
                            $(".install-btn").text("Install");
                        }
                        else if (response.languageId.isoCode === "en") {
                            $("#iosImage").attr("src", "../img/appstore-en.png");
                            $("#androidImage").attr("src", "../img/playstore-en.png");
                        } else if(response.corporateName =="alertamedica"){
                            $("#changeLoginTypeBi").text(userTranslations.ALERTA_MEDICA_CORPORATE_SWITCH_BI_TYPE);
                        }
                        else {
                            $("#iosImage").attr("src", "../img/appstore-es.png");
                            $("#androidImage").attr("src", "../img/playstore-es.png");
                            $(".install-btn").text("Instalar");
                        }
                        if(response.playStoreURL == undefined && response.appStoreURL == undefined){
                            if(!(response.corporateId == 73 || response.corporateId == 62)){
                                $("#download-recommendation").hide();
                            }else{
                                if(response.corporateId == 62){
                                    response.appStoreURL = "https://apps.apple.com/us/app/medical-support/id1528584478";
                                    response.playStoreURL = "https://play.google.com/store/apps/details?id=com.doctoronline.medicalsupport";
                                }else {
                                    response.appStoreURL = "https://apps.apple.com/gt/app/doctor-online/id1435199682?fbclid=IwAR3o0Hh8SvGwPNpyt1hcWags-TsaptnRMwAOA45fM8XvANadBeUGtfOhRwY";
                                    response.playStoreURL = "https://play.google.com/store/apps/details?id=com.doctoronline.doctoronline";
                                }
                            }
                        }

                        //Botones de Apps Moviles
                        if (response.playStoreURL !== undefined) {
                            $(".androidApp").attr("href", response.playStoreURL);
                            $(".androidApp").show();
                            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                if (isMobile.Android()) {
                                    $("#movilValidator").show();
                                }
                            }
                            exist_apps = true;
                        } else {
                            $(".androidApp").hide();
                        }


                        if (response.appStoreURL !== undefined) {
                            $(".iOsApp").attr("href", response.appStoreURL);
                            $(".iOsApp").show();
                            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                if (isMobile.iOS()) {
                                    $("#movilValidator").show();
                                }
                            }
                            exist_apps = true;
                        } else {
                            $(".iOsApp").hide();
                        }

                        var platformName = "";

                        url = "<?php echo constant('API_URL_BASE') ?>dronline-admin-api/api/parameter/findByName?name=" + response.corporateName + "_PLATFORM_NAME";
                        data = getResource(url, "", "GET");
                        if (data !== "") {
                            if (response.languageId.isoCode == "fr") {
                                document.title = "S'identifier | " + data.value;
                            } else if (response.languageId.isoCode == "en") {
                                document.title = "Login | " + data.value;
                            }
                            else if(response.corporateName == "drnn"){
                                document.title = userTranslations.LOGIN_TITLE_PAGE + " " + data.value;
                            }
                            else if(response.corporateName == "ethnikivirtualcare"){
                                document.title = userTranslations.LOGIN_TITLE_PAGE + " " + data.value;
                            }
                            else if(response.corporateName == "drtui"){
                                document.title = userTranslations.LOGIN_TITLE_PAGE + " " + data.value;
                            }
                            else if(response.corporateName == "metlife"){
                                document.title = userTranslations.LOGIN_TITLE_PAGE + " " + data.value;
                            }
                            else {
                                document.title = "Inicia Sesión | " + data.value;
                            }
                            platformName = data.value;
                        }

                        //Verificando el tipo de dispositivo movil
                        if (isMobile.Android()) {
                            $(".iOsApp").hide();
                        } else if (isMobile.iOS()) {
                            $(".androidApp").hide();
                        }

                        //Revisando horas si es disponible
                        if (response.corporateName != null) {
                            url = "<?php echo constant('API_URL_BASE') ?>dronline-admin-api/api/parameter/checkAttentionTime?corporateName=" + response.corporateName;
                            data = getResource(url, "", "GET");
                            if ((typeof data.value != "undefined") && (data.value != "")) {
                                $("#timeValidator").show();
                                if (response.languageId.isoCode === "fr") {
                                    $("#msgTimeValidator").append("AVIS: " + data.value + "<BR> Merci de votre compréhension");
                                } else if (response.languageId.isoCode === "en") {
                                    $("#msgTimeValidator").append("NOTICE: " + data.value + "<BR> Thanks for your understanding");
                                }
                                else if(corporateName == "drnn"){
                                    $("#msgTimeValidator").append(userTranslations.NOTICE + "" + data.value + "<BR> " + "" + userTranslations.THANKS_FOR_UNDERSTANDING);
                                }
                                else if(corporateName == "ethnikivirtualcare"){
                                    $("#msgTimeValidator").append(userTranslations.NOTICE + "" + data.value + "<BR> " + "" + userTranslations.THANKS_FOR_UNDERSTANDING);
                                }
                                else if(corporateName == "drtui"){
                                    $("#msgTimeValidator").append(userTranslations.NOTICE + "" + data.value + "<BR> " + "" + userTranslations.THANKS_FOR_UNDERSTANDING);
                                }
                                else if(corporateName == "metlife"){
                                    $("#msgTimeValidator").append(userTranslations.NOTICE + "" + data.value + "<BR> " + "" + userTranslations.THANKS_FOR_UNDERSTANDING);
                                }
                                else {
                                    $("#msgTimeValidator").append("AVISO: " + data.value + "<BR> Gracias por su comprensión");
                                }
                            }
                        }

                    }
                    $("#restoreButton").attr("href", "<?php echo $URLBase . $webSiteName . "views/reset-password.php?resource=" . $resource ?>");
                    if (response.length != 0) {
                        $("#accept-cookies-modal-title").text(userTranslations.ACCEPT_COOKIES_MODAL_TITLE);
                        $("#accept-cookies-modal-first-text").text(userTranslations.ACCEPT_COOKIES_MODAL_FIRST_TEXT);
                        $("#accept-cookies-modal-second-text").text(userTranslations.ACCEPT_COOKIES_MODAL_SECOND_TEXT);
                        $("#accept-and-continue").text(userTranslations.ACCEPT_COOKIES_MODAL_BUTTON);
                        $('#account-blocked-modal-title').text(userTranslations.ACCOUNT_BLOCKED_MODAL_TITLE);
                        $('#account-blocked-modal-text').text(userTranslations.ACCOUNT_BLOCKED_MODAL_TEXT);
                        $("#close-modal-button").text(userTranslations.CERRAR);
                        $("#more-cookie").html(userTranslations.GDPR_COOKIES_DESCRIPTION);
                        $("#view-cookies-policy").text(userTranslations.VIEW_MORE_COOKIE_POLICY);



                        if (response.description != "entity_not_found") {
                            $("#btn-fb").hide();
                            $("#divider").hide();
                            if (response.corporateName == "mapfre" ||
                                response.corporateName == "agrosalud" ||
                                response.corporateName == "dronline-us" ||
                                response.corporateName == "dronline-fr" ||
                                response.corporateName == "dronline" ||
                                response.corporateName == "doctorvirtual" ||
                                response.corporateName == "medcoservicios" ||
                                response.corporateName == "dronlinemx" ||
                                response.corporateName == "800doctor" ||
                                response.corporateName == "drrimac" ||
                                response.corporateName == "unitypromotores" ||
                                response.corporateName == "mdhealthcare" ||
                                response.corporateName == "drassa" ||
                                response.corporateName == "mapfreasistencia" ||
                                response.corporateName == "sercomed" ||
                                response.corporateName == "athens") {
                                $("#loginTypeBi").hide();
                                $("#password_text").attr('type', 'tel');
                                $("#password_text").removeAttr('pattern');
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#formBirthYear").inputFilter(function(value) {
                                    return /^\d*$/.test(value);
                                });
                            } else {
                                $("#password_div").hide();
                            }
                            if (response.corporateName == "ficohsa") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val("1234");
                            }
                            if (response.corporateName == "edoctor") {
                                $("#loginTypeBi").hide();
                            }
                            if (response.corporateName == "segurviaje") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "dradisa" || response.corporateName == "lacarolina") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "doctorins" || response.corporateName == "swisscore") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "drpositiva" || response.corporateName == "clinicainternacional") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "draxa") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "drgenesis" || response.corporateName == "drmicoope" || response.corporateName == 'bluemedical' || response.corporateName == "miclinica") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "movistar") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "midoctor") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "tigo") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "dronline-us") {
                                $("#loginTypeBi").hide();
                            }
                            if (response.corporateName == "mdhealthcare") {
                                $("#loginTypeBi").hide();
                                $("#password_text").attr('type', 'password');
                            }
                            if (response.corporateName == "ticktravel") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#tour").hide();
                            }
                            if (response.corporateName == "drnn") {
                                $("#loginTypeBi").hide();
                                $(".btn-close-modal").text(userTranslations.CERRAR);
                                $(".btn-close-modal-2").text(userTranslations.CERRAR);

                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'text');
                                $("#password_text").attr('autocomplete', 'off');
                                var date_input = $("#password_text");
                                var options = {
                                    format: 'dd/mm/yyyy',
                                    todayHighlight: true,
                                    autoclose: true,
                                    language: 'en'
                                };
                                switch(getCookie("language")){
                                    case "es":
                                        options.language = "es";
                                        break;
                                    case "grc":
                                        options.language = "el";
                                        break;
                                    default:
                                        options.language = "en";
                                        break;
                                }
                                date_input.datepicker(options);
                                date_input.attr('maxlength', '10');
                                date_input.bind('keyup','keydown', function(event) {
                                    var inputLength = event.target.value.length;
                                    if (event.keyCode != 8){
                                    if(inputLength === 2 || inputLength === 5){
                                        var thisVal = event.target.value;
                                        thisVal += '/';
                                        $(event.target).val(thisVal);
                                        }
                                    }
                                });
                                $("#tour").hide();
                            }
                            if (response.corporateName == "ethnikivirtualcare") {
                                $("#loginTypeBi").hide();
                                $(".btn-close-modal").text(userTranslations.CERRAR);
                                $(".btn-close-modal-2").text(userTranslations.CERRAR);

                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'text');
                                $("#password_text").attr('autocomplete', 'off');
                                var date_input = $("#password_text");
                                var options = {
                                    format: 'dd/mm/yyyy',
                                    todayHighlight: true,
                                    autoclose: true,
                                    language: 'en'
                                };
                                switch(getCookie("language")){
                                    case "es":
                                        options.language = "es";
                                        break;
                                    case "grc":
                                        options.language = "el";
                                        break;
                                    default:
                                        options.language = "en";
                                        break;
                                }
                                date_input.datepicker(options);
                                date_input.attr('maxlength', '10');
                                date_input.bind('keyup','keydown', function(event) {
                                    var inputLength = event.target.value.length;
                                    if (event.keyCode != 8){
                                    if(inputLength === 2 || inputLength === 5){
                                        var thisVal = event.target.value;
                                        thisVal += '/';
                                        $(event.target).val(thisVal);
                                        }
                                    }
                                });
                                $("#tour").hide();
                            }
                            if (response.corporateName == "drtui") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'text');
                                $("#password_text").attr('autocomplete', 'off');
                                var date_input = $("#password_text");
                                var options = {
                                    format: 'dd/mm/yyyy',
                                    todayHighlight: true,
                                    autoclose: true,
                                    language: 'en'
                                };
                                switch(getCookie("language")){
                                    case "es":
                                        options.language = "es";
                                        break;
                                    case "grc":
                                        options.language = "el";
                                        break;
                                    default:
                                        options.language = "en";
                                        break;
                                }
                                date_input.datepicker(options);
                                date_input.attr('maxlength', '10');
                                date_input.bind('keyup','keydown', function(event) {
                                    var inputLength = event.target.value.length;
                                    if (event.keyCode != 8){
                                    if(inputLength === 2 || inputLength === 5){
                                        var thisVal = event.target.value;
                                        thisVal += '/';
                                        $(event.target).val(thisVal);
                                        }
                                    }
                                });
                                $("#tour").hide();
                            }
                            if (response.corporateName == "metlife") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'text');
                                $("#password_text").attr('autocomplete', 'off');
                                var date_input = $("#password_text");
                                var options = {
                                    format: 'dd/mm/yyyy',
                                    todayHighlight: true,
                                    autoclose: true,
                                    language: 'en'
                                };
                                switch(getCookie("language")){
                                    case "es":
                                        options.language = "es";
                                        break;
                                    case "grc":
                                        options.language = "el";
                                        break;
                                    default:
                                        options.language = "en";
                                        break;
                                }
                                date_input.datepicker(options);
                                date_input.attr('maxlength', '10');
                                date_input.bind('keyup','keydown', function(event) {
                                    var inputLength = event.target.value.length;
                                    if (event.keyCode != 8){
                                    if(inputLength === 2 || inputLength === 5){
                                        var thisVal = event.target.value;
                                        thisVal += '/';
                                        $(event.target).val(thisVal);
                                        }
                                    }
                                });
                                $("#tour").hide();
                            }
                            if (response.corporateName == "drtui") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'text');
                                $("#password_text").attr('autocomplete', 'off');
                                var date_input = $("#password_text");
                                var options = {
                                    format: 'dd/mm/yyyy',
                                    todayHighlight: true,
                                    autoclose: true,
                                    language: 'en'
                                };
                                switch(getCookie("language")){
                                    case "es":
                                        options.language = "es";
                                        break;
                                    case "grc":
                                        options.language = "el";
                                        break;
                                    default:
                                        options.language = "en";
                                        break;
                                }
                                date_input.datepicker(options);
                                date_input.attr('maxlength', '10');
                                date_input.bind('keyup','keydown', function(event) {
                                    var inputLength = event.target.value.length;
                                    if (event.keyCode != 8){
                                    if(inputLength === 2 || inputLength === 5){
                                        var thisVal = event.target.value;
                                        thisVal += '/';
                                        $(event.target).val(thisVal);
                                        }
                                    }
                                });
                                $("#tour").hide();
                            }
                            if (response.corporateName == "dronline-fr") {
                                $("#loginTypeBi").hide();
                            }
                            if (response.corporateName == "dronline") {
                                $("#loginTypeBi").hide();
                                $("#password_text").attr('type', 'password');
                                $("#username").prop('required', true);
                            }
                            if (response.corporateName == "doctorvirtual") {
                                $("#loginTypeBi").hide();
                                $("#password_text").attr('type', 'password');
                                $("#username").prop('required', true);
                                $('#restore').removeClass('hidden');
                                $('#createAccount').removeClass('hidden');
                            }
                            if (response.corporateName == "medcoservicios") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").attr('type', 'password');
                                $("#username").prop('required', true);
                            }
                            if (response.corporateName == "dronlinemx") {
                                $("#loginTypeBi").hide();
                                $("#password_text").attr('type', 'password');
                                $("#username").prop('required', true);
                                $('#restore').removeClass('hidden');
                            }
                            if (response.corporateName == "dronlinesv") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").attr('type', 'password');
                                $("#username").prop('required', true);
                                $('#restore').removeClass('hidden');
                            }
                            if (response.corporateName == "proclinic") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").attr('type', 'password');
                                $("#username").prop('required', true);
                                $('#restore').removeClass('hidden');
                            }
                            if (response.corporateName == "druniversales") {
                                $("#loginTypeBi").hide();
                                console.log(response.corporateName)
                                $("#password_div").show();
/*                                 $("#password_text").attr('type', 'password');
 */                                $("#username").prop('required', true);
                            }
                            if (response.corporateName == "sercomed") {
                                $("#loginTypeBi").hide();
                                $("#password_text").attr('type', 'password');
                                $("#username").prop('required', true);
                                const usernameInput = document.getElementById('username');
                                usernameInput.addEventListener('keypress', (event) => {
                                    const usernameInput = document.getElementById('username');
                                    if ((usernameInput.value.length === 2 || usernameInput.value.length === 6) &&
                                        event.keyCode !== 8) {
                                        if (event.key != ".") {
                                            usernameInput.value = usernameInput.value + '.';
                                        }
                                    }
                                    if (usernameInput.value.length === 10 && event.keyCode !== 8) {
                                        if (event.key != "-") {
                                            usernameInput.value = usernameInput.value + '-';
                                        }
                                    }
                                    if (usernameInput.value.length > 11) {
                                        event.preventDefault();
                                    }
                                });
                            }
                            if (response.corporateName == "draffinity") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "drbantrab") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "800doctor") {
                                $("#loginTypeBi").hide();
                                $("#password_text").attr('type', 'password');
                            }
                            if (response.corporateName == "alertamedica") {
                                $("#password_div").show();
                                $("#loginTypeBi").show();
                                $("#password_text").attr('type', 'tel');
                                $("#password_text").inputFilter(function(value) {
                                    var typeInput = $("#password_text").attr("type");
                                    if(typeInput == "text" && $("#loginTypeBiOrAm").val() != 'bi'){
                                        return /^[0-9/]*$/.test(value);
                                         //return /^[\d./-]+$/.test(value);
                                    }
                                    else if(typeInput == "tel" && $("#loginTypeBiOrAm").val() != 'bi'){
                                        return /^[0-9]?\d*$/.test(value);
                                    }
                                    if ($("#loginTypeBiOrAm").val() == 'bi') {
                                        return /^[A-Za-z0-9]*$/.test(value);
                                    }
                               });
                               $("#changeLoginTypeBi").text(userTranslations.ALERTA_MEDICA_CORPORATE_SWITCH_BI_TYPE);
                               $("#loginTypeBiOrAm").val("am");
                            }
                            if (response.corporateName === "asesuisa") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                            }
                            if (response.corporateName === "grupotorremedica") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'password');
                            }
                            if (response.corporateName === "drpalig") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName === "ciam") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "kenyaorient") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName == "emergenciasmedicas") {
                                $("#loginTypeBi").hide();
                                $("#username").attr("maxlength", "12");
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                const usernameInput = document.getElementById('username');
                                usernameInput.addEventListener('keyup', (e) => {
                                    const username = e.target.value;

                                    switch (username.length) {
                                        case 1:
                                            if (e.keyCode === 173 || e.keyCode === 48 || e.keyCode === 8) {
                                                usernameInput.value = '';
                                            }
                                            break;
                                        case 9:
                                            if (e.keyCode === 8) {
                                                usernameInput.value = username.replace(/[ ]/g, '');
                                            } else {
                                                usernameInput.value = `${username[0]} ${username.slice(1, 5)} ${username.slice(5)}`;
                                            }
                                            break;
                                        case 10:
                                        case 11:
                                        case 12:
                                            usernameInput.value = username.replace(/[ ]/g, '');
                                            break;
                                    }
                                });

                                $('#formIngreso').submit(function(e) {
                                    usernameInput.value = usernameInput.value.replace(/[ ]/g, '');
                                    return true;
                                });
                            }
                            if (response.corporateName == "fundacionsantafebogota") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName === "humanoseguros") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName === "drminsa") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName === "drminsagt") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName === "igss") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName === "cad") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'password');
                            }
                            if (response.corporateName === "mapfreasistencia") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'password');
                                $('#tour').show();
                                $('#restore').removeClass('hidden');
                            }
                            if (response.corporateName === "arspalic") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName === "drsenasa") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#password_text").attr('type', 'password');
                            }
                            if (response.corporateName === "druniversal") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#password_text").attr('type', 'password');
                            }
                            if (response.corporateName === "drvivir") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                            }
                            if (response.corporateName === "hospitalsantalucia") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'password');
                            }
                            if (response.corporateName === "doctorline") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                            }
                            if (response.corporateName === "athens") {
                                $("#loginTypeBi").hide();
                                $("#password_text").attr('type', 'password');
                                $('#restoreButton').text('Forgot password?');
                            }
                            if (response.corporateName === "drbancolombia") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#password_text").attr('type', 'password');
                            }
                            if (response.corporateName === "drigs") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');

                            }
                            if (response.corporateName === "rpn") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").attr('type', 'text');
                                $("#password_text").attr('autocomplete', 'off');
                                var date_input = $("#password_text");
                                var options = {
                                    format: 'dd/mm/yyyy',
                                    todayHighlight: true,
                                    autoclose: true,
                                    language: 'en'
                                };
                                switch(getCookie("language")){
                                    case "es":
                                        options.language = "es";
                                        break;
                                    case "grc":
                                        options.language = "el";
                                        break;
                                    default:
                                        options.language = "en";
                                        break;
                                }
                                date_input.datepicker(options);
                                date_input.attr('maxlength', '10');
                                date_input.bind('keyup','keydown', function(event) {
                                    var inputLength = event.target.value.length;
                                    if (event.keyCode != 8){
                                    if(inputLength === 2 || inputLength === 5){
                                        var thisVal = event.target.value;
                                        thisVal += '/';
                                        $(event.target).val(thisVal);
                                        }
                                    }
                                });
                            }
                            if (response.corporateName === "daviviendahn") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'password');
                                $("#username").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9  ñ_-]*$/.test(value);
                                });
                                $("#daviviendaModal").modal('show');
                                $("#loginType").show();
                            }
                            if (response.corporateName === "medicalsupport") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#password_text").attr('type', 'password');
                                $("#username").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9 _-]*$/.test(value);
                                });
                            }
                            if (response.corporateName === "bam") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#password_text").attr('type', 'password');
                            }
                            if (response.corporateName === "drvida") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#password_text").attr('type', 'password');
                                $("#username").inputFilter(function(value) {
                                    return true;
                                });
                            }
                            if (response.corporateName === "drcaribe") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'text');

                                $("#username").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9 _-]*$/.test(value);
                                });
                                $("#password_text").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9 _-]*$/.test(value);
                                });
                            }
                            if (response.corporateName === "drfedline") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
/*                                 $("#password_text").attr('type', 'text');*/
                                $("#password_text").attr('autocomplete', 'off');

                                var date_input = $("#password_text");
                                var options = {
                                    format: 'dd/mm/yyyy',
                                    todayHighlight: true,
                                    autoclose: true,
                                    language: 'en'
                                };
                                switch(getCookie("language")){
                                    case "es":
                                        options.language = "es";
                                        break;
                                    case "grc":
                                        options.language = "el";
                                        break;
                                    default:
                                        options.language = "en";
                                        break;
                                }
                                date_input.datepicker(options);
                                date_input.attr('maxlength', '10');
                                date_input.bind('keyup','keydown', function(event) {
                                    var inputLength = event.target.value.length;
                                    if (event.keyCode != 8){
                                    if(inputLength === 2 || inputLength === 5){
                                        var thisVal = event.target.value;
                                        thisVal += '/';
                                        $(event.target).val(thisVal);
                                        }
                                    }
                                });
                            }
                            if (response.corporateName === "iziminds") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#password_text").attr('type', 'password');
                            }
                            if (response.corporateName === "viya") {
                                $("#loginTypeBi").hide();
                                $("#username").attr('type', 'text');
                                $("#username").prop('required', true);
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9 _-]*$/.test(value);
                                });
                            }
                            if (response.corporateName === "viyasv") {
                                $("#loginTypeBi").hide();
                                $("#corpDiv").show();
                                $("#corpSelected").text("El Salvador");
                                $("#corpSelected").show();
                                $("#username").attr('type', 'text');
                                $("#username").prop('required', true);
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9 _-]*$/.test(value);
                                });
                            }
                            if (response.corporateName === "viyado") {
                                $("#loginTypeBi").hide();
                                $("#corpDiv").show();
                                $("#corpSelected").text("República Dominicana");
                                $("#corpSelected").show();
                                $("#username").attr('type', 'text');
                                $("#username").prop('required', true);
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9 _-]*$/.test(value);
                                });
                            }
                            if (response.corporateName === "viyahn") {
                                $("#loginTypeBi").hide();
                                $("#corpDiv").show();
                                $("#corpSelected").text("Honduras");
                                $("#corpSelected").show();
                                $("#username").attr('type', 'text');
                                $("#username").prop('required', true);
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9 _-\u00f1\u00d1]*$/.test(value);
                                });
                            }
                            if (response.corporateName === "viyani") {
                                $("#loginTypeBi").hide();
                                $("#corpDiv").show();
                                $("#corpSelected").text("Nicaragua");
                                $("#corpSelected").show();
                                $("#username").attr('type', 'text');
                                $("#username").prop('required', true);
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9 _-]*$/.test(value);
                                });
                            }
                            if (response.corporateName === "drenminutos") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'text');
                                $("#password_text").attr('autocomplete', 'off');
                                var date_input = $("#password_text");
                                var options = {
                                    format: 'dd/mm/yyyy',
                                    todayHighlight: true,
                                    autoclose: true,
                                    language: 'en',
                                    orientation	: 'top'
                                };
                                switch(getCookie("language")){
                                    case "es":
                                        options.language = "es";
                                        break;
                                    case "grc":
                                        options.language = "el";
                                        break;
                                    default:
                                        options.language = "en";
                                        break;
                                }
                                date_input.datepicker(options);
                                date_input.attr('maxlength', '10');
                                date_input.bind('keyup','keydown', function(event) {
                                    var inputLength = event.target.value.length;
                                    if (event.keyCode != 8){
                                    if(inputLength === 2 || inputLength === 5){
                                        var thisVal = event.target.value;
                                        thisVal += '/';
                                        $(event.target).val(thisVal);
                                        }
                                    }
                                });
                            }
                            if (response.corporateName === "dronlinetdb") {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $('#username').mask('0000-00000-0000');
                                $("#username").inputFilter(function(value) {
                                    return /^[0-9.-]*$/.test(value);
                                });
                                $('#formIngreso').submit(function(e) {
                                    $("#username").unmask();
                                    return true;
                                });
                            }

                            if (response.corporateName === "quilotelemedicina") {
                                $("#loginTypeBi").hide();
                                $("#username").prop('required', true);
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $('#username').mask('0000-0000-0000-0000-0000');
                                $("#username").inputFilter(function(value) {
                                    return /^[0-9.-]*$/.test(value);
                                });
                                $('#formIngreso').submit(function(e) {
                                    $("#username").unmask();
                                    return true;
                                });
                            }

                            if (response.corporateName === "drgenerali") {
                                $("#loginTypeBi").hide();
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'text');
                                $("#password_text").attr('autocomplete', 'off');
                                var date_input = $("#password_text");
                                var options = {
                                    format: 'dd/mm/yyyy',
                                    todayHighlight: true,
                                    autoclose: true,
                                    language: 'en',
                                    orientation	: 'top'
                                };
                                switch(getCookie("language")){
                                    case "es":
                                        options.language = "es";
                                        break;
                                    case "grc":
                                        options.language = "el";
                                        break;
                                    default:
                                        options.language = "en";
                                        break;
                                }
                                date_input.datepicker(options);
                                date_input.attr('maxlength', '10');
                                date_input.bind('keyup','keydown', function(event) {
                                    var inputLength = event.target.value.length;
                                    if (event.keyCode != 8){
                                    if(inputLength === 2 || inputLength === 5){
                                        var thisVal = event.target.value;
                                        thisVal += '/';
                                        $(event.target).val(thisVal);
                                        }
                                    }
                                });
                                $("#tour").hide();
                            } else if (response.corporateName == 'mapfre') {
                                $("#loginTypeBi").hide();
                                $("#username").inputFilter(function(value) {
                                        return /^[0-9]?\d*$/.test(value);
                                    });
                                    $("#password_text").inputFilter(function(value) {
                                        return /^[0-9]?\d*$/.test(value);
                                    });
                            } else if (response.corporateName == 'drassa') {
                                $("#loginTypeBi").hide();
                                $("#password_div").hide();
                                $("#password_text").val('<?php echo $resource; ?>');
                                $('#tour').hide();
                            }
                            else if (response.corporateName == 'vivawell') {
                                $("#loginTypeBi").hide();
                                $("#username").attr('type', 'email');
                                $("#password_div").show();
                                $("#password_text").val("");
                                $("#password_text").attr('type', 'password');
                                $('#restore').removeClass('hidden');
                                /* $("#username").inputFilter(function(value) {
                                    return /^[0-9]?\d*$/.test(value);
                                }); */
                            } else {
                                // Validación para campo de correo electrónico por corporación.
                                //Si la corporación necesita ingreso por correo electrónico agregar en este if el corporateName
                                if (response.corporateName != "dronline" &&
                                    response.corporateName != "doctorvirtual" &&
                                    response.corporateName != "medcoservicios" &&
                                    response.corporateName != "dronlinesv" &&
                                    response.corporateName != "proclinic" &&
                                    response.corporateName != "dronlinemx" &&
                                    response.corporateName != 'drnn' &&
                                    response.corporateName != 'ethnikivirtualcare' &&
                                    response.corporateName != 'alertamedica' &&
                                    response.corporateName != 'drtui' &&
                                    response.corporateName != 'metlife' &&
                                    response.corporateName != 'drfedline' &&
                                    response.corporateName != 'drenminutos' &&
                                    response.corporateName != '800doctor' &&
                                    response.corporateName != 'mdhealthcare' &&
                                    response.corporateName != 'sercomed' &&
                                    response.corporateName != 'cad' &&
                                    response.corporateName != 'mapfreasistencia' &&
                                    response.corporateName != 'athens' &&
                                    response.corporateName != 'hospitalsantalucia' &&
                                    response.corporateName != 'emergenciasmedicas' &&
                                    response.corporateName != 'doctorline') {
                                    $("#username").inputFilter(function(value) {
                                        return /^[0-9]?\d*$/.test(value);
                                    });
                                    $("#password_text").inputFilter(function(value) {
                                        return /^[0-9]?\d*$/.test(value);
                                    });
                                }


                            }

                            $("#reset-password").hide();
                            $("#register").hide();
                        } else {
                            document.cookie = "logo=../img/logo_dr_online_color.png;expires=" + d + ";path=/";
                            document.cookie = "buttons=btn btn-xs btn-success;expires=" + d + ";path=/";
                            $("#logo").attr("src", getCookie("logo"));
                            $("#btn-fb").show();
                            $("#divider").show();
                            $("#password_div").show();
                            $("#reset-password").show();
                            $("#register").show();
                            $("#password_text").val("");
                        }
                    } else {
                        document.cookie = "logo=" + baseBrandsURL + "/logo.png;expires=" + d + ";path=/";
                        document.cookie = "buttons=btn btn-xs btn-success;expires=" + d + ";path=/";
                        //$("#logo").attr("src",getCookie("logo"));
                        $("#btn-fb").show();
                        $("#divider").show();
                        $("#password_div").show();
                        $("#reset-password").show();
                        $("#register").show();
                        $("#password_text").val("");
                    }
                    $(".text-download-recommendation").text(userTranslations.DOWNLOAD_RECOMMENDED);
                    $(".install-btn").text(userTranslations.INSTALL_RECOMMENDED_APP);

                    // Textos aplicables para todas las corporaciones
                    $("#login_button_text").text(userTranslations.LOGIN);
                    $("#tour").text(userTranslations.LOGIN_HELP);
                    $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                    $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE);
                    $("#text-password").text(userTranslations.LOGIN_CERTIFY_TITLE);
                    $("#username").attr("placeholder",userTranslations.LOGIN_POLICY_NUMBER);
                    $("#password_text").attr("placeholder",userTranslations.LOGIN_CERTIFY);
                    $('#restoreButton').text(userTranslations.FORGOT_PASSWORD);
                    $("#text-try-again").text(userTranslations.PLEASE_TRY_AGAIN);

                    /*  * author: victorisimoo
                        * date: 2023-02-03
                        * description: create account button configuration
                     */
                    $("#createAccount").click(function() {
                        localStorage.setItem("corporateName", response.corporateName);
                        window.location.href = "/web/views/register.php#/info";
                    });
                    

                    //hide lines to test description
                    /* $("#text-login-error").text(userTranslations.LOGIN_ERROR); */
                    //end test description
                    // Instance the tour

                    var tour;
                    $('#tour').click(function() {
                        console.log(typeof tour)
/*                         if (typeof tour == "undefined") {
 */                            if (response.corporateName === "daviviendahn" && $("#txtLoginType").val() == "1") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                                console.log(tour)
                            }
                            else if (response.corporateName === "daviviendahn" && $("#txtLoginType").val() == "2") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE2,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                                console.log(tour)
                            } else if (response.corporateName === "segurviaje") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON ,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "doctorins" || response.corporateName === "dradisa" || response.corporateName === "drpositiva" || response.corporateName === "swisscore" || response.corporateName == "lacarolina") {
                                var contentText = (response.corporateName === "drpositiva") ? "Ingresa tu Documento Nacional de Identidad." : "Ingresa tu número de cédula.";
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            content: contentText,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON ,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "movistar") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON ,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "draxa") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON ,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "drgenesis" || response.corporateName == "drmicoope" || response.corporateName == "bluemedical") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON ,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "midoctor") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON ,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "tigo") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON ,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "mdhealthcare") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>« Previous</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>Next »</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>Finish</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "dronline-us") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>« Previous</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>Next »</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>Finish</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "dronline-fr") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>« Antérieur</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>Prochain »</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>Fin</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "800doctor") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "alertamedica" && $("#loginTypeBiOrAm").val() == "am") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName === "alertamedica" && $("#loginTypeBiOrAm").val() == "bi") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE2,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE2,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "ciam") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "drbantrab") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "kenyaorient") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>« Back</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>Next »</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>Close</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName == "dronline") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName == "dronlinemx") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName == "proclinic") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName == "druniversales") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }


                            else if (response.corporateName == "dronline") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });

                            } else if (response.corporateName === "drminsagt") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "quilotelemedicina") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }else if (response.corporateName === "igss") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "drbancolombia") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "drigs") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "cad") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "mapfreasistencia") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "emergenciasmedicas") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "drvivir") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "rpn") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "hospitalsantalucia") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "doctoronline") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }else if (response.corporateName === "doctorvirtual") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "medicalsupport") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName === "drfedline") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName === "iziminds") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }

                            else if (response.corporateName === "viya") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }

                            else if (response.corporateName === "viyasv") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }

                            else if (response.corporateName === "viyado") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }

                            else if (response.corporateName === "viyahn") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }

                            else if (response.corporateName === "viyani") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }

                            else if (response.corporateName === "drenminutos") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName === "drgenerali") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName === "sercomed") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName === "drvida") {
                                const typeCor = $('#corpSelected')[0].textContent;
                                let textStepOne = typeCor == 'El Salvador' ? 'DUI o pasaporte' : typeCor == 'Nicaragua' ? 'número de cédula o pasaporte' : 'número de identidad o pasaporte' ;
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: "Ingresa " + textStepOne + " para acceder a la plataforma Doctor Vida",
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: "Si tu " + textStepOne + " es válido, podrás acceder a la plataforma Doctor Vida",
                                            placement: "right"
                                        }
                                    ]
                                });
                            } else if (response.corporateName === "doctorline") {
                                const typeCor = $('#corpSelected')[0].textContent;
                                let textStepOne = typeCor == 'DRLINE-EMAIL' ? userTranslations.HELP_LOGIN_STEP1_TYPE1 : userTranslations.HELP_LOGIN_STEP1_TYPE2 ;
                                let textStepTwo = typeCor == 'DRLINE-EMAIL' ? userTranslations.HELP_LOGIN_STEP2_TYPE1 : userTranslations.HELP_LOGIN_STEP2_TYPE2 ;
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: textStepOne,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: textStepTwo,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName === "vivawell") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName === "dronlinesv") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else if (response.corporateName === "medcoservicios") {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            else {
                                tour = new Tour({
                                    backdrop: true,
                                    template: "<div class='popover tour'>" +
                                        "<div class='arrow'></div>" +
                                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>" +
                                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>" +
                                        "<div class='popover-navigation'>" +
                                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>" + userTranslations.HELP_LOGIN_PREVIOUS + "</button>" +
                                        "<span data-role='separator'>&nbsp;</span>" +
                                        "<button class='btn btn-xs btn-default' data-role='next'>" + userTranslations.HELP_LOGIN_NEXT + "</button>" +
                                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>" + userTranslations.HELP_LOGIN_FINISH + "</button>" +
                                        "</div>" +

                                        "</div>",
                                    steps: [{
                                            element: "#login-div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP1_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#password_div",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_STEP2_TYPE1,
                                            placement: "bottom"
                                        },
                                        {
                                            element: "#login_button",
                                            title: titleCor,
                                            content: userTranslations.HELP_LOGIN_BUTTON,
                                            placement: "right"
                                        }
                                    ]
                                });
                            }
                            if (exist_apps && response.corporateName != "dronline-fr" && response.corporateName === "dronline-us") {
                                tour.addStep({
                                    element: "#apps-div",
                                    title: titleCor,
                                    content: "¡También contamos con aplicaciones móviles con las cuales puedes acceder a " + titleCor + " de una manera más fácil y cómoda!",
                                    placement: "right"
                                });
                            } else if (exist_apps && response.corporateName === "dronline-us") {
                                tour.addStep({
                                    element: "#apps-div",
                                    title: titleCor,
                                    content: "We also have mobiles Apps so you can user " + titleCor + " in an easier and more comfortable way!",
                                    placement: "right"
                                });
                            } else if (exist_apps && response.corporateName === "dronline-fr") {
                                tour.addStep({
                                    element: "#apps-div",
                                    title: titleCor,
                                    content: "Nous avons également des applications mobiles auxquelles vous pouvez accéder a " + titleCor + " de manière plus facile et plus confortable!",
                                    placement: "right"
                                });
                            }
                            tour.init();
                            tour.start();
                            tour.restart();
                        /* } else {
                            tour.restart();
                        } */
                    });
                });



                /*function statusChangeCallback(response) {
                    if (response.status === 'connected') {
                        loginDrOnline();
                    } else if (response.status === 'not_authorized') {
                        //console.log('FB not authorized');
                    } else {
                        //console.log('Please log into Facebook.');
                    }
                }
                function checkLoginState() {
                    FB.getLoginStatus(function (response) {
                        statusChangeCallback(response);
                    });
                }
                window.fbAsyncInit = function () {
                    FB.init({
                        appId: '<?php echo constant('APP_ID_FACEBOOK'); ?>',
                        cookie: true,
                        xfbml: true,
                        version: 'v2.2'
                    });
                    FB.getLoginStatus(function (response) {
                        //statusChangeCallback(response);
                    });
                };
                (function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id))
                        return;
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));

                function loginDrOnline() {
                    FB.api('/me?fields=id,email,first_name,last_name,gender,birthday,middle_name', function (response) {
                        var postData = {
                            "id": response.id,
                            "email": response.email,
                            "first_name": response.first_name,
                            "last_name": response.last_name,
                            "birthday ": response.birthday,
                            "gender": response.gender
                        };
                        $.ajax({
                            type: "POST",
                            url: "register-facebook.php",
                            data: postData,
                            dataType: 'json',
                            success: function (data) { // Our returned data from PHP is stored in "data" as a JSON Object
                                console.log(data);
                                window.location.href = data.url;
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                console.log(xhr.responseText);
                            }
                        });
                    });
                }*/
            </script>

            <script type="text/javascript">


                function selectUser(userId, firstName, lastName) {
                    $("#inputdiv").show();
                    $("#tablediv").hide();
                    $("#formUserId").val(userId);
                    $("#userName").text(firstName + " " + lastName);
                    $("#formUsername").val("<?php echo (isset($_POST['username']) ? $_POST['username'] : ''); ?>");
                    $("#formPassword").val("<?php echo (isset($_POST['password']) ? $_POST['password'] : ''); ?>");
                    return false;
                }

                function backToList() {
                    $("#inputdiv").hide();
                    $("#tablediv").show();
                    $("#formBirthYear").val("");
                    return false;
                }


                function acceptCookies() {
                    document.cookie = "cookiesAccepted=true;Secure";
                    $('#acceptCookiesModal').modal('hide');
                }
                let viewMorecookiesBoolean = false;
                function viewMoreCookies() {
                    if(!viewMorecookiesBoolean){
                        viewMorecookiesBoolean = true;
                        $("#cookiePolicyDiv").show();
                        $("#view-cookies-policy").text(userTranslations.VIEW_LESS_COOKIE_POLICY);
                    } else {
                        viewMorecookiesBoolean = false;
                        $("#cookiePolicyDiv").hide();
                        $("#view-cookies-policy").text(userTranslations.VIEW_MORE_COOKIE_POLICY);
                    }
                }

                function selectSubCorporationViya(corporation){
                    switch(corporation){
                        case 'VIYA-GT':  // Viya corporation: @victorisimo - 03/10/2022
                            $("#l-login").show();
                            $("#l-selection-viya").hide();
                            $("#loginTypeDocTDB").hide();
                            $("#corpDiv").show();
                            $("#corpSelected").text("Guatemala");
                            $("#corpSelected").show();
                            break;
                        case 'VIYA-SV':
                            location.href = 'login.php?resource=7c8ad81240f711edb8780242ac120002';
                            break;
                        case 'VIYA-HN':
                            location.href = 'login.php?resource=770a8b8c40ff11edb8780242ac120002';
                            break;
                        case 'VIYA-NI':
                            location.href = 'login.php?resource=ca4c9b2e410311edb8780242ac120002';
                            break;
                        case 'VIYA-RD':
                            location.href = 'login.php?resource=4967e00040fd11edb8780242ac120002';
                        break;
                    }
                }

                function selectSubCorporation(corporation) {
                    if (corporation != undefined && corporation != null && corporation != "") {
                        $("#subcorporationInput").val(corporation);
                        let subcorporation;
                        var tour = new Tour();
                        switch (corporation) {
                            case 'MAPFRESV-224':
                                subcorporation = 'Segurviaje';
                                $("#password_div").hide();
                                $("#username").val('');
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").attr("placeholder", userTranslations.LOGIN_CERTIFY);
                                $("#text-login").text(userTranslations.LOGIN_CERTIFY_TITLE);
                                $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                                $("#username").unbind();
                                $("#username").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9]*$/.test(value);
                                });
                                break;
                            case 'MAPFRESV-228':
                                subcorporation = 'Mapfre Hogar';
                                $("#password_div").hide();
                                $("#username").val('');
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").attr("placeholder", userTranslations.LOGIN_POLICY_NUMBER);
                                $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE);
                                $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                                $("#username").unbind();
                                $("#username").inputFilter(function(value) {
                                    return /^\d*$/.test(value);
                                });
                                break;
                            case 'MAPFRESV-202':
                                subcorporation = 'Mapfre Autos';
                                $("#password_div").hide();
                                $("#username").val('');
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").attr("placeholder", userTranslations.LOGIN_POLICY_NUMBER);
                                $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE);
                                $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                                $("#username").unbind();
                                $("#username").inputFilter(function(value) {
                                    return /^\d*$/.test(value);
                                });
                                break;
                            case 'SS':
                                // Display options for MF and CO
                                $('#subcorporationMapfre').addClass('hidden');
                                $('#servicesMapfreSalud').removeClass('hidden');
                                break;
                            case 'MAPFRESV-115':
                                subcorporation = 'MediSeguro Familiar';
                                $("#password_div").hide();
                                $("#username").val('');
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").attr("placeholder", userTranslations.LOGIN_POLICY_NUMBER);
                                $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE);
                                $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                                $("#username").unbind();
                                $("#username").inputFilter(function(value) {
                                    return /^\d*$/.test(value);
                                });
                                break;
                            case 'MAPFRESV-116':
                                // Display options ACCIDENTES PERSONALES
                                corporation = 'SS';
                                $('#servicesMapfreSalud').addClass('hidden');
                                $('#servicesAccidentesPersonales').removeClass('hidden');
                                break;
                            case 'MAPFRESV-117':
                                subcorporation = 'Accidente Individual'
                                $("#password_div").hide();
                                $("#username").val('');
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").attr("placeholder", userTranslations.LOGIN_POLICY_NUMBER);
                                $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE);
                                $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                                $("#username").unbind();
                                $("#username").inputFilter(function(value) {
                                    return /^\d*$/.test(value);
                                });
                                break;
                            case 'MAPFRESV-112':
                                subcorporation = 'Accidente Colectivo Empresa'
                                $("#password_div").show();
                                $("#username").val('');
                                $("#password_text").val('');
                                $("#username").attr("placeholder", userTranslations.LOGIN_POLICY_NUMBER);
                                $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE);
                                $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                                $("#text-password").text(userTranslations.LOGIN_CERTIFY_TITLE);
                                $("#password_text").attr("placeholder", userTranslations.LOGIN_CERTIFY);
                                $("#username").unbind();
                                $("#password_text").unbind();
                                $("#username").inputFilter(function(value) {
                                    return /^\d*$/.test(value);
                                });
                                $("#password_text").inputFilter(function(value) {
                                    return /^\d*$/.test(value);
                                });
                                break;
                            case 'MAPFRESV-113':
                                subcorporation = 'Accidente Colectivo Escolar'
                                $("#password_div").show();
                                $("#username").val('');
                                $("#password_text").val('');
                                $("#username").attr("placeholder", userTranslations.LOGIN_POLICY_NUMBER);
                                $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE);
                                $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                                $("#text-password").text(userTranslations.LOGIN_CERTIFY_TITLE);
                                $("#password_text").attr("placeholder", userTranslations.LOGIN_CERTIFY);
                                $("#username").unbind();
                                $("#password_text").unbind();
                                $("#username").inputFilter(function(value) {
                                    return /^\d*$/.test(value);
                                });
                                $("#password_text").inputFilter(function(value) {
                                    return /^\d*$/.test(value);
                                });
                                break;
                            case 'MAPFRESV-108':
                                subcorporation = 'Colectivo Médico Hospitalario';
                                $("#password_div").show();
                                $("#username").val('');
                                $("#password_text").val('');
                                $("#username").attr("placeholder", userTranslations.LOGIN_POLICY_NUMBER);
                                $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE);
                                $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                                $("#text-password").text(userTranslations.LOGIN_CERTIFY_TITLE);
                                $("#password_text").attr("placeholder", userTranslations.LOGIN_CERTIFY);
                                $("#username").unbind();
                                $("#password_text").unbind();
                                $("#username").inputFilter(function(value) {
                                    return /^\d*$/.test(value);
                                });
                                $("#password_text").inputFilter(function(value) {
                                    return /^\d*$/.test(value);
                                });
                                break;
                            case 'VI':
                                subcorporation = 'Vida Individual';
                                $("#password_div").hide();
                                $("#username").val('');
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").attr("placeholder", "Número de póliza");
                                $("#text-login").text("Ingresa tu Número de póliza");
                                $("#text-login-error").text("Número de póliza no encontrado.");
                                $("#username").unbind();
                                $("#username").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9]*$/.test(value);
                                });
                                break;
                            case 'AC':
                                subcorporation = 'Agente o Corredor';
                                $("#password_div").hide();
                                $("#username").val('');
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#username").attr("placeholder", "Código de agente");
                                $("#text-login").text("Ingresa tu código de agente");
                                $("#text-login-error").text("Código de agente no encontrado.");
                                $("#username").unbind();
                                $("#username").inputFilter(function(value) {
                                    return /^[a-zA-Z0-9]*$/.test(value);
                                });
                                break;
                            case 'DRSV':
                                subcorporacion = 'El Salvador';
                                $("#text-login").text(userTranslations.DRVIDA_DUI_PASSPART_TITLE);
                                $("#username").attr("placeholder", userTranslations.DRVIDA_DUI_PASSPORT);
                                $("#password_text").val('<?php echo $resource; ?>');
                                $("#subcorporationInput").val('');
                                break;
                            case 'DRHN':
                                subcorporacion = 'Honduras';
                                $("#text-login").text(userTranslations.DRVIDA_ID_PASSPODR_TITLE);
                                $("#username").attr("placeholder", userTranslations.DRVIDA_ID_PASSPODR);
                                $("#password_text").val('f3bb863985f54cd78f23b0e5172152b0');
                                $("#subcorporationInput").val('');
                                break;
                            case 'DRNI':
                                subcorporacion = 'Nicaragua';
                                $("#text-login").text(userTranslations.DRVIDA_IDCARD_PASSPORT_TITLE);
                                $("#username").attr("placeholder", userTranslations.DRVIDA_IDCARD_PASSPORT);
                                $("#password_text").val('676091757c074eb2a23b0c75e3729ed6');
                                $("#subcorporationInput").val('');
                                break;
                            case 'DRLINE-EMAIL':
                                $("#tour").show();
                                $('#restore').removeClass('hidden');
                                subcorporation = 'DRLINE-EMAIL';
                                $("#password_div").show();
                                $('#restoreButton').show();
                                $("#username").val('');
                                $("#password_text").val('');
                                $("#username").attr("placeholder", userTranslations.LOGIN_POLICY_NUMBER);
                                $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE);
                                $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                                $("#text-password").text(userTranslations.LOGIN_CERTIFY_TITLE);
                                $("#password_text").attr("placeholder", userTranslations.LOGIN_CERTIFY);
                                break;
                            case 'MULTIBANK':
                                $("#tour").show();
                                $('#restore').removeClass('hidden');
                                $("#subcorporationInput").val('MULTIBANK');
                                subcorporation = 'MULTIBANK';
                                $('#restoreButton').hide();
                                $("#password_div").show();
                                $("#username").val('');
                                $("#password_text").val('');
                                $("#username").attr("placeholder", userTranslations.LOGIN_POLICY_NUMBER_TYPE_2);
                                $("#text-login").text(userTranslations.LOGIN_POLICY_NUMBER_TITLE_TYPE_2);
                                $("#text-login-error").text(userTranslations.LOGIN_ERROR);
                                $("#text-password").text(userTranslations.LOGIN_CERTIFY_TITLE_TYPE_2);
                                $("#password_text").attr("placeholder", userTranslations.LOGIN_CERTIFY_TYPE_2);
                                break;
                        }
                        
                        if (corporation !== 'SS' && corporation !== "dronlineretail") {
                            $('#tour').hide();
                            $("#corpSelected").text(subcorporation);
                            $("#corpDiv").show();
                            $("#loginTypeDocTDB").hide();
                            $("#l-selection").hide();
                            $("#l-selection-bmi").hide();
                            $("#l-selection-doctorline").hide();
                            $("#l-selection-dronlinetdb").hide();
                            $("#l-selection-viya").hide();
                            $("#l-login").show();
                        }
                        
                        if (corporation == 'DRNI' || corporation == 'DRSV' || corporation == 'DRHN') {
                            $('#tour').show();
                            $("#corpDiv").show();
                            $("#corpSelected").text(subcorporacion);
                            $("#l-login").show();
                            $('#l-selection-drvida').hide();
                            $("#loginTypeDocTDB").hide();
                            $("#l-selection").hide();
                            $("#l-selection-bmi").hide();
                            $('#l-selection-viya').hide();
                            $("#l-selection-doctorline").hide();
                            $("#l-selection-dronlinetdb").hide();

                        }

                        if (corporation == 'DRLINE-EMAIL') {
                            $('#tour').show();
                            $('#restore').removeClass('hidden');
                            $("#corpDiv").show();
                            $("#corpSelected").hide();
                            $("#l-login").show();
                            $('#l-selection-drvida').hide();
                            $("#loginTypeDocTDB").hide();
                            $("#l-selection").hide();
                            $("#l-selection-bmi").hide();
                            $("#l-selection-doctorline").hide();
                            $('#l-selection-viya').hide();
                            $("#l-selection-dronlinetdb").hide();
                            $("#password_text").attr('type', 'password');
                        }
                        if(corporation == 'DRLINE-CEDULA'){
                            $('#tour').show();
                            $('#restore').removeClass('hidden');
                            $("#corpDiv").show();
                            $("#corpSelected").hide();
                            $("#l-login").show();
                            $('#l-selection-drvida').hide();
                            $('#l-selection-viya').hide();
                            $("#loginTypeDocTDB").hide();
                            $("#l-selection").hide();
                            $("#l-selection-bmi").hide();
                            $("#l-selection-doctorline").hide();
                            $("#l-selection-dronlinetdb").hide();
                            $("#password_text").attr('type', 'text');

                        }

                        if(corporation == "dronlinetdb") {
                            $("#subcorporationInput").val('');
                            location.href = 'login.php?resource=c6d16db0ccc111ebb8bc0242ac130003&corp=dronlinetdb';
                        }

                        if(corporation == "dronlineretail"){
                            location.href = 'login.php?resource=e4c4aa0f523941d2a332d15101f12e9e&corp=dronlineretail';
                        }
                    }
                }

                function backToSelection() {
                    $("#corpDiv").hide();
                    $("#loginTypeDocTDB").hide();
                    $("#l-selection").show();
                    $("#l-login").hide();
                    $("#subcorporationInput").val("");
                    return false;
                }

                function backToSelection() {
                    if (resourceDomain == 'b27e6e8af2ae40d3bf07f6bc1253bd12') {
                        $("#l-selection").show();
                        $("#l-selection-bmi").hide();
                        $('#l-selection-drvida').hide();
                        $('#l-selection-doctorline').hide();
                        $('#l-selection-viya').hide();

                    } else if (resourceDomain == '1287dcacf358411f95f31b6f61ce597a') {
                        $("#l-selection-bmi").show();
                        $("#l-selection").hide();
                        $('#l-selection-drvida').hide();
                        $('#l-selection-doctorline').hide();
                        $('#l-selection-viya').hide();
                    }
                    else if (resourceDomain == 'c6d16db0ccc111ebb8bc0242ac130003' && paramUrlCorp == 'dronlinetdb') {
                        $("#l-selection-bmi").hide();
                        $("#l-selection").hide();
                        $("#l-selection-dronlinetdb").show();
                        $('#l-selection-drvida').hide();
                        $('#l-selection-doctorline').hide();
                        $('#l-selection-viya').hide();
                        $("#loginTypeDocTDB").hide();
                        $('#restoreButton').addClass('hidden');
                        $("#subcorporationInput").val('');
                    }
                    else if (resourceDomain == 'c6d16db0ccc111ebb8bc0242ac130003') {
                        $("#l-selection-bmi").hide();
                        $("#l-selection").hide();
                        $("#l-selection-dronlinetdb").show();
                        $('#l-selection-drvida').hide();
                        $('#l-selection-doctorline').hide();
                        $('#l-selection-viya').hide();
                    }
                    else if (resourceDomain == 'e4c4aa0f523941d2a332d15101f12e9e' && paramUrlCorp == 'dronlineretail') {
                        $("#l-selection-bmi").hide();
                        $("#l-selection").hide();
                        $("#l-selection-dronlinetdb").show();
                        $('#l-selection-drvida').hide();
                        $('#l-selection-doctorline').hide();
                        $('#l-selection-viya').hide();

                    } else if (resourceDomain == '5f5f16ccdca911ea87d00242ac130003') {
                        $("#l-selection").hide();
                        $("#l-selection-bmi").hide();
                        $("#l-selection-dronlinetdb").hide();
                        $('#l-selection-drvida').show();
                        $('#l-selection-viya').hide();
                        $('#l-selection-doctorline').hide();

                    }else if(resourceDomain == 'c66bbf2a3f4211edb8780242ac120002'){ //Viya corporation: @victorisimoo - 03/10/2022
                        $("#l-selection").hide();
                        $("#l-selection-bmi").hide();
                        $("#l-selection-dronlinetdb").hide();
                        $('#l-selection-drvida').hide();
                        $('#l-selection-doctorline').hide();
                        $('#l-selection-viya').show();
                    }else if (resourceDomain == '8df1b8111f2847648186931a7f591477') {
                        $("#l-selection").hide();
                        $("#l-selection-bmi").hide();
                        $("#l-selection-dronlinetdb").hide();
                        $('#l-selection-viya').hide();
                        $('#l-selection-drvida').hide();
                        $('#l-selection-doctorline').show();
                    }else if (resourceDomain == '7c8ad81240f711edb8780242ac120002' || resourceDomain == '4967e00040fd11edb8780242ac120002' || 
                    resourceDomain == '770a8b8c40ff11edb8780242ac120002' || resourceDomain == 'ca4c9b2e410311edb8780242ac120002') {
                        location.href = 'login.php?resource=c66bbf2a3f4211edb8780242ac120002';
                    }
                    $("#corpDiv").hide();
                    $("#loginTypeDocTDB").hide();
                    $("#l-login").hide();
                    $("#subcorporationInput").val("");
                    return false;
                }


                $('#backToMapfreServices').click(() => {
                    $('#subcorporationMapfre').removeClass('hidden');
                    $('#servicesMapfreSalud').addClass('hidden');
                });

                $('#backToMapfreSalud').click(() => {
                    $('#servicesMapfreSalud').removeClass('hidden');
                    $('#servicesAccidentesPersonales').addClass('hidden');
                });
            </script>
        <?php }
ob_end_flush();?>
</body>
</html>


<!--<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
<script>
  var OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: "93cc6fa5-0cd5-423e-8de3-055a33d49e12",
    });
    OneSignal.getUserId(function(id){
        console.log(id)
    });
  });


  OneSignal.push(function() {
    OneSignal.getUserId(function(id){
        console.log("Id desde otro lado " +id);
    });
  });


</script>-->




