<?php
require __DIR__ . '/../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

// Set headers for downloading an Excel file
header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
header("Content-Disposition: attachment; filename=exported_history.xlsx");

$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();
$sheet->setCellValue('A1', 'Date');
$sheet->setCellValue('B1', 'Category');
$sheet->setCellValue('C1', 'Item');

// Start filling rows with history data
$row = 2;
$historyFiles = glob('../data/history/*.json');

foreach ($historyFiles as $file) {
    $date = basename($file, '.json');
    $data = json_decode(file_get_contents($file), true);

    foreach ($data['categories'] as $category) {
        foreach ($category['items'] as $item) {
            $sheet->setCellValue("A$row", $date);
            $sheet->setCellValue("B$row", $category['name']);
            $sheet->setCellValue("C$row", $item['name']);
            $row++;
        }
    }
}

// Write the spreadsheet to the output stream
$writer = new Xlsx($spreadsheet);
$writer->save("php://output");
?>
