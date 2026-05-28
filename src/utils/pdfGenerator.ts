/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { PasswordAnalysis } from '../types';
import { formatCrackTime } from './security';

/**
 * Generates an elegant corporate cybersecurity password audit report and downloads it locally.
 */
export function generateAnalysisReportPdf(analysis: PasswordAnalysis) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const timestamp = new Date().toLocaleString();
  const maskedPass = analysis.password.length > 0
    ? analysis.password[0] + '*'.repeat(analysis.password.length - 1)
    : 'EMPTY';

  // Define styling grid colors
  const primaryBg = [15, 23, 42]; // slate-900 (RGB)
  const headerBg = [9, 15, 30]; // deep space dark (RGB)
  const cyanStroke = [0, 240, 255]; // neon cyan

  // 1. Draw Page Border and Top Header Box
  doc.setFillColor(headerBg[0], headerBg[1], headerBg[2]);
  doc.rect(0, 0, 210, 42, 'F');

  // Decorative header cyan strip
  doc.setFillColor(cyanStroke[0], cyanStroke[1], cyanStroke[2]);
  doc.rect(0, 42, 210, 2, 'F');

  // Draw Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('PASS_SCAN // CYBERSECURITY AUDIT REPORT', 15, 18);

  doc.setTextColor(148, 163, 184); // text-slate-400
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`AUDIT_HASH // ID: ${Math.floor(Math.random() * 90000) + 10000} | RATING: NIST-800-63B ALIGNED`, 15, 24);
  doc.text(`GENERATED TIMESTAMP: ${timestamp}`, 15, 29);
  doc.text('PRIVACY GUARANTEE: SANDBOXED REPORT (LOCAL STORAGE ONLY)', 15, 34);

  // 2. Main content blocks
  let startY = 55;

  // Masked values summary box
  doc.setFillColor(241, 245, 249); // light background
  doc.rect(15, startY, 180, 24, 'F');
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('TARGET IDENTIFIER:', 22, startY + 8);
  doc.text('OVERALL ENTROPY SCORE:', 110, startY + 8);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(51, 65, 85);
  doc.text(maskedPass, 22, startY + 16);

  // Rating coloring
  let ratingColor = [225, 29, 72]; // Weak red
  if (analysis.strength === 'Medium') ratingColor = [202, 138, 4]; // Amber
  if (analysis.strength === 'Strong') ratingColor = [22, 163, 74]; // Green
  if (analysis.strength === 'Very Strong') ratingColor = [8, 145, 178]; // Cyan

  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(ratingColor[0], ratingColor[1], ratingColor[2]);
  doc.text(`${analysis.score}/100 [${analysis.strength.toUpperCase()}]`, 110, startY + 16);

  startY += 34;

  // 3. Technical Core Metrics
  doc.setTextColor(15, 23, 42);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('CRITICAL CRACKING METRICS', 15, startY);
  
  // horizontal line
  doc.setLineWidth(0.4);
  doc.setDrawColor(203, 213, 225);
  doc.line(15, startY + 2, 195, startY + 2);

  startY += 8;

  // Table grid of stats and calculations
  const totalGuesses = Math.pow(2, analysis.entropy);
  const avgGuesses = totalGuesses / 2;

  const leftColX = 15;
  const rightColX = 110;

  // Row 1
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Password Length:', leftColX, startY);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${analysis.length} characters`, leftColX + 45, startY);

  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Total Entropy Bits:', rightColX, startY);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${analysis.entropy} bits`, rightColX + 45, startY);

  startY += 7;

  // Row 2
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Uppercase Letters:', leftColX, startY);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${analysis.uppercaseCount} found`, leftColX + 45, startY);

  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Lowercase Letters:', rightColX, startY);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${analysis.lowercaseCount} found`, rightColX + 45, startY);

  startY += 7;

  // Row 3
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Numerical Digits:', leftColX, startY);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${analysis.numbersCount} found`, leftColX + 45, startY);

  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Special Symbols:', rightColX, startY);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${analysis.symbolsCount} found`, rightColX + 45, startY);

  startY += 15;

  // 4. Attack Vector Estimates Block
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('SIMULATED GPU & DICTIONARY ATTACK SPEEDS', 15, startY);

  doc.line(15, startY + 2, 195, startY + 2);

  startY += 8;

  // Online brute force speed
  const secondsOnline = avgGuesses / 100;
  const secondsGpu = avgGuesses / 100000000000;

  // Box 1 - Online
  doc.setFillColor(248, 250, 252);
  doc.rect(15, startY, 56, 25, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, startY, 56, 25, 'S');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('ONLINE RATE LIMIT /SEC', 18, startY + 6);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.hasCommonWeakMatches ? 'Instant' : formatCrackTime(secondsOnline), 18, startY + 14);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('~100 attempts/second limit', 18, startY + 20);

  // Box 2 - GPU Bruteforce
  doc.setFillColor(248, 250, 252);
  doc.rect(77, startY, 56, 25, 'F');
  doc.rect(77, startY, 56, 25, 'S');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('OFFLINE GPU MULTI-RIG', 80, startY + 6);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(225, 29, 72); // Alarm Red
  doc.text(analysis.hasCommonWeakMatches ? 'Instant' : formatCrackTime(secondsGpu), 80, startY + 14);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('100 Billion attempts/second', 80, startY + 20);

  // Box 3 - Dictionary lookup
  doc.setFillColor(248, 250, 252);
  doc.rect(139, startY, 56, 25, 'F');
  doc.rect(139, startY, 56, 25, 'S');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('LEXICON DICTIONARY LOOKUP', 142, startY + 6);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.hasCommonWeakMatches ? 'INSTANT TRIGGER' : 'Not listed', 142, startY + 14);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Pre-computed static databases', 142, startY + 20);

  startY += 34;

  // 5. Threat pattern detections & Suggestions block
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('DETECTED PATTERNS & SECURITY ADVISORY', 15, startY);
  doc.line(15, startY + 2, 195, startY + 2);

  startY += 8;

  // Draw pattern findings list
  if (analysis.detectedPatterns.length === 0) {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(22, 163, 74); // Green
    doc.text('[COMPLIANT] No dangerous sequential, sliding keyboard, or common word models identified.', 15, startY);
    startY += 8;
  } else {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('The password analyzer found active structural predictability triggers:', 15, startY);
    startY += 5;

    analysis.detectedPatterns.forEach((p) => {
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text('!', 18, startY);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(64, 64, 64);
      doc.text(p, 23, startY);
      startY += 5;
    });
    startY += 2;
  }

  // Recommendations block
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('MITIGATION RECOMMENDATIONS:', 15, startY);
  startY += 6;

  if (analysis.recommendations.length === 0) {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(22, 163, 74);
    doc.text('This password satisfies robust entropy recommendations. Maintain standard safety storage guidelines.', 15, startY);
  } else {
    analysis.recommendations.slice(0, 3).forEach((rec) => {
      if (startY > 265) {
        doc.addPage();
        startY = 20;
      }

      doc.setFillColor(254, 242, 242); // slate rose border tinted
      doc.rect(15, startY, 180, 15, 'F');
      doc.setDrawColor(252, 165, 165);
      doc.rect(15, startY, 180, 15, 'S');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(rec.critical ? 220 : 15, rec.critical ? 38 : 23, rec.critical ? 38 : 42);
      doc.text(`${rec.title.toUpperCase()} (Mitigation Check)`, 18, startY + 5);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(rec.recommendation, 18, startY + 11);

      startY += 19;
    });
  }

  // Footer banner
  doc.setFont('Helvetica', 'oblique');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('CONFIDENTIALITY NOTICE: This PDF was compiled fully client-side. The analyzer system never buffers or intercepts raw inputs.', 15, 285);

  // Save the PDF
  doc.save(`password_integrity_report_${Math.floor(Date.now() / 1000)}.pdf`);
}
