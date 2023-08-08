<?php
	include_once ('../../config/constantes.php');
	header('Access-Control-Allow-Origin: *');

	$method = base64_decode($_GET["m"]);
	$data = base64_decode($_GET["d"]);
	$url = constant('API_URL_BASE')."dronline-call-api/sessioncall/";
	
	if($data != "null"){
		$url .= $i;
	}

	$request = curl_init($url); 

	switch ($method) {
		case "GET":
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");                                                                 
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                                                                    
			$result = curl_exec($ch);

			echo $result;
			break;
		case "POST":
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST"); 
			curl_setopt($ch, CURLOPT_FAILONERROR, true);                                                                    
			curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
			curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
			    'Content-Type: application/json',                                                                                
			    'Content-Length: ' . strlen($data_string))                                                                       
			);                                                                                                                   
			$result = curl_exec($ch);

			echo $result;
			break;
		case "PUT":
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT"); 
			curl_setopt($ch, CURLOPT_FAILONERROR, true);                                                                    
			curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
			curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
			    'Content-Type: application/json',                                                                                
			    'Content-Length: ' . strlen($data_string))                                                                       
			);                                                                                                                   
			$result = curl_exec($ch);

			echo $result;
			break;
	}
?>