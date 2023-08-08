<?php
include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'DrOnline - Confirmación de Registro';
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
                    <div class="appointment-form-title"><i class="icon-user appointment-form-icon"></i>Confirmación de registro</div>
                    <div class="appt-form">
                        Tú registro se ha completado. Ingresa <span><a href="login.php"><b>AQUÍ </b></a> con tu usuario y contraseña para empezar a disfrutar de nuestro servicio.</span>
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