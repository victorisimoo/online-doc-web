<?php
ob_start();
include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'Reinicio de contraseña';
$nameLng = "";

if(isset($_GET["lang"]) && in_array($_GET['lang'], array('en','es','fr','grc'))){
    unset($_COOKIE["language"]);
    $nameLng = $_GET["lang"];
    setcookie("language", $nameLng, 0,"/",constant('DOMAIN_BASE'),true, 0);
    $GLOBALS["language"] = $nameLng;
}

if(!isset($GLOBALS["language"])){
    if(!isset($_COOKIE["language"])){
        setcookie("language", "en", 0,"/",constant('DOMAIN_BASE'),true, 0);
        $GLOBALS["language"] = "en";
    }else{
        $GLOBALS["language"] = $_COOKIE["language"];
    }
}

/*
    author: victorisimoo
    description: obtención de id del usuario para verificar configuración
    date: 2023-03-28
 */

$urlGetInfoConf = constant('API_ADMIN') . 'corporate/getPasswordTextsConfigs/' . $_GET['token'];
$handleGetInfoConf = curl_init();
curl_setopt($handleGetInfoConf, CURLOPT_URL, $urlGetInfoConf);
curl_setopt($handleGetInfoConf, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($handleGetInfoConf, CURLOPT_RETURNTRANSFER, true);
curl_setopt($handleGetInfoConf, CURLOPT_SSL_VERIFYPEER, false);
$resultGetInfoConf = curl_exec($handleGetInfoConf);
$httpCodeGetInfoConf = curl_getinfo($handleGetInfoConf, CURLINFO_HTTP_CODE);
curl_close($handleGetInfoConf);

if($httpCodeGetInfoConf == 200){
    
    $passwordMaxLength = null;
    $passwordPattern = null;
    $passwordMinLength = null;

    $resultGetInfoConf = json_decode($resultGetInfoConf);

    foreach($resultGetInfoConf->translations as $textTranslations){
        if($textTranslations->key == "PASSWORD_TOOLTIP"){
            $passwordTooltip = $textTranslations->value;
        }else if ($textTranslations->key == "PASSWORD_SPECS"){
            $passwordSpecs = $textTranslations->value;
        }else if ($textTranslations->key == "PASSWORDS_DONT_MATCH"){
            $passwordNontMatch = $textTranslations->value;
        }else if ($textTranslations->key == "RESTART_PASSWORD_FAIL"){
            $passwordFail = $textTranslations->value;
        }else if ($textTranslations->key == "RESTART_PASSWORD_SUCCESS"){
            $passwordSuccess = $textTranslations->value;
        }else if ($textTranslations->key == "PASSWORD_ERROR_MSG"){
            $passwordErrorMsg = $textTranslations->value;
        }else if ($textTranslations->key == "NEW_PASSWORD"){
            $newPassword = $textTranslations->value;
        }else if ($textTranslations->key == "PASSWORD_CONFIRM"){
            $confirmPassword = $textTranslations->value;
        }else if ($textTranslations->key == "RESTART_PASSWORD_DOC"){
            $restartPasswordDoc = $textTranslations->value;
        }else if ($textTranslations->key == "RESTART_PASSWORD_FORM_TEXT"){
            $restartPasswordFormText = $textTranslations->value;
        }else if ($textTranslations->key == "PASSWORD_RESTARTED"){
            $passwordRestarted = $textTranslations->value;
        }else if ($textTranslations->key == "RESTART_PASSWORD"){
            $restartPassword = $textTranslations->value;
        }else if ($textTranslations->key == "LOGIN"){
            $loginPassword = $textTranslations->value;
        }
    }
    
    if(isset($resultGetInfoConf->configs)){
        if(isset($resultGetInfoConf->configs->PASSWORD_PATTERN_DOCTOR)){
            $passwordPattern = '^' . $resultGetInfoConf->configs->PASSWORD_PATTERN_DOCTOR;
        }else {
            $passwordPattern = "^\S*$";
        }

        if(isset($resultGetInfoConf->configs->PASSWORD_MAX_LENGTH)){
            $passwordMaxLength = $resultGetInfoConf->configs->PASSWORD_MAX_LENGTH;
        }else {
            $passwordMaxLength = 20;
        }

        if(isset($resultGetInfoConf->configs->PASSWORD_MIN_LENGTH)){
            $passwordMinLength = $resultGetInfoConf->configs->PASSWORD_MIN_LENGTH;
        }else {
            $passwordMinLength = 8;
        }

    }else {
        $passwordMaxLength = 20;
        $passwordPattern = "^\S*$";
        $passwordMinLength = 8;
    }

}else {
    echo "<div class=\"alert alert-danger alert-error text-center\">";
    echo "<i class=\"fa fa-exclamation-triangle icons pull-left\"></i>".$passwordErrorMsg;
    echo '</div>';
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
include_once ('layout/head-private.php');
ob_end_flush();
?>

<script type="text/javascript">
    let language = "<?php echo $GLOBALS['language'] ?>";
</script>
<script type="text/javascript" src="../js/translations/translation.js"></script>
<?php

function getTranslation($name){
    return "<script> document.write(getTranslation('".$GLOBALS['language']."','$name')); </script>";
}

if(isset($_GET['token']) && !empty($_GET['token'])){
    $token = $_GET['token'];
} else {
    $token = "";
}
if (isset($_POST['email'])) {
    $url = constant('API_ADMIN').'adm-user/resetPassword';
    $headers = array(
        "Content-Type: application/json",
    );
    $data_to_post = array();
    $data_to_post['email'] = $_POST['email'];
    $data_to_post['userType'] = "PATIENT";
    
    $data_string = json_encode($data_to_post);
    $handle = curl_init();
    curl_setopt($handle, CURLOPT_URL, $url);
    curl_setopt($handle, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($handle, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 0); // On dev server only!
    curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
    $result = curl_exec($handle);
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    if ($httpCode == 200) {
        header('Location: reset-password-pending.php');
    } else {
        echo "<div class=\"alert alert-danger alert-error text-center\">";
        echo "<i class=\"fa fa-exclamation-triangle icons pull-left\"></i>".$passwordErrorMsg;
        echo '</div>';
    }
}
?>
<body style="background-color: #fff;">
    <div class="card">                    
    </div>                 
    <div class="card-body card-padding">
        <div class="card-header text-center">
            <a href="login-doc.php"><img class="i-logo" src="../img/logo_dr_online_color.png" alt=""></a>
        </div>
        <div class="row">
            <div class="divider"></div>
        </div>                

        <div class="row">
            <div class="col-xs-12 col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3">
                <div class="login-content">
                    <!-- Login -->
                    <div class="lc-block toggled" id="l-login">
                        <div id="formDiv">
                            <div id="alertDiv" class="alert alert-danger alert-error text-center hidden" style="background-color: #F44336; font-size: 13px;">
                                <i class="fa fa-exclamation-triangle icons pull-left" style="margin-top: 4px;"></i>
                                <p style="margin-top: 0px !important;" id="restart_password_fail">
                                    <?php echo $passwordFail;?>
                                </p>
                            </div>
                            <p style="margin-top: 0px !important;">
                                <strong>
                                    <h3 id="restart_password_doc"><?php echo $restartPasswordDoc; ?></h3>
                                    <br><br>
                                    <p id="restart_password_form_text"><?php echo $restartPasswordFormText; ?></p>
                                </strong>
                            </p>
                            <div class="lcb-form">
                                <form id="formNuevo" name="formNuevo">
                                    <div class="fg-line">
                                        <input type="password" minlength="<?php echo $passwordMinLength?>" maxlength="<?php echo $passwordMaxLength?>" class="form-control border-radius" placeholder="<?php echo $newPassword ?>" id="newPassword" name="password" 
                                        pattern="<?php echo $passwordPattern ?>" title="<?php echo $passwordSpecs ?>" required>
                                        <div class="tooltipWrapperError" tabindex="-1" id="togglePass">
                                            <span class="nf-svg-icon">
                                                <i id='eyeIcon' class="fa fa-eye fa-lg tooltipWrapperError" aria-hidden="true" style="color: #afacac; cursor: pointer;"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="fg-line" style="margin-top:15px;">
                                        <input type="password"  minlength="<?php echo $passwordMinLength?>" maxlength="<?php echo $passwordMaxLength?>" 
                                        title="<?php echo $passwordSpecs ?>" class="form-control border-radius" placeholder="<?php echo $confirmPassword ?>" id="passwordConfirm" name="passwordConfirm" required>
                                    </div>
                                    <p id="message" style="text-align: end; color: #F44336;" class="hidden">
                                        <b id="password_dont_match">
                                            <?php echo $passwordNontMatch;?>
                                        </b>
                                    </p>
                                    <button class="btn bgm-green" id="reset_button" type="submit" name="reset_button" style="font-size: 15px !important; margin-top: 15px;">
                                        <span id="icon" class="spinner-border hidden" role="status" style="margin-right:5px;" aria-hidden="true">                              
                                        </span>
                                        <?php echo $restartPassword;?>
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div class="hidden" id="successDiv">
                        <b><i class="retailColor fa fa-4x fa-unlock-alt" aria-hidden="true"></i>    
                        <p>
                            <strong id="password_restarted">
                                <?php echo $passwordRestarted;?>
                            </strong>
                        </p>
                            <div class="lcb-form">
                                <p id="password_success">
                                    <?php echo $passwordSuccess;?>
                                </p>
                                <a href="login-doc.php" class="btn bgm-green" id="login_button_text" name="login_button" style="font-size: 15px !important; margin-top: 15px;">
                                    <?php echo $loginPassword;?>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>   
    <style>
        .tooltipWrapperError {
        position: absolute;
        top: 6px;
        right: 10px;
    }
    .fg-line:not([class*=has-]):after {
        background: #26ad6e;
    }
    </style>             


    <!-- Javascript Libraries -->
    <script src="../private/vendors/bower_components/jquery/dist/jquery.min.js"></script>
    <script src="../private/vendors/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>

    <script src="../private/vendors/bower_components/Waves/dist/waves.min.js"></script>
    <script src="../private/vendors/bower_components/moment/min/moment.min.js"></script>
    <script src="../private/vendors/bower_components/bootstrap-select/dist/js/bootstrap-select.js"></script>
    <script src="../private/vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>

    <!-- Placeholder for IE9 -->
    <!--[if IE 9 ]>
        <script src="vendors/bower_components/jquery-placeholder/jquery.placeholder.min.js"></script>
    <![endif]-->

    <script src="../private/js/app.min.js"></script>
    <!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>-->
    <script src="../private/js/jquery-2.0.3.min.js"></script>
    <script>
        //let language = "<?php echo $GLOBALS['language'] ?>";
        var userTranslations;
        const trans =  <?php echo $resultTranslations ?>;
        if(trans.translations != undefined && trans.translations != null) {
            userTranslations = trans.translations.reduce(function(acc, curr) {
            acc[curr.key] = curr.value;
            return acc;
            }, {});
            localStorage.setItem('translation', JSON.stringify(userTranslations));
            var transDoctor = JSON.parse(localStorage.getItem('translation'));
            //document.querySelector('#newPassword').setAttribute("title", transDoctor.PASSWORD_TOOLTIP_PATTERN); 
            document.title = transDoctor.RESTORE_PASSWORD;
        } else {
            document.title = 'Restablecer constraseña';
        }
        $( document ).ready(function() {
            $("#icono").attr("href",'../css/brands/vanilla/icono.png');
            const token = "<?php echo $token ?>";
            function sendPost() {
                if($("#newPassword").val() == $("#passwordConfirm").val()){
                    $('#icon').removeClass('hidden');
                    $("#reset_button").attr("disabled", "disabled");
                    var url = "<?php echo constant('API_SECURITY'); ?>password/restoreToken";
                    var formPostData = {
                        "token":token,
                        "newPassword": $("#newPassword").val(),
                        "newPasswordConfirm": $("#passwordConfirm").val(),
                        "type":"password"
                    }
                    $.ajax({
                        url: url,
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify(formPostData),
                        success: function (res) {
                            if(res.code == 200){
                                $("#alertDiv").addClass('hidden');
                                $("#reset_button").attr("disabled", false);
                                $("#formDiv").addClass('hidden');
                                $("#successDiv").removeClass('hidden');
                            }
                            else{
                                $("#alertDiv").removeClass('hidden');
                                $('#icon').addClass('hidden');
                                $("#reset_button").attr("disabled", false);
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            $("#alertDiv").removeClass('hidden');
                            $('#icon').addClass('hidden');
                            $("#reset_button").attr("disabled", false);
                        }
                    });  
                } else {
                    $("#reset_button").attr("disabled", "disabled");
                    $('#message').removeClass('hidden');
                }
            }

            $('form').submit(function(event) {
                sendPost();
                event.preventDefault();
            });

            $('#passwordConfirm').on('keyup', function () {
                if ($('#newPassword').val().trim() != "" && ($('#newPassword').val() == $('#passwordConfirm').val())) {
                    $("#reset_button").attr("disabled", false);
                    $('#message').addClass('hidden');
                } else {
                    $("#reset_button").attr("disabled", "disabled");
                    $('#message').removeClass('hidden');
                } 
            });

            $('#newPassword').on('keyup', function () {
                if ($('#newPassword').val().trim() != "" && ($('#newPassword').val() == $('#passwordConfirm').val())) {
                    $("#reset_button").attr("disabled", false);
                    $('#message').addClass('hidden');
                } else {
                    $("#reset_button").attr("disabled", "disabled");
                    $('#message').removeClass('hidden');
                } 
            });

        });
        $("#eyeIcon").click(function() {
            if($("#eyeIcon").hasClass("fa-eye")){
                $("#eyeIcon").removeClass("fa-eye");
                $("#eyeIcon").addClass("fa-eye-slash");
                $("#newPassword").attr('type', 'text');
            } else {
                $("#eyeIcon").removeClass("fa-eye-slash");
                $("#eyeIcon").addClass("fa-eye");
                $("#newPassword").attr('type', 'password');
            }
        });
    </script>
</body>
</html>