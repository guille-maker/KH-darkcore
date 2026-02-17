<?php
session_start();
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    
    $errors = [];
    
    if (empty($email) || empty($password)) {
        $errors[] = "Email y contraseña son obligatorios";
    }
    
    if (empty($errors)) {
        $conn->select_db($dbname);
        
        $stmt = $conn->prepare("SELECT id, nombre, email, password FROM usuarios WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows == 1) {
            $stmt->bind_result($id, $nombre, $db_email, $hashed_password);
            $stmt->fetch();
            
            if (password_verify($password, $hashed_password)) {
                // Login exitoso
                $_SESSION['user_id'] = $id;
                $_SESSION['user_name'] = $nombre;
                $_SESSION['user_email'] = $db_email;
                
                header("Location: dashboard.php");
                exit();
            } else {
                $errors[] = "Contraseña incorrecta";
            }
        } else {
            $errors[] = "Usuario no encontrado";
        }
        
        $stmt->close();
    }
    
    // Mostrar errores
    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<div class='error'>❌ $error</div>";
        }
        echo "<p><a href='login.html'>Volver al login</a></p>";
    }
}

$conn->close();
?>