<?php
    include_once ('../config/constantes.php');
    include_once ('../config/funciones.php');
    $paginaActual = 3;
    $nombrePaginaActual = 'DrOnline - Activation';
    $key = $_GET['key'];
    $url = constant('API_PATIENT').'patient/activation/'.$key;
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
		CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false
    ));
    $resp = curl_exec($curl);
    curl_close($curl);
?>
<?php include_once ('layout/head.php') ?>
<body>
    <?php include_once ('layout/header.php'); ?>
    <section class="complete-content content-footer-space">
        <div class="about-intro-wrap pull-left ">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="bs-example">                 
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-lg-12 col-xs-12 separador-100">
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-sm-4 col-lg-4 col-xs-12 "></div>
                <div class="appointment-form col-xs-12 col-md-4 no-pad wow fadeInRight animated" data-wow-delay="0.5s" data-wow-offset="50">
                    <div class="appointment-form-title"><i class="icon-user appointment-form-icon"></i>Registro confirmado</div>
                    <div class="appt-form">
                        Hemos confirmado tu correo electrónico, tu registro se ha completado. Ingresa <span><a href="<?php echo constant('PAGINA_PACIENTE'); ?>">aquí</a> con tu usuario y contraseña para empezar a disfrutar de nuestro servicio.</span>
                    </div>
                </div>
            </div>
        </div>       
        <div class="container">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-lg-12 col-xs-12 separador-100"></div>
            </div>
        </div>
    </div>
</section>
<?php include_once ('layout/footer.php') ?>
</body>
</html>