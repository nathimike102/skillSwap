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
        this.displayResume();
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
                element.textContent = 'Error';
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

    async gfgData(username) {
        try {
            const proxyUrl = "https://api.allorigins.win/get?url=";
            const gfgUrl = `https://auth.geeksforgeeks.org/user/${username}/practice/`;
            
            const response = await fetch(proxyUrl + encodeURIComponent(gfgUrl));
            const data = await response.json();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, "text/html");
            
            const problems = doc.querySelector(".score_card_value")?.textContent || "N/A";
            const easy = doc.querySelector(".easy")?.textContent || "N/A";
            const hard = doc.querySelector(".hard")?.textContent || "N/A";
            
            return {
                username,
                problems,
                score: "N/A",
                articles: "N/A",
                easy,
                hard
            };
        } catch (error) {
            return { error: 'Failed to fetch GFG data. Please try again.' };
        }
    }

    async codechefData(username) {
        try {
            const response = await fetch(`https://competitive-coding-api.herokuapp.com/api/codechef/${username}`);
            const data = await response.json();
            
            if (data.status === "Success") {
                return {
                    username: data.user_details.username,
                    rating: data.rating || "N/A",
                    rank: data.global_rank || "N/A",
                    stars: data.stars || "N/A",
                    contests: data.fully_solved.count || "N/A",
                    problems: data.fully_solved.count || "N/A"
                };
            } else {
                throw new Error(data.message || "Failed to fetch data");
            }
        } catch (error) {
            console.error("CodeChef API Error:", error);
            return { error: 'Failed to fetch CodeChef data. Please try again.' };
        }
    }

    async hackerrankData(username) {
        try {
            const response = await fetch(`https://competitive-coding-api.herokuapp.com/api/hackerrank/${username}`);
            const data = await response.json();
            
            if (data.status === "Success") {
                return {
                    username: data.username,
                    badges: data.badges.length || "N/A",
                    rank: data.rank || "N/A",
                    certificates: data.certificates.length || "N/A",
                    problems: data.problems_solved || "N/A",
                    skills: data.skills.length || "N/A"
                };
            } else {
                throw new Error(data.message || "Failed to fetch data");
            }
        } catch (error) {
            return { error: 'Failed to fetch HackerRank data. Please try again.' };
        }
    }

    async codeforcesData(username) {
        try {
            const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
            const data = await response.json();
            
            if (data.status === "OK") {
                const user = data.result[0];
                return {
                    username: user.handle,
                    rating: user.rating || "N/A",
                    max: user.maxRating || "N/A",
                    contests: user.contribution || "N/A",
                    problems: "N/A",
                    rank: user.rank || "N/A"
                };
            } else {
                throw new Error(data.comment || "Failed to fetch data");
            }
        } catch (error) {
            return {error: 'Failed to fetch Codeforces data. Please try again.' };
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

    async handlePlatformIntegration(platform, promptText, hasAPI = true) {
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
    }

    async handleLeetCodeIntegration() {
        await this.handlePlatformIntegration('leetcode', 'Enter your LeetCode username:');
    }

    async handleGfgIntegration() {
        await this.handlePlatformIntegration('gfg', 'Enter your GeeksforGeeks username:');
    }

    async handleCodeChefIntegration() {
        await this.handlePlatformIntegration('codechef', 'Enter your CodeChef username:');
    }

    async handleHackerRankIntegration() {
        await this.handlePlatformIntegration('hackerrank', 'Enter your HackerRank username:');
    }

    async handleCodeforcesIntegration() {
        await this.handlePlatformIntegration('codeforces', 'Enter your Codeforces username:');
    }

    async handleGitHubIntegration() {
        await this.handlePlatformIntegration('github', 'Enter your GitHub username:');
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
    async refreshGfgData() { await this.refreshPlatformData('gfg', true); }
    async refreshCodeChefData() { await this.refreshPlatformData('codechef', true); }
    async refreshHackerRankData() { await this.refreshPlatformData('hackerrank', true); }
    async refreshCodeforcesData() { await this.refreshPlatformData('codeforces', true); }
    async refreshGitHubData() { await this.refreshPlatformData('github', true); }

    displayResume() {
        const resumeData = JSON.parse(localStorage.getItem('skillswap_resume'));
        const resume = document.getElementById('resumeContent');

        if (!resumeData) {
            resume.innerHTML = `
                <i class="bi bi-inbox display-4 text-muted mb-3"></i>
                <p class="text-muted">No saved resume yet. Add one now!</p>
                <label class="btn btn-primary mb-0">
                    <i class="bi bi-upload me-2"></i>Add Resume
                    <input type="file" id="resumeUploadInput" accept=".pdf,.doc,.docx" style="display:none" onchange="portfolioManager.handleResumeUpload(event)">
                </label>`;
            return;
        }
        resume.innerHTML = `
            <iframe src="${resumeData.content}" style="width: 100%; height: 600px;" frameborder="0"></iframe>
            <div class="mt-3 d-flex justify-content-between align-items-center">
                <span class="text-muted small">File: ${resumeData.fileName}</span>
                <div>
                    <label class="btn btn-sm btn-outline-primary me-2 mb-0">
                        <i class="bi bi-upload me-1"></i>Replace Resume
                        <input type="file" id="resumeUploadInput" accept=".pdf,.doc,.docx" style="display:none" onchange="portfolioManager.handleResumeUpload(event)">
                    </label>
                    <button class="btn btn-sm btn-outline-danger" onclick="portfolioManager.deleteResume()">
                        <i class="bi bi-trash me-1"></i>Delete
                    </button>
                </div>
            </div>`;
    }

    handleResumeUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const validTypes = ['application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a PDF or Word document (.pdf, .doc, .docx)');
            return;
        }
        const maxSize = 5 * 1024 * 1024; 
        if (file.size > maxSize) {
            showToast('File size must be less than 5MB. Please choose a smaller file.', 'danger');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem('skillswap_resume', JSON.stringify({ fileName: file.name, content: e.target.result }));
            portfolioManager.displayResume();
        };
        reader.readAsDataURL(file);
    }

    deleteResume() {
        if (confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
            localStorage.removeItem('skillswap_resume');
            this.displayResume();
            if (typeof showToast === 'function') {
                showToast('Resume deleted successfully.', 'info');
            }
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
};

let portfolioManager;
document.addEventListener('DOMContentLoaded', function() {
    portfolioManager = new PortfolioManager();
});