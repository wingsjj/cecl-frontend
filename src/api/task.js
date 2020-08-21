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
    url: `${URL}task`,
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

export function uploadTask(data) {
  return axios({
    url: `${URL}upload`,
    method: "POST",
    data: data
  });
}

export function getTaskLog(taskId) {
  return axios({
    url: `${URL}task/log/${taskId}`,
    method: "GET"
  });
}

export function deployModel(id, data) {
  return axios({
    url: `${URL}task/deploy/${id}`,
    method: "POST",
    data: data
  });
}
