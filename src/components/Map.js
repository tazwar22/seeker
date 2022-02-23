import React from 'react'
import {useState, useEffect, useRef} from 'react'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import * as tt from '@tomtom-international/web-sdk-maps' //Get everything
import * as api from '@tomtom-international/web-sdk-services'
import { faHome, faCoffee, faLocationDot} from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import 'font-awesome/css/font-awesome.min.css';
import { library, icon } from '@fortawesome/fontawesome-svg-core';

library.add(faHome);
library.add(faCoffee);
library.add(faLocationDot);


const Map = () => {
    const mapElement = useRef();
    const [mapOb, setMap] = useState({});
    const [zoomLevel, setZoomLevel] = useState(18)
    const [currpos, setCurrpos] = useState({latitude:49.26609680307735, longitude:-123.24254063087011})
    const [category, setCategory] = useState('library');
  
    // Function to parse given location
    const parseLatLong = (latLongStr)=>{
      console.log(latLongStr);
      const latLong = latLongStr.split(", ");
      setCurrpos({latitude:latLong[0], longitude:latLong[1]});
    }

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
  
    useEffect(()=>{
      //Grab the API key form the .env file
      const KEY = process.env.REACT_APP_TT_API_KEY;
      // console.log(KEY);
      // console.log(currpos)
      //Construct a map
      let tomMap = tt.map({
        key: KEY,
        container: mapElement.current,
        zoom:zoomLevel,
        center: [currpos.longitude,  currpos.latitude],
        stylesVisibility: {poi:false} //Remove POI markers
      });

    //   tomMap.on('click', (ev)=>console.log(ev));
  
      setMap(tomMap);
      // console.log(mapOb);
  
      //Add a marker
      const addMarker = ()=>{
        const popupOffset = {bottom : [0, -30]};
        const popup = new tt.Popup({offset : popupOffset}).setHTML("You!");
  
        //Make an HTML element
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
  
        const marker = new tt.Marker({
          element:markerElement,
          draggable:true
        });
  
        //Specify initial position
        marker.setLngLat([currpos.longitude, currpos.latitude]);
        // console.log(tomMap);
        marker.addTo(tomMap);
  
         //Add dragging interaction
        marker.on('dragend', ()=>{
          // console.log("Finished moving");
          // console.log(marker.getLngLat());
          const newPos = marker.getLngLat();
          setZoomLevel(tomMap.getZoom())
          console.log("Current zoom level" + zoomLevel)
          setCurrpos({longitude:newPos.lng, latitude:newPos.lat});
        })
  
        marker.setPopup(popup).togglePopup();
      }
  
      //CALL the function
      addMarker();

        //Adds markers for a given set of points
        const addMulMarkers = (nearbyPois) => {
            for (let pid in nearbyPois.results){
                // console.log(nearbyPois.results[pid]);
                const point = nearbyPois.results[pid];
                //Unpack the point object to access the location
                let poiLoc, poiName;
                poiLoc = point.position
                poiName = point.poi.name
                // console.log(`Name: ${poiName}`);

                // Popup
                const popupOffset = {bottom : [0, -30]};
                const popup = new tt.Popup({offset : popupOffset}).setHTML(poiName);
                //Make an HTML element <FontAwesomeIcon icon={FaAmazon} />
                const markerElement = document.createElement('span', {className:''});
                markerElement.innerHTML = icon({ prefix: 'fa', iconName: 'location-dot'}).html;
                markerElement.className = 'marker-poi';
                // markerElement.addEventListener('click', ()=>{
                //     console.log("Position...")
                //     console.log([poiLoc.lng, poiLoc.lat]);
                // })
                
                const marker = new tt.Marker({
                    element:markerElement,
                    draggable:false
                });
        
                //Specify initial position
                marker.setLngLat([poiLoc.lng, poiLoc.lat]);
                // console.log(marker)
                marker.setPopup(popup);
                marker.addTo(tomMap);

                marker._element.addEventListener('click', ()=>{
                    // console.log("Position...")
                    // console.log([poiLoc.lng, poiLoc.lat]);
                    // console.log(`${currpos.longitude},${currpos.latitude}:${poiLoc.lng},${poiLoc.lat}`)
                    api.services.calculateRoute({
                        key: process.env.REACT_APP_TT_API_KEY,
                        locations: `${currpos.longitude},${currpos.latitude}:${poiLoc.lng},${poiLoc.lat}`,
                        travelMode: 'bus'
                      })
                      .then(function(routeData) {
                          const SECONDS = routeData.routes[0].summary.travelTimeInSeconds;
                          const travelTime = new Date(SECONDS * 1000).toISOString().substr(11, 8);
                          console.log("Travel time to " + poiName + ":" + travelTime);
                          drawRoute(routeData.toGeoJson(), tomMap)
                    });
                })
            }
        }

        //Function to get and plot nearby points
        async function getNearbyPoints(){
            let res = await api.services.nearbySearch({
                key: process.env.REACT_APP_TT_API_KEY,
                center: [currpos.longitude,  currpos.latitude],
                radius: 3000,
                limit:100
            })
            // console.log(res)
            if (res.results.length > 0) {
                addMulMarkers(res); //Add all markers to map
            }
        }

        async function getNearbyPointsByCat(){
            let res = await api.services.categorySearch({
                key: process.env.REACT_APP_TT_API_KEY,
                query:category,
                center: [currpos.longitude,  currpos.latitude],
                radius: 3000,
                limit:10,
                typeahead:false
            })
            // console.log(res)
            if (res.results.length > 0) {
                addMulMarkers(res); //Add all markers to map
            }
        }

      // console.log(mapOb)
      getNearbyPointsByCat();

      return () => tomMap.remove();
    }, [currpos, category]);
  
    if (mapOb){
      return (
        //Only return the map if it's loaded
        <div className="App">
        <div className='locSearch'>
            <h2>Search</h2>
            {/* <input type="text" id="latlong" placeholder='49.266, -123.241' 
            onChange={(e)=>{parseLatLong(e.target.value)}}>
            </input> */}
            {/* <input type="text" id="search-cat" placeholder='Burgers'></input> */}
        </div>
        <div ref={mapElement} className='tomMap'> </div>
        </div>  
      );
    }else{
      return <h1>Loading...</h1>
    }
}

export default Map