<?php
header('Location: https://www.doctor-online.co/web/');

include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
$paginaActual = 0;
$nombrePaginaActual = 'Doctor Online - Habla con un médico ahora';
setcookie("admdron", "", time() - 3600, "/", constant('DOMAIN_BASE'), 1);
?>
<?php include_once ('layout/head.php') ?>
<body >
    <div id="loader-overlay"><img src="../img/loader.gif" alt="Loading" /></div>
    <?php include_once ('layout/header.php'); ?>
    <div class="complete-content">
        <div id="home-page-version-five">

            <div class="container full-width-container ihome-banner">
                <div class="banner col-sm-12 col-xs-12 col-md-12" id="imageDiv" style="min-height: 650px;">
                    <ul>
                        <li>
                            <img src="../img/new-slider/Slide01.png"  alt="slidebg1"  data-bgfit="cover" data-bgposition="left top" data-bgrepeat="no-repeat">
                            <div class="slide-div tp-caption s1-but sfr skewtoright imed-sl1 hidden-xs"
                                 data-x="left"
                                 data-y="200"
                                 data-hoffset="-60"
                                 data-speed="1000"
                                 data-start="2000"
                                 data-easing="Back.easeOut"
                                 data-endspeed="400"
                                 data-endeasing="Power1.easeIn">
                                <a href="<?php echo constant('REGISTER_PATIENT'); ?>">Habla con un doctor ahora</a>
                            </div>
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

                        </li>
                    </ul>
                </div>
            </div>

            <div class="services-bottom-wrap-fondo">

            </div>
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12 ">
                        <div  align="center" class="contenedor-uno">
                            <span class="boton-gris-center"><i class="fa fa-cruz inner-page-butt-blue-icon"></i>¿CÓMO FUNCIONA?</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="services-bottom-wrap pull-left">
                <div class="container">
                    <div class="row">
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box no-pad " >
                            <img  alt="" class="img-responsive" src="../img/img-cell-1.png" />
                            <div  class="bottom-service-title">1. Crea tu cuenta</div>
                        </div>
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box no-pad" >
                            <img alt="" class="img-responsive" src="../img/img-cell-2.png" />
                            <div class="bottom-service-title">2. Ingresa tu número de tarjeta de crédito</div>
                        </div>
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box no-pad" >
                            <img alt="" class="img-responsive" src="../img/img-cell-3.png" />
                            <div class="bottom-service-title">3. Solicita chat o video con uno de nuestros doctores</div>
                        </div>
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box no-pad">
                            <img alt="" class="img-responsive" src="../img/img-cell-4.png" />
                            <div class="bottom-service-title">4. Haz tu consulta desde cualquier lugar</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row hidden-xs" style="background-color: #404040;">
                <div class="container">                    
                    <div class="col-md-6">
                        <div class="text-video">
                            Mira nuestro video y conoce más sobre Doctor Online
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="play-video" data-video-url="<?php echo constant('URL_VIDEO'); ?>">
                            <img src="../img/watch-video.png"/>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12 ">
                        <div  ALIGN=center class="contenedor-uno">
                            <span class="boton-gris-center"><i class="fa fa-cruz inner-page-butt-blue-icon"></i>NUESTRA MEMBRESÍA</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="row separador-row-dos">
                    <div class="col-xs-12 col-md-2 col-sm-12 col-lg-2 ">
                    </div>
                    <div class="col-xs-12 col-md-8 col-sm-12 col-lg-8 ">
                        <div align="right" class="col-xs-8 col-md-4 col-sm-6 col-lg-4 ">
                            <div class="text-costo-general">
                                $3
                            </div>
                        </div>
                        <div class="col-xs-12 col-md-8 col-sm-12 col-lg-8 ">
                            <div class="text-costo-general-comentario">
                               por videollamadas y chats con fotos ilimitado
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-2 col-sm-12 col-lg-2 ">
                    </div>
                </div>
            </div>

            <div class="parallax-out wpb_row vc_row-fluid ihome-parallax">    
                <div id="second" class="upb_row_bg vcpb-hz-jquery" data-upb_br_animation="" data-parallax_sense="30" data-bg-override="ex-full">
                    <div class="container">
                        <div class="row">
                            <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12 ">
                                <div  ALIGN=center class="contenedor-uno">
                                    <span class="boton-blanco-center"><i class="fa fa-cruz-verde inner-page-butt-blue-icon"></i>NUESTROS DOCTORES</span>
                                </div>
                            </div>
                            <div class="bg col-lg-5 col-sm-4 col-md-5 col-xs-12 " data-wow-delay="1.5s" data-wow-offset="200"></div>
                            <div class="float-right col-lg-5 col-sm-7 col-md-5 col-xs-12">
                                <div class="iconlist-wrap">
                                    <ul>
                                        <li class="">
                                            <i class="icon-list-icons"></i>
                                            <div class="iconlist-content fondo-verde">
                                                <div class="iconlist-title">Doctores certificados y registrados</div>
                                            </div>
                                        </li>
                                        <br>
                                        <li class="">
                                            <i class="icon-list-icons"></i>
                                            <div class="iconlist-content fondo-verde">
                                                <div class="iconlist-title">Riguroso proceso de selección y entrenamiento</div>
                                            </div>
                                        </li>
                                        <li class="" >
                                            <i class="icon-list-icons"></i>
                                            <div class="iconlist-content fondo-verde">
                                                <div class="iconlist-title">Los pacientes pueden calificar a los doctores</div>
                                            </div>
                                        </li>
                                        <li class="">
                                            <i class="icon-list-icons"></i>
                                            <div class="iconlist-content fondo-verde">
                                                <div class="iconlist-title">Más alto nivel de cuidado con una sonrisa</div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                                    <div  align="center" class="contenedor-uno">
                                        <span class="boton-amarillo-center-peq"><i class="fa fa-cruz inner-page-butt-blue-icon"></i>Conoce más de nuestros doctores</span>
                                    </div>
                                </div>
                            </div>

                            <div class="container">
                                <div class="row serparador-bottom-30">
                                    <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12 ">
                                        <div  ALIGN=center class="contenedor-uno s1-but">
                                            <a href="<?php echo constant('REGISTER_PATIENT'); ?>" class="boton-verde-center-peq">Habla con un doctor ahora</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="services-bottom-wrap pull-left services-bottom-wrap-fondo">
                <div class="container">
                    <div class="row serparador-bottom-30">
                        <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12 ">
                            <div  ALIGN=center class="contenedor-uno">
                                <span class="boton-verde-center-peq"><i class="fa fa-cruz inner-page-butt-blue-icon"></i>CONDICIONES MÁS TRATADAS</span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box-box no-pad " >
                            <img  alt="" class="img-responsive" src="../img/f-gripe.png" />
                            <div  class="bottom-service-title-dos">GRIPE</div>

                        </div>
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box-box no-pad ">
                            <img alt="" class="img-responsive" src="../img/f-alergia.png" />
                            <div class="bottom-service-title-dos">ALERGIAS</div>
                        </div>
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box-box no-pad ">
                            <img alt="" class="img-responsive" src="../img/f-piel.png" />
                            <div class="bottom-service-title-dos">PIEL</div>
                        </div>
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box-box no-pad ">
                            <img alt="" class="img-responsive" src="../img/f-vomitos.png" />
                            <div class="bottom-service-title-dos">VÓMITOS</div>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box-box no-pad ">
                            <img  alt="" class="img-responsive" src="../img/f-tos.png" />
                            <div  class="bottom-service-title-dos">TOS</div>

                        </div>
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box-box no-pad ">
                            <img alt="" class="img-responsive" src="../img/f-ojos.png" />
                            <div class="bottom-service-title-dos">OJOS</div>
                        </div>
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box-box no-pad ">
                            <img alt="" class="img-responsive" src="../img/f-garganta.png" />
                            <div class="bottom-service-title-dos">DOLOR DE GARGANTA</div>
                        </div>
                        <div align="center" class="col-xs-12 col-md-3 col-sm-6 col-lg-3 bottom-service-box-box no-pad ">
                            <img alt="" class="img-responsive" src="../img/f-lesiones.png" />
                            <div class="bottom-service-title-dos">LESIONES LEVES</div>
                        </div>
                    </div>
                </div>

                <div class="container">
                    <div class="row serparador-bottom-30">
                        <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12 ">
                            <div  ALIGN=center class="contenedor-uno s1-but">
                                <a href="<?php echo constant('REGISTER_PATIENT'); ?>" class="boton-verde-center-peq">Habla con un doctor ahora</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <?php include_once ('layout/footer.php') ?>
        </div>
    </div>

</body>
</html>
