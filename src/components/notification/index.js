import store from "../../store/index";

export function notify(messageType, message) {
  store.commit({
    type: "alert",
    messageType,
    message,
    showMessage: true
  });
  setTimeout(() => {
    store.commit("removeAlert");
  }, 1000);
}
