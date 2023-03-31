
<template>
  <div id="map" style="height:calc(100vh - 60px); width:100vw"></div>
</template>

<script>
import { getStationsClusters, openInfoStation } from '../logic/Stations.js';

import { getRouting } from '../logic/Router.js'
import {chargeIcon, redPlugIcon, redIcon} from "../logic/CustomMarker.js";
import EventBus from "../logic/GlobalEmiter.js";

export default {
  name: "map",
  async mounted() {
    /*
    * These variables allow us to store layers, points...  to be able to remove them later.
    * */

    //Marker (geocoding scope)
    let searchMarker = null;
    let stationFocusMarker = null;

    //List of marker (routing scope)
    let debutMarker = null;
    let stationMarker = [];
    let arrivalMarker = null;
    let routingLine = null;



    /*
    * Here we have all map settings
    * */

    //Set the map
    var map = L.map('map',{minZoom: 3}).setView([46.657, 1.6],6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    //Set clusters/Markers
    let markers = await getStationsClusters();
    map.addLayer(markers);



    /*
    * Events listening
    * */
    EventBus.on('computeRouting',async (e) => {
      let debut = {Longitude:e.debut.geometry.coordinates[0],Latitude:e.debut.geometry.coordinates[1]};
      let arrival = {Longitude:e.arrival.geometry.coordinates[0],Latitude:e.arrival.geometry.coordinates[1]};
      await getRouting(debut, arrival ,e.autonomy);
    })
    EventBus.on('drawRouting', (e) =>{
      displayRouting(e.routingPoints);
      displayStationRoutingPoints(e.stationsPoints);
      displayDebutArrivalPoint(e.debutPoint,e.arrivalPoint);
    })
    EventBus.on('drawSearch', (e) =>{
      displaySearch(e);
    })
    EventBus.on('zoomOnStation',(station)=>{
      displayStation(station);
    })


    /*
    * Function used for routing, geocode etc...
    * */

    function displayRouting(points){
      if(routingLine){
        map.removeLayer(routingLine);
      }
      let leafPoints = L.polyline(points, {color: 'red'});
      leafPoints.addTo(map);
      routingLine = leafPoints;

      map.fitBounds(leafPoints.getBounds());
    }

    function displaySearch(searchPoint){
      if(searchMarker){
        map.removeLayer(searchMarker);
      }
      let point = L.marker([searchPoint.Latitude, searchPoint.Longitude], {
        icon: redIcon,
      });
      map.addLayer(point);
      searchMarker = point;
      map.flyTo(point.getLatLng(), 10);
    }

    function displayStation(station){
      if(stationFocusMarker){
        map.removeLayer(stationFocusMarker);
      }
      let point = L.marker([station.Latitude, station.Longitude], {
        icon: redPlugIcon,
      })
      map.addLayer(point);
      stationFocusMarker = point;
      map.flyTo(point.getLatLng(), 11);

      EventBus.emit('opensidebar',station)
    }

    function displayStationRoutingPoints(stationsPoints) {
      if(stationMarker.length>0){
        stationMarker.forEach((station)=>{
          map.removeLayer(station);
        })
        stationMarker = [];
      }
      stationsPoints.forEach(station=>{
        let point = L.marker([station.Latitude, station.Longitude], {
          icon: chargeIcon,
          options: {
                id: station.ID
            }
        }).on('click', openInfoStation);
        map.addLayer(point);
        stationMarker.push(point);
      })
    }

    function displayDebutArrivalPoint(debutPoint, arrivalPoint) {
      let dpoint = L.marker([debutPoint.Latitude, debutPoint.Longitude], {
        icon: redIcon,
      });
      let apoint = L.marker([arrivalPoint.Latitude, arrivalPoint.Longitude], {
        icon: redIcon,
      });

      if(debutMarker){
        map.removeLayer(debutMarker);
      }
      debutMarker = dpoint;
      map.addLayer(debutMarker);

      if(arrivalMarker){
        map.removeLayer(arrivalMarker);
      }
      arrivalMarker = apoint;
      map.addLayer(arrivalMarker);
    }


  }
};

</script>