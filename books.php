<?php
require __DIR__ . '/db.php';

// Search text
$search = $_GET['q'] ?? '';
if (!is_string($search)) {
    $search = '';
}
$search = trim($search);
$pattern = '%' . $search . '%';


// Subject filter: only a whole number of 1 or more is accepted
$subject = filter_input(INPUT_GET, 'subject', FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1],
]);


// Shelf filter: only a 1 can turn it on
$onlyAvailable = ($_GET['available'] ?? '') === '1';


// The part of the query that is always there
$sql = 'SELECT books.title,
books.author,
books.year,
subjects.name AS subject,
books.copies,
books.copies - books.on_loan AS available
FROM books
JOIN subjects ON subjects.id = books.subject_id
WHERE (books.title LIKE :title OR books.author LIKE :author)';
$params = [':title' => $pattern, ':author' => $pattern];


// Add a condition only when its filter is used
if (is_int($subject)) {
    $sql .= ' AND books.subject_id = :subject';
    $params[':subject'] = $subject;
}

if ($onlyAvailable) {
    $sql .= ' AND books.copies > books.on_loan';
}

$sql .= ' ORDER BY books.title';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

echo json_encode($stmt->fetchAll());
