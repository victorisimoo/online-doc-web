<?php include_once ('../config/constantes.php');
    include_once ('../config/funciones.php');
    $paginaActual = 0;
    $nombrePaginaActual = 'Misión';
?>
<?php include_once ('layout/head.php') ?>

<body>
    <?php include_once ('layout/header.php'); ?>
    <section class="complete-content">
        <div id="about-us-version-two">	
            <div class="about-intro-wrap pull-left">
                <?php include_once ('layout/headerinfo.php'); ?> 
                <div class="container">
                    <div class="row">
                        <div class="intro-content-wrap col-xs-12 col-sm-12 col-md-12 col-lg-12 pull-left no-pad wow fadeInUp animated" data-wow-delay="0.5s" data-wow-offset="100">
                            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 no-pad">
                                <img class="img-responsive pull-left" alt="" src="../img/team.jpeg"/>
                            </div>
                            <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 no-pad" style="padding-left: 10px">
                                <p>Nuestra misión es de mejorar la vida y salud de nuestros usuarios por medio de la telemedicina, empleando la mejor tecnología con los más altos estándares de calidad, control, seguridad y ética empresarial.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    
    <?php include_once ('layout/footer.php') ?>

</body>
</html>
