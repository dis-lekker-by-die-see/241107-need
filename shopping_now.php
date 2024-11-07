<?php
$data = json_decode(file_get_contents('data/need.json'), true);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Shopping Now</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h2>Shopping Now</h2>
    <div id="shopping-now-list">
        <?php foreach ($data['categories'] as $category): ?>
            <div class="category">
                <strong><?php echo htmlspecialchars($category['name']); ?></strong>
                <?php foreach ($category['items'] as $item): ?>
                    <?php if ($item['status'] === 'Need Now' || $item['status'] === 'Always Need'): ?>
                        <div class="item" onclick="toggleItem(this)">
                            <?php echo htmlspecialchars($item['name']); ?>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
        <?php endforeach; ?>
    </div>
    <button onclick="cancelShopping()">Cancel</button>
    <button onclick="finishShopping()">Finish</button>

    <script src="js/main.js"></script>
</body>
</html>
