<?php include_once ('../config/constantes.php');
    include_once ('../config/funciones.php');
    $paginaActual = 0;
    $nombrePaginaActual = 'Doctor Online';
?>
<?php include_once ('layout/head.php') ?>
<body>        
    <?php include_once ('layout/header.php'); ?>
    <section class="complete-content content-footer-space">
        <div class="about-intro-wrap pull-left">            
            <div class="container">
                <!-- Featured Boxes Element -->


            <div class="col-md-12 no-pad col-xs-12 col-sm-12 pull-left heading-content elemnts-wrap wow fadeInLeft animated" data-wow-delay="0.5s" data-wow-offset="200">
            <h2>
                <a href="register-doc.php" class="inner-page-butt-blue-sin-margen-blanco" style="float:left;position:relative;left: 40%;background-color:#F5AF33;color:#000"><i class="fa inner-page-butt-white-icon"></i>Aplica ahora</a>
                <br/>
            </h2>
            <p>¿Porque debes unirte a Doctor Online?</p>
            </div>

           <div class="mid-widgets-serices col-xs-12 col-sm-12 col-md-12 col-lg-12 no-pad pull-left services-page">
                <div class="row">                
         
                    <!--service box-->
                    <div class="col-sm-6 col-xs-12 col-md-3 col-lg-6 service-box no-pad wow fadeInLeft animated" data-wow-delay="1s" data-wow-offset="150">
                        <div class="service-title"><div class="service-icon-container rot-y"><i class="fa fa-angle-right about-list-arrows"></i></div>Más ingresos.</div>
                        <p>No costos fijos.</p>
                    </div>
                    
                    <!--service box-->
                    <div class="col-sm-5 col-xs-12 col-md-3 col-lg-6 service-box no-pad wow fadeInLeft animated" data-wow-delay="1.3s" data-wow-offset="150">
                        <div class="service-title"><div class="service-icon-container rot-y"><i class="fa fa-angle-right about-list-arrows"></i></div>Construye tu marca digital</div>                
                        <p style="color: white;">.</p>
                    </div>                        
                
                    <!--service box-->
                    <div class="col-sm-5 col-xs-12 col-md-3 col-lg-6 service-box no-pad wow fadeInRight animated" data-wow-delay="1.9s" data-wow-offset="80">
                        <div class="service-title"><div class="service-icon-container rot-y"><i class="fa fa-angle-right about-list-arrows"></i></div>Flexibilidad</div>
                        <p>Trabaja las horas que quieras de dónde quieras.</p>
                    </div>
                
                    <!--service box-->
                    <div class="col-sm-5 col-xs-12 col-md-3 col-lg-6 service-box no-pad wow fadeInRight animated" data-wow-delay="1.6s" data-wow-offset="80">
                        <div class="service-title"><div class="service-icon-container rot-y"><i class="fa fa-angle-right about-list-arrows"></i></div>Ayuda a miles que te necesitan.</div>      
                        <p style="color: white;">.</p>          
                    </div>
                </div>
                <br/>
                <br/>            
                <br/>
                <div class="row">
                     <div class="container">
                        <div class="row">
                            <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12 ">
                                <div  align="center" class="contenedor-uno video-action"
                                      data-video-url="<?php echo constant('URL_VIDEO'); ?>">
                                    <span class="boton-gris-center">
                                        <img width="25px" height="25px" src="../img/play-white.png"> Ver video
                                    </span>
                                </div>
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