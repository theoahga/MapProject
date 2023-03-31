import { getStations} from './Stations';
import turf from 'turf';
import EventBus from '../logic/GlobalEmiter';
import {KMS_MARGE} from "./Const.js";


export const getRouting = async (debut,arrival,autonomy) => {
    let mainPoints = await getRoutingWithStations(debut, arrival, autonomy); // Get constraints points (Debut,stations,Arrival)

    let routing = await directionArray(mainPoints); // And get the routing using the constraints points array
    let routingPoints = transformCoor(routing.routes[0].geometry.coordinates);
    let debutPoint = mainPoints[0];
    let arrivalPoint = mainPoints[mainPoints.length-1];

    let stations = JSON.parse(JSON.stringify(mainPoints)); // Deep Cloning
    stations.splice(0,1);
    stations.splice(stations.length-1,1);

    EventBus.emit('drawRouting', {routingPoints: routingPoints,
        debutPoint: debutPoint,arrivalPoint: arrivalPoint ,
        stationsPoints: stations});
    EventBus.emit('displayInfoRooting',{routingPoints: routingPoints,
        debutPoint: debutPoint,arrivalPoint: arrivalPoint ,
        mainPoints: mainPoints});
}

export const findStationsAround = async(searchpoint, diam) =>{
    let res = []
    getStations().then((stations)=> {
        stations.forEach((station)=>{
            if(turf.distance(searchpoint, [station.Longitude, station.Latitude]) <= diam){
                res.push(station);
            }
        });
    })
    return res;
} 


export const direction = (point1, point2) => {
    let request ="https://api.mapbox.com/directions/v5/mapbox/driving/"+point1.Longitude+","+point1.Latitude+";"+point2.Longitude+","+point2.Latitude+"?annotations=maxspeed&overview=full&geometries=geojson&access_token=" + import.meta.env.VITE_TOKEN_MAPBOX;
    const options = { method: 'GET' };

    return fetch(request, options).then(response => response.json());
}                

export const directionArray = (pointArray) =>{
    let request = "https://api.mapbox.com/directions/v5/mapbox/driving/";
    let request_end = "?annotations=maxspeed&overview=full&geometries=geojson&access_token=" + import.meta.env.VITE_TOKEN_MAPBOX ;
    const options = { method: 'GET' };

    let bufferPoints = pointArray.map((point)=> {
        return point.Longitude+","+point.Latitude;
    });

    request += bufferPoints.join(";")+request_end;
    return fetch(request, options).then(response => response.json());
}

export const findBestStation = async(searchPoint)=>{
    let bestStation;
    let bestDistance;
    await getStations().then((stations)=> {
        stations.forEach((station)=>{
            let newDistance = turf.distance(searchPoint, [station.Longitude, station.Latitude]);
            if(newDistance < bestDistance || !bestDistance){
                bestDistance = newDistance;
                bestStation = station;
            }
        });
    });

    return bestStation;
} 

export const getRoutingWithStations = async(debut, arrival, autonomy)=>{
    let routing = await direction(debut,arrival);
    let routingPoints = routing.routes[0].geometry.coordinates;
    let distance = routing.routes[0].distance/1000;
    let finalPoints = [debut];
    if(distance > autonomy){
        let line = turf.lineString(routingPoints);
        let searchPoint = turf.along(line, autonomy-KMS_MARGE);
        let station = await findBestStation(searchPoint);

        let otherPoints = await getRoutingWithStations(station, arrival, autonomy);
        otherPoints.forEach((p)=>{
            finalPoints.push(p);
        })
    }else{
        finalPoints.push(arrival);
    }
    return finalPoints;
}

export const transformCoor = (points)=>{
    return points.map((p)=>{
        return [p[1],p[0]];
    })
}