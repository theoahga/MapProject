<template>
  <div id="ItineraireBar" v-if="displayed">
    <div id="headSideBar">
      <h1>Itinéraire</h1>
      <svg v-on:click="hideSideBar" id="closeButton" class="iconHover" data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 119.79">
        <title>Fermer la barre latéral</title>
        <path
          d="M23.5,0H99.38a23.56,23.56,0,0,1,23.5,23.5V96.29a23.56,23.56,0,0,1-23.5,23.5H23.5a23.44,23.44,0,0,1-16.6-6.9l-.37-.4A23.43,23.43,0,0,1,0,96.29V23.5A23.56,23.56,0,0,1,23.5,0ZM41,49.35a7,7,0,0,1,9.89-9.89L61.44,50,72,39.46a7,7,0,1,1,9.89,9.9L71.33,59.9,81.87,70.43A7,7,0,0,1,72,80.33L61.44,69.79,50.9,80.33A7,7,0,0,1,41,70.43L51.55,59.89,41,49.35ZM99.38,12.52H23.5a11,11,0,0,0-11,11V96.29a10.92,10.92,0,0,0,3,7.49l.27.26a11,11,0,0,0,7.75,3.23H99.38a11,11,0,0,0,11-11V23.5a11,11,0,0,0-11-11Z" />
      </svg>
    </div>
    <div id="content">

      <div class="divInputItininéraire">
        <div class="ItineraireInput" id="StartPoint">
          <img src="../assets/location.png" class="iconItineraire">
        </div>
        <v-autocomplete
            label="Départ"
            :items=startOptionsLabels
            item-text="label"
            @update:search="searchStartPoint"
            v-model="startInputValue"
        ></v-autocomplete>
      </div>

      <div class="divInputItininéraire">
        <div class="ItineraireInput" id="EndPoint">
          <img src="../assets/marker.png" class="iconItineraire">
        </div>
        <v-autocomplete
            label="Arrivé"
            :items=endOptionsLabels
            item-text="label"
            @update:search="searchEndPoint"
            v-model="endInputValue"
        ></v-autocomplete>
      </div>
      <div class="chooseCarImage">
      <img class="imgCar" v-if="radioBtn === 'zoe'" src="../assets/zoe.png">
      <img class="imgCar" v-if="radioBtn === 'model3'" src="../assets/tesla.png">
      </div>
      <div>
        <v-radio-group
            v-model="radioBtn"
        >
          <div class="divRadioBtn">
            <v-radio
                class="radioBtn"
                label="Tesla Model 3"
                color="#16B020"
                value="model3"
            ></v-radio>
            <v-radio
                class="radioBtn"
                label="Renault Zoé"
                color="#16B020"
                value="zoe"
            ></v-radio>
          </div>
        </v-radio-group>
      </div>
      <button class="StartItineraire" @click="submit">Itinéraire</button>
    </div>
    <div id="result" v-if="infoPanelDisplay">
      <h2>Resultat</h2>
      <div class="mainResult">
        <div class="divMainPointResult ">
          <p class="green">{{totalTime}}</p>
          <img src="../assets/icons8-flèche-droite-96.png" class="chargingIcon2">
          <div class="divMainPointResult ">
            <img src="../assets/icons8-flash-activé-100.png" class="chargingIcon">
            <p> {{totalChargingTime}} </p>
          </div>
        </div>

        <p class="km">{{distance}}</p>
      </div>
      <div id="resultContent" >
        <div class="divMainPointResult">
          <img src="../assets/location.png" class="iconResult">
          <p class="mainPoint">{{startInputValue}}</p>
        </div>

        <div v-for="s in stations">
          <div class="divMainPointResult ">
            <img src="../assets/icons8-ligne-pointillée-96.png" class="outline">
            <p class="outlineLabel">{{toKmString(s.distance)}}, {{toHoursAndMinutes(s.time)}}</p>
          </div>
          <div v-if="s.Name">
            <p class="stationName">{{s.Name}}</p>
            <div class="divMainPointResult">
              <img src="../assets/icons8-flash-activé-100.png" class="chargingIcon">
              <p class="chargingTimeHours">{{toHoursAndMinutes(s.time1)}}</p>
              <img src="../assets/icons8-flèche-droite-96.png" class="chargingIcon">
              <p class="chargingTimeHours">{{toHoursAndMinutes(s.time2)}}</p>
            </div>

          </div>
        </div>

        <div class="divMainPointResult">
          <img src="../assets/marker.png"  class="iconResult">
          <p class="mainPoint">{{endInputValue}}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import '@mdi/font/css/materialdesignicons.css'
import EventBus from '../logic/GlobalEmiter';
import { ref } from 'vue';
import {getDistancePoint, toHoursAndMinutes, toKmString} from "../logic/RoutingInfosUtils.js";
import {chargeTime} from "../logic/ChargeTime.js";
import {model3Autonomy, zoeAutonomy} from "../logic/Const.js";

export default {
  name: "ItineraireBar",
  data() {
      return {
        startInputValue: null,
        endInputValue: null,

        startOptions: null,
        startOptionsLabels: [],
        endOptions: null,
        endOptionsLabels: [],

        infoPanelDisplay: false,
        debut: null,
        arrival: null,
        stations: null,
        distance: null,
        totalTime: null,
        totalChargingTime: null,

        radioBtn: 'model3'
      };
    },
  setup() {
    const displayed = ref(false);
    return { displayed }
  },
  mounted() {
    this.startInputValue = null;
    EventBus.on('openItinerairebar', () => {
      this.displayed = true;
    })

    EventBus.on('hideItinerairebar', () => {
      this.displayed = false;
    })


    //TODO :: pass by a function
    EventBus.on('displayInfoRooting', async (e)=>{
      let autonomy = this.radioBtn === 'model3' ?  model3Autonomy : zoeAutonomy;
      let totalTime = 0;
      let distance = 0;
      let totalChargingTime = 0;

      let Stations = [];
      for (let i = 0; i < e.mainPoints.length-1; i++) {
        let res = await getDistancePoint(e.mainPoints[i],e.mainPoints[i+1]);
        let station = e.mainPoints[i+1];
        distance+=res.distance;
        station.distance = res.distance;
        station.time = res.time;

        let pourcentage = (autonomy-res.distance)/autonomy*100;
        let chargingTime = await chargeTime(autonomy,pourcentage, station.Puissance?? 70, station.Name)
        station.chargingTime = chargingTime;

        totalTime += res.time;
        station.time1 = totalTime;


        if(i !== e.mainPoints.length-2){
          totalTime += chargingTime;
          totalChargingTime += chargingTime;
        }
        station.time2 = totalTime;

        Stations.push(station);
      }
      this.stations = Stations
      console.log(Stations);
      this.distance = toKmString(distance);
      this.totalTime = toHoursAndMinutes(totalTime);
      this.totalChargingTime = toHoursAndMinutes(totalChargingTime);
      this.infoPanelDisplay = true;
    })

  },
  methods: {
    toHoursAndMinutes,
    toKmString,
    /**
     * Method use by the autocomplete geocoder input (StartPoint)
     * */
    async searchStartPoint(e) {
      let query = e;
      if(query.length>3){
        await fetch( 'https://api-adresse.data.gouv.fr/search/?q='+ query +'&limit=10' )
            .then( response => response.json() )
            .then( response => {
              this.startOptions = response;
              this.startOptionsLabels = response.features.map(r=>r.properties.label);
            } );
      }
    },

    /**
     * Method use by the autocomplete geocoder input (EndPoint)
     * */
    async searchEndPoint(e) {
      let query = e;
      if(query.length>3){
        await fetch( 'https://api-adresse.data.gouv.fr/search/?q='+ query +'&limit=10' )
            .then( response => response.json() )
            .then( response => {
              this.endOptions = response;
              this.endOptionsLabels = response.features.map(r=>r.properties.label);
            } );
      }
    },

    hideSideBar() {
      this.displayed = false;
    },

    /**
     * Launch the rooting compute
     * */
    submit(){
      let debutPoint = this.startOptions.features.find(i=>i.properties.label === this.startInputValue);
      let arrivalPoint =  this.endOptions.features.find(i=>i.properties.label === this.endInputValue);
      let autonomy = this.radioBtn === 'model3' ?  model3Autonomy : zoeAutonomy;

      if(debutPoint && arrivalPoint && autonomy){
        EventBus.emit('computeRouting',{debut:debutPoint, arrival:arrivalPoint, autonomy : autonomy })
      }
    }
  }
};
</script>

<style>
#ItineraireBar {
    width: 35%;
    min-width: 35%;
    max-width: 35%;
    padding-top: 1%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #ffffff;
    overflow-y: scroll;
    height: calc(100vh - 60px);
    margin-right: 5px;
}

.autofillAddress {
  width: 80%;

}

.ItineraireInput {
  margin-top: 5%;
  margin-right: 2%;
}

#result{
  padding: 7%;
  padding-top: 2%;
  padding-bottom: 0;
  width: 100%;
}

#resultContent{
  padding-top: 1%;
  padding-bottom: 1%;
}

.green{
  color: #16B020;
  font-size: 120%;
}

.km{
  font-size: 80%;
  font-weight: bold;
}

.mainResult{
  margin-top: 1%;
}

#ItineraireBar::-webkit-scrollbar {
  width: 8px;
}

#ItineraireBar::-webkit-scrollbar-track {
  border-radius: 8px;
  background-color: #e7e7e7;
  border: 1px solid #cacaca;
}

#ItineraireBar::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #16B020;
}

.iconResult{
  width: 20px;
  height: 20px;
  margin-right: 2%;
}

.divMainPointResult{
  display: flex;
  flex-direction: row;
  align-items: center;
}

.outline{
  height: 60px;
  width: 60px;
  margin-left: 5%;
  margin-top: 2%;
  margin-bottom: 2%;
}

.outlineLabel{
  color: grey;
  font-size: 90%;
}

.mainPoint{
  color: #16B020;
  font-weight: bold;
  font-size: 110%;
}

.stationName{
  font-weight: bold;

}

.chargingIcon{
  width: 20px;
  height: 20px;
}

.chargingIcon2{
  width: 20px;
  height: 20px;
  margin-left: 2%;
}

.chargingTimeHours{
  margin-left: 1%;
  margin-right: 1%;
  color: grey;
  font-size: 80%;
}

.divRadioBtn{
  display: flex;
}

.radioBtn {
  margin-left: 6%;
}

.chooseCarImage {
  height: 150px;
  display: flex;
  justify-content: center;

}

.imgCar {
  height: 100%;
  object-fit: cover;
}
</style>