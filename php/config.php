<?php
$servername = "localhost";
$username = "root";  // Usuario por defecto de XAMPP
$password = "root";      // Contraseña por defecto (vacía)
$dbname = "fogcore_db";

// Crear conexión
$conn = new mysqli($servername, $username, $password);

// Verificar conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "✅ Connected to MySQL successfully<br>";
?>