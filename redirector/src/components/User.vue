<template>
  <div>
    <div class="top d-flex flex-row justify-content-around align-items-center">
      <h1 class="">{{$route.params.name}}</h1>
      <img class="card img-fluid float-right" :src="person.image">
    </div>
    <div class="d-flex justify-content-center">
      <p class="bio">{{this.person.bio}}</p>
      <router-link :to="{ name: 'Band', params: { band: this.person.band} }">
        <h5 class="bio">band: {{this.person.band}}</h5>
      </router-link>
    </div>
    <div class="progress">
      <div class="progress-bar bg-danger"></div>
    </div>
    <div class="d-flex justify-content-center">
      <ul>
        <div class="row">
          <li v-for="creation in creations">
            <router-link :to="{ name: 'Creation', params: {num: creation.id} }">
            <div class="card border-primary mb-4" style="max-width: 20rem;">
              <div class="card-header"><h4>{{creation.name}}</h4></div>
              <div class="card-body">
                <img class="img-fluid " :src="creation.image">
                <p>{{creation.bio}}</p>
              </div>
            </div>
          </router-link>
          </li>
        </div>
      </ul>
    </div>
    <button v-if="this.person.username === user" type="button" name="button" v-on:click="activateEdit">edit</button>

    <div v-if="edit">
    this is editable</div>
  </div>
</template>

<script>


export default {
  name: 'User',
  data() {
    return {
      person:[],
      creations:[],
      edit: false

    };
  },
  methods: {
    generatePerson() {
      fetch("http://localhost:3000/users/"+ this.user)
      .then(response => response.json())
      .then(result => {
        this.person = result.users
      })
    },
    activateEdit(){
      if (this.edit === true) {
        this.edit = false
      }else {
        this.edit = true
      }
    }
  },
  mounted() {
    this.generatePerson()

  },
  props: ['user'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top{
  margin-top: 3rem;
}

.progress {
  height: .25rem !important;
  margin: 1.25rem auto;
  border-radius: 300%;
  width: 100%;
  margin-left: 4.5;
  margin-right: 4.5;
}
.img-fluid{
   max-width: 100%;
   max-height: 30vh;
}
.bio{
  margin: 5rem
}
</style>
