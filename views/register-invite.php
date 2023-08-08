<?php
include_once ('../config/constantes.php');
echo "<script type='text/javascript'>
var apiURLBaseJS = '".constant('API_URL_BASE')."';
</script>";
include_once ('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'Registro';
include_once ('layout/head-private.php');
?>
<?php
   
    if (isset($_POST['password'])) {    
        $url = constant('API_PATIENT').'patient';
        $headers = array(
            "Content-Type: application/json",
        );
        $data_to_post = array();
        $person = array(
            'firstName'=> $_POST['firstName'],
            'lastName' => $_POST['lastName'],
            'gender'=>$_POST['gender']
            );
        $data_to_post['person'] = $person;
        $data_to_post['userId'] = $_POST['userId'];
        $data_to_post['password'] = $_POST['password'];
        $country = array(
            'countryId'=> 1
            );
        $data_to_post['country'] = $country;
        $language = array(
            'languageId'=> 1
            );
        $data_to_post['language'] = $language;
        $data_string = json_encode($data_to_post);
        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 0); // On dev server only!
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        //curl_setopt($handle, CURLOPT_PROXY,"13.147.7.31");
        //curl_setopt($handle, CURLOPT_PROXYPORT,"8000");
        $result = curl_exec($handle);
        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);        
        if($httpCode == 200) {
            header('Location: register-invite-confirm.php');
        } else {
            echo "<div class=\"alert alert-danger alert-error text-center\">";
            echo "<i class=\"fa fa-exclamation-triangle icons pull-left\"></i>Ocurrió un problema al crear usuario";
            echo '</div>';
        }
    }
    ?>
    <!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>-->
    <script src="../private/js/jquery-2.0.3.min.js"></script>
    <script type="text/javascript">

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $(document).ready(        
        function() {
            var qs=getParameterByName("key");            
            var url= apiURLBaseJS + "dronline-patient-api/api/patient/information/"+qs;
            if(qs!==null){
            $.ajax({
                url: url,
                type: 'GET',                
                contentType: 'application/json',
                dataType: 'json',
                success: function (res) {
                    if(res.userId!==undefined){
                        $("#email").val(res.email);
                        $("#password").val("");
                        $("#firstName").val(res.firstName);
                        $("#lastName").val(res.lastName);
                        $("#lastName").val(res.lastName);                       
                        $("#gender").val(res.gender);    
                        $("#userId").val(res.userId);    
                        $("#container_main").css({ display: "block" });
                    }else{
                         var msj="<div class='alert alert-danger alert-error text-center'>";
                            msj+="<i class='fa fa-exclamation-triangle icons pull-left'></i>El token ha expirado.";
                            msj+"</div>";
                            $("#msj").html(msj);
                            $("#container_main").css({ display: "none" });
                    }
                    
                },
                error: function(result){          ;
                    var msj="<div class='alert alert-danger alert-error text-center'>";
                    msj+="<i class='fa fa-exclamation-triangle icons pull-left'></i>El token  ha expirado.";
                    msj+"</div>";
                    $("#msj").html(msj);
                    $("#container_main").css({ display: "none" });
                }
            });
        }
        }
    );
    </script>
    
    <div id="msj"></div>
    <div id="container_main" style="display:none">
    <body style="background-color: #fff;">
                
                <div class="card">                    
                </div>                 
                 <div class="card-body card-padding">
                    <div class="card-header text-center">
                        <img class="i-logo" src="../img/logo_dr_online_color.png" alt="">
                    </div>                    
                    <div class="row">
                        <div class="col-xs-3">
                        </div>
                        <div class="col-xs-6">                                                   
                            <div class="login-content">
                             <!-- Login -->
                            <div class="lc-block toggled" id="l-login">
                                <p><strong>CONFIRMA TUS DATOS</strong></p>
                                <div class="lcb-form">
                                  <form id="formNuevo" name="formNuevo" action = "<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method = "post">
                                    <input type="hidden" name="userId" id="userId">
                                    <div class="input-group m-b-20">
                                        <span class="input-group-addon"><i class="zmdi zmdi-email"></i></span>
                                        <div class="fg-line">                                            
                                            <input type="text" class="form-control" placeholder="Correo eléctronico" name="email" id="email" disabled="true">
                                        </div>
                                    </div>

                                    <div class="input-group m-b-20">
                                        <span class="input-group-addon"><i class="zmdi zmdi-lock"></i></span>
                                        <div class="fg-line">
                                            <input type="password" class="form-control" placeholder="Escribir contraseña" name="password" id="password" autofocus>
                                        </div>
                                    </div>    

                                    <div class="input-group m-b-20">
                                        <span class="input-group-addon"><i class="zmdi zmdi-account"></i></span>
                                        <div class="fg-line">
                                            <input type="text" class="form-control" placeholder="Nombres" name="firstName" id="firstName">
                                        </div>
                                    </div>

                                    <div class="input-group m-b-20">
                                        <span class="input-group-addon"><i class="zmdi zmdi-account"></i></span>
                                        <div class="fg-line">
                                            <input type="text" class="form-control" placeholder="Apellidos" name="lastName" id="lastName">
                                        </div>
                                    </div> 

                                    <div class="input-group m-b-20">
                                        <span class="input-group-addon"><i class="zmdi zmdi-male-female"></i></span>
                                        <div class="fg-line">                                        
                                             <select name="gender" class="selectpicker" required id="gender">
                                                <option value="1">Masculino</option>
                                                <option value="0">Femenino</option>
                                            </select>
                                        </div>
                                    </div>


                                    <p>Al hacer click en confirmar, aceptas los <a href="#">términos y condiciones</a> y la <a href="#">política de privacidad de Doctor Online.</a></p>
                                    <button class="btn bgm-green" type="submit" name="login">CONFIRMAR DATOS</button>
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
    </body>
</div>       
</html>
