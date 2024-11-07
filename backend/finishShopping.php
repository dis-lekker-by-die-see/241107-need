<?php
header("Content-Type: application/json");

// Paths to data files
$mainFilePath = '../data/need.json';
$historyDir = '../data/history/';

// Get the JSON data sent from the frontend
$inputData = json_decode(file_get_contents("php://input"), true);

// Load existing main data
$mainData = json_decode(file_get_contents($mainFilePath), true);

// Prepare a new history entry
$historyData = ["categories" => []];

// Process each category to move toggled items to history
foreach ($mainData['categories'] as &$category) {
    $historyCategory = ["name" => $category['name'], "items" => []];
    $remainingItems = [];

    foreach ($category['items'] as $item) {
        if (isset($inputData['toggledItems']) && in_array($item['name'], $inputData['toggledItems']) && $item['status'] !== "Always Need") {
            // Add item to history if toggled and not "Always Need"
            $historyCategory['items'][] = $item;
        } else {
            // Keep item in the main list
            $remainingItems[] = $item;
        }
    }

    // Update category items with remaining items
    $category['items'] = $remainingItems;

    // Add category to history if it contains items
    if (!empty($historyCategory['items'])) {
        $historyData['categories'][] = $historyCategory;
    }
}

// Save updated main data
file_put_contents($mainFilePath, json_encode($mainData, JSON_PRETTY_PRINT));

// Save the history entry to a new file with a timestamp
$timestamp = date('Ymd-His');
file_put_contents("{$historyDir}{$timestamp}.json", json_encode($historyData, JSON_PRETTY_PRINT));

echo json_encode(["success" => true, "message" => "Shopping session finalized and saved to history."]);
?>
