import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());
app.use(express.static('public'));
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/api/user', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:7252/api/user');
        res.send(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});


