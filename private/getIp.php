<?php
        $ip = $_SERVER['REMOTE_ADDR'];

        if (empty($ip) && !empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            // omit private IP addresses which a proxy forwarded
            $tmpIp = $_SERVER['HTTP_X_FORWARDED_FOR'];
            $tmpIp = filter_var(
                $tmpIp,
                FILTER_VALIDATE_IP,
                FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
            );
            if ($tmpIp != false) {
                $ip = $tmpIp;
            }
        }
        echo $ip;
?>