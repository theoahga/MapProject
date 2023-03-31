<script setup>
import Map from './components/Map.vue'
import NavBar from './components/NavBar.vue';
import SideBar from './components/SideBar.vue';
import ItineraireBar from './components/ItineraireBar.vue';
import StationList from './components/StationList.vue';

</script>

<template>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400&display=swap" rel="stylesheet">
  <NavBar></NavBar>
  <div id="main">
    <Map></Map>
    <ItineraireBar></ItineraireBar>
    <SideBar></SideBar>
    <StationList></StationList>
  </div>
</template>

