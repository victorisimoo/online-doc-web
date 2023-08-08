<?php
ob_start();
include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
if(isset($_COOKIE['admdron'])) {
    $admdron = json_decode($_COOKIE['admdron']);
    if($admdron->{'authz'}->{'roles'}[0] == "PATIENT"){
        header('Location: ../private/index.php#/pages/patient');
    }else{
        header('Location: ../private/index.php#/pages/doctor');
    }
}else{
    setcookie("corpname", "vanilla", 0,"/",constant('DOMAIN_BASE'),true, 0);
    setcookie("corpclass", "vanilla", 0,"/",constant('DOMAIN_BASE'),true, 0);
}
$paginaActual = 3;
$nombrePaginaActual = 'Login';

if(isset($_GET["lang"]) && in_array($_GET['lang'], array('en','es','fr','grc'))){
    setcookie("language", $_GET["lang"], 0,"/",constant('DOMAIN_BASE'),true, 0);
    $GLOBALS["language"] = $_GET["lang"];
}

if(!isset($GLOBALS["language"])){
    if(!isset($_COOKIE["language"])){
        setcookie("language", "es", 0,"/",constant('DOMAIN_BASE'),true, 0);
        $GLOBALS["language"] = "es";
    }else{
        $GLOBALS["language"] = $_COOKIE["language"];
    }
}
$urlTranslations = constant('API_ADMIN') . 'translations';
$data_to_post_trans = array();
$data_to_post_trans['type'] = 2;
$data_to_post_trans['languageIsoCode'] = $GLOBALS["language"];
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
function getTranslation($name){
    
    return "<script>document.write(getTranslation('$name')); </script>";
}

    $msg = '';
    if (isset($_POST['login']) && !empty($_POST['username']) && !empty($_POST['password'])) {
        $url = constant('API_SECURITY') . 'auth/doctor';
        $headers = array(
            "Content-Type: application/json",
        );
        $data_to_post = array();
        $data_to_post['principal'] = $_POST['username'];
        $data_to_post['credentials'] = $_POST['password'];
        $data_to_post['language'] = $GLOBALS["language"];
        $data_string = json_encode($data_to_post);
        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($handle);
        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
        if ($httpCode == 200) {
            curl_close($handle);
            setcookie("corpname", "vanilla", 0,"/",constant('DOMAIN_BASE'),true, 0);
            $data = json_decode($result);
            setcookie("language", $data->{'language'} , 0,"/",constant('DOMAIN_BASE'),true, 0);
            setcookie("admdron", $result, 0,"/",constant('DOMAIN_BASE'),true, 0);
            $data = json_decode($result);
            
            if ($data->{'isPasswordRestored'} == false) {
                header('Location: ../private/index.php#/pages/restoredoctorpassword');
            }else{
                if($data->{'attentionType'} == 1){
                    header('Location: ../private/index.php#/pages/doctor');                
                } else {
                    header('Location: ../private/index.php#/pages/medical-appointment-doc');
                }
            }

            
        } else {
            $GLOBALS['showError'] = true;  
            $data = json_decode($result);
            if(isset($data->{'attemptsRemaining'})){
                $attempts = $data->{'attemptsRemaining'};
            }
        }
    }
    include_once ('layout/head-private.php');
?>
<script src="../private/vendors/bower_components/jquery/dist/jquery.min.js"></script>
<script src="../private/vendors/bower_components/jquery-ui/jquery-ui.min.js"></script>
<script src="../private/vendors/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../js/translations/translation.js"></script>
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
                            Tu cuenta ha sido bloqueada
                        </h2>
                            <h4 id="account-blocked-modal-text">
                            Has sobrepasado el número de intentos, se ha bloqueado tu cuenta, vuelve a intentarlo en un momento.
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
<?php 
    if(isset($GLOBALS['showError']) && $GLOBALS['showError'] == true){
        echo "<div id = \"div_error\" class=\"alert alert-danger alert-error text-center\">";
        if(isset($attempts)){
            echo '</div>';
            if(isset($attempts)  && $attempts == 0){
                ?>
                <script type="text/javascript">
                    $('#accountBlokedModal').modal('show');
                </script>
                <?php
            }
        }else{
            echo '</div>';
        }
    }
?>
<body style="background-color: #fff;">
    <div class="card-body card-padding">
        <div class="card-header">
            <div class="row" style="padding-top: 10px;">
                <div class="col-lg-10">
                    <a><img src="../img/logo_dr_online_color.png" alt=""></a>
                </div>
                <div class="col-lg-2">
                    <div class="input-group m-b-20" style="padding-top: 15px">
                        <span class="input-group-addon" style="background-color: gray">
                            <i class="zmdi zmdi-globe"></i>
                        </span>
                        <select class="form-control" id="langSelector">
                            <option value="en" <?php echo ($GLOBALS["language"]=="en"?"selected":""); ?>>English (En)
                            </option>
                            <option value="es" <?php echo ($GLOBALS["language"]=="es"?"selected":""); ?>>Spanish (Es)
                            </option>
                            <option value="grc" <?php echo ($GLOBALS["language"]=="grc"?"selected":""); ?>>Greek (Grc)
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="divider"></div>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 5%">
            <div class="col-12" style="text-align: center;">
                <p><strong id="loginText"></strong></p>
            </div>

            <div class="col-xs-12 col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3">

                <div class="login-content">
                    <!-- Login -->
                    <div class="lc-block toggled" id="l-login">

                        <div class="lcb-form">
                            <form id="formIngreso" name="formIngreso"
                                action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
                                <div class="input-group m-b-20">
                                    <span class="input-group-addon" style="background-color: gray">
                                        <i class="zmdi zmdi-email"></i>
                                    </span>
                                    <input type="text" class="form-control" name="username" id="txtUsername">
                                </div>

                                <div class="input-group m-b-20">
                                    <span class="input-group-addon" style="background-color: gray">
                                        <i class="zmdi zmdi-lock"></i>
                                    </span>
                                    <input type="password" class="form-control" name="password" id="txtPassword">
                                </div>

                                <div id="countAttempsFaileds">
                                    
                                </div>

                                <button class="btn bgm-green" type="submit" id="login" name="login"
                                    style="font-size: 14px;"><span id="icon" class="spinner-border hidden" role="status"
                                        style="margin-right:5px;" aria-hidden="true"></span>
                                </button>

                                <p></br><a
                                        href="reset-password-doc.php" id="forgotPassword"></a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-3">
            </div>
            <div class="col-xs-6">

            </div>
        </div>
    </div>
    <style>
        .fg-line:not([class*=has-]):after {
            background: #26ad6e;
        }
    </style>
    <!-- Javascript Libraries -->
    <script src="../private/vendors/bower_components/jquery/dist/jquery.min.js"></script>
    <script src="../private/vendors/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="../private/vendors/bower_components/Waves/dist/waves.min.js"></script>
    <script src="../private/js/app.min.js?random=<?php echo uniqid(); ?>"></script>
    <script src="../private/js/jquery-2.0.3.min.js"></script>
    <script>
        let language = "<?php echo $GLOBALS['language'] ?>";
        var userTranslations;
        const trans =  <?php echo $resultTranslations ?>;
        if(trans.translations != undefined && trans.translations != null) {
            userTranslations = trans.translations.reduce(function(acc, curr) {
            acc[curr.key] = curr.value;
            return acc;
            }, {});
            localStorage.setItem('translation', JSON.stringify(userTranslations));

        } else {
            document.querySelector('#login').innerHTML =  "Iniciar sesión"; 
            document.querySelector('#forgotPassword').innerHTML =  "¿Olvidaste tu contraseña?";
            document.querySelector('#loginText').innerHTML = "Inicia sesión con tu dirección de email"; 
            $("#txtUsername").attr("placeholder", "Correo electrónico");
            $("#txtPassword").attr("placeholder", "Contraseña");
        }
        function getTranslation(name){
            if(userTranslations){
                return userTranslations[name];
            } else {
                getTranslation(language,name);
            }
        }
        $(document).ready(function () {

            $("#icono").attr("href", '../css/brands/vanilla/icono.png');
            $("#login").click(function () {
                $("#icon").removeClass("hidden");
            });
        });

        $("#langSelector").change(function () {
            window.location.href = window.location.href.split("?lang")[0] + "?lang=" + $("#langSelector").val();
        });

        document.querySelector('#login').innerHTML =  getTranslation("LOGIN"); 
        document.querySelector('#forgotPassword').innerHTML =  getTranslation("FORGOT_PASSWORD");
        document.querySelector('#loginText').innerHTML =  getTranslation("LOGIN_TEXT_DOCTOR"); 

        $("#txtUsername").attr("placeholder", getTranslation("CORREO"));
        $("#txtPassword").attr("placeholder", getTranslation("PASSWORD"));
        $('#account-blocked-modal-title').text(getTranslation("ACCOUNT_BLOCKED_MODAL_TITLE"));
        $('#account-blocked-modal-text').text(getTranslation("ACCOUNT_BLOCKED_MODAL_TEXT"));
        $('#div_error').text(getTranslation("INVALID_CREDENTIALS"));
    </script>
    <?php
    if(isset($attempts)  && $attempts > 0){
    ?>
        <script>
            $('#countAttempsFaileds').text(getTranslation("label_DatosInco_Intentos") +" "+ <?php echo $attempts ?>);
        </script>
    <?php } ob_end_flush(); ?>
</body>

</html>