#!/usr/bin/env node

/**
 * Simple minification script for CSS and JS files
 * Run this script to create minified versions of your assets
 */

const fs = require('fs');
const path = require('path');

// Simple CSS minification
function minifyCSS(css) {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove unnecessary whitespace
        .replace(/\s+/g, ' ')
        // Remove whitespace around selectors and properties
        .replace(/\s*{\s*/g, '{')
        .replace(/;\s*/g, ';')
        .replace(/\s*}\s*/g, '}')
        .replace(/:\s*/g, ':')
        .replace(/,\s*/g, ',')
        // Remove trailing semicolons
        .replace(/;}/g, '}')
        // Remove leading/trailing whitespace
        .trim();
}

// Simple JS minification (basic)
function minifyJS(js) {
    return js
        // Remove single-line comments (but preserve URLs)
        .replace(/(?<!:)\/\/.*$/gm, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove unnecessary whitespace (basic)
        .replace(/\s+/g, ' ')
        // Remove whitespace around operators
        .replace(/\s*([{}();,:])\s*/g, '$1')
        // Remove leading/trailing whitespace
        .trim();
}

// Read and minify CSS
try {
    const cssContent = fs.readFileSync('style.css', 'utf8');
    const minifiedCSS = minifyCSS(cssContent);
    
    // Create minified version
    fs.writeFileSync('style.min.css', minifiedCSS);
    
    // Create source map (basic)
    const sourceMap = {
        version: 3,
        sources: ['style.css'],
        names: [],
        mappings: '',
        file: 'style.min.css'
    };
    fs.writeFileSync('style.min.css.map', JSON.stringify(sourceMap));
    
    console.log('✅ CSS minified successfully');
    console.log(`Original size: ${(cssContent.length / 1024).toFixed(2)} KB`);
    console.log(`Minified size: ${(minifiedCSS.length / 1024).toFixed(2)} KB`);
    console.log(`Savings: ${(((cssContent.length - minifiedCSS.length) / cssContent.length) * 100).toFixed(1)}%`);
} catch (error) {
    console.error('❌ Error minifying CSS:', error.message);
}

// Read and minify JS
try {
    const jsContent = fs.readFileSync('script.js', 'utf8');
    const minifiedJS = minifyJS(jsContent);
    
    // Create minified version
    fs.writeFileSync('script.min.js', minifiedJS);
    
    // Create source map (basic)
    const sourceMap = {
        version: 3,
        sources: ['script.js'],
        names: [],
        mappings: '',
        file: 'script.min.js'
    };
    fs.writeFileSync('script.min.js.map', JSON.stringify(sourceMap));
    
    console.log('✅ JS minified successfully');
    console.log(`Original size: ${(jsContent.length / 1024).toFixed(2)} KB`);
    console.log(`Minified size: ${(minifiedJS.length / 1024).toFixed(2)} KB`);
    console.log(`Savings: ${(((jsContent.length - minifiedJS.length) / jsContent.length) * 100).toFixed(1)}%`);
} catch (error) {
    console.error('❌ Error minifying JS:', error.message);
}

console.log('\n📝 To use minified files in production:');
console.log('1. Update HTML to reference style.min.css and script.min.js');
console.log('2. Ensure source maps are available for debugging');
console.log('3. Test thoroughly before deployment');
