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
    const savedTheme = localStorage.getItem('kormoNamaTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

// Toggle between dark and light themes
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'light';
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
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
    }
    
    // Editor page initialization
    if (document.getElementById('resumeContent')) {
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
    }
    
    // Templates gallery initialization
    if (document.querySelector('.templates-grid')) {
        renderTemplatesGallery();
    }
});

// ============================================
// DATA HELPERS
// ============================================

// Save structured data object directly to localStorage
function saveDataObject(data) {
    localStorage.setItem('kormoNamaData', JSON.stringify(data));
}

// Map parsed flat data to application structure
function mapParsedToStructure(parsed) {
    // Get existing data or default structure
    let current = localStorage.getItem('kormoNamaData');
    let data = current ? JSON.parse(current) : {
        personal: {}, experience: [], education: [], projects: [], certifications: []
    };
    
    // Update personal info
    data.personal = {
        ...data.personal,
        fullName: parsed.name || data.personal.fullName || '',
        jobTitle: parsed.title || data.personal.jobTitle || '',
        email: parsed.email || data.personal.email || '',
        phone: parsed.phone || data.personal.phone || '',
        location: parsed.location || data.personal.location || '',
        linkedin: parsed.linkedin || data.personal.linkedin || '',
        website: parsed.website || data.personal.website || '',
        github: parsed.github || data.personal.github || '',
        summary: parsed.summary || data.personal.summary || '',
        skills: parsed.skills || data.personal.skills || ''
    };
    
    return data;
}

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
    const customSectionsHTML = buildCustomSectionsHTML();
    
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
                    
                    ${customSectionsHTML}
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
            
            ${customSectionsHTML}
        `;
        return;
    }

    // Special layout for Executive Orange template
    if (template === 'executive-orange') {
        // Build vertical contact list for sidebar
        const contactListHTML = buildVerticalContactHTML(email, phone, location, linkedin, website, github);
        
        resumeContent.innerHTML = `
            <div class="resume-header">
                <h1 class="resume-name">${escapeHtml(fullName)}</h1>
                <p class="resume-title">${escapeHtml(jobTitle)}</p>
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
                    
                    ${customSectionsHTML}
                </div>
                
                <div class="column-right">
                    ${photoBase64 ? `<div class="profile-photo"><img src="${photoBase64}" alt="Profile"></div>` : ''}
                    
                    <div class="resume-section">
                        <h2>Contact</h2>
                        <div class="resume-contact vertical-contact">${contactListHTML}</div>
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

    // Special layout for Creative Split template (2-column with dark header)
    if (template === 'creative-split') {
        resumeContent.innerHTML = `
            <div class="resume-header">
                <div class="header-left">
                    <h1 class="resume-name">${escapeHtml(fullName)}</h1>
                    <p class="resume-title">${escapeHtml(jobTitle)}</p>
                </div>
                <div class="header-right">
                    <div class="resume-contact">${contactHTML}</div>
                </div>
            </div>
            
            <div class="sidebar-left">
                ${summary ? `
                <div class="resume-section">
                    <h2>About</h2>
                    <p class="resume-summary">${escapeHtml(summary)}</p>
                </div>
                ` : ''}
                
                ${skillsHTML ? `
                <div class="resume-section">
                    <h2>Skills</h2>
                    <div class="resume-skills">${skillsHTML}</div>
                </div>
                ` : ''}
                
                ${languagesHTML ? `
                <div class="resume-section">
                    <h2>Languages</h2>
                    <div class="resume-languages">${languagesHTML}</div>
                </div>
                ` : ''}
                
                ${certificationsHTML ? `
                <div class="resume-section">
                    <h2>Certifications</h2>
                    <div class="resume-certifications">${certificationsHTML}</div>
                </div>
                ` : ''}
            </div>
            
            <div class="main-right">
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
                
                ${customSectionsHTML}
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
        
        ${customSectionsHTML}
    `;
}

// Build experience section HTML
function buildExperienceHTML(data = null) {
    let html = '';
    
    if (data) {
        // Use provided data array
        data.forEach(item => {
            html += `
                <div class="exp-item">
                    <div class="exp-header">
                        <span class="exp-title-company">${escapeHtml(item.title)}</span>
                        <span class="exp-dates">${escapeHtml(item.start)}${item.start && item.end ? ' - ' : ''}${escapeHtml(item.end)}</span>
                    </div>
                    ${item.company ? `<div class="exp-company">${escapeHtml(item.company)}</div>` : ''}
                    ${item.description ? `<div class="exp-description">${escapeHtml(item.description)}</div>` : ''}
                </div>
            `;
        });
    } else {
        const entries = document.querySelectorAll('.experience-entry');
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
    }
    
    return html;
}

// Build education section HTML
function buildEducationHTML(data = null) {
    let html = '';
    
    if (data) {
        data.forEach(item => {
            html += `
                <div class="edu-item">
                    <div class="edu-header">
                        <span class="edu-degree">${escapeHtml(item.degree)}</span>
                        <span class="edu-year">${escapeHtml(item.year)}</span>
                    </div>
                    ${item.institution ? `<div class="edu-institution">${escapeHtml(item.institution)}${item.grade ? ' | ' + escapeHtml(item.grade) : ''}</div>` : ''}
                </div>
            `;
        });
    } else {
        const entries = document.querySelectorAll('.education-entry');
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
    }
    
    return html;
}

// Build projects section HTML
function buildProjectsHTML(data = null) {
    let html = '';
    
    if (data) {
        data.forEach(item => {
            html += `
                <div class="proj-item">
                    <div class="proj-header">
                        <span class="proj-title">${escapeHtml(item.name)}${item.link ? ` <a href="${escapeHtml(item.link)}" class="proj-link-url" target="_blank">↗</a>` : ''}</span>
                        <span class="proj-dates">${escapeHtml(item.duration)}</span>
                    </div>
                    ${item.tech ? `<div class="proj-tech-used">${escapeHtml(item.tech)}</div>` : ''}
                    ${item.description ? `<div class="proj-desc">${escapeHtml(item.description)}</div>` : ''}
                </div>
            `;
        });
    } else {
        const entries = document.querySelectorAll('.project-entry');
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
    }
    
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

// Build vertical contact list (for sidebar layouts)
function buildVerticalContactHTML(email, phone, location, linkedin, website, github) {
    let items = [];
    
    if (email) {
        items.push(`<div class="contact-item"><i class="fas fa-envelope"></i> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>`);
    }
    if (phone) {
        items.push(`<div class="contact-item"><i class="fas fa-phone"></i> <a href="tel:${escapeHtml(phone.replace(/\s/g, ''))}">${escapeHtml(phone)}</a></div>`);
    }
    if (location) {
        items.push(`<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(location)}</div>`);
    }
    if (linkedin) {
        const display = linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
        items.push(`<div class="contact-item"><i class="fab fa-linkedin"></i> <a href="${escapeHtml(linkedin)}" target="_blank">${escapeHtml(display)}</a></div>`);
    }
    if (website) {
        const display = website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
        items.push(`<div class="contact-item"><i class="fas fa-globe"></i> <a href="${escapeHtml(website)}" target="_blank">${escapeHtml(display)}</a></div>`);
    }
    if (github) {
        const display = github.replace(/^https?:\/\/(www\.)?github\.com\/?/, '');
        items.push(`<div class="contact-item"><i class="fab fa-github"></i> <a href="${escapeHtml(github)}" target="_blank">${escapeHtml(display)}</a></div>`);
    }
    
    return items.join('');
}

// Build certifications section HTML
function buildCertificationsHTML(data = null) {
    let html = '';
    
    if (data) {
        data.forEach(item => {
            const certText = `${escapeHtml(item.name)}${item.issuer ? ' - ' + escapeHtml(item.issuer) : ''}${item.date ? ' (' + escapeHtml(item.date) + ')' : ''}`;
            if (item.link) {
                html += `<div class="cert-item"><a href="${escapeHtml(item.link)}" target="_blank" class="cert-link-url">${certText} ↗</a></div>`;
            } else {
                html += `<div class="cert-item">${certText}</div>`;
            }
        });
    } else {
        const entries = document.querySelectorAll('.certification-entry');
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
    }
    
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

// ============================================
// CUSTOM SECTIONS
// ============================================

// Add new custom section
function addCustomSection() {
    const container = document.getElementById('customSectionsContainer');
    if (!container) {
        console.error('Custom sections container not found');
        return;
    }
    
    const index = container.querySelectorAll('.custom-section-entry').length;
    
    const entry = document.createElement('div');
    entry.className = 'custom-section-entry';
    entry.dataset.index = index;
    entry.innerHTML = `
        <div class="form-grid">
            <div class="form-group full-width">
                <label>Section Title</label>
                <input type="text" class="custom-title" placeholder="e.g., Awards, Volunteering, Publications, Hobbies">
            </div>
            <div class="form-group full-width">
                <label>Content (use bullet points with • or new lines)</label>
                <textarea class="custom-content" rows="4" placeholder="• First item&#10;• Second item&#10;• Third item"></textarea>
            </div>
        </div>
        <button type="button" class="btn-remove" onclick="removeCustomSection(this)">Remove Section</button>
    `;
    
    container.appendChild(entry);
    
    // Add event listeners to new inputs
    entry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            updatePreview();
            saveToLocalStorage();
        });
    });
    
    // Trigger preview update
    updatePreview();
}

// Remove custom section
function removeCustomSection(button) {
    const entry = button.closest('.custom-section-entry');
    entry.remove();
    updatePreview();
    saveToLocalStorage();
}

// Build custom sections HTML for preview
function buildCustomSectionsHTML() {
    const entries = document.querySelectorAll('.custom-section-entry');
    let html = '';
    
    if (!entries || entries.length === 0) {
        return html;
    }
    
    entries.forEach(entry => {
        const titleEl = entry.querySelector('.custom-title');
        const contentEl = entry.querySelector('.custom-content');
        
        if (!titleEl || !contentEl) return;
        
        const title = titleEl.value;
        const content = contentEl.value;
        
        if (title && content) {
            // Format content - convert bullet points and newlines
            const formattedContent = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line)
                .map(line => {
                    return `<div class="custom-item">${escapeHtml(line)}</div>`;
                })
                .join('');
            
            html += `
                <div class="resume-section custom-section">
                    <h2>${escapeHtml(title)}</h2>
                    <div class="custom-section-content">${formattedContent}</div>
                </div>
            `;
        }
    });
    
    return html;
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
    
    // Add class to body to trigger PDF-specific styles
    document.body.classList.add('generating-pdf');
    
    // Configure PDF options
    const options = {
        margin: 0, // Margins handled by CSS
        filename: `${fullName.replace(/\s+/g, '_')}_resume.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 2, // High resolution
            useCORS: true,
            allowTaint: true,
            scrollY: 0,
            backgroundColor: '#ffffff', // Force white background
            windowWidth: 794, // A4 width in pixels (approx) at 96 DPI
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    // Generate PDF
    html2pdf()
        .set(options)
        .from(resumeContent)
        .save()
        .then(() => {
            // Remove class and restore state
            document.body.classList.remove('generating-pdf');
            btn.innerHTML = originalText;
            btn.disabled = false;
        })
        .catch((err) => {
            console.error('PDF generation error:', err);
            document.body.classList.remove('generating-pdf');
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('Error generating PDF. Please try again.');
        });
}

// Print Resume (Native Browser Print for ATS Friendly PDF)
function printResume() {
    const resumeContent = document.getElementById('resumeContent');
    if (!resumeContent || !resumeContent.innerHTML.trim()) {
        alert('Please fill in your resume details first.');
        return;
    }
    
    // Get the current template class
    const templateClass = resumeContent.className;
    
    // Clone the resume content
    const resumeHTML = resumeContent.outerHTML;
    
    // Get all stylesheets
    const styles = Array.from(document.styleSheets)
        .map(sheet => {
            try {
                return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
            } catch (e) {
                // External stylesheets may throw security error
                return '';
            }
        })
        .join('\n');
    
    // Create print window with empty title to avoid header
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title></title>
            <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
            <style>
                ${styles}
                
                /* Remove browser headers/footers by using zero margins */
                @page {
                    margin: 0;
                    size: A4 portrait;
                }
                
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                html, body {
                    margin: 0;
                    padding: 0;
                    background: white;
                }
                
                .resume-content {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                    padding: 15mm;
                    box-sizing: border-box;
                    background: white !important;
                    box-shadow: none !important;
                    border: none !important;
                }
                
                /* Ensure sections don't break awkwardly */
                .resume-section {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
                
                .exp-item, .edu-item, .proj-item, .cert-item {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
                
                .resume-header {
                    page-break-after: avoid;
                }
                
                /* Fix grid layouts for print */
                .resume-content.modern-split .main-grid,
                .resume-content.executive-orange .main-grid,
                .resume-content.creative-split {
                    display: grid !important;
                }
                
                .resume-content.modern-split .main-grid {
                    grid-template-columns: 60% 40% !important;
                }
                
                .resume-content.executive-orange .main-grid {
                    grid-template-columns: 1fr 180px !important;
                }
                
                .resume-content.creative-split {
                    grid-template-columns: 240px 1fr !important;
                }
                
                /* Ensure backgrounds print */
                .resume-content.modern .resume-header,
                .resume-content.executive .resume-header,
                .resume-content.modern-split .header-section,
                .resume-content.creative-split .resume-header {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                @media print {
                    html, body {
                        width: 210mm;
                        height: 297mm;
                    }
                    .resume-content {
                        width: 100%;
                        padding: 12mm;
                    }
                }
            </style>
        </head>
        <body>
            ${resumeHTML}
            <script>
                // Wait for fonts and images to load, then print
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Clean PDF download using html2pdf (no browser headers/footers)
async function downloadCleanPDF() {
    const resumeContent = document.getElementById('resumeContent');
    if (!resumeContent || !resumeContent.innerHTML.trim()) {
        alert('Please fill in your resume details first.');
        return;
    }
    
    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
        alert('PDF library not loaded. Please use the Print option instead.');
        return;
    }
    
    const fullName = document.getElementById('fullName').value || 'Resume';
    const fileName = fullName.replace(/\s+/g, '_') + '_Resume.pdf';
    
    // Show loading state
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Generating PDF...';
    btn.disabled = true;
    
    try {
        const opt = {
            margin: [10, 10, 10, 10],
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            },
            pagebreak: { 
                mode: ['avoid-all', 'css', 'legacy'],
                before: '.page-break-before',
                after: '.page-break-after',
                avoid: '.resume-section, .exp-item, .edu-item, .proj-item'
            }
        };
        
        await html2pdf().set(opt).from(resumeContent).save();
    } catch (err) {
        console.error('PDF generation error:', err);
        alert('Error generating PDF. Please try the Print option.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
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
    
    // Clean up text for better matching
    const cleanText = text.replace(/\s+/g, ' ');
    
    // Email pattern - more comprehensive
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) result.email = emailMatch[0];
    
    // Phone pattern - support Indian and international formats
    const phonePatterns = [
        /\+91[\s.-]?\d{5}[\s.-]?\d{5}/,           // Indian +91 format
        /\+\d{1,3}[\s.-]?\d{3,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}/, // International
        /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/,    // US format
        /\d{10}/                                   // Plain 10 digits
    ];
    for (const pattern of phonePatterns) {
        const match = text.match(pattern);
        if (match) {
            result.phone = match[0];
            break;
        }
    }
    
    // LinkedIn - multiple formats
    const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin:?\s*)([a-zA-Z0-9_-]+)/i);
    if (linkedinMatch) {
        result.linkedin = 'https://linkedin.com/in/' + linkedinMatch[1];
    }
    
    // GitHub - multiple formats
    const githubMatch = text.match(/(?:github\.com\/|github:?\s*)([a-zA-Z0-9_-]+)/i);
    if (githubMatch && githubMatch[1].toLowerCase() !== 'com') {
        result.github = 'https://github.com/' + githubMatch[1];
    }
    
    // Website (generic URL, excluding linkedin/github)
    const urlMatches = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,})(?:\/\S*)?/g) || [];
    for (const url of urlMatches) {
        if (!url.includes('linkedin') && !url.includes('github') && !url.includes('gmail') && !url.includes('email')) {
            result.website = url.startsWith('http') ? url : 'https://' + url;
            break;
        }
    }
    
    // Name detection - first substantial line that looks like a name
    for (let i = 0; i < Math.min(3, lines.length); i++) {
        const line = lines[i];
        // Name should be short, no special chars, no common keywords
        if (line.length > 2 && line.length < 50 && 
            !line.includes('@') && !line.includes('http') && !line.includes('•') &&
            !line.match(/^\d/) && !line.match(/resume|cv|curriculum/i) &&
            line.match(/^[A-Za-z\s.'-]+$/)) {
            result.name = line;
            break;
        }
    }
    
    // Job title detection
    const titleKeywords = ['developer', 'engineer', 'designer', 'manager', 'analyst', 'consultant', 
                          'architect', 'specialist', 'coordinator', 'assistant', 'director', 'lead',
                          'senior', 'junior', 'intern', 'executive', 'officer', 'administrator',
                          'scientist', 'researcher', 'professor', 'teacher', 'nurse', 'doctor',
                          'accountant', 'lawyer', 'paralegal', 'writer', 'editor', 'marketing'];
    
    for (let i = 0; i < Math.min(8, lines.length); i++) {
        const line = lines[i];
        const lineLower = line.toLowerCase();
        // Skip if it's the name or too long
        if (line === result.name || line.length > 60) continue;
        
        if (titleKeywords.some(k => lineLower.includes(k))) {
            result.title = line;
            break;
        }
    }
    
    // Location patterns - Indian cities and general patterns
    const indianCities = ['bengaluru', 'bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 
                         'kolkata', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur',
                         'indore', 'thane', 'bhopal', 'visakhapatnam', 'patna', 'vadodara'];
    
    // Try to find city in text
    for (const city of indianCities) {
        const cityRegex = new RegExp(`(${city}[,\\s]*(?:india|karnataka|maharashtra|tamil nadu|andhra pradesh|telangana|west bengal|gujarat|rajasthan|uttar pradesh|madhya pradesh)?)`, 'i');
        const match = text.match(cityRegex);
        if (match) {
            result.location = match[1].trim();
            break;
        }
    }
    
    // Fallback location pattern
    if (!result.location) {
        const locationMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),\s*([A-Z]{2}|[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/);
        if (locationMatch) {
            result.location = locationMatch[0].trim();
        }
    }
    
    // Skills section - more patterns
    const skillsPatterns = [
        /(?:technical\s+)?skills?\s*[:\-]?\s*([\s\S]*?)(?=\n\s*\n|\n[A-Z][a-z]+\s*[:\-]|experience|education|project|work\s*history|$)/i,
        /(?:technologies|tech\s+stack|expertise)\s*[:\-]?\s*([\s\S]*?)(?=\n\s*\n|\n[A-Z]|$)/i
    ];
    
    for (const pattern of skillsPatterns) {
        const match = text.match(pattern);
        if (match && match[1].trim().length > 5) {
            result.skills = match[1]
                .replace(/[•\-\*\|]/g, ',')
                .replace(/\n/g, ', ')
                .replace(/,\s*,+/g, ',')
                .replace(/^\s*,|,\s*$/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 500);
            break;
        }
    }
    
    // Summary/Objective/Profile
    const summaryPatterns = [
        /(?:professional\s+)?summary\s*[:\-]?\s*([\s\S]*?)(?=\n\s*\n|\n[A-Z][a-z]+\s*[:\-]|skills|experience|education|$)/i,
        /(?:career\s+)?objective\s*[:\-]?\s*([\s\S]*?)(?=\n\s*\n|\n[A-Z]|$)/i,
        /(?:about\s+me|profile)\s*[:\-]?\s*([\s\S]*?)(?=\n\s*\n|\n[A-Z]|$)/i
    ];
    
    for (const pattern of summaryPatterns) {
        const match = text.match(pattern);
        if (match && match[1].trim().length > 20) {
            result.summary = match[1].trim().substring(0, 500);
            break;
        }
    }
    
    // Experience extraction (basic)
    const expMatch = text.match(/(?:work\s+)?(?:experience|history|employment)\s*[:\-]?\s*([\s\S]*?)(?=\n\s*\n\s*(?:education|skills|projects?|certifications?)|$)/i);
    if (expMatch) {
        result.experience = expMatch[1].trim().substring(0, 1000);
    }
    
    // Education extraction (basic)
    const eduMatch = text.match(/education\s*[:\-]?\s*([\s\S]*?)(?=\n\s*\n\s*(?:experience|skills|projects?|certifications?|work)|$)/i);
    if (eduMatch) {
        result.education = eduMatch[1].trim().substring(0, 500);
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

// ============================================
// TEMPLATES GALLERY RENDERING
// ============================================

function renderTemplatesGallery() {
    const templates = document.querySelectorAll('.template-card');
    if (templates.length === 0) return;
    
    templates.forEach(card => {
        const templateName = card.getAttribute('data-template');
        const container = card.querySelector('.resume-content');
        if (container) {
            container.innerHTML = generateResumeHTML(templateName, sampleData);
            // Ensure correct class is set
            container.className = 'resume-content ' + templateName;
        }
    });
}

// Generate HTML for a specific template using data
function generateResumeHTML(template, data) {
    // Destructure data
    const { personal, experience, education, projects, certifications } = data;
    
    // Build HTML parts
    const experienceHTML = buildExperienceHTML(experience);
    const educationHTML = buildEducationHTML(education);
    const projectsHTML = buildProjectsHTML(projects);
    const certificationsHTML = buildCertificationsHTML(certifications);
    const skillsHTML = buildSkillsHTML(personal.skills);
    const softSkillsHTML = buildSkillsHTML(personal.softSkills);
    const languagesHTML = buildLanguagesHTML(personal.languages);
    const contactHTML = buildContactHTML(personal.email, personal.phone, personal.location, personal.linkedin, personal.website, personal.github);
    
    // Escape personal info
    const fullName = escapeHtml(personal.fullName);
    const jobTitle = escapeHtml(personal.jobTitle);
    const summary = escapeHtml(personal.summary);
    const photoBase64 = personal.photo || ''; // Use photo from data or empty
    
    // Logic copied from updatePreview but using variables
    
    // Special layout for Modern Split template
    if (template === 'modern-split') {
        return `
            <div class="header-section">
                ${photoBase64 ? `<div class="profile-photo"><img src="${photoBase64}" alt="Profile"></div>` : ''}
                <div class="header-text">
                    <h1 class="resume-name">${fullName}</h1>
                    <p class="resume-title">${jobTitle}</p>
                </div>
                ${summary ? `<p class="header-summary">${summary}</p>` : ''}
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
    }

    // Special layout for Clean Blue template
    if (template === 'clean-blue') {
        return `
            <div class="resume-header">
                ${photoBase64 ? `<div class="profile-photo"><img src="${photoBase64}" alt="Profile"></div>` : ''}
                <h1 class="resume-name">${fullName}</h1>
                <div class="resume-contact">${contactHTML}</div>
            </div>
            
            ${summary ? `
            <div class="resume-section">
                <h2>Resume Objective</h2>
                <p class="resume-summary">${summary}</p>
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
    }

    // Special layout for Creative Split template
    if (template === 'creative-split') {
        return `
            <div class="resume-header">
                <div class="header-left">
                    <h1 class="resume-name">${fullName}</h1>
                    <p class="resume-title">${jobTitle}</p>
                </div>
                <div class="header-right">
                    <div class="resume-contact">${contactHTML}</div>
                </div>
            </div>
            
            <div class="sidebar-left">
                ${summary ? `
                <div class="resume-section">
                    <h2>About</h2>
                    <p class="resume-summary">${summary}</p>
                </div>
                ` : ''}
                
                ${skillsHTML ? `
                <div class="resume-section">
                    <h2>Skills</h2>
                    <div class="resume-skills">${skillsHTML}</div>
                </div>
                ` : ''}
                
                ${languagesHTML ? `
                <div class="resume-section">
                    <h2>Languages</h2>
                    <div class="resume-languages">${languagesHTML}</div>
                </div>
                ` : ''}
                
                ${certificationsHTML ? `
                <div class="resume-section">
                    <h2>Certifications</h2>
                    <div class="resume-certifications">${certificationsHTML}</div>
                </div>
                ` : ''}
            </div>
            
            <div class="main-right">
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
            </div>
        `;
    }

    // Special layout for Executive Orange template
    if (template === 'executive-orange') {
        const contactListHTML = buildVerticalContactHTML(personal.email, personal.phone, personal.location, personal.linkedin, personal.website, personal.github);
        
        return `
            <div class="resume-header">
                <h1 class="resume-name">${fullName}</h1>
                <p class="resume-title">${jobTitle}</p>
            </div>
            
            <div class="main-grid">
                <div class="column-left">
                    ${summary ? `
                    <div class="resume-section">
                        <h2>Professional Summary</h2>
                        <p class="resume-summary">${summary}</p>
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
                        <div class="resume-contact vertical-contact">${contactListHTML}</div>
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
    }
    
    // Standard templates
    const isFresherTemplate = ['fresh-graduate', 'student', 'entry-level'].includes(template);
    
    return `
        <div class="resume-header">
            <h1 class="resume-name">${fullName}</h1>
            <p class="resume-title">${jobTitle}</p>
            <div class="resume-contact">${contactHTML}</div>
        </div>
        
        ${summary ? `
        <div class="resume-section">
            <h2>Professional Summary</h2>
            <p class="resume-summary">${summary}</p>
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
        customSections: [],
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
    
    // Save custom section entries
    document.querySelectorAll('.custom-section-entry').forEach(entry => {
        data.customSections.push({
            title: entry.querySelector('.custom-title').value,
            content: entry.querySelector('.custom-content').value
        });
    });
    
    localStorage.setItem('kormoNamaData', JSON.stringify(data));
}

// Sample Data for first-time users (Indian Profile)
const sampleData = {
    personal: {
        fullName: 'Arjun Sharma',
        jobTitle: 'Senior Software Engineer',
        email: 'arjun.sharma@gmail.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, Karnataka',
        linkedin: 'linkedin.com/in/arjunsharma',
        website: 'arjunsharma.dev',
        github: 'github.com/arjunsharma',
        summary: 'Passionate Software Engineer with 6+ years of experience building scalable web applications and microservices. Expert in React, Node.js, and cloud technologies. Led development of fintech platforms serving 2M+ users. Strong advocate for clean code, test-driven development, and agile practices. Open source contributor and tech community speaker.',
        skills: 'JavaScript, TypeScript, React.js, Node.js, Python, AWS, Docker, Kubernetes, MongoDB, PostgreSQL, Redis, GraphQL, REST APIs, Git',
        softSkills: 'Problem Solving, Team Collaboration, Mentoring, Communication, Agile Methodologies, Code Review, Technical Writing',
        languages: 'English (Fluent), Hindi (Native), Kannada (Conversational)',
        photo: 'profile_photo.png'
    },
    experience: [
        {
            title: 'Senior Software Engineer',
            company: 'Razorpay',
            start: 'Apr 2022',
            end: 'Present',
            description: '• Architected and developed payment gateway microservices handling 50,000+ transactions per minute.\n• Led a team of 5 engineers to build merchant dashboard using React and Node.js.\n• Reduced API response time by 40% through optimization and caching strategies.\n• Implemented CI/CD pipelines reducing deployment time from hours to minutes.'
        },
        {
            title: 'Software Engineer',
            company: 'Flipkart',
            start: 'Jul 2019',
            end: 'Mar 2022',
            description: '• Built real-time inventory management system for warehouse operations.\n• Developed customer-facing features for mobile app with 100M+ downloads.\n• Collaborated with data science team to implement ML-based recommendation engine.\n• Mentored 3 junior developers and conducted technical interviews.'
        },
        {
            title: 'Associate Software Engineer',
            company: 'Infosys',
            start: 'Jun 2017',
            end: 'Jun 2019',
            description: '• Developed enterprise web applications for banking clients using Java and Angular.\n• Participated in agile sprints and contributed to sprint planning and retrospectives.\n• Created automated test suites improving code coverage from 45% to 85%.'
        }
    ],
    education: [
        {
            degree: 'B.Tech in Computer Science',
            institution: 'IIT Delhi',
            year: '2013 - 2017',
            grade: 'CGPA: 8.7/10'
        },
        {
            degree: 'Higher Secondary (XII)',
            institution: 'Delhi Public School, R.K. Puram',
            year: '2011 - 2013',
            grade: '94.5%'
        }
    ],
    projects: [
        {
            name: 'OpenCart - E-commerce Platform',
            tech: 'React, Node.js, MongoDB, AWS',
            link: 'github.com/arjunsharma/opencart',
            duration: '2023',
            description: '• Built open-source e-commerce platform with 500+ GitHub stars.\n• Features include payment integration, inventory management, and analytics dashboard.'
        },
        {
            name: 'DevConnect - Developer Social Network',
            tech: 'Next.js, GraphQL, PostgreSQL',
            link: 'devconnect.arjunsharma.dev',
            duration: '2022',
            description: '• Created social platform for developers to share projects and collaborate.\n• Implemented real-time chat and notification system using WebSockets.'
        }
    ],
    certifications: [
        {
            name: 'AWS Solutions Architect - Associate',
            issuer: 'Amazon Web Services',
            date: '2023',
            link: 'credly.com/verify/aws-123'
        },
        {
            name: 'Google Cloud Professional Developer',
            issuer: 'Google',
            date: '2022',
            link: ''
        },
        {
            name: 'MongoDB Certified Developer',
            issuer: 'MongoDB University',
            date: '2021',
            link: ''
        }
    ],
    template: 'clean-blue'
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
    
    // Load custom sections
    if (data.customSections && data.customSections.length > 0) {
        const container = document.getElementById('customSectionsContainer');
        container.innerHTML = ''; // Clear any existing
        
        data.customSections.forEach((section) => {
            addCustomSection();
            
            const entries = container.querySelectorAll('.custom-section-entry');
            const entry = entries[entries.length - 1];
            
            entry.querySelector('.custom-title').value = section.title || '';
            entry.querySelector('.custom-content').value = section.content || '';
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

