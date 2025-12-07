#!/bin/bash

# Script to install DomPDF for ROOTS project
# Run this from Terminal: bash install-dompdf.sh

echo "📦 Installing DomPDF for ROOTS..."
echo "================================"

# Navigate to project directory
cd /Applications/MAMP/htdocs/roots

# Create vendor directory structure
echo "✓ Creating vendor directory..."
mkdir -p vendor/dompdf
mkdir -p vendor/phenx
mkdir -p vendor/sabberworm

# Download DomPDF
echo "📥 Downloading DomPDF..."
curl -L https://github.com/dompdf/dompdf/archive/refs/tags/v2.0.4.tar.gz -o dompdf.tar.gz
tar -xzf dompdf.tar.gz
mv dompdf-2.0.4/* vendor/dompdf/dompdf/
rm -rf dompdf-2.0.4 dompdf.tar.gz

# Download dependencies
echo "📥 Downloading PHP Font Library..."
curl -L https://github.com/dompdf/php-font-lib/archive/refs/tags/1.0.0.tar.gz -o php-font-lib.tar.gz
tar -xzf php-font-lib.tar.gz
mkdir -p vendor/phenx/php-font-lib
mv php-font-lib-1.0.0/* vendor/phenx/php-font-lib/
rm -rf php-font-lib-1.0.0 php-font-lib.tar.gz

echo "📥 Downloading PHP SVG Library..."
curl -L https://github.com/dompdf/php-svg-lib/archive/refs/tags/v1.0.0.tar.gz -o php-svg-lib.tar.gz
tar -xzf php-svg-lib.tar.gz
mkdir -p vendor/phenx/php-svg-lib
mv php-svg-lib-1.0.0/* vendor/phenx/php-svg-lib/
rm -rf php-svg-lib-1.0.0 php-svg-lib.tar.gz

echo "📥 Downloading Sabberworm CSS Parser..."
curl -L https://github.com/sabberworm/PHP-CSS-Parser/archive/refs/tags/v8.4.0.tar.gz -o css-parser.tar.gz
tar -xzf css-parser.tar.gz
mkdir -p vendor/sabberworm/php-css-parser
mv PHP-CSS-Parser-8.4.0/* vendor/sabberworm/php-css-parser/
rm -rf PHP-CSS-Parser-8.4.0 css-parser.tar.gz

# Create autoload file
echo "✓ Creating autoload file..."
cat > vendor/autoload.php << 'EOL'
<?php
// Simple autoloader for DomPDF and dependencies

spl_autoload_register(function ($class) {
    $prefix = 'Dompdf\\';
    $base_dir = __DIR__ . '/dompdf/dompdf/src/';
    
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

// Font library
spl_autoload_register(function ($class) {
    $prefix = 'FontLib\\';
    $base_dir = __DIR__ . '/phenx/php-font-lib/src/FontLib/';
    
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

// SVG library
spl_autoload_register(function ($class) {
    $prefix = 'Svg\\';
    $base_dir = __DIR__ . '/phenx/php-svg-lib/src/Svg/';
    
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

// CSS Parser
spl_autoload_register(function ($class) {
    $prefix = 'Sabberworm\\CSS\\';
    $base_dir = __DIR__ . '/sabberworm/php-css-parser/src/';
    
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
echo "✅ DomPDF installed successfully!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Update the password in send-contact.php (line 8)"
echo "2. Update the password in send-health-form.php (line 8)"
echo "3. Test the forms!"
echo ""

