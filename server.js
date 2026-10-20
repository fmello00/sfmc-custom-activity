const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON body parsing for incoming requests
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Required Execution (Runtime) endpoint called by Journey Builder
app.post('/execute', (req, res) => {
    // Contact data and configured inArguments will be received here
    const requestBody = req.body;
    
    console.log('--- Contact processed in journey ---');
    console.log(JSON.stringify(requestBody, null, 2));

    // Journey Builder expects a 200 OK status to confirm success
    return res.status(200).json({ status: 'ok' });
});

// Optional lifecycle endpoints for tracking and logging
app.post('/save', (req, res) => res.status(200).json({ status: 'ok' }));
app.post('/validate', (req, res) => res.status(200).json({ status: 'ok' }));
app.post('/publish', (req, res) => res.status(200).json({ status: 'ok' }));

app.listen(PORT, () => {
    console.log(`Server successfully running on port ${PORT}`);
});
