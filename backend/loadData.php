<?php
header("Content-Type: application/json");

// Path to the main data file
$filePath = '../data/need.json';

// Check if the file exists and read it
if (file_exists($filePath)) {
    $data = file_get_contents($filePath);
    echo $data;
} else {
    // Send an empty structure if the file does not exist
    echo json_encode(["categories" => []]);
}
?>
