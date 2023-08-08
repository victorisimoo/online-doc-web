<?php
include_once ('../config/constantes.php');
include_once ('../config/funciones.php');
$paginaActual = 3;
$nombrePaginaActual = 'Login';
?>
<!DOCTYPE html>
    <!--[if IE 9 ]><html class="ie9"><![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Doctor Online - Prueba de recursos</title>
         <link rel="icon" type="image/png" href="private/img/icono_pestania.png">
        <!-- Vendor CSS -->
        <link href="../private/vendors/bower_components/animate.css/animate.min.css" rel="stylesheet">
        <link href="../private/vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel=
        "stylesheet">
        <link href="../private/vendors/bower_components/bootstrap-select/dist/css/bootstrap-select.css" rel="stylesheet">
        <link href="../private/vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css" rel="stylesheet">        
        <link href="../private/vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css" rel="stylesheet">
        <!-- CSS -->
        <link href="../private/css/app_1.min.css" rel="stylesheet">
        <link href="../private/css/app_2.min.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
         <style>
         .h3{
            font-family: "Open Sans";
         }
            .login-content {
                min-height: 100vh;
                text-align: center;
                background-color: #fff;
            }
            .lc-block, .login-content:before {
                vertical-align: top;
                display: inline-block;
            }
            .lcb-form {
                background: #fff;
                box-shadow: 0 1px 1px #f7f7f7;
                border-radius: 2px;
            }
            .input-group-addon {
                padding: 6px 12px;
                font-size: 14px;
                font-weight: normal;
                line-height: 1;
                color: #555;
                text-align: center;
                background-color: #fff;
                 border: 1px solid #fff;
                border-radius: 4px;
            }
            .divider {
                border-top: 1px solid #d9dadc;
                display: block;
                line-height: 1px;
                margin: 15px 0;
                position: relative;
                text-align: center;
            }
            .divider .divider-title {
                background: #fff;
                font-size: 12px;
                letter-spacing: 1px;
                padding: 0 20px;
                text-transform: uppercase;
            }
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                margin: -1px;
                padding: 0;
                overflow: hidden;
                clip: rect(0,0,0,0);
                border: 0;
            }
            label {
                display: inline-block;
                max-width: 100%;
                margin-bottom: 5px;
                font-weight: 700;
            }
            *, :after, :before {
                box-sizing: border-box;
            }
            label {
                cursor: default;
            }
            .lc-block:not(.lc-block-alt) .lcb-form {
               padding: 5px 55px 35px 25px;
            }
            p {
                margin: 0 0 12px;
            }
            p {
                display: block;
                -webkit-margin-before: 1em;
                -webkit-margin-after: 1em;
                -webkit-margin-start: 0px;                
                -webkit-margin-end: 0px;
                font-family: "Open Sans";
            }
            a, a:focus, a:hover {
                text-decoration: none;
            }
            a {
                color: #2ebd59;
            }
            a {
                background-color: transparent;
            }
            .button {
                background-color: #4CAF50; /* Green */
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 12px;
                 font-family: "Open Sans";
            }
            .outputSelector{
                 font-family: "Open Sans";
            }
         </style>
    </head>
    <body style="background-color: #fff;">
                <div class="card">                    
                </div>                 
                 <div class="card-body card-padding">
                    <div class="card-header text-center">
                        <img class="i-logo" src="../img/logo_dr_online_color.png" alt="">
                    </div>
                    <div class="row">
                        <div class="divider"></div>
                    </div>
                                                            
                    <div class="row">
                        <div class="col-xs-3">
                        </div>
                        <div class="col-xs-6">                                                   
                            <div class="login-content">
                             <!-- Login -->
                            <div class="lc-block toggled" id="l-login">
                                <!--<p><strong>Doctor Online - Prueba de Audio y Video</strong></p>-->
                                <div class="lcb-form">
                                    <!--<video id="video" autoplay style="width: 320px;height:240"></video> -->
                                    
                                    
                                    
                                    <div>
                                        <h3>Doctor Online - Prueba de Audio y Video</h3>
                                        <p class="small"><b>Nota:</b> Si escucha un sonido de reverbación de su micrófono que capta la salida de altavoces/auriculares, baje el volumen o mantenga su micrófono alejado de los altavoces/auriculares.  Le recomendamos usar auriculares para comodidad.</p>
                                        <div class="selectpicker">                                                 

                                          <video class="gum" title="Prueba de video DoctorOnline." autoplay style="width: 320px;height:240"></video>
                                          <div class="outputSelector" style="display:none">
                                            <label>Salidas de audio: </label>
                                            <select></select>
                                          </div>
                                        </div>
                                        <div style="display:none">
                                          <audio class="gum" title="audio stream from getUserMedia()" controls ></audio>
                                          <div class="outputSelector" style="display:none">
                                            <label>Salida de Audio: </label>
                                            <select></select>
                                          </div>
                                        </div>
                                        <br/>

                                        <div>
                                          <audio title="local audio file" controls loop>
                                            <source src="../audio/audio.mp3" type="audio/mp3" />
                                            This browser does not support the audio element.
                                          </audio>
                                          <div class="outputSelector">
                                            <label>Salida de Audio: </label>
                                            <select></select>
                                          </div>
                                        </div>
                                        <br/>

                                        <input type="button" value="Terminar prueba" onclick="self.close()" class="button">

                                      </div>


                                    <!--<div class="selectpicker">
                                      <label for="audioSource">Entrada de Audio: </label><select id="audioSource"></select>
                                    </div>

                                    <div class="selectpicker">
                                      <label for="audioOutput">Salida de audio: </label><select id="audioOutput"></select>
                                    </div>

                                    <div class="selectpicker">
                                      <label for="videoSource">Video: </label><select id="videoSource"></select>
                                    </div>-->
                                </div>
                            </div>
                        </div>

                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-3">
                        </div>
                        <div class="col-xs-6">    
                            
                        </div>                        
                    </div>
                </div>                
        

        <!-- Javascript Libraries -->
        <script src="../private/vendors/bower_components/jquery/dist/jquery.min.js"></script>
        <script src="../private/vendors/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
        
        <script src="../private/vendors/bower_components/Waves/dist/waves.min.js"></script>
        <script src="../private/vendors/bower_components/moment/min/moment.min.js"></script>
        <script src="../private/vendors/bower_components/bootstrap-select/dist/js/bootstrap-select.js"></script>
        <script src="../private/vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>

        <!-- Placeholder for IE9 -->
        <!--[if IE 9 ]>
            <script src="vendors/bower_components/jquery-placeholder/jquery.placeholder.min.js"></script>
        <![endif]-->

        <script src="../private/js/app.min.js"></script>
        <!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>-->
        <script src="../private/js/jquery-2.0.3.min.js"></script>

        <script src="../js/test-resource/adapter.js"></script>
        <script src="../js/test-resource/common.js"></script>
        <script src="../js/test-resource/main.js"></script>

    </body>
</html>