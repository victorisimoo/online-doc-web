<?php

	function getAnio(){
		echo date('Y');
	}

	function getFAQ(){
		//Aqui va el consumo del api 
		$jsonRespuesta = '[
		{"pregunta":"Como puedo ser paciente","respuesta":"Ingresa a la pagina pirncipal y dale crear usuario","autor":"Doctor. Luis Garcia"},
		{"pregunta":"Como puedo ser doctor","respuesta":"En la pagina principal da clic en la parte donde dice soy doctor y ahi ingresas tu CV para que nosotros nos podamos contactar con usted","autor":"Doctor. Luis Garcia"},
		{"pregunta":"Si me duele el estomago","respuesta":"Puedes tomar un sal andrews para que pueda salir todos los gases que tengas en el estomago","autor":"Doctor. Maria Lopez"},
		{"pregunta":"Como puedo ser paciente","respuesta":"Ingresa a la pagina pirncipal y dale crear usuario","autor":"Doctor. Luis Garcia"},
		{"pregunta":"Como puedo ser doctor","respuesta":"En la pagina principal da clic en la parte donde dice soy doctor y ahi ingresas tu CV para que nosotros nos podamos contactar con usted","autor":"Doctor. Luis Garcia"},
		{"pregunta":"Si me duele el estomago","respuesta":"Puedes tomar un sal andrews para que pueda salir todos los gases que tengas en el estomago","autor":"Doctor. Maria Lopez"},
		{"pregunta":"Como puedo ser paciente","respuesta":"Ingresa a la pagina pirncipal y dale crear usuario","autor":"Doctor. Luis Garcia"},
		{"pregunta":"Como puedo ser doctor","respuesta":"En la pagina principal da clic en la parte donde dice soy doctor y ahi ingresas tu CV para que nosotros nos podamos contactar con usted","autor":"Doctor. Luis Garcia"},
		{"pregunta":"Si me duele el estomago","respuesta":"Puedes tomar un sal andrews para que pueda salir todos los gases que tengas en el estomago","autor":"Doctor. Maria Lopez"}
		]';

		$jsonDatos = json_decode( $jsonRespuesta );
		$htmlFAQPreguntas = '<ul class="nav nav-tabs col-md-4 col-sm-4 col-xs-5">';
		$htmlFAQRespuestas = '';
		$identificador = 1;
		foreach ($jsonDatos as $informacion) {
			if($identificador == 1){ 
				$htmlFAQPreguntas .= '<li class="active"><a href="#a'.$identificador.'" data-toggle="tab"><span class="faq-ques">'.$informacion -> {'pregunta'}.'</span><i class="right-arr"></i></a></li>';
				$htmlFAQRespuestas .= '<div class="tab-pane active" id="a'.$identificador.'">';
			} else { 
				$htmlFAQPreguntas .= '<li><a href="#a'.$identificador.'" data-toggle="tab"><span class="faq-ques">'.$informacion -> {'pregunta'}.'</span><i class="right-arr"></i></a></li>';
				$htmlFAQRespuestas .= '<div class="tab-pane" id="a'.$identificador.'">';
			}
			$htmlFAQRespuestas .= '
       			<div class="dept-title-tabs">'.$informacion -> {'pregunta'}.'</div>
                    <p>'.$informacion -> {'respuesta'}.'</p>
                 </div>';
			$identificador ++;
		}
		echo $htmlFAQPreguntas.'</ul>';
		echo '<div class="tab-content col-md-8 col-sm-8 col-xs-7 pull-right">'.$htmlFAQRespuestas.'</div>';
		
	}

	function getAuthorizationData($urlApi){

		$headers = array(
            "Content-Type: application/json",
        );
        $url = $urlApi.'powertranz/transaction/authorization-response/'.$_GET['transaction'];
        $handle = curl_init();
		curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);       
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($handle);
        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
		
		if ($httpCode == 200) {

			curl_close($handle);
			$data = json_decode($result);

			$platformName = $data->{'platformName'};
			$cardHolderName = $data->{'cardHolderName'};
			$cardType = $data->{'cardType'};
			$cardNumber = $data->{'cardNumber'};
			$totalAmount = $data->{'totalAmount'};
			$dateProcess = $data->{'date'};
			$status = $data->{'status'};
			$message = $data->{'message'};			

			$htmlAuthorizationData = '<table  style="margin: 0 auto;"><caption><p style="font-size:28px;"><strong>Autorización</strong></p></br></br>'.$message.'</br></br></caption>';                    
			$htmlAuthorizationData .= '<tr>';
			$htmlAuthorizationData .= '<td>Fecha:</td>';
			$htmlAuthorizationData .= '<td>&emsp;&emsp;&emsp;&emsp;</td>';
			$htmlAuthorizationData .= '<td>'.$dateProcess.'</td>';
			$htmlAuthorizationData .= '</tr>';   
			$htmlAuthorizationData .= '<tr>';
			$htmlAuthorizationData .= '<td>Plataforma:</td>';
			$htmlAuthorizationData .= '<td>&emsp;&emsp;&emsp;&emsp;</td>';
			$htmlAuthorizationData .= '<td>'.$platformName.'</td>';
			$htmlAuthorizationData .= '</tr>'; 
			$htmlAuthorizationData .= '<tr>';
			$htmlAuthorizationData .= '<td>Tipo de tarjeta:</td>';
			$htmlAuthorizationData .= '<td>&emsp;&emsp;&emsp;&emsp;</td>';
			$htmlAuthorizationData .= '<td>'.$cardType.'</td>';
			$htmlAuthorizationData .= '</tr>';
			$htmlAuthorizationData .= '<tr>';
			$htmlAuthorizationData .= '<td>Tarjeta a nombre de:</td>';
			$htmlAuthorizationData .= '<td>&emsp;&emsp;&emsp;&emsp;</td>';
			$htmlAuthorizationData .= '<td>'.$cardHolderName.'</td>';
			$htmlAuthorizationData .= '</tr>';                   
			$htmlAuthorizationData .= '<tr>';
			$htmlAuthorizationData .= '<td>Tarjeta:</td>';
			$htmlAuthorizationData .= '<td>&emsp;&emsp;&emsp;&emsp;</td>';
			$htmlAuthorizationData .= '<td>'.$cardNumber.'</td>';
			$htmlAuthorizationData .= '</tr>';                
			$htmlAuthorizationData .= '<tr>';
			$htmlAuthorizationData .= '<td>Cantidad a cobrar:</td>';
			$htmlAuthorizationData .= '<td>&emsp;&emsp;&emsp;&emsp;</td>';
			$htmlAuthorizationData .= '<td>'.$totalAmount.'</td>';
			$htmlAuthorizationData .= '</tr>';                  
			$htmlAuthorizationData .= '<tr>';
			$htmlAuthorizationData .= '<td>Estado:</td>';
			$htmlAuthorizationData .= '<td>&emsp;&emsp;&emsp;&emsp;</td>';
			$htmlAuthorizationData .= '<td>'.$status.'</td>';
			$htmlAuthorizationData .= '</tr>';
			$htmlAuthorizationData .= '</table>';		
			echo $htmlAuthorizationData;
		
		} else {
			echo "Error";
		}	
		
	}

	function getDoctores(){
		//Aqui va el consumo del Api
		$jsonRespuesta = '[
		{"idespecialidad":"1", "especialidad":"General", "doctores":[
		  {"nombre":"Carlos Garcia","resenia":"Es el mejor medico en su especialidad"},{"nombre":"Maria Gonzales","resenia":"Es el mejor medico en su especialidad"},{"nombre":"Mario Ortiz","resenia":"Es el mejor medico en su especialidad"}
		]},
		{"idespecialidad":"2", "especialidad":"Nutriologia", "doctores":[
		  {"nombre":"Carlos Garcia","resenia":"Es el mejor medico en su especialidad"},{"nombre":"Maria Gonzales","resenia":"Es el mejor medico en su especialidad"},{"nombre":"Mario Ortiz","resenia":"Es el mejor medico en su especialidad"}
		]},
		{"idespecialidad":"3", "especialidad":"Pediatra", "doctores":[
		  {"nombre":"Carlos Garcia","resenia":"Es el mejor medico en su especialidad"},{"nombre":"Maria Gonzales","resenia":"Es el mejor medico en su especialidad"},{"nombre":"Mario Ortiz","resenia":"Es el mejor medico en su especialidad"}
		]}
		]';
		$jsonDatos = json_decode($jsonRespuesta);
		$htmlDoctorEspecialidad = '<ul class="nav nav-tabs tab-acc" id="myTab">';
		$htmlDoctorDoctores = '';
		$identificador = 1;
		foreach ($jsonDatos as $informacion) {
			if($identificador == 1){
				$htmlDoctorEspecialidad .= '<li class="active"><a href="#a'.$informacion -> {'idespecialidad'}.'" data-toggle="tab">'.$informacion -> {'especialidad'}.'</a></li>';
				$htmlDoctorDoctores .= '<div class="tab-pane fade fade-slow in active" id="a'.$informacion -> {'idespecialidad'}.'">';
			}else{
				$htmlDoctorEspecialidad .= '<li><a href="#a'.$informacion -> {'idespecialidad'}.'" data-toggle="tab">'.$informacion -> {'especialidad'}.'</a></li>';
				$htmlDoctorDoctores .= '<div class="tab-pane fade fade-slow" id="a'.$informacion -> {'idespecialidad'}.'">';
			}

			$doctores = $informacion -> {'doctores'};

			foreach ($doctores as $infoDoctores ) {
				$htmlDoctorDoctores .= '<div class="doctor-box col-md-4 col-sm-6 col-xs-12 wow fadeInUp animated" data-wow-delay="0.5s" data-wow-offset="200">
                        	<div class="zoom-wrap">
                          <div class="zoom-icon"></div>
                        	<img alt="" class="img-responsive" src="../img/mydoc-dummy-1.jpg" />
                          </div>
                      	<div class="doc-name">
                          	<div class="doc-name-class">'.$infoDoctores -> {'nombre'}.'</div><span class="doc-title">'.$informacion -> {'especialidad'}.'</span>
                          	<hr />
                          	<p>'.$infoDoctores -> {'resenia'}.'</p>
                          </div>
                         </div>';
			}
			$htmlDoctorDoctores .= '</div>';
			$identificador ++;
		}
		$htmlDoctorEspecialidad .= '</ul>';

		echo $htmlDoctorEspecialidad;
		echo '<div class="tab-content">'.$htmlDoctorDoctores.'</div>';
	}


	function comoFunciona(){
		//Aqui va el consumo al Api
		$jsonRespuesta = '[
		{"titulo":"Paciente","descripcion":"Proporcionamos un sistema flexible y rapido en la que podra encontrar solucion a sus enfermedades desde su coasa u oficina ..."},
		{"titulo":"Doctor","descripcion":"Proporcionamos un sistema en el que podra respondere le forma rapida y directa, asi como una comunicacion sin problemas y sin ruido ..."},
		{"titulo":"Chat","descripcion":"Podran acceder a nuestro sistema de chat de forma facil y nosotros seleccionaremos el mejor doctor disponible y que responda rapidamente ..."},
		{"titulo":"Video conferencia","descripcion":"Podran acceder de una forma mas optima donde el doctor y el paciente se pueden ver por una video conferencia y solucionar la enfermedad ..."},
		{"titulo":"Paciente","descripcion":"Proporcionamos un sistema flexible y rapido en la que podra encontrar solucion a sus enfermedades desde su coasa u oficina ..."},
		{"titulo":"Doctor","descripcion":"Proporcionamos un sistema en el que podra respondere le forma rapida y directa, asi como una comunicacion sin problemas y sin ruido ..."},
		{"titulo":"Chat","descripcion":"Podran acceder a nuestro sistema de chat de forma facil y nosotros seleccionaremos el mejor doctor disponible y que responda rapidamente ..."},
		{"titulo":"Video conferencia","descripcion":"Podran acceder de una forma mas optima donde el doctor y el paciente se pueden ver por una video conferencia y solucionar la enfermedad..."}
		]';

		$jsonDatos = json_decode($jsonRespuesta);
		foreach ($jsonDatos as $informacion) {
			$htmlComoFunciona = '<div class="col-sm-5 col-xs-12 col-md-3 col-lg-3 service-box no-pad wow fadeInLeft animated" data-wow-delay="1s" data-wow-offset="150">
                <div class="service-title"><div class="service-icon-container rot-y"><i class="icon-stethoscope panel-icon"></i></div>'.$informacion -> {'titulo'}.'</div>
                <p>'.$informacion -> {'descripcion'}.'</p>
            </div>';
			echo $htmlComoFunciona;
		}
	}

    //@param string $action: can be 'encrypt' or 'decrypt'
    //@param string $string: string to encrypt or decrypt
    function encrypt_decrypt($action, $string) {
        $output = false;

        $encrypt_method = "AES-256-CBC";
        $secret_key = 'drOnline key 20160621';
        $secret_iv = 'drOnline iv 20160621';

        // hash
        $key = hash('sha256', $secret_key);

        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hash('sha256', $secret_iv), 0, 16);

        if( $action == 'encrypt' ) {
            $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
            $output = base64_encode($output);
        }
        else if( $action == 'decrypt' ){
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
        }

        return $output;
    }

	function encryptRequest ($jsonData, $codeKey) {
		$arrayMessage = json_encode($jsonData, JSON_UNESCAPED_SLASHES);
		$arrayMessage2 = str_replace("\\","",$arrayMessage);
		$array = str_split($arrayMessage2);
		$caracter = chr(strlen($codeKey));
		$caracter_number = ord($caracter);
		$arrayResult = "";
		for ($i = 1; $i < count($array)-1; $i++) {
			$arrayResult = $arrayResult . chr(ord($array[$i]) + $caracter_number);
		}
		$jsonPost = array();
		$jsonPost['request'] = $arrayResult;
		$encodedArray = array_map("utf8_encode", $jsonPost);
		$final = json_encode($encodedArray, JSON_FORCE_OBJECT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
		return $final;
	}

	function decryptRequest ($dataEncrypt, $codeKey) {
		
		$obj = json_decode($dataEncrypt, true);
		$array = str_split($obj['response']);
		$caracter = chr(strlen($codeKey));
		$caracter_number = ord($caracter);
		$arrayResult = "";

		for ($i = 0; $i < count($array); $i++) {
			if ((ord($array[$i]) - $caracter_number) != 189) {
				$arrayResult = $arrayResult . chr(ord($array[$i]) - $caracter_number);
			}
		}
		$json = utf8_decode($arrayResult);

		$final = (object) json_decode($json, true);
		return $final;
	}
?>
