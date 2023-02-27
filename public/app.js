const urlForm = document.querySelector('#url-form');
const urlInput = document.querySelector('#url-input');
const shortUrlDiv = document.querySelector('#short-url');

urlForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = urlInput.value;

    fetch('/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
        .then(response => response.json())
        .then(data => {
            const shortUrl = data.shortUrl;
            shortUrlDiv.innerHTML = `<a href="${location.origin}/${shortUrl}">${location.origin}/${shortUrl}</a>`;
            urlInput.value = '';
            displayUrls();
        })
        .catch(error => console.error(error));
});

// Removed code that wasn't needed (feature I didn't finish)
