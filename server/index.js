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

/*
Given an origin and a destination; calculates the route(s) using TomTom API
*/
app.get('/api/find_route', (req, res)=>{
    console.log('Calculating route to destination... \n');
    console.log(req.query)
    const origin = JSON.parse(req.query.origin);
    const dest = JSON.parse(req.query.dest);
    const travelMode = req.query.travelMode.toLowerCase();

    const options = {
        key: process.env.TT_API_KEY,
        locations: `${origin.lon},${origin.lat}:${dest.lon},${dest.lat}`,
        travelMode: travelMode
    };

    if (req.query.avoidAreas !== undefined){
        const avoidAreas = [JSON.parse(req.query.avoidAreas)];
        options.avoidAreas = avoidAreas
    }

    tt.services
    .calculateRoute(options)
    .then((routeData)=>{
        console.log(routeData);
        console.log(routeData.toGeoJson());
        const processedRoute = {
            routes:routeData.routes,
            geoJsonData:routeData.toGeoJson()
        };
        res.status(200).send(processedRoute);
    }).catch((error)=>{
        console.error(error);
    })
});

/*
Fuzzy Search functionality
*/
app.get('/api/fuzzy_search', (req, res)=>{
    const queryText = req.query.queryText;
    const center = JSON.parse(req.query.center);
    tt.services
    .fuzzySearch({
        key :  process.env.TT_API_KEY,
        query: queryText,
        center: [center.longitude, center.latitude]
    }).then((data)=>{
        res.status(200).send(data);
    }).catch((err)=>{
        console.error(err);
    })
})


app.listen(PORT, ()=>{
    console.log(`SpotyExpo running on port ${PORT}`);
});