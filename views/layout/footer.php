<div class="services-bottom-wrap pull-left footer-class">
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-3 foot-widget">
                <a href="#"><div class="foot-logo col-xs-12 no-pad"></div></a>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 recent-post-foot foot-widget">
                <div class="foot-widget-title">Contacto</div>
                <address class="foot-address">
                    <div class="col-xs-12 no-pad"><i class="icon-globe address-icons"></i>
                        15 Avenida 12-00, Zona 13<br>
                        Ciudad de Guatemala,<br>
                        Guatemala.
                    </div>
                    <div class="col-xs-12 no-pad"><i class="icon-phone2 address-icons"></i>
                        <?php echo constant('DOCTOR_TELEFONO'); ?>
                    </div>
                    <div class="col-xs-12 no-pad"><i class="icon-mail address-icons"></i>
                        <?php echo constant('DOCTOR_CORREO'); ?>
                    </div>
                </address>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 recent-post-foot foot-widget">
                <div class="foot-widget-title">Compañía</div>
                <ul>
                    <li><a href="<?php echo constant('PAGINA_MISION'); ?>">Misión</a></li>
                    <li><a href="<?php echo constant('PAGINA_NOTICIAS'); ?>">Noticias</a></li>
                    <li><a href="<?php echo constant('PAGINA_TERMINOS'); ?>">Términos y Condiciones</a></li>
                </ul>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 recent-post-foot foot-widget">
                <div class="foot-widget-title">Contacto</div>
                <ul>
                    <li><a href="<?php echo constant('WEB_PAGINA_FB'); ?>" target="_blank">Facebook</a></li>
                    <li><a href="<?php echo constant('WEB_PAGINA_TW'); ?>" target="_blank">Twitter</a></li>
                    <li><a href="<?php echo constant('WEB_PAGINA_LI'); ?>" target="_blank">LinkedIn</a></li>
                </ul>
            </div>
        </div>
    </div>       
</div>

<div class="services-bottom-wrap pull-left bottom-footer-class">
    <div class="container ">
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 foot-widget-bottom">
                <p class="col-xs-12 col-md-5 no-pad">Copyright <?php getAnio(); ?> Doctor Online | All Rights Reserved </p>
            </div>
        </div>
    </div> 
</div>

<script type="text/javascript" src="../js/jquery.min.js"></script>
<script type="text/javascript" src="../js/YouTubePopUp.js"></script>
<script type="text/javascript" src="../js/jquery-ui-1.10.3.custom.min.js"></script>  
<script type="text/javascript" src="../js/bootstrap-new/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../lib/rs-plugin/js/jquery.themepunch.tools.min.js"></script>
<script type="text/javascript" src="../lib/rs-plugin/js/jquery.themepunch.revolution.min.js"></script>
<script type="text/javascript" src="../js/jquery.scrollUp.min.js"></script>
<script type="text/javascript" src="../js/jquery.sticky.min.js"></script>
<script type="text/javascript" src="../js/wow.min.js"></script>
<script type="text/javascript" src="../js/jquery.flexisel.min.js"></script>
<script type="text/javascript" src="../js/jquery.imedica.min.js"></script>
<script type="text/javascript" src="../js/custom-imedicajs.min.js"></script>

<script type='text/javascript'>
    $(window).load(function(){
        $('#loader-overlay').fadeOut(900);
        $("html").css("overflow","visible");
    });
</script>

<script type="text/javascript">
    $(function(){
        $("div.play-video").YouTubePopUp();
        $("div.video-action").YouTubePopUp();
    });
</script>