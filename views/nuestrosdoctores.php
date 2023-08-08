<?php include_once ('../config/constantes.php');
    include_once ('../config/funciones.php');
    $paginaActual = 1;
    $nombrePaginaActual = 'Nuestros Doctores';
?>

<?php include_once ('layout/head.php') ?>
<body>
  <?php include_once ('layout/header.php'); ?>
  <section class="complete-content content-footer-space">
    <div class="about-intro-wrap pull-left">
      <?php include_once ('layout/headerinfo.php'); ?>
      <div class="container">
        <div class="row">
          <div class="col-md-12 col-xs-12 col-sm-12 pull-left subtitle ibg-transparent">Nuestros Doctores</div>
          <div class="col-xs-12 col-sm-12 col-md-12 pull-left doctors-3col-tabs no-pad">
            <div class="content-tabs tabs col-xs-12 col-sm-12">
            <?php  getDoctores(); ?>
            </div> 
          </div>
        </div>
      </div>
    </div>
  </section>
  <?php include_once ('layout/footer.php') ?>
</body>
</html>