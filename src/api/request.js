import axio from "axios";
import { notify } from "../components/notification";

const service = axio.create({
  timeout: 20000
});

const err = error => {
  if (error.response.status === 404) {
    notify("error", "该文件或网页不存在");
  } else if (error.response.status === 503) {
    notify("error", "服务器内部错误");
  } else {
    notify("error", error.response.status + "错误");
  }
  return Promise.reject(error);
};

service.interceptors.response.use(response => response, err);
export { service as axios };
