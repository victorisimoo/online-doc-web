<!DOCTYPE html>
<!--[if IE 9 ]><html class="ie9"><![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $nombrePaginaActual; ?></title>
    <link rel="icon" id="icono" type="image/png">
    <!-- Vendor CSS -->
    <link href="../private/vendors/bower_components/animate.css/animate.min.css" rel="stylesheet">
    <link href="../private/vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel=
          "stylesheet">
    <link href="../private/vendors/bower_components/bootstrap-select/dist/css/bootstrap-select.css" rel="stylesheet">
    <link href="../private/vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css" rel="stylesheet">
    <link href="../private/vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <link href="../private/vendors/bower_components/font-open-sans/open-sans.css" rel="stylesheet">
    <link href="../css/bootstrap-datepicker3.min.css" rel="stylesheet">
    <link href="../css/font-awesome.min.css" rel="stylesheet" />
    <!-- CSS -->
    <link rel="stylesheet" type="text/css" href="../css/brand.css">
    <link href="../private/css/app_1.min.css" rel="stylesheet">
    <style>
        .login-content {
            text-align: center;
        }
        .lc-block, .login-content:before {

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
            padding: 0px !important;
            box-shadow: none;
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
        body {
            font-family: 'Open Sans', sans-serif;
        }
        input, select{
            border-radius : 0px 5px 5px 0px !important;
            border: 1px solid #d3d3d3 !important;
            padding-left: 10px !important;
            background-color: white !important;
        }
        .input-group-addon{
            border-radius : 5px 0px 0px 5px !important;
            border: 1px solid #c6c6c6;
            background-color: #c6c6c6 !important;
            color: white;
            padding-bottom: 10px;
        }
        .bgm-green{
            border-radius: 20px !important;
            padding: 10px 30px 10px 30px !important;
        }
        .border-radius{
            border-radius : 5px !important;
        }
        

    </style>
</head>
