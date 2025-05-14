/**
 * Stemming functionality for text preprocessing
 * This is a simplified Porter stemmer implementation
 */
class Stemmer {
    /**
     * Apply stemming to a word
     * @param {string} word - The word to stem
     * @returns {string} - The stemmed word
     */
    static stem(word) {
        if (!word) return word;
        
        word = word.toLowerCase();
        
        // Step 1: Handle plurals and past participles
        if (word.endsWith('sses')) {
            return word.slice(0, -2);
        } else if (word.endsWith('ies')) {
            return word.slice(0, -3) + 'y';
        } else if (word.endsWith('ss')) {
            return word;
        } else if (word.endsWith('s') && word.length > 3) {
            return word.slice(0, -1);
        }
        
        // Step 2: Handle common suffixes
        const step2Suffixes = [
            { suffix: 'ational', replacement: 'ate' },
            { suffix: 'tional', replacement: 'tion' },
            { suffix: 'enci', replacement: 'ence' },
            { suffix: 'anci', replacement: 'ance' },
            { suffix: 'izer', replacement: 'ize' },
            { suffix: 'alli', replacement: 'al' },
            { suffix: 'entli', replacement: 'ent' },
            { suffix: 'eli', replacement: 'e' },
            { suffix: 'ousli', replacement: 'ous' },
            { suffix: 'ization', replacement: 'ize' },
            { suffix: 'ation', replacement: 'ate' },
            { suffix: 'ator', replacement: 'ate' },
            { suffix: 'alism', replacement: 'al' },
            { suffix: 'iveness', replacement: 'ive' },
            { suffix: 'fulness', replacement: 'ful' },
            { suffix: 'ousness', replacement: 'ous' },
            { suffix: 'aliti', replacement: 'al' },
            { suffix: 'iviti', replacement: 'ive' },
            { suffix: 'biliti', replacement: 'ble' }
        ];
        
        for (const { suffix, replacement } of step2Suffixes) {
            if (word.endsWith(suffix)) {
                return word.slice(0, -suffix.length) + replacement;
            }
        }
        
        // Step 3: Handle more suffixes
        const step3Suffixes = [
            { suffix: 'icate', replacement: 'ic' },
            { suffix: 'ative', replacement: '' },
            { suffix: 'alize', replacement: 'al' },
            { suffix: 'iciti', replacement: 'ic' },
            { suffix: 'ical', replacement: 'ic' },
            { suffix: 'ful', replacement: '' },
            { suffix: 'ness', replacement: '' }
        ];
        
        for (const { suffix, replacement } of step3Suffixes) {
            if (word.endsWith(suffix)) {
                return word.slice(0, -suffix.length) + replacement;
            }
        }
        
        // Step 4: Handle even more suffixes
        const step4Suffixes = ['al', 'ance', 'ence', 'er', 'ic', 'able', 'ible', 'ant', 'ement', 
                               'ment', 'ent', 'ou', 'ism', 'ate', 'iti', 'ous', 'ive', 'ize'];
        
        for (const suffix of step4Suffixes) {
            if (word.endsWith(suffix) && word.length > suffix.length + 2) {
                return word.slice(0, -suffix.length);
            }
        }
        
        // Step 5: Handle endings
        if (word.endsWith('e') && word.length > 3) {
            return word.slice(0, -1);
        }
        
        return word;
    }
}
