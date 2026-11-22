<?php
require __DIR__ . '/db.php';

// The search text from the URL: empty if missing or not a string
$search = $_GET['q'] ?? '';
if (!is_string($search)) {
    $search = '';
}
$search = trim($search);

// An empty search gives '%%', which matches every book
$pattern = '%' . $search . '%';

$sql = 'SELECT books.title,
books.author,
books.year,
subjects.name AS subject,
books.copies,
books.copies - books.on_loan AS available
FROM books
JOIN subjects ON subjects.id = books.subject_id
WHERE books.title LIKE :title OR books.author LIKE :author
ORDER BY books.title';

$stmt = $pdo->prepare($sql);
$stmt->execute([':title' => $pattern, ':author' => $pattern]);

echo json_encode($stmt->fetchAll());
