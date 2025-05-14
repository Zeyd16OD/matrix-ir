/* This is a placeholder SVG favicon for Matrix IR */
const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#5409DA" rx="15" />
  <rect x="20" y="20" width="25" height="25" fill="#4E71FF" rx="5" />
  <rect x="55" y="20" width="25" height="25" fill="#8DD8FF" rx="5" />
  <rect x="20" y="55" width="25" height="25" fill="#BBFBFF" rx="5" />
  <rect x="55" y="55" width="25" height="25" fill="#4E71FF" rx="5" />
</svg>
`;

// Convert SVG to data URL
const svgBlob = new Blob([faviconSvg], { type: 'image/svg+xml' });
const svgUrl = URL.createObjectURL(svgBlob);

// Create favicon link
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';
favicon.href = svgUrl;
document.head.appendChild(favicon);
