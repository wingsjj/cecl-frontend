<template>
  <v-snackbar :value="showMessage" :top="1 === 1" :color="type">
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn dark text v-bind="attrs" @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "Notification",
  created() {},
  computed: {
    type() {
      return this.$store.state.type;
    },
    showMessage() {
      return this.$store.state.showMessage;
    },
    message() {
      let { message } = this.$store.state;
      if (message.length > 25) {
        message = `${message.substring(0, 25)}..`;
      }
      return message;
    }
  },
  methods: {
    close() {
      this.$store.commit("removeAlert");
    }
  }
};
</script>

<style scoped></style>
