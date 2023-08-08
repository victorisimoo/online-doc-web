<?php
ob_start();
include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'Επαναφορά επικύρωσης';
include_once ('layout/head-private.php');
$resource = "";
$movil = "";
$token = "";
if (isset($_GET['movil'])) {
    $movil = "true";
} else {
    $movil = "false";
}
if (isset($_GET['resource']) && !empty($_GET['resource'])) {
    $resource = $_GET["resource"];
    if(array_key_exists("resource",$_COOKIE) && $_COOKIE['resource'] != $_GET['resource']){
        setcookie("resource", $resource, time() + (10 * 365 * 24 * 60 * 60), "/","",true,0);
    }
} else if(isset($_COOKIE['resource'])){
    $resource = $_COOKIE['resource'];
}
if(isset($_GET['token']) && !empty($_GET['token'])){
    $token = $_GET['token'];
} else {

}
?>


<?php
$resource = "";
$movil = "";
if (isset($_GET['movil'])) {
    $movil = "true";
} else {
    $movil = "false";
}
if (isset($_GET['resource']) && !empty($_GET['resource'])) {
    $resource = $_GET["resource"];
    if(array_key_exists("resource",$_COOKIE) && $_COOKIE['resource'] != $_GET['resource']){
        setcookie("resource", $resource, time() + (10 * 365 * 24 * 60 * 60), "/","",true,0);
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

} else if(isset($_COOKIE['resource'])){
    $resource = $_COOKIE['resource'];
}
?>


<?php
if (isset($_POST['password']) && isset($_POST['passwordConfirm'])) {
    if ($_POST['password'] <> $_POST['passwordConfirm']) {
        echo "<div class=\"alert alert-danger alert-error text-center\">";
        echo "<i class=\"fa fa-exclamation-triangle icons pull-left\"></i>Las contraseñas no coinciden, por favor verifica tu información";
        echo '</div>';
    } else {
        $url = constant('API_ADMIN') . 'adm-user/confirmResetPassword';
        $headers = array(
            "Content-Type: application/json",
        );
        $data_to_post = array();
        $data_to_post['resetPasswordToken'] = $_GET['token'];
        $data_to_post['rawPassword'] = $_POST['password'];

        $data_string = json_encode($data_to_post);
        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 0); // On dev server only!
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($handle);
        $json = json_decode($result, true);
        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
        if ($httpCode == 200) {
            header('Location: reset-password-complete.php?type='.$json['user_type']);
        } else {
            echo "<div class=\"alert alert-danger alert-error text-center\">";
            echo "<i class=\"fa fa-exclamation-triangle icons pull-left\"></i>No hemos podido reinciar tu contraseña. Valida que has navegado desde tu bandeja de correo hacia esta página e intentalo de nuevo.";
            echo '</div>';
        }
    }
}

?>
<body class="login-lp">                
    <div>
        <div id="brand-header" class=" text-center">
            <img class="i-logo img-responsive" id="logo" src="" alt="" style='cursor:pointer;'>
        </div>            

        <div class="row">
            <div class="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12">                                                   
                <div class="login-content">
                    <!-- Login -->
                    <div class="lc-block toggled" id="l-login" style="background-color: #fff; padding: 15px; border-radius: 10px;
                    margin-top:10px; max-width:none !important; width:100%;">
                        <div id="alertDiv" class="alert alert-danger alert-error text-center hidden" style="background-color: #F44336; font-size: 13px;">
                            <i class="fa fa-exclamation-triangle icons pull-left" style="margin-top: 4px;"></i>
                            <p style="margin-top: 0px !important;" id = "msg_title">No hemos podido restablecer tu contraseña. Tu tiempo disponible para restablecerla se ha terminado. Te hemos enviado un nuevo correo para que puedas completar el proceso.</p>
                        </div>
                        <p style="margin-top: 0px !important;" id = "restore_pa"><strong>Restablece tu contraseña</p>
                        <p style="margin-top: 0px !important;" id = "restore_pa2"><strong> En este formulario puedes restablecer tu contraseña para la plataforma.</strong></p>
                        <div class="lcb-form">
                            <form id="formNuevo" name="formNuevo">
                                <div class="fg-line">
                                    <input type="password" minlength="4" class="form-control" placeholder="Nueva contraseña" id="newPassword" name="password" required data-required-message="Rellene el campo">
                                    <div class="tooltipWrapperError" tabindex="-1" id="togglePass">
                                        <span class="nf-svg-icon">
                                            <i id='eyeIcon' class="fa fa-eye fa-lg tooltipWrapperError" aria-hidden="true" style="color: #afacac; cursor: pointer;"></i>
                                        </span>
                                    </div>
                                </div>
                                <br/>
                                <br/>
                                <div class="progress" style="height: 15px;">
                                    <div id = "progressBar" name = "progressBar" class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
                                        
                                    </div>
                                </div>
                                <br/>

                                <div class="fg-line" style="margin-top:15px;">
                                    <input type="password" minlength="4" class="form-control" placeholder="Cofirma tu contraseñaaaa" id="passwordConfirm" name="passwordConfirm" pattern="^\S*$" required>
                                </div>
                                <p id="message" style="text-align: end; color: #F44336;" class="hidden"><b>No coinciden las contraseñas</b></p>

                                <button class="btn btn-lg btn-login" id="reset_button" type="submit" name="reset_button" style="font-size: 15px !important; margin-top: 15px;"><i class="fa-li fa fa-spinner fa-spin hidden" id="icon" style="position: initial !important;"></i>Restablecer contraseña</button>
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
        .tooltipWrapperError {
        position: absolute;
        top: 6px;
        right: 10px;
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
    <script src="../js/functions.js?random=<?php echo uniqid(); ?>"></script>    
    <?php   if ($resource != "") { ?>
            <script> 
                const resourceDomain = "<?php echo $resource ?>"; 
                const token = "<?php echo $token ?>";
                
                if(localStorage.getItem('translation')){                    
                    userTranslations = JSON.parse(localStorage.getItem('translation'));
                    console.log(userTranslations);
                }else {                    
                    const trans = <?php echo $resultTranslations ?>;
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

                $("html head title").text(userTranslations.LABELPASS);
                $("#msg_title").text(userTranslations.RESTART_PASSWORD_FAIL);
                $("#newPassword").attr("placeholder", userTranslations.NEW_PASSWORD);
                $("#passwordConfirm").attr("placeholder", userTranslations.PASSWORD_CONFIRM);
                $("#restore_pa").text(userTranslations.LABELPASS);
                $("#restore_pa2").text(userTranslations.RESTART_PASSWORD_FORM_TEXT);
                $("#message").text(userTranslations.PASSWORD_MISMATCH);
                $("#reset_button").html(userTranslations.RESTORE_PASSWORD);
                $('input[required]').on('invalid', function() {
                    this.setCustomValidity($(this).data("required-message"));
                });


                if (resourceDomain == 'b27e6e8af2ae40d3bf07f6bc1253bd12') {
                    $("#l-login").hide();
                } else {
                    $("#l-selection").hide();
                    $("#corpDiv").hide();
                }
                $('#formIngreso').submit(function() {
                    $("#icon").show();
                    return true;
                });
                var titleCor;
                var exist_apps = false;
                var _successFound = function() {
                    $('#successModal').modal('show');
                }
                var _errorFound = function() {
                    $('#errorModal').modal('show');
                }
                $(document).ready(function() {
                    $("#reset_button").attr("disabled", "disabled");
                    (function($) {
                        $.fn.inputFilter = function(inputFilter) {
                            return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
                                if (inputFilter(this.value)) {
                                    this.oldValue = this.value;
                                    this.oldSelectionStart = this.selectionStart;
                                    this.oldSelectionEnd = this.selectionEnd;
                                } else if (this.hasOwnProperty("oldValue")) {
                                    this.value = this.oldValue;
                                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
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
                    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                    if (!(is_chrome || is_firefox)) {
                        $("#browserValidator").show();
                    } else {
                        $("#browserValidator").hide();
                    }
                    
                    var endpointCorporate = '<?php echo constant('API_URL_BASE') ?>dronline-admin-api/api/corporate/<?php echo $resource; ?>';
                    var response = getResource(endpointCorporate, "", "GET");

                    $("#logo").click(function() {
                        window.location.href = "<?php echo $URLBase. $webSiteName ."views/login.php?resource=". $resource ?>";
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

                    if (response.corporateCssUrl != "" && response.corporateName != "") {
                        var d = new Date();
                        d.setFullYear(d.getFullYear() + 10);
                        document.cookie = "corpname=" + response.corporateName + ";expires=" + d + ";path=/";
                        document.cookie = "language=" + response.languageId.isoCode + ";expires=" + d + ";path=/";
                        document.cookie = "movil=" + '<?php echo $movil; ?>' + ";expires=" + d + ";path=/";
                        $("#icono").attr("href", '../css/brands/' + response.corporateName + '/tabicon.png');
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
                        $("#logo-error").attr("src", imgUrl);
                        var url = "<?php echo constant('API_URL_BASE') ?>dronline-admin-api/api/parameter/findByName?name=" + response.corporateName + "_PLATFORM_NAME";
                        var data = getResource(url, "", "GET");
                        titleCor = data.value;
                    }

                    function sendPost() {
                        if($("#newPassword").val() == $("#passwordConfirm").val()){
                            $('#icon').removeClass('hidden');
                            $("#reset_button").attr("disabled", "disabled");
                            var url = "<?php echo constant('API_SECURITY'); ?>password/restoreToken";
                            var formPostData = {
                                "token":token,
                                "newPassword": $("#newPassword").val(),
                                "newPasswordConfirm": $("#passwordConfirm").val(),
                                "type":"validator"
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
                                        window.location.replace("<?php echo $URLBase. $webSiteName ."views/reset-password-complete.php?resource=". $resource ?>");
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
                        var equalsPassword = false;
                        if ($('#newPassword').val().trim() != "" && ($('#newPassword').val() == $('#passwordConfirm').val())) {
                                equalsPassword = true;
                                $('#message').addClass('hidden');
                        } else {
                            equalsPassword = false;
                            $("#reset_button").attr("disabled", "disabled");
                            $('#message').removeClass('hidden');
                        } 
                        validates(equalsPassword);
                    });
                    $('#newPassword').on('keyup', function () {

                        var equalsPassword = false; 

                        if ($('#newPassword').val().trim() != "" && ($('#newPassword').val() == $('#passwordConfirm').val())) {
                            equalsPassword = true;
                            $('#message').addClass('hidden');
                        } else {
                            equalsPassword = false;
                            $("#reset_button").attr("disabled", "disabled");
                            $('#message').removeClass('hidden');
                        } 
                        
                        validates(equalsPassword);
                    
                    });
                    
                    function validates(equalsPassword){
                        var regexWeak = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,30}$");

                        var regexStrong = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%^*#?&=])[A-Za-z\\d@$!%*#?&]{6,30}$");
                            
                        var regexMedium = new RegExp("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{6,16}$");

                        var element = document.getElementById('progressBar');

                        var value = document.getElementById('newPassword').value;

                        console.log("validator");
                        console.log("<?php echo array_key_exists("statusGDPR",$_COOKIE)? $_COOKIE["statusGDPR"]: ""; ?>");
                        var status = "<?php echo array_key_exists("statusGDPR",$_COOKIE)? $_COOKIE["statusGDPR"]: ""; ?>";

                        if (regexStrong.test(value)) {
                            element.style["width"] = "100%"; 
                            element.innerHTML  = "";
                            element.className = "progress-bar progress-bar-success";

                            if(equalsPassword){
                                $('#complexity').addClass('hidden');
                                $("#reset_button").attr("disabled", false);
                            }
                            
                        } else if (regexMedium.test(value)) {
                            element.style["width"] = "60%";
                            element.className = "progress-bar progress-bar-info"; 
                            element.innerHTML  = "";
                            if(status == 1){
                                $("#reset_button").attr("disabled", "disabled");
                                $('#complexity').removeClass('hidden');
                            }else{
                                    $("#reset_button").attr("disabled", false);
                                    $('#complexity').addClass('hidden');
                            }
                        } else if (regexWeak.test(value)) {
                            element.style["width"] = "30%";
                            element.className = "progress-bar progress-bar-warning"; 
                            element.innerHTML  = "";
                            if(status == 1){
                                $("#reset_button").attr("disabled", "disabled");
                                $('#complexity').removeClass('hidden');
                            }else{
                                if(equalsPassword){
                                    $("#reset_button").attr("disabled", false);
                                    $('#complexity').addClass('hidden');
                                }
                            } 
                        }else {
                            element.style["width"] = "0%"; 
                            element.className = "progress-bar progress-bar-danger"; 
                            element.innerHTML  = "";
                            $('#complexity').removeClass('hidden');
                            $("#reset_button").attr("disabled", "disabled");
                        }
                    }
                    
                    
                });
            </script>
            <?php  } ob_end_flush();?>
</body>
</html>
