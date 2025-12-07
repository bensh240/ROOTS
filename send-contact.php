<?php
header('Content-Type: application/json; charset=utf-8');

// Load configuration
require_once(__DIR__ . '/config.php');

// Load PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once(__DIR__ . '/vendor/autoload.php');

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get and sanitize form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate required fields
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'נא למלא את כל השדות הנדרשים']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'כתובת מייל לא תקינה']);
    exit;
}

// Build email content
$emailSubject = 'טופס יצירת קשר מאתר ROOTS - ' . ($subject ?: 'ללא נושא');
$emailBody = "
<html dir='rtl'>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; direction: rtl; text-align: right; }
        .container { max-width: 600px; margin: 0 auto; background: #f8f8f8; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B8E23 0%, #8BA73E 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-right: 3px solid #6B8E23; }
        .label { font-weight: bold; color: #6B5435; }
        .value { margin-top: 5px; color: #333; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>טופס יצירת קשר חדש</h2>
            <p>התקבלה הודעה חדשה מאתר ROOTS</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>שם מלא:</div>
                <div class='value'>" . htmlspecialchars($name) . "</div>
            </div>
            <div class='field'>
                <div class='label'>אימייל:</div>
                <div class='value'>" . htmlspecialchars($email) . "</div>
            </div>
            " . (!empty($phone) ? "<div class='field'>
                <div class='label'>טלפון:</div>
                <div class='value'>" . htmlspecialchars($phone) . "</div>
            </div>" : "") . "
            " . (!empty($subject) ? "<div class='field'>
                <div class='label'>נושא:</div>
                <div class='value'>" . htmlspecialchars($subject) . "</div>
            </div>" : "") . "
            <div class='field'>
                <div class='label'>הודעה:</div>
                <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
            <hr style='margin: 20px 0; border: none; border-top: 1px solid #e5e5e5;'>
            <p style='color: #888; font-size: 12px; text-align: center;'>
                הודעה זו נשלחה מטופס יצירת קשר באתר ROOTS<br>
                תאריך ושעה: " . date('d/m/Y H:i:s') . "
            </p>
        </div>
    </div>
</body>
</html>
";

// Send email using PHPMailer with SMTP
$mail = null; // Initialize to avoid undefined variable error

try {
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = SMTP_PORT;
    $mail->CharSet = 'UTF-8';
    
    // Recipients
    $mail->setFrom(SMTP_FROM, 'ROOTS - טופס יצירת קשר');
    $mail->addAddress(SMTP_TO);
    $mail->addReplyTo($email, $name);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = $emailSubject;
    $mail->Body = $emailBody;
    
    $mail->send();
    
    echo json_encode([
        'success' => true,
        'message' => 'ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'אירעה שגיאה בשליחת ההודעה. אנא נסה שוב או צור איתנו קשר בטלפון.',
        'error' => (defined('SMTP_DEBUG') && SMTP_DEBUG && $mail !== null && isset($mail->ErrorInfo)) ? $mail->ErrorInfo : null
    ]);
}
?>
