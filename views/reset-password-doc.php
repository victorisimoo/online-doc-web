<script type="text/javascript" src="../js/translations/translation.js"></script>
<?php
if(isset($_COOKIE['admdron'])) {
    header('Location: ../private/index.php#/pages/doctor');
}
include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'Reinicio de contraseña';


if(isset($_GET["lang"]) && in_array($_GET['lang'], array('en','es','fr'))){
    setcookie("language", $_GET["lang"], 0,"/",constant('DOMAIN_BASE'),true, 0);
    $GLOBALS["language"] = $_GET["lang"];
}
if(!isset($GLOBALS["language"])){
    if(!isset($_COOKIE["language"])){
        setcookie("language", "en", 0,"/",constant('DOMAIN_BASE'),0, true, 0);
        $GLOBALS["language"] = "en";
    }else{
        $GLOBALS["language"] = $_COOKIE["language"];
    }
}
include_once ('layout/head-private.php');
?>
<script type="text/javascript">
    let language = "<?php echo $GLOBALS['language'] ?>";
</script>
<?php

function getTranslation($name){
    return "<script> document.write(getTranslation('".$GLOBALS['language']."','$name')); </script>";
}

$msg = '';
if (isset($_POST['email'])) {
    $url = constant('API_ADMIN').'adm-user/resetPassword';
    $headers = array(
        "Content-Type: application/json",
    );
    $data_to_post = array();
    $data_to_post['email'] = $_POST['email'];
    $data_to_post['userType'] = "DOCTOR";
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
        echo "<i class=\"fa fa-exclamation-triangle icons pull-left\"></i>No hemos podido encontrar el email en nuestros registros. Por favor verifica";
        echo '</div>';
    }
}
?>

<body style="background-color: #fff;">
    <div class="card-body card-padding">
        <div class="card-header" style="padding-top: 10px;">
            <div class="row">
                <div class="col-lg-12">
                    <a href="login-doc.php"><img src="../img/logo_dr_online_color.png" alt=""></a>
                </div>
                <div class="col-lg-12">
                    <div class="divider"></div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-xs-12 col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3">
                <div class="login-content">
                    <!-- Login -->
                    <div class="lc-block toggled" id="l-login">
                        <div id="formDiv">
                            <div id="alertDiv" class="alert alert-warning alert-error text-center hidden">
                                <i class="fa fa-exclamation-triangle icons pull-left" style="margin-top: 4px;"></i>
                                <p style="margin-top: 0px !important;" id="email_not_found">
                                </p>
                            </div>
                            <p style="margin-top: 0px !important; margin-bottom: 0px !important;">
                                <strong>
                                    <p id="password_forgotten"></p>
                                    <br><br>
                                    <p id="topMsg" style="margin-bottom: 0px;">
                                    </p>
                                </strong></p>
                            <div class="lcb-form">
                                <form id="formNuevo" name="formNuevo">
                                    <div class="input-group m-b-10">
                                        <span class="input-group-addon"><i class="zmdi zmdi-email"></i></span>
                                        <div class="fg-line">
                                            <input type="email" id="principal" class="form-control" name="email"
                                                required>
                                        </div>
                                    </div>

                                    <div class="input-group hidden" name="corporate-select-div" id="corporate-select-div">
                                        <span class="input-group-addon"><i class="zmdi zmdi-assignment"></i></span>
                                        <div class="fg-line">
                                            <select class="form-select form-select-lg mb-3 hidden" style="width: 100%; font-size: 15px; height:35px;" 
                                                aria-label=".form-select-sm example" name="corporate-select" id="corporate-select" required>
                                                <option value="" selected disabled>Seleccione una corporación</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button class="btn bgm-green hidden" id="reset_button" type="submit" name="reset_button"
                                        style="font-size: 15px !important; margin-top: 15px;"><span id="icon"
                                            class="spinner-border hidden" role="status" style="margin-right:5px;"
                                            aria-hidden="true"></span>
                                    </button>

                                </form>

                                <button class="btn bgm-green" id="validate_email" name="validate_email"
                                    style="font-size: 15px !important; margin-top: 15px;"><span id="icon"
                                    class="spinner-border hidden" role="status" style="margin-right:5px;"
                                    aria-hidden="true"></span> Validar correo electrónico
                                </button>

                                <div>
                                    <p>
                                        </br>
                                        <a href="login-doc.php" id="return_to_login">
                                            <?php echo getTranslation("RETURN_TO_LOGIN");?>
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div id="successDiv" class="hidden">
                            <p><strong id="restore_label">
                                    <?php echo getTranslation("RESTORE_PASSWORD_LABEL");?>
                                </strong></br><i class="zmdi zmdi-key zmdi-hc-3x"></i></p>
                            <div>
                                <p id="restore_password_indications">
                                    <?php echo getTranslation("RESTORE_PASSWORD_INDICATIONS");?>
                                </p>
                            </div>
                            <div>
                                <button class="btn bgm-green" onclick="window.parent.location.href='login-doc.php'"
                                    style="font-size: 15px !important; margin-top: 15px;">Regresar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

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
    <script src="../private/vendors/bower_components/moment/min/moment.min.js"></script>
    <script src="../private/vendors/bower_components/bootstrap-select/dist/js/bootstrap-select.js"></script>
    <script
        src="../private/vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js">
    </script>

    <!-- Placeholder for IE9 -->
    <!--[if IE 9 ]>
        <script src="vendors/bower_components/jquery-placeholder/jquery.placeholder.min.js"></script>
    <![endif]-->

    <script src="../private/js/app.min.js"></script>
    <!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>-->
    <script src="../private/js/jquery-2.0.3.min.js"></script>
    <script>
        if(localStorage.getItem('translation') != null && localStorage.getItem('translation') != undefined) {
            var trans = JSON.parse(localStorage.getItem('translation'));
            document.querySelector('#email_not_found').innerHTML =  trans.EMAIL_NOT_FOUND;
            document.querySelector('#password_forgotten').innerHTML =  trans.PASSWORD_FORGOTTEN_TEXT; 
            document.querySelector('#topMsg').innerHTML =  trans.PLEASE_ENTER_EMAIL; 
            document.querySelector('#reset_button').innerHTML =  trans.RESTORE_PASSWORD; 
            document.querySelector('#return_to_login').innerHTML =  trans.RETURN_TO_LOGIN; 
            document.querySelector('#restore_label').innerHTML =  trans.RESTORE_PASSWORD_LABEL;  
            document.querySelector('#restore_password_indications').innerHTML =  trans.RESTORE_PASSWORD_INDICATIONS;  
            document.querySelector('#principal').setAttribute("placeholder",trans.CORREO); 
            document.title = trans.RESTORE_PASSWORD;
        } else {
            document.querySelector('#email_not_found').innerHTML =  "No hemos podido encontrar la dirección de correo electrónico en nuestros registros.";
            document.querySelector('#password_forgotten').innerHTML =  "¿Has olvidado tu contraseña?<br>Te enviaremos un enlace para que puedas restablecerla."; 
            document.querySelector('#topMsg').innerHTML =  "Por favor, ingresa tu dirección email."; 
            document.querySelector('#reset_button').innerHTML =  "Restablecer constraseña"; 
            document.querySelector('#return_to_login').innerHTML = "Regresar al inicio de sesión"; 
            document.querySelector('#restore_label').innerHTML =  "Recuperación de contraseña";  
            document.querySelector('#restore_password_indications').innerHTML =  "En breve recibirás un correo con los pasos a seguir para completar el reinicio de tu contraseña. Por favor revisa tu bandeja de correo.";    
            document.querySelector('#principal').setAttribute("placeholder","Correo electrónico"); 
            document.title = "Restablecer constraseña";
        }
        $(document).ready(function () {
            $("#icono").attr("href", '../css/brands/vanilla/icono.png');

            function sendPost() {
                $('#icon').removeClass('hidden');
                $("#reset_button").attr("disabled", "disabled");
                var url = "<?php echo constant('API_SECURITY'); ?>password/request-change";
                var formPostData = {
                    "email": $("#principal").val(),
                    "userType": 2,
                    "corporateDomain": $("#corporate-select").val()
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(formPostData),
                    success: function (res) {
                        if (res.code == 200) {
                            $("#alertDiv").addClass('hidden');
                            $("#reset_button").attr("disabled", false);
                            $("#formDiv").addClass('hidden');
                            $("#successDiv").removeClass('hidden');
                        } else {
                            $("#alertDiv").removeClass('hidden');
                            $('#icon').addClass('hidden');
                            $("#reset_button").attr("disabled", false);
                        }
                    }
                });
            }

            $('form').submit(function (event) {
                sendPost();
                event.preventDefault();
            });

            /*
                author: victorisimoo
                description: configuration of password reset method by selected corporation
                date-modified: 2023-04-18
            */
            $("#validate_email").click(function () {
                if($("#principal").val() !== ""){
                    var urlChangePassword = "<?php echo constant('API_ADMIN'); ?>adm-user/docCorporatesByEmail/" + $("#principal").val();
                
                    $.ajax({
                        url: urlChangePassword,
                        type: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (res) {
                            var corporateInformation = res.map(({ corporateId, description, corporateDomain }) => ({
                                corporateId,
                                description,
                                corporateDomain
                            }));

                            if(corporateInformation.length > 0){
                                const inputElement = document.getElementById('principal');
                                inputElement.setAttribute('disabled', true);        
                                $("#corporate-select-div").removeClass('hidden');
                                $("#corporate-select").removeClass('hidden');
                                addSelectOptions(corporateInformation, 'corporate-select');
                                $("#validate_email").addClass('hidden');
                                $("#reset_button").removeClass('hidden');
                            }
                        }
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        // Manejar errores aquí
                        $("#alertDiv").removeClass('hidden');
                        console.error('Error en la solicitud AJAX:', textStatus, errorThrown);
                    });
                }
            });
        });

        function addSelectOptions(corporateInfoArray, selectElementId) {
            const selectElement = document.getElementById(selectElementId);
            corporateInfoArray.forEach(info => {
                const optionElement = document.createElement('option');
                optionElement.value = info.corporateDomain;
                optionElement.innerText = `${info.description}`;
                selectElement.appendChild(optionElement);
            });
        }
    </script>
</body>

</html>