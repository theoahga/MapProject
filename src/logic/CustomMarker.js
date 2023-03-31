import greenplug from '../assets/icons8-electrical-96.png'
import redplug from '../assets/icons8-electrical-96-red.png'
import charge from '../assets/pngegg.png'

/*
* Customs Icons => https://github.com/pointhi/leaflet-color-markers
* */

export const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export const greenIcon = new L.Icon({
    iconUrl: greenplug,
    iconSize: [40, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export const goldIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export const chargeIcon = new L.Icon({
    iconUrl: charge,
    iconSize: [35, 35]
});

export const redPlugIcon = new L.Icon({
    iconUrl: redplug,
    iconSize: [40, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
