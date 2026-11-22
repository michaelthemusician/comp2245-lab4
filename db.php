<?php
require __DIR__ . '/config.php';   // sets $dsn, $user and $pass

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    // Full details go to the server log only
    error_log('Database connection failed: ' . $e->getMessage());

    http_response_code(500);
    echo json_encode(['error' => 'Could not connect to the database.']);
    exit;
}
