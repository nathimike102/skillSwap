class PortfolioManager {
    constructor() {
        this.jobsList = document.getElementById('savedJobsList');
        this.internshipsList = document.getElementById('savedInternshipsList');
        this.loadPortfolioData();
    }

    loadPortfolioData() {
        const portfolioData = JSON.parse(localStorage.getItem('skillswap_portfolio') || '{"jobs": [], "internships": []}');
        
        this.displaySavedItems(portfolioData.jobs, this.jobsList, 'job');
        this.displaySavedItems(portfolioData.internships, this.internshipsList, 'internship');
    }

    displaySavedItems(items, container, type) {
        if (!items || items.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-4">
                    <i class="bi bi-inbox display-4 text-muted mb-3"></i>
                    <p class="text-muted">No saved ${type}s yet. Start exploring to add some!</p>
                    <a href="jobs.html" class="btn btn-primary">
                        <i class="bi bi-search me-2"></i>Browse ${type.charAt(0).toUpperCase() + type.slice(1)}s
                    </a>
                </div>
            `;
            return;
        }

        const itemsHTML = items.map(item => this.createPortfolioCard(item, type)).join('');
        container.innerHTML = itemsHTML;
    }

    createPortfolioCard(item, type) {
        const addedDate = new Date(item.addedDate).toLocaleDateString();
        
        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card h-100 border-success bg-success bg-opacity-10">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title text-primary mb-1">${item.title}</h6>
                            <button class="btn btn-sm btn-outline-danger border-0" onclick="portfolioManager.removeItem('${item.id}', '${type}')" title="Remove from portfolio">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                        <p class="text-cyan small mb-2">${item.company}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-success">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            <small class="text-muted">Added: ${addedDate}</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    removeItem(itemId, type) {
        const portfolioData = JSON.parse(localStorage.getItem('skillswap_portfolio') || '{"jobs": [], "internships": []}');
        
        if (type === 'job') {
            portfolioData.jobs = portfolioData.jobs.filter(job => job.id !== itemId);
        } else {
            portfolioData.internships = portfolioData.internships.filter(internship => internship.id !== itemId);
        }
        
        localStorage.setItem('skillswap_portfolio', JSON.stringify(portfolioData));
        this.loadPortfolioData();
        
        if (typeof showToast === 'function') {
            showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} removed from portfolio`, 'info');
        }
    }
}

let portfolioManager;
document.addEventListener('DOMContentLoaded', function() {
    portfolioManager = new PortfolioManager();
});
