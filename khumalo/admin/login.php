<?php
require_once 'common.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    if ($password === ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        header('Location: index.php');
        exit;
    } else {
        $error = 'Invalid password. Please try again.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Khumalo Construction</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); color: #333; line-height: 1.6; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .login-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); width: 100%; max-width: 400px; }
        .login-box h1 { color: #d4a843; margin-bottom: 8px; text-align: center; }
        .login-box .subtitle { color: #888; margin-bottom: 24px; text-align: center; font-size: 0.9rem; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-weight: 600; margin-bottom: 6px; }
        .form-group input { width: 100%; padding: 14px; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
        .form-group input:focus { outline: none; border-color: #d4a843; box-shadow: 0 0 0 3px rgba(212,168,67,0.1); }
        .login-box button { width: 100%; padding: 14px; background: #d4a843; color: #1a1a1a; border: none; border-radius: 4px; font-weight: 600; font-size: 1rem; cursor: pointer; }
        .login-box button:hover { background: #b8922e; }
        .error-message { background: #fee; color: #c00; padding: 12px; border-radius: 4px; margin-bottom: 20px; border: 1px solid #fcc; text-align: center; }
        .success-message { background: #efe; color: #060; padding: 12px; border-radius: 4px; margin-bottom: 20px; border: 1px solid #cfc; text-align: center; }
        .footer-note { text-align: center; margin-top: 24px; color: #888; font-size: 0.8rem; }
    </style>
</head>
<body>
    <div class="login-box">
        <h1>Khumalo Construction</h1>
        <p class="subtitle">Admin Panel Login</p>
        
        <?php if ($error): ?>
            <div class="error-message"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>
        
        <?php if ($success): ?>
            <div class="success-message"><?= htmlspecialchars($success) ?></div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>
            <button type="submit">Sign In</button>
        </form>
        
        <p class="footer-note">Secure access for content management</p>
    </div>
</body>
</html>