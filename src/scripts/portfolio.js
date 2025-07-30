class PortfolioManager {
    constructor() {
        this.jobsList = document.getElementById('savedJobsList');
        this.internshipsList = document.getElementById('savedInternshipsList');
        this.leetcodeElements = {
            username: document.getElementById('leetcode-username'),
            problems: document.getElementById('leetcode-problems'),
            rank: document.getElementById('leetcode-rank'),
            easy: document.getElementById('leetcode-easy'),
            medium: document.getElementById('leetcode-medium'),
            hard: document.getElementById('leetcode-hard'),
            connectBtn: document.getElementById('leetcode-connect-btn')
        };
        this.loadPortfolioData();
        this.refreshLeetCodeData();
    }

    getDefaultLeetCodeStats() {
        return {
            username: 'Not connected',
            totalSolved: '...',
            ranking: '...',
            problems: { easy: '...', medium: '...', hard: '...' }
        };
    }

    async leetcodeData(username) {
        try {
            const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
            if (!response.ok) throw new Error(`API failed with status: ${response.status}`);
            const data = await response.json();
            if (data.status === 'error' || !data.totalSolved) return { error: "User not found. Please check the username." };
            return {
                username: username,
                ranking: data.ranking || 'N/A',
                problems: { easy: data.easySolved || 0, medium: data.mediumSolved || 0, hard: data.hardSolved || 0 },
                totalSolved: data.totalSolved || 0
            };
        } catch (error) {
            return { error: 'Failed to fetch LeetCode data. Please try again.' };
        }
    }

    async handleLeetCodeIntegration() {
        const username = prompt('Enter your LeetCode username:');
        if (!username) return;
        this.updateLeetCodeCard({
            username: username,
            totalSolved: 'Loading...',
            ranking: 'Loading...',
            problems: { easy: '...', medium: '...', hard: '...' }
        });
        const leetcodeData = await this.leetcodeData(username);
        if (leetcodeData && !leetcodeData?.error) {
            localStorage.setItem('leetcode_profile', JSON.stringify(leetcodeData));
            this.updateLeetCodeCard(leetcodeData);
        } else {
            showToast(leetcodeData.error, 'danger');
            this.updateLeetCodeCard(this.getDefaultLeetCodeStats());
        }
    }

    updateLeetCodeCard(stats) {
        const { username, problems, rank, easy, medium, hard, connectBtn } = this.leetcodeElements;
        if (username) username.textContent = stats.username || 'Not connected';
        if (problems) problems.textContent = stats.totalSolved || '...';
        if (rank) rank.textContent = (stats.ranking && stats.ranking !== 'N/A') ? '#' + stats.ranking.toLocaleString(): '...';
        if (easy && stats.problems) easy.textContent = stats.problems.easy || '...';
        if (medium && stats.problems) medium.textContent = stats.problems.medium || '...';
        if (hard && stats.problems) hard.textContent = stats.problems.hard || '...';
        if (connectBtn) {
            const isConnected = stats.username && stats.username !== 'Not connected';
            connectBtn.innerHTML = isConnected ? '<i class="bi bi-check-circle me-1"></i>Connected': '<i class="bi bi-link-45deg me-1"></i>Connect';
            connectBtn.className = isConnected ? 'btn btn-sm btn-outline-success flex-fill': 'btn btn-sm btn-outline-warning flex-fill';
        }
    }

    async refreshLeetCodeData() {
        const savedData = localStorage.getItem('leetcode_profile');
        if (!savedData) {
            showToast('No LeetCode profile connected. Please connect first.', 'warning');
            return;
        }
        if (!stats.username) {
            showToast('Invalid profile data. Please reconnect.', 'danger');
            return;
        }
        this.updateLeetCodeCard({
            username: stats.username,
            totalSolved: 'Refreshing...',
            ranking: 'Refreshing...',
            problems: { easy: '...', medium: '...', hard: '...' }
        });
        const stats = JSON.parse(savedData);
        const leetcodeData = await this.leetcodeData(stats.username);
        if (leetcodeData && !leetcodeData?.error) {
            localStorage.setItem('leetcode_profile', JSON.stringify(leetcodeData));
            this.updateLeetCodeCard(leetcodeData);
        } else {
            showToast(leetcodeData.error, 'danger');
            this.updateLeetCodeCard(stats);
        }
    }

    loadPortfolioData() {
        const portfolioData = JSON.parse(localStorage.getItem('skillswap_portfolio') || '{"jobs": [], "internships": []}');
        this.displaySavedItems(portfolioData.jobs, this.jobsList, 'job');
        this.displaySavedItems(portfolioData.internships, this.internshipsList, 'internship');
    }

    displaySavedItems(items, container, type) {
        if (!container) return;
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
        const addedDate = item.addedDate ? new Date(item.addedDate).toLocaleDateString() : 'Unknown';
        const badges = [
            item.employmentType && `<span class="badge bg-secondary me-2">${item.employmentType}</span>`,
            item.salary && `<span class="badge bg-success">${item.salary}</span>`,
            typeof item.remote === 'boolean' && `<span class="badge ${item.remote ? 'bg-info' : 'bg-warning'} ms-2">${item.remote ? 'Remote' : 'On-site'}</span>`,
            item.platform && `<span class="badge bg-primary ms-2">${item.platform}</span>`
        ].filter(Boolean).join('');

        return `
            <div class="col-md-4 mb-2">
                <div class="card portfolio-card pb-0" data-id="${item.id}">
                    <div class="card-header d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title text-primary mb-2">${item.title}</h5>
                            <p class="mb-1 text-cyan fw-semibold">${item.company}</p>
                            <p class="mb-0 text-muted small">${item.location}</p>
                        </div>
                        <small class="text-muted">${item.postedDate}</small>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">${badges}</div>
                        <div class="d-flex gap-2 justify-content-between align-items-center">
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="portfolioManager.removeItem('${item.id}', '${type}')"
                                    title="Remove from Portfolio">
                                <i class="bi bi-trash"></i>
                            </button>
                            <a href="${item.applyLink || '#'}" 
                               target="_blank" 
                               class="btn btn-outline-primary btn-sm"
                               ${!item.applyLink ? 'onclick="alert(\'Application link not available\'); return false;" style="opacity: 0.6;"' : ''}>
                                Apply Now <i class="bi bi-arrow-up-right"></i>
                            </a>
                        </div>
                        <div class="mt-2 text-end">
                            <small class="text-muted">Added: ${addedDate}</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    removeItem(itemId, type) {
        const portfolioData = JSON.parse(localStorage.getItem('skillswap_portfolio') || '{"jobs": [], "internships": []}');
        portfolioData[type === 'job' ? 'jobs' : 'internships'] = 
            portfolioData[type === 'job' ? 'jobs' : 'internships'].filter(item => item.id !== itemId);
        
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
