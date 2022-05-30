const express = require('express');
const config = require('dotenv').config();
const cors = require('cors'); 
const tt = require('@tomtom-international/web-sdk-services/dist/services-node.min.js');

const app = express();
app.use(express.json());
app.use(cors());
app.use(
    express.urlencoded({
      extended: true
    })
);
const PORT = process.env.PORT || 8000;

app.get('/', (req, res)=>{
    res.send('*** Seeker Backend ***');
});

app.get('/api/nearby_points', (req, res)=>{
    console.log('Getting nearby POI');
    const origin = {lat:req.query.lat, lon:req.query.lon}
    console.log(origin)
    tt.services
    .nearbySearch({
        key: process.env.TT_API_KEY,
        center: [origin.lon, origin.lat],
        radius: 3000,
        limit:100,
    }).then((data)=>{
        console.log(data);
        res.status(200).send(data);
    }).catch((err)=>{
        console.error(err);
    });
});


app.get('/api/nearby_points_by_cat', (req, res)=>{
    console.log('Getting nearby POI');
    const origin = {lat:req.query.lat, lon:req.query.lon};
    const category = req.query.categ;
    console.log(origin);
    console.log(category);
    tt.services
    .categorySearch({
        key: process.env.TT_API_KEY,
        query:category,
        center: [origin.lon,  origin.lat],
        radius: 3000,
        limit:10,
        typeahead:false
    }).
    then((data)=>{
        console.log(data);
        res.status(200).send(data);
    }).catch((err)=>{
        console.error(err);
    });
});


app.listen(PORT, ()=>{
    console.log(`SpotyExpo running on port ${PORT}`);
});