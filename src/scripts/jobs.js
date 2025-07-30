class JobSearchManager {
    constructor() {
        // this.apiKey = '92a968a7dcmshd58ec8b5bebbe63p1938eajsn44d49f288f24';
        this.apiKey = '';
        this.apiHost = 'jobs-api14.p.rapidapi.com';
        this.jobsContainer = document.getElementById('jobList');
        this.currentJobType = 'jobs';
        this.addedJobs = new Set();
        this.hiddenJobs = new Set();
        this.loadPersistedData();
        this.initializeEventListeners();
        this.loadDefaultJobs();
    }

    initializeEventListeners() {
        const searchButton = document.querySelector('button[onclick="jobSearchManager.searchJobs()"]');
        if (searchButton) searchButton.setAttribute('onclick', 'jobSearchManager.searchJobs()');
        ['skillSelect', 'locationSelect', 'platformSelect'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.addEventListener('keypress', e => e.key === 'Enter' && this.searchJobs());
        });
        ['jobsToggle', 'internshipsToggle'].forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.addEventListener('change', () => {
                    if (toggle.checked) {
                        this.currentJobType = toggleId === 'jobsToggle' ? 'jobs' : 'internships';
                        document.getElementById('listingTitle').textContent = this.currentJobType === 'jobs' ? 'Job Listings' : 'Internship Listings';
                        this.searchJobs();
                    }
                });
            }
        });
    }

    async searchJobs() {
        const skill = document.getElementById('skillSelect').value;
        const location = document.getElementById('locationSelect').value;
        const platform = document.getElementById('platformSelect').value;
        let query = this.currentJobType === 'internships' ? 'internship' : 'developer jobs';
        if (skill) query = `${skill} ${this.currentJobType === 'internships' ? 'internship' : 'developer jobs'}`;
        if (location) query += ` in ${location}`;
        if (platform) query += ` on ${platform}`;
        await this.fetchJobs(query, location || 'india');
    }

    async loadDefaultJobs() {
        const defaultQuery = this.currentJobType === 'internships' ? 'software developer internship' : 'software developer jobs';
        await this.fetchJobs(defaultQuery, 'india');
    }

    async fetchJobs(query, location = 'india') {
        this.showLoading();
        const url = `https://jobs-api14.p.rapidapi.com/v2/list?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&distance=1.0&language=en_GB&remoteOnly=false&datePosted=all&employmentTypes=fulltime%2Cparttime%2Cintern%2Cvolunteer&index=0`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': this.apiHost
            }
        };
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            let jobs = [];
            if (Array.isArray(result?.jobs)) jobs = result.jobs;
            else if (Array.isArray(result)) jobs = result;
            else if (Array.isArray(result?.data)) jobs = result.data;
            if (jobs.length) this.displayJobs(jobs.map(job => this.transformJobData(job)));
            else {
                showToast('No jobs found for your search criteria.', 'danger');
                this.showFallbackJobs();
            }
        } catch {
            showToast('Failed to fetch jobs. Showing sample jobs.', 'warning');
            this.showFallbackJobs();
        }
    }

    transformJobData(job) {
        return {
            job_id: job.id || job.job_id || Math.random().toString(36).substr(2, 9),
            job_title: job.title || job.job_title || 'Job Title Not Available',
            employer_name: job.company || job.employer_name || job.companyName || 'Company Not Specified',
            job_description: job.description || job.job_description || job.summary || 'No description available',
            job_city: this.extractCityFromLocation(job.location || job.job_location),
            job_country: this.extractCountryFromLocation(job.location || job.job_location),
            job_employment_type: this.mapEmploymentType(job.employmentType || job.job_employment_type || job.type),
            job_posted_at_datetime_utc: this.parseJobDate(job.datePosted || job.job_posted_at_datetime_utc || job.postedDate),
            job_apply_link: this.extractApplyLink(job),
            job_salary_currency: this.extractSalaryCurrency(job.salaryRange || job.salary || job.job_salary),
            job_min_salary: this.extractMinSalary(job.salaryRange || job.salary || job.job_salary),
            job_max_salary: this.extractMaxSalary(job.salaryRange || job.salary || job.job_salary),
            job_is_remote: this.isRemoteJob(job),
            employer_logo: job.image || job.logo || job.company_logo || null,
            job_platform: this.extractJobPlatform(job.jobProviders || [])
        };
    }

    parseJobDate(dateString) {
        if (!dateString) return null;
        if (typeof dateString === 'string' && dateString.includes('ago')) {
            const now = new Date();
            const num = parseInt(dateString.match(/\d+/)?.[0] || '0');
            if (dateString.includes('hour')) return new Date(now - num * 3600000).toISOString();
            if (dateString.includes('day')) return new Date(now - num * 86400000).toISOString();
            if (dateString.includes('week')) return new Date(now - num * 604800000).toISOString();
            if (dateString.includes('month')) return new Date(now - num * 2592000000).toISOString();
        }
        return new Date(dateString).toISOString();
    }

    extractJobPlatform(jobProviders) {
        return jobProviders?.[0]?.jobProvider || 'Direct';
    }

    extractApplyLink(job) {
        if (job.jobProviders?.[0]?.url) return job.jobProviders[0].url;
        return job.apply_link || job.job_apply_link || job.applicationUrl || null;
    }

    isRemoteJob(job) {
        const location = (job.location || job.job_location || '').toLowerCase();
        const description = (job.description || job.job_description || '').toLowerCase();
        return location.includes('remote') || description.includes('remote') || job.isRemote === true;
    }

    extractCityFromLocation(location) {
        return location?.split(',')[0]?.trim() || null;
    }

    extractCountryFromLocation(location) {
        const parts = location?.split(',') || [];
        return parts.length > 1 ? parts[parts.length - 1].trim() : null;
    }

    mapEmploymentType(employmentType) {
        if (!employmentType) return 'Not specified';
        const map = { fulltime: 'Full-time', parttime: 'Part-time', intern: 'Internship', volunteer: 'Volunteer', contract: 'Contract' };
        return map[employmentType.toLowerCase()] || employmentType;
    }

    extractSalaryCurrency(salaryRange) {
        return salaryRange?.match(/([£$€₹])/)?.[1] || null;
    }

    extractMinSalary(salaryRange) {
        return salaryRange?.match(/[\d,]+/g)?.[0]?.replace(/,/g, '') || null;
    }

    extractMaxSalary(salaryRange) {
        const nums = salaryRange?.match(/[\d,]+/g);
        return nums?.[1]?.replace(/,/g, '') || null;
    }

    showFallbackJobs() {
        const now = new Date();
        const sampleJobs = [
            {
                id: 'sample-1',
                title: 'Frontend Developer',
                company: 'Tech Solutions Ltd',
                description: 'We are looking for a skilled Frontend Developer to join our team. Experience with React, JavaScript, and modern web technologies required.',
                location: 'Bangalore, India',
                employmentType: 'fulltime',
                datePosted: now.toISOString(),
                salaryRange: '₹5,00,000 - ₹8,00,000',
                jobProviders: [{ jobProvider: 'LinkedIn', url: 'https://example.com/apply/1' }]
            },
            {
                id: 'sample-2',
                title: 'Full Stack Developer',
                company: 'Innovation Hub',
                description: 'Join our dynamic team as a Full Stack Developer. Work with Node.js, React, MongoDB, and cloud technologies.',
                location: 'Mumbai, India',
                employmentType: 'fulltime',
                datePosted: new Date(now - 86400000).toISOString(),
                salaryRange: '₹6,00,000 - ₹10,00,000',
                jobProviders: [{ jobProvider: 'Naukri', url: 'https://example.com/apply/2' }]
            },
            {
                id: 'sample-3',
                title: 'Software Engineer Intern',
                company: 'StartupXYZ',
                description: 'Great opportunity for students to gain hands-on experience in software development. Work on real projects with modern technologies.',
                location: 'Remote, India',
                employmentType: 'intern',
                datePosted: new Date(now - 2 * 86400000).toISOString(),
                salaryRange: '₹15,000 - ₹25,000',
                jobProviders: [{ jobProvider: 'Internshala', url: 'https://example.com/apply/3' }]
            },
            {
                id: 'sample-4',
                title: 'Backend Developer',
                company: 'DataCorp Solutions',
                description: 'Looking for a Backend Developer with expertise in Python, Django, and database management. Great growth opportunities.',
                location: 'Hyderabad, India',
                employmentType: 'fulltime',
                datePosted: new Date(now - 3 * 86400000).toISOString(),
                salaryRange: '₹7,00,000 - ₹12,00,000',
                jobProviders: [{ jobProvider: 'Glassdoor', url: 'https://example.com/apply/4' }]
            }
        ];
        const filtered = sampleJobs.filter(j => this.currentJobType === 'internships' ? j.employmentType === 'intern' : j.employmentType !== 'intern');
        this.displayJobs(filtered.map(j => this.transformJobData(j)));
    }

    displayJobs(jobs) {
        if (!jobs?.length) {
            showToast('No jobs found for your search criteria.', 'danger');
            return;
        }
        const visibleJobs = jobs.filter(job => !this.hiddenJobs.has(job.job_id));
        if (!visibleJobs.length) {
            this.jobsContainer.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">All jobs have been hidden. Try a new search or reset filters.</p></div>`;
            return;
        }
        this.jobsContainer.innerHTML = visibleJobs.map(job => this.createJobCard(job)).join('');
    }

    createJobCard(job) {
        const salary = job.job_salary_currency && job.job_min_salary
            ? `${job.job_salary_currency} ${job.job_min_salary}${job.job_max_salary ? ` - ${job.job_max_salary}` : ''}`
            : 'Salary not specified';
        const employmentType = job.job_employment_type || 'Not specified';
        const location = job.job_city && job.job_country
            ? `${job.job_city}, ${job.job_country}`
            : job.job_country || job.job_city || 'Location not specified';
        let postedDate = 'Date not available';
        if (job.job_posted_at_datetime_utc) {
            const date = new Date(job.job_posted_at_datetime_utc);
            if (!isNaN(date.getTime())) postedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
        const isAdded = this.addedJobs.has(job.job_id);
        const cardClass = isAdded ? 'card job-card h-100 border-success' : 'card job-card h-100';
        const jobId = String(job.job_id).replace(/'/g, "\\'");
        return `
            <div class="col-md-6 mb-4">
                <div class="${cardClass}" data-job-id="${job.job_id}">
                    <div class="card-header d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title text-primary mb-2">${job.job_title}</h5>
                            <p class="mb-1 text-cyan fw-semibold">${job.employer_name}</p>
                            <p class="mb-0 text-muted small">${location}</p>
                        </div>
                        <small class="text-muted">${postedDate}</small>
                    </div>
                    <div class="card-body">
                        <div class="job-details">
                            <div class="mb-3">
                                <span class="badge bg-secondary me-2">${employmentType}</span>
                                <span class="badge bg-success">${salary}</span>
                                ${job.job_is_remote ? '<span class="badge bg-info ms-2">Remote</span>' : '<span class="badge bg-warning ms-2">On-site</span>'}
                                ${job.job_platform ? `<span class="badge bg-primary ms-2">${job.job_platform}</span>` : ''}
                            </div>
                            <p class="text-light mb-3">${this.truncateText(job.job_description, 120)}</p>
                        </div>
                        <div class="d-flex gap-2 justify-content-between align-items-center">
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm ${isAdded ? 'btn-outline-success' : 'btn-outline-info'}" 
                                        onclick="jobSearchManager.togglePortfolio('${jobId}', '${this.currentJobType}')"
                                        title="${isAdded ? 'Remove from Portfolio' : 'Add to Portfolio'}">
                                    <i class="bi bi-hand-thumbs-up"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" 
                                        onclick="jobSearchManager.hideJob('${jobId}')">
                                    <i class="bi bi-hand-thumbs-down"></i>
                                </button>
                            </div>
                            <a href="${job.job_apply_link || '#'}" 
                               target="_blank" 
                               class="btn btn-primary btn-sm"
                               ${!job.job_apply_link ? 'onclick="alert(\'Application link not available\'); return false;" style="pointer-events: auto; opacity: 0.6;"' : ''}>
                                Apply Now <i class="bi bi-arrow-up-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    truncateText(text, maxLength) {
        return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
    }

    togglePortfolio(jobId, jobType) {
        if (this.addedJobs.has(jobId)) {
            this.removeFromPortfolio(jobId, jobType);
        } else {
            this.addToPortfolio(jobId, jobType);
        }
    }

    addToPortfolio(jobId, jobType) {
        this.addedJobs.add(jobId);
        const portfolioData = JSON.parse(localStorage.getItem('skillswap_portfolio') || '{"jobs": [], "internships": []}');
        const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
        if (jobCard) {
            const applyLinkElement = jobCard.querySelector('a.btn-primary');
            const jobData = {
                id: jobId,
                title: jobCard.querySelector('.card-title')?.textContent || '',
                company: jobCard.querySelector('.text-cyan')?.textContent || '',
                type: jobType,
                addedDate: new Date().toISOString(),
                applyLink: applyLinkElement ? applyLinkElement.getAttribute('href') : null,
                location: jobCard.querySelector('.text-muted.small')?.textContent || '',
                employmentType: jobCard.querySelector('.badge.bg-secondary')?.textContent || '',
                salary: jobCard.querySelector('.badge.bg-success')?.textContent || '',
                remote: !!jobCard.querySelector('.badge.bg-info'),
                platform: jobCard.querySelector('.badge.bg-primary')?.textContent || '',
                postedDate: jobCard.querySelector('.text-muted:not(.small)')?.textContent || '',
            };
            portfolioData[jobType].push(jobData);
            localStorage.setItem('skillswap_portfolio', JSON.stringify(portfolioData));
        }
        this.updateJobCardUI(jobId, true);
        showToast(`${jobType === 'jobs' ? 'Job' : 'Internship'} added to portfolio!`, 'success');
    }

    removeFromPortfolio(jobId, jobType) {
        this.addedJobs.delete(jobId);
        const portfolioData = JSON.parse(localStorage.getItem('skillswap_portfolio') || '{"jobs": [], "internships": []}');
        portfolioData[jobType] = portfolioData[jobType].filter(job => job.id !== jobId);
        localStorage.setItem('skillswap_portfolio', JSON.stringify(portfolioData));
        this.updateJobCardUI(jobId, false);
        showToast(`${jobType === 'jobs' ? 'Job' : 'Internship'} removed from portfolio!`, 'info');
    }

    hideJob(jobId) {
        this.hiddenJobs.add(jobId);
        const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
        if (jobCard) jobCard.closest('.col-md-6').remove();
        const hiddenJobs = JSON.parse(localStorage.getItem('skillswap_hidden_jobs') || '[]');
        hiddenJobs.push(jobId);
        localStorage.setItem('skillswap_hidden_jobs', JSON.stringify(hiddenJobs));
        showToast('Job removed from search results', 'info');
    }

    updateJobCardUI(jobId, isAdded) {
        const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
        if (!jobCard) return;
        const addButton = jobCard.querySelector('.btn-outline-success, .btn-outline-info');
        
        if (isAdded) {
            jobCard.className = 'card job-card h-100 border-success';
            addButton.className = 'btn btn-sm btn-outline-success';
            addButton.title = 'Remove from Portfolio';
        } else {
            jobCard.className = 'card job-card h-100';
            addButton.className = 'btn btn-sm btn-outline-info';
            addButton.title = 'Add to Portfolio';
            const successAlert = jobCard.querySelector('.alert-success');
            if (successAlert) {
                successAlert.remove();
            }
        }
    }

    loadPersistedData() {
        this.hiddenJobs = new Set(JSON.parse(localStorage.getItem('skillswap_hidden_jobs') || '[]'));
        const portfolioData = JSON.parse(localStorage.getItem('skillswap_portfolio') || '{"jobs": [], "internships": []}');
        this.addedJobs = new Set([...portfolioData.jobs, ...portfolioData.internships].map(job => job.id));
    }

    showLoading() {
        this.jobsContainer.innerHTML = `
            <div class="text-center py-5 vh-100">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-3 text-primary">Searching...</p>
            </div>
        `;
    }
}

let jobSearchManager;
document.addEventListener('DOMContentLoaded', function() {
    jobSearchManager = new JobSearchManager();
});

function filterCourses() {
    if (jobSearchManager) jobSearchManager.searchJobs();
}
