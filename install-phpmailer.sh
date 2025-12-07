#!/bin/bash

# Script to install PHPMailer for ROOTS project
# Run this from Terminal: bash install-phpmailer.sh

echo "📦 Installing PHPMailer for ROOTS..."
echo "===================================="

# Navigate to project directory
cd "$(dirname "$0")"

# Create vendor directory structure
echo "✓ Creating vendor directory..."
mkdir -p vendor/phpmailer/phpmailer

# Download PHPMailer
echo "📥 Downloading PHPMailer..."
curl -L https://github.com/PHPMailer/PHPMailer/archive/refs/tags/v6.8.1.tar.gz -o phpmailer.tar.gz
tar -xzf phpmailer.tar.gz
mv PHPMailer-6.8.1/src/* vendor/phpmailer/phpmailer/
mv PHPMailer-6.8.1/language vendor/phpmailer/phpmailer/
rm -rf PHPMailer-6.8.1 phpmailer.tar.gz

# Create autoload file
echo "✓ Creating autoload file..."
cat > vendor/autoload.php << 'EOL'
<?php
// Simple autoloader for PHPMailer

spl_autoload_register(function ($class) {
    $prefix = 'PHPMailer\\PHPMailer\\';
    $base_dir = __DIR__ . '/phpmailer/phpmailer/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});
EOL

# Set permissions
echo "✓ Setting permissions..."
chmod -R 755 vendor/

echo ""
echo "✅ PHPMailer installed successfully!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Make sure config.php exists with your SMTP password"
echo "2. Test the contact form at contacts.html"
echo "3. Test the health form at healthForm.html"
echo ""
echo "All set! 🚀"

