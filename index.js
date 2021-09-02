// in your index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios').default;

// Initialize the app;
const app = express();
// Allows Cross-Origin Resource Sharing for this app.
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    const APP_ID = '94MguznMMeCb5ip5KpcMnGC8k4XzuxXL';
    const APP_SECRET = '9187c95f19058452262e5846fadaab53a254a3e11de41dea6a438edc402adc00';
    const code = req.query.code;
    if (!code) {
        res.status(403).send({ message: 'Invalid request.'});
    };
// Construct our POST url.
    const globe_labs_url = `https://developer.globelabs.com.ph/oauth/access_token?app_id=${APP_ID}&app_secret=${APP_SECRET}&code=${code}`;

// Send it to Globe Labs!
console.log(globe_labs_url);
    axios.post(globe_labs_url, {})
    .then((response) => {
        const access_token = response.data.access_token;
        const subscriber_number = response.data.subscriber_number;

        // Store this to the database!
        console.log(access_token, subscriber_number);
        res.status(200).send({ 
          accessToken : access_token,
          subscriberNumber : subscriber_number 
        });
    })
    .catch((err) => {
        // If there was an error, we should log it.
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error'});
    })
});

app.get('/', (req, res) => {
  res.status(200).send('/index.html');
})

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})