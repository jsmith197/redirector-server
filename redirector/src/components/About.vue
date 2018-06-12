<template>
  <div class="container bg-light">
    <h1 class="display-1">The game</h1>
    <hr class="my-4">
    <h3>Redirector is a multiplayer dualing game that focuses on quick reation times and out pacing your apponent, remember to never give up! you can can redirect enemy attcks by blocking them. It's still in development and needs a bunch of work.</h3>
    <hr class="my-4">
    <h1 class="display-1">How to play</h1>
    <h3>1.Login/make an account.
      <br>
      <br>
      2.Select play
      <br>
      <br>
      3.Pair with someone
    </h3>

    <h1 class="display-1">Controls</h1>
    <h3>(WASD) for movement
      <br>
      <br>
      (Left click) attack
      <br>
      <br>
      (Right click) dash
      <br>
      <br>
      (Shift) sheild
    </h3>



</div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {



    };
  },
  mounted() {
    this.clicked(false)
  },
  methods: {

  },
  props: ['user', 'clicked'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
