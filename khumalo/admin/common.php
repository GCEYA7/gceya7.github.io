<?php
// Admin configuration
define('ADMIN_PASSWORD', 'khumalo2026'); // Change this to a strong password
define('CONTENT_FILE', __DIR__ . '/../content.json');
define('UPLOAD_DIR', __DIR__ . '/../assets/images/');
define('VIDEO_UPLOAD_DIR', __DIR__ . '/../assets/videos/');
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);
define('ALLOWED_VIDEO_TYPES', ['video/mp4', 'video/webm', 'video/quicktime']);

// Session start
session_start();

// Helper functions
function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

function loadContent() {
    if (!file_exists(CONTENT_FILE)) {
        return ['gallery' => ['categories' => []]];
    }
    $json = file_get_contents(CONTENT_FILE);
    return json_decode($json, true);
}

function saveContent($data) {
    $data['lastUpdated'] = date('c');
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    return file_put_contents(CONTENT_FILE, $json);
}

function sanitizeFilename($filename) {
    // Remove path components
    $filename = basename($filename);
    // Replace spaces and special chars
    $filename = preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);
    // Prevent multiple dots
    $filename = preg_replace('/\.+/', '.', $filename);
    return $filename;
}

function generateUniqueFilename($dir, $filename) {
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    $base = pathinfo($filename, PATHINFO_FILENAME);
    $counter = 1;
    $newName = $filename;
    while (file_exists($dir . $newName)) {
        $newName = $base . '_' . $counter . '.' . $ext;
        $counter++;
    }
    return $newName;
}

function formatFileSize($bytes) {
    if ($bytes >= 1048576) return number_format($bytes / 1048576, 2) . ' MB';
    if ($bytes >= 1024) return number_format($bytes / 1024, 2) . ' KB';
    return $bytes . ' bytes';
}

// Get categories for navigation
$categories = [];
if (file_exists(CONTENT_FILE)) {
    $content = loadContent();
    $categories = $content['gallery']['categories'] ?? [];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Khumalo Construction - Admin Panel</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; line-height: 1.6; }
        .admin-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #ddd; margin-bottom: 30px; }
        .admin-header h1 { font-size: 1.5rem; color: #d4a843; }
        .btn { padding: 10px 20px; border-radius: 4px; font-weight: 600; cursor: pointer; border: none; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .btn-primary { background: #d4a843; color: #1a1a1a; }
        .btn-primary:hover { background: #b8922e; }
        .btn-danger { background: #e74c3c; color: white; }
        .btn-danger:hover { background: #c0392b; }
        .btn-secondary { background: #666; color: white; }
        .btn-secondary:hover { background: #555; }
        .btn-orange { background: #e67e22; color: white; border-color: #e67e22; }
        .btn-orange:hover { background: #d35400; }

        .card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); margin-bottom: 24px; overflow: hidden; }
        .card-header { padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .card-header h2 { font-size: 1.1rem; color: #333; }
        .card-body { padding: 20px; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-weight: 600; margin-bottom: 6px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #d4a843; box-shadow: 0 0 0 3px rgba(212,168,67,0.1); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }

        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .media-item { border: 1px solid #eee; border-radius: 8px; overflow: hidden; background: white; position: relative; }
        .media-item img, .media-item video { width: 100%; height: 150px; object-fit: cover; }
        .media-item video { background: #000; }
        .media-info { padding: 12px; }
        .media-info .caption { font-weight: 600; font-size: 0.85rem; margin-bottom: 4px; }
        .media-info .meta { font-size: 0.75rem; color: #888; }
        .media-actions { position: absolute; top: 8px; right: 8px; display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; }
        .media-item:hover .media-actions { opacity: 1; }
        .media-actions button { width: 28px; height: 28px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; }

        .category-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .category-tab { padding: 10px 16px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: white; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; }
        .category-tab:hover { border-color: #d4a843; color: #d4a843; }
        .category-tab.active { background: #d4a843; color: #1a1a1a; border-color: #d4a843; }
        .category-tab.video-tab { border-color: #e67e22; color: #e67e22; }
        .category-tab.video-tab.active { background: #e67e22; color: white; border-color: #e67e22; }
        .category-tab.video-tab:hover { background: #e67e22; color: white; }

        .login-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); }
        .login-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); width: 100%; max-width: 400px; }
        .login-box h1 { color: #d4a843; margin-bottom: 8px; }
        .login-box .subtitle { color: #888; margin-bottom: 24px; }
        .login-box .form-group { margin-bottom: 20px; }
        .login-box input { width: 100%; padding: 14px; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
        .login-box button { width: 100%; padding: 14px; background: #d4a843; color: #1a1a1a; border: none; border-radius: 4px; font-weight: 600; font-size: 1rem; cursor: pointer; }
        .login-box button:hover { background: #b8922e; }
        .error-message { background: #fee; color: #c00; padding: 12px; border-radius: 4px; margin-bottom: 20px; border: 1px solid #fcc; }
        .success-message { background: #efe; color: #060; padding: 12px; border-radius: 4px; margin-bottom: 20px; border: 1px solid #cfc; }

        .tab-content { display: none; }
        .tab-content.active { display: block; }

        .upload-zone { border: 2px dashed #ddd; border-radius: 8px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .upload-zone:hover, .upload-zone.dragover { border-color: #d4a843; background: #fdfbf7; }
        .upload-zone input { display: none; }
        .upload-zone p { color: #888; margin-top: 12px; }
        .preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-top: 16px; }
        .preview-item { position: relative; aspect-ratio: 1; border-radius: 4px; overflow: hidden; border: 1px solid #eee; }
        .preview-item img, .preview-item video { width: 100%; height: 100%; object-fit: cover; }
        .preview-item .remove { position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; background: rgba(231,76,60,0.9); color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 14px; line-height: 1; }

        .settings-section { margin-bottom: 30px; }
        .settings-section h3 { margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #eee; }

        .json-viewer { background: #1a1a1a; color: #e5e5e5; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; max-height: 500px; overflow: auto; white-space: pre; }

        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .stat-card .number { font-size: 2rem; font-weight: 700; color: #d4a843; }
        .stat-card .label { font-size: 0.85rem; color: #888; margin-top: 4px; }

        .alert { padding: 12px 16px; border-radius: 4px; margin-bottom: 20px; }
        .alert-error { background: #fee; color: #c00; border: 1px solid #fcc; }
        .alert-success { background: #efe; color: #060; border: 1px solid #cfc; }
    </style>
</head>
<body>
    <?php if (basename($_SERVER['PHP_SELF']) !== 'login.php'): ?>
    <div class="admin-container">
        <header class="admin-header">
            <h1>Khumalo Construction Admin</h1>
            <div style="display: flex; gap: 12px; align-items: center;">
                <a href="../index.html" target="_blank" class="btn btn-secondary" style="font-size: 0.85rem;">View Site</a>
                <a href="logout.php" class="btn btn-danger" style="font-size: 0.85rem;">Logout</a>
            </div>
        </header>
    <?php endif; ?>
</body>
</html>