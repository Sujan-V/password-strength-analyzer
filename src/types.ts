/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'landing' | 'analyzer' | 'generator' | 'dashboard' | 'about';

export interface ScanRequirement {
  id: string;
  name: string;
  met: boolean;
  checked: boolean;
  description: string;
}

export type StrengthLevel = 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';

export interface CrackTimeEstimates {
  onlineBruteForce: string; // Rate of 100/sec, e.g. normal online rate-limited login
  offlineGpu: string;       // Rate of 100 Billion/sec, typical offline hashing rig
  dictionaryAttack: string; // Dictionary lookup time
  secondsToCrackOnline: number;
  secondsToCrackGpu: number;
}

export interface SecurityIssue {
  id: string;
  critical: boolean;
  title: string;
  description: string;
  recommendation: string;
}

export interface PasswordAnalysis {
  password: string;
  score: number; // 0 to 100
  strength: StrengthLevel;
  entropy: number; // in bits
  length: number;
  
  // Character set detections
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  
  // Counts
  uppercaseCount: number;
  lowercaseCount: number;
  numbersCount: number;
  symbolsCount: number;
  
  // Specific pattern triggers
  hasRepeatedChars: boolean;
  hasSequentialNumbers: boolean;
  hasSequentialLetters: boolean;
  hasKeyboardPatterns: boolean;
  hasCommonWeakMatches: boolean;
  hasSubstitutions: boolean;
  
  // Detailed pattern descriptions
  detectedPatterns: string[];
  recommendations: SecurityIssue[];
}

export interface GeneratorSettings {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface CybersecurityTip {
  id: string;
  title: string;
  category: 'General' | 'MFA' | 'Corporate' | 'Personal' | 'Advanced';
  content: string;
  iconName: string;
}

export interface AnalyzedLog {
  id: string;
  timestamp: string;
  maskedPassword: string;
  length: number;
  score: number;
  strength: StrengthLevel;
  entropy: number;
  vulnerabilitiesFound: number;
}
