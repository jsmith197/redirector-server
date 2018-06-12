<template>
  <div class="container bg-light">
    <h1>Home</h1>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {

    }
  },
  mounted() {
    //do something after mounting vue instance
    this.clicked(false)
  },
  props: ['clicked']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
