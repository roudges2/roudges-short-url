const urlForm = document.querySelector('#url-form');
const urlInput = document.querySelector('#url-input');
const shortUrlDiv = document.querySelector('#short-url');
const urlTable = document.querySelector('#url-table');
const urlTableBody = document.querySelector('#url-table tbody');

function addUrlToTable(urlObj) {
    const newRow = document.createElement('tr');
    const urlCell = document.createElement('td');
    const shortUrlCell = document.createElement('td');
    const viewsCell = document.createElement('td');
    urlCell.textContent = urlObj.url;
    shortUrlCell.textContent = location.origin + '/' + urlObj.shortUrl;
    viewsCell.textContent = urlObj.views;
    newRow.appendChild(urlCell);
    newRow.appendChild(shortUrlCell);
    newRow.appendChild(viewsCell);
    urlTableBody.appendChild(newRow);
}

function displayUrls() {
    fetch('/urls')
        .then(response => response.json())
        .then(urls => {
            urls.sort((a, b) => b.views - a.views);
            urlTableBody.innerHTML = '';
            urls.forEach(addUrlToTable);
        })
        .catch(error => console.error(error));
}

displayUrls();

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
