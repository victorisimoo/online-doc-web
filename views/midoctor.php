<script src="../js/functions.js"></script>
<?php
$login=false;
$messageShown=false;

$_GET['resource']='4385e7b559064a98bf63cd3452e04c46';

if(!isset($_GET["msisdn"])){
    $_GET["msisdn"]="NOPARAMETER";
}


if (isset($_COOKIE['admdron'])) {
    header('Location: ../private/index.php#/pages/patient');
}

include_once ('../config/constantes.php');

include_once ('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'Login';
include_once ('layout/head-private.php');

?>

<script src="../private/vendors/bower_components/jquery/dist/jquery.min.js"></script>
<script src="../private/vendors/bower_components/jquery-ui/jquery-ui.min.js"></script>
<script src="../private/vendors/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="../js/fingerprint.js?random=<?php echo uniqid(); ?>"></script>


<?php

$resource="";

if (isset($_GET['resource']) && !empty($_GET['resource'])){
    $resource =$_GET["resource"];
    $url = constant('API_SECURITY') . 'auth/corporatePatient';
}else{
    $url = constant('API_SECURITY') . 'auth/patient';
}

setcookie("resource", $resource, 0, "/","", true, 0);

$status;
$errorCode;
$remainingAppointments;

if(!empty($_POST['username'])){
    $msisdn = $_POST['username'];
    $resource =$_GET["resource"];
    
    $options = array(
        CURLOPT_RETURNTRANSFER => true   // return web page
    ); 

    $ch2 = curl_init($apiURLBase."dronline-integration-api/api/landingpage/$msisdn/$resource");

    curl_setopt_array($ch2, $options);

    $content  = curl_exec($ch2);

    curl_close($ch2);

    $obj = json_decode($content, FALSE);

    if(isset($obj->status)){
        $status=$obj->status;
    }

    if(isset($obj->remainingAppointments)){
        $remainingAppointments=$obj->remainingAppointments;
    }

    if(isset($obj->errorCode)){
        $errorCode=$obj->errorCode;
    }
}

//text-login-error
//text-try-again
if(isset($errorCode) && $errorCode==404 && $_POST['username']!=="-1"){
    $messageShown=true;
    ?>
    <script type="text/javascript">
        $( document ).ready(function() {
            showUnsubscribedModal("<?php echo $_POST['username'] ?>");
        });

    </script>
    <?php
}




$movil="";
if (isset($_GET['movil'])){
    $movil="true";
}
else
{
    $movil="false";
}

$msg = '';
if (isset($_POST['login']) && !empty($_POST['username']) && !empty($_POST['password']) && isset($status) && isset($remainingAppointments) && $status=="ACTIVE" && $remainingAppointments>0 && !(isset($errorCode) && $errorCode!==404)) {

    $login=true;

    $headers = array(
        "Content-Type: application/json",
    );
    $data_to_post = array();
    $data_to_post['principal'] = $_POST['username'];
    $data_to_post['credentials'] = $_POST['password'];
    $data_to_post['corporateDomain'] = $_GET['resource'];
    $data_to_post['appName'] = $appName;
    $data_to_post['appVersionName'] = $appVersionName;
    $data_string = json_encode($data_to_post);
    $handle = curl_init();
    curl_setopt($handle, CURLOPT_URL, $url);
    curl_setopt($handle, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($handle, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($handle, CURLOPT_CAINFO, "/var/www/html/imovesdronline/doctor-al-instante-web/gd_bundle_ca.crt");

    $result = curl_exec($handle);
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);

    if ($httpCode == 200) {
        curl_close($handle);
        setcookie("admdron", $result, 0, "/", constant('DOMAIN_BASE'), 0);
        setcookie("showsuccess", "true", 0, "/");

        ?>

        <script type="text/javascript">
            var findFingerPrint = "<?php echo constant('API_URL_BASE')?>dronline-integration-api/api/fingerprint/<?php echo $_POST['username'] ?>/"+getFingerPrint();
            var res = getResource(findFingerPrint, "","GET");
            document.cookie="msisdn=<?php echo ($_POST['username']) ?>";
            window.location.href="../private/index.php#/pages/patient";
        </script>
        <script type="text/javascript">
          $( document ).ready(function() {
              $('#successModal').modal('show');
          });
      </script>

  <?php } else { ?>
    <script type="text/javascript">
      $( document ).ready(function() {
          $('#errorModal').modal('show');
      });
  </script>
<?php }
}
?>

<style>
.fa-li {
    position: initial;
}    
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>
<body class="login-lp">

    <div id="brand-header" class="text-center">
        <img class="i-logo img-responsive" id="logo" src="" alt=""/>
    </div>

    <script type="text/javascript">

        if(window.innerWidth < window.innerHeight) {
           window.location.replace("<?php echo $movilLogin.$_GET['resource'] ?>");
       }
   </script>

   <!-- Modals -->


   <div class="modal fade" id="errorModal" role="dialog" style="margin-top: 10%" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content modal-content-error" style="border-radius: 20px !important;">
        <div class="modal-header">
            <i id="btnClose" class="zmdi zmdi-close-circle-o pull-right" style="font-weight: normal;font-size: 30px; cursor: pointer;" data-dismiss="modal"> </i>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-12">
                  <h2 id="text-login-error" style="font-size: 18px; font-weight: bold; text-align-last: justify;">Número de póliza no encontrada</h2>

                  <h2 id="text-login-error-validate" style="font-size: 18px; font-weight: bold;text-align-last: center;"></h2>                      
              </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <h3 id="text-try-again" style="font-size: 18px; text-align: center;">Inténtalo nuevamente</h3>
          </div>
      </div>
  </div>
  <div class="modal-footer">
    <br/>
    <button id="btnAccept" type="button" class="btn btn-default corporate" onclick="redirectSubscription()" style=" width: 30%; text-align: center;"  data-dismiss="modal">Aceptar</button>
</div>
</div>

</div>
</div>

<div class="card-body card-padding">

    <div class="row">
        <div class="col-3">
        </div>
        <div class="col-6">


            <div class="login-content">



                <!-- Login -->
                <div class="lc-block toggled" id="l-login">
                    <div id="validation_message_box"></div>
                    <div class="lcb-form">

                        <div class="card-body card-padding" id="timeValidator" style="display: none">
                            <div class="alert alert-danger curved-borders" id="msgTimeValidator" role="alert">

                            </div>
                        </div>

                        <form id="formIngreso" name="formIngreso" action = "<?php echo htmlspecialchars($_SERVER['PHP_SELF'])."?resource=".$resource; ?>" method = "post">
                            <div class="form-group m-b-20" id="login-div">
                              <div class="fg-line">
                                <h2 class="text-login" id="text-login">Ingresa tu Número de póliza</h2>
                            </div>
                            <div class="fg-line">
                                <input type="number" class="form-control input-lg input-lg-login" placeholder="Número de Póliza" name="username" id="username">
                            </div>
                        </div>

                        <div class="input-group m-b-20" id="password_div">
                          <div class="fg-line">
                            <h2 id="text-password">Ingresa tu Número de certificado</h2>
                        </div>
                        <div class="fg-line">
                           <input type="text" id="password_text" class="form-control input-lg input-lg-login" required placeholder="Número de Certificado" name="password" id="password">
                       </div>
                   </div>
                   <button class="btn btn-lg btn-login" id="login_button" type="submit" name="login"><i class="fa-li fa fa-spinner fa-spin" id="icon" style='display:none;'></i>VALIDAR NÚMERO</button>
                   <br>
               </form>
           </div>
           <br>
           <div style="padding-bottom: 20px;">
            <div>
                <button class="btn btn-danger" id="tour">¿Necesitas ayuda? ¡Haz click aquí!</button>
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
                <div id="apps-div">
                    <a id="iOsApp"  target="_blank" style=" display: none;"><img src="../img/appstore.png" style="padding-right: 20px; height: 80px;"></a>
                    <a id="androidApp"  target="_blank" style=" display: none;"><img src="../img/playstore.png" style="height: 80px;"></a>
                </div>
            </div>
        </div>
    </div>

</div>
</div>
</div>


<!-- Javascript Libraries -->

<script src="../private/vendors/bower_components/Waves/dist/waves.min.js?random=<?php echo uniqid(); ?>"></script>

<!-- Placeholder for IE9 -->
    <!--[if IE 9 ]>
        <script src="vendors/bower_components/jquery-placeholder/jquery.placeholder.min.js"></script>
    <![endif]-->

    <script src="../private/js/app.min.js?random=<?php echo uniqid(); ?>"></script>
    <!--script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script-->
    <script src="../private/lib/bootstrap-tour.min.js"></script>
    
    <?php if($resource != ""){ ?>
        <!--?php echo "IS NOT EMPTY" ?-->
        <script>
            $('#formIngreso').submit(function() {
                $("#icon").show();
            return true; // return false to cancel form action
        });
            var titleCor;
            var exist_apps = false;
            var _successFound = function(){
            //console.logo('SUCCESS')
            $('#successModal').modal('show');
        }
        var _errorFound = function(){
            //console.log('ERROR')
            $('#errorModal').modal('show');
        }

        var msisdn;

        $( document ).ready(function() {

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
            if(!(is_chrome || is_firefox)){
                //console.log("El navegador es distinto a Chrome o Firefox");
                $("#browserValidator").show();
            }else{
                //console.log("El navegador es chrome: "+is_chrome+", or Firefox: "+is_firefox);
                $("#browserValidator").hide();
            }


            var endpointCorporate =  '<?php echo constant('API_URL_BASE')?>dronline-admin-api/api/corporate/<?php echo $resource;?>';
           //var response = getResource("https://api1mapfre.doctor-online.co:54882/dronline-admin-api/api/corporate/<?php echo $resource;?>", "","GET");
           var response = getResource(endpointCorporate, "","GET");

           //console.log("Brand",response)

           if(response.corporateCssUrl != "" && response.corporateName != ""){
            document.cookie = "corpname=" + response.corporateName+";path=/";
            document.cookie = "language=" + response.languageId.isoCode+";path=/";
            document.cookie = "movil=" + '<?php echo $movil;?>'+";path=/";
            $("#icono").attr("href",'../css/brands/'+ response.corporateName+'/tabicon.png');
                //console.warn("ADEED BRAND CSS",response.corporateCssUrl);
                var baseBrandsURL = "../css/brands/" + response.corporateName;
                var cssUrl = baseBrandsURL + '/main.css';
                var imgUrl = baseBrandsURL + '/logo.png';

                //console.log(cssUrl)
                $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', cssUrl) );
                $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '../private/css/bootstrap-tour.min.css') );
                $("#logo").attr("src",imgUrl);
                $("#logo-success").attr("src",imgUrl);
                $("#logo-error").attr("src",imgUrl);
                var url = "<?php echo constant('API_URL_BASE')?>dronline-admin-api/api/parameter/findByName?name=" + response.corporateName+"_PLATFORM_NAME";
                var data = getResource(url, "","GET");
                titleCor = data.value;

                if(response.languageId.isoCode==="fr")
                {
                    $("#msgBrowserText").append("Important: "+ data.value +" ne fonctionne que dans les navigateurs Chrome et Firefox.");
                    $("#msgMovilText").append("Important: "+ data.value +" a des applications mobiles pour une meilleure expérience.");
                }
                else if(response.languageId.isoCode==="en")
                {
                    $("#msgBrowserText").append("Attention: "+ data.value +" works only on Chrome and Firefox.");
                    $("#msgMovilText").append("Attention: "+ data.value +" has mobile applications for a better experience.");
                }
                else
                {
                    $("#msgBrowserText").append("Importante: "+ data.value +" funciona únicamente en navegadores Chrome y Firefox.");
                    $("#msgMovilText").append("Importante: "+ data.value +" posee aplicaciones moviles para una mejor experiencia.");
                }
                
                //Botones de Apps Moviles
                url = "<?php echo constant('API_URL_BASE')?>dronline-admin-api/api/parameter/findByName?name=" + response.corporateName+"_PLAYSTORE_URL";
                data = getResource(url, "","GET");
                if(data !== ""){
                    if(data.value !== ""){
                        $("#androidApp").attr("href",data.value);
                        $("#androidApp").show();
                        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                            if(isMobile.Android()){
                                $("#movilValidator").show();
                            }
                        }
                        exist_apps = true;
                    }
                    else{
                        $("#androidApp").hide();
                    }
                }
                else{
                    $("#androidApp").hide();
                }
                url = "<?php echo constant('API_URL_BASE')?>dronline-admin-api/api/parameter/findByName?name=" + response.corporateName+"_APPSTORE_URL";
                data = getResource(url, "","GET");
                if(data !== ""){
                    if(data.value !== ""){
                        $("#iOsApp").attr("href",data.value);
                        $("#iOsApp").show();
                        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                            if(isMobile.iOS()){
                                $("#movilValidator").show();
                            }
                        }
                        exist_apps = true;
                    }
                    else{
                        $("#iOsApp").hide();
                    }
                }
                else{
                    $("#iOsApp").hide();
                }

                var platformName = "";

                url = "<?php echo constant('API_URL_BASE')?>dronline-admin-api/api/parameter/findByName?name=" + response.corporateName+"_PLATFORM_NAME";
                data = getResource(url, "","GET");
                if(data !== ""){
                    if(response.languageId.isoCode=="fr")
                    {
                        document.title ="S'identifier | "+ data.value;
                    }
                    else if(response.languageId.isoCode=="en")
                    {
                        document.title ="Login | "+ data.value;
                    }
                    else
                    {
                        document.title ="Inicia Sesión | "+ data.value;
                    }                    
                    platformName = data.value;
                    console.log(data.value);
                }

                //Verificando el tipo de dispositivo movil
                if(isMobile.Android()){
                    $("#iOsApp").hide();
                }
                else if(isMobile.iOS()){
                    $("#androidApp").hide();
                }

                //Revisando horas si es disponible
                if(response.corporateName!=null)
                {
                    url = "<?php echo constant('API_URL_BASE')?>dronline-admin-api/api/parameter/checkAttentionTime?corporateName=" + response.corporateName;
                    data = getResource(url, "","GET");
                    if((typeof data.value != "undefined")&&(data.value!="")){
                        $("#timeValidator").show();                    
                        if(response.languageId.isoCode==="fr")
                        {
                            $("#msgTimeValidator").append("AVIS: " +data.value + "<BR> Merci de votre compréhension");
                        }
                        else if(response.languageId.isoCode==="en")
                        {
                            $("#msgTimeValidator").append("NOTICE: " +data.value + "<BR> Thanks for your understanding");
                        }
                        else
                        {
                            $("#msgTimeValidator").append("AVISO: " +data.value + "<BR> Gracias por su comprensión");
                        }                        
                    }
                }
                
            }

            function validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

            if(response.corporateName == "midoctor"){
                $('#login_button').prop('disabled', true);
            }

            if(response.length!=0){
                if(response.description!= "entity_not_found"){
                    document.cookie ="logo="+response.corporateLogoUrl+";path=/";
                    document.cookie ="buttons=btn btn-xs btn-danger;path=/";
                    $("#btn-fb").hide();
                    $("#divider").hide();

                    if(response.corporateName == "midoctor"){
                        $("#password_div").hide();
                        $("#password_text").val('<?php echo $resource;?>');
                        $("#username").attr("placeholder", "Número de teléfono");
                        $("#text-login").text("Ingresa tu número de teléfono");
                        $("#text-login-error").text("Número de teléfono no encontrado.");

                        $('#username').on('keypress keyup blur', function() {
                            var re = /^[1-9][0-9]{7,7}$/.test(this.value);
                            if(!re) {
                                $('#login_button').prop('disabled', true);
                            } else {
                                $('#login_button').prop('disabled', false);
                                return false;
                            }
                        });
                    }

                    $("#reset-password").hide();
                    $("#register").hide();
                }else{
                    document.cookie ="logo=../img/logo_dr_online_color.png;path=/";
                    document.cookie ="buttons=btn btn-xs btn-success;path=/";
                    $("#logo").attr("src",getCookie("logo"));
                    $("#username").attr("placeholder", "Correo electrónico");
                    $("#btn-fb").show();
                    $("#divider").show();
                    $("#password_div").show();
                    $("#reset-password").show();
                    $("#register").show();
                    $("#password_text").val("");
                }
            }else{
                document.cookie ="logo="+baseBrandsURL+"/logo.png;path=/";
                document.cookie ="buttons=btn btn-xs btn-success;path=/";
                //$("#logo").attr("src",getCookie("logo"));
                $("#username").attr("placeholder", "Correo electrónico");
                $("#btn-fb").show();
                $("#divider").show();
                $("#password_div").show();
                $("#reset-password").show();
                $("#register").show();
                $("#password_text").val("");
            }
           // Instance the tour
           
           var tour;
           $('#tour').click(function(){
            if(typeof tour == "undefined"){
                if(response.corporateName === "midoctor"){
                    tour = new Tour({
                        backdrop: true,
                        template:"<div class='popover tour'>"+
                        "<div class='arrow'></div>"+
                        "<h3 class='popover-title alert-danger' style='text-align: center;'></h3>"+
                        "<div class='popover-content' style='padding-top: 5px; font-weight: bold;'></div>"+
                        "<div class='popover-navigation'>"+
                        "<button class='btn btn-xs btn-default pull-left' data-role='prev'>« Anterior</button>"+
                        "<span data-role='separator'>&nbsp;</span>"+
                        "<button class='btn btn-xs btn-default' data-role='next'>Siguiente »</button>"+
                        "<button class='btn btn-xs btn-default pull-right' data-role='end'>Terminar</button>"+
                        "</div>"+
                        
                        "</div>",
                        steps: [
                        {
                            element: "#login-div",
                            title: titleCor,
                            content: "Ingresa tu número de teléfono para poder acceder a la plataforma " + titleCor,
                            placement: "bottom"
                        },
                        {
                            element: "#login_button",
                            title: titleCor,
                            content: "Si has escrito un número de teléfono válido para utilizar la plataforma, podrás acceder exitosamente",
                            placement: "right"
                        }
                        ]});
                }
                if(exist_apps){
                    tour.addStep({
                        element: "#apps-div",
                        title: titleCor,
                        content: "¡También contamos con aplicaciones móviles con las cuales puedes acceder a " + titleCor + " de una manera más fácil y cómoda!",
                        placement: "right"
                    });
                }
                tour.init();
                tour.start();
                tour.restart();
            }
            else{
                tour.restart();
            }
        });

            //End of tour

            msisdn = "<?php echo $_GET['msisdn']; ?>";
            var username = "<?php echo isset($_POST['username'])?$_POST['username']:''; ?>";
            if(username!==""){
                msisdn = username;
            }
            

            var fingerPrint = getFingerPrint();

            //Remove to upload
            /*if(msisdn=="NOPARAMETER"){
                msisdn="NOT_FOUND";
            }*/

            if(msisdn=="NOPARAMETER"){
                var miDoctorURL = window.location.href;
                miDoctorURL = miDoctorURL.split("?msisdn=")[0];
                console.log(miDoctorURL);
                var headerURL="<?php echo $headerEnrichment; ?>"; 
                window.location.href=headerURL;


            }else if(msisdn == "NOT_FOUND"){
                msisdn="";
                var findFingerPrint = "<?php echo constant('API_URL_BASE')?>dronline-integration-api/api/fingerprint/"+getFingerPrint();
                var res = getResource(findFingerPrint, "","GET");
                if(res.idFingerprintSession==-1){
                    if(getCookie("msisdn")!==""){
                        msisdn=getCookie("msisdn");
                    }
                }else{
                    msisdn=res.msisdn;
                }
                if(msisdn!==undefined&& msisdn!=="" && msisdn!=='undefined' && msisdn!=='NOT_FOUND'){
                    window.location.href=("?msisdn="+msisdn);
                }
            }

            
            if(msisdn!==undefined && !isNaN(msisdn) && msisdn!=="" && msisdn!==-1){
                if(msisdn.length>8){
                    msisdn = msisdn.substring(3,11);
                }                
                url = "getUserStatus.php?msisdn="+msisdn+"&resource=4385e7b559064a98bf63cd3452e04c46";
                data = getResource(url, "","GET");
                data = JSON.parse(data);
                if(data !== ""){
                    if(data.status=="ACTIVE"){
                        if(data.remainingAppointments==0){
                            if(data.subscriptionStatus=="ACTIVE"){
                                $("#text-login-error-validate").html(getParameter("MIDOCTOR_NOAPPOINTMENT_TITLE").replace("**",data.personName));
                                $("#text-login-error").hide();
                                var d = new Date(data.endDateCoverage);
                                var end = d.getDate()+"/" +(d.getMonth()+1)+"/"+d.getFullYear();
                                $("#text-try-again").html(getParameter("MIDOCTOR_NOAPPOINTMENT_TEXT").replace("**",data.personName).replace("##",end));
                                $("#btnAccept").hide();
                                $('#errorModal').modal('show');
                            }else{
                                $("#text-login-error-validate").html(getParameter("MIDOCTOR_UNSUBSCRIBED_NOAPPOINTMENT_TITLE").replace("**",data.personName));
                                $("#text-login-error").hide();
                                $("#text-try-again").html(getParameter("MIDOCTOR_UNSUBSCRIBED_NOAPPOINTMENT_TEXT").replace("**",data.personName));
                                $("#btnAccept").show();
                                $('#errorModal').modal('show');
                            }
                        }else{
                            
                            var login = "<?php echo $login; ?>";
                            if(!login){
                                document.getElementById("username").value=msisdn;
                                $('#login_button').prop('disabled', false);
                                document.getElementById("login_button").click();
                            }
                            
                        }                        
                    }
                    else if(data.status=="INACTIVE"){
                        console.log(data);
                        if(data.subscriptionStatus=="ACTIVE"){
                            $("#text-login-error-validate").html(getParameter("MIDOCTOR_OUTCOVERAGE_TITLE").replace("**",data.personName));
                            $("#text-login-error").hide();

                            $("#text-try-again").html(getParameter("MIDOCTOR_OUTCOVERAGE_TEXT").replace("**",data.personName));
                            $("#btnAccept").hide();
                            $('#errorModal').modal('show');
                        }else{
                            //Aquiestoy
                            $("#text-login-error-validate").html(getParameter("MIDOCTOR_UNSUBSCRIBED_TITLE").replace("**",data.personName));
                            $("#text-login-error").hide();
                            $("#text-try-again").html(getParameter("MIDOCTOR_UNSUBSCRIBED_TEXT").replace("**",data.personName));
                            $("#btnAccept").show();
                            $('#errorModal').modal('show');
                        }
                    }
                    var messageShown ="<?php echo($messageShown) ?>";
                    if(data.errorCode==404 && !messageShown){
                        showUnsubscribedModal(msisdn);
                    }
                }
            }
            


        });


function showUnsubscribedModal(num){

    $("#text-login-error-validate").html(getParameter("MIDOCTOR_NOSUBSCRIPTION_TITLE").replace("@@",num));
    $("#text-login-error").hide();
    $("#text-try-again").html(getParameter("MIDOCTOR_NOSUBSCRIPTION_TEXT").replace("@@",num));
    $("#btnAccept").show();
    $('#errorModal').modal('show');
}

function redirectSubscription(){
    var findFingerPrint = "<?php echo constant('API_URL_BASE')?>dronline-integration-api/api/fingerprint/"+msisdn+"/"+getFingerPrint();
    var res = getResource(findFingerPrint, "","GET");
    document.cookie="msisdn="+msisdn;
    window.location.href = "<?php echo $claroSubscription ?>";
}

function getParameter(parameterName){
    var endpointParameter =  '<?php echo constant('API_URL_BASE')?>dronline-admin-api/api/parameter/findByName?name=';
    var response = getResource(endpointParameter+parameterName, "","GET");
    return response.value;
}

</script>
<?php } ?>
</body>
</html>
