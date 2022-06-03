import React from 'react';
import axios from 'axios';
import {useState, useEffect, useRef} from 'react'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import * as tt from '@tomtom-international/web-sdk-maps' //Get everything
import { faHome, faCoffee, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import SearchBoxWrapper from './SearchBoxWrapper';
// import { Typography } from '@mui/material';
import LocationCard from './LocationCard';
import TravelModeChips from './TravelModeChips';
import * as turf from '@turf/turf';
import AvoidRegionControl from './AvoidRegionControl';

library.add(faHome);
library.add(faCoffee);
library.add(faLocationDot);

const Map = () => {

    //Grab the API key form the .env file
    const KEY = process.env.REACT_APP_TT_API_KEY;
    const mapElement = useRef();
    const [mapOb, setMap] = useState({});
    const [zoomLevel, setZoomLevel] = useState(14)
    const [currpos, setCurrpos] = useState({lat:49.276065091660456, lon:-123.1285285423275});
    const [category, setCategory] = useState('');
    const [destination, setDestination] = useState('');
    const [currentPois, setCurrentPois] = useState([]);

    const [currentTarget, setCurrentTarget] = useState();
    const [travelMode, setTravelMode] = useState('car');
    const [activeDestination, setActiveDestination] = useState();
    const [activeDestinationName, setActiveDestinationName] = useState('');

    const [avoidRegion, setAvoidRegion] = useState([]);
    const [corners, setCorners] = useState(); //SW and NE corners of avoid region

    const [canAddRegion, setCanAddRegion] = useState(false);

  
    // Source - https://github.com/kubowania/distance-matrix-routing-with-tom-tom-api/blob/main/src/App.js
    const drawRoute = (geoJson, map) => {
        if (map.getLayer('route')) {
          map.removeLayer('route')
          map.removeSource('route')
        }
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geoJson
          },
          paint: {
            'line-color': '#4a90e2',
            'line-width': 6
          }
        })
      }

    /*
    Creates a TomTom Map object
    */
    const createMap = () => {
      let tomMap = tt.map({
        key: KEY,
        container: mapElement.current,
        zoom:zoomLevel,
        center: [currpos.lon,  currpos.lat],
        stylesVisibility: {poi:false}, //Remove POI markers,
      });

      //Add a circle
      var center = [currpos.lon, currpos.lat];
      var radius = 0.5;
      var options = {steps: 20, units: 'kilometers', properties: {foo: 'bar'}};
      var circ = turf.circle(center, radius, options);
      // console.log(circ.geometry.coordinates);
      tomMap.on('load',  ()=>{drawRadius(tomMap, circ.geometry.coordinates[0])});

      // Add a vertex
      tomMap.on('click', function (event) {
        handleMapClick(event, tomMap);
      });
      return tomMap;
    };

    /*
    Adds a vertex as long as avoid region isn't already full
    REFERENCE - https://gis.stackexchange.com/questions/312548/creating-a-rectangle-using-leaflet-turf-js
    */
    const handleMapClick = (event, map) => {
      const position = event.lngLat;
      console.log(position);
      if (canAddRegion &&  avoidRegion.length < 1){
        const p1 = turf.point([position.lng, position.lat]);
        var offsetX =  0.9/2; // User input for rectangle width
        var offsetY =  0.4/2; // User input for rectable height

        var topLimit = turf.destination(
            p1, // Mouse cursor location (in latlng),
            offsetY,
            0,
            {"units": "kilometers"});

        var rightLimit = turf.destination(
            p1, // Mouse cursor location (in latlng),
            offsetX,
            90,
            {"units": "kilometers"});

        var bottomLimit = turf.destination(
            p1, // Mouse cursor location (in latlng),
            offsetY,
            180,
            {"units": "kilometers"});

        var leftLimit = turf.destination(
            p1, // Mouse cursor location (in latlng),
            offsetX,
            -90,
            {"units": "kilometers"});
        
        const mouseShape = turf.envelope(turf.featureCollection([ // Resultant rectangle
            topLimit,
            rightLimit,
            bottomLimit,
            leftLimit
        ]));
        // console.log(mouseShape.geometry.coordinates[0]);

        // Add markers
        const corners = mouseShape.geometry.coordinates[0];
        const limits = {SW:corners[4], NE:corners[2]}

        setAvoidRegion(corners);
        setCorners(limits);
        setCanAddRegion(false);
      }
    };

    // const addAvoidRegionCornerMarkers = (map)=>{
    //   avoidRegion.forEach((ele, idx) => {
    //     //Hacky solution - only add SW and NW corners
    //     if (idx % 2 == 0 ){
    //       const cornerName = `C-${idx}`
    //       const popupOffset = {bottom : [0, -30]};
    //       const popup = new tt.Popup({offset : popupOffset}).setHTML(cornerName);
    //       const markerElement = document.createElement('span', {className:''});
    //       markerElement.innerHTML = icon({ prefix: 'fa', iconName: 'location-dot'}).html;
    //       markerElement.className = 'marker-poi';
          
    //       const marker = new tt.Marker({
    //           element:markerElement,
    //           draggable:false
    //       });
  
    //       //Specify initial position
    //       marker.setLngLat(ele);
    //       // console.log(marker)
    //       marker.setPopup(popup);
    //       marker.addTo(map);
    //       }
    //     }
    //    );
    // };



    const formatName = (point) => {
      switch (point.type){
        case 'POI':
          return point.poi.name;
        case 'Address Range':
          return point.address.freeformAddress;
        default:
          return point.address.freeformAddress;
      }
    };

    const setupTargetCard = (targetObject) => {
      // console.log(targetObject);
      setCurrentTarget(targetObject);
    };

    /*
    Add a marker for the user (i.e. origin)
    */
    const addMarker = (tomMap) => {
      const popupOffset = {bottom : [0, -30]};
      const popup = new tt.Popup({offset : popupOffset}).setHTML("YOU");

      //Make an HTML element
      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      const marker = new tt.Marker({
        element:markerElement,
        draggable:true
      });

      //Specify initial position
      marker.setLngLat([currpos.lon, currpos.lat]);
      // console.log(tomMap);
      marker.addTo(tomMap);

       //Add dragging interaction
      marker.on('dragend', () => {
        console.log("*** User moved ***");
        // console.log(marker.getLngLat());
        const newPos = marker.getLngLat();
        setZoomLevel(tomMap.getZoom())
        // console.log("Current zoom level" + zoomLevel)
        setCurrpos({lon:newPos.lng, lat:newPos.lat});
      });
      marker.setPopup(popup).togglePopup();
    };

    //Adds markers for a given set of points
    const addMulMarkers = (nearbyPois, tomMap) => {
      if (nearbyPois.length == 0) {
        return;
      }
      if (nearbyPois.results.length > 0){
        // console.log(nearbyPois);
        console.log('Adding markers');
        for (let pid in nearbyPois.results){
          // console.log(nearbyPois.results[pid]);
          const point = nearbyPois.results[pid];
          // console.log(point);
          //Unpack the point object to access the location
          let poiLoc, poiName;
          poiLoc = point.position
          poiName = formatName(point);

          // Popup
          const popupOffset = {bottom : [0, -30]};
          const popup = new tt.Popup({offset : popupOffset}).setHTML(poiName);
          const markerElement = document.createElement('span', {className:''});
          markerElement.innerHTML = icon({ prefix: 'fa', iconName: 'location-dot'}).html;
          markerElement.className = 'marker-poi';
          
          const marker = new tt.Marker({
              element:markerElement,
              draggable:false
          });
  
          //Specify initial position
          marker.setLngLat([poiLoc.lng, poiLoc.lat]);
          // console.log(marker)
          marker.setPopup(popup);
          marker.addTo(tomMap);

          marker._element.addEventListener('click', async ()=>{
              console.log(point);
              const origin = {lat:currpos.lat, lon:currpos.lon};
              const dest = {lat:poiLoc.lat, lon:poiLoc.lng};
              setActiveDestination(dest);
              setActiveDestinationName(poiName);
              console.log(`Current travel mode: ${travelMode}`);
              await findAndDrawRoute(poiName, tomMap, origin, dest);
          })
        };
      };
    };

  const activateSelectionMode = () => {
    setCanAddRegion(true);
  }

  const resetAvoidRegion = () => {
    setAvoidRegion([]);
    setCorners();
  }

  const findAndDrawRoute = (poiName, tomMap, origin, dest) => {
    console.log('Drawing route...')
    console.log(origin);
    console.log(dest);
    const queryParams = {origin:origin, dest:dest,  travelMode:travelMode};
    console.log('CORNERS')
    console.log(corners);
    if (corners) {
      console.log('Avoiding area...');
      //Avoid this rectangle
      queryParams.avoidAreas = [{
        southWestCorner : {latitude: corners.SW[1], longitude:corners.SW[0]},
        northEastCorner : {latitude: corners.NE[1], longitude:corners.NE[0]}
      }];
      console.log(queryParams);
    }else {
      queryParams.avoidAreas = undefined;
    }
    axios
    .get('api/find_route', {params : queryParams})
    .then((response)=>{
      return response.data;
    })
    .then(function(routeData) {
        console.log(routeData);
        setupTargetCard({name:poiName, bestRouteSummary:routeData.routes[0].summary});
        drawRoute(routeData.geoJsonData, tomMap);
    });
    console.log('Done drawing')
  }

    //Function to get and plot nearby points
  async function getNearbyPoints(){
    console.log('Fetching data')
    const res = await axios.get('api/nearby_points', {params:{lat:currpos.lat, lon:currpos.lon}});
    console.log(res.data);
    return res.data;
  }

  /*
  This function retrieves the nearby Points of Interest
  */
  async function getNearbyPointsByCat(){
    if (category !== '') {
      console.log(`*** CATEGORY *** ${category}`)
      const res = await axios.get('api/nearby_points_by_cat',
      {params:{lat:currpos.lat,lon:currpos.lon, categ:category}});
      console.log(res.data);
      setCurrentPois(res.data);
      // return res.data;
    }
  }

  const drawRadius = (map, circlePath) => {
    map.addLayer({
      'id': 'radius',
      'type': 'fill',
      'source': {
          'type': 'geojson',
          'data': {
              'type': 'Feature',
              'geometry': {
                  'type': 'Polygon',
                  'coordinates': [circlePath]
              }
          }
      },
      'layout': {},
      'paint': {
          'fill-color': 'green',
          'fill-opacity': 0.1,
          'fill-outline-color': 'black'
          }
  });
  }

  const drawPolygon = (map) => {
        map.addLayer({
          'id': 'overlay',
          'type': 'fill',
          'source': {
              'type': 'geojson',
              'data': {
                  'type': 'Feature',
                  'geometry': {
                      'type': 'Polygon',
                      'coordinates': [avoidRegion]
                  }
              }
          },
          'layout': {},
          'paint': {
              'fill-color': '#db356c',
              'fill-opacity': 0.5,
              'fill-outline-color': 'black'
              }
      });
  };

  /*
  This function performs a fuzzy search for all types of entities (POIs, Addresses)
  */
  const searchDestination = async () =>{
    // Only make the call if user has written something
    if (destination !== ''){
      console.log(`~~~ Searching for... ~~~ ${destination}`);
      console.log(destination);
      const searchResults = await axios.get('/api/fuzzy_search', {params : {queryText:destination, center: currpos}});
      console.log(searchResults.data);
      setCurrentPois(searchResults.data);
    };
  };

    useEffect(async ()=>{
      //Construct a map
      const tomMap = createMap();

      setMap(tomMap);
      addMarker(tomMap); //user

      // searchDestination(); // DON'T DO THIS!
      addMulMarkers(currentPois, tomMap); //Add all markers to map

      // console.log('```````````````````')
      // console.log(currpos);
      // console.log(activeDestination);
      // console.log('```````````````````')
      if ((currpos !== undefined) && (activeDestination !== undefined)) {
        // console.log('DRAWING ROUTE IN USEEFFECT');
        await findAndDrawRoute(activeDestinationName, tomMap, currpos, activeDestination);
        // console.log('DONE DRAWING ROUTE IN USEEFFECT');
      }

      if (avoidRegion.length > 0) {
        // console.log('DRAWING POLYGON');
        // console.log(avoidRegion);
        tomMap.on('load',  ()=>{drawPolygon(tomMap)});
        // addAvoidRegionCornerMarkers(tomMap);
      }
      // console.log(tomMap)
      return () => tomMap.remove();
    }, [currpos, currentPois, travelMode, avoidRegion, canAddRegion]);
  
    if (mapOb){
      return (
        <div>
          <TravelModeChips modeSetter={setTravelMode}></TravelModeChips>
          <AvoidRegionControl canAdd={avoidRegion.length == 0} activateSelectionMode={activateSelectionMode} resetter={resetAvoidRegion}></AvoidRegionControl>
          {/* <SearchBoxWrapper searchType={'Destination'} setter={setDestination} actionFunction={searchDestination}/> */}
          <SearchBoxWrapper searchType={'Category'} setter={setCategory} actionFunction={getNearbyPointsByCat}/>
          <LocationCard location={currentTarget} travelMode={travelMode}></LocationCard>
          <div ref={mapElement} className='tomMap'> </div>
        </div>  
      );
    }else{
      return <h1>Loading...</h1>
    }
}

export default Map