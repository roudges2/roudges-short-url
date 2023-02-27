const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 80;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

let urls = [];
fs.readFile('urls.json', (err, data) => {
    if (err) {
        console.error('Error loading URLs:', err);
    } else {
        urls = JSON.parse(data);
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/shorten', (req, res) => {
    const url = req.body.url;
    const customPath = req.body.customPath;
    let shortUrl;

    if (customPath && urls.find(obj => obj.shortUrl === customPath)) {
        return res.status(400).send('Custom path is already taken');
    }

    const domain = new URL(url).hostname;
    if (domain.endsWith('.onion') || domain.match(/porn|xxx|sex|adult/i)) {
        return res.status(400).send('URL not allowed');
    }

    if (customPath) {
        shortUrl = customPath;
    } else {
        shortUrl = Math.random().toString(36).substr(2, 6);
    }

    urls.push({ url: url, shortUrl: shortUrl });
    fs.writeFile('urls.json', JSON.stringify(urls), (err) => {
        if (err) {
            console.error('Error saving URL:', err);
            res.status(500).send('Error saving URL');
        } else {
            res.send({ shortUrl: shortUrl });
        }
    });
});

app.get('/urls', (req, res) => { // Remove this code from lines 56-58 if you don't want your URLs to be publicly visible
    res.json(urls);
});

app.get('/:shortUrl', (req, res) => {
    const shortUrl = req.params.shortUrl;
    const urlObj = urls.find((obj) => obj.shortUrl === shortUrl);
    if (urlObj) {
        urlObj.views = (urlObj.views || 0) + 1;
        fs.writeFile('urls.json', JSON.stringify(urls), (err) => {
            if (err) {
                console.error('Error saving URL:', err);
            }
        });
        res.redirect(urlObj.url);
    } else {
        res.status(404).send('404 NOT FOUND');
    }
});

app.listen(port || '3000', () => {
    console.log(`Server listening localhost:${port}`);
});
