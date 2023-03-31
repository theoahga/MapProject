import turf from 'turf';
import pointToLineDistance from "@turf/point-to-line-distance";
import length from "turf-line-distance"
import {direction} from "./Router.js";
import {chargeTime} from "./ChargeTime.js";
export const getDistance = (routingPoints) => {
    let line = turf.lineString(routingPoints);
    return length(line);
}

export const getDistancePoint = async (p1, p2) => {
    let res = await direction(p1,p2);
    let distance = res.routes[0].distance/1000;
    let time  = res.routes[0].duration/60;
    return {distance: distance, time: time};
}


export function toHoursAndMinutes(min) {
    const hours = Math.floor(min / 60);
    const minutes = Math.floor(min % 60);

    return hours+"h "+minutes+"min ";
}

export function toKmString(km){
    return Math.floor(km)+ "km";
}