<?php
	require("../../../config/constantes.php");
	if (isset($_FILES['image-file']['name'])) 
	{
        $relacion = getImageSize($_FILES["image-file"]["tmp_name"])[1] / getImageSize($_FILES["image-file"]["tmp_name"])[0];

        if ($_FILES["image-file"]["size"]==0)
        {
            header('Location: '.$URLBase.$webSiteName.'private/index.php#/pages/changephoto/2');
        }
        else if($relacion < 1)
        {
            header('Location: '.$URLBase.$webSiteName.'private/index.php#/pages/changephoto/4');
        }
        else if($relacion > 1.5)
        {
            header('Location: '.$URLBase.$webSiteName.'private/index.php#/pages/changephoto/3');
        }
        else if($_FILES["image-file"]["size"]>1080*1080*5)
        {
            header('Location: '.$URLBase.$webSiteName.'private/index.php#/pages/changephoto/2');
        }
        else
        {
            cwUpload('image-file',$_POST['baseURL'],$_POST["doctorId"],true,'',256,256);
            //move_uploaded_file($_FILES['image-file']['tmp_name'],$_POST['baseURL'].$_POST["doctorId"].".jpg");

            $headers = array(
            "Content-Type: application/json",
            );
            $url = constant('API_ADMIN') . 'file-item/doctor-photo/' . $_POST["doctorId"];
            $ch = curl_init();
            $doctorCV = array(
                'fileName' => $_POST["doctorId"].".jpg",
                'mimeType' => $_FILES['image-file']['type'],
                'fileSize' => $_FILES['image-file']['size'],
                'path' => $_POST["baseURL"].$_POST["doctorId"].".jpg"
            );
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($doctorCV));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            $response = curl_exec($ch);
            curl_close($ch);
            header('Location: '.$URLBase.$webSiteName.'private/index.php#/pages/changephoto/5');
        }
    }
    

    function cwUpload($field_name = '', $target_folder = '', $file_name = '', $thumb = FALSE, $thumb_folder = '', $thumb_width = '', $thumb_height = ''){

        //folder path setup
        $target_path = $target_folder;
        $thumb_path = $target_folder;
        
        //file name setup
        $filename_err = explode(".",$_FILES[$field_name]['name']);
        $filename_err_count = count($filename_err);
        $file_ext = $filename_err[$filename_err_count-1];
        $fileName = $file_name.'.jpg';
        
        //upload image path
        $upload_image = $target_path.basename($fileName);
        
        //upload image
        if(move_uploaded_file($_FILES[$field_name]['tmp_name'],$upload_image))
        {
            //thumbnail creation
            if($thumb == TRUE)
            {
                $thumbnail = $thumb_path.'thumbnail_'.$fileName;
                list($width,$height) = getimagesize($upload_image);
                $thumb_create = imagecreatetruecolor($thumb_width,$thumb_height);
                $source = imagecreatefromjpeg($upload_image);
    
                imagecopyresized($thumb_create,$source,0,0,0,0,$thumb_width,$thumb_height,$width,$height);
                imagejpeg($thumb_create,$thumbnail,100);
            }
            return $fileName;
        }
        else
        {
            return false;
        }
    }
	
?>