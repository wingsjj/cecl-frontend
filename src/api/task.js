import { axios } from "./request";
import { URL } from "./baseURL";

export function getAllTasks() {
  return axios({
    url: `${URL}task`,
    method: "GET"
  });
}

export function addTask(data) {
  return axios({
    url: `${URL}add`,
    method: "POST",
    data: data
  });
}

export function stopTask(id) {
  return axios({
    url: `${URL}stop?id=${id}`,
    method: "GET"
  });
}

export function upload(data) {
  return axios({
    url: `${URL}upload`,
    method: "POST",
    data: data
  });
}
