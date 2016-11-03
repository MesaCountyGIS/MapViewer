<?php

header("Content-type: text/csv");  
header("Cache-Control: no-store, no-cache");  
header('Content-Disposition: attachment; filename="filename.csv"'); 

$csvData = $_POST['csvList'];

$csv = explode('^',$csvData);

$fileName = 'Query_Result_'.time().'.csv';

$myfile = 'output\\'.$fileName;

$headerArray = explode(',', reset($csv)); 

$fh = fopen($myfile, 'w') or die("can't open file");

foreach($csv as $line) {
  fputcsv($fh, explode(',',$line),',','"');
}

fclose($fh);

echo $myfile;

?>