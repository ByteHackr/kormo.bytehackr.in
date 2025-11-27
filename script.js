/**
 * Sundar Resume - Free & Open Source Resume Builder
 * JavaScript functionality for live preview and PDF export
 * License: MIT
 */

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadFromLocalStorage();
    
    // Check if coming from templates page with a selected template
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get('template');
    const storedTemplate = localStorage.getItem('sundarSelectedTemplate');
    
    if (templateParam) {
        document.getElementById('templateSelect').value = templateParam;
        localStorage.removeItem('sundarSelectedTemplate');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (storedTemplate) {
        document.getElementById('templateSelect').value = storedTemplate;
        localStorage.removeItem('sundarSelectedTemplate');
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
    
    // Build contact HTML with clickable links
    const contactHTML = buildContactHTML(email, phone, location, linkedin, website, github);
    
    // Build all sections HTML
    const experienceHTML = buildExperienceHTML();
    const educationHTML = buildEducationHTML();
    const projectsHTML = buildProjectsHTML();
    const certificationsHTML = buildCertificationsHTML();
    const skillsHTML = buildSkillsHTML(skills);
    
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
    
    // Configure PDF options
    const options = {
        margin: 10,
        filename: `${fullName.replace(/\s+/g, '_')}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    // Generate and download PDF
    html2pdf().set(options).from(resumeContent).save();
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
        localStorage.removeItem('sundarResumeData');
        
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
            skills: document.getElementById('skills').value
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
    
    localStorage.setItem('sundarResumeData', JSON.stringify(data));
}

// Load form data from localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('sundarResumeData');
    if (!saved) return;
    
    try {
        const data = JSON.parse(saved);
        
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
        }
        
        // Load template
        if (data.template) {
            document.getElementById('templateSelect').value = data.template;
        }
        
        // Load experience
        if (data.experience && data.experience.length > 0) {
            const container = document.getElementById('experienceContainer');
            
            data.experience.forEach((exp, index) => {
                if (index === 0) {
                    const entry = container.querySelector('.experience-entry');
                    entry.querySelector('.exp-title').value = exp.title || '';
                    entry.querySelector('.exp-company').value = exp.company || '';
                    entry.querySelector('.exp-start').value = exp.startDate || '';
                    entry.querySelector('.exp-end').value = exp.endDate || '';
                    entry.querySelector('.exp-description').value = exp.description || '';
                } else {
                    addExperience();
                    const entries = container.querySelectorAll('.experience-entry');
                    const entry = entries[entries.length - 1];
                    entry.querySelector('.exp-title').value = exp.title || '';
                    entry.querySelector('.exp-company').value = exp.company || '';
                    entry.querySelector('.exp-start').value = exp.startDate || '';
                    entry.querySelector('.exp-end').value = exp.endDate || '';
                    entry.querySelector('.exp-description').value = exp.description || '';
                }
            });
        }
        
        // Load education
        if (data.education && data.education.length > 0) {
            const container = document.getElementById('educationContainer');
            
            data.education.forEach((edu, index) => {
                if (index === 0) {
                    const entry = container.querySelector('.education-entry');
                    entry.querySelector('.edu-degree').value = edu.degree || '';
                    entry.querySelector('.edu-institution').value = edu.institution || '';
                    entry.querySelector('.edu-year').value = edu.year || '';
                    entry.querySelector('.edu-grade').value = edu.grade || '';
                } else {
                    addEducation();
                    const entries = container.querySelectorAll('.education-entry');
                    const entry = entries[entries.length - 1];
                    entry.querySelector('.edu-degree').value = edu.degree || '';
                    entry.querySelector('.edu-institution').value = edu.institution || '';
                    entry.querySelector('.edu-year').value = edu.year || '';
                    entry.querySelector('.edu-grade').value = edu.grade || '';
                }
            });
        }
        
        // Load projects
        if (data.projects && data.projects.length > 0) {
            const container = document.getElementById('projectsContainer');
            
            data.projects.forEach((proj, index) => {
                if (index === 0) {
                    const entry = container.querySelector('.project-entry');
                    entry.querySelector('.proj-name').value = proj.name || '';
                    entry.querySelector('.proj-tech').value = proj.tech || '';
                    entry.querySelector('.proj-link').value = proj.link || '';
                    entry.querySelector('.proj-duration').value = proj.duration || '';
                    entry.querySelector('.proj-description').value = proj.description || '';
                } else {
                    addProject();
                    const entries = container.querySelectorAll('.project-entry');
                    const entry = entries[entries.length - 1];
                    entry.querySelector('.proj-name').value = proj.name || '';
                    entry.querySelector('.proj-tech').value = proj.tech || '';
                    entry.querySelector('.proj-link').value = proj.link || '';
                    entry.querySelector('.proj-duration').value = proj.duration || '';
                    entry.querySelector('.proj-description').value = proj.description || '';
                }
            });
        }
        
        // Load certifications
        if (data.certifications && data.certifications.length > 0) {
            const container = document.getElementById('certificationsContainer');
            
            data.certifications.forEach((cert, index) => {
                if (index === 0) {
                    const entry = container.querySelector('.certification-entry');
                    entry.querySelector('.cert-name').value = cert.name || '';
                    entry.querySelector('.cert-issuer').value = cert.issuer || '';
                    entry.querySelector('.cert-year').value = cert.year || '';
                    entry.querySelector('.cert-link').value = cert.link || '';
                } else {
                    addCertification();
                    const entries = container.querySelectorAll('.certification-entry');
                    const entry = entries[entries.length - 1];
                    entry.querySelector('.cert-name').value = cert.name || '';
                    entry.querySelector('.cert-issuer').value = cert.issuer || '';
                    entry.querySelector('.cert-year').value = cert.year || '';
                    entry.querySelector('.cert-link').value = cert.link || '';
                }
            });
        }
        
        updatePreview();
    } catch (e) {
        console.error('Error loading saved data:', e);
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

