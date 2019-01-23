const express = require('express');
const bodyParser = require('body-parser');
const queryString = require('query-string');
const http = require('https');
const app = express();

const port = 3000;
const spotifyClientId = 'b5602abb639e4bcbbfa2162e136dd37e';
const spotifyClientSecret = '02342993ff154f218ecef39842f00613';

app.options('/api/token', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'access-control-allow-origin,authorization,content-type');
  res.setHeader('Access-Control-Max-Age', 1728000);
  res.setHeader('Cache-Control', 'no-cache')
  res.end();
});


app.use(bodyParser.json());
app.post('/api/token', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Cache-Control', 'no-cache')
  // let auth = Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64');
  let data = '';
  const spotifyReq = http.request({
    method: 'POST',
    hostname: 'accounts.spotify.com',
    port: 443,
    path: '/api/token',
    headers: {
      // 'Authorization': 'Bearer ' + auth,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, (spotifyRes) => {
    res.statusCode = spotifyRes.statusCode;
    res.statusMessage = spotifyRes.statusMessage;
    spotifyRes.on('data', (chunk) => {
      data += chunk;
    });
    spotifyRes.on('end', () => {
      res.setHeader('Content-Type', 'application/json')
      try {
        const json = JSON.parse(data);
        console.dir(json);
        res.json(json);
      } catch(e) {
        console.error(e);
        res.status(500).json(e);
      } finally {
        res.end();
      }
    });
  });

  const reqData = queryString.stringify(Object.assign({}, req.body, {
    'client_id': spotifyClientId,
    'client_secret': spotifyClientSecret
  }));
  
  spotifyReq.end(reqData);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});