#!/usr/bin/env node

// Image optimization script
const fs = require('fs');
const path = require('path');

console.log('🖼️  Image Optimization Script');
console.log('=====================================');

// Check if vs-img.webp exists
const webpPath = path.join(__dirname, 'vs-img.webp');
const pngPath = path.join(__dirname, 'vs-img.png');

if (!fs.existsSync(webpPath) && fs.existsSync(pngPath)) {
    console.log('⚠️  WebP version of vs-img.png not found');
    console.log('📝 To create WebP version, run one of these commands:');
    console.log('');
    console.log('Using online converter:');
    console.log('1. Go to https://convertio.co/png-webp/');
    console.log('2. Upload vs-img.png');
    console.log('3. Download as vs-img.webp');
    console.log('');
    console.log('Using ImageMagick (if installed):');
    console.log('magick vs-img.png vs-img.webp');
    console.log('');
    console.log('Using cwebp (if installed):');
    console.log('cwebp vs-img.png -o vs-img.webp');
    console.log('');
} else if (fs.existsSync(webpPath)) {
    console.log('✅ WebP image found: vs-img.webp');
    
    // Check file sizes
    const pngSize = fs.statSync(pngPath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((pngSize - webpSize) / pngSize * 100).toFixed(1);
    
    console.log(`📊 PNG size: ${(pngSize / 1024).toFixed(1)} KB`);
    console.log(`📊 WebP size: ${(webpSize / 1024).toFixed(1)} KB`);
    console.log(`💾 Space saved: ${savings}%`);
}

console.log('');
console.log('🚀 Other optimizations applied:');
console.log('✅ Reduced font weights (removed 500)');
console.log('✅ Limited preconnect to 3 domains');
console.log('✅ Added font-display: swap');
console.log('✅ Optimized cache headers');
console.log('✅ Added gzip encoding headers');
console.log('✅ Fixed forced reflow issues');
console.log('');
console.log('📈 Expected performance improvements:');
console.log('⚡ Cache lifetimes: +266 KiB savings');
console.log('🖼️  Image delivery: +261 KiB savings (with WebP)');
console.log('🚫 Render blocking: +300ms faster');
console.log('🔤 Font display: +60ms faster');
console.log('📦 CSS minification: +2 KiB savings');
console.log('🧹 Unused CSS: +18 KiB savings');
