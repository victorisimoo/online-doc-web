<?php
include_once ('../config/constantes.php');
?>
<?php
    setcookie("admdron", "", time() - 3600, "/", constant('DOMAIN_BASE'), 1);
    setcookie("corpname", "", 0, "/", constant('DOMAIN_BASE'), 1);
    //echo '<script>logoutDrOnline(); </script>';
    if(empty($_GET['type'])){
        if(isset($_COOKIE["resource"])){
            if($_COOKIE["resource"]=="4385e7b559064a98bf63cd3452e04c46"){
                header('Location: midoctor.php?msisdn=LOGOUT');
            }else{
                header('Location: login.php?resource='.$_COOKIE["resource"]);
            }
        }
        else{
            header('Location: login-doc.php');
        }
    }
    else{
        if($_GET['type']=='Doctor')
        {
            header('Location: login-doc.php');
        }
        else{
            if(isset($_COOKIE["resource"])){
                if($_COOKIE["resource"]=="4385e7b559064a98bf63cd3452e04c46"){
                    header('Location: midoctor.php?msisdn=LOGOUT');
                }else{
                    header('Location: login.php?resource='.$_COOKIE["resource"]);
                }
            }
            else{
                header('Location: login-doc.php');
            }
        }
    }
?>
<script>
    function logoutDrOnline() {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '<?php echo constant('APP_ID_FACEBOOK'); ?>',
                cookie: true,
                xfbml: true,
                version: 'v2.2'
            });

            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    FB.logout(function (response) {
                        window.location.href = "<?php echo constant('URL_BASE'); ?>";
                    });
                }
                window.location.href = "<?php echo constant('URL_BASE'); ?>";
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id))
                return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
</script>