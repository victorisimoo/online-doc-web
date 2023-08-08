<?php
	include_once ('../config/constantes.php');
	

	$msisdn = $_GET["msisdn"];
	$resource =$_GET["resource"];
	$options = array(
        CURLOPT_RETURNTRANSFER => true   // return web page
    ); 

    $ch = curl_init($apiURLBase."dronline-integration-api/api/landingpage/$msisdn/$resource");
    curl_setopt_array($ch, $options);

    $content  = curl_exec($ch);

    $obj = json_decode($content, FALSE);

    curl_close($ch);

    echo $content;
?>