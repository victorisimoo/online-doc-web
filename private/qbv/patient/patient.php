<?php
include_once ('../../../config/constantes.php');
echo "
<script type='text/javascript'>
var apiURLBaseJS = '".constant('API_URL_BASE')."';
var domainBaseJS = '".constant('DOMAIN_BASE')."';
var webSiteName = '".constant('WEB_SITE_NAME')."';
var URLBase = '".constant('URL_BASE')."';
var debugMode = '".constant('DEBUG_MODE')."';
debugMode = JSON.parse(debugMode);
</script>
";

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <link rel="stylesheet" href="style/bootstrap.min.css">
    <link rel="stylesheet" href="../../css/app.css">
    <!-- use http://una.im/CSSgram/ for filters -->
    <link rel="stylesheet" href="style/cssgram.css">
    <!-- app styles -->
    <link rel="stylesheet" href="style/styles.css?random=<?php echo uniqid(); ?>">
    <!-- Vendor CSS -->
    <link href="../../vendors/bower_components/animate.css/animate.min.css" rel="stylesheet">
    <link href="../../vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel="stylesheet">
    <link href="../../vendors/bower_components/bootstrap-sweetalert/lib/sweet-alert.css" rel="stylesheet">
    <link href="../../vendors/bower_components/angular-loading-bar/build/loading-bar.min.css" rel="stylesheet">
    <link href="../../vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css" rel="stylesheet">
    <link href="../../vendors/bower_components/bootgrid/jquery.bootgrid.min.css" rel="stylesheet">
    <!-- CSS -->
    <link href="../../css/app.min.1.css?random=<?php echo uniqid(); ?>" rel="stylesheet" id="app-level">
    <link href="../../css/app.min.2.css?random=<?php echo uniqid(); ?>" rel="stylesheet">
    <link href="../../css/demo.css" rel="stylesheet">
    <link href="../../../css/brands/<?php echo $_COOKIE["corpclass"]; ?>/main.css" rel="stylesheet">
    <script src="../js/jquery.min.js"></script>
    <style>
    .actionBar{
        display: none;
    }
</style>
</head>
<body style="background-color: transparent; margin: 0 !important; background-image: none !important;">
    <div class="wrapper j-wrapper" style="position: fixed;">        
        <main class="app" id="app">
            <div class="page">
                <!-- JOIN -->
                <form class="join j-join" style="display:none;">
                    <h3 class="join__title">
                        <p>Please enter your username and chat room name.</p>
                        <p>You can join existent chat room.</p>
                        <p class="join__notice">
                            Use several browsers to simulate several users.
                        </p>
                    </h3>

                    <div class="join__body">
                        <div class="join__row">
                            <input type="text" class="join__input" name="username" placeholder="Username" autofocus required title="Field should contain alphanumeric characters only in a range 3 to 20. The first character must be a letter." pattern="^[a-zA-Z][\w]{2,19}$">
                        </div>

                        <div class="join__row">
                            <input type="text" class="join__input" name="room" placeholder="Chat room name" required title="Field should contain alphanumeric characters only in a range 3 to 15, without space. The first character must be a letter." pattern="^[a-zA-Z][a-zA-Z0-9]{2,14}$">
                        </div>

                        <div class="join__row">
                            <button type="submit" class="join__btn">Login</button>
                        </div>
                    </div>
                </form>

                <div class="dashboard j-dashboard">
                </div>
            </div>
        </main>

        <!-- SOUNDS -->
        <audio id="callingSignal" loop preload="auto">
            <source src="../audio/calling.ogg"></source>
            <source src="../audio/calling.mp3"></source>
        </audio>

        <audio id="ringtoneSignal" loop preload="auto">
            <source src="../audio/ringtone.ogg"></source>
            <source src="../audio/ringtone.mp3"></source>
        </audio>

        <audio id="endCallSignal" preload="auto">
            <source src="../audio/end_of_call.ogg"></source>
            <source src="../audio/end_of_call.mp3"></source>
        </audio>
    </div>

    <!-- MODALS -->
    <div class="modal fade" id="connect_err" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>

                    <h4>Connect to chat is failed</h4>
                </div>

                <div class="modal-body">
                    <p class="text-danger">
                        Something wrong with connect to chat. Check internet connection or user info and trying  again.
                    </p>
                </div>
                <p></p>
            </div>
        </div>
    </div>

    <div class="modal fade" id="already_auth" tabindex="-1">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Warning</h4>
                </div>

                <div class="modal-body">
                    <p class="text-danger">User has already authorized.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="error_no_calles" tabindex="-1">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Error</h4>
                </div>

                <div class="modal-body">
                    <p class="text-danger">Please choose users to call</p>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="income_call" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="j-ic-text"><strong class="j-ic_initiator"></strong></h4>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-danger j-decline" style="background-color: #d9534f !important; height: 35px !important; padding-bottom: 11px !important;"></button>
                    <button type="button" class="btn btn-default j-accept"></button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="settingsModal" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="caller__frames_media_source j-media_sources invisible">
                        <h4 class="source_label j-video_source_label">Video:</h4>
                        <select class="qb-select j-video_source"></select>

                        <h4 class="source_label j-audio_source_label">Audio:</h4>
                        <select class="qb-select j-audio_source"></select>

                        <button class="caller__ctrl_btn confirm_media j-confirm_media hidden">Confirm</button>

                    </div>
                </div>
                <div class="modal-footer ">
                        <button class="pull-right btn btn-default" id="settingsButton" onclick="$('#settingsModal').modal('hide')"> Cerrar </button>
                </div>
            </div>
        </div>
    </div>

    <!-- TEMPLATES -->
    <!-- stateBoard -->
    <script type="text/template" id="tpl_default">
        <!--QuickBlox room is <b><%= tag %></b>.
            Logged in as <b><%= name %></b>
            <button class='fw-link j-logout'>Logout</button>-->
        </script>

        <script type="text/template" id="tpl_during_call">
            <!--Login in as <b><%= name %></b>-->
        </script>

        <script type="text/template" id="tpl_device_not_found">
            Error: devices (camera or microphone) are not found.
            <!--<span class="qb-text">Login in <b>as <%=name%></b></span>
                <button class='fw-link j-logout'>Logout</button>-->
            </script>

            <script type="text/template" id="tpl_call_status">

            </script>

            <script type="text/template" id="tpl_call_stop">
                Call is stopped.&emsp;
                <!--<span class="qb-text">Login in <b>as <%=name%></b></span>
                    <button class='fw-link j-logout'>Logout</button>-->
                </script>

                <script type="text/template" id="p2p_call_stop">
                    <b><%=name%> has <%=reason%>.</b> Call is stopped.&emsp;
                    <!--Login&nbsp;in&nbsp;as&nbsp;<%=currentName%>
                        <button class='fw-link j-logout'>Logout</button>-->
                    </script>

                    <script type="text/template" id="dashboard_tpl">
                        <div class="state_board j-state_board hidden"></div>
                        <div class="dashboard__inner inner">
                            <!--<div class="users j-users_wrap"></div>-->
                            <div class="board clearfix j-board"></div>
                        </div>
                    </script>

                    <script type="text/template" id="frames_tpl">
                        <div class="row">
                            <div class="col-sm-12" style="padding-left: 0!important; padding-right: 0 !important;">
                                <div class="frames">
                                    <div class="frames__main">
                                        <div class="frames__main_timer invisible" id="timer">
                                        </div>

                                        <div class="qb-video" style="position:fixed; top:0; width: 100% !important; height: 100% !important;">
                                            <video controls id="main_video" class="frames__main_v videoResponse"></video>
                                        </div>
                                    </div>

                                    <div class="frames__callees j-callees"></div>
                                </div>
                            </div>
                            <div class="col-sm-4" style="position:fixed; width:20%; right: 0; top: 5px">
                                <div class="caller">
                                    <!--<div class="caller__ctrl">
                                        <button class="caller__ctrl_btn btn-default j-actions hidden" id="actionBtn"></button>
                                    </div>-->

                                    <h4 class="caller__name hidden">
                                        <b><%= refe %></b>
                                        <span class="j-caller_name">(<%= nameUser %>)</span>
                                    </h4>

                                    <div class="caller__frames">
                                        <div class="qb-video">
                                            <video id="localVideo" class="qb-video_source"></video>
                                        </div>

                                        <div class="caller__frames_acts" style="text-align:center;">
                                            <button class="caller__frames_acts_btn j-caller__ctrl" data-target="video">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" version="1.1">
                                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <g transform="translate(-290.000000, -80.000000)">
                                                            <g transform="translate(288.000000, 78.000000)">
                                                                <path d="M0 0L24 0 24 24 0 24 0 0Z"/>
                                                                <path class="svg_icon" d="M21 6.5L17 10.5 17 7C17 6.45 16.55 6 16 6L9.82 6 21 17.18 21 6.5 21 6.5ZM3.27 2L2 3.27 4.73 6 4 6C3.45 6 3 6.45 3 7L3 17C3 17.55 3.45 18 4 18L16 18C16.21 18 16.39 17.92 16.54 17.82L19.73 21 21 19.73 3.27 2 3.27 2Z"/>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button class="caller__frames_acts_btn j-caller__ctrl" data-target="audio">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" version="1.1">
                                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <g transform="translate(-347.000000, -80.000000)">
                                                            <g transform="translate(344.000000, 78.000000)">
                                                                <path d="M0 0L24 0 24 24 0 24 0 0Z"/>
                                                                <path class="svg_icon" d="M19 11L17.3 11C17.3 11.74 17.14 12.43 16.87 13.05L18.1 14.28C18.66 13.3 19 12.19 19 11L19 11ZM14.98 11.17C14.98 11.11 15 11.06 15 11L15 5C15 3.34 13.66 2 12 2 10.34 2 9 3.34 9 5L9 5.18 14.98 11.17 14.98 11.17ZM4.27 3L3 4.27 9.01 10.28 9.01 11C9.01 12.66 10.34 14 12 14 12.22 14 12.44 13.97 12.65 13.92L14.31 15.58C13.6 15.91 12.81 16.1 12 16.1 9.24 16.1 6.7 14 6.7 11L5 11C5 14.41 7.72 17.23 11 17.72L11 21 13 21 13 17.72C13.91 17.59 14.77 17.27 15.54 16.82L19.73 21 21 19.73 4.27 3 4.27 3Z"/>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </button>

                                            <i class="zmdi zmdi-settings setting-devices" style="cursor: pointer;" onclick="$('#settingsModal').modal('show')"> </i>

                                            <!--<button class="caller__frames_acts_btn_record j-record" alt="record video">
                                            </button>-->
                                        </div>

                                        <div class="caller__frames_source">
                                            <select class="qb-select j-source hidden">
                                            </select>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </script>

                    <script type="text/template" id="users_tpl">
                        <div class="users__title" title="Choose a user to call">
                            Choose a user to call
                            <button class="users__refresh j-users__refresh" title="click to refresh">
                                <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <g id="UI" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g id="Main" transform="translate(-435.000000, -178.000000)">
                                            <g id="ic_refresh" transform="translate(431.000000, 174.000000)">
                                                <g id="Icon-24px" sketch:type="MSShapeGroup">
                                                    <path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z" id="Shape"></path>
                                                    <path d="M17.65,6.35 C16.2,4.9 14.21,4 12,4 C7.58,4 4.01,7.58 4.01,12 C4.01,16.42 7.58,20 12,20 C15.73,20 18.84,17.45 19.73,14 L17.65,14 C16.83,16.33 14.61,18 12,18 C8.69,18 6,15.31 6,12 C6,8.69 8.69,6 12,6 C13.66,6 15.14,6.69 16.22,7.78 L13,11 L20,11 L20,4 L17.65,6.35 L17.65,6.35 Z" id="Shape" fill="#808080"></path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </button>
                        </div>

                        <div class="users__list j-users">
                        </div>
                    </script>

                    <script type="text/template" id="user_tpl">
                        <div class="users__item">
                            <button class="users__user j-user" data-id="<%= id %>" data-login="<%= login %>" data-name="<%= full_name %>">
                                <i class="user__icon"></i>
                                <span class="user__name"><%= full_name %></span>
                                <i class="users__btn_remove j-user-remove"></i>
                            </button>
                        </div>
                    </script>

                    <script type="text/template" id="callee_video">
                        <div class="frames_callee callees__callee j-callee hidden" style="width:100% !important;">
                            <div class="frames_callee__inner" style="display: none;">
                                <p class="frames_callee__status j-callee_status_<%=userID%>">
                                    <%=state%>
                                </p>

                                <div class="qb-video">
                                    <video class="j-callees__callee__video qb-video_source"
                                    id="remote_video_<%=userID%>"
                                    data-user="<%=userID%>">
                                </video>
                            </div>
                        </div>

                        <b><p class="frames_callee__name" id="DocName"><%=name%></p></b>
                    </div>
                </script>

                <!-- SCRIPT -->
                <!-- dependencies -->
                <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>-->
                <script src="../js/bootstrap.min.js"></script>
                <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>-->
                <script src="../js/underscore-min.js"></script>
                <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone-min.js"></script>-->
                <script src="../js/backbone-min.js"></script>
                <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min.js"></script>-->
                <script src="../js/bootstrap.min.js"></script>
                <script src="../../../js/translations/translation.js?random=<?php echo uniqid(); ?>"></script>

                <!-- QB -->
                <script src="../../qb/libs/quickblox.min.js?random=<?php echo uniqid(); ?>"></script>
                <script src="../../lib/logs.js?random=<?php echo uniqid(); ?>"></script>

                <!-- app -->
                <script src="../../../config/statesEnum.js?random=<?php echo uniqid(); ?>"></script>
                <script src="config-n.js?random=<?php echo uniqid(); ?>"></script>
                <script src="js/helpers-n.js?random=<?php echo uniqid(); ?>"></script>
                <script src="js/stateBoard-n.js?random=<?php echo uniqid(); ?>"></script>
                <script src="js/app-n.js?random=<?php echo uniqid(); ?>"></script>

                <!-- hack for github Pages -->
                <script>
                    var host = "quickblox.github.io";
                    if ((host == window.location.host) && (window.location.protocol != "https:"))
                        window.location.protocol = "https";
                </script>
            </body>
            </html>
