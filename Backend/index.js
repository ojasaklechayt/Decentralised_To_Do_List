const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Database Connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/tasks', taskRoutes);

app.use('/', (req, res) => {
    res.send("Welcome to our backend app");
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
