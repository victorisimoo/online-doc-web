<?php
include_once ('../config/constantes.php');
?>
<?php

$id = '';
$email = '';
$first_name = '';
$last_name = '';
$gender = '';
$birthday = '';
//request parameters
if (isset($_POST["id"])) {
    $id = $_POST['id'];
}
if (isset($_POST["email"])) {
    $email = $_POST['email'];
}
if (isset($_POST["first_name"])) {
    $first_name = $_POST['first_name'];
}
if (isset($_POST["last_name"])) {
    $last_name = $_POST['last_name'];
}
if (isset($_POST["gender"])) {
    $gender = $_POST['gender'];
}
if (isset($_POST["birthday"])) {
    $birthday = $_POST['birthday'];
}
if ($_POST) {
    $msg = '';
    if (isset($_POST['email'])) {
        $url = constant('API_PATIENT') . 'patient';
        $headers = array(
            "Content-Type: application/json",
        );
        $data_to_post = array();
        $genderId = 1;
        if ($gender = 'male') {
            $genderId = 1;
        } else {
            $genderId = 0;
        }
        $person = array(
            'firstName' => $first_name,
            'lastName' => $last_name,
            'gender' => $genderId,
            'birthday' => $birthday
        );
        $data_to_post['person'] = $person;
        $data_to_post['email'] = $email;
        $country = array(
            'countryId' => 1
        );
        $data_to_post['country'] = $country;
        $language = array(
            'languageId' => 1
        );
        $data_to_post['language'] = $language;
        $data_to_post['outhMode'] = 1;
        $data_to_post['typeSocialMedia'] = 2;
        $data_to_post['socialNetworkId'] = $id;
        $data_string = json_encode($data_to_post);
        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $url);
        curl_setopt($handle, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 0); // On dev server only!
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($handle);
        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
        if ($httpCode == 200) {
            $urlAuth = constant('API_SECURITY') . 'auth/patient';
            $headersAuth = array(
                "Content-Type: application/json",
            );
            $data_to_post_auth = array();
            $data_to_post_auth['principal'] = $email;
            $data_to_post_auth['socialNetworkId'] = $$id;
            $data_string_auth = json_encode($data_to_post_auth);
            $handleAuth = curl_init();
            curl_setopt($handleAuth, CURLOPT_URL, $urlAuth);
            curl_setopt($handleAuth, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($handleAuth, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($handleAuth, CURLOPT_POSTFIELDS, $data_string_auth);
            curl_setopt($handleAuth, CURLOPT_HTTPHEADER, $headersAuth);
            curl_setopt($handleAuth, CURLOPT_SSL_VERIFYPEER, 0); // On dev server only!
            $resultAuth = curl_exec($handleAuth);
            $httpCodeAut = curl_getinfo($handleAuth, CURLINFO_HTTP_CODE);
            $vals = array(
                'url' => constant('URL_BASE') . '/private/index.php#/pages/patient'
            );
            if ($httpCodeAut == 200) {
                curl_close($handleAuth);
                setcookie("admdron", $resultAuth,time()+3600,"/",constant('DOMAIN_BASE'),1);
                $vals = array(
                    'url' => constant('URL_BASE') . '/private/index.php#/pages/patient'
                );
            } else {
                $vals = array(
                    'url' => constant('URL_BASE') . '/views/login.php'
                );
            }
            echo json_encode($vals);
            exit;
            /* $vals = array(
              'id'=>$id,
              'email'=>$email,
              'first_name'=> $first_name,
              'last_name'=> $last_name,
              'gender' => $gender,
              'birthday'=> $birthday
              );
              echo json_encode($vals); */
            //exit; // to make sure you arn't getting nothing else
        } else {
            echo "<div class=\"alert alert-danger alert-error text-center\">";
            echo "<i class=\"fa fa-exclamation-triangle icons pull-left\"></i>Ocurrió un problema al crear usuario";
            echo '</div>';
        }
    }
} else {
    // so you can access the error message in jQuery
    echo json_encode(array('errror' => TRUE, 'message' => 'a problem occured'));
    exit;
}