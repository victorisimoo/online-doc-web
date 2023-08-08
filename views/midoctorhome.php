<?php

$_GET['resource']='4385e7b559064a98bf63cd3452e04c46';


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
$movil="";
if (isset($_GET['movil'])){
    $movil="true";
}
else
{
    $movil="false";
}

if (isset($_GET['resource']) && !empty($_GET['resource'])){
	$resource =$_GET["resource"];
	$url = constant('API_SECURITY') . 'auth/corporatePatient';
}else{
	$url = constant('API_SECURITY') . 'auth/patient';
}

setcookie("resource", $resource, 0, "/","", true, 0);
$msg = '';
if (isset($_POST['login']) && !empty($_POST['username']) && !empty($_POST['password'])) {

    $headers = array(
        "Content-Type: application/json",
    );
    $data_to_post = array();;
    $data_to_post['principal'] = $_POST['username'];
    $data_to_post['credentials'] = $_POST['password'];
    $data_to_post['corporateDomain'] = $_GET['resource'];
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

/*    echo "<pre>curl_url: ".$url."</pre>";
    echo "<pre>curl_mode: POST</pre>";
    echo "<pre>curl_headers: ".json_encode($headers)."</pre>";
    echo "<pre>curl_data: ".$data_string."</pre>";
    echo "<pre>curl_result: ".$result."</pre>";
    echo "<pre>curl_http_code: ".$httpCode."</pre>"; */

    //echo $httpCode;
    if ($httpCode == 200) {
        curl_close($handle);
        setcookie("admdron", $result, 0, "/", constant('DOMAIN_BASE'), 0);
        setcookie("showsuccess", "true", 0, "/");
      	//echo $_COOKIE['admdron'];

        header('Location: ../private/index.php#/pages/patient');
        ?>
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

<body class="login-lp" style="background-image: url('../css/brands/midoctor/background.png'); background-color: white !important" >


    <div class="card-body card-padding" id="activationForm" style="display: none">
        <div class="row">
            <div class="col-sm-4">               
            </div>
            <div class="col-sm-4">


                <div class="login-content" style="width: 100%;">



                    <!-- Login -->
                    <div class="lc-block toggled" id="l-login">
                        <div id="validation_message_box"></div>
                        <div class="lcb-form" >

                            <h2 style="font-weight: bold;">Bienvenido a</h2>
                            <img class="i-logo img-responsive" id="logo" src="" alt="" style="margin-top: 0%; margin-bottom: 5%; width: 100% !important">
                            <h4 style="font-weight: bold; text-align: center;">ahora puedes hacer tus consultas médicas con un doctor vía</h4>

                            <div class="alert alert-danger curved-borders servicetype"  role="alert" style="background-color: #EC1C24">
                                Chat con foto
                            </div>
                            <h2 style="font-weight: bold;">o</h2>
                            <div class="alert alert-danger curved-borders servicetype"  role="alert" style="background-color: #BE1E2D">
                                Videollamada
                            </div>

                            <img class="doctorImg" src="../css/brands/midoctor/doctor.png" alt="" ">

                        </div>
                        <br>                        
                    </div>
                </div>

            </div>
        </div>
    </div>
 
    <div class="card-body card-padding" id="resubcriptionForm" style="display: none">
        <div class="row">
            <div class="col-sm-4">               
            </div>
            <div class="col-sm-4">


                <div class="login-content" style="width: 100%;">



                    <!-- Login -->
                    <div class="lc-block toggled" id="l-login2">
                        <div id="validation_message_box"></div>
                        <div class="lcb-form" >

                            <h2 style="font-weight: bold;">Bienvenido nuevamente a</h2>
                            <img class="i-logo img-responsive" id="logo2" src="" alt="" style="margin-top: 0%; margin-bottom: 5%; width: 100% !important">
                            <h4 style="font-weight: bold; text-align: center;">estás resuscrito, puedes utilizar nuevamente la plataforma y consultar un doctor vía</h4>

                            <div class="alert alert-danger curved-borders servicetype"  role="alert" style="background-color: #EC1C24">
                                Chat con foto
                            </div>
                            <h2 style="font-weight: bold;">o</h2>
                            <div class="alert alert-danger curved-borders servicetype"  role="alert" style="background-color: #BE1E2D">
                                Videollamada
                            </div>

                            <img class="doctorImg" src="../css/brands/midoctor/doctor.png" alt="" ">

                        </div>
                        <br>                        
                    </div>
                </div>

            </div>
        </div>
    </div>

    <script src="../private/vendors/bower_components/Waves/dist/waves.min.js"></script>

    <script src="../private/js/app.min.js?random=<?php echo uniqid(); ?>"></script>
    <script src="../js/functions.js?random=<?php echo uniqid(); ?>"></script>
    <script src="../private/lib/bootstrap-tour.min.js"></script>

    <?php if($resource != ""){ ?>
        <script>
            var titleCor;
            var exist_apps = false;
            var _successFound = function(){
                $('#successModal').modal('show');
            }
            var _errorFound = function(){
                $('#errorModal').modal('show');
            }
            $( document ).ready(function() {

                $('#username').on("keypress keyup blur",function (event) {    
                    $(this).val($(this).val().replace(/[^\d].+/, ""));
                    if ((event.which < 48 || event.which > 57) || event.wich == 8 || event.wich == 13) {
                        if(event.which != 13){
                            event.preventDefault();
                        }
                    }
                });
                $('#password_text').on("keypress keyup blur",function (event) {    
                    $(this).val($(this).val().replace(/[^\d].+/, ""));
                    if ((event.which < 48 || event.which > 57) || event.wich == 8) {
                        if(event.which != 13){
                            event.preventDefault();
                        }

                    }
                });

                var resource = '<?php echo $resource;?>';


                var endpointCorporate =  '<?php echo constant('API_URL_BASE')?>dronline-admin-api/api/corporate/<?php echo $resource;?>';

                var response = getResource(endpointCorporate, "","GET");


                if(response.corporateCssUrl != "" && response.corporateName != ""){
                    document.cookie = "corpname=" + response.corporateName+";path=/";
                    document.cookie = "language=" + response.languageId.isoCode+";path=/";
                    document.cookie = "movil=" + '<?php echo $movil;?>'+";path=/";
                    document.cookie = "oneSignalInitialized=false;path=/";

                    $("#icono").attr("href",'../css/brands/'+ response.corporateName+'/tabicon.png');

                    var baseBrandsURL = "../css/brands/" + response.corporateName;
                    var cssUrl = baseBrandsURL + '/main.css';
                    var imgUrl = baseBrandsURL + '/logoColor.png';

                    $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', cssUrl) );
                    $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '../private/css/bootstrap-tour.min.css') );
                    $("#logo").attr("src",imgUrl);
                    $("#logo2").attr("src",imgUrl);                    
                    var url = "<?php echo constant('API_URL_BASE')?>dronline-admin-api/api/parameter/findByName?name=" + response.corporateName+"_PLATFORM_NAME";
                    var data = getResource(url, "","GET");
                    titleCor = data.value;

                    var platformName = "";

                    url = "<?php echo constant('API_URL_BASE')?>dronline-admin-api/api/parameter/findByName?name=" + response.corporateName+"_PLATFORM_NAME";
                    data = getResource(url, "","GET");
                    if(data !== ""){
                        document.title ="Bienvenido | "+ data.value;
                    }

                }

                if(response.length!=0){
                    if(response.description!= "entity_not_found"){
                        document.cookie ="logo="+response.corporateLogoUrl+";path=/";
                        document.cookie ="buttons=btn btn-xs btn-danger;path=/";
                    }else{
                        document.cookie ="logo=../img/logo_dr_online_color.png;path=/";
                        document.cookie ="buttons=btn btn-xs btn-success;path=/";
                        $("#logo").attr("src",getCookie("logo"));
                    }
                }else{
                    document.cookie ="logo="+baseBrandsURL+"/logo.png;path=/";
                    document.cookie ="buttons=btn btn-xs btn-success;path=/";
                }

                var msisdn;

                var findFingerPrint = "<?php echo constant('API_URL_BASE')?>dronline-integration-api/api/fingerprint/"+getFingerPrint();
                var res = getResource(findFingerPrint, "","GET");
                if(res.idFingerprintSession==-1){
                    if(getCookie("msisdn")!==""){
                        msisdn=getCookie("msisdn");
                    }
                }else{
                    msisdn=res.msisdn;
                }

                if(msisdn!==undefined){
                    console.log("msisdn correcto");
                    var data='{"msisdn":"'+msisdn+'","corporateDomain":"'+resource+'","channelSubscription":"Landing"}';
                    var createSubscription = "<?php echo constant('API_URL_BASE')?>dronline-integration-api/api/landingpage";
                    var res = doPost(createSubscription,data,"POST");
                    console.log(res);
                    if(res.action=="RESUBSCRIPTION"){
                        $("#resubcriptionForm").show();
                    }else{
                        $("#activationForm").show();
                    }
                }

                $( "#l-login" ).click(function() {
                  window.location.href="midoctor.php?msisdn="+msisdn;
                });

                $( "#l-login2" ).click(function() {
                  window.location.href="midoctor.php?msisdn="+msisdn;
                });

                $( "body" ).click(function() {
                  window.location.href="midoctor.php?msisdn="+msisdn;
                });
                

            });

        </script>
    <?php } ?>

    <style type="text/css">
    .servicetype{
        border-radius: 200px;
        padding-top: 5px !important;
        padding-bottom: 5px !important;
        margin-top: 0px !important;
        margin-bottom: 0px !important;
    }

    .doctorImg{
        width: 100% !important;
        position: absolute;
        bottom: 0 !important;
        left: 0 !important;
    }
    body{
        position: absolute;
        width: 100% !important;
        height: 100% !important;
    }
    .card-body,.row,.col-sm-4,.login-content,.lc-block{
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    #l-login, body{
        cursor: pointer;
    }
</style>

</body>
</html>
