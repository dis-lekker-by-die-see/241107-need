<?php
header("Content-Type: application/json");

// Path to the main data file
$filePath = '../data/need.json';

// Get the JSON data sent from the frontend
$inputData = file_get_contents("php://input");

// Attempt to save the data
if (file_put_contents($filePath, $inputData)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to save data."]);
}
?>
