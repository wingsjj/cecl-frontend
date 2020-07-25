<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>任务管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>CECL</v-toolbar-title>
    </v-app-bar>

    <div style="display: flex; flex-direction: column; align-items: center;">
      <Notification></Notification>
    </div>

    <v-main>
      <v-container>
        <v-card class="mt-2">
          <v-data-table
            :headers="headers"
            :items="tasks"
            :search="search"
            class="elevation-1"
            :footer-props="footers"
            loading-text="正在加载..."
            no-results-text="无匹配数据"
            no-data-text="暂无数据"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>当前任务</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="搜索"
                  single-line
                  hide-details
                >
                </v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="600px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on"
                      >新增任务
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="heading">任务内容</span>
                    </v-card-title>
                    <v-card-text>
                      <v-form ref="form">
                        <v-text-field
                          v-model="submitTask.name"
                          :rules="[
                            v => !!v || '名称不能为空',
                            v => v.length <= 255 || '名称必须小于255个字符'
                          ]"
                          :counter="255"
                          label="名称"
                        ></v-text-field>
                        <v-file-input
                          show-size
                          label="训练文件"
                          :rules="[v => v.size > 0 || '文件不能为空']"
                          @change="onFileChange"
                        ></v-file-input>
                        <v-switch
                          label="联合训练"
                          v-model="submitTask.union_train"
                          true-value="1"
                          false-value="0"
                        ></v-switch>
                        <v-btn class="success mr-4" @click="submit">提交</v-btn>
                        <v-btn class="error" @click="cancel">取消</v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click.stop="editItem(item)">
                remove_red_eye
              </v-icon>
              <v-icon small @click.stop="delItem(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
        <v-dialog v-model="logDialog" max-width="600px">
          <v-card>
            <v-card-title>日志记录</v-card-title>
            <v-card-text>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Id</th>
                      <th class="text-left">内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="log in logRecord" :key="log.id">
                      <td>{{ log.id }}</td>
                      <td>{{ log.content }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
    <v-footer color="primary" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Notification from "./components/notification/Notification";
import { notify } from "./components/notification";
import "./api/task";
import "./utils/utils";
import { addTask, getAllTasks, getTaskLog, uploadTask } from "./api/task";
import { timestamp_s } from "./utils/utils";
import qs from "qs";

export default {
  components: { Notification },
  props: {
    source: String
  },
  data: () => ({
    logDialog: false,
    dialog: false,
    headers: [
      { text: "ID", align: "start", value: "id" },
      { text: "名称", value: "name" },
      { text: "创建时间", value: "create_time" },
      { text: "联合训练", value: "union_train" },
      { text: "状态", value: "status" },
      { text: "操作", value: "actions", sortable: false }
    ],
    footers: {
      showCurrentPage: true,
      itemsPerPageText: "每页记录数",
      showFirstLastPage: true
    },
    drawer: null,
    tasks: [
      {
        id: 1,
        name: "test",
        create_time: 123456,
        union_train: 0,
        status: 0
      }
    ],
    submitTask: {
      name: "test",
      create_time: 123456,
      edge_nodes: "",
      union_train: 0,
      file: ""
    },
    search: "",
    logRecord: {}
  }),
  methods: {
    editItem(item) {
      getTaskLog(item.id).then(res => {
        if (res.status === 200) {
          this.logRecord = JSON.parse(res.data.msg);
        }
      });
      this.logDialog = true;
    },
    delItem(item) {
      console.log(item.id);
    },
    onFileChange(file) {
      console.log(file);
      const form = new FormData();
      form.append("train", file);
      uploadTask(form).then(res => {
        if (res.status === 200) {
          notify("success", "上传成功");
          this.submitTask.file = file.name;
        } else {
          notify("fail", res.status + "错误");
        }
      });
    },
    initTasks() {
      getAllTasks()
        .then(res => {
          if (res.status === 200) {
            this.tasks = JSON.parse(res.data.msg);
            this.tasks.map(v => {
              switch (v.status) {
                case 0:
                  v.status = "未开始";
                  break;
                case 1:
                  v.status = "正在运行";
                  break;
                case 2:
                  v.status = "已结束";
                  break;
                case 3:
                  v.status = "已完成";
                  break;
              }
              v.union_train ? (v.union_train = "是") : (v.union_train = "否");
              v.create_time = timestamp_s(v.create_time);
            });
          }
        })
        .catch();
    },
    submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.submitTask.create_time = Math.ceil(new Date() / 1000);
      addTask(qs.stringify(this.submitTask))
        .then(res => {
          if (res.status === 200) {
            notify("success", "添加任务成功");
          } else {
            notify("fail", res.status + "错误");
          }
        })
        .catch();
      setTimeout(this.initTasks, 300);
      this.dialog = false;
    },
    cancel() {
      this.dialog = false;
    }
  },
  created() {
    this.initTasks();
  }
};
</script>
