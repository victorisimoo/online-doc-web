<?php include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
$paginaActual = 0;
$nombrePaginaActual = 'About us';
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
                        <a class="inner-page-butt-blue-sin-margen-blanco" style="color:#28B473; background-color: transparent !important; border-style: none; font-weight: bold; text-align: center; width: 100%;"><i class="fa inner-page-butt-white-icon"></i>¿Quiénes somos?</a>
                    </h2>
                    <p>Doctor Online es una subsidiaria de Televida, una empresa de mercadeo móvil con presencia en 15 países y con 12 años de operar en la región.</p>
                </div>

                <div class="mid-widgets-serices col-xs-12 col-sm-12 col-md-12 col-lg-12 no-pad pull-left services-page">
                    <div class="row">                

                        <!--service box-->
                        

                        <div class="col-sm-4 col-xs-12 col-md-4 col-lg-4 service-box no-pad wow fadeInLeft animated" data-wow-delay="1s">
                            <img src="../img/doctor.png" style="width: 100%">
                        </div>

                        <div class="col-sm-8 col-xs-12 col-md-8 col-lg-8 service-box no-pad wow fadeInLeft animated" data-wow-delay="1.1s" data-wow-offset="150">
                            <div class="service-title" style="color:#28B473;"><div class="service-icon-container rot-y"><i class="fa fa-angle-right about-list-arrows"></i></div>¿Qué hacemos?</div>
                            <p class="override-service-box top-p">
                                <i class="fa fa-plus corp-list"></i>
                                Servicio de consultas médicas remotas
                                mediante chat con foto o videollamada
                                plataforma web, Android e iOS.
                            </p>
                        </div>

                        <!--service box-->
                        <div class="col-sm-8 col-xs-12 col-md-8 col-lg-8 service-box no-pad wow fadeInLeft animated" data-wow-delay="1.2s" data-wow-offset="150">
                            <div class="service-title" style="color:#28B473;"><div class="service-icon-container rot-y"><i class="fa fa-angle-right about-list-arrows"></i></div>Otras funciones</div>                                       
                            <p class="override-service-box top-p"><i class="fa fa-plus corp-list"></i> Diagnóstico, prescripción y recomendación médica vía correo.</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Grabación de los chats y de las videollamadas.</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Los usuarios podrán subir toda clase de información médica para mejorar la visibilidad del Doctor. Los usuarios
                            podrán por ejemplo subir radiografías o exámenes de laboratorio.</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Los usuarios pueden llevar un perfil médico en nuestra plataforma.</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Los usuarios podrán subir toda clase de información médica para mejorar la visibilidad del Doctor.</p>
                        </div>    

                        <div class="col-sm-12 col-xs-12 col-md-12 col-lg-12 service-box">
                            &nbsp;
                        </div>                    

                        <!--service box-->
                        <div class="col-sm-4 col-xs-12 col-md-4 col-lg-4 service-box no-pad wow fadeInRight animated"  data-wow-offset="80">
                            <div class="service-title" style="color:#28B473;"><div class="service-icon-container rot-y"><i class="fa fa-angle-right about-list-arrows"></i></div>Beneficios para aseguradoras</div>
                            <p class="override-service-box top-p"><i class="fa fa-plus corp-list"></i> Disminución de siniestralidad 
                                <br/><small> Consulta remota, tiene un costo mucho menor que una consulta presencial.</small>
                                <br/><small> Tratar condiciones de los asegurados lo más pronto posible para evitar complicaciones posteriores.</small>
                                <br/><small> Disminución de las idas a Emergencia y Especialistas.</small>
                            </p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Valor agregado al asegurado</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Inicia proceso digitalización</p>
                        </div>

                        <div class="col-sm-4 col-xs-12 col-md-4 col-lg-4 service-box no-pad wow fadeInRight animated"  data-wow-offset="80">
                            <div class="service-title" style="color:#28B473;"><div class="service-icon-container rot-y"><i class="fa fa-angle-right about-list-arrows"></i></div>Beneficios para asegurados</div>
                            <p class="override-service-box top-p"><i class="fa fa-plus corp-list"></i> Inmediatez</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Facilidad</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Comodidad</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Economía</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Ahorro de tiempo</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> No más permisos laborales</p>
                        </div>

                        <div class="col-sm-4 col-xs-12 col-md-4 col-lg-4 service-box no-pad wow fadeInRight animated"  data-wow-offset="80">
                            <div class="service-title" style="color:#28B473;"><div class="service-icon-container rot-y"><i class="fa fa-angle-right about-list-arrows"></i></div>Beneficios para pólizas colectivas</div>
                            <p class="override-service-box top-p"><i class="fa fa-plus corp-list"></i> Disminución de Ausentismo</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Disminución de permisos</p>
                            <p class="override-service-box no-padding"><i class="fa fa-plus corp-list"></i> Beneficio laboral y familiar</p>
                        </div>

                        <div class="col-md-9 no-pad col-xs-12 col-sm-9 heading-content elemnts-wrap wow fadeInLeft animated" data-wow-offset="200" style="text-align: center">
                            <h2>
                                <a class="inner-page-butt-blue-sin-margen-blanco" style="color:#28B473; background-color: transparent !important; border-style: none; font-weight: bold; text-align: center; width: 100%;"><i class="fa inner-page-butt-white-icon"></i>¿Cómo funciona para aseguradoras?</a>
                            </h2>
                            <p>Servicio de plataforma con médicos o solamente uso de plataforma.</p>
                            <p>Reportería en tiempo real.</p>
                            <p>App iOS, Android y página Web con marca de la aseguradora.</p>
                            <p>Posible integración a procesos actuales de aseguradora.<br/>
                                <small>Ej. Autorización de medicamentos</small>
                            </p>
                            <p>Posibilidad de integrar adentro de su app Android e iOS estos servicios.<br/>
                                <small>(no hay necesidad de hacer una app nueva)</small>
                            </p>
                        </div>

                        <div class="col-md-3 no-pad col-xs-12 col-sm-3 heading-content elemnts-wrap wow fadeInLeft animated" data-wow-offset="200" style="text-align: center;">
                            <img src="../img/contactanos.png" style="width: 100%">
                        </div>

                        <div class="col-md-4 no-pad col-xs-12 col-sm-4 heading-content elemnts-wrap wow fadeInLeft animated" data-wow-offset="200" style="text-align: center;">
                            &nbsp;
                        </div>

                        <div class="col-md-4 no-pad col-xs-12 col-sm-4 heading-content elemnts-wrap wow fadeInRight animated" data-wow-offset="200" style="text-align: center;">
                            <img src="../img/actualmente.png" style="width: 100%">
                        </div>


                    </div>

                </div>            
            </div>
        </section>

        <?php include_once ('layout/footer.php') ?>
    </body>
    </html>