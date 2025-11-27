/**
 * KormoNama - Free & Open Source Resume Builder
 * Build Your Career Story
 * JavaScript functionality for live preview and PDF export
 * License: MIT
 */

// ============================================
// THEME TOGGLE FUNCTIONALITY
// ============================================

// Initialize theme on page load (runs immediately)
(function initTheme() {
    const savedTheme = localStorage.getItem('kormoNamaTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

// Toggle between dark and light themes
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('kormoNamaTheme', newTheme);
    
    // Update icon
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Setup theme toggle button
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    // Update theme icon
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
    }
    
    initializeEventListeners();
    loadFromLocalStorage();
    
    // Check if coming from templates page with a selected template
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get('template');
    const storedTemplate = localStorage.getItem('kormoNamaSelectedTemplate');
    
    if (templateParam) {
        document.getElementById('templateSelect').value = templateParam;
        localStorage.removeItem('kormoNamaSelectedTemplate');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (storedTemplate) {
        document.getElementById('templateSelect').value = storedTemplate;
        localStorage.removeItem('kormoNamaSelectedTemplate');
    }
    
    updatePreview();
});

// Setup event listeners for all form inputs
function initializeEventListeners() {
    // Personal info inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updatePreview();
            saveToLocalStorage();
        });
    });
}

// Handle photo upload
function handlePhotoUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePhotoBase64').value = e.target.result;
            updatePreview();
            saveToLocalStorage();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Update the resume preview based on form data
function updatePreview() {
    const template = document.getElementById('templateSelect').value;
    const resumeContent = document.getElementById('resumeContent');
    
    // Apply template class
    resumeContent.className = 'resume-content ' + template;
    
    // Get form values
    const fullName = document.getElementById('fullName').value || 'Your Name';
    const jobTitle = document.getElementById('jobTitle').value || 'Your Job Title';
    const email = document.getElementById('email').value || 'email@example.com';
    const phone = document.getElementById('phone').value || '+1 234 567 890';
    const location = document.getElementById('location').value || 'Location';
    const linkedin = document.getElementById('linkedin').value;
    const website = document.getElementById('website').value;
    const github = document.getElementById('github').value;
    const summary = document.getElementById('summary').value;
    const skills = document.getElementById('skills').value;
    const softSkills = document.getElementById('softSkills').value;
    const languages = document.getElementById('languages').value;
    const photoBase64 = document.getElementById('profilePhotoBase64').value;
    
    // Build contact HTML with clickable links
    const contactHTML = buildContactHTML(email, phone, location, linkedin, website, github);
    
    // Build all sections HTML
    const experienceHTML = buildExperienceHTML();
    const educationHTML = buildEducationHTML();
    const projectsHTML = buildProjectsHTML();
    const certificationsHTML = buildCertificationsHTML();
    const skillsHTML = buildSkillsHTML(skills);
    const softSkillsHTML = buildSkillsHTML(softSkills);
    const languagesHTML = buildLanguagesHTML(languages);
    
    // Special layout for Modern Split template
    if (template === 'modern-split') {
        resumeContent.innerHTML = `
            <div class="header-section">
                ${photoBase64 ? `<div class="profile-photo"><img src="${photoBase64}" alt="Profile"></div>` : ''}
                <div class="header-text">
                    <h1 class="resume-name">${escapeHtml(fullName)}</h1>
                    <p class="resume-title">${escapeHtml(jobTitle)}</p>
                </div>
                ${summary ? `<p class="header-summary">${escapeHtml(summary)}</p>` : ''}
            </div>
            
            <div class="contact-bar">
                ${contactHTML}
            </div>
            
            <div class="main-grid">
                <div class="column-left">
                    ${experienceHTML ? `
                    <div class="resume-section">
                        <h2><i class="fas fa-briefcase"></i> Work Experience</h2>
                        <div class="resume-experience">${experienceHTML}</div>
                    </div>
                    ` : ''}
                    
                    ${projectsHTML ? `
                    <div class="resume-section">
                        <h2><i class="fas fa-code"></i> Projects</h2>
                        <div class="resume-projects">${projectsHTML}</div>
                    </div>
                    ` : ''}
                    
                    ${certificationsHTML ? `
                    <div class="resume-section">
                        <h2><i class="fas fa-certificate"></i> Workshops & Training</h2>
                        <div class="resume-certifications">${certificationsHTML}</div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="column-right">
                    ${skillsHTML ? `
                    <div class="resume-section">
                        <h2><i class="fas fa-tools"></i> Hard Skills</h2>
                        <div class="resume-skills vertical-list">${skillsHTML}</div>
                    </div>
                    ` : ''}
                    
                    ${softSkillsHTML ? `
                    <div class="resume-section">
                        <h2><i class="fas fa-lightbulb"></i> Soft Skills</h2>
                        <div class="resume-skills tag-cloud">${softSkillsHTML}</div>
                    </div>
                    ` : ''}
                    
                    ${educationHTML ? `
                    <div class="resume-section">
                        <h2><i class="fas fa-graduation-cap"></i> Education</h2>
                        <div class="resume-education simple-list">${educationHTML}</div>
                    </div>
                    ` : ''}
                    
                    ${languagesHTML ? `
                    <div class="resume-section">
                        <h2><i class="fas fa-language"></i> Languages</h2>
                        <div class="resume-languages">${languagesHTML}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        return;
    }

    // Special layout for Clean Blue template
    if (template === 'clean-blue') {
        resumeContent.innerHTML = `
            <div class="resume-header">
                ${photoBase64 ? `<div class="profile-photo"><img src="${photoBase64}" alt="Profile"></div>` : ''}
                <h1 class="resume-name">${escapeHtml(fullName)}</h1>
                <div class="resume-contact">${contactHTML}</div>
            </div>
            
            ${summary ? `
            <div class="resume-section">
                <h2>Resume Objective</h2>
                <p class="resume-summary">${escapeHtml(summary)}</p>
            </div>
            ` : ''}
            
            ${educationHTML ? `
            <div class="resume-section">
                <h2>Education</h2>
                <div class="resume-education">${educationHTML}</div>
            </div>
            ` : ''}
            
            ${skillsHTML ? `
            <div class="resume-section">
                <h2>Skills</h2>
                <div class="resume-skills">${skillsHTML}</div>
            </div>
            ` : ''}
            
            ${experienceHTML ? `
            <div class="resume-section">
                <h2>Work History</h2>
                <div class="resume-experience">${experienceHTML}</div>
            </div>
            ` : ''}
            
            ${projectsHTML ? `
            <div class="resume-section">
                <h2>Accomplishments</h2>
                <div class="resume-projects">${projectsHTML}</div>
            </div>
            ` : ''}
        `;
        return;
    }

    // Special layout for Executive Orange template
    if (template === 'executive-orange') {
        resumeContent.innerHTML = `
            <div class="resume-header">
                <h1 class="resume-name">${escapeHtml(fullName)}</h1>
            </div>
            
            <div class="main-grid">
                <div class="column-left">
                    ${summary ? `
                    <div class="resume-section">
                        <h2>Professional Summary</h2>
                        <p class="resume-summary">${escapeHtml(summary)}</p>
                    </div>
                    ` : ''}
                    
                    ${experienceHTML ? `
                    <div class="resume-section">
                        <h2>Work History</h2>
                        <div class="resume-experience">${experienceHTML}</div>
                    </div>
                    ` : ''}
                    
                    ${educationHTML ? `
                    <div class="resume-section">
                        <h2>Education & Training</h2>
                        <div class="resume-education">${educationHTML}</div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="column-right">
                    ${photoBase64 ? `<div class="profile-photo"><img src="${photoBase64}" alt="Profile"></div>` : ''}
                    
                    <div class="resume-section">
                        <h2>Contact</h2>
                        <div class="resume-contact">
                            ${contactHTML.split('•').map(item => `<span>${item}</span>`).join('')}
                        </div>
                    </div>
                    
                    ${skillsHTML ? `
                    <div class="resume-section">
                        <h2>Skills</h2>
                        <div class="resume-skills vertical-list">${skillsHTML}</div>
                    </div>
                    ` : ''}
                    
                    ${certificationsHTML ? `
                    <div class="resume-section">
                        <h2>Certifications</h2>
                        <div class="resume-certifications">${certificationsHTML}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        return;
    }
    
    // Determine section order based on template (freshers get projects before experience)
    const isFresherTemplate = ['fresh-graduate', 'student', 'entry-level'].includes(template);
    
    // Update resume content
    resumeContent.innerHTML = `
        <div class="resume-header">
            <h1 class="resume-name">${escapeHtml(fullName)}</h1>
            <p class="resume-title">${escapeHtml(jobTitle)}</p>
            <div class="resume-contact">${contactHTML}</div>
        </div>
        
        ${summary ? `
        <div class="resume-section">
            <h2>Professional Summary</h2>
            <p class="resume-summary">${escapeHtml(summary)}</p>
        </div>
        ` : ''}
        
        ${isFresherTemplate ? `
            ${educationHTML ? `
            <div class="resume-section">
                <h2>Education</h2>
                <div class="resume-education">${educationHTML}</div>
            </div>
            ` : ''}
            
            ${projectsHTML ? `
            <div class="resume-section">
                <h2>Projects</h2>
                <div class="resume-projects">${projectsHTML}</div>
            </div>
            ` : ''}
            
            ${experienceHTML ? `
            <div class="resume-section">
                <h2>Experience</h2>
                <div class="resume-experience">${experienceHTML}</div>
            </div>
            ` : ''}
        ` : `
            ${experienceHTML ? `
            <div class="resume-section">
                <h2>Experience</h2>
                <div class="resume-experience">${experienceHTML}</div>
            </div>
            ` : ''}
            
            ${educationHTML ? `
            <div class="resume-section">
                <h2>Education</h2>
                <div class="resume-education">${educationHTML}</div>
            </div>
            ` : ''}
            
            ${projectsHTML ? `
            <div class="resume-section">
                <h2>Projects</h2>
                <div class="resume-projects">${projectsHTML}</div>
            </div>
            ` : ''}
        `}
        
        ${certificationsHTML ? `
        <div class="resume-section">
            <h2>Certifications</h2>
            <div class="resume-certifications">${certificationsHTML}</div>
        </div>
        ` : ''}
        
        ${skillsHTML ? `
        <div class="resume-section">
            <h2>Skills</h2>
            <div class="resume-skills">${skillsHTML}</div>
        </div>
        ` : ''}
    `;
}

// Build experience section HTML
function buildExperienceHTML() {
    const entries = document.querySelectorAll('.experience-entry');
    let html = '';
    
    entries.forEach(entry => {
        const title = entry.querySelector('.exp-title').value;
        const company = entry.querySelector('.exp-company').value;
        const startDate = entry.querySelector('.exp-start').value;
        const endDate = entry.querySelector('.exp-end').value;
        const description = entry.querySelector('.exp-description').value;
        
        if (title || company) {
            html += `
                <div class="exp-item">
                    <div class="exp-header">
                        <span class="exp-title-company">${escapeHtml(title)}</span>
                        <span class="exp-dates">${escapeHtml(startDate)}${startDate && endDate ? ' - ' : ''}${escapeHtml(endDate)}</span>
                    </div>
                    ${company ? `<div class="exp-company">${escapeHtml(company)}</div>` : ''}
                    ${description ? `<div class="exp-description">${escapeHtml(description)}</div>` : ''}
                </div>
            `;
        }
    });
    
    return html;
}

// Build education section HTML
function buildEducationHTML() {
    const entries = document.querySelectorAll('.education-entry');
    let html = '';
    
    entries.forEach(entry => {
        const degree = entry.querySelector('.edu-degree').value;
        const institution = entry.querySelector('.edu-institution').value;
        const year = entry.querySelector('.edu-year').value;
        const grade = entry.querySelector('.edu-grade').value;
        
        if (degree || institution) {
            html += `
                <div class="edu-item">
                    <div class="edu-header">
                        <span class="edu-degree">${escapeHtml(degree)}</span>
                        <span class="edu-year">${escapeHtml(year)}</span>
                    </div>
                    ${institution ? `<div class="edu-institution">${escapeHtml(institution)}${grade ? ' | ' + escapeHtml(grade) : ''}</div>` : ''}
                </div>
            `;
        }
    });
    
    return html;
}

// Build projects section HTML
function buildProjectsHTML() {
    const entries = document.querySelectorAll('.project-entry');
    let html = '';
    
    entries.forEach(entry => {
        const name = entry.querySelector('.proj-name').value;
        const tech = entry.querySelector('.proj-tech').value;
        const link = entry.querySelector('.proj-link').value;
        const duration = entry.querySelector('.proj-duration').value;
        const description = entry.querySelector('.proj-description').value;
        
        if (name || description) {
            html += `
                <div class="proj-item">
                    <div class="proj-header">
                        <span class="proj-title">${escapeHtml(name)}${link ? ` <a href="${escapeHtml(link)}" class="proj-link-url" target="_blank">↗</a>` : ''}</span>
                        <span class="proj-dates">${escapeHtml(duration)}</span>
                    </div>
                    ${tech ? `<div class="proj-tech-used">${escapeHtml(tech)}</div>` : ''}
                    ${description ? `<div class="proj-desc">${escapeHtml(description)}</div>` : ''}
                </div>
            `;
        }
    });
    
    return html;
}

// Build contact section HTML with clickable links
function buildContactHTML(email, phone, location, linkedin, website, github) {
    let parts = [];
    
    // Email with mailto link
    if (email) {
        parts.push(`<a href="mailto:${escapeHtml(email)}" class="contact-link">${escapeHtml(email)}</a>`);
    }
    
    // Phone
    if (phone) {
        parts.push(`<a href="tel:${escapeHtml(phone.replace(/\s/g, ''))}" class="contact-link">${escapeHtml(phone)}</a>`);
    }
    
    // Location (not a link)
    if (location) {
        parts.push(`<span>${escapeHtml(location)}</span>`);
    }
    
    // LinkedIn
    if (linkedin) {
        const linkedinDisplay = linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
        parts.push(`<a href="${escapeHtml(linkedin)}" target="_blank" class="contact-link">🔗 ${escapeHtml(linkedinDisplay)}</a>`);
    }
    
    // Website
    if (website) {
        const websiteDisplay = website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
        parts.push(`<a href="${escapeHtml(website)}" target="_blank" class="contact-link">🌐 ${escapeHtml(websiteDisplay)}</a>`);
    }
    
    // GitHub
    if (github) {
        const githubDisplay = github.replace(/^https?:\/\/(www\.)?github\.com\/?/, '');
        parts.push(`<a href="${escapeHtml(github)}" target="_blank" class="contact-link">⌨ ${escapeHtml(githubDisplay)}</a>`);
    }
    
    return parts.join('<span class="contact-separator">•</span>');
}

// Build certifications section HTML
function buildCertificationsHTML() {
    const entries = document.querySelectorAll('.certification-entry');
    let html = '';
    
    entries.forEach(entry => {
        const name = entry.querySelector('.cert-name').value;
        const issuer = entry.querySelector('.cert-issuer').value;
        const year = entry.querySelector('.cert-year').value;
        const link = entry.querySelector('.cert-link').value;
        
        if (name) {
            const certText = `${escapeHtml(name)}${issuer ? ' - ' + escapeHtml(issuer) : ''}${year ? ' (' + escapeHtml(year) + ')' : ''}`;
            
            if (link) {
                html += `<div class="cert-item"><a href="${escapeHtml(link)}" target="_blank" class="cert-link-url">${certText} ↗</a></div>`;
            } else {
                html += `<div class="cert-item">${certText}</div>`;
            }
        }
    });
    
    return html;
}

// Build skills section HTML
function buildSkillsHTML(skills) {
    if (!skills) return '';
    
    const skillArray = skills.split(',').map(s => s.trim()).filter(s => s);
    return skillArray.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('');
}

// Build languages section HTML
function buildLanguagesHTML(languages) {
    if (!languages) return '';
    
    const langArray = languages.split(',').map(s => s.trim()).filter(s => s);
    return langArray.map(lang => `<div class="lang-item">${escapeHtml(lang)}</div>`).join('');
}

// Add new experience entry
function addExperience() {
    const container = document.getElementById('experienceContainer');
    const index = container.querySelectorAll('.experience-entry').length;
    
    const entry = document.createElement('div');
    entry.className = 'experience-entry';
    entry.dataset.index = index;
    entry.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Job Title</label>
                <input type="text" class="exp-title" placeholder="Software Engineer">
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" class="exp-company" placeholder="Tech Company Inc.">
            </div>
            <div class="form-group">
                <label>Start Date</label>
                <input type="text" class="exp-start" placeholder="Jan 2020">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="text" class="exp-end" placeholder="Present">
            </div>
        </div>
        <div class="form-group full-width">
            <label>Description</label>
            <textarea class="exp-description" rows="3" placeholder="• Led development of key features&#10;• Improved performance by 40%&#10;• Mentored junior developers"></textarea>
        </div>
        <button type="button" class="btn-remove" onclick="removeExperience(this)">Remove</button>
    `;
    
    container.appendChild(entry);
    
    // Add event listeners to new inputs
    entry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            updatePreview();
            saveToLocalStorage();
        });
    });
    
    updatePreview();
}

// Remove experience entry
function removeExperience(button) {
    const entry = button.closest('.experience-entry');
    entry.remove();
    updatePreview();
    saveToLocalStorage();
}

// Add new education entry
function addEducation() {
    const container = document.getElementById('educationContainer');
    const index = container.querySelectorAll('.education-entry').length;
    
    const entry = document.createElement('div');
    entry.className = 'education-entry';
    entry.dataset.index = index;
    entry.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Degree</label>
                <input type="text" class="edu-degree" placeholder="Bachelor of Science in Computer Science">
            </div>
            <div class="form-group">
                <label>Institution</label>
                <input type="text" class="edu-institution" placeholder="University of Technology">
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" class="edu-year" placeholder="2016 - 2020">
            </div>
            <div class="form-group">
                <label>Grade/GPA (Optional)</label>
                <input type="text" class="edu-grade" placeholder="3.8/4.0">
            </div>
        </div>
        <button type="button" class="btn-remove" onclick="removeEducation(this)">Remove</button>
    `;
    
    container.appendChild(entry);
    
    // Add event listeners to new inputs
    entry.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            updatePreview();
            saveToLocalStorage();
        });
    });
    
    updatePreview();
}

// Remove education entry
function removeEducation(button) {
    const entry = button.closest('.education-entry');
    entry.remove();
    updatePreview();
    saveToLocalStorage();
}

// Add new project entry
function addProject() {
    const container = document.getElementById('projectsContainer');
    const index = container.querySelectorAll('.project-entry').length;
    
    const entry = document.createElement('div');
    entry.className = 'project-entry';
    entry.dataset.index = index;
    entry.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Project Name</label>
                <input type="text" class="proj-name" placeholder="E-commerce Website">
            </div>
            <div class="form-group">
                <label>Technologies Used</label>
                <input type="text" class="proj-tech" placeholder="React, Node.js, MongoDB">
            </div>
            <div class="form-group">
                <label>Project Link (Optional)</label>
                <input type="url" class="proj-link" placeholder="github.com/username/project">
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="text" class="proj-duration" placeholder="Jan 2024 - Mar 2024">
            </div>
        </div>
        <div class="form-group full-width">
            <label>Description</label>
            <textarea class="proj-description" rows="2" placeholder="• Built a full-stack e-commerce platform&#10;• Implemented secure payment processing"></textarea>
        </div>
        <button type="button" class="btn-remove" onclick="removeProject(this)">Remove</button>
    `;
    
    container.appendChild(entry);
    
    // Add event listeners to new inputs
    entry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            updatePreview();
            saveToLocalStorage();
        });
    });
    
    updatePreview();
}

// Remove project entry
function removeProject(button) {
    const entry = button.closest('.project-entry');
    entry.remove();
    updatePreview();
    saveToLocalStorage();
}

// Add new certification entry
function addCertification() {
    const container = document.getElementById('certificationsContainer');
    const index = container.querySelectorAll('.certification-entry').length;
    
    const entry = document.createElement('div');
    entry.className = 'certification-entry';
    entry.dataset.index = index;
    entry.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Certification Name</label>
                <input type="text" class="cert-name" placeholder="AWS Certified Solutions Architect">
            </div>
            <div class="form-group">
                <label>Issuer</label>
                <input type="text" class="cert-issuer" placeholder="Amazon Web Services">
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" class="cert-year" placeholder="2024">
            </div>
            <div class="form-group">
                <label>Certificate Link (Optional)</label>
                <input type="url" class="cert-link" placeholder="https://credential.net/abc123">
            </div>
        </div>
        <button type="button" class="btn-remove" onclick="removeCertification(this)">Remove</button>
    `;
    
    container.appendChild(entry);
    
    // Add event listeners to new inputs
    entry.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            updatePreview();
            saveToLocalStorage();
        });
    });
    
    updatePreview();
}

// Remove certification entry
function removeCertification(button) {
    const entry = button.closest('.certification-entry');
    entry.remove();
    updatePreview();
    saveToLocalStorage();
}

// Download resume as PDF using html2pdf.js (Open Source - MIT License)
function downloadPDF() {
    const resumeContent = document.getElementById('resumeContent');
    const fullName = document.getElementById('fullName').value || 'resume';
    
    if (!resumeContent || !resumeContent.innerHTML.trim()) {
        alert('Please fill in your resume details first.');
        return;
    }
    
    // Show loading state
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>⏳</span> Generating...';
    btn.disabled = true;
    
    // Create a wrapper for PDF generation with explicit styles
    const wrapper = document.createElement('div');
    wrapper.innerHTML = resumeContent.outerHTML;
    const pdfContent = wrapper.firstChild;
    
    // Apply explicit inline styles to override CSS variables
    pdfContent.style.cssText = `
        background: #ffffff !important;
        color: #1f2937 !important;
        padding: 40px !important;
        font-family: 'Crimson Pro', Georgia, serif !important;
        font-size: 11pt !important;
        line-height: 1.5 !important;
        width: 210mm !important;
        min-height: auto !important;
        box-shadow: none !important;
    `;
    
    // Fix all text colors in the cloned content
    pdfContent.querySelectorAll('*').forEach(el => {
        const computed = window.getComputedStyle(el);
        if (computed.color) {
            el.style.color = computed.color;
        }
        if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            el.style.backgroundColor = computed.backgroundColor;
        }
    });
    
    // Temporarily add to DOM (hidden)
    wrapper.style.cssText = 'position: absolute; left: -9999px; top: 0;';
    document.body.appendChild(wrapper);
    
    // Configure PDF options
    const options = {
        margin: [5, 5, 5, 5],
        filename: `${fullName.replace(/\s+/g, '_')}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    // Generate and download PDF
    html2pdf()
        .set(options)
        .from(pdfContent)
        .save()
        .then(() => {
            document.body.removeChild(wrapper);
            btn.innerHTML = originalText;
            btn.disabled = false;
        })
        .catch((err) => {
            console.error('PDF generation error:', err);
            document.body.removeChild(wrapper);
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('Error generating PDF. Please try again.');
        });
}

// ============================================
// RESUME IMPORT & PARSING
// ============================================

// Handle file import
function handleFileImport(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        
        // Check if it's JSON format (exported data)
        if (file.name.endsWith('.json')) {
            try {
                const data = JSON.parse(content);
                loadFormData(data);
                alert('Resume data imported successfully!');
                return;
            } catch (err) {
                // Not valid JSON, treat as text
            }
        }
        
        // Put text content in the textarea
        document.getElementById('importResume').value = content;
    };
    reader.readAsText(file);
}

// Parse imported resume text and fill form
function parseImportedResume() {
    const text = document.getElementById('importResume').value.trim();
    if (!text) {
        alert('Please paste or upload your resume text first.');
        return;
    }
    
    // Parse the resume text
    const parsed = parseResumeText(text);
    
    // Fill form with parsed data
    if (parsed.name) document.getElementById('fullName').value = parsed.name;
    if (parsed.email) document.getElementById('email').value = parsed.email;
    if (parsed.phone) document.getElementById('phone').value = parsed.phone;
    if (parsed.location) document.getElementById('location').value = parsed.location;
    if (parsed.linkedin) document.getElementById('linkedin').value = parsed.linkedin;
    if (parsed.github) document.getElementById('github').value = parsed.github;
    if (parsed.website) document.getElementById('website').value = parsed.website;
    if (parsed.title) document.getElementById('jobTitle').value = parsed.title;
    if (parsed.summary) document.getElementById('summary').value = parsed.summary;
    if (parsed.skills) document.getElementById('skills').value = parsed.skills;
    
    // Clear import textarea
    document.getElementById('importResume').value = '';
    
    // Update preview and save
    updatePreview();
    saveToLocalStorage();
    
    alert('Resume parsed! Please review and adjust the filled information.');
}

// Parse resume text into structured data
function parseResumeText(text) {
    const result = {};
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    // Email pattern
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) result.email = emailMatch[0];
    
    // Phone pattern (various formats)
    const phoneMatch = text.match(/(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{10,14}/);
    if (phoneMatch) result.phone = phoneMatch[0];
    
    // LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) result.linkedin = 'https://' + linkedinMatch[0];
    
    // GitHub
    const githubMatch = text.match(/github\.com\/[\w-]+/i);
    if (githubMatch) result.github = 'https://' + githubMatch[0];
    
    // Website (generic URL)
    const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:\/\S*)?/);
    if (websiteMatch && !websiteMatch[0].includes('linkedin') && !websiteMatch[0].includes('github')) {
        result.website = websiteMatch[0].startsWith('http') ? websiteMatch[0] : 'https://' + websiteMatch[0];
    }
    
    // First line is often the name
    if (lines[0] && !lines[0].includes('@') && !lines[0].includes('http') && lines[0].length < 50) {
        result.name = lines[0];
    }
    
    // Look for job title (often second line or after name)
    const titleKeywords = ['developer', 'engineer', 'designer', 'manager', 'analyst', 'consultant', 
                          'architect', 'specialist', 'coordinator', 'assistant', 'director', 'lead',
                          'senior', 'junior', 'intern', 'executive', 'officer', 'administrator'];
    for (let i = 1; i < Math.min(5, lines.length); i++) {
        const line = lines[i].toLowerCase();
        if (titleKeywords.some(k => line.includes(k))) {
            result.title = lines[i];
            break;
        }
    }
    
    // Location patterns
    const locationMatch = text.match(/(?:located in|location|address|city)[:\s]*([A-Za-z\s,]+)/i) ||
                         text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),\s*([A-Z]{2}|[A-Z][a-z]+)/);
    if (locationMatch) {
        result.location = locationMatch[1] ? locationMatch[1].trim() : locationMatch[0].trim();
    }
    
    // Skills section
    const skillsMatch = text.match(/(?:skills|technical skills|technologies)[:\s]*([\s\S]*?)(?:\n\n|\n[A-Z]|$)/i);
    if (skillsMatch) {
        result.skills = skillsMatch[1]
            .replace(/[•\-\*]/g, ',')
            .replace(/\n/g, ', ')
            .replace(/,\s*,/g, ',')
            .replace(/^\s*,|,\s*$/g, '')
            .trim();
    }
    
    // Summary/Objective
    const summaryMatch = text.match(/(?:summary|objective|profile|about)[:\s]*([\s\S]*?)(?:\n\n|\n[A-Z][a-z]+:|\n[A-Z][A-Z]|$)/i);
    if (summaryMatch) {
        result.summary = summaryMatch[1].trim().substring(0, 500);
    }
    
    return result;
}

// Load form data from object (for JSON import)
function loadFormData(data) {
    if (data.fullName) document.getElementById('fullName').value = data.fullName;
    if (data.jobTitle) document.getElementById('jobTitle').value = data.jobTitle;
    if (data.email) document.getElementById('email').value = data.email;
    if (data.phone) document.getElementById('phone').value = data.phone;
    if (data.location) document.getElementById('location').value = data.location;
    if (data.linkedin) document.getElementById('linkedin').value = data.linkedin;
    if (data.website) document.getElementById('website').value = data.website;
    if (data.github) document.getElementById('github').value = data.github;
    if (data.summary) document.getElementById('summary').value = data.summary;
    if (data.skills) document.getElementById('skills').value = data.skills;
    if (data.softSkills) document.getElementById('softSkills').value = data.softSkills;
    if (data.languages) document.getElementById('languages').value = data.languages;
    
    updatePreview();
    saveToLocalStorage();
}

// Clear all form data
function clearForm() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        // Clear all inputs
        document.querySelectorAll('input, textarea').forEach(input => {
            input.value = '';
        });
        
        // Reset to single entry for each section
        const expContainer = document.getElementById('experienceContainer');
        const eduContainer = document.getElementById('educationContainer');
        const projContainer = document.getElementById('projectsContainer');
        const certContainer = document.getElementById('certificationsContainer');
        
        // Keep only the first entries
        const expEntries = expContainer.querySelectorAll('.experience-entry');
        const eduEntries = eduContainer.querySelectorAll('.education-entry');
        const projEntries = projContainer.querySelectorAll('.project-entry');
        const certEntries = certContainer.querySelectorAll('.certification-entry');
        
        expEntries.forEach((entry, index) => {
            if (index > 0) entry.remove();
        });
        
        eduEntries.forEach((entry, index) => {
            if (index > 0) entry.remove();
        });
        
        projEntries.forEach((entry, index) => {
            if (index > 0) entry.remove();
        });
        
        certEntries.forEach((entry, index) => {
            if (index > 0) entry.remove();
        });
        
        // Clear local storage
        localStorage.removeItem('kormoNamaData');
        
        updatePreview();
    }
}

// Save form data to localStorage
function saveToLocalStorage() {
    const data = {
        personal: {
            fullName: document.getElementById('fullName').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            linkedin: document.getElementById('linkedin').value,
            website: document.getElementById('website').value,
            github: document.getElementById('github').value,
            summary: document.getElementById('summary').value,
            skills: document.getElementById('skills').value,
            softSkills: document.getElementById('softSkills').value,
            languages: document.getElementById('languages').value,
            photo: document.getElementById('profilePhotoBase64').value
        },
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        template: document.getElementById('templateSelect').value
    };
    
    // Save experience entries
    document.querySelectorAll('.experience-entry').forEach(entry => {
        data.experience.push({
            title: entry.querySelector('.exp-title').value,
            company: entry.querySelector('.exp-company').value,
            startDate: entry.querySelector('.exp-start').value,
            endDate: entry.querySelector('.exp-end').value,
            description: entry.querySelector('.exp-description').value
        });
    });
    
    // Save education entries
    document.querySelectorAll('.education-entry').forEach(entry => {
        data.education.push({
            degree: entry.querySelector('.edu-degree').value,
            institution: entry.querySelector('.edu-institution').value,
            year: entry.querySelector('.edu-year').value,
            grade: entry.querySelector('.edu-grade').value
        });
    });
    
    // Save project entries
    document.querySelectorAll('.project-entry').forEach(entry => {
        data.projects.push({
            name: entry.querySelector('.proj-name').value,
            tech: entry.querySelector('.proj-tech').value,
            link: entry.querySelector('.proj-link').value,
            duration: entry.querySelector('.proj-duration').value,
            description: entry.querySelector('.proj-description').value
        });
    });
    
    // Save certification entries
    document.querySelectorAll('.certification-entry').forEach(entry => {
        data.certifications.push({
            name: entry.querySelector('.cert-name').value,
            issuer: entry.querySelector('.cert-issuer').value,
            year: entry.querySelector('.cert-year').value,
            link: entry.querySelector('.cert-link').value
        });
    });
    
    localStorage.setItem('kormoNamaData', JSON.stringify(data));
}

// Sample Data for first-time users
const sampleData = {
    personal: {
        fullName: 'Alex Morgan',
        jobTitle: 'Senior Project Manager',
        email: 'alex.morgan@example.com',
        phone: '+1 555 019 2834',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexmorgan',
        website: 'alexmorgan.io',
        github: 'github.com/alexmorgan',
        summary: 'Results-oriented Project Manager with 7+ years of experience leading cross-functional teams to deliver complex software solutions. Proven track record of optimizing workflows, reducing costs by 20%, and increasing team productivity. Certified PMP and Scrum Master skilled in Agile methodologies and stakeholder management.',
        skills: 'Project Management, Agile & Scrum, Risk Management, Budgeting, JIRA, Confluence, Stakeholder Communication, Leadership, Strategic Planning',
        softSkills: 'Leadership, Communication, Problem Solving, Adaptability, Time Management, Team Building, Negotiation',
        languages: 'English (Native), Spanish (Professional), French (Basic)',
        photo: '' // User can upload their own
    },
    experience: [
        {
            title: 'Senior Project Manager',
            company: 'TechFlow Solutions',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: '• Led a team of 15 developers and designers to launch a flagship SaaS product, achieving $2M ARR in the first year.\n• Implemented Agile methodologies, reducing development cycle time by 30%.\n• Managed project budgets of up to $500k, consistently delivering under budget.\n• Facilitated cross-departmental collaboration between engineering, marketing, and sales teams.'
        },
        {
            title: 'Project Coordinator',
            company: 'Innovate Corp',
            startDate: 'Jun 2018',
            endDate: 'Dec 2020',
            description: '• Coordinated daily stand-ups and sprint planning for 3 agile teams.\n• Tracked project milestones and deliverables using JIRA, ensuring 95% on-time delivery.\n• Prepared weekly status reports for executive leadership, highlighting risks and mitigation strategies.\n• Organized client feedback sessions to incorporate user requirements into product roadmap.'
        }
    ],
    education: [
        {
            degree: 'Master of Business Administration (MBA)',
            institution: 'University of California, Berkeley',
            year: '2016 - 2018',
            grade: 'GPA: 3.8/4.0'
        },
        {
            degree: 'B.S. Computer Science',
            institution: 'University of Washington',
            year: '2012 - 2016',
            grade: 'Cum Laude'
        }
    ],
    projects: [
        {
            name: 'Enterprise ERP Migration',
            tech: 'SAP, Oracle, Cloud Migration',
            link: 'company.com/case-study',
            duration: '2022',
            description: '• Successfully migrated legacy on-premise ERP system to cloud-based solution for a 5000+ employee organization.\n• Managed stakeholder expectations and training for 500+ end-users.'
        },
        {
            name: 'Mobile App Launch',
            tech: 'iOS, Android, React Native',
            link: '',
            duration: '2021',
            description: '• Oversaw the end-to-end development and launch of a consumer-facing mobile app with 100k+ downloads.'
        }
    ],
    certifications: [
        {
            name: 'Project Management Professional (PMP)',
            issuer: 'PMI',
            year: '2019',
            link: 'pmi.org/verify/12345'
        },
        {
            name: 'Certified Scrum Master (CSM)',
            issuer: 'Scrum Alliance',
            year: '2018',
            link: ''
        }
    ],
    template: 'modern-split'
};

// Load form data from localStorage or use Sample Data
function loadFromLocalStorage() {
    let data = sampleData; // Default to sample data
    const saved = localStorage.getItem('kormoNamaData');
    
    if (saved) {
        try {
            data = JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing saved data, using sample data:', e);
        }
    }
    
    // Load personal info
    if (data.personal) {
        document.getElementById('fullName').value = data.personal.fullName || '';
        document.getElementById('jobTitle').value = data.personal.jobTitle || '';
        document.getElementById('email').value = data.personal.email || '';
        document.getElementById('phone').value = data.personal.phone || '';
        document.getElementById('location').value = data.personal.location || '';
        document.getElementById('linkedin').value = data.personal.linkedin || '';
        document.getElementById('website').value = data.personal.website || '';
        document.getElementById('github').value = data.personal.github || '';
        document.getElementById('summary').value = data.personal.summary || '';
        document.getElementById('skills').value = data.personal.skills || '';
        document.getElementById('softSkills').value = data.personal.softSkills || '';
        document.getElementById('languages').value = data.personal.languages || '';
        
        if (data.personal.photo) {
            document.getElementById('profilePhotoBase64').value = data.personal.photo;
        }
    }
    
    // Load template - prioritize URL param, then localStorage, then sample
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get('template');
    if (templateParam) {
        document.getElementById('templateSelect').value = templateParam;
    } else if (data.template) {
        document.getElementById('templateSelect').value = data.template;
    }
    
    // Helper to clear container except first item
    const clearContainer = (id, className) => {
        const container = document.getElementById(id);
        const entries = container.querySelectorAll('.' + className);
        entries.forEach((entry, index) => {
            if (index > 0) entry.remove();
        });
        return container;
    };

    // Load experience
    if (data.experience && data.experience.length > 0) {
        const container = clearContainer('experienceContainer', 'experience-entry');
        
        data.experience.forEach((exp, index) => {
            if (index > 0) addExperience();
            
            const entries = container.querySelectorAll('.experience-entry');
            const entry = entries[entries.length - 1];
            
            entry.querySelector('.exp-title').value = exp.title || '';
            entry.querySelector('.exp-company').value = exp.company || '';
            entry.querySelector('.exp-start').value = exp.startDate || '';
            entry.querySelector('.exp-end').value = exp.endDate || '';
            entry.querySelector('.exp-description').value = exp.description || '';
        });
    }
    
    // Load education
    if (data.education && data.education.length > 0) {
        const container = clearContainer('educationContainer', 'education-entry');
        
        data.education.forEach((edu, index) => {
            if (index > 0) addEducation();
            
            const entries = container.querySelectorAll('.education-entry');
            const entry = entries[entries.length - 1];
            
            entry.querySelector('.edu-degree').value = edu.degree || '';
            entry.querySelector('.edu-institution').value = edu.institution || '';
            entry.querySelector('.edu-year').value = edu.year || '';
            entry.querySelector('.edu-grade').value = edu.grade || '';
        });
    }
    
    // Load projects
    if (data.projects && data.projects.length > 0) {
        const container = clearContainer('projectsContainer', 'project-entry');
        
        data.projects.forEach((proj, index) => {
            if (index > 0) addProject();
            
            const entries = container.querySelectorAll('.project-entry');
            const entry = entries[entries.length - 1];
            
            entry.querySelector('.proj-name').value = proj.name || '';
            entry.querySelector('.proj-tech').value = proj.tech || '';
            entry.querySelector('.proj-link').value = proj.link || '';
            entry.querySelector('.proj-duration').value = proj.duration || '';
            entry.querySelector('.proj-description').value = proj.description || '';
        });
    }
    
    // Load certifications
    if (data.certifications && data.certifications.length > 0) {
        const container = clearContainer('certificationsContainer', 'certification-entry');
        
        data.certifications.forEach((cert, index) => {
            if (index > 0) addCertification();
            
            const entries = container.querySelectorAll('.certification-entry');
            const entry = entries[entries.length - 1];
            
            entry.querySelector('.cert-name').value = cert.name || '';
            entry.querySelector('.cert-issuer').value = cert.issuer || '';
            entry.querySelector('.cert-year').value = cert.year || '';
            entry.querySelector('.cert-link').value = cert.link || '';
        });
    }
    
    updatePreview();
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

