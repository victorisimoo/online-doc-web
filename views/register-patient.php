

<?php
include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'Sign up';

$msg = '';
if (isset($_POST['firstName'])) {
    $url = constant('API_PATIENT') . 'patient';
    $headers = array(
        "Content-Type: application/json",
    );
    $data_to_post = array();
    $person = array(
        'firstName' => $_POST['firstName'],
        'lastName' => $_POST['lastName'],
        'gender' => $_POST['gender'],
        'birthday' => date_format(date_create_from_format('d-m-Y', $_POST['birthday']), 'Y-m-d').'T00:00:00.000'
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
    $data_string = json_encode($data_to_post);
    $handle = curl_init();
    curl_setopt($handle, CURLOPT_URL, $url);
    curl_setopt($handle, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($handle, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 0); // On dev server only!
    curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
    //curl_setopt($handle, CURLOPT_PROXY,"13.147.7.31");
    //curl_setopt($handle, CURLOPT_PROXYPORT,"8000");
    $result = curl_exec($handle);
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    if ($httpCode == 200) {
        header('Location: pending-confirm.php');
    } else {
       /* echo "<div class=\"alert alert-danger alert-error text-center\">";
        echo "<i class=\"fa fa-exclamation-triangle icons pull-left\"></i>Ocurrió un problema al crear usuario";
        echo '</div>'*/;
}
}
?>
<?php include_once ('layout/head-register.php') ?>
<style>
    form .error {
        color: #ff0000;
        text-align:"left";
        margin-bottom: 0px !important;
    }
    .m-b-20 {
        margin-bottom: 10px!important;
    }
    .fg-line:not([class*=has-]):after {
        background: #28B473;
    }
    .checkbox .input-helper:after {
        color: transparent;
    }
    .radio .input-helper:after {
        background: #28B473; 
    }
    .checkbox input:checked+.input-helper:before {
        background: #28B473; 
    }
    .checkbox input:checked+.input-helper:before, .radio input:checked+.input-helper:before {
        border-color: #28B473; 
    }
    .fa-li {
    position: initial;
    }
    .loader {
    border: 6px solid #28B473; /* Light grey */
    border-top: 6px solid #0D683D; /* Blue */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
<body>

    <?php include_once ('layout/header.php'); ?>
    <section class="complete-content content-footer-space">
        <!--<div class="about-intro-wrap pull-left ">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bs-example">
                       
                    </div>
                </div>
            </div>
        </div>-->
        <div class="container">
            <div id="registerForm">
                <!--<div class="card-header text-center">
                    <img class="i-logo" src="../img/logo_dr_online_color.png" alt="">
                </div>-->
                <!--<div class="row">
                    <div class="divider"></div>
                </div>-->

                <!--<div class="row" style="padding: 10px 5px 0px 10px;">
                    <div class="col-xs-3">
                    </div>
                    <div class="col-xs-6">
                        <div class="col-xs-3">
                        </div>
                        <div class="col-xs-6" style="text-align:center;">
                            <div class="fg-line form-group">
                                <fb:login-button class="inner-page-butt-blue-con-margen-blanco medium-but" scope="public_profile,email" onlogin="checkLoginState();" data-size="large" data-auto-logout-link="false" login_text=" REGÍSTRATE CON FACEBOOK ">
                        </fb:login-button>
                                <a class="btn btn-block btn-social btn-facebook" href="javascript:checkLoginState();"></i>INICIA SESIÓN CON FACEBOOK</a>
                            </div>
                        </div>

                    </div>
                </div>-->

                <!--<div class="row">
                    <div class="col-sm-3"></div>
                    <div class="col-sm-6">
                        <div class="divider"><strong class="divider-title ng-binding">o</strong></div>
                    </div>
                </div>-->
                <div class="row center-block">
                    <div class="col-sm-2"></div>
                    <div class="col-sm-8">
                        <div class="login-content">
                            <p><strong>Regístrate con tu dirección de correo electrónico</strong></p>
                            <p id="logi" style="display: none; border: 2px solid; border-radius: 20px; padding: 5px;">¿Ya tienes una cuenta? <a href="login.php?resource=e4c4aa0f523941d2a332d15101f12e9e" style='font-weight: bold;'>Iniciar sesión</a></p>
                            <div class="lcb-form">
                                <form id="formNuevo" autocomplete="off" name="formNuevo" action="" method="post">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="input-group m-b-20" style="padding: 10px 0px 10px 0px;">
                                                <span class="input-group-addon"><i class="zmdi zmdi-account"></i></span>
                                                <div class="fg-line">
                                                    <input type="text" class="form-control" placeholder="Nombres" id="firstName" name="firstName" onblur="this.value = this.value.replace(/\s\s+/g, ' ').replace(/^\s+|\s+$/g, '');"
                                                        required>
                                                </div>
                                            </div>
                                            <div><label id="firstName-error" style="font-size: smaller; padding-top: 12px;" class="error pull-right" for="firstName"></label></div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="input-group m-b-20" style="width: 100% !important; padding: 10px 0px 10px 0px;">
                                                <span class="input-group-addon"><i class="zmdi zmdi-account"></i></span>
                                                <div class="fg-line">
                                                    <input type="text" class="form-control" placeholder="Apellidos" id="lastName" name="lastName" onblur="this.value = this.value.replace(/\s\s+/g, ' ').replace(/^\s+|\s+$/g, '');"
                                                        required>
                                                </div>
                                            </div>
                                            <div><label id="lastName-error" style="font-size: smaller; padding-top: 12px;" class="error pull-right" for="lastName"></label></div>
                                        </div>
                                    </div>
                                    <div class="input-group m-b-20" style="padding: 10px 0px 10px 0px;">
                                        <span class="input-group-addon"><i class="zmdi zmdi-email"></i></span>
                                        <div class="fg-line">
                                            <input type="email" class="form-control" placeholder="Correo eléctronico"
                                                name="email" id="email" required>
                                        </div>
                                    </div>
                                    <label id="email-error" style="font-size: smaller;" class="error pull-right" for="email"></label>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="input-group m-b-20" style="padding: 10px 0px 10px 0px;">
                                                <span class="input-group-addon"><i class="zmdi zmdi-lock"></i></span>
                                                <div class="fg-line input-password">
                                                    <input type="password" class="form-control" placeholder="Contraseña" id="password" name="password"
                                                        required>
                                                </div>
                                            </div>
                                            <label id="password-error" style="font-size: smaller;" class="error pull-right" for="password"></label>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="input-group m-b-20" style="padding: 10px 0px 10px 0px;">
                                                <span class="input-group-addon"><i class="zmdi zmdi-lock"></i></span>
                                                <div class="fg-line input-password">
                                                    <input type="password" class="form-control" placeholder="Confirmar Contraseña"
                                                        name="passwordConfirm" required >
                                                </div>
                                            </div>
                                            <label id="passwordConfirm-error" style="font-size: smaller;" class="error pull-right" for="passwordConfirm"></label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="input-group m-b-20" style="margin-bottom: 0px !important;">
                                                <label style="padding-left: 15px; color:#969494; font-size: 14px; font-weight:initial;">Sexo:</label>
                                            </div>
                                            <div class="input-group m-b-20" style="text-align: left !important;">
                                                <span class="input-group-addon"><i class="zmdi zmdi-male-female"></i></span>
                                                <div class="checkbox">
                                                    <label class="radio radio-inline m-r-20">
                                                        <input type="radio" name="gender" value="1" checked="checked">
                                                        <i class="input-helper"></i> Masculino
                                                    </label>
                                                    <label class="radio radio-inline m-r-20">
                                                        <input type="radio" name="gender" value="0">
                                                        <i class="input-helper"></i> Femenino
                                                    </label>
                                                </div>
                                            </div>
                                            <label id="gender-error" style="font-size: smaller;" class="error" for="gender"></label>
                                        </div>
                                        <div class="col-md-6">
                                                <div class="input-group m-b-20" style="margin-bottom: 0px !important;">
                                                    <label style="padding-left: 15px; color:#969494; font-size: 14px; font-weight:initial;">Fecha de nacimiento:</label>
                                                </div>
                                                <div class="input-group m-b-20">
                                                    <span class="input-group-addon"><i class="zmdi zmdi-calendar-alt" style="vertical-align:middle;"></i></span>
                                                    <div class="fg-line">
                                                    <input type="text" id="birthday" data-format="DD-MM-YYYY" data-template="D MMM YYYY" name="birthday" required>
                                                    </div>
                                                </div>
                                                <label id="birthday-error" style="font-size: smaller; padding-top: 12px;" class="error pull-right" for="birthday"></label>
                                        </div>
                                    </div>
                                    <p>Al hacer click en Registrarse, aceptas los <a target="_blank" href="doctorvirtual-terminosycondiciones.php">términos y condiciones.</a>
                                        <!--y la <a target="_blank" href="#">política de privacidad de Doctor Online.</a>--></p>
                                    <button class="btn bgm-green" type="submit" id="login" name="login">
                                        <i class="fa-li fa fa-spinner fa-spin" id="icon" style='display:none;'></i>REGISTRARSE</button>
                                    <p>¿Ya tienes una cuenta? <a href="login.php?resource=e4c4aa0f523941d2a332d15101f12e9e" style='font-weight: bold;'>Iniciar sesión</a></p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <?php include_once ('layout/footer.php') ?>
    <script src="../private/js/app.min.js"></script>
    <script src="../private/vendors/bower_components/Waves/dist/waves.min.js"></script>
    <!--<script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js" refer></script>-->
    <script src="../private/js/jquery.validate-1.16.min.js" refer></script>
    <!--<script src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/additional-methods.min.js" refer></script>-->
    <script src="../private/js/additional-methods-1.16.min.js" refer></script>

    <script src="../private/lib/messages_es.min.js"></script>
    <script src="../js/moment.js"></script>
    <script src="../js/combodate.js"></script>

    <script type="text/javascript">
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
                $.validator.addMethod("customemail", 
                    function(value, element) {
                        return /^[-_a-zA-Z0-9]+(\.[-_a-zA-Z0-9]+)*@[a-zA-Z0-9-]*(\.[a-zA-Z]{2,4})*(\.[a-zA-Z]{2,4})$/.test(value);
                    }, 
                    "Por favor, escribe una dirección de correo válida."
                );
        }(jQuery));
    $(function() {
        var pattern = /^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]*$/;
        $("#firstName").inputFilter(function(value) { return pattern.test(value); });
        $("#lastName").inputFilter(function(value) { return pattern.test(value); });
        function direccionEmail(correo) {
            var evaluar = correo;
            var filter = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]*(\.[a-z]{2,4})*(\.[a-z]{2,4})$/;
            if (evaluar.length == 0) return true;
            if (filter.test(evaluar))
                return true;
            else
                return false;
        }
        var uniqueEmail = false;
        var fecha = new Date();
        var year = fecha.getFullYear();
        $('#birthday').combodate({
            minYear: year - 100,
            maxYear: year - 18
        });
        $("#email").keyup(function() {
            var url = "<?php echo constant('API_PATIENT'); ?>patient/unique-email/" + $("#email").val();
            $.ajax({
                url: url,
                type: 'GET',
                contentType: 'application/json',
                success: function (res) {
                    if(res.code == 200){
                        if(direccionEmail($("#email").val())){
                            uniqueEmail = true;
                            $("#email-error").hide();
                            $("#logi").hide();
                            $("#login").attr("disabled", false);
                        }
                    }
                    else{
                        $("#email-error").empty();
                        $("#email-error").append("Este correo ya está en uso. Ingresa otro.");
                        $("#email-error").show();
                        $("#logi").show();
                        $("#login").attr("disabled", "disabled");
                    }
                    //console.log("Que paso"+JSON.stringify(res));
                }
            });
        });
        $("#firstname").blur(function() { 

        });
        // Initialize form validation on the registration form.
        // It has the name attribute "registration"
        $("form[name='formNuevo']").validate({
            // Specify validation rules
            ignore: "",
            rules: {
            firstname: {
                required: true
            },
            lastname: {
                required: true
            },
            email: {
                required: true,
                customemail: true
            },
            password: {
                required: {
                    depends:function(){
                        $(this).val($.trim($(this).val()));
                        return true;
                    }
                },
                minlength: 6
            },
            passwordConfirm: {
                equalTo: "#password"
            },
            birthday: {
                required: true
            }
            },
            // Specify validation error messages
            messages: {
            },

            // Make sure the form is submitted to the destination defined
            // in the "action" attribute of the form when valid
            submitHandler: function(form) {
                $('#icon').show();
                $("#login").attr("disabled", "disabled");
                if(uniqueEmail){
                    form.submit();
                }
                else{
                    $("#email-error").empty();
                    $("#email-error").append("Este correo ya está en uso. Ingresa otro.");
                    $("#email-error").show();
                    $('#icon').hide();
                    $('html, body').animate({
                        scrollTop: $("#email").offset().top - 200
                    }, 500);
                    $('#email').focus();
                }
            }
        });
    });
    </script>
</body>
</html>