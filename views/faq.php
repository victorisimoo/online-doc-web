<?php 
    include_once ('../config/constantes.php');
    include_once ('../config/funciones.php');
    $paginaActual = 0;
    $nombrePaginaActual = 'FAQ';
?>

<?php include_once ('layout/head.php') ?>
<body>
  <?php include_once ('layout/header.php'); ?>
  <section class="complete-content content-footer-space">
    <div class="about-intro-wrap pull-left">
      <?php include_once ('layout/headerinfo.php'); ?>
      <div class="container">
        <div class="row">
        <div class="col-md-12 col-sm-12 col-lg-12 col-xs-12 faq-tabs-wrap wow fadeInUp animated" data-wow-delay="0.5s" data-wow-offset="200">
          <div class="tabbable tabs-left">
            <?php getFAQ(); ?>
          </div>
        </div>
        </div>
      </div>
    </div>
  </section>
  <?php include_once ('layout/footer.php') ?>
</body>
</html>