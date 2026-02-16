// Global state
let currentRepo = {
    owner: '',
    name: '',
    defaultBranch: 'main'
};

// Configure Marked.js for security
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: true,
        gfm: true
    });
}

// Parse GitHub URL
function parseGitHubUrl(url) {
    try {
        const urlObj = new URL(url.trim());
        const pathParts = urlObj.pathname.split('/').filter(p => p);
        
        if (urlObj.hostname !== 'github.com' || pathParts.length < 2) {
            return null;
        }
        
        return {
            owner: pathParts[0],
            name: pathParts[1]
        };
    } catch (e) {
        return null;
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('loadingMessage').style.display = 'none';
}

// Hide error message
function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

// Show loading message
function showLoading() {
    document.getElementById('loadingMessage').style.display = 'block';
    hideError();
}

// Hide loading message
function hideLoading() {
    document.getElementById('loadingMessage').style.display = 'none';
}

// Fetch repository info
async function fetchRepoInfo(owner, name) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch repository: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

// Fetch repository file tree
async function fetchFileTree(owner, name, branch = 'main') {
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}/git/trees/${branch}?recursive=1`);
    if (!response.ok) {
        // Try 'master' if 'main' fails
        if (branch === 'main') {
            return fetchFileTree(owner, name, 'master');
        }
        throw new Error(`Failed to fetch file tree: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

// Fetch file content
async function fetchFileContent(owner, name, path, branch) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}/contents/${path}?ref=${branch}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    // Decode base64 content with UTF-8 support using modern API
    if (data.content) {
        // Remove newlines from base64 string
        const base64 = data.content.replace(/\n/g, '');
        // Decode base64 and handle UTF-8 characters properly
        const binaryString = atob(base64);
        const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
        return new TextDecoder().decode(bytes);
    }
    return '';
}

// Render file tree
function renderFileTree(tree) {
    const fileTreeDiv = document.getElementById('fileTree');
    fileTreeDiv.innerHTML = '';
    
    // Filter for HTML and MD files, sort them
    const relevantFiles = tree.tree
        .filter(item => {
            const ext = item.path.toLowerCase();
            return item.type === 'blob' && (ext.endsWith('.md') || ext.endsWith('.html'));
        })
        .sort((a, b) => {
            // README.md should be first
            if (a.path.toLowerCase().includes('readme')) return -1;
            if (b.path.toLowerCase().includes('readme')) return 1;
            return a.path.localeCompare(b.path);
        });
    
    if (relevantFiles.length === 0) {
        fileTreeDiv.innerHTML = '<p style="color: #586069; padding: 10px;">No HTML or Markdown files found.</p>';
        return;
    }
    
    relevantFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.textContent = file.path;
        fileItem.onclick = () => loadFile(file.path);
        fileTreeDiv.appendChild(fileItem);
    });
}

// Load and display file content
async function loadFile(path) {
    try {
        showLoading();
        
        // Remove active class from all file items
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        const fileItems = Array.from(document.querySelectorAll('.file-item'));
        const activeItem = fileItems.find(item => item.textContent === path);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        const content = await fetchFileContent(
            currentRepo.owner,
            currentRepo.name,
            path,
            currentRepo.defaultBranch
        );
        
        const contentDiv = document.getElementById('fileContent');
        const ext = path.toLowerCase();
        
        if (ext.endsWith('.md')) {
            // Render Markdown with sanitization
            const html = marked.parse(content);
            contentDiv.innerHTML = typeof DOMPurify !== 'undefined' 
                ? DOMPurify.sanitize(html) 
                : html;
        } else if (ext.endsWith('.html')) {
            // Display HTML as code (not render it)
            contentDiv.innerHTML = `<pre><code>${escapeHtml(content)}</code></pre>`;
        } else {
            contentDiv.innerHTML = `<pre><code>${escapeHtml(content)}</code></pre>`;
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showError(`Error loading file: ${error.message}`);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Main function to load repository
async function loadRepository() {
    const urlInput = document.getElementById('repoUrl');
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please enter a GitHub repository URL');
        return;
    }
    
    hideError();
    showLoading();
    
    // Hide previous content
    document.getElementById('repoInfo').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
    
    try {
        // Parse URL
        const parsed = parseGitHubUrl(url);
        if (!parsed) {
            throw new Error('Invalid GitHub URL. Please use format: https://github.com/owner/repository');
        }
        
        currentRepo.owner = parsed.owner;
        currentRepo.name = parsed.name;
        
        // Fetch repository info
        const repoInfo = await fetchRepoInfo(parsed.owner, parsed.name);
        currentRepo.defaultBranch = repoInfo.default_branch;
        
        // Display repo info
        document.getElementById('repoName').textContent = repoInfo.full_name;
        document.getElementById('repoDescription').textContent = repoInfo.description || 'No description available';
        document.getElementById('githubLink').href = repoInfo.html_url;
        document.getElementById('repoInfo').style.display = 'block';
        
        // Fetch file tree
        const tree = await fetchFileTree(parsed.owner, parsed.name, currentRepo.defaultBranch);
        
        // Render file tree
        renderFileTree(tree);
        
        // Show main content
        document.getElementById('mainContent').style.display = 'grid';
        
        // Try to load README.md automatically
        const readmeFile = tree.tree.find(item => 
            item.type === 'blob' && item.path.toLowerCase() === 'readme.md'
        );
        
        if (readmeFile) {
            loadFile(readmeFile.path);
        } else {
            hideLoading();
            document.getElementById('fileContent').innerHTML = 
                '<p style="color: #586069;">Select a file from the sidebar to preview its contents.</p>';
        }
        
    } catch (error) {
        hideLoading();
        showError(`Error: ${error.message}`);
    }
}

// Allow Enter key to trigger load
document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('repoUrl');
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadRepository();
        }
    });
});
