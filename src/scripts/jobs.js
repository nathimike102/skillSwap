class JobSearchManager {
    constructor() {
        this.apiKey = '92a968a7dcmshd58ec8b5bebbe63p1938eajsn44d49f288f24';
        this.apiHost = 'jsearch.p.rapidapi.com';
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
        if (searchButton) {
            searchButton.setAttribute('onclick', 'jobSearchManager.searchJobs()');
        }

        const searchInputs = ['skillSelect', 'locationSelect', 'platformSelect'];
        searchInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.searchJobs();
                    }
                });
            }
        });
        const jobsToggle = document.getElementById('jobsToggle');
        const internshipsToggle = document.getElementById('internshipsToggle');
        
        if (jobsToggle) {
            jobsToggle.addEventListener('change', () => {
                if (jobsToggle.checked) {
                    this.currentJobType = 'jobs';
                    document.getElementById('listingTitle').textContent = 'Job Listings';
                    this.searchJobs();
                }
            });
        }
        
        if (internshipsToggle) {
            internshipsToggle.addEventListener('change', () => {
                if (internshipsToggle.checked) {
                    this.currentJobType = 'internships';
                    document.getElementById('listingTitle').textContent = 'Internship Listings';
                    this.searchJobs();
                }
            });
        }
    }

    async searchJobs() {
        const skill = document.getElementById('skillSelect').value;
        const location = document.getElementById('locationSelect').value;
        const platform = document.getElementById('platformSelect').value;

        let query = this.currentJobType === 'internships' ? 'internship' : 'developer jobs';
        
        if (skill) {
            query = this.currentJobType === 'internships' 
                ? `${skill} internship` 
                : `${skill} developer jobs`;
        }
        if (location) {
            query += ` in ${location}`;
        }
        if (platform) {
            query += ` on ${platform}`;
        }
        await this.fetchJobs(query, location || 'india', platform || 'any');
    }

    async loadDefaultJobs() {
        const defaultQuery = this.currentJobType === 'internships' 
            ? 'software developer internship' 
            : 'software developer jobs';
        await this.fetchJobs(defaultQuery, 'india');
    }

    async fetchJobs(query, location = 'india') {
        this.showLoading();
        
        const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=in&date_posted=all`;
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
            if (result.status === 'OK' && result.data) {
                this.displayJobs(result.data);
            }
        } catch (error) {
            showToast('Failed to fetch jobs. Please try again later.', 'danger');
        }
    }

    displayJobs(jobs) {
        if (!jobs || jobs.length === 0) {
            showToast('No jobs found for your search criteria.', 'danger');
            return;
        }
        const visibleJobs = jobs.filter(job => !this.hiddenJobs.has(job.job_id));
        
        if (visibleJobs.length === 0) {
            this.jobsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted">All jobs have been hidden. Try a new search or reset filters.</p>
                </div>
            `;
            return;
        }

        const jobsHTML = visibleJobs.map(job => this.createJobCard(job)).join('');
        this.jobsContainer.innerHTML = jobsHTML;
    }

    createJobCard(job) {
        const salary = job.job_salary_currency && job.job_min_salary 
            ? `${job.job_salary_currency} ${job.job_min_salary}${job.job_max_salary ? ` - ${job.job_max_salary}` : ''}` 
            : 'Salary not specified';

        const employmentType = job.job_employment_type || 'Not specified';

        const location = job.job_city && job.job_country 
            ? `${job.job_city}, ${job.job_country}` 
            : job.job_country || 'Location not specified';

        const postedDate = job.job_posted_at_datetime_utc 
            ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString() 
            : 'Date not available';

        const isAdded = this.addedJobs.has(job.job_id);
        const cardClass = isAdded ? 'card job-card h-100 border-success bg-success bg-opacity-10' : 'card job-card h-100';

        return `
            <div class="col-md-6 mb-4">
                <div class="${cardClass}" data-job-id="${job.job_id}">
                    <div class="card-header d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title text-primary mb-2">${job.job_title || 'Job Title Not Available'}</h5>
                            <p class="mb-1 text-cyan fw-semibold">${job.employer_name || 'Company Not Specified'}</p>
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
                            </div>
                            <p class="text-light mb-3">${this.truncateText(job.job_description || 'No description available', 120)}</p>
                            ${isAdded ? '<div class="alert alert-success py-2 mb-3"><i class="bi bi-check-circle me-2"></i>Added to Portfolio</div>' : ''}
                        </div>
                        <div class="d-flex gap-2 justify-content-between align-items-center">
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm ${isAdded ? 'btn-success' : 'btn-outline-success'}" 
                                        onclick="jobSearchManager.addToPortfolio('${job.job_id}', '${this.currentJobType}')"
                                        ${isAdded ? 'disabled' : ''}>
                                    <i class="bi bi-plus-circle"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" 
                                        onclick="jobSearchManager.hideJob('${job.job_id}')">
                                    <i class="bi bi-dash-circle"></i>
                                </button>
                            </div>
                            <a href="${job.job_apply_link || '#'}" 
                               target="_blank" 
                               class="btn btn-primary btn-sm"
                               ${!job.job_apply_link ? 'onclick="alert(\'Application link not available\')" style="pointer-events: none; opacity: 0.6;"' : ''}>
                                Apply Now <i class="bi bi-arrow-up-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    addToPortfolio(jobId, jobType) {
        this.addedJobs.add(jobId);
        const portfolioData = JSON.parse(localStorage.getItem('skillswap_portfolio') || '{"jobs": [], "internships": []}');
        const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
        if (jobCard) {
            const jobData = {
                id: jobId,
                title: jobCard.querySelector('.card-title').textContent,
                company: jobCard.querySelector('.text-cyan').textContent,
                type: jobType,
                addedDate: new Date().toISOString()
            };
            
            if (jobType === 'jobs') {
                portfolioData.jobs.push(jobData);
            } else {
                portfolioData.internships.push(jobData);
            }
            
            localStorage.setItem('skillswap_portfolio', JSON.stringify(portfolioData));
        }
        
        this.updateJobCardUI(jobId, true);
        showToast(`${jobType === 'jobs' ? 'Job' : 'Internship'} added to portfolio!`, 'success');
    }

    hideJob(jobId) {
        this.hiddenJobs.add(jobId);
        const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
        if (jobCard) {
            jobCard.closest('.col-md-6').remove();
        }
        const hiddenJobs = JSON.parse(localStorage.getItem('skillswap_hidden_jobs') || '[]');
        hiddenJobs.push(jobId);
        localStorage.setItem('skillswap_hidden_jobs', JSON.stringify(hiddenJobs));
        showToast('Job removed from search results', 'info');
    }

    updateJobCardUI(jobId, isAdded) {
        const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
        if (!jobCard) return;
        
        const addButton = jobCard.querySelector('.btn-outline-success, .btn-success');
        const cardElement = jobCard;
        
        if (isAdded) {
            cardElement.className = 'card job-card h-100 border-success bg-success bg-opacity-10';
            addButton.className = 'btn btn-sm btn-success';
            addButton.disabled = true;
            
            if (!jobCard.querySelector('.alert-success')) {
                const jobDetails = jobCard.querySelector('.job-details');
                const successAlert = document.createElement('div');
                successAlert.className = 'alert alert-success py-2 mb-3';
                successAlert.innerHTML = '<i class="bi bi-check-circle me-2"></i>Added to Portfolio';
                jobDetails.appendChild(successAlert);
            }
        }
    }

    loadPersistedData() {
        const hiddenJobs = JSON.parse(localStorage.getItem('skillswap_hidden_jobs') || '[]');
        this.hiddenJobs = new Set(hiddenJobs);
        const portfolioData = JSON.parse(localStorage.getItem('skillswap_portfolio') || '{"jobs": [], "internships": []}');
        const allAddedJobs = [...portfolioData.jobs, ...portfolioData.internships].map(job => job.id);
        this.addedJobs = new Set(allAddedJobs);
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
    if (jobSearchManager) {
        jobSearchManager.searchJobs();
    }
}