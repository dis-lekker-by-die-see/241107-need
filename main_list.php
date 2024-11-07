<?php
$data = json_decode(file_get_contents('data/need.json'), true);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Main List</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h2>Main List</h2>
    <div id="main-list">
        <?php foreach ($data['categories'] as $category): ?>
            <div class="category">
                <strong><?php echo htmlspecialchars($category['name']); ?></strong>
                <button onclick="editCategory('<?php echo $category['name']; ?>')">Edit</button>
                <button onclick="deleteCategory('<?php echo $category['name']; ?>')">X</button>
                
                <?php foreach ($category['items'] as $item): ?>
                    <div class="item">
                        <?php echo htmlspecialchars($item['name']); ?>
                        <input type="radio" name="status-<?php echo $item['name']; ?>" value="Always Need" <?php echo $item['status'] == 'Always Need' ? 'checked' : ''; ?>> Always Need
                        <input type="radio" name="status-<?php echo $item['name']; ?>" value="Need Now" <?php echo $item['status'] == 'Need Now' ? 'checked' : ''; ?>> Need Now
                        <input type="radio" name="status-<?php echo $item['name']; ?>" value="Need Later" <?php echo $item['status'] == 'Need Later' ? 'checked' : ''; ?>> Need Later
                        <button onclick="editItem('<?php echo $item['name']; ?>')">Edit</button>
                        <button onclick="deleteItem('<?php echo $item['name']; ?>')">X</button>
                    </div>
                <?php endforeach; ?>
                <button onclick="addItem('<?php echo $category['name']; ?>')">Add Item</button>
            </div>
        <?php endforeach; ?>
    </div>
    <button onclick="addCategory()">Add Category</button>

    <script src="js/main.js"></script>
</body>
</html>
