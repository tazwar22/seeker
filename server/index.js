const express = require('express');

const config = require('dotenv').config();

const app = express();
app.use(express.json());
app.use(
    express.urlencoded({
      extended: true
    })
);

const PORT = process.env.PORT || 8000;

app.get('/', (req, res)=>{
    res.send('*** Seeker Backend ***');
});

app.listen(PORT, ()=>{
    console.log(`SpotyExpo running on port ${PORT}`);
});