const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/log.html');
});

const USERS_FILE = path.join(__dirname, 'users.json');
const SURVEYS_FILE = path.join(__dirname, 'surveys.json');

// Helper to read data
const readData = (file) => {
    try {
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to write data
const writeData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
};

// AUTH ENDPOINTS
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
    const users = readData(USERS_FILE);
    const user = users.find(u => u.username === username && u.password === password && u.role === role);

    if (user) {
        res.json({ success: true, user: { username: user.username, role: user.role } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/register', (req, res) => {
    const { username, password, role } = req.body;
    const users = readData(USERS_FILE);

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = { username, password, role };
    users.push(newUser);
    writeData(USERS_FILE, users);
    res.json({ success: true });
});

// SURVEY ENDPOINTS
app.get('/api/surveys', (req, res) => {
    const { college } = req.query;
    let surveys = readData(SURVEYS_FILE);

    if (college) {
        surveys = surveys.filter(s => s.college === college);
    }

    res.json(surveys);
});

app.post('/api/surveys', (req, res) => {
    const surveyData = req.body;
    const surveys = readData(SURVEYS_FILE);

    surveys.push({
        id: Date.now().toString(),
        ...surveyData,
        date: new Date().toLocaleString()
    });

    writeData(SURVEYS_FILE, surveys);
    res.json({ success: true });
});

app.delete('/api/surveys/:id', (req, res) => {
    const { id } = req.params;
    let surveys = readData(SURVEYS_FILE);
    const initialLength = surveys.length;

    surveys = surveys.filter(s => s.id !== id);

    if (surveys.length === initialLength) {
        return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    writeData(SURVEYS_FILE, surveys);
    res.json({ success: true });
});

// RANKING ENDPOINT
app.get('/api/rankings', (req, res) => {
    const surveys = readData(SURVEYS_FILE);
    const colleges = [
        "Kongu Engineering College",
        "Nandha Engineering College",
        "Velalar College",
        "Bannari Amman",
        "Erode Arts"
    ];

    const results = colleges.map(c => {
        const data = surveys.filter(s => s.college === c);
        const total = data.length;
        let avg = 0;
        if (total > 0) {
            const sum = data.reduce((a, b) => a + Number(b.avg), 0);
            avg = sum / total;
        }
        return { college: c, avg, total };
    });

    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
