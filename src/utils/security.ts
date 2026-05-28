/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PasswordAnalysis, StrengthLevel, SecurityIssue, CrackTimeEstimates, GeneratorSettings, CybersecurityTip } from '../types';

// Large static set of extremely common passwords
const COMMON_PASSWORDS = new Set([
  '123456', '123456789', 'picture', '12345678', 'password', '12345', '1234567', 'qwerty', 
  '123123', 'p@ssw0rd', 'admin', 'admin123', 'admin@123', 'secret', 'password123', 'welcome', 
  'football', 'monkey', 'letmein', 'charlie', 'qwerty123', 'asdfgh', 'shadow', 'superman', 
  'login', '111111', '1234567890', 'dragons', 'hunter2', 'baseball', 'princess', 'master', 
  'computer', 'trustno1', 'cybersecurity', 'hacker', 'ninja', 'google', 'microsoft', 'p@ssword',
  'password123!', 'test1234', 'qwertyuiop', 'zxcvbnm', 'iloveyou', 'root', 'user123', 'sysadmin'
]);

// Keyboard sequence patterns
const KEYBOARD_PATTERNS = [
  'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
  '1234567890', 'qazwsxedcrfvtgbyhnujmikolp',
  'poiuytrewq', 'lkjhgfdsa', 'mnbvcxz'
];

// Predictable character substitutions map (Leet speak)
const SUBSTITUTIONS: { [key: string]: string[] } = {
  'a': ['@', '4'],
  'e': ['3'],
  'i': ['1', '!', '|'],
  'o': ['0'],
  's': ['$', '5'],
  't': ['7', '+'],
  'g': ['9', '6'],
  'b': ['8']
};

/**
 * Normalizes a leet-speak password back to plain-text letters for dictionary scans.
 */
export function decodeLeetSpeak(passwd: string): string[] {
  let paths: string[] = [passwd.toLowerCase()];
  
  // Create variations or simpler flat check
  let decoded = passwd.toLowerCase();
  decoded = decoded.replace(/@/g, 'a').replace(/4/g, 'a')
                   .replace(/3/g, 'e')
                   .replace(/[1!|]/g, 'i')
                   .replace(/0/g, 'o')
                   .replace(/[\$5]/g, 's')
                   .replace(/[7\+]/g, 't')
                   .replace(/[96]/g, 'g')
                   .replace(/8/g, 'b');
                   
  return [passwd.toLowerCase(), decoded];
}

/**
 * Helper to check standard alphanumeric/keyboard slide sequences
 */
export function checkKeyboardSlide(passwd: string): boolean {
  const clean = passwd.toLowerCase();
  if (clean.length < 3) return false;
  
  for (const pattern of KEYBOARD_PATTERNS) {
    for (let i = 0; i <= pattern.length - 3; i++) {
      const sub = pattern.substring(i, i + 3);
      if (clean.includes(sub)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks for sequence steps (e.g. abc, def, 123, 987, fed)
 */
export function checkSequentialPatterns(passwd: string): { numbers: boolean; letters: boolean } {
  let numbers = false;
  let letters = false;
  const clean = passwd.toLowerCase();
  
  if (clean.length < 3) {
    return { numbers, letters };
  }

  for (let i = 0; i < clean.length - 2; i++) {
    const c1 = clean.charCodeAt(i);
    const c2 = clean.charCodeAt(i + 1);
    const c3 = clean.charCodeAt(i + 2);

    // Check ascending numbers (e.g., 123, 456)
    if (c2 === c1 + 1 && c3 === c2 + 1) {
      if (c1 >= 48 && c3 <= 57) numbers = true; // ASCII 0-9
      if (c1 >= 97 && c3 <= 122) letters = true; // ASCII a-z
    }
    // Check descending numbers / letters (e.g., 321, cba)
    if (c2 === c1 - 1 && c3 === c2 - 1) {
      if (c3 >= 48 && c1 <= 57) numbers = true;
      if (c3 >= 97 && c1 <= 122) letters = true;
    }
  }

  return { numbers, letters };
}

/**
 * Checks for repeated character chunks (e.g. "aaaa", "1111", "abcabc")
 */
export function checkRepeatedChars(passwd: string): boolean {
  // Check for 3+ identical consecutive characters
  if (/()(.)\2\2/.test(passwd)) {
    return true;
  }
  
  // Check for repeated substrings of length 2 or 3 (e.g. "abab", "abcabc")
  if (passwd.length >= 6) {
    for (let len = 2; len <= 3; len++) {
      for (let i = 0; i < passwd.length - (len * 2) + 1; i++) {
        const chunk = passwd.substr(i, len);
        const rest = passwd.substr(i + len);
        if (rest.startsWith(chunk)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Calculates Shannon entropy in bits
 */
export function calculateEntropy(passwd: string, poolSize: number): number {
  if (!passwd || poolSize === 0) return 0;
  // Standard metric: L * log2(R)
  const length = passwd.length;
  const entropy = length * (Math.log(poolSize) / Math.log(2));
  return parseFloat(entropy.toFixed(1));
}

/**
 * Formats time nicely into readable formats (hours, years, aeons)
 */
export function formatCrackTime(seconds: number): string {
  if (seconds < 1) return 'Instant (< 1 second)';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minute${Math.round(minutes) > 1 ? 's' : ''}`;
  
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hour${Math.round(hours) > 1 ? 's' : ''}`;
  
  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} day${Math.round(days) > 1 ? 's' : ''}`;
  
  const years = days / 365;
  if (years < 1000) return `${Math.round(years).toLocaleString()} year${Math.round(years) > 1 ? 's' : ''}`;
  
  const millennia = years / 1000;
  if (millennia < 1000) return `${Math.round(millennia).toLocaleString()} millennia`;
  
  const millions = millennia / 1000;
  if (millions < 1000) return `${Math.round(millions).toLocaleString()} Million years`;
  
  const billions = millions / 1000;
  if (billions < 1000) return `${Math.round(billions).toLocaleString()} Billion years`;
  
  return 'Infinity (Aeons / Uncrackable)';
}

/**
 * Evaluates realistic password crack time estimates based on multiple threat vectors.
 */
export function estimateCrackTimes(passwd: string, entropy: number, isCommon: boolean): CrackTimeEstimates {
  if (!passwd) {
    return {
      onlineBruteForce: 'Instant',
      offlineGpu: 'Instant',
      dictionaryAttack: 'Instant',
      secondsToCrackOnline: 0,
      secondsToCrackGpu: 0
    };
  }

  // Dictionary lookup speed
  let dictText = 'Strong Defense';
  if (isCommon) {
    dictText = 'Instantaneous (Pre-computed hashes)';
  } else {
    // If it relies on pure simple dictionary words
    const decodedVal = decodeLeetSpeak(passwd);
    let potentialMatch = false;
    for (const v of decodedVal) {
      if (COMMON_PASSWORDS.has(v) || v.length < 5) potentialMatch = true;
    }
    dictText = potentialMatch ? 'Vulnerable (~ 0.1 seconds)' : 'Safe (Not in dictionary databases)';
  }

  // Online attack guesses rate: ~100 attempts per second (due to lockouts/network latency)
  // Number of guesses (S) = 2^H. Average guesses to find key = 2^(H-1)
  const totalGuesses = Math.pow(2, entropy);
  const avgGuesses = totalGuesses / 2;
  
  const secondsOnline = avgGuesses / 100;
  const onlineBruteForce = isCommon ? 'Instant (1 second)' : formatCrackTime(secondsOnline);

  // Offline GPU hashing rig rate: ~100 Billion hashes/sec (10^11 hashes per second, e.g. parallel mining cards)
  const secondsGpu = avgGuesses / 100000000000;
  const offlineGpu = isCommon ? 'Instant' : formatCrackTime(secondsGpu);

  return {
    onlineBruteForce,
    offlineGpu,
    dictionaryAttack: dictText,
    secondsToCrackOnline: isCommon ? 1 : secondsOnline,
    secondsToCrackGpu: isCommon ? 0 : secondsGpu
  };
}

/**
 * Primary analyzer engine calculating multi-variable ratings
 */
export function analyzePassword(password: string): PasswordAnalysis {
  const result: PasswordAnalysis = {
    password,
    score: 0,
    strength: 'Very Weak',
    entropy: 0,
    length: password.length,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSymbols: false,
    uppercaseCount: 0,
    lowercaseCount: 0,
    numbersCount: 0,
    symbolsCount: 0,
    hasRepeatedChars: false,
    hasSequentialNumbers: false,
    hasSequentialLetters: false,
    hasKeyboardPatterns: false,
    hasCommonWeakMatches: false,
    hasSubstitutions: false,
    detectedPatterns: [],
    recommendations: []
  };

  if (!password) {
    return result;
  }

  // Classify characters present
  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    if (/[A-Z]/.test(char)) {
      result.hasUppercase = true;
      result.uppercaseCount++;
    } else if (/[a-z]/.test(char)) {
      result.hasLowercase = true;
      result.lowercaseCount++;
    } else if (/[0-9]/.test(char)) {
      result.hasNumbers = true;
      result.numbersCount++;
    } else {
      result.hasSymbols = true;
      result.symbolsCount++;
    }
  }

  // Pool size calculation (diversity)
  let poolSize = 0;
  if (result.hasLowercase) poolSize += 26;
  if (result.hasUppercase) poolSize += 26;
  if (result.hasNumbers) poolSize += 10;
  if (result.hasSymbols) poolSize += 33; // ~standard ASCII printable non-alphanumeric chars

  result.entropy = calculateEntropy(password, poolSize);

  // Rule verification
  result.hasRepeatedChars = checkRepeatedChars(password);
  
  const seqs = checkSequentialPatterns(password);
  result.hasSequentialNumbers = seqs.numbers;
  result.hasSequentialLetters = seqs.letters;
  
  result.hasKeyboardPatterns = checkKeyboardSlide(password);

  // Leet speak substitutions
  let hasLeetSub = false;
  // If the password contains standard numbers/symbols styled like leet-speak
  const leetIndicators = ['@', '0', '3', '4', '1', '!', '$', '5', '7', '+'];
  for (const item of leetIndicators) {
    if (password.includes(item)) {
      hasLeetSub = true;
    }
  }
  result.hasSubstitutions = hasLeetSub;

  // Dictionary lookup
  const variations = decodeLeetSpeak(password);
  let isCommon = false;
  for (const v of variations) {
    if (COMMON_PASSWORDS.has(v)) {
      isCommon = true;
    }
  }
  result.hasCommonWeakMatches = isCommon || COMMON_PASSWORDS.has(password.toLowerCase());

  // Pattern summary list setup
  if (result.hasCommonWeakMatches) result.detectedPatterns.push('Dictionary Threat (Matches common weak lists)');
  if (result.hasRepeatedChars) result.detectedPatterns.push('Repetitive Clusters (Contains repeated character series)');
  if (result.hasSequentialNumbers) result.detectedPatterns.push('Numerical Sequence (Contains consecutive increments, e.g. 123)');
  if (result.hasSequentialLetters) result.detectedPatterns.push('Alphabetic Sequence (Contains consecutive characters, e.g. abc)');
  if (result.hasKeyboardPatterns) result.detectedPatterns.push('Keyboard Slide (Pattern follows keyboard spatial grid, e.g. qwerty)');
  if (result.hasSubstitutions) result.detectedPatterns.push('Predictable Leet Substitutions (Character swaps like @ for a)');

  // Dynamic recommendations & scoring algorithm calculation
  // Base raw score centered on length & pool size
  // Standard NIST recommendation: length is the best metric!
  let baseScore = 0;
  if (password.length > 0) {
    // 5 points per character up to 10 chars, 8 points per, onwards
    baseScore += Math.min(password.length, 10) * 5;
    if (password.length > 10) {
      baseScore += (password.length - 10) * 6;
    }
  }

  // Character variety adjustments
  let classesCount = 0;
  if (result.hasLowercase) classesCount++;
  if (result.hasUppercase) classesCount++;
  if (result.hasNumbers) classesCount++;
  if (result.hasSymbols) classesCount++;

  baseScore += classesCount * 8; // Max 32 extra points for including all classes

  // Penalties
  let totalPenalties = 0;

  if (result.hasCommonWeakMatches) {
    totalPenalties += 65; // Massive penalty for known exposed security threats
  }
  if (password.length < 8) {
    totalPenalties += 40; // High warning
  } else if (password.length < 12) {
    totalPenalties += 15; // Low warning
  }
  
  if (result.hasRepeatedChars) totalPenalties += 12;
  if (result.hasSequentialNumbers || result.hasSequentialLetters) totalPenalties += 15;
  if (result.hasKeyboardPatterns) totalPenalties += 15;
  if (result.hasSubstitutions && classesCount <= 2) {
    // Leet-speak substitutions with very low character varieties generally mean weak predictability
    totalPenalties += 8;
  }

  // Calculate final score bounded between 1 (or 0 if empty) and 100
  let finalScore = Math.max(1, baseScore - totalPenalties);
  if (password.length === 0) finalScore = 0;
  result.score = Math.min(100, finalScore);

  // Map to human-readable strength level
  if (result.score <= 20) {
    result.strength = 'Very Weak';
  } else if (result.score <= 45) {
    result.strength = 'Weak';
  } else if (result.score <= 65) {
    result.strength = 'Medium';
  } else if (result.score <= 85) {
    result.strength = 'Strong';
  } else {
    result.strength = 'Very Strong';
  }

  // Populate dynamic recommendations
  if (password.length < 12) {
    result.recommendations.push({
      id: 'length',
      critical: password.length < 8,
      title: 'Short Password Length',
      description: `Your password is only ${password.length} characters long. Modern cybersecurity guidelines require at least 12-16 characters for core accounts.`,
      recommendation: 'Increase the total length to 16+ characters. Double the length of your password to exponentially compound brute-force search times.'
    });
  }

  if (result.hasCommonWeakMatches) {
    result.recommendations.push({
      id: 'dictionary',
      critical: true,
      title: 'Known Dictionary Match',
      description: 'This password forms a common combination currently indexed in global hacker dictionary dictionaries used for rapid brute-forcing.',
      recommendation: 'Discard this password entirely. Generate a random passphrase of unrelated words or an randomized sequence.'
    });
  }

  if (!result.hasUppercase && password.length > 0) {
    result.recommendations.push({
      id: 'uppercase',
      critical: false,
      title: 'Add Capital Letters',
      description: 'Your password consists exclusively of lowercase or non-alphabet chars, which narrows the attack search grid.',
      recommendation: 'Add mixed uppercase characters (A-Z) in un-predictable positions.'
    });
  }

  if (!result.hasSymbols && password.length > 0) {
    result.recommendations.push({
      id: 'symbols',
      critical: false,
      title: 'Missing Special Symbols',
      description: 'No special symbols (like !, @, #, $, %, etc.) were detected. Standard password guess pools search alphanumeric classes first.',
      recommendation: 'Integrate custom special characters. Place them randomly in intermediate characters, not just at the end.'
    });
  }

  if (!result.hasNumbers && password.length > 0) {
    result.recommendations.push({
      id: 'numbers',
      critical: false,
      title: 'Include Numbers',
      description: 'Injecting integer values creates wider mathematical pool variety.',
      recommendation: 'Scatter at least 2-3 numerical values randomly throughout the password.'
    });
  }

  if ((result.hasKeyboardPatterns || result.hasSequentialLetters || result.hasSequentialNumbers) && password.length > 0) {
    result.recommendations.push({
      id: 'predictable-patterns',
      critical: true,
      title: 'Sequential / Spatially Predictable Layout',
      description: 'Detected consecutive letters/keys (e.g., "123", "abc", "qwerty") representing keyboard slides or alphabetic scales.',
      recommendation: 'Avoid linear or continuous tracks. Scatter character positions randomly to prevent pattern-matching brute force logic.'
    });
  }

  if (result.hasRepeatedChars && password.length > 0) {
    result.recommendations.push({
      id: 'repetitions',
      critical: false,
      title: 'Repeated Chunks Observed',
      description: 'Consecutive repeats (e.g. "aaa", "xyzxyz") drastically lower the mathematical randomness of string patterns.',
      recommendation: 'Swap sequential duplicates with entirely unrelated character subsets.'
    });
  }

  return result;
}

/**
 * Random secure generator
 */
export function generatePassword(settings: GeneratorSettings): string {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let pool = '';
  let guaranteed: string[] = [];

  if (settings.includeLowercase) {
    pool += lowercaseChars;
    guaranteed.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]);
  }
  if (settings.includeUppercase) {
    pool += uppercaseChars;
    guaranteed.push(uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]);
  }
  if (settings.includeNumbers) {
    pool += numberChars;
    guaranteed.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
  }
  if (settings.includeSymbols) {
    pool += symbolChars;
    guaranteed.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);
  }

  // Default to letters if nothing selected
  if (pool === '') {
    pool = lowercaseChars + uppercaseChars;
    guaranteed.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]);
  }

  let generated = '';
  // Fill the remainder of the length
  const fillLength = settings.length - guaranteed.length;
  for (let i = 0; i < settings.length; i++) {
    // Try to mix guaranteed elements at randomized spots or simply append and shuffle
    const randomIndex = Math.floor(Math.random() * pool.length);
    generated += pool[randomIndex];
  }

  // Splice in the guaranteed chars to satisfy constraints
  const generatedArr = generated.split('');
  for (let i = 0; i < guaranteed.length; i++) {
    if (i < generatedArr.length) {
      generatedArr[i] = guaranteed[i];
    }
  }

  // Fisher-Yates shuffle array to avoid predictability of placing guaranteed keys first
  for (let i = generatedArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = generatedArr[i];
    generatedArr[i] = generatedArr[j];
    generatedArr[j] = temp;
  }

  return generatedArr.join('');
}

// Global tips array
export const CYBER_TIPS: CybersecurityTip[] = [
  {
    id: 'tip-1',
    category: 'General',
    title: 'The Passphrase Strategy',
    content: 'Instead of complex short passwords like "P@ssw0rd!", prefer long passphrases made of 4-5 concatenated random, unrelated dictionary words, such as "correcthorsebatterystaple". Length beats symbol replacement every single time.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'tip-2',
    category: 'MFA',
    title: 'Absolute Multi-Factor Security',
    content: 'Even a 100-character entropy-dense password can be phished or intercepted. Always bind critical credentials/accounts to hardware tokens (WebAuthn YubiKeys, Google Authenticator) as your critical layer of depth.',
    iconName: 'Smartphone'
  },
  {
    id: 'tip-3',
    category: 'Personal',
    title: 'Never Recycle Passwords',
    content: 'If an online forum is breached, attackers aggressively test your password + email combo across other banks, emails, and credit servers (Credential Stuffing). Every account triggers a unique secret.',
    iconName: 'RefreshCw'
  },
  {
    id: 'tip-4',
    category: 'Advanced',
    title: 'Utilize Password Vaults',
    content: 'Do not attempt to memorize 50 complex variations. Employ open-source or fully audited local/cloud password vaults (like Bitwarden, KeePassXC) to generate, organize, and auto-inject high-entropy passwords.',
    iconName: 'KeyRound'
  },
  {
    id: 'tip-5',
    category: 'Personal',
    title: 'Avoid Social Predictabilities',
    content: 'Attackers scan social media feeds for OSINT targets. Never append pet names, sports affiliations, zip codes, birthdays, or school years to your system passwords.',
    iconName: 'Users'
  },
  {
    id: 'tip-6',
    category: 'Corporate',
    title: 'Sanitize Clipboard Secrets',
    content: 'When copying sensitive credentials, copy buffers usually persist indefinitely in RAM/clipboard history tools (which malware can scan). Clean your clipboard manually or use managers that auto-wipe buffer states.',
    iconName: 'ClipboardX'
  }
];
