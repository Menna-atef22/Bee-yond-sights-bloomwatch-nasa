    const express = require('express');
    const cors = require('cors');
    const { spawn } = require('child_process');
    const path = require('path');

    const app = express();

    const port = 4000;

    // Define the Python executable path for your environment
    const pythonExecutable = "C:/Users/pc/AppData/Local/Programs/Python/Python39/python.exe"

    app.use(cors());
    app.use(express.json());


    app.post('/predict-crop-health', (req, res) => {
        const inputData = req.body;
        const dataString = JSON.stringify(inputData);

        const scriptPath = path.join(__dirname, '..', 'Models', 'predict_crop_health.py');

        console.log('--- API Request Received ---');
        console.log('Input Data:', inputData);
        console.log(`Running command: ${pythonExecutable} ${scriptPath}`);

        const pythonProcess = spawn(pythonExecutable, [scriptPath, dataString]);

        let predictionData = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data) => {
            predictionData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            console.log('--- Python stdout ---');
            console.log(predictionData);
            console.log('--- End Python stdout ---');
            if (errorData) {
                console.error('--- Python stderr ---');
                console.error(errorData);
                console.error('--- End Python stderr ---');
                return res.status(500).json({ 
                    error: 'The Python script returned an error.', 
                    details: errorData 
                });
            }
            if (!predictionData.trim()) {
                const errorMessage = `The Python script produced no output. This often means there was an early error (like a missing library) or a problem with the Python path. Exit code: ${code}.`;
                console.error(errorMessage);
                return res.status(500).json({ 
                    error: 'The Python script produced no output.',
                    details: errorMessage
                });
            }
            try {
                const prediction = JSON.parse(predictionData);
                if (prediction.error) {
                    console.error('Python script returned a JSON error object:', prediction);
                    return res.status(500).json({ 
                        error: 'The Python script reported an internal error.', 
                        details: prediction.details || JSON.stringify(prediction)
                    });
                }
                res.json(prediction);
            } catch (parseError) {
                console.error('--- JSON Parse Error ---');
                console.error(`Error parsing JSON from Python: ${parseError}`);
                console.error('Raw output:', predictionData);
                res.status(500).json({ 
                    error: 'Failed to parse the output from the Python script as JSON.', 
                    details: predictionData 
                });
            }
        });
    });

    app.listen(port, () => {
        console.log(`Crop Health API server running at http://localhost:${port}`);
    });

