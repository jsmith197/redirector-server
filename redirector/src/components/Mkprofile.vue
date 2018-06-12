<template>
  <div class="container login-menu d-flex flex-column align-items-center">
  <h1>Make an account</h1>
  <p v-if="usernameFail" class="text-danger">There's already a user with that name</p>
  <p v-if="emailFail" class="text-danger">That email is already signed up</p>
  <form @submit.prevent="mkProfile">
      <div class="d-flex flex-row">

        <div class="form-group">
          <label>Username</label>
          <input type="text" class="form-control"  v-model="person.username" placeholder="Username">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" class="form-control" v-model="person.password" placeholder="I.e. password">
        </div>
      </div>
      <div class="form-group">
        <label>Email address</label>
        <input type="email" class="form-control" v-model="person.email" aria-describedby="emailHelp" placeholder="somethingsomething@somethingoranother.com">
      </div>
      <div class="form-group">
        <label>Color</label>
        <div class="d-flex flex-row justify-content-around">
          <span v-on:click="changeColor('blue')" class="dot blue"></span>
          <span v-on:click="changeColor('green')" class="dot green"></span>
          <span v-on:click="changeColor('purple')" class="dot purple"></span>
          <span v-on:click="changeColor('red')" class="dot red"></span>
          <span v-on:click="changeColor('teal')" class="dot teal"></span>
          <span v-on:click="changeColor('yellow')" class="dot yellow"></span>
        </div>
      </div>
      <div class="form-group d-flex flex-row justify-content-around">
        <span v-if="dot" v-bind:class="dotClasses()"></span>
      </div>
      <div class="justify-content-center d-flex">
        <input type="submit" name="submit" value="Create" class="btn btn-primary">
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Mkprofile',
  data() {
    return {
      usernameFail: false,
      emailFail: false,
      color: '',
      person: {},
      dot:false,
      failure: false,
      blue: false,
      green: false,
      purple: false,
      red: false,
      teal: false,
      yellow: false,
    };
  },
  props: ['changeUser', 'clicked'],
  mounted() {
    this.load()
  },
  methods: {
    load(){
      this.clicked(false)
    },
    changeColor(color){
      this.color = color
      this.person.color = color
      this.dot = true
      this.blue =false
      this.green=false
      this.purple=false
      this.red=false
      this.teal=false
      this.yellow=false
      switch (color) {
        case "blue":
          this.blue = true
          break;
        case "green":
          this.green = true
          break;
        case "purple":
          this.purple = true
          break;
        case "red":
          this.red = true
          break;
        case "teal":
          this.teal = true
          break;
        case "yellow":
          this.yellow = true
          break;
        default:

      }
    },
    submit (newUser){
      let getBody = {
        username:newUser.username,
        email:newUser.email,
        password:newUser.password,
        color:newUser.color,
      }
      self = this
      fetch("https://blooming-spire-76156.herokuapp.com/users/")
      .then(response => response.json())
      .then(result => {
        self.usernameFail = false
        self.emailFail = false
        for (var i = 0; i < result.users.length; i++) {
          if (result.users[i].email.toLowerCase() === getBody.email.toLowerCase()) {
            self.emailFail = true
          }
          if (result.users[i].username.toLowerCase() === getBody.username.toLowerCase()) {
            self.usernameFail = true
          }
        }
          if (self.usernameFail === false && self.emailFail === false) {
            self.pushProfile(getBody)
          }
      })
    },
    pushProfile (getBody){
      fetch("https://blooming-spire-76156.herokuapp.com/users/", {
        method: "POST",
        body: JSON.stringify(getBody),
        headers: {
                "Content-Type": "application/json"
            },
      })
      .then(response => {return response.json()})

      .then(function(data){
        self.changeUser(data.users.username)
        self.sendHome()
      })
        .catch(console.error)
    },
    mkProfile () {
      const newUser = {}
      newUser.username = this.person.username
      newUser.email = this.person.email
      newUser.password =this.person.password
      newUser.color= this.person.color
      this.submit(newUser)
    },
    sendHome () {
      this.$router.push({ name: 'Home', params: {} })
    },
    dotClasses (){
      return {
        chosenColor: true,
        dot: true,
        blue: this.blue,
        green: this.green,
        purple: this.purple,
        red: this.red,
        teal: this.teal,
        yellow: this.yellow,
      }
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dot{
  height: 40px !important;
  width: 40px !important;
  border: 1px solid black !important;
}
.chosenColor{
  height: 100px!important;
  width: 100px!important;
}
.overlaydot{
  background-color: white;
  opacity: .3;
}
.blue{
  background-color: blue;
}
.green{
  background-color: green;
}
.purple{
  background-color: purple;
}
.red{
  background-color: red;
}
.teal{
  background-color: teal;
}
.yellow{
  background-color: yellow;
}
.red{
  background-color: red;
}

.login-menu{
  max-width: 500px;
}
.form-group{
  margin-right: 1rem;
}

</style>
