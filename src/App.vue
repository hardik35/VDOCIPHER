<template>
  <div id="app">
    <userStatisticsGraph/>
  </div>
</template>

<script>
import userStatisticsGraph from "./components/userStatisticsGraph";
export default {
  name: "App",
  components: {
    userStatisticsGraph
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
