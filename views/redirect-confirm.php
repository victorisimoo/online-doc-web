<?php 

include_once ('../config/constantes.php');

$parameter1= $_GET['parameter1'];
$parameter2= $_GET['parameter2'];

//header( "Location: https://".constant('DOMAIN_BASE')."/seguros/web/private/index.php#/pages/medical-appointment?parametro1=".$parameter1."&parametro2=".$parameter2);
header( "Location: https://".constant('DOMAIN_BASE')."/".constant('WEB_SITE_NAME')."/private/index.php#/pages/medical-appointment?parametro1=".$parameter1."&parametro2=".$parameter2);

?>
