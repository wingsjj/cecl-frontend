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
                          v-model="submitTask.file"
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
              <v-icon small class="mr-2" @click="editItem(item)">
                remove_red_eye
              </v-icon>
              <v-icon small @click="delItem(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-main>
    <v-footer color="primary" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Notification from "./components/notification/Notification";

export default {
  components: { Notification },
  props: {
    source: String
  },
  data: () => ({
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
      union_train: 0,
      file: ""
    },
    search: ""
  }),
  methods: {
    submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      console.log(this.submitTask);
    },
    cancel() {
      this.dialog = false;
    }
  },
  created() {}
};
</script>
