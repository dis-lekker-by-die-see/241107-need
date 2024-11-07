<?php
$historyFiles = glob('data/history/*.json');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>History</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h2>History</h2>
    <div id="history-list">
        <?php foreach ($historyFiles as $file): ?>
            <?php 
                $data = json_decode(file_get_contents($file), true); 
                $date = basename($file, '.json');
            ?>
            <h3><?php echo htmlspecialchars($date); ?></h3>
            <?php foreach ($data['categories'] as $category): ?>
                <div class="category">
                    <strong><?php echo htmlspecialchars($category['name']); ?></strong>
                    <?php foreach ($category['items'] as $item): ?>
                        <div class="item">
                            <?php echo htmlspecialchars($item['name']); ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endforeach; ?>
        <?php endforeach; ?>
    </div>
    <button onclick="exportHistory()">Export</button>

    <script src="js/main.js"></script>
</body>
</html>
