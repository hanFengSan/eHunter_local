<template>
  <div class="reader" id="reader"></div>
</template>

<script>
import { ipcRenderer } from "electron";
import { AlbumServiceImpl } from "../../main/service/AlbumServiceImpl.ts";
import core from "../../../core";
import config from "../../config.js";
const { dialog } = require("electron").remote;

export default {
  name: "Reader",
  data() {
    return {};
  },

  async mounted() {
    let albumService = AlbumServiceImpl.fromJSON(this.$route.params.albumData);
    console.log(core);
    core.createAppView(
      "read",
      "#reader",
      core.launcher
        .setAlbumService(albumService)
        .setEHunterService({
          showEHunterView: this.showReader.bind(this)
        })
        .setConfig(config)
        .instance()
    );
  },

  methods: {
    showReader(show) {
      if (!show) {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.reader {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #333333;
  overflow: hidden;
  position: relative;
  height: 100vh;
}
</style>
