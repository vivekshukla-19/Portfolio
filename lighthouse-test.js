#!/usr/bin/env node

/**
 * Lighthouse Testing Script for Portfolio Website
 * 
 * This script runs comprehensive Lighthouse audits for:
 * - Performance
 * - Accessibility
 * - SEO
 * - Best Practices
 * 
 * Usage:
 * npm install -g lighthouse
 * node lighthouse-test.js
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

const URL = 'https://vivekshukla-19.github.io/Portfolio/';
const OUTPUT_DIR = './lighthouse-reports';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

async function runLighthouse() {
    console.log('🚀 Starting Lighthouse audit for Portfolio Website...\n');
    
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {
        logLevel: 'info',
        output: 'html',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        port: chrome.port,
    };

    try {
        const runnerResult = await lighthouse(URL, options);
        
        // Generate timestamp for file naming
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Save HTML report
        const htmlReportPath = path.join(OUTPUT_DIR, `lighthouse-report-${timestamp}.html`);
        fs.writeFileSync(htmlReportPath, runnerResult.report);
        console.log(`📊 HTML report saved: ${htmlReportPath}`);
        
        // Extract and display scores
        const lhr = runnerResult.lhr;
        console.log('\n📈 Lighthouse Scores:');
        console.log('==================');
        
        const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
        categories.forEach(category => {
            const score = lhr.categories[category].score * 100;
            const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
            console.log(`${emoji} ${category.charAt(0).toUpperCase() + category.slice(1)}: ${Math.round(score)}`);
        });
        
        // Display Core Web Vitals
        console.log('\n⚡ Core Web Vitals:');
        console.log('=================');
        
        const audits = lhr.audits;
        const coreWebVitals = {
            'largest-contentful-paint': 'LCP',
            'first-input-delay': 'FID',
            'cumulative-layout-shift': 'CLS'
        };
        
        Object.entries(coreWebVitals).forEach(([key, name]) => {
            const audit = audits[key];
            if (audit) {
                const score = audit.score;
                const displayValue = audit.displayValue || 'N/A';
                const emoji = score >= 0.9 ? '🟢' : score >= 0.5 ? '🟡' : '🔴';
                console.log(`${emoji} ${name}: ${displayValue}`);
            }
        });
        
        // SEO Recommendations
        console.log('\n🔍 SEO Recommendations:');
        console.log('======================');
        
        const seoAudits = lhr.categories.seo.auditRefs;
        seoAudits.forEach(auditRef => {
            const audit = audits[auditRef.id];
            if (audit && audit.score !== null && audit.score < 1) {
                const emoji = audit.score >= 0.9 ? '🟢' : audit.score >= 0.5 ? '🟡' : '🔴';
                console.log(`${emoji} ${audit.title}: ${audit.description}`);
            }
        });
        
        // Accessibility Recommendations
        console.log('\n♿ Accessibility Recommendations:');
        console.log('================================');
        
        const a11yAudits = lhr.categories.accessibility.auditRefs;
        a11yAudits.forEach(auditRef => {
            const audit = audits[auditRef.id];
            if (audit && audit.score !== null && audit.score < 1) {
                const emoji = audit.score >= 0.9 ? '🟢' : audit.score >= 0.5 ? '🟡' : '🔴';
                console.log(`${emoji} ${audit.title}: ${audit.description}`);
            }
        });
        
        // Performance Recommendations
        console.log('\n⚡ Performance Recommendations:');
        console.log('===============================');
        
        const perfAudits = lhr.categories.performance.auditRefs;
        perfAudits.forEach(auditRef => {
            const audit = audits[auditRef.id];
            if (audit && audit.score !== null && audit.score < 0.9) {
                const emoji = audit.score >= 0.9 ? '🟢' : audit.score >= 0.5 ? '🟡' : '🔴';
                console.log(`${emoji} ${audit.title}: ${audit.displayValue || 'Needs improvement'}`);
            }
        });
        
        console.log('\n✅ Lighthouse audit completed successfully!');
        console.log(`📁 Full report available at: ${htmlReportPath}`);
        
    } catch (error) {
        console.error('❌ Error running Lighthouse audit:', error);
    } finally {
        await chrome.kill();
    }
}

// Run the audit
runLighthouse().catch(console.error);
