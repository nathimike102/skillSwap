class PortfolioManager {
    constructor() {
        this.jobsList = document.getElementById('savedJobsList');
        this.internshipsList = document.getElementById('savedInternshipsList');
        this.platformConfigs = {
            leetcode: { 
                elements: ['username', 'problems', 'rank', 'easy', 'medium', 'hard', 'connectBtn'], 
                buttonColor: 'warning'
            },
            gfg: { 
                elements: ['username', 'problems', 'score', 'articles', 'easy', 'hard', 'connectBtn'], 
                buttonColor: 'success'
            },
            codechef: { 
                elements: ['username', 'rating', 'rank', 'stars', 'contests', 'problems', 'connectBtn'], 
                buttonColor: 'danger'
            },
            hackerrank: { 
                elements: ['username', 'badges', 'rank', 'certificates', 'problems', 'skills', 'connectBtn'], 
                buttonColor: 'info'
            },
            codeforces: { 
                elements: ['username', 'rating', 'max', 'contests', 'problems', 'rank', 'connectBtn'], 
                buttonColor: 'info'
            },
            github: { 
                elements: ['username', 'repos', 'stars', 'watchers', 'followers', 'following', 'connectBtn'], 
                buttonColor: 'light'
            }
        };
        this.platforms = Object.keys(this.platformConfigs);
        this.initializePlatformElements();
        this.loadSavedPlatformData();
        this.loadPortfolioData();
    }

    initializePlatformElements() {
        this.platforms.forEach(platform => {
            const config = this.platformConfigs[platform];
            const elementsObj = {};
            config.elements.forEach(elementType => {
                const elementId = elementType === 'connectBtn' 
                    ? `${platform}-connect-btn` 
                    : `${platform}-${elementType}`;
                const element = document.getElementById(elementId);
                elementsObj[elementType] = element;
            });
            this[`${platform}Elements`] = elementsObj;
        });
    }

    updateConnectButton(connectBtn, stats, color) {
        if (connectBtn) {
            const isConnected = stats && stats.username && stats.username !== 'Not connected';
            connectBtn.innerHTML = isConnected ? '<i class="bi bi-check-circle me-1"></i>Connected' : '<i class="bi bi-link-45deg me-1"></i>Connect';
            connectBtn.className = isConnected ? 'btn btn-sm btn-outline-success flex-fill' : `btn btn-sm btn-outline-${color} flex-fill`;
        }
    }

    getDefaultStats(platform) {
        const config = this.platformConfigs[platform];
        if (!config) return {};
        
        const stats = {};
        const defaultValues = ['Not connected', ...Array(config.elements.length - 2).fill('...')];
        
        config.elements.forEach((element, index) => {
            if (element === 'connectBtn') return;
            
            if (platform === 'leetcode' && element === 'problems') {
                stats[element] = { easy: '...', medium: '...', hard: '...' };
            } else {
                stats[element] = defaultValues[index] || '...';
            }
        });
        
        if (platform === 'leetcode') {
            Object.assign(stats, { totalSolved: '...', ranking: '...' });
        }
        
        return stats;
    }

    getDefaultLeetCodeStats() { return this.getDefaultStats('leetcode'); }
    getDefaultGfgStats() { return this.getDefaultStats('gfg'); }
    getDefaultCodeChefStats() { return this.getDefaultStats('codechef'); }
    getDefaultHackerRankStats() { return this.getDefaultStats('hackerrank'); }
    getDefaultCodeforcesStats() { return this.getDefaultStats('codeforces'); }
    getDefaultGitHubStats() { return this.getDefaultStats('github'); }

    loadSavedPlatformData() {
        this.platforms.forEach(platform => {
            const profileData = localStorage.getItem(`${platform}_profile`);
            const platformName = platform === 'leetcode' ? 'LeetCode' :
                               platform === 'gfg' ? 'Gfg' :
                               platform === 'codechef' ? 'CodeChef' :
                               platform === 'hackerrank' ? 'HackerRank' :
                               platform === 'codeforces' ? 'Codeforces' :
                               platform === 'github' ? 'GitHub' : 
                               platform.charAt(0).toUpperCase() + platform.slice(1);
            
            const updateMethod = this[`update${platformName}Card`];
            const refreshMethod = this[`refresh${platformName}Data`];
            const getDefaultMethod = this[`getDefault${platformName}Stats`];
            
            if (profileData) {
                try {
                    const stats = JSON.parse(profileData);
                    updateMethod.call(this, stats);
                    if (refreshMethod) refreshMethod.call(this);
                } catch (error) {
                    updateMethod.call(this, getDefaultMethod.call(this));
                }
            } else {
                updateMethod.call(this, getDefaultMethod.call(this));
            }
        });        
    }

    updatePlatformCard(platform, stats) {
        const elements = this[`${platform}Elements`];
        const config = this.platformConfigs[platform];
        
        if (!elements || !config) {
            return;
        }
        
        const specialMappings = {
            leetcode: {
                problems: () => stats.totalSolved || '...',
                rank: () => (stats.ranking && stats.ranking !== 'N/A') ? '#' + stats.ranking.toLocaleString() : '...',
                easy: () => stats.problems?.easy || '...',
                medium: () => stats.problems?.medium || '...',
                hard: () => stats.problems?.hard || '...'
            },
            codechef: { 
                rank: () => stats.rank ? '#' + stats.rank.toLocaleString() : '...' 
            },
            hackerrank: { 
                rank: () => stats.rank ? '#' + stats.rank.toLocaleString() : '...' 
            },
            codeforces: { 
                rank: () => stats.rank ? '#' + stats.rank.toLocaleString() : '...' 
            }
        };
        
        config.elements.forEach(elementType => {
            if (elementType === 'connectBtn') return;
            
            const element = elements[elementType];
            if (!element) {
                return;
            }
            
            try {
                if (specialMappings[platform]?.[elementType]) {
                    const value = specialMappings[platform][elementType]();
                    element.textContent = value;
                } else {
                    const defaultValue = elementType === 'username' ? 'Not connected' : '...';
                    const value = stats[elementType] || defaultValue;
                    element.textContent = value;
                }
            } catch (error) {
                // Silent error handling
            }
        });
        this.updateConnectButton(elements.connectBtn, stats, config.buttonColor);
    }

    updateLeetCodeCard(stats) { this.updatePlatformCard('leetcode', stats); }
    updateGfgCard(stats) { this.updatePlatformCard('gfg', stats); }
    updateCodeChefCard(stats) { this.updatePlatformCard('codechef', stats); }
    updateHackerRankCard(stats) { this.updatePlatformCard('hackerrank', stats); }
    updateCodeforcesCard(stats) { this.updatePlatformCard('codeforces', stats); }
    updateGitHubCard(stats) { this.updatePlatformCard('github', stats); }

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

    async githubData(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error(`GitHub API failed with status: ${response.status}`);
            const userData = await response.json();
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
            if (!reposResponse.ok) throw new Error(`GitHub API failed with status: ${reposResponse.status}`);
            const repos = await reposResponse.json();
            
            return {
                username: username,
                repos: userData.public_repos || 0,
                stars: repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
                watchers: repos.reduce((sum, repo) => sum + (repo.watchers_count || 0), 0),
                followers: userData.followers || 0,
                following: userData.following || 0
            };
        } catch (error) {
            return { error: 'Failed to fetch GitHub data. Please check the username.' };
        }
    }

    async handlePlatformIntegration(platform, promptText, hasAPI = false) {
        const username = prompt(promptText);
        if (!username) return;
        
        const platformName = platform === 'leetcode' ? 'LeetCode' :
                           platform === 'gfg' ? 'Gfg' :
                           platform === 'codechef' ? 'CodeChef' :
                           platform === 'hackerrank' ? 'HackerRank' :
                           platform === 'codeforces' ? 'Codeforces' :
                           platform === 'github' ? 'GitHub' : 
                           platform.charAt(0).toUpperCase() + platform.slice(1);
        
        const updateMethod = this[`update${platformName}Card`];
        const getDefaultMethod = this[`getDefault${platformName}Stats`];
        
        const loadingStats = { username, ...Object.fromEntries(
            this.platformConfigs[platform].elements
                .filter(el => el !== 'connectBtn' && el !== 'username')
                .map(el => [el, el === 'problems' && platform === 'leetcode' ? { easy: '...', medium: '...', hard: '...' } : 'Loading...'])
        )};
        updateMethod.call(this, loadingStats);
        
        if (hasAPI) {
            const apiMethod = this[`${platform}Data`];
            const apiData = await apiMethod.call(this, username);
            
            if (apiData && !apiData.error) {
                localStorage.setItem(`${platform}_profile`, JSON.stringify(apiData));
                updateMethod.call(this, apiData);
                if (typeof showToast === 'function') {
                    showToast(`${platformName} profile connected successfully!`, 'success');
                }
            } else {
                if (typeof showToast === 'function') {
                    showToast(apiData?.error || `Failed to connect ${platformName} profile.`, 'danger');
                }
                updateMethod.call(this, getDefaultMethod.call(this));
            }
        } else {
            const config = this.platformConfigs[platform];
            const placeholderData = { username, ...Object.fromEntries(
                config.elements
                    .filter(el => el !== 'connectBtn' && el !== 'username')
                    .map(el => [el, 'N/A'])
            )};
            
            localStorage.setItem(`${platform}_profile`, JSON.stringify(placeholderData));
            updateMethod.call(this, placeholderData);
            if (typeof showToast === 'function') {
                showToast(`${platformName} profile connected! (API integration pending)`, 'success');
            }
        }
    }

    async handleLeetCodeIntegration() {
        await this.handlePlatformIntegration('leetcode', 'Enter your LeetCode username:', true);
    }

    async handleGfgIntegration() {
        await this.handlePlatformIntegration('gfg', 'Enter your GeeksforGeeks username:', false);
    }

    async handleCodeChefIntegration() {
        await this.handlePlatformIntegration('codechef', 'Enter your CodeChef username:', false);
    }

    async handleHackerRankIntegration() {
        await this.handlePlatformIntegration('hackerrank', 'Enter your HackerRank username:', false);
    }

    async handleCodeforcesIntegration() {
        await this.handlePlatformIntegration('codeforces', 'Enter your Codeforces username:', false);
    }

    async handleGitHubIntegration() {
        await this.handlePlatformIntegration('github', 'Enter your GitHub username:', true);
    }

    async refreshPlatformData(platform, hasAPI = false) {
        const platformName = platform === 'leetcode' ? 'LeetCode' :
                           platform === 'gfg' ? 'Gfg' :
                           platform === 'codechef' ? 'CodeChef' :
                           platform === 'hackerrank' ? 'HackerRank' :
                           platform === 'codeforces' ? 'Codeforces' :
                           platform === 'github' ? 'GitHub' : 
                           platform.charAt(0).toUpperCase() + platform.slice(1);
        
        const savedData = localStorage.getItem(`${platform}_profile`);
        const updateMethod = this[`update${platformName}Card`];
        const getDefaultMethod = this[`getDefault${platformName}Stats`];
        
        if (!savedData) {
            updateMethod.call(this, getDefaultMethod.call(this));
            if (typeof showToast === 'function') {
                showToast(`No ${platformName} profile connected. Please connect first.`, 'warning');
            }
            return;
        }
        
        if (!hasAPI) {
            if (typeof showToast === 'function') {
                showToast(`${platformName} API integration coming soon!`, 'info');
            }
            return;
        }
        
        const stats = JSON.parse(savedData);
        if (!stats.username) {
            if (typeof showToast === 'function') {
                showToast('Invalid profile data. Please reconnect.', 'danger');
            }
            return;
        }
        
        const refreshingStats = { ...stats };
        this.platformConfigs[platform].elements
            .filter(el => el !== 'connectBtn' && el !== 'username')
            .forEach(el => {
                if (el !== 'problems' || platform !== 'leetcode') {
                    refreshingStats[el] = 'Refreshing...';
                }
            });
        updateMethod.call(this, refreshingStats);
        
        const apiMethod = this[`${platform}Data`];
        const apiData = await apiMethod.call(this, stats.username);
        
        if (apiData && !apiData.error) {
            localStorage.setItem(`${platform}_profile`, JSON.stringify(apiData));
            if (platform === 'github') await new Promise(resolve => setTimeout(resolve, 2000));
            updateMethod.call(this, apiData);
            if (typeof showToast === 'function') {
                showToast(`${platformName} data refreshed successfully!`, 'success');
            }
        } else {
            if (typeof showToast === 'function') {
                showToast(apiData?.error || 'Failed to refresh data', 'danger');
            }
            updateMethod.call(this, stats);
        }
    }

    async refreshLeetCodeData() { await this.refreshPlatformData('leetcode', true); }
    async refreshGfgData() { await this.refreshPlatformData('gfg', false); }
    async refreshCodeChefData() { await this.refreshPlatformData('codechef', false); }
    async refreshHackerRankData() { await this.refreshPlatformData('hackerrank', false); }
    async refreshCodeforcesData() { await this.refreshPlatformData('codeforces', false); }
    async refreshGitHubData() { await this.refreshPlatformData('github', true); }

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
};

let portfolioManager;
document.addEventListener('DOMContentLoaded', function() {
    portfolioManager = new PortfolioManager();
});