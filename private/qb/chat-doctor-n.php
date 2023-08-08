<?php
ob_start();
include_once ('../../config/constantes.php');

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
<?php header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>Dr Online - Chat privado de doctor</title>
    <link rel="shortcut icon" href="https://quickblox.com/favicon.ico">

    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="./css/doctor-style-n.css?random=<?php echo uniqid(); ?>">
    <link href="css/imageviewer.css" rel="stylesheet" type="text/css">

    <script src="https://unpkg.com/navigo@4.3.6/lib/navigo.min.js" defer></script>
    <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js" defer></script>-->
    <script src="../qb/js/underscore-min.js" defer></script>
    <script src="../lib/logs.js?random=<?php echo uniqid(); ?>" defer></script>
    <script src="libs/quickblox.min.js" defer></script>

    <!--El atributo defer mejora el tiempo de renderizado, descargando en paralelo y ejecutando al final-->
</head>
<body>
    <button id="closeViewer" class="btn btn-default" style="position: fixed; bottom: 10px; right: 10px; z-index: 1001; display: none; background-color: #dddddd !important; color: black;">Cerrar</button>
    <div id="page"></div>

    <!-- Underscore templates  -->

    <!-- Empieza Maquetado despues de hacer login -->
    <script type="text/template" id="tpl_dashboardContainer">
        <div class="dashboard"> <!--Contiene todo lo que genera QB, LA RAIZ-->
            <div class="sidebar j-sidebar active"> <!--SIDEBAR que contiene a los participantes-->
                <div class="sidebar__inner"> <!-- EMPIEZA SIDEBAR INNER que contiene a los participantes-->
                    <!--<div class="sidebar__header">EMPIEZA HEADER DE SIDEBAR
                        <a href="https://quickblox.com/" class="dashboard__logo">
                            <img src="./img/qb-logo.svg" alt="QuickBlox">
                        </a>
                        <div class="dashboard__status_wrap">
                            <p class="dashboard__status j-dashboard_status">
                                Conectado como:
                            </p>
                            <h2 class="dashboard__title"><%- user.name %></h2>
                        </div>
                        <a href="#" class="logout j-logout">logout</a>
                    </div>TERMINA HEADER DE SIDEBAR-->
                    <div class="sidebar__content"> <!--EMPIEZA CONTENT DE SIDEBAR-->
                        <ul class="sidebar__tabs">
                            <li class="sidebar__tab"  style='width: 100% !important;'>
                                <a href="#" id ="pacientHeader" style='padding: 12px;' class="sidebar__tab_link j-sidebar__tab_link <% tabName === 'chat' ? print('active') : '' %>" data-type="chat"><%- parent.translationPrefered.PATIENT_PLURAL%></a>
                            </li>
                            <li class="sidebar__tab m-sidebar__tab_new hidden" style="display: none;">
                                <a href="#!/dialog/create" class="sidebar__tab_link j-sidebar__create_dialog m-sidebar__tab_link_new" data-type="create">
                                    <i class="material-icons">add_circle_outline</i>
                                </a>
                            </li>
                        </ul>
                        <ul class="sidebar__dilog_list j-sidebar__dilog_list"> <!--ACA IMPRIME QB LA LISTA DE CHATS-->
                        </ul>
                    </div><!--TERMINA CONTENT DE SIDEBAR-->
                </div><!-- TERMINA SIDEBAR INNER que contiene a los participantes-->
            </div><!--TERMINA SIDEBAR que contiene a los participantes-->
            <div class="content j-content"><!--CONTIENE EL HISTORIAL DE CHATS, ACA LO EMBEBE-->
            </div>
        </div>
    </script>

    <script  type="text/template" id="tpl_welcome">
        <div class="content__title j-content__title j-welcome">
            Welcome to QuickBlox chat sample!
        </div>
        <div class="notifications j-notifications hidden"></div>
        <div class="content__inner j-content__inner">
            <div class="welcome__message">
                <p>Please select you opponent to start chatting.</p>
            </div>
        </div>
    </script>

    <!--ESTRUCTURA DE ITEMS DE CHATS QUE SON LOS DIALOGS -->
    <script type="text/template" id="tpl_userConversations">
        <li class="dialog__item j-dialog__item" id="<%= dialog._id %>" data-name="<%- dialog.name %>">
            <a class="dialog__item_link" href="#!/dialog/<%= dialog._id %>">
                <span class="dialog__avatar m-user__img_<%= dialog.color %> m-type_<%= dialog.type === 2 ? 'group' : 'chat' %>" >
                    <% if(dialog.type === 2) { %>
                        <i class="material-icons">supervisor_account</i>
                    <% } else { %>
                        <i class="material-icons">account_circle</i>
                    <% } %>
                </span>
                <span class="dialog__info">
                    <span class="dialog__name"><%- dialog.name %></span>
                    <span class="dialog__last_message j-dialog__last_message <%= dialog.attachment ? 'attachment' : ''%>"><%- dialog.last_message%></span>
                </span>
                <span class="dialog_additional_info">
                    <span class="dialog__last_message_date j-dialog__last_message_date">
                        <%= dialog.last_message_date_sent %>
                    </span>
                    <span class="dialog_unread_counter j-dialog_unread_counter <% !dialog.unread_messages_count ? print('hidden') : '' %>">
                        <% dialog.unread_messages_count ? print(dialog.unread_messages_count) : '' %>
                    </span>
                </span>
            </a>
        </li>
    </script>

    <!--ESTRUCTURA DEL CHAT-->
    <script type="text/template" id="tpl_conversationContainer">
        <!--EMPIEZA EL HEADER DEL CHAT-->
        <div class="content__title j-content__title j-dialog">
            <button class="open_sidebar j-open_sidebar hidden" style='visibility: hidden;'></button>
            <h1 class="dialog__title j-dialog__title"><%- title %></h1><!--IMPRIME EL NOMBRE DEL OPONENTE-->
            <div class="action_links">
                <a href="#!/dialog/<%- _id %>/edit" class="add_to_dialog j-add_to_dialog <% type !== 2 ? print('hidden') : ''%>">
                    <i class="material-icons">person_add</i>
                </a>
                <a href="#" class="quit_fom_dialog_link j-quit_fom_dialog_link" style='visibility: hidden;' data-dialog="<%- _id %>">
                    <i class="material-icons">delete</i>
                </a>
            </div>
        </div>
        <!--TERMINA EL HEADER DEL CHAT-->
        <div class="notifications j-notifications hidden"></div>
        <!-- EMPIEZA ESTRUCTURA DE CONTENDIDO DE CHAT -->
        <div class="content__inner j-content__inner">
            <div class=" messages j-messages"></div><!-- ACA SE EMBEBE EL HISTORIAL DEL CHAT -->
            <!--ESTRUCTURA DE CAJA DE TEXTO-->
            <form name="send_message" class="send_message" autocomplete="off"> 
                    <textarea name="message_feald" class="message_feald" id="message_feald" autocomplete="off"
                              autocorrect="off" spellcheck="true" autocapitalize="off"  placeholder="<%- parent.translationPrefered.CHAT_SEND_MESSAGE%>" autofocus></textarea>
                <div class="message__actions">
                    <div class="attachments_preview j-attachments_preview"></div>
                    <label for="attach_btn" class="attach_btn">
                        <i class="material-icons" style='color: black;'>attach_file</i>
                        <input type="file" id="attach_btn" name="attach_file" class="attach_input" accept="application/pdf,image/*"/>
                    </label>
                    <button class="send_btn"><%- parent.translationPrefered.SEND_MESSAGE%></button>
                </div>
            </form>
        </div>
    </script>

    <script type="text/template" id="tpl_UpdateDialogContainer">
        <div class="content__title j-content__title update_dialog__header j-update_dialog">
            <a href="#!/dialog/<%- _id %>" class="back_to_dialog j-back_to_dialog">
                <i class="material-icons">arrow_back</i>
            </a>
            <form action="#" name="update_chat_name" class="update_chat_name_form">
                <input type="text" name="update_chat__title" class="update_chat__title_input j-update_chat__title_input" value="<%- title %>" disabled>
                <button type="button" class="update_chat__title_button j-update_chat__title_button">
                    <i class="material-icons m-user_icon">create</i>
                </button>
            </form>
        </div>
        <div class="notifications j-notifications hidden"></div>
        <div class="content__inner j-content__inner">
            <p class="update__chat__description"><span class="update__chat_counter j-update__chat_counter">0</span>&nbsp;user selected:</p>
            <div class="update_chat__user_list j-update_chat__user_list">
            </div>
            <form action="" name="update_dialog" class="dialog_form m_dialog_form_update j-update_dialog_form">
                <button type="button" class="btn m-update_dialog_btn_cancel j-update_dialog_btn_cancel" name="update_dialog_cancel">cancel</button>
                <button class="btn m-update_dialog_btn j-update_dialog_btn"  type="submit" name="update_dialog_submit" disabled>add member</button>
            </form>
        </div>
    </script>

    <script type="text/template" id="tpl_editChatUser">
        <div class="user__item <% selected ? print('disabled selected') : ''%>" id="<%= id %>">
            <span class="user__avatar m-user__img_<%= color %>">
                <i class="material-icons m-user_icon">account_circle</i>
            </span>
            <div class="user__details">
                <p class="user__name"><%= name %></p>
                <% if (last_request_at) { %>
                <p class="user__last_seen"><%= last_request_at %></p>
                <% } %>
            </div>
        </div>
    </script>

    <!-- ESTRUCTURA DE CADA MENSAJE DENTRO DEL HISTORIAL -->
    <script type="text/template" id="tpl_message">
        <div class="message__wrap" id="<%= message.id %>" data-status="<%= message.status %>"> <!--ENTRA MESSAGE ID Y MESSAGE STATUS-->
            <span class="message__avatar m-user__img_<%= sender ? sender.color : 'not_loaded' %>"><!--AVATAR-->
                <img src="../img/profile-pics/1.jpg" style="width:38px;" alt="">
            </span>
            <div class="message__content"> <!--TEXTO DEL MENSAJE-->
                <div class="message__text_and_date">
                    <div class="message__text_wrap" style='padding: 6px; background-color: #eee; border-radius: 6px;'>
                        <% if (message.message) { %>
                        <p class="message__text"><%= message.message %></p>
                        <% } %>
                        <% if (message.attachments.length) { %>
                        <div class="message__attachments_wtap" style="cursor: pointer;">
                            <% _.each(message.attachments, function(attachment){ %>
                                    <a id="a<%= message.id %>" href="<%= attachment.src %>" target="_blank"> <i class="material-icons" style='color: black; font-size: 75px'>insert_drive_file</i></a>  
                                    <img id="img<%= message.id %>" src="<%= attachment.src %>" alt="attachment" class="message_attachment img-responsive gallery-items" style="cursor:pointer"
                                    onerror="$(this).hide();" onload="$('#a<%= message.id %>').hide();">                     
                            <% }); %>
                        </div>
                        <% } %>
                        <div class="message__timestamp">
                            <%= message.date_sent %>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </script>

    <!-- ESTRUCTURA DE CADA MENSAJE DENTRO DEL HISTORIAL -->
    <script type="text/template" id="tpl_message_me">
        <div class="message__wrap" id="<%= message.id %>" data-status="<%= message.status %>"> <!--ENTRA MESSAGE ID Y MESSAGE STATUS-->
            <div class="message__content" style='margin-right: 8px; text-align: right;'> <!--TEXTO DEL MENSAJE-->
                <div style="display: block; width: auto;">
                    <div class="message__text_wrap"   style='padding: 6px; background-color: #dddddd; border-radius: 6px; display: inline-block;'>
                        <% if (message.message) { %>
                        <p class="message__text_me"><%= message.message %></p>
                        <% } %>
                        <% if (message.attachments.length) { %>
                        <div class="message__attachments_wtap" style="cursor: pointer;">
                            <% _.each(message.attachments, function(attachment){ %>
                                    <a id="a<%= message.id %>" href="<%= attachment.src %>" target="_blank"> <i class="material-icons" style='color: black; font-size: 75px'>insert_drive_file</i></a>  
                                    <img id="img<%= message.id %>" src="<%= attachment.src %>" alt="attachment" class="message_attachment img-responsive gallery-items" style="cursor:pointer"
                                    onerror="$(this).hide();" onload="$('#a<%= message.id %>').hide();"> 
                            <% }); %>
                        </div>
                        <% } %>
                        <div class="message__timestamp_me" style="float: right;"> <!--TIEMPO EN EL QUE FUE RECIBIDO -->
                            <%= message.date_sent %>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="message__status j-message__status"><%= message.status %></p>
                </div>
            </div>
            <span class="message__avatar m-user__img_<%= sender ? sender.color : 'not_loaded' %>" style="margin:0px;"><!--AVATAR-->
                <img src="<%= photo %>" style="width:38px;" alt="">
            </span>
        </div>
    </script>

    <script type="text/template" id="tpl_notificationMessage">
        <div class="message__wrap" id="<%= id %>">
            <p class="m-notification_message"><%= text %></p>
        </div>
    </script>

    <script type="text/template" id="tpl_newGroupChat">
        <div class="content__title j-content__title j-create_dialog">
            <button class="back_to_dialog j-back_to_dialog">
                <i class="material-icons">arrow_back</i>
            </button>
            <h1 class="group_chat__title">New Group Chat</h1>
        </div>
        <div class="notifications j-notifications hidden"></div>
        <div class="content__inner j-content__inner">
            <p class="group__chat__description">Select participants:</p>
            <div class="group_chat__user_list j-group_chat__user_list">
            </div>
            <form action="" name="create_dialog" class="dialog_form m-dialog_form_create j-create_dialog_form">
                <input class="dialog_name" name="dialog_name" type="text"  autocomplete="off"
                       autocorrect="off" autocapitalize="off" placeholder="Add conversation name" disabled>
                <button class="btn m-create_dialog_btn j-create_dialog_btn"  type="submit" name="create_dialog_submit" disabled>create</button>
            </form>
        </div>
    </script>

    <script type="text/template" id="tpl_newGroupChatUser">
        <div class="user__item <% user.selected ? print('disabled selected') : ''%>" id="<%= user.id %>">
            <span class="user__avatar m-user__img_<%= user.color %>">
                <i class="material-icons m-user_icon">account_circle</i>
            </span>
            <div class="user__details">
                <p class="user__name"><%- user.name %></p>
                <% if (user.last_request_at) { %>
                <p class="user__last_seen"><%= user.last_request_at %></p>
                <% } %>
            </div>
        </div>
    </script>

    <script type="text/template" id="tpl_message__typing">
        <div class="message__wrap m-typing j-istyping" id="is__typing">
            <% _.each(users, function(user){  %>
                <span class="message__avatar <%- typeof user === 'number' ? 'm-typing_unknown m-typing_' + user : 'm-user__img_' + user.color %>">
                    <img src="../img/profile-pics/1.jpg" style="width:38px;" alt="">
                </span>
            <% }); %>
            <% if (users.length){ %>
            <div id="fountainG">
                <div id="fountainG_1" class="fountainG"></div>
                <div id="fountainG_2" class="fountainG"></div>
                <div id="fountainG_3" class="fountainG"></div>
            </div>
            <% } %>
        </div>
    </script>

    <script type="text/template" id="tpl_attachmentPreview">
        <div class="attachment_preview__wrap m-loading" id="<%= id %>">
            <img class="attachment_preview__item" src="<%= src %>">
        </div>
    </script>

    <script type="text/template" id="tpl_attachmentLoadError">
        <p class="attachment__error">No se pudo obtener vista previa</p>
    </script>

    <script type="text/template" id="tpl_lost_connection">
        <div class="titile">Waiting for network.</div>
        <div class="spinner"><img src="img/loader2.gif" alt="wating"></div>
    </script>

    <script type="text/template" id="tpl_loading">
        <div class="loading__wrapper">
            <div class="loading_inner">
                <!--<img class="loading__logo" src="../../css/brands/mapfre/logo.png" alt="QB_logo">-->
                <p class="loading__description"><%- parent.translationPrefered.LOADING_MSG%></p>
            </div>
        </div>
    </script>

    <script src="libs/jquery.min.js"></script>
    <script src="js/imageviewer.js?random=<?php echo uniqid(); ?>"></script>
    <script src="js-doctor/QBconfig-n.js?random=<?php echo uniqid(); ?>" defer></script>
    <script src="js-doctor/user-n.js?random=<?php echo uniqid(); ?>" defer></script>
    <script src="js-doctor/dialog-n.js?random=<?php echo uniqid(); ?>" defer></script>
    <script src="js-doctor/message-n.js?random=<?php echo uniqid(); ?>" defer></script>
    <script src="js-doctor/listeners-n.js?random=<?php echo uniqid(); ?>" defer></script>
    <script src="js-doctor/helpers-n.js?random=<?php echo uniqid(); ?>" defer></script>
    <script src="js-doctor/app-n.js?random=<?php echo uniqid(); ?>" defer></script>
    <script src="js-doctor/login-n.js?random=<?php echo uniqid(); ?>" defer></script>
    <script src="js-doctor/route-n.js?random=<?php echo uniqid(); ?>" defer></script>
    <?php ob_end_flush(); ?>
</body>
</html>
