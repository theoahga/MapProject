<template>
    <div id="sideBarListStation" v-if="displayed">
        <div id="headSideBarStation">
            <h1>Stations</h1>
            <svg v-on:click="hideSideBar" id="closeButton" class="iconHover" data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 119.79">
                <title>Fermer la barre latéral</title>
                <path
                    d="M23.5,0H99.38a23.56,23.56,0,0,1,23.5,23.5V96.29a23.56,23.56,0,0,1-23.5,23.5H23.5a23.44,23.44,0,0,1-16.6-6.9l-.37-.4A23.43,23.43,0,0,1,0,96.29V23.5A23.56,23.56,0,0,1,23.5,0ZM41,49.35a7,7,0,0,1,9.89-9.89L61.44,50,72,39.46a7,7,0,1,1,9.89,9.9L71.33,59.9,81.87,70.43A7,7,0,0,1,72,80.33L61.44,69.79,50.9,80.33A7,7,0,0,1,41,70.43L51.55,59.89,41,49.35ZM99.38,12.52H23.5a11,11,0,0,0-11,11V96.29a10.92,10.92,0,0,0,3,7.49l.27.26a11,11,0,0,0,7.75,3.23H99.38a11,11,0,0,0,11-11V23.5a11,11,0,0,0-11-11Z" />
            </svg>
        </div>
        <div class="searchStation">
            <v-text-field v-on:input="chercherStation" label="Rechercher une station" v-model="stationName"></v-text-field>
        </div>
        <div v-if="!filter" class="contentListStation" @scroll="handleScroll">
            <div v-for="station in getStationsToPage(this.indexStation)" :key="station" @click="zoomOnStation(station)" class="itemStation" >
                <div>
                    <h1>{{ station.Name }}</h1>
                    <h3>{{ station.CodePostale }}</h3>
                </div>
                <img src="../assets/tesla.png" v-if="station.TypeBorne == 27">
                <img src="../assets/zoe.png" v-if="station.TypeBorne != 27">
                
            </div>
        </div>
        <div v-if="filter" class="contentListStation">
            <div  v-for="station in stationsFiltrer" :key="station" @click="zoomOnStation(station)" class="itemStation" >
                <div>
                    <h1>{{ station.Name }}</h1>
                    <h3>{{ station.CodePostale }}</h3>
                </div>
                <img src="../assets/tesla.png" v-if="station.TypeBorne == 27">
                <img src="../assets/zoe.png" v-if="station.TypeBorne != 27">
                
            </div>
        </div>
    </div>
</template>

<script>
import EventBus from '../logic/GlobalEmiter';
import { ref } from 'vue';
import { getStations } from '../logic/Stations';

export default {
    name: "ItineraireBar",
    data() {
        return {
          indexStation: 1,
          stations: [],
          stationsFiltrer: [],
          stationName: "",
        };
    },
    setup() {
        const displayed = ref(false);
        const filter = ref(false);
        return { displayed }
    },
    async mounted() {
        this.stations = await getStations();
        EventBus.on('openStationList', () => {
            this.displayed = true;
        }),
        EventBus.on('hideStationList', () => {
            this.displayed = false;
        })
    },

    methods: {
        hideSideBar() {
            this.displayed = false;
        },
        zoomOnStation(station){
          this.hideSideBar();
          EventBus.emit('zoomOnStation',station)
        },
        getStationsToPage(index){
          return this.stations.slice(0,index*20);
        },
        handleScroll: function(el) {
          if((el.srcElement.offsetHeight + el.srcElement.scrollTop) >= el.srcElement.scrollHeight) {
            this.indexStation++;
          }
        },
        chercherStation(){
            
            if(this.stationName.length>3){
                this.filter = true;
                this.stationsFiltrer = [];
                    for(const station of this.stations){
                    if(station.Name.toLowerCase().includes(this.stationName.toLowerCase())){
                        this.stationsFiltrer.push(station);
                    }
                }
            } else {
                this.filter = false;
            }
        }
    }
};
</script>

<style>
#sideBarListStation {
    padding-top: 1%;
    height: calc(100vh - 60px);
    min-width: 35%;
    width: 35%;
    max-width: 35%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #ffffff;
}

.itemStation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid;
    border-width: 2px;
    width: 98%;
    min-height: 100px;
    padding-left: 2%;
}

.itemStation:hover {
    background-color: rgb(205, 205, 205);
}

.itemStation h1 {
    font-size: 20px;
    overflow-x: auto;
    text-overflow: ellipsis;
    width: 100%;
}

.itemStation h3 {
    font-size: 10px;
}

.itemStation img {
    width: 100px;
}

.contentListStationt>div:first-child {
    border-top: solid;
}

.contentListStation {
    display: flex;
    flex-direction: column;
    width: 90%;
    overflow-y: scroll;
    overflow-x: hidden;
}

.contentListStation::-webkit-scrollbar {
  width: 8px;
}

.contentListStation::-webkit-scrollbar-track {
  border-radius: 8px;
  background-color: #e7e7e7;
  border: 1px solid #cacaca;
}

.contentListStation::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #16B020;
}


#headSideBarStation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 90%;
    height: 40px;
}

#headSideBarStation h1 {
    font-size: 20px;
}

.searchStation {
    display: flex;
    width: 90%;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 15px;
    margin-bottom: 15px;
}

.inputName {
    border-color: black;
    border-style: solid;
    border-radius: 5px;
    width: 70%;
}

.buttonName {
    width: 25%;
    border-radius: 5px;
    background-color: #16B020;
    border-style: none;
    height: 35px;
}

.buttonName:hover {
    background-color: black;
    color: white;
}

</style>