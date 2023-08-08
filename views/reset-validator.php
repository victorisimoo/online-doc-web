<?php
include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'Επαναφορα Κωδικου';
include_once('layout/head-private.php');
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
    if($_COOKIE['resource'] != $_GET['resource']){
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
                            <p style="margin-top: 0px !important;" id = "email_not_found">No hemos podido encontrar el correo electrónico en nuestros registros.</p>
                        </div>
                        <p style="margin-top: 0px !important; margin-bottom: 0px !important;" id = "forgot_pass"><strong>¿Has olvidado tu contraseña?<br>Te enviaremos un enlace para que puedas restablecerla.<br><br><p id="topMsg" style="margin-bottom: 0px;">Por favor, ingresa el correo que tienes registrado en la plataforma.</p></strong></p>
                        <div class="lcb-form">
                            <form id="formNuevo" name="formNuevo">
                                <div class="fg-line">
                                    <input type="email" class="form-control" placeholder="Correo eléctronico" name="principal" id="principal" required data-required-message="Rellene el campo">
                                </div>
                                <button class="btn btn-lg btn-login" id="reset_button" type="submit" name="reset_button" style="font-size: 15px !important; margin-top: 15px;"><i class="fa-li fa fa-spinner fa-spin hidden" id="icon" style="position: initial !important;"></i>Enviar correo</button>
                            </form>
                        </div>
                        <hr>
                        <a id="bottom-form-return-link" style='cursor:pointer; color: #2196F3;'>Regresar al inicio de sesión</a>
                    </div>
                </div>

            </div>
        </div>
    </div>                


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
    <?php if ($resource != "") { ?>
            <!--?php echo "IS NOT EMPTY" ?-->
            <script>
                const resourceDomain = "<?php echo $resource ?>";

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
                   
                $("html head title").text(userTranslations.RESTART_PASSWORD);
                $("#forgot_pass").html("<strong>"+userTranslations.PASSWORD_FORGOTTEN_TEXT+"</strong>");
                $("#topMsg").text(userTranslations.FORGETPASSWORD_SUBTITLE);
                $("#principal").attr("placeholder", userTranslations.EMAIL);
                $("#reset_button").html(userTranslations.SEND_EMAIL);
                $("#restoreButton").html(userTranslations.LOGIN_RECORVER_PASSWOR);
                $("#bottom-form-return-link").html(userTranslations.RETURN_TO_LOGIN);
                $("#email_not_found").html(userTranslations.ALERTS_TITLES_EMAIL_NOT_FOUND);
                $("#principal").attr("data-required-message", userTranslations.FILL_FIELD);
                $('input[required]').on('invalid', function() {
                    //this.setCustomValidity($(this).data("required-message")); it makes the app buggy.
                });

                if (resourceDomain == 'b27e6e8af2ae40d3bf07f6bc1253bd12') {
                    $("#l-login").hide();
                } else {
                    $("#l-selection").hide();
                    $("#corpDiv").hide();
                }
                $('#formIngreso').submit(function() {
                    $("#icon").show();
                    return true; // return false to cancel form action
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
                    $("#principal").text("EL CORREO");
                    //console.log("IS NOT EMPTY")
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
                    
                    var endpointCorporate = '<?php echo constant('API_URL_BASE') ?>dronline-admin-api/api/corporate/<?php echo $resource; ?>';
                    //var response = getResource("https://api1mapfre.doctor-online.co:54882/dronline-admin-api/api/corporate/<?php echo $resource; ?>", "","GET");
                    var response = getResource(endpointCorporate, "", "GET");

                    //console.log("Brand",response)

                    $("#bottom-form-return-link").click(function() {
                        window.location.href = "<?php echo $URLBase. $webSiteName ."views/login.php?resource=". $resource ?>";
                    });
                    $("#logo").click(function() {
                        window.location.href = "<?php echo $URLBase. $webSiteName ."views/login.php?resource=". $resource ?>";
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
                        $('#icon').removeClass('hidden');
                        $("#reset_button").attr("disabled", "disabled");
                        var url = "<?php echo constant('API_SECURITY'); ?>password/validator-change";
                        var formPostData = {
                            "email": $("#principal").val(),
                            "corporateDomain":resourceDomain
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
                                    window.location.href = "<?php echo $URLBase. $webSiteName ."views/reset-password-pending.php?resource=". $resource ?>";
                                }
                                else{
                                    $("#alertDiv").removeClass('hidden');
                                    $('#icon').addClass('hidden');
                                    $("#reset_button").attr("disabled", false);
                                }
                            }
                        });   
                    }

                    $('form').submit(function(event) {
                        sendPost();
                        event.preventDefault();
                    });
                });
            </script>
            <?php } ?>
</body>
</html>
