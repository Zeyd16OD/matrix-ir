# Matrix IR - Information Retrieval Matrix Visualization Tool

Matrix IR is a modern web application that processes text documents to build and visualize three information retrieval matrices:
1. Term-Document Incidence Matrix
2. Term-Document Count Matrix
3. Term-Document Weight Matrix (TF-IDF)

## Features

- **Modern User Interface**
  - Sleek, responsive design with the specified color palette
  - Dark/light mode toggle with persistent settings
  - Smooth animations and transitions

- **Document Input**
  - Multiple text input methods (direct paste or file upload)
  - Drag-and-drop file upload functionality
  - Add/remove documents as needed

- **Text Preprocessing Options**
  - Toggle for stopword removal
  - Toggle for stemming/lemmatization
  - Toggle for case sensitivity
  - Custom word exclusion

- **Visualization Features**
  - Interactive matrix display with color coding
  - Term highlighting across documents
  - Sorting by term frequency or alphabetically
  - Value highlighting for easier comparison
  - Search functionality within terms
  - Download matrices as CSV files

## Technical Implementation

- Vanilla JavaScript for all functionality
- Responsive CSS using the provided color palette
- Browser-based processing (no server required)
- Modular code structure for maintainability

## Getting Started

1. Open `index.html` in a web browser
2. Enter text documents or upload text files
3. Configure preprocessing options as needed
4. Click "Generate Matrices" to process and visualize

## Project Structure

```
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Stylesheet
├── js/
│   ├── app.js          # Main application logic
│   ├── favicon.js      # Dynamic favicon generation
│   ├── matrix.js       # Matrix processing functionality
│   ├── stemmer.js      # Stemming functionality
│   └── stopwords.js    # Stopwords list
└── assets/             # Optional assets folder
```

## Sample Documents

The application comes with four sample documents:
- **Doc1**: "ESST Higher School of Sciences and Technologies of Algiers aims to constitute a center of reference and excellence in higher education"
- **Doc2**: "Students at ESST are very nice and polite, but they talk a lot during the lectures"
- **Doc3**: "USTHB Houari Boumediene University of Science and Technology is an Algerian public university"
- **Doc4**: "Are students at USTHB nicer than students at ESST"
