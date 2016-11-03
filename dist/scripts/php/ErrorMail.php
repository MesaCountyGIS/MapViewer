<?php
require_once('PHPMail/class.phpmailer.php');

$nameErr = $name = $emailErr = $email = $messageErr = $message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (empty($_POST["name"])) {
        $nameErr = "Name Missing";
    }
    else {
        $name = $_POST["name"];
    }

	if (empty($_POST["email"])) {
        $emailErr = "Missing";
    }
    else {
        $email = $_POST["email"];
    }

	if (empty($_POST["message"])) {
        $messageErr = "Missing";
    }
    else {
        $message = $_POST["message"];
    }

}

//$name = $_POST['name']; // required
$email_from = $_POST['email']; // required
//$message = $_POST['message']; // required
$to ='gis@mesacounty.us';

$mail = new PHPMailer();

$mail->IsSMTP();
$mail->SMTPAuth = false;
$mail->Host = "smtprelay.internal.mesacounty.us";
$mail->Port = 25;

$mail->SetFrom($email_from, $name);
$mail->Subject = "JSViewer Problem Reporter";
$mail->MsgHTML($message);
$mail->AddAddress($to);

if($mail->Send()) {
  echo "Message sent!";
} else {
  echo "Mailer Error: " . $mail->ErrorInfo;
}
?>