document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-AU', options);
        dateElement.textContent = formattedDate + ' | Sydney, NSW';
    }

    // Load more comments button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreBtn.textContent = 'No more comments';
            loadMoreBtn.disabled = true;
            loadMoreBtn.style.opacity = '0.6';
        });
    }
});
