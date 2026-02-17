<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $telefono = trim($_POST['telefono']);
    $password = $_POST['password'];
    $confirm = $_POST['confirm'];
    
    // Validaciones
    $errors = [];
    
    if (empty($nombre) || empty($email) || empty($telefono) || empty($password)) {
        $errors[] = "Todos los campos son obligatorios";
    }
    
    if ($password !== $confirm) {
        $errors[] = "Las contraseñas no coinciden";
    }
    
    if (strlen($password) < 8) {
        $errors[] = "La contraseña debe tener al menos 8 caracteres";
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "El formato del email no es válido";
    }
    
    // Si no hay errores, proceder con el registro
    if (empty($errors)) {
        $conn->select_db($dbname);
        
        // Verificar si el email ya existe
        $check_email = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
        $check_email->bind_param("s", $email);
        $check_email->execute();
        $check_email->store_result();
        
        if ($check_email->num_rows > 0) {
            $errors[] = "El email ya está registrado";
        } else {
            // Hash de la contraseña
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            // Insertar usuario
            $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $nombre, $email, $telefono, $hashed_password);
            
            if ($stmt->execute()) {
                echo "<div class='success'>✅ Usuario registrado exitosamente</div>";
                echo "<p><a href='login.html'>Iniciar Sesión</a></p>";
            } else {
                $errors[] = "Error al registrar usuario: " . $conn->error;
            }
            
            $stmt->close();
        }
        $check_email->close();
    }
    
    // Mostrar errores si los hay
    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<div class='error'>❌ $error</div>";
        }
    }
}

$conn->close();
?>