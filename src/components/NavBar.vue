<template>
    <div id="navbar">
        <div id="linknavbar">
            <img id="logonavbar" src="../assets/icons8-electrical-96.png">
            <h1>Map Project</h1>
            <h1 v-on:click="showStationList"><a>Trouver une station</a></h1>
            <h1 v-on:click="showItineraireSidebar"><a>Calcul d'itinéraire</a></h1>
        </div>
        <div id="searchnavbar">
          <div  v-if="displayed" id="divSearchbarAutocomplete">
            <v-autocomplete
                label="Recherche"
                :items=OptionsLabels
                item-text="label"
                @update:search="searchPoint"
                v-model="inputValue"
                class="autocompleteInput"
                variant="underlined"
            ></v-autocomplete>
          </div>

        <svg v-on:click="showSearchInput" id="searchIcon" class="iconHover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1244.000000 1280.000000"
            preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" stroke="none">
                <path d="M4025 12789 c-1029 -79 -1969 -501 -2704 -1214 -985 -955 -1456
    -2292 -1285 -3650 156 -1244 849 -2360 1899 -3059 193 -129 272 -175 470 -274
    452 -227 906 -362 1445 -429 207 -25 763 -25 970 0 404 50 752 138 1115 281
    251 98 600 283 819 433 l80 54 1075 -1073 c3835 -3827 3770 -3762 3828 -3795
    189 -105 411 -75 563 77 148 148 180 359 84 553 -21 43 -462 488 -2432 2459
    -2212 2213 -2404 2408 -2392 2425 8 10 40 47 70 83 714 836 1088 1927 1031
    3011 -32 610 -165 1136 -420 1664 -169 349 -340 615 -592 920 -106 128 -395
    417 -524 524 -687 569 -1463 900 -2336 996 -174 19 -598 27 -764 14z m780
    -949 c777 -118 1453 -463 1982 -1014 516 -536 829 -1194 930 -1951 24 -186 24
    -618 0 -810 -54 -416 -158 -758 -342 -1125 -297 -593 -779 -1101 -1360 -1432
    -964 -549 -2153 -590 -3152 -108 -975 470 -1667 1364 -1873 2420 -37 192 -51
    323 -57 555 -6 258 4 423 42 651 161 971 742 1831 1588 2348 453 278 935 434
    1512 490 22 2 164 3 315 1 217 -3 304 -8 415 -25z" />
            </g>
        </svg>
        </div>
    </div>
</template>

<script>

import EventBus from '../logic/GlobalEmiter';
import { ref } from 'vue';
import {OpenStreetMapProvider} from "leaflet-geosearch";

export default {
  data(){
    return{
      OptionsLabels: [],
      Options: null,
      inputValue: null
    }
  },
  setup() {
      const displayed = ref(false);
      return {displayed};
  },
  methods: {
      /**
       * Methods use by the autocomplete geocoder input
       * */
      async searchPoint(e){
          let query = e;
          if(query.length>3){
            await fetch( 'https://api-adresse.data.gouv.fr/search/?q='+ query +'&limit=10' )
                .then( response => response.json() )
                .then( response => {
                  this.Options = response;
                  this.OptionsLabels = response.features.map(r=>r.properties.label);
                } );
          }
      },

      showItineraireSidebar: function (event) {
        EventBus.emit('openItinerairebar');


        //Hide others panels (Searchbar & stationlistSidebar)
        if(this.displayed){
          this.displayed = !this.displayed;
        }
        EventBus.emit('hideStationList')
      },

      showStationList: function (event) {
        EventBus.emit('openStationList');

        //Hide others panels (Searchbar & itineaireSidebar)
        if(this.displayed){
          this.displayed = !this.displayed;
        }
        EventBus.emit('hideItinerairebar');
      },

      showSearchInput: function () {
        if(!this.displayed){
          this.displayed = !this.displayed;

          // Hide others panels
          EventBus.emit('hideItinerairebar');
          EventBus.emit('hideStationList');
        }else{
          if(this.Options){
            let point = this.Options.features.find(i=>i.properties.label === this.inputValue);
            if(point){
              EventBus.emit('drawSearch', {Longitude:point.geometry.coordinates[0],Latitude:point.geometry.coordinates[1]})
            }
          }
        }
      },
  }
}

</script>

<style>
#navbar {
    height: 60px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: white;
}

#linknavbar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

#searchnavbar {
    display: flex;
    flex-direction: row;
    justify-content: right;
    width: 50%;
    margin-right: 20px;
}

#searchIcon {
  margin-left: 3%;
    height: 25x;
    width: 25px;
}

#navbar h1 {
    font-size: 20px;
    padding-right: 40px;
}

#navbar a:hover {
    color: #16B020;
}

#navbar a {
    cursor: pointer;
}

#logonavbar {
    height: 40px;
    width: 60px;
    padding-left: 10px;
    padding-right: 10px;
}

.autocompleteInput{
  width: 100%;
}

#divSearchbarAutocomplete{
  margin-top: 20px;
  width: 50%;
}
</style>