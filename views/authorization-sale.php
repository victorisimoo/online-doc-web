<?php include_once ('../config/constantes.php');
    include_once ('../config/funciones.php');    
?>
<?php include_once ('layout/head.php') ?>
<body> 
  <section class="complete-content content-footer-space">
    <div class="about-intro-wrap pull-left">
      <?php include_once ('layout/headerinfo.php'); ?>
      <div class="container">
        <div class="row">          
            <div>
                <?php  getAuthorizationData(constant('API_BILLING')); ?>              
            </div>          
        </div>
      </div>
    </div>
  </section>  
</body>
</html>