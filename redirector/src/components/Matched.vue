<template>
  <div>
    <div class="container bg-light" v-if="!start">

    <h1>Lobby</h1>
    <h3>{{this.numOfPlayers}} / 2 Players</h3>
    <button v-if="ready" v-on:click="readyUp" class="btn btn-secondary">Join Game</button>
  </div>

    <Play v-if="start" :thisPlayer="thisPlayer" :socket="socket" :playingGame="playingGame" :players="players" :gameId="this.$route.params.gameId"></Play>
  </div>
</template>

<script>
import io from 'socket.io-client'
import Play from '@/components/Play'

export default {
  name: 'Matched',
  components: {
    Play,
  },
  data () {
    return {
      start: false,
      ready: false,
      players: {
        player1:{},
        player2:{},
      },
      numOfPlayers: 0,
      gameId: this.$route.params.gameId,
      thisPlayer:this.$route.params.player,
      socket: io('https://mighty-temple-41093.herokuapp.com/')
    }
  },
  mounted() {
    this.connectPlayers()

  },
  methods: {
    connectPlayers() {
      const self = this
      self.socket.emit('createPlayer', {
        player: this.$route.params.player,
      })

      this.socket.on('newPostions', function(data) {
        if (self.numOfPlayers === 2) {
          self.ready = true

        }
        for (var i = 0; i < data.player.length; i++) {
          // if (data.player[i].gameId === self.gameId) {
            let playerObj={}
            self.numOfPlayers = data.player.length
            playerObj.name = data.player[i].name
            playerObj.color = data.player[i].color
            playerObj.damageDelt = 0
            playerObj.damageBlocked = 0
            playerObj.healed = 0
            playerObj.time = 0
            playerObj.hp = data.player[i].hp
            if (i === 0 ) {
              self.players.player1= playerObj
            }else if (i === 1) {
              self.players.player2= playerObj
            }else if (i >= 2) {
              self.socket.disconnect()
            }
          // }
        }

      })
    this.makePlayers()
    },
    makePlayers(){

    },
    readyUp() {
      this.start = true
    }
  },
  props: ['user', 'playingGame']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
