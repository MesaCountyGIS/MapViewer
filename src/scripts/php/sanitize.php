<?php
    if (isset($_POST['email'])) {
        echo filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        echo "<br/><br/>";
    }
?>