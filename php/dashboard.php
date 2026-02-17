<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - FogCore</title>
    <style>
        body {
            background: #0f0f0f;
            color: white;
            font-family: 'Press Start 2P', cursive;
            text-align: center;
            padding: 50px;
        }
        .welcome {
            background: #222;
            padding: 30px;
            border-radius: 10px;
            margin: 20px auto;
            max-width: 600px;
        }
        .btn {
            background: #6c5ce7;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <header style="background: #222; padding: 15px;">
        <nav>
            <a href="index.html" class="btn">🏠 Home</a>
            <a href="logout.php" class="btn">🚪 Logout</a>
        </nav>
    </header>

    <div class="welcome">
        <h1>🎮 ¡Bienvenido, <?php echo htmlspecialchars($_SESSION['user_name']); ?>!</h1>
        <p>Email: <?php echo htmlspecialchars($_SESSION['user_email']); ?></p>
        <p>Has accedido a FogCore Dashboard</p>
        
        <div style="margin-top: 30px;">
            <a href="mangas.html" class="btn">📚 Biblioteca de Mangas</a>
            <a href="noticias.html" class="btn">📰 Noticias</a>
            <a href="profile.php" class="btn">👤 Perfil</a>
        </div>
    </div>
</body>
</html>