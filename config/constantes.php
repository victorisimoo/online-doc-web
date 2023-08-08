<?php
$apiDomainBase = "api-latam-qa.doctor-online.co";
$domainBase = "localhost";
$apiURLBase = "https://".$apiDomainBase."/";
$URLBase = "http://".$domainBase."/";
$webSiteName ="dronline-corporate-web/";
$debugMode = "false";
$enableSpeedTest = "false";
$movilLogin= $URLBase.'webm/views/login.php?resource=';
$dronlineLogin=$URLBase.$webSiteName.'views/login.php?resource=e4c4aa0f523941d2a332d15101f12e9e';
$dronlineRegister=$URLBase.$webSiteName.'views/register.php';
$headerEnrichment="http://promociones.televida.biz/he_validation/midoctor_he.php";
$claroSubscription = "http://promociones.televida.biz/gt/midoctor";
$version="2.21";
$rutaAudiofile = "../audio/alarm-doctor.mp3";

$appVersionName = "1.0";
$appName="web";

define('MOVIL_LOGIN', $URLBase.'doctoronline/segurosm/views/login.php');
define('MOVIL_PATIENT_HOME', $URLBase.substr($webSiteName, 0, -1).'m/private/index.php#/pages/patient');

//Links de Paginas
define('PAGINAINICIO', "home.php");
define('PAGINADOCTORES', "doctor.php");
define('PAGINAERESDOCTOR', "home.php");
define('PAGINAPACIENTE', "paciente.php");
define('PAGINAFAQ', "Doctor Online");
define('PAGINA_NOTICIAS', "news.php");
define('PAGINAMISION', "Doctor Online");
define('PAGINALOGIN', "login.php");

//Textos de informacion
define('DOCTOR_NOMBRE', "Doctor Online");
define('DOCTOR_CORREO', "info@doctor-online.co");
define('DOCTOR_TELEFONO', "+(502) 2326-1318");
define('DOCTOR_CELULAR', "+502 5555 755");
define('DOCTOR_COSTO_CHAT', "$5");
define('DOCTOR_COSTO_VIDEO', "$20");

//direcciones paginas internas
define('PAGINA_INICIO', "home.php");
define('PAGINA_NUESTROS_DOCTORES', "nuestrosdoctores.php");
define('PAGINA_DOCTOR', "login-doc.php");
define('PAGINA_PACIENTE', "views/login.php?resource=e4c4aa0f523941d2a332d15101f12e9e");
define('PAGINA_MISION', "mision.php");
define('PAGINA_TERMINOS', "terminosycondiciones.php");
define('PAGINA_FAQ', "faq.php");
define('PAGINA_DOCTOR_NUEVO', "register-doc.php");
define('PAGINA_LOGIN', "login.php");
define('REGISTER_PATIENT', $dronlineRegister);
define('JOIN_DOCTOR', "join-doctor.php");
define('JOIN_CORPORATION', "join-corporation.php");

//direcciones paginas externas
define('WEB_PAGINA_FB', "https://www.facebook.com/Doctoronline.co/");
define('WEB_PAGINA_TW', "https://twitter.com/doctoronlineco");
define('WEB_PAGINA_IN', "https://www.instagram.com/doctoronline.co/");
define('WEB_PAGINA_LI', "https://www.linkedin.com/company/dronline/");
define('URL_VIDEO', 'https://www.youtube.com/watch?v=WmC_g-RcxgU');

define('API_DOCTOR', $apiURLBase."dronline-doctor-api/api/");
define('API_SECURITY', $apiURLBase."dronline-security-api/api/");
define('API_PATIENT', $apiURLBase."dronline-patient-api/api/");
define('API_ADMIN', $apiURLBase."dronline-admin-api/api/");
define('API_BILLING', $apiURLBase."dronline-billing-api/api/");
define('API_DOMAIN_BASE', $apiDomainBase);
define('API_URL_BASE', $apiURLBase);
define('DOMAIN_BASE', $domainBase);
define('URL_BASE', $URLBase);
define('WEB_SITE_NAME', $webSiteName);
define('APP_ID_FACEBOOK', "1783647395192208");
define('URL_AUDIO_FILE', $rutaAudiofile);
define('DEBUG_MODE', $debugMode);
define('ENABLE_SPEED_TEST', $enableSpeedTest);
define('SUCCESSFUL_SUBSCRIPTION',"views/register-confirm.php");
?>