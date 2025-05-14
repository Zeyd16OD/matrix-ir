/**
 * Main application file for Matrix IR
 * Handles UI interactions and visualization
 */
document.addEventListener('DOMContentLoaded', function() {
    // State variables
    let matrixData = null;
    let documentTitles = [];
    let sortedByFrequency = false;
    let highlightingActive = false;
    
    // DOM Elements
    const themeSwitch = document.getElementById('theme-switch');
    const pasteTextBtn = document.getElementById('paste-text-btn');
    const uploadFilesBtn = document.getElementById('upload-files-btn');
    const textInputContainer = document.getElementById('text-input-container');
    const fileUploadContainer = document.getElementById('file-upload-container');
    const addDocumentBtn = document.getElementById('add-document');
    const documentInputsContainer = document.querySelector('.document-inputs');
    const dropzone = document.querySelector('.dropzone');
    const fileInput = document.getElementById('file-upload');
    const filesList = document.getElementById('uploaded-files-list');
    const generateBtn = document.getElementById('generate-matrices');
    const resultsSection = document.getElementById('results-section');
    const loadingAnimation = document.querySelector('.loading-animation');
    const matrixTabs = document.querySelectorAll('.matrix-tab');
    const searchInput = document.getElementById('search-terms');
    const sortTermsBtn = document.getElementById('sort-terms-btn');
    const highlightValuesBtn = document.getElementById('highlight-values-btn');
    const downloadBtn = document.getElementById('download-matrix-btn');
    
    // Initialize the application
    initApp();
    
    function initApp() {
        // Theme toggle functionality
        initThemeToggle();
        
        // Document input toggle
        initDocumentInputToggle();
        
        // Document management
        initDocumentManagement();
        
        // File upload handling
        initFileUpload();
        
        // Matrix generation
        initMatrixGeneration();
        
        // Matrix visualization
        initMatrixVisualization();
    }
    
    // Theme Toggle Functionality
    function initThemeToggle() {
        themeSwitch.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeSwitch.checked = true;
        }
    }
    
    // Document Input Toggle
    function initDocumentInputToggle() {
        pasteTextBtn.addEventListener('click', function() {
            pasteTextBtn.classList.add('active');
            uploadFilesBtn.classList.remove('active');
            textInputContainer.classList.remove('hidden');
            fileUploadContainer.classList.add('hidden');
        });
        
        uploadFilesBtn.addEventListener('click', function() {
            uploadFilesBtn.classList.add('active');
            pasteTextBtn.classList.remove('active');
            fileUploadContainer.classList.remove('hidden');
            textInputContainer.classList.add('hidden');
        });
    }
    
    // Document Management
    function initDocumentManagement() {
        addDocumentBtn.addEventListener('click', function() {
            const docCount = document.querySelectorAll('.document-input').length + 1;
            const newDocument = document.createElement('div');
            newDocument.className = 'document-input';
            newDocument.innerHTML = `
                <div class="document-header">
                    <input type="text" class="document-title" value="Doc${docCount}" placeholder="Document Title">
                    <button class="remove-document"><i class="fas fa-times"></i></button>
                </div>
                <textarea class="document-text" placeholder="Enter document text here..."></textarea>
            `;
            
            documentInputsContainer.appendChild(newDocument);
            setupRemoveDocumentListeners();
        });
        
        // Initial setup for remove document buttons
        setupRemoveDocumentListeners();
    }
    
    // Remove document functionality
    function setupRemoveDocumentListeners() {
        const removeButtons = document.querySelectorAll('.remove-document');
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const documentInput = this.closest('.document-input');
                
                // Ensure there's always at least one document
                if (document.querySelectorAll('.document-input').length > 1) {
                    documentInput.remove();
                } else {
                    // Clear instead of remove if it's the last one
                    const titleInput = documentInput.querySelector('.document-title');
                    const textArea = documentInput.querySelector('.document-text');
                    titleInput.value = 'Doc1';
                    textArea.value = '';
                }
            });
        });
    }
    
    // File Upload Handling
    function initFileUpload() {
        // Handle file selection
        fileInput.addEventListener('change', handleFiles);
        
        // Handle drag & drop
        dropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            dropzone.classList.add('active');
        });
        
        dropzone.addEventListener('dragleave', function() {
            dropzone.classList.remove('active');
        });
        
        dropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            dropzone.classList.remove('active');
            
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleFiles();
            }
        });
        
        dropzone.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Process uploaded files
    function handleFiles() {
        if (fileInput.files.length > 0) {
            filesList.innerHTML = ''; // Clear the list first
            
            Array.from(fileInput.files).forEach((file, index) => {
                if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const fileDiv = document.createElement('div');
                        fileDiv.className = 'uploaded-file';
                        fileDiv.innerHTML = `
                            <div class="uploaded-file-name">
                                <i class="fas fa-file-alt"></i>
                                <span>${file.name}</span>
                            </div>
                            <button class="remove-file" data-index="${index}">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                        
                        filesList.appendChild(fileDiv);
                        
                        // Store file content
                        fileDiv.dataset.content = e.target.result;
                        fileDiv.dataset.filename = file.name.replace('.txt', '');
                        
                        setupRemoveFileListeners();
                    };
                    
                    reader.readAsText(file);
                }
            });
        }
    }
    
    // Remove file functionality
    function setupRemoveFileListeners() {
        const removeButtons = document.querySelectorAll('.remove-file');
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const fileDiv = this.closest('.uploaded-file');
                fileDiv.remove();
            });
        });
    }
    
    // Matrix Generation
    function initMatrixGeneration() {
        generateBtn.addEventListener('click', function() {
            // Show loading animation
            resultsSection.classList.remove('hidden');
            const resultsContent = document.querySelector('.results-content');
            resultsContent.style.display = 'none';
            loadingAnimation.classList.remove('hidden');
            
            // Simulate processing delay (for UX purposes)
            setTimeout(() => {
                // Process documents and generate matrices
                try {
                    processDocuments();
                    
                    // Hide loading, show results
                    loadingAnimation.classList.add('hidden');
                    resultsContent.style.display = 'grid';
                    
                    // Scroll to results
                    resultsSection.scrollIntoView({ behavior: 'smooth' });
                } catch (error) {
                    alert("Error processing documents: " + error.message);
                    resultsSection.classList.add('hidden');
                }
            }, 1500);
        });
    }
    
    // Matrix Visualization
    function initMatrixVisualization() {
        // Matrix tab switching
        matrixTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const matrixType = this.dataset.matrix;
                
                // Update tabs
                matrixTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update displays
                const matrixDisplays = document.querySelectorAll('.matrix-display');
                matrixDisplays.forEach(display => {
                    display.classList.remove('active');
                    if (display.id === `${matrixType}-matrix`) {
                        display.classList.add('active');
                    }
                });
            });
        });
        
        // Term search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const termItems = document.querySelectorAll('.term-item');
            
            termItems.forEach(item => {
                const term = item.querySelector('.term-text').textContent.toLowerCase();
                if (term.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
        
        // Sort terms button functionality
        sortTermsBtn.addEventListener('click', function() {
            sortedByFrequency = !sortedByFrequency;
            
            if (sortedByFrequency) {
                sortTermsBtn.innerHTML = '<i class="fas fa-sort"></i> Sort Alphabetically';
                sortTermsByFrequency();
            } else {
                sortTermsBtn.innerHTML = '<i class="fas fa-sort"></i> Sort by Frequency';
                sortTermsAlphabetically();
            }
            
            // Regenerate matrix views based on new order
            updateMatrixDisplays();
        });
        
        // Highlight values button functionality
        highlightValuesBtn.addEventListener('click', function() {
            highlightingActive = !highlightingActive;
            
            if (highlightingActive) {
                highlightValuesBtn.innerHTML = '<i class="fas fa-highlighter"></i> Remove Highlights';
                applyValueHighlighting();
            } else {
                highlightValuesBtn.innerHTML = '<i class="fas fa-highlighter"></i> Highlight Values';
                removeValueHighlighting();
            }
        });
        
        // Download matrix as CSV
        downloadBtn.addEventListener('click', function() {
            if (!matrixData) return;
            
            // Determine which matrix is currently active
            const activeMatrix = document.querySelector('.matrix-display.active');
            const matrixType = activeMatrix.id.replace('-matrix', '');
            
            // Get the appropriate data
            let csvContent;
            let filename;
            
            switch (matrixType) {
                case 'incidence':
                    csvContent = MatrixProcessor.generateCSV(matrixData.incidenceMatrix, documentTitles, matrixData.processedTerms);
                    filename = 'incidence_matrix.csv';
                    break;
                case 'count':
                    csvContent = MatrixProcessor.generateCSV(matrixData.countMatrix, documentTitles, matrixData.processedTerms);
                    filename = 'count_matrix.csv';
                    break;
                case 'tfidf':
                    csvContent = MatrixProcessor.generateCSV(matrixData.tfidfMatrix, documentTitles, matrixData.processedTerms);
                    filename = 'tfidf_matrix.csv';
                    break;
            }
            
            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    
    // Process documents and generate matrices
    function processDocuments() {
        // Get preprocessing options
        const removeStopwords = document.getElementById('remove-stopwords').checked;
        const applyStemming = document.getElementById('stemming').checked;
        const caseSensitive = document.getElementById('case-sensitive').checked;
        const excludeWordsInput = document.getElementById('exclude-words').value;
        const excludeWords = excludeWordsInput ? excludeWordsInput.split(',').map(word => word.trim().toLowerCase()) : [];
        
        // Collect documents from either text inputs or uploaded files
        const documentTexts = [];
        documentTitles = [];
        
        if (document.getElementById('text-input-container').classList.contains('hidden')) {
            // Get from uploaded files
            const uploadedFiles = document.querySelectorAll('.uploaded-file');
            
            uploadedFiles.forEach(file => {
                documentTitles.push(file.dataset.filename);
                documentTexts.push(file.dataset.content);
            });
        } else {
            // Get from text areas
            const documents = document.querySelectorAll('.document-input');
            
            documents.forEach(doc => {
                const title = doc.querySelector('.document-title').value;
                const text = doc.querySelector('.document-text').value;
                
                if (text.trim()) {
                    documentTitles.push(title);
                    documentTexts.push(text);
                }
            });
        }
        
        // Make sure we have documents to process
        if (documentTexts.length === 0) {
            throw new Error("Please add at least one document with content.");
        }
        
        // Process documents and generate matrices
        matrixData = MatrixProcessor.processDocuments(documentTexts, {
            removeStopwords,
            applyStemming,
            caseSensitive,
            excludeWords
        });
        
        // Display matrices in the UI
        displayTermList();
        updateMatrixDisplays();
        
        // Setup term highlighting functionality
        setupTermHighlighting();
    }
    
    // Display terms list with frequencies
    function displayTermList() {
        const termsList = document.getElementById('terms-list');
        termsList.innerHTML = '';
        
        // Create term items
        matrixData.processedTerms.forEach((term, index) => {
            const termItem = document.createElement('div');
            termItem.className = 'term-item';
            termItem.innerHTML = `
                <span class="term-text">${term}</span>
                <span class="term-freq">${matrixData.termFrequencies[index]}</span>
            `;
            termsList.appendChild(termItem);
        });
    }
    
    // Term highlight functionality
    function setupTermHighlighting() {
        const termItems = document.querySelectorAll('.term-item');
        
        termItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // Toggle highlight for this term
                this.classList.toggle('highlighted');
                
                // Highlight corresponding cells in matrices
                const isHighlighted = this.classList.contains('highlighted');
                const cells = document.querySelectorAll(`.term-${index}`);
                
                cells.forEach(cell => {
                    if (isHighlighted) {
                        cell.classList.add('highlight-pulse');
                    } else {
                        cell.classList.remove('highlight-pulse');
                    }
                });
            });
        });
    }
    
    // Sort terms alphabetically
    function sortTermsAlphabetically() {
        if (!matrixData) return;
        
        const indices = Array.from(matrixData.processedTerms.keys());
        indices.sort((a, b) => matrixData.processedTerms[a].localeCompare(matrixData.processedTerms[b]));
        
        reorderTermsAndMatrices(indices);
    }
    
    // Sort terms by frequency
    function sortTermsByFrequency() {
        if (!matrixData) return;
        
        const indices = Array.from(matrixData.processedTerms.keys());
        indices.sort((a, b) => matrixData.termFrequencies[b] - matrixData.termFrequencies[a]);
        
        reorderTermsAndMatrices(indices);
    }
    
    // Reorder terms and matrices based on provided indices
    function reorderTermsAndMatrices(indices) {
        // Reorder processed terms
        matrixData.processedTerms = indices.map(i => matrixData.processedTerms[i]);
        
        // Reorder matrices and frequencies
        matrixData.incidenceMatrix = indices.map(i => matrixData.incidenceMatrix[i]);
        matrixData.countMatrix = indices.map(i => matrixData.countMatrix[i]);
        matrixData.tfidfMatrix = indices.map(i => matrixData.tfidfMatrix[i]);
        matrixData.termFrequencies = indices.map(i => matrixData.termFrequencies[i]);
        
        // Update UI
        displayTermList();
    }
    
    // Update matrix displays
    function updateMatrixDisplays() {
        if (!matrixData) return;
        
        createMatrixDisplay('incidence-matrix', matrixData.incidenceMatrix);
        createMatrixDisplay('count-matrix', matrixData.countMatrix);
        createMatrixDisplay('tfidf-matrix', matrixData.tfidfMatrix);
        
        // Reapply highlighting if active
        if (highlightingActive) {
            applyValueHighlighting();
        }
    }
    
    // Create matrix display
    function createMatrixDisplay(containerId, matrix) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        const table = document.createElement('table');
        table.className = 'matrix-table';
        
        // Create header row with document titles
        const headerRow = document.createElement('tr');
        const cornerHeader = document.createElement('th');
        cornerHeader.textContent = 'Terms \\ Docs';
        headerRow.appendChild(cornerHeader);
        
        documentTitles.forEach(title => {
            const th = document.createElement('th');
            th.textContent = title;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
        
        // Create rows for each term
        matrixData.processedTerms.forEach((term, termIndex) => {
            const row = document.createElement('tr');
            
            // Term name in first column
            const termCell = document.createElement('td');
            termCell.textContent = term;
            row.appendChild(termCell);
            
            // Values for each document
            matrix[termIndex].forEach((value, docIndex) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                cell.classList.add(`term-${termIndex}`);
                
                // Add styling based on value
                if (containerId === 'incidence-matrix') {
                    cell.classList.add(`cell-${value}`);
                }
                
                row.appendChild(cell);
            });
            
            table.appendChild(row);
        });
        
        container.appendChild(table);
    }
    
    // Apply color highlighting to values in matrices
    function applyValueHighlighting() {
        const activeMatrix = document.querySelector('.matrix-display.active');
        
        if (activeMatrix.id === 'tfidf-matrix' || activeMatrix.id === 'count-matrix') {
            const cells = activeMatrix.querySelectorAll('td:not(:first-child)');
            const values = Array.from(cells).map(cell => parseFloat(cell.textContent));
            
            // Skip empty cells
            if (values.length === 0) return;
            
            // Get min and max values
            const nonZeroValues = values.filter(v => v > 0);
            const min = Math.min(...nonZeroValues);
            const max = Math.max(...values);
            const third = (max - min) / 3;
            
            // Apply highlighting based on value ranges
            cells.forEach(cell => {
                const value = parseFloat(cell.textContent);
                
                // Reset previous highlighting
                cell.classList.remove('cell-highlight-low', 'cell-highlight-mid', 'cell-highlight-high');
                
                if (value === 0) {
                    // No highlighting for zero values
                } else if (value <= min + third) {
                    cell.classList.add('cell-highlight-low');
                } else if (value <= min + 2 * third) {
                    cell.classList.add('cell-highlight-mid');
                } else {
                    cell.classList.add('cell-highlight-high');
                }
            });
        }
    }
    
    // Remove color highlighting
    function removeValueHighlighting() {
        const cells = document.querySelectorAll('.matrix-display td');
        
        cells.forEach(cell => {
            cell.classList.remove('cell-highlight-low', 'cell-highlight-mid', 'cell-highlight-high');
        });
    }
});
