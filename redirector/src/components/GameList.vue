<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header d-flex justify-content-center">
              <h3>Server List</h3>
          </div>

          <div class="modal-body d-flex justify-content-center flex-column align-items-center">
            <h4>Servers</h4>
            <table class="table table-hover">
                <tr v-for="game in games" v-on:click="selectMatch(game.gameId)" class="table-dark d-flex justify-content-around">
                  <td scope="row"><strong>{{game.name}}</strong></td>
                  <td>Players: {{game.players.player1.name}} vs {{game.players.player2.name}}</td>
                  <td>Type: {{game.type}}</td>
                  <td>Id: {{game.gameId}}</td>
                </tr>

            </table>

          </div>

          <div class="modal-footer d-flex justify-content-between">
            <slot name="footer">
              <button class="modal-default-button btn btn-light" @click="$emit('close')">
                close
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'GameList',
  props: ['getMatchId'],
  data () {
    return {
      games:[],
      sampleGame:{
        name:"Server 1",
        type:"Duel",
        players: {
          player1:{
            name:"Borra"
          },
          player2:{
            name:"Vandalf"
          },
        },
        gameId:0,
        playable: false,
      },
      sampleGame2:{
        name:"Server 2",
        type:"Duel",
        players: {
          player1:{
            name:"Borra"
          },
          player2:{
            name:"Vandalf"
          },
        },
        gameId:1,
        playable: false,
      },
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.getGames()
  },
  methods: {
    mkGame (){
      this.makingGame = true
    },
    getGames() {
      this.games = []
      // fetch("http://localhost:3000/users/servers")
      // .then(response => response.json())
      // .then(result => {
      //   for (var i = 0; i < result.creations.length; i++) {
      //     this.games.unshift(result.servers[i])
      //   }
      // })
      this.games.push(this.sampleGame)
      this.games.push(this.sampleGame2)
    },
    selectMatch(game){
      this.getMatchId(game)
      this.$emit('close')
    },
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  color: #2B3E50;
}
.line{
  height: 1px;
  background-color: black;
  width: 100%;
}
p {
  font-size: 14px;
}
.table-dark {
  background-color: #8d9dad;
  border-bottom: 1px solid #2B3E50;
  border-top: 1px solid #2B3E50;
}
td{
  background-color: rgba(0, 0, 0, 0);
  border-top: 0px solid #dee2e6;
}
.modal-mask {
  position: fixed;
  z-index: 119998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 75vw;
  margin: 0px auto;
  padding: 0rem;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 10px 10px 7px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}



.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
