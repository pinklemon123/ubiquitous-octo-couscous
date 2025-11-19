document.addEventListener('DOMContentLoaded', () => {
    const articleList = document.getElementById('article-list');
    const pdfViewer = document.getElementById('pdf-viewer');
    const emptyState = document.getElementById('empty-state');

    // Fetch the manifest
    fetch('manifest.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Manifest not found');
            }
            return response.json();
        })
        .then(data => {
            renderArticles(data);
        })
        .catch(error => {
            console.error('Error loading articles:', error);
            articleList.innerHTML = '<div class="error">No articles found. Upload some PDFs!</div>';
        });

    function renderArticles(articles) {
        articleList.innerHTML = '';

        // Sort articles by date (newest first)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        articles.forEach(article => {
            const item = document.createElement('div');
            item.className = 'article-item';

            const title = document.createElement('span');
            title.className = 'article-title';
            title.textContent = formatTitle(article.name);

            const date = document.createElement('span');
            date.className = 'article-date';
            date.textContent = formatDate(article.date);

            item.appendChild(title);
            item.appendChild(date);

            item.addEventListener('click', () => {
                // Remove active class from all items
                document.querySelectorAll('.article-item').forEach(el => el.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');

                loadPDF(article.path);
            });

            articleList.appendChild(item);
        });
    }

    function loadPDF(path) {
        emptyState.classList.add('hidden');
        pdfViewer.classList.remove('hidden');
        // Ensure path is encoded correctly
        pdfViewer.src = path;
    }

    function formatTitle(filename) {
        // Remove extension and replace dashes/underscores with spaces
        return filename.replace(/\.pdf$/i, '')
            .replace(/[-_]/g, ' ');
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
});
