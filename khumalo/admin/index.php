<?php
require_once 'common.php';
requireLogin();

$content = loadContent();
$categories = $content['gallery']['categories'] ?? [];
$activeCategory = $_GET['category'] ?? ($categories[0]['id'] ?? 'residential-construction');
$messages = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'add_category':
                $newCat = [
                    'id' => strtolower(preg_replace('/[^a-z0-9]+/', '-', $_POST['name'])),
                    'name' => $_POST['name'],
                    'icon' => $_POST['icon'] ?? 'image',
                    'type' => $_POST['type'] ?? 'images',
                    'color' => $_POST['color'] ?? '',
                    'items' => []
                ];
                $categories[] = $newCat;
                $content['gallery']['categories'] = $categories;
                saveContent($content);
                $messages[] = ['type' => 'success', 'text' => 'Category added successfully'];
                $activeCategory = $newCat['id'];
                break;
                
            case 'delete_category':
                $catId = $_POST['category_id'];
                $categories = array_filter($categories, fn($c) => $c['id'] !== $catId);
                $content['gallery']['categories'] = array_values($categories);
                saveContent($content);
                $messages[] = ['type' => 'success', 'text' => 'Category deleted'];
                $activeCategory = $categories[0]['id'] ?? 'residential-construction';
                break;
                
            case 'update_category':
                $catId = $_POST['category_id'];
                foreach ($categories as &$cat) {
                    if ($cat['id'] === $catId) {
                        $cat['name'] = $_POST['name'];
                        $cat['icon'] = $_POST['icon'];
                        $cat['type'] = $_POST['type'];
                        $cat['color'] = $_POST['color'];
                        break;
                    }
                }
                $content['gallery']['categories'] = $categories;
                saveContent($content);
                $messages[] = ['type' => 'success', 'text' => 'Category updated'];
                break;
                
            case 'reorder_categories':
                $order = json_decode($_POST['order'], true);
                $reordered = [];
                foreach ($order as $id) {
                    foreach ($categories as $cat) {
                        if ($cat['id'] === $id) {
                            $reordered[] = $cat;
                            break;
                        }
                    }
                }
                $content['gallery']['categories'] = $reordered;
                saveContent($content);
                $messages[] = ['type' => 'success', 'text' => 'Order saved'];
                header('Location: index.php?category=' . $activeCategory);
                exit;
                break;
        }
    }
    
    // Handle file uploads
    if (isset($_FILES['media_files'])) {
        $cat = null;
        foreach ($categories as $c) {
            if ($c['id'] === $activeCategory) { $cat = &$c; break; }
        }
        
        if ($cat) {
            $uploadDir = $cat['type'] === 'videos' ? VIDEO_UPLOAD_DIR : UPLOAD_DIR;
            $allowedTypes = $cat['type'] === 'videos' ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
            
            $files = $_FILES['media_files'];
            $count = count($files['name']);
            
            for ($i = 0; $i < $count; $i++) {
                if ($files['error'][$i] !== UPLOAD_ERR_OK) continue;
                
                $tmpName = $files['tmp_name'][$i];
                $origName = sanitizeFilename($files['name'][$i]);
                $fileSize = $files['size'][$i];
                $mimeType = mime_content_type($tmpName);
                
                if (!in_array($mimeType, $allowedTypes)) {
                    $messages[] = ['type' => 'error', 'text' => "File '$origName' has an unsupported type."];
                    continue;
                }
                
                if ($fileSize > MAX_FILE_SIZE) {
                    $messages[] = ['type' => 'error', 'text' => "File '$origName' exceeds maximum size."];
                    continue;
                }
                
                $uniqueName = generateUniqueFilename($uploadDir, $origName);
                $destPath = $uploadDir . $uniqueName;
                
                if (move_uploaded_file($tmpName, $destPath)) {
                    $relPath = ($cat['type'] === 'videos' ? 'assets/videos/' : 'assets/images/') . $uniqueName;
                    $cat['items'][] = [
                        'src' => $relPath,
                        'alt' => pathinfo($origName, PATHINFO_FILENAME),
                        'caption' => '',
                        'poster' => $cat['type'] === 'videos' ? 'assets/images/img1.jpg' : ''
                    ];
                    $messages[] = ['type' => 'success', 'text' => "Uploaded: $origName"];
                } else {
                    $messages[] = ['type' => 'error', 'text' => "Failed to upload: $origName"];
                }
            }
            $content['gallery']['categories'] = $categories;
            saveContent($content);
        }
    }
    
    // Handle item updates
    if (isset($_POST['item_action'])) {
        $cat = null;
        foreach ($categories as $c) {
            if ($c['id'] === $activeCategory) { $cat = &$c; break; }
        }
        
        if ($cat && isset($_POST['item_index'])) {
            $idx = (int)$_POST['item_index'];
            if (isset($cat['items'][$idx])) {
                switch ($_POST['item_action']) {
                    case 'update':
                        $cat['items'][$idx]['alt'] = $_POST['alt'] ?? '';
                        $cat['items'][$idx]['caption'] = $_POST['caption'] ?? '';
                        if ($cat['type'] === 'videos' && isset($_POST['poster'])) {
                            $cat['items'][$idx]['poster'] = $_POST['poster'];
                        }
                        $messages[] = ['type' => 'success', 'text' => 'Item updated'];
                        break;
                    case 'delete':
                        // Delete file from disk
                        $filePath = __DIR__ . '/../' . $cat['items'][$idx]['src'];
                        if (file_exists($filePath)) unlink($filePath);
                        if ($cat['type'] === 'videos' && !empty($cat['items'][$idx]['poster'])) {
                            $posterPath = __DIR__ . '/../' . $cat['items'][$idx]['poster'];
                            // Don't delete poster as it might be shared
                        }
                        array_splice($cat['items'], $idx, 1);
                        $messages[] = ['type' => 'success', 'text' => 'Item deleted'];
                        break;
                    case 'reorder':
                        $newOrder = json_decode($_POST['new_order'], true);
                        $reordered = [];
                        foreach ($newOrder as $i) {
                            if (isset($cat['items'][$i])) $reordered[] = $cat['items'][$i];
                        }
                        $cat['items'] = $reordered;
                        $messages[] = ['type' => 'success', 'text' => 'Order updated'];
                        break;
                }
                $content['gallery']['categories'] = $categories;
                saveContent($content);
            }
        }
    }
}

// Reload after POST
$content = loadContent();
$categories = $content['gallery']['categories'] ?? [];
$activeCatData = null;
foreach ($categories as $cat) {
    if ($cat['id'] === $activeCategory) { $activeCatData = $cat; break; }
}
if (!$activeCatData && $categories) {
    $activeCategory = $categories[0]['id'];
    $activeCatData = $categories[0];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Khumalo Construction</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; line-height: 1.6; }
        .admin-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #ddd; margin-bottom: 30px; flex-wrap: wrap; gap: 16px; }
        .admin-header h1 { font-size: 1.5rem; color: #d4a843; }
        .btn { padding: 10px 20px; border-radius: 4px; font-weight: 600; cursor: pointer; border: none; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; font-size: 0.85rem; }
        .btn-primary { background: #d4a843; color: #1a1a1a; }
        .btn-primary:hover { background: #b8922e; }
        .btn-danger { background: #e74c3c; color: white; }
        .btn-danger:hover { background: #c0392b; }
        .btn-secondary { background: #666; color: white; }
        .btn-secondary:hover { background: #555; }
        .btn-orange { background: #e67e22; color: white; border-color: #e67e22; }
        .btn-orange:hover { background: #d35400; }
        .btn-small { padding: 6px 12px; font-size: 0.75rem; }

        .card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); margin-bottom: 24px; overflow: hidden; }
        .card-header { padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .card-header h2 { font-size: 1.1rem; color: #333; }
        .card-body { padding: 20px; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-weight: 600; margin-bottom: 6px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #d4a843; box-shadow: 0 0 0 3px rgba(212,168,67,0.1); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }

        .category-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .category-tab { padding: 10px 16px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: white; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; }
        .category-tab:hover { border-color: #d4a843; color: #d4a843; }
        .category-tab.active { background: #d4a843; color: #1a1a1a; border-color: #d4a843; }
        .category-tab.video-tab { border-color: #e67e22; color: #e67e22; }
        .category-tab.video-tab.active { background: #e67e22; color: white; border-color: #e67e22; }
        .category-tab.video-tab:hover { background: #e67e22; color: white; }

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
        .edit-btn { background: #3498db; color: white; }
        .delete-btn { background: #e74c3c; color: white; }

        .upload-zone { border: 2px dashed #ddd; border-radius: 8px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 20px; }
        .upload-zone:hover, .upload-zone.dragover { border-color: #d4a843; background: #fdfbf7; }
        .upload-zone input { display: none; }
        .upload-zone p { color: #888; margin-top: 12px; }
        .upload-zone.dragover { border-color: #d4a843; background: #fdfbf7; }
        .preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-top: 16px; }
        .preview-item { position: relative; aspect-ratio: 1; border-radius: 4px; overflow: hidden; border: 1px solid #eee; }
        .preview-item img, .preview-item video { width: 100%; height: 100%; object-fit: cover; }
        .preview-item .remove { position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; background: rgba(231,76,60,0.9); color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 14px; line-height: 1; }

        .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; padding: 20px; }
        .modal.active { display: flex; }
        .modal-content { background: white; border-radius: 8px; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; }
        .modal-header { padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .modal-body { padding: 20px; }
        .modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; }

        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .stat-card .number { font-size: 2rem; font-weight: 700; color: #d4a843; }
        .stat-card .label { font-size: 0.85rem; color: #888; margin-top: 4px; }

        .alert { padding: 12px 16px; border-radius: 4px; margin-bottom: 20px; }
        .alert-error { background: #fee; color: #c00; border: 1px solid #fcc; }
        .alert-success { background: #efe; color: #060; border: 1px solid #cfc; }

        .item-editor { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
        .item-editor h4 { margin-bottom: 12px; }
        .drag-handle { cursor: grab; color: #888; margin-right: 8px; }
        .drag-handle:active { cursor: grabbing; }
        
        .json-viewer { background: #1a1a1a; color: #e5e5e5; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; max-height: 500px; overflow: auto; white-space: pre; }
        
        .category-list { display: flex; flex-direction: column; gap: 8px; }
        .category-row { display: flex; align-items: center; gap: 12px; padding: 12px; background: white; border: 1px solid #eee; border-radius: 6px; }
        .category-row.dragging { opacity: 0.5; }
        .cat-drag { cursor: grab; color: #888; }
        .cat-info { flex: 1; }
        .cat-name { font-weight: 600; }
        .cat-meta { font-size: 0.8rem; color: #888; }
        .cat-type { font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; background: #eee; }
        .cat-type.video { background: #ffeedd; color: #e67e22; border: 1px solid #e67e22; }
    </style>
</head>
<body>
    <div class="admin-container">
        <header class="admin-header">
            <h1>Khumalo Construction Admin</h1>
            <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <a href="../index.html" target="_blank" class="btn btn-secondary">View Live Site</a>
                <a href="logout.php" class="btn btn-danger">Logout</a>
            </div>
        </header>

        <?php foreach ($messages as $msg): ?>
            <div class="alert alert-<?= $msg['type'] ?>"><?= htmlspecialchars($msg['text']) ?></div>
        <?php endforeach; ?>

        <!-- Stats Overview -->
        <div class="stats">
            <div class="stat-card">
                <div class="number"><?= count($categories) ?></div>
                <div class="label">Categories</div>
            </div>
            <div class="stat-card">
                <div class="number"><?= array_sum(array_map(fn($c) => count($c['items']), $categories)) ?></div>
                <div class="label">Total Media Items</div>
            </div>
            <div class="stat-card">
                <div class="number"><?= array_sum(array_map(fn($c) => count(array_filter($c['items'], fn($i) => str_ends_with($i['src'], '.mp4') || str_ends_with($i['src'], '.webm'))), $categories)) ?></div>
                <div class="label">Videos</div>
            </div>
            <div class="stat-card">
                <div class="number"><?= array_sum(array_map(fn($c) => count(array_filter($c['items'], fn($i) => str_ends_with($i['src'], '.jpg') || str_ends_with($i['src'], '.jpeg') || str_ends_with($i['src'], '.png') || str_ends_with($i['src'], '.webp'))), $categories)) ?></div>
                <div class="label">Images</div>
            </div>
        </div>

        <!-- Category Management -->
        <div class="card">
            <div class="card-header">
                <h2>Gallery Categories</h2>
                <button class="btn btn-primary" onclick="openModal('addCategoryModal')">Add Category</button>
            </div>
            <div class="card-body">
                <div class="category-list" id="categoryList">
                    <?php foreach ($categories as $index => $cat): ?>
                        <div class="category-row" data-id="<?= htmlspecialchars($cat['id']) ?>" draggable="true">
                            <span class="cat-drag">⋮⋮</span>
                            <div class="cat-info">
                                <div class="cat-name"><?= htmlspecialchars($cat['name']) ?></div>
                                <div class="cat-meta">
                                    <span class="cat-type <?= $cat['type'] === 'videos' ? 'video' : '' ?>">
                                        <?= ucfirst($cat['type']) ?>
                                    </span>
                                    • <?= count($cat['items']) ?> items
                                    • ID: <code style="font-size: 0.7rem;"><?= htmlspecialchars($cat['id']) ?></code>
                                </div>
                            </div>
                            <a href="?category=<?= urlencode($cat['id']) ?>" class="btn btn-small <?= $cat['id'] === $activeCategory ? 'btn-primary' : 'btn-secondary' ?>">Manage</a>
                            <button class="btn btn-small btn-secondary" onclick="editCategory(<?= json_encode($cat) ?>)">Edit</button>
                            <form method="POST" style="display: inline;" onsubmit="return confirm('Delete this category and all its media?')">
                                <input type="hidden" name="action" value="delete_category">
                                <input type="hidden" name="category_id" value="<?= htmlspecialchars($cat['id']) ?>">
                                <button type="submit" class="btn btn-small btn-danger">Delete</button>
                            </form>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <?php if ($activeCatData): ?>
        <!-- Media Management for Active Category -->
        <div class="card">
            <div class="card-header">
                <h2>Media: <?= htmlspecialchars($activeCatData['name']) ?>
                    <?php if ($activeCatData['type'] === 'videos'): ?>
                        <span class="cat-type video" style="font-size: 0.7rem; margin-left: 8px;">Video Category</span>
                    <?php endif; ?>
                </h2>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button class="btn btn-primary" onclick="document.getElementById('mediaUpload').click()">Upload Media</button>
                    <input type="file" id="mediaUpload" name="media_files[]" multiple accept="<?= $activeCatData['type'] === 'videos' ? 'video/mp4,video/webm,video/quicktime' : 'image/*' ?>" style="display: none;" onchange="uploadFiles(this)">
                </div>
            </div>
            <div class="card-body">
                <form method="POST" enctype="multipart/form-data" id="uploadForm">
                    <input type="hidden" name="action" value="upload">
                    <div class="upload-zone" id="dropZone">
                        <p>Drag & drop <?= $activeCatData['type'] === 'videos' ? 'videos' : 'images' ?> here, or click to browse</p>
                        <p style="font-size: 0.8rem; color: #aaa;">Max 50MB per file. Allowed: <?= $activeCatData['type'] === 'videos' ? 'MP4, WebM, MOV' : 'JPG, PNG, WebP' ?></p>
                        <input type="file" name="media_files[]" multiple accept="<?= $activeCatData['type'] === 'videos' ? 'video/mp4,video/webm,video/quicktime' : 'image/*' ?>" id="fileInput" style="display: none;">
                    </div>
                </form>

                <div class="media-grid" id="mediaGrid">
                    <?php if (empty($activeCatData['items'])): ?>
                        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #888;">
                            No media uploaded yet. Click "Upload Media" to add <?= $activeCatData['type'] === 'videos' ? 'videos' : 'images' ?>.
                        </div>
                    <?php else: ?>
                        <?php foreach ($activeCatData['items'] as $idx => $item): ?>
                            <div class="media-item" data-index="<?= $idx ?>">
                                <?php if ($activeCatData['type'] === 'videos'): ?>
                                    <video src="../<?= htmlspecialchars($item['src']) ?>" controls preload="metadata" poster="../<?= htmlspecialchars($item['poster'] ?? '') ?>"></video>
                                <?php else: ?>
                                    <img src="../<?= htmlspecialchars($item['src']) ?>" alt="<?= htmlspecialchars($item['alt']) ?>" loading="lazy">
                                <?php endif; ?>
                                <div class="media-actions">
                                    <button class="edit-btn" onclick="editItem(<?= $idx ?>, <?= json_encode($item) ?>)" title="Edit">✎</button>
                                    <form method="POST" style="display: inline;" onsubmit="return confirm('Delete this item?')">
                                        <input type="hidden" name="item_action" value="delete">
                                        <input type="hidden" name="item_index" value="<?= $idx ?>">
                                        <button type="submit" class="delete-btn" title="Delete">🗑</button>
                                    </form>
                                </div>
                                <div class="media-info">
                                    <div class="caption"><?= htmlspecialchars($item['caption'] ?: $item['alt']) ?></div>
                                    <div class="meta"><?= basename($item['src']) ?> • <?= formatFileSize(filesize(__DIR__ . '/../' . $item['src'])) ?></div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
                
                <?php if (!empty($activeCatData['items'])): ?>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                        <button type="button" class="btn btn-secondary" onclick="saveMediaOrder()">Save Order</button>
                        <span style="margin-left: 12px; color: #888; font-size: 0.85rem;">Drag items to reorder, then click Save Order</span>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <?php endif; ?>

        <!-- Add Category Modal -->
        <div class="modal" id="addCategoryModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add New Category</h3>
                    <button class="modal-close" onclick="closeModal('addCategoryModal')">&times;</button>
                </div>
                <form method="POST" class="modal-body">
                    <input type="hidden" name="action" value="add_category">
                    <div class="form-group">
                        <label>Category Name</label>
                        <input type="text" name="name" required placeholder="e.g., Residential Construction">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Icon</label>
                            <select name="icon">
                                <option value="home">🏠 Home</option>
                                <option value="hammer">🔨 Hammer</option>
                                <option value="palette">🎨 Palette</option>
                                <option value="video">🎥 Video</option>
                                <option value="image">🖼 Image</option>
                                <option value="tools">🛠 Tools</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Type</label>
                            <select name="type" id="catType">
                                <option value="images">Images</option>
                                <option value="videos">Videos</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Accent Color (optional)</label>
                        <input type="color" name="color" value="#d4a843">
                        <small style="color: #888;">Leave default for gold, use #e67e22 for orange (videos)</small>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Create Category</button>
                </form>
            </div>
        </div>

        <!-- Edit Category Modal -->
        <div class="modal" id="editCategoryModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Category</h3>
                    <button class="modal-close" onclick="closeModal('editCategoryModal')">&times;</button>
                </div>
                <form method="POST" class="modal-body" id="editCategoryForm">
                    <input type="hidden" name="action" value="update_category">
                    <input type="hidden" name="category_id" id="editCatId">
                    <div class="form-group">
                        <label>Category Name</label>
                        <input type="text" name="name" id="editCatName" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Icon</label>
                            <select name="icon" id="editCatIcon">
                                <option value="home">🏠 Home</option>
                                <option value="hammer">🔨 Hammer</option>
                                <option value="palette">🎨 Palette</option>
                                <option value="video">🎥 Video</option>
                                <option value="image">🖼 Image</option>
                                <option value="tools">🛠 Tools</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Type</label>
                            <select name="type" id="editCatType">
                                <option value="images">Images</option>
                                <option value="videos">Videos</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Accent Color</label>
                        <input type="color" name="color" id="editCatColor" value="#d4a843">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Save Changes</button>
                </form>
            </div>
        </div>

        <!-- Edit Item Modal -->
        <div class="modal" id="editItemModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Media Item</h3>
                    <button class="modal-close" onclick="closeModal('editItemModal')">&times;</button>
                </div>
                <form method="POST" class="modal-body" id="editItemForm">
                    <input type="hidden" name="item_action" value="update">
                    <input type="hidden" name="item_index" id="editItemIndex">
                    <div class="form-group">
                        <label>Alt Text</label>
                        <input type="text" name="alt" id="editItemAlt" required>
                    </div>
                    <div class="form-group">
                        <label>Caption</label>
                        <textarea name="caption" id="editItemCaption" rows="3"></textarea>
                    </div>
                    <div class="form-group" id="editItemPosterGroup" style="display: none;">
                        <label>Poster Image (for videos)</label>
                        <input type="text" name="poster" id="editItemPoster" placeholder="assets/images/filename.jpg">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Save Changes</button>
                </form>
            </div>
        </div>

        <!-- JSON Viewer Modal -->
        <div class="modal" id="jsonModal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>Raw JSON Data (content.json)</h3>
                    <button class="modal-close" onclick="closeModal('jsonModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="json-viewer" id="jsonViewer"></div>
                    <button class="btn btn-primary" onclick="copyJson()" style="margin-top: 16px;">Copy to Clipboard</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Category tabs
        const activeCategory = '<?= $activeCategory ?>';
        
        // Drag and drop for category reordering
        const categoryList = document.getElementById('categoryList');
        let draggedCategory = null;

        categoryList.querySelectorAll('.category-row').forEach(row => {
            row.addEventListener('dragstart', (e) => {
                draggedCategory = row;
                row.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            row.addEventListener('dragend', () => {
                row.classList.remove('dragging');
                draggedCategory = null;
            });
            row.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            row.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedCategory && draggedCategory !== row) {
                    const allRows = [...categoryList.querySelectorAll('.category-row')];
                    const fromIndex = allRows.indexOf(draggedCategory);
                    const toIndex = allRows.indexOf(row);
                    if (fromIndex < toIndex) {
                        row.parentNode.insertBefore(draggedCategory, row.nextSibling);
                    } else {
                        row.parentNode.insertBefore(draggedCategory, row);
                    }
                }
            });
        });

        // Save category order
        function saveCategoryOrder() {
            const order = [...categoryList.querySelectorAll('.category-row')].map(r => r.dataset.id);
            const form = document.createElement('form');
            form.method = 'POST';
            form.innerHTML = '<input name="action" value="reorder_categories"><input name="order" value="' + JSON.stringify(order) + '">';
            document.body.appendChild(form);
            form.submit();
        }

        // Media drag and drop reordering
        const mediaGrid = document.getElementById('mediaGrid');
        let draggedMedia = null;

        mediaGrid.querySelectorAll('.media-item').forEach(item => {
            item.setAttribute('draggable', 'true');
            item.addEventListener('dragstart', (e) => {
                draggedMedia = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                draggedMedia = null;
            });
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedMedia && draggedMedia !== item) {
                    const allItems = [...mediaGrid.querySelectorAll('.media-item')];
                    const fromIndex = allItems.indexOf(draggedMedia);
                    const toIndex = allItems.indexOf(item);
                    if (fromIndex < toIndex) {
                        item.parentNode.insertBefore(draggedMedia, item.nextSibling);
                    } else {
                        item.parentNode.insertBefore(draggedMedia, item);
                    }
                }
            });
        });

        function saveMediaOrder() {
            const items = [...mediaGrid.querySelectorAll('.media-item')].map((el, i) => el.dataset.index);
            const form = document.createElement('form');
            form.method = 'POST';
            form.innerHTML = '<input name="item_action" value="reorder"><input name="new_order" value="' + JSON.stringify(items) + '">';
            document.body.appendChild(form);
            form.submit();
        }

        // Upload handling
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        if (dropZone) {
            dropZone.addEventListener('click', () => fileInput?.click());
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    uploadFiles(fileInput);
                }
            });
        }

        function uploadFiles(input) {
            if (!input.files.length) return;
            const form = document.getElementById('uploadForm');
            const formData = new FormData(form);
            // Add files
            for (let file of input.files) {
                formData.append('media_files[]', file);
            }
            
            // Show uploading state
            const btn = form.querySelector('button[type="submit"]') || document.querySelector('.btn-primary');
            const originalText = btn.textContent;
            btn.textContent = 'Uploading...';
            btn.disabled = true;
            
            fetch('', {
                method: 'POST',
                body: formData
            }).then(() => {
                location.reload();
            }).catch(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                alert('Upload failed');
            });
        }

        // Modal handling
        function openModal(id) {
            document.getElementById(id).classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeModal(id) {
            document.getElementById(id).classList.remove('active');
            document.body.style.overflow = '';
        }

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
                document.body.style.overflow = '';
            }
        });

        function editCategory(cat) {
            document.getElementById('editCatId').value = cat.id;
            document.getElementById('editCatName').value = cat.name;
            document.getElementById('editCatIcon').value = cat.icon;
            document.getElementById('editCatType').value = cat.type;
            document.getElementById('editCatColor').value = cat.color || '#d4a843';
            openModal('editCategoryModal');
        }

        function editItem(index, item) {
            document.getElementById('editItemIndex').value = index;
            document.getElementById('editItemAlt').value = item.alt || '';
            document.getElementById('editItemCaption').value = item.caption || '';
            const posterGroup = document.getElementById('editItemPosterGroup');
            if (item.poster) {
                document.getElementById('editItemPoster').value = item.poster;
                posterGroup.style.display = 'block';
            } else {
                posterGroup.style.display = 'none';
            }
            openModal('editItemModal');
        }

        function copyJson() {
            const text = document.getElementById('jsonViewer').textContent;
            navigator.clipboard.writeText(text).then(() => alert('Copied!'));
        }

        // Load JSON viewer
        fetch('../content.json').then(r => r.json()).then(data => {
            document.getElementById('jsonViewer').textContent = JSON.stringify(data, null, 2);
        });
    </script>
</body>
</html>