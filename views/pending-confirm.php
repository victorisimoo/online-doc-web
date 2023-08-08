<?php
include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'DrOnline - Pending Confirm';
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
                    <div class="appointment-form-title" style="border-radius: 10px 10px 0px 0px;"><i class="icon-user appointment-form-icon"></i>¡Registro completo!</div>
                    <div class="appt-form" style="text-align: justify; border-radius: 0px 0px 10px 10px;">
                        <!--<span>Estamos mejorando para ti, por lo cual, no tenemos habilitado el serivicio de membresia hasta nuevo aviso.
                            <br><br>En esta actualización nos esperan muchas sorpresas, pronto nos estaremos comunicando contigo.</span>-->
                            <div style="text-align: center;">
                            <a href="<?php echo constant('PAGINA_PACIENTE'); ?>" class='btn-action'><br>
                            <b style="color: #28B473; border: 1px solid; padding:5px; border-radius: 20px;"> INICIAR SESIÓN </b></a>
                        </div><br>
                        <span>Te hemos enviado un link de confirmación a tu <strong>correo electrónico.</strong> Por favor revisa tu bandeja para completar la información de tu cuenta.</span>
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