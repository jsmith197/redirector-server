<template>
  <div class="container bg-light">
    <div v-if="!user" class="">
      <h1>Please make a profile if you wish to play</h1>
    </div>

    <div v-if="user" class="">
    <h1>GameSearch</h1>

    <button id="show-modal" @click="showList = true">Choose Game</button>

    <button v-if="matched" v-on:click="getProfile" type="button" name="button">Connect to Lobby</button>
    <h1 v-if="gameFound">Game Found</h1>
    <button v-if="gameFound"><router-link :to="{ name: 'Matched', params: {gameId:this.matchedId, player:this.player} }">Join Lobby</router-link></button>
  </div>
  <GameList v-if="showList" @close="showList = false" :getMatchId="getMatchId"></GameList>
  </div>
</template>

<script>
import GameList from '@/components/GameList'
export default {
  name: 'GameSearch',
  components: {
    GameList,
  },
  mounted() {
    //do something after mounting vue instance
    this.clicked(false)
  },
  data () {
    return {
      matched: false,
      showList: false,
      gameFound: false,
      matchedId: '1',
      player: {
        name: '',
        color: '',
        gameId: '',
      },
    }
  },
  methods: {
    getProfile() {
      fetch("http://localhost:3000/users/"+ this.user)
      .then(response => response.json())
      .then(result => {
        this.player.name = result.users.username
        this.player.color = result.users.color
        this.gameFound = true
      })
    },
    getMatchId(matchId) {
      this.matched = true
      this.player.gameId = matchId
      this.matchedId = matchId
    }
  },
  props: ['user', 'clicked']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  height: 100%
}

</style>
