class JobSearchManager {
    constructor() {
        this.apiKey = '92a968a7dcmshd58ec8b5bebbe63p1938eajsn44d49f288f24';
        this.apiHost = 'jsearch.p.rapidapi.com';
        this.jobsContainer = document.getElementById('jobList');
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
    }

    async searchJobs() {
        const skill = document.getElementById('skillSelect').value;
        const location = document.getElementById('locationSelect').value;
        const platform = document.getElementById('platformSelect').value;

        let query = 'developer jobs';
        if (skill) {
            query = `${skill} developer jobs`;
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
        await this.fetchJobs('software developer jobs', 'india');
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

        const jobsHTML = jobs.map(job => this.createJobCard(job)).join('');
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

        return `
            <div class="col-10 mx-auto">
                <div class="card list-group-item mb-3 border rounded">
                    <div class="d-flex w-100 justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="mb-1 text-primary">${job.job_title || 'Job Title Not Available'}</h5>
                                <small class="text-muted mx-3">${postedDate}</small>
                            </div>
                            <p class="mb-1 text-cyan fw-semibold">${job.employer_name || 'Company Not Specified'}</p>
                            <p class="mb-2 text-muted">${location}</p>
                            <div class="mb-2">
                                <span class="badge bg-secondary me-2">${employmentType}</span>
                                <span class="badge bg-success">${salary}</span>
                            </div>
                            <p class="mb-2 text-light">${this.truncateText(job.job_description || 'No description available', 150)}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                    ${job.job_is_remote ? '<i class="bi bi-house-door me-1"></i>Remote' : '<i class="bi bi-building me-1"></i>On-site'}
                                </small>
                                <a href="${job.job_apply_link || '#'}" 
                                target="_blank" 
                                class="btn btn-outline-primary btn-sm"
                                ${!job.job_apply_link ? 'onclick="alert(\'Application link not available\')" style="pointer-events: none; opacity: 0.6;"' : ''}>
                                    Apply Now <i class="bi bi-arrow-up-right"></i>
                                </a>
                            </div>
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

    showLoading() {
        this.jobsContainer.innerHTML = `
            <div class="text-center py-5 vh-100">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-primary">Searching for jobs...</p>
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
