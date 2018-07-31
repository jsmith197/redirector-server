<template>
  <div>
    <canvas id="ctx"
    v-on:mousemove="updateMouse"
    v-on:contextmenu="preventMenu"></canvas>
    <img :src="'static/sprites/'+ players.player1.color +'.png'"></img>
    <img :src="'static/sprites/'+ players.player2.color +'.png'"></img>
  </div>
</template>

<script>

export default {
  name: 'Play',
  created: function () {
      window.addEventListener('keyup', this.keyboardUp)
      window.addEventListener('keydown', this.keyboardDown)
  },
  data() {
    return {
      ready: false,
      mouse: {
        x: 0,
        y: 0,
      },
      timer: 0,
      gameOver:false,
      currentPlayers: {},
      victor: "",


    };
  },
  mounted() {
    this.playingGame()
    this.init()
  },
  methods: {
    init(){
      this.currentPlayers = this.players
      this.game()
    },
    game(){
      const canvas = document.getElementById("ctx")
      canvas.width = 1280
      canvas.height = 650
      const ctx = canvas.getContext("2d")
      const self = this
      let Img = {}
      Img.player = new Image()
      this.socket.on('newPostions', function(data) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        if (self.gameOver === true) {
          self.endGame()
        }
        for (var i = 0; i < data.player.length; i++) {
          if (data.player[i].winState === false) {
            self.currentPlayers.player1.hp = data.player[0].hp
            self.currentPlayers.player2.hp = data.player[1].hp
            Img.player.src = 'static/sprites/'+ data.player[i].color + '.png'
            ctx.drawImage(Img.player, data.player[i].aniX, data.player[i].aniY, 20, 27, data.player[i].x, data.player[i].y, 60, 84)
            ctx.closePath()
            ctx.beginPath()
            ctx.strokeStyle = self.thisPlayer.color
            ctx.fillStyle = self.thisPlayer.color
            ctx.arc(self.mouse.x + 6, self.mouse.y + 6, 3, 0, Math.PI * 2, false)
            ctx.closePath()
            ctx.fill()
            ctx.beginPath()
            ctx.strokeStyle = self.thisPlayer.color
            ctx.arc(self.mouse.x + 6, self.mouse.y + 6, 10, 0, Math.PI * 2, false)
            ctx.stroke()
            ctx.closePath()
            ctx.fillStyle = "#eae0c8"
            ctx.fillRect(data.player[i].x, data.player[i].y + 100, data.player[i].sheild / 2, 10)
            ctx.fillRect(data.player[i].x, data.player[i].y + 120, data.player[i].hp / 2, 10)
            ctx.fillStyle = data.player[i].color
            ctx.fillRect(data.player[i].x, data.player[i].y + 100, (data.player[i].sheild / 2) - 1, 9)
            ctx.fillRect(data.player[i].x, data.player[i].y + 120, (data.player[i].hp / 2) - 1, 9)
          } else if (data.player[i].winState === true) {
            self.gameOver = true
          }
        }

        for (var i = 0; i < data.sheild.length; i++) {
          ctx.shadowColor = data.sheild[i].color
          ctx.shadowBlur = 10
          ctx.globalAlpha = 0.2
          ctx.beginPath()
          ctx.arc(data.sheild[i].x + 30, data.sheild[i].y + 42, 50, 0, Math.PI * 2, false)
          ctx.strokeStyle = data.sheild[i].color
          ctx.fillStyle = data.sheild[i].color
          ctx.fill()
          ctx.stroke()
          ctx.shadowBlur = 0
          ctx.globalAlpha = 1
        }
        for (var i = 0; i < data.bullet.length; i++) {
          ctx.shadowColor = data.bullet[i].color
          ctx.shadowBlur = 10
          ctx.fillStyle = "#eae0c8"
          ctx.fillRect(data.bullet[i].x, data.bullet[i].y, 10, 10)
          ctx.fillStyle = data.bullet[i].color
          ctx.fillRect(data.bullet[i].x, data.bullet[i].y, 9, 9)
          ctx.shadowBlur = 0
        }

      })

      document.onmousedown = function(event) {
        if (event.button === 0) {
          self.socket.emit('keyPress', {
            inputId: 'attack',
            state: true,
            x: event.clientX,
            y: event.clientY
          })
        }
        if (event.buttons === 2) {
          self.socket.emit('keyPress', {
            inputId: 'dash',
            state: true,
            x: event.clientX,
            y: event.clientY
          })
        }
      }

    document.onmouseup = function(event) {
      if (event.button === 0) {
        self.socket.emit('keyPress', {
          inputId: 'attack',
          state: false,
          x: event.clientX,
          y: event.clientY
        })
      }
      if (event.buttons === 2) {
        self.socket.emit('keyPress', {
          inputId: 'dash',
          state: false,
          x: event.clientX,
          y: event.clientY
        })
      }
    }

    },
    endGame(){

      this.$router.push({ name: 'GameOver', params: {currentPlayers: this.currentPlayers, gameId: this.gameId} })
    },
    updateMouse(e){
        var self = this
        this.mouse.x = e.clientX
        this.mouse.y = e.clientY
        self.socket.emit('keyPress', {
        inputId: 'mouseAngle',
        x: e.clientX,
        y: e.clientY
      })
    },
    keyboardDown(e){
      if (e.keyCode === 68)
        this.socket.emit('keyPress', {
          inputId: 'right',
          state: true
        })
      else if (e.keyCode === 83)
        this.socket.emit('keyPress', {
          inputId: 'down',
          state: true
        })
      else if (e.keyCode === 65)
        this.socket.emit('keyPress', {
          inputId: 'left',
          state: true
        })
      else if (e.keyCode === 87)
        this.socket.emit('keyPress', {
          inputId: 'up',
          state: true
        })
      else if (e.keyCode === 16)
        this.socket.emit('keyPress', {
          inputId: 'special',
          state: true,
          x: e.clientX,
          y: e.clientY
        })
    },
    keyboardUp(e){
      if (e.keyCode === 68)
        this.socket.emit('keyPress', {
          inputId: 'right',
          state: false
        })
      else if (e.keyCode === 83)
        this.socket.emit('keyPress', {
          inputId: 'down',
          state: false
        })
      else if (e.keyCode === 65)
        this.socket.emit('keyPress', {
          inputId: 'left',
          state: false
        })
      else if (e.keyCode === 87)
        this.socket.emit('keyPress', {
          inputId: 'up',
          state: false
        })
      else if (e.keyCode === 16)
        this.socket.emit('keyPress', {
          inputId: 'special',
          state: false,
          x: e.clientX,
          y: e.clientY
        })
    },
    preventMenu(e){
      e.preventDefault()
    }
  },
  props: ['user', 'playingGame', 'socket', 'players', 'gameId', 'thisPlayer'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

body{
  all: none;
}
canvas{
  position: absolute;
  border: 5px solid white;
  background-color:#404040;
  margin: 0px;
  }
  *{
    cursor: none;
  }

  body{
    margin: 0px
  }
img{
  display: none;
}
</style>
