// in your index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios').default;

// Initialize the app;
const app = express();
// Allows Cross-Origin Resource Sharing for this app.
app.use(cors());
app.use(express.json());

const APP_ID = 'X6A6CGdBaetq5cdA7xTBnLtKG69ACLXA';
const APP_SECRET = '75e9497563247a9ef69c0521af0327bef6bb64973518d30c08b2a8c954295afe';
const shortCode = "21667138";
const shortCodeLast4Digit = "7138";

app.get('/', (req, res) => {
    const code = req.query.code;
    if (!code) {
        res.status(403).send({ message: 'Invalid request.' });
    } else {
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
                    accessToken: access_token,
                    subscriberNumber: subscriber_number
                });
            })
            .catch((err) => {
                // If there was an error, we should log it.
                console.log(err);
                res.status(500).send({ message: err });
            })
    }

});

app.get('/send-message', (req, res) => {
    const accessToken = req.query.accessToken;
    const subscriberNumber = req.query.subscriberNumber;
    const message = req.query.message || 'Test Message';

    if (!accessToken || !subscriberNumber) {
        res.status(403).send({ message: 'No accessToken or subscriberNumber given.' });
    } else {
        console.log(accessToken, subscriberNumber);
        //res.status(200).send({'message' : 'gets'});

        // Then, we need to compose our payload that we will send to Globe Labs.
        const payload = {
            "outboundSMSMessageRequest": {
                "outboundSMSTextMessage": {
                    "message": message
                },
                "senderAddress": `${shortCodeLast4Digit}`,
                "address": `${subscriberNumber}`
            }
        }

        // Compose our url
        const url = `https://devapi.globelabs.com.ph/smsmessaging/v1/outbound/${shortCodeLast4Digit}/requests?access_token=${accessToken}`;

        // Send the request via Axios.
        axios.post(url, payload)
            .then(() => {
                // Success!
                res.send(`Message sent!`);
            })
            .catch((err) => {
                // If there was an error, we should log it.
                console.error(err);
                //res.sendStatus(500);
                res.status(500).send({ message: err });
            })
    }
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})