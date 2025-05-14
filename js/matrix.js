/**
 * Matrix processing functionality
 * Handles the creation and manipulation of the three matrices:
 * - Term-Document Incidence Matrix
 * - Term-Document Count Matrix
 * - Term-Document Weight Matrix (TF-IDF)
 */
class MatrixProcessor {
    /**
     * Process documents and generate all matrices
     * @param {string[]} documents - Array of document texts
     * @param {object} options - Processing options
     * @returns {object} - Object containing all matrices and processed terms
     */
    static processDocuments(documents, options = {}) {
        if (!documents || documents.length === 0) {
            throw new Error('No documents to process');
        }
        
        const {
            removeStopwords = true,
            applyStemming = false,
            caseSensitive = false,
            excludeWords = []
        } = options;
        
        // Tokenize and preprocess documents
        const documentTokens = documents.map(text => {
            // Initial tokenization
            let tokens;
            if (caseSensitive) {
                tokens = text.match(/\b[A-Za-z]+\b/g) || [];
            } else {
                tokens = (text.toLowerCase().match(/\b[a-z]+\b/g) || []);
            }
            
            // Filter out stopwords
            if (removeStopwords) {
                tokens = tokens.filter(word => !STOPWORDS.includes(word.toLowerCase()));
            }
            
            // Filter out excluded words
            if (excludeWords.length > 0) {
                tokens = tokens.filter(word => !excludeWords.includes(word.toLowerCase()));
            }
            
            // Apply stemming
            if (applyStemming) {
                tokens = tokens.map(word => Stemmer.stem(word));
            }
            
            return tokens;
        });
        
        // Extract unique terms
        const allTerms = new Set();
        documentTokens.forEach(tokens => {
            tokens.forEach(term => allTerms.add(term));
        });
        
        // Convert to sorted array
        const processedTerms = Array.from(allTerms).sort();
        
        // Create Incidence Matrix
        const incidenceMatrix = this.createIncidenceMatrix(processedTerms, documentTokens);
        
        // Create Count Matrix
        const countMatrix = this.createCountMatrix(processedTerms, documentTokens);
        
        // Create TF-IDF Matrix
        const tfidfMatrix = this.calculateTFIDF(countMatrix, documents.length);
        
        return {
            processedTerms,
            incidenceMatrix,
            countMatrix,
            tfidfMatrix,
            termFrequencies: this.calculateTermFrequencies(countMatrix)
        };
    }
    
    /**
     * Create Term-Document Incidence Matrix
     * @param {string[]} terms - Array of unique terms
     * @param {string[][]} documentTokens - Array of tokenized documents
     * @returns {number[][]} - Incidence matrix
     */
    static createIncidenceMatrix(terms, documentTokens) {
        const matrix = Array(terms.length).fill().map(() => Array(documentTokens.length).fill(0));
        
        documentTokens.forEach((tokens, docIndex) => {
            const uniqueTokens = new Set(tokens);
            uniqueTokens.forEach(term => {
                const termIndex = terms.indexOf(term);
                if (termIndex !== -1) {
                    matrix[termIndex][docIndex] = 1;
                }
            });
        });
        
        return matrix;
    }
    
    /**
     * Create Term-Document Count Matrix
     * @param {string[]} terms - Array of unique terms
     * @param {string[][]} documentTokens - Array of tokenized documents
     * @returns {number[][]} - Count matrix
     */
    static createCountMatrix(terms, documentTokens) {
        const matrix = Array(terms.length).fill().map(() => Array(documentTokens.length).fill(0));
        
        documentTokens.forEach((tokens, docIndex) => {
            tokens.forEach(term => {
                const termIndex = terms.indexOf(term);
                if (termIndex !== -1) {
                    matrix[termIndex][docIndex]++;
                }
            });
        });
        
        return matrix;
    }
    
    /**
     * Calculate TF-IDF Matrix
     * @param {number[][]} countMatrix - Term-Document Count Matrix
     * @param {number} docCount - Number of documents
     * @returns {number[][]} - TF-IDF matrix
     */
    static calculateTFIDF(countMatrix, docCount) {
        const tfidf = [];
        
        // Calculate document frequencies (df)
        const documentFrequencies = countMatrix.map(row => {
            return row.filter(count => count > 0).length;
        });
        
        // Calculate TF-IDF for each term and document
        for (let termIndex = 0; termIndex < countMatrix.length; termIndex++) {
            const tfidfRow = [];
            
            for (let docIndex = 0; docIndex < docCount; docIndex++) {
                // Term frequency in document
                const tf = countMatrix[termIndex][docIndex];
                
                // Document frequency of term
                const df = documentFrequencies[termIndex];
                
                // Avoid division by zero
                if (df === 0) {
                    tfidfRow.push(0);
                    continue;
                }
                
                // Inverse document frequency
                const idf = Math.log10(docCount / df);
                
                // TF-IDF value
                const tfidfValue = tf * idf;
                tfidfRow.push(parseFloat(tfidfValue.toFixed(3)));
            }
            
            tfidf.push(tfidfRow);
        }
        
        return tfidf;
    }
    
    /**
     * Calculate term frequencies across all documents
     * @param {number[][]} countMatrix - Term-Document Count Matrix
     * @returns {number[]} - Array of term frequencies
     */
    static calculateTermFrequencies(countMatrix) {
        return countMatrix.map(row => row.reduce((sum, count) => sum + count, 0));
    }
    
    /**
     * Generate CSV content for a matrix
     * @param {number[][]} matrix - The matrix to convert to CSV
     * @param {string[]} docTitles - Array of document titles
     * @param {string[]} terms - Array of terms
     * @returns {string} - CSV content
     */
    static generateCSV(matrix, docTitles, terms) {
        let csvRows = [];
        
        // Header row with document titles
        csvRows.push(['Term', ...docTitles].join(','));
        
        // Data rows
        matrix.forEach((row, i) => {
            csvRows.push([terms[i], ...row].join(','));
        });
        
        return csvRows.join('\n');
    }
}
