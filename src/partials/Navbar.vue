<template>
  <div>
    <md-toolbar class="md-primary" id="appHeader">
      <a class="md-title" @click="login()" href="#!">
        <span>{{appName}}</span>
        <!-- <small style="color:lightblue;margin-left:4px"><i>beta</i></small> -->
      </a>
      <div class="d-flex align-items-center"style="margin-left:auto;margin-right:4px;">
        <a class="px-1 mr-3" :href="url" target="blank" style ="color: rgb(180,193,209);"><i class="far fa-question-circle"></i></a>

        <div v-if="$auth.isAuthenticated && $auth.userDB" style="margin-top:2px;">
          <md-menu md-size="small" md-align-trigger>
            <md-button class="md-icon-button" style="width=32px" md-menu-trigger>
              <!-- <md-avatar style="transform: scale(0.8);">
                <img :src="$auth.userDB.picture" alt="Avatar">
              </md-avatar> -->
              <md-icon class="far fa-user"></md-icon>
            </md-button>

            <md-menu-content>
              <md-menu-item disabled>{{$auth.userDB.name}}</md-menu-item>
              <md-menu-item v-if="$auth.userDB && $auth.userDB.permissions && $auth.userDB.permissions.admin">
                <router-link :to="{ name: 'admin' }">
                  Admin View
                </router-link>
              </md-menu-item>
              <!-- <md-menu-item>Profile</md-menu-item> -->
              <md-menu-item @click="logout()">Log out</md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>
        <a v-else class="md-title md-dense mr-2" style="margin-left:auto" @click="login()" href="#!">
          Login
        </a>
      </div>

    </md-toolbar>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  created() {
  },
  data() {
    return {
      appName: process.env.VUE_APP_NAME,
      url: process.env.VUE_APP_DOC_URL
    };
  },
  methods: {
    login() {
      if (this.$auth.isAuthenticated === false) this.$auth.loginWithRedirect();
      else this.$router.replace("/menu");
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
}
</script>

<style scoped>
#appHeader {
  position: fixed;
  width: 100%;
  background-color: rgb(52, 58, 64);
}
</style>
