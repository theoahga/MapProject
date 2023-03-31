<template>
    <div id="sideBar" v-if="displayed">
        <div id="headSideBar">
            <div class="stationName">
            <h1 class="titleSideBar">{{stationName}}</h1>
            </div>
            <svg  v-on:click="hideSideBar" id="closeButton" class="iconHover" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 119.79"><title>Fermer la barre latéral</title><path d="M23.5,0H99.38a23.56,23.56,0,0,1,23.5,23.5V96.29a23.56,23.56,0,0,1-23.5,23.5H23.5a23.44,23.44,0,0,1-16.6-6.9l-.37-.4A23.43,23.43,0,0,1,0,96.29V23.5A23.56,23.56,0,0,1,23.5,0ZM41,49.35a7,7,0,0,1,9.89-9.89L61.44,50,72,39.46a7,7,0,1,1,9.89,9.9L71.33,59.9,81.87,70.43A7,7,0,0,1,72,80.33L61.44,69.79,50.9,80.33A7,7,0,0,1,41,70.43L51.55,59.89,41,49.35ZM99.38,12.52H23.5a11,11,0,0,0-11,11V96.29a10.92,10.92,0,0,0,3,7.49l.27.26a11,11,0,0,0,7.75,3.23H99.38a11,11,0,0,0,11-11V23.5a11,11,0,0,0-11-11Z"/></svg>
        </div>
        <div id="content">
            <h3>#{{stationID}}</h3>
            <img id="marque" v-if="zoe" src="../assets/zoe.png">
            <img id="marque" v-if="tesla" src="../assets/tesla.png">
            <div id="listInfo">
            <div class="infoItem">
                <div class="labelSideBar">
                    <img class="iconSideBar" src="../assets/prise.png">
                    <h2>Type:</h2>
                </div>
                <h2 class="tooltip"><span id="stationType" class="InfoStation">{{ type }}</span></h2>
            </div>
            <div class="infoItem">
                <div class="labelSideBar">
                    <img class="iconSideBar" src="../assets/ville.png">
                    <h2>Ville:</h2>
                </div>
                <h2 class="tooltip"><span id="stationVille" class="InfoStation">{{ Ville }}</span></h2>
            </div>
            <div class="infoItem">
                <div class="labelSideBar">
                    <img class="iconSideBar" src="../assets/marker.png">
                <h2>Adresse:</h2>
                </div>
                <h2 class="tooltip"><span id="stationAddr" class="InfoStation">{{ Adresse }}</span></h2>
            </div>
            <div class="infoItem" v-if="codepostale">
                <div class="labelSideBar">
                    <img class="iconSideBar" src="../assets/postcode.png">
                <h2>Code Postale:</h2>
                </div>
                <h2 class="tooltip"><span id="stationAddr" class="InfoStation">{{ stationCP }}</span></h2>
            </div>
            <div class="infoItem">
                <div class="labelSideBar">
                <img class="iconSideBar" src="../assets/carte-de-credit.png">
                <h2>Prix:</h2>
                </div>
                <h2 class="tooltip"><span id="stationAddr" class="InfoStation">{{ stationPrix }}</span></h2>
            </div>
            </div>
            <button class="StartItineraire">Itinéraire</button>
        </div>
    </div>
</template>

<script>
import EventBus from '../logic/GlobalEmiter';
import { ref } from 'vue';

export default{
    name:"sideBar",
    setup() {
        const displayed = ref(false);
        const tesla = ref(false);
        const zoe = ref(false);
        const codepostale = ref(false);
        const stationName = ref("");
        const stationID = ref("");
        const stationPrix = ref("");
        const stationType = ref("");
        const stationCP = ref("");
        const type = ref("");
        const Adresse = ref("");
        const Ville = ref("");
        return {displayed,zoe, tesla,stationName, stationPrix, stationCP, codepostale, type, Adresse, Ville}
    },
    mounted(){
        EventBus.on('opensidebar', (station) =>{
            this.stationName = station.Name;
            this.displayed = true;
            this.stationID = station.ID;
            this.stationType = station.TypeBorne;
            this.stationCP = station.CodePostale;
            this.Adresse = station.Adresse;
            this.Ville = station.Ville;


            if(this.stationCP == null){
                this.codepostale = false;
            } else {
                this.codepostale = true;
            }

            if(station.Prix == null){
                this.stationPrix = "Non communiqué";
            } else {
                this.stationPrix = station.Prix;
            }

            if(station.TypeBorne == 27){
                this.tesla = true;
                this.zoe = false;
                this.type = "Tesla";
            } else {
                this.tesla =false;
                this.zoe = true;
                this.type = "Renault Zoe";
            }
        })
        EventBus.on('openItinerairebar', () => {
      if(this.displayed = true){
        this.displayed = false;
      }
    }),
    EventBus.on('openStationList', () =>{
        if(this.displayed == true){
          this.displayed = false;
        }
      })
    },
    methods: {

        hideSideBar(){
            console.log("Fermer");
            this.displayed = false;
        },
        showSideBar(){
            console.log("ouvert");
            let sideBar = document.querySelector('#sideBar');
        },
    }
}




</script>

<style>

.titleSideBar {
    overflow: hidden;
    text-overflow: ellipsis !important;;
    max-width: calc(100% - 20px);
}

.tooltip {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 50%;
    color: #16B020; 
}

.tooltip:hover::before {
  content: attr(title);
  position: absolute;
  top: -20px;
  left: 0;
  padding: 5px;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  white-space: normal;
  z-index: 1;
}

.stationName {
    width: calc(100% - 20px)
}

</style>