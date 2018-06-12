<template>
  <div id="app" class="bg-darker">
    <span v-if="showMenu" v-on:click="clicked(false)" class="darkness"></span>
    <nav v-if="!playing" class="navbar navbar-expand-lg navbar-dark bg-light nav sticky-top">
      <span class="glass-border border"></span>
      <canvas id="canvas-glass" class="canvas-glass"></canvas>
      <a class="navbar-brand"><h1>Redirector</h1></a>
        <ul class=" d-flex flex-row navbar-nav mr-auto align-items-center">
          <li class="nav-item hover">
            <router-link class="nav-link" :to="{ name: 'Home', params: {} }"><h3>Home</h3></router-link>
          </li>
          <span class="dot"></span>
          <li class="nav-item hover">
            <router-link class="nav-link" :to="{ name: 'GameSearch', params: {} }"><h3>Play</h3></router-link>
          </li>
          <span class="dot"></span>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'About', params: {} }"><h3>About</h3></router-link>
          </li>
        </ul>
        <div class="dropdown d-flex flex-column align-items-center">
          <div v-on:click="clicked(true)" class="hover dropdown d-flex flex-row align-items-center">
              <h3 v-if="loggedIn">{{this.user}}</h3>
              <h3 v-else class="dropbtn">Account</h3>
              <span class="arrow"></span>
          </div>
        </div>
        <div class="d-flex flex-column align-items-end accountMenu">

        <div v-if="showMenu" class="dropdown-content hovering d-flex flex-column align-items-center">
            <a>
              <router-link class="nav-link" v-if="loggedIn" :to="{ name: 'User', params: {name: this.user} }"><h5>Profile Page</h5></router-link>
              <button v-on:click="logout" v-if="loggedIn" class="btn btn-secondary my-2 my-sm-0">Logout</button>
                <form class="form-inline my-2 my-lg-0" @submit.prevent="login">
                  <div class="d-flex flex-column align-items-center">
                    <input v-if="!loggedIn" class="form-control mr-sm-2" type="text" v-model="username" placeholder="Username">
                    <input v-if="!loggedIn" class="form-control mr-sm-2" type="password"  v-model="password" placeholder="Password">
                    <input v-if="!loggedIn" class="btn btn-secondary my-2 my-sm-0" type="submit" name="submit" value="Login">
                    <p v-if="passwordWrong" class="text-danger">Wrong Password</p>
                  </div>
                </form>
            </a>
            <a><router-link class="nav-link" v-if="!loggedIn" :to="{ name: 'Mkprofile', params: {} }"><h5>Make Profile</h5></router-link></a>
          </div>
        </div>


      </nav>
    <router-view :playingGame="playingGame" :user="user" :changeUser="changeUser" :clicked="clicked"></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  localstorage : {
    loggedInUser :{
      type: String,
      default: "",
    }
  },
  data () {
    return {
      passwordWrong: false,
      loggedIn: false,
      user: "",
      username: "",
      password: "",
      showMenu: false,
      playing: false,
    };
  },
  mounted() {
    this.autoLogin()
    this.initialize()
  },
  methods: {
    initialize() {
      var glassCanvas = document.getElementById('canvas-glass')
      var c = glassCanvas.getContext('2d')

        glassCanvas.width = window.innerWidth
        glassCanvas.height = 65
        c.fillStyle = 'rgba(150,150,150, .7)'
        c.fillRect(0, 0, window.innerWidth, 65)
        var gradient = c.createLinearGradient(0, 0, 20, 200)
        gradient.addColorStop(0, 'rgba(255,255,255, 0)')
        gradient.addColorStop(Math.random(), 'rgba(50,50,150,1)')
        gradient.addColorStop(1, 'rgba(255,255,255, 0)')
        c.fillStyle = gradient
        c.fillRect(0, 0, window.innerWidth, 65)
    },
    changeUser(chosenUser) {
      this.$localStorage.set('cachedUser', chosenUser)
      this.user = chosenUser
      this.loggedIn = true
    },
    login() {

      fetch("http://localhost:3000/users/"+ this.username)
      .then(response => response.json())
      .then(result => {
        if (this.password === result.users.password) {
          this.changeUser(result.users.username)
          this.passwordWrong = false
        }else {
          this.passwordWrong = true
        }
      })
    },
    autoLogin(){
      this.user = this.$localStorage.get('cachedUser', '')
      if (this.user !== '') {
        this.loggedIn = true
      }
    },
    logout(){
      this.user = ''
      this.loggedIn = false
      this.$localStorage.remove('cachedUser')
    },
    clicked(data) {
        this.showMenu = data

    },
    playingGame(){
      let self = this
      if (this.playing === true) {
        this.playing = false
      }else {
        this.playing = true
      }
    },
  },
}
</script>

<style>
.navbar-brand{
  margin-left: .5rem;
}
.accountMenu:hover ~ .arrow{
  transform: rotate(45deg);
}
.empty{
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0);
}
.darkness{
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.3);
  animation: darker .5s ;
}
@keyframes darker {
    from {background-color: rgba(0,0,0,0);}
    to {background-color: rgba(0,0,0,.3);}
}
.filler{
  background-color: transparent;
  width: 8rem;
  height: 2rem;
}
.hover {
  transition: color .5s ease-out !important;
  opacity: .9;

}
.hover:hover {
  color: white !important;
  opacity: 1;
}
.arrow{
  height: 15px;
  width: 15px;
  transform: rotate(225deg);
  margin: 0rem 1rem;
  border-top: 3px solid !important;
  border-left: 3px solid !important;
  border-radius: 20%;
  opacity: 1;
  transition: transform 1s;
}
.glass-border{
  background-color: transparent !important;
  position: absolute;
  height: 4rem;
  width: 100%;
  border-radius: 0px 0px 15px 15px;
  z-index: -1;
}
.border{
  border: 2px solid black !important;
  border-top: 0px solid transparent !important;
}
ul{
 list-style-type: none;
 }
.canvas-glass{
  background-color: transparent !important;
  border-radius: 0px 0px 15px 15px;
  position: absolute;
  height: 4rem;
  width: 100%;
  z-index: -1;

}
.nav{
  background-color: transparent !important;
  margin-bottom: 1.5rem;
}
.nav-item{
  margin: 0rem .5rem;
  opacity: 1;
}
.navbar{
  padding: 0rem;
}
.dot{
  background-color: white;
  height: 5px !important;
  width: 5px !important;
  border-radius: 50%;
  opacity: .9;
}
.dropdown:hover .arrow{
  transform: rotate(45deg);
}
.dropdown-content {
    position: absolute;
    margin-top: 2.5rem;
    margin-right: 10rem;
    background-color: #f1f1f1;
    min-width: 17rem;
    z-index: 10;
}
.dropdown-content a {
    color: black;
    padding: .7rem 1rem;
    text-decoration: none;
    display: block;
    background-color: #f1f1f1;
}
.container{
    border-radius: 15px;
}
</style>
