import { greenIcon } from "./CustomMarker.js";
import EventBus from './GlobalEmiter';


/**
 * Return markerClusterGroup with all stations
 * */
export const getStationsClusters = async() => {
    let stations = await getStations();
    let markers = L.markerClusterGroup();

    stations.forEach(station => {
        markers.addLayer(L.marker([station.Latitude, station.Longitude], {
            icon: greenIcon,
            options: {
                id: station.ID
            }
        }).on('click', openInfoStation));
    })
    return markers
}

export const openInfoStation = async(e) => {
        console.log(e);
        let station = await getStationById(e.target.options.options.id)
        EventBus.emit('opensidebar', station);

        // Hide others panels
        EventBus.emit('hideStationList');
        EventBus.emit('hideItinerairebar');
    }
    /**
     * Return the station's list
     * */
export const getStations = async() => {
    if (!localStorage.getItem('stations')) {
        return await fetchStations();
    }
    return JSON.parse(localStorage.getItem('stations'));
}

export const getStationById = async(id) => {
    let stations = await getStations();
    return stations.find(s => s.ID === id);
}


export const fetchStations = async() => {
    let requests = ['https://api.openchargemap.io/v3/poi?maxresults=200&countrycode=FR&connectiontypeid=27&key=' +
        import.meta.env.VITE_TOKEN_OPENCHARGEMAP,
        'https://api.openchargemap.io/v3/poi?maxresults=5000&countrycode=FR&connectiontypeid=25&key=' +
        import.meta.env.VITE_TOKEN_OPENCHARGEMAP,
        'https://api.openchargemap.io/v3/poi?maxresults=5000&countrycode=FR&connectiontypeid=1036&key=' +
        import.meta.env.VITE_TOKEN_OPENCHARGEMAP
    ];

    const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } };


    let stations = [];
    await Promise.all(requests.map(r =>
            fetch(r, options)
            .then(response => response.json())))
        .then(response => stations.push(...response));

    stations = stations.flatMap(r => r);
    stations = stations.map((result) => {
        return {
            ID: result.AddressInfo.ID,
            Name: result.AddressInfo.Title,
            Latitude: result.AddressInfo.Latitude,
            Longitude: result.AddressInfo.Longitude,
            CodePostale: result.AddressInfo.Postcode,
            Prix: result.UsageCost,
            TypeBorne: result.Connections[0].ConnectionTypeID,
            Adresse: result.AddressInfo.AddressLine1,
            Ville: result.AddressInfo.Town,
            Puissance: result.Connections[0].PowerKW
        };
    });
    localStorage.setItem('stations', JSON.stringify(stations));
    return stations;
}