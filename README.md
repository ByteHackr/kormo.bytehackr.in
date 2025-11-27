# ✦ Sundar Resume - Free & Open Source Resume Builder

A beautiful, simple, and completely free resume builder web application. Built entirely with open source technologies.

> **"Sundar"** means "Beautiful" - Create beautiful resumes for free!

## Features

- **Live Preview**: See your resume update in real-time as you type
- **14 Templates**: Designed for freshers, experienced professionals, and various industries
- **PDF Export**: Download your resume as a professional PDF
- **Auto-Save**: Your data is automatically saved to browser localStorage
- **100% Free**: No sign-up, no payments, no hidden fees
- **Privacy First**: All data stays in your browser - nothing sent to servers

## Templates

### For Freshers
- Fresh Graduate - Warm yellow tones, academic-focused
- Student - Green theme, emphasizes education & projects
- Entry Level - Purple gradient, modern & energetic

### For Experienced
- Classic Professional - Traditional serif typography
- Executive - Dark header with gold accents
- Modern - Blue header block, contemporary look

### By Profession
- Tech / Developer - Dark IDE-style with monospace font
- Creative / Designer - Colorful gradient sidebar
- Healthcare / Medical - Cyan/teal professional theme
- Academic / Research - Scholarly serif font
- Sales / Marketing - Bold red, high-impact design
- Legal / Finance - Conservative, formal style

### Minimal
- Simple Minimal - Clean, no-frills design
- Elegant - Soft purple, refined typography

## Open Source Technologies Used

| Technology | License | Purpose |
|------------|---------|---------|
| HTML5/CSS3/JavaScript | Open Standards | Core application |
| [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) | MIT | PDF generation |
| [Google Fonts](https://fonts.google.com/) | Open Font License | Typography |

## Getting Started

### Option 1: Open Directly
Simply open `index.html` in any modern web browser.

```bash
# Using your file manager, double-click index.html
# OR use a browser command:
firefox index.html
chromium index.html
google-chrome index.html
```

### Option 2: Local Server (Recommended)
For the best experience, run a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (with http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

## Project Structure

```
resume/
├── index.html      # Main HTML structure
├── style.css       # Styling and themes
├── script.js       # Application logic
└── README.md       # This file
```

## How to Use

1. **Fill in your details**: Enter your personal information, work experience, education, projects, and skills
2. **Choose a template**: Select from 14 templates organized by experience level and profession
3. **Preview in real-time**: See your resume update as you type
4. **Download as PDF**: Click the "Download PDF" button to get your resume

## Smart Features

- **Fresher templates** automatically order sections as: Education → Projects → Experience
- **Experienced templates** order sections as: Experience → Education → Projects
- **Projects section** with technology tags and GitHub links - perfect for freshers
- **Certifications section** to highlight your professional credentials

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Privacy

Sundar Resume is designed with privacy in mind:
- All processing happens in your browser
- Your data is stored only in your browser's localStorage
- No data is ever sent to external servers
- No analytics or tracking

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

This project is licensed under the MIT License - see below:

```
MIT License

Copyright (c) 2024 Sundar Resume

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Acknowledgments

- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for PDF generation
- Google Fonts for beautiful typography
- The open source community

---

✦ **Sundar Resume** - Beautiful Resumes, Completely Free
