<template>
  <div class="reader vue-container">
    <div id="ehunter-reader-app"></div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import { AlbumServiceImpl } from '../../main/service/AlbumServiceImpl.ts';
import core from '../../../core';
import config from '../../config.js';
const { dialog } = require('electron').remote;

export default {
    name: 'Reader',
    data() {
        return {};
    },

    async mounted() {
        if (!this.$route.params.albumData) {
            this.showReader(false);
        }
        let albumService = AlbumServiceImpl.fromJSON(this.$route.params.albumData);
        core.createAppView(
            'vue-container',
            '#ehunter-reader-app',
            core.launcher
                .setAlbumService(albumService)
                .setEHunterService({
                    showEHunterView: this.showReader.bind(this)
                })
                .disableLoading(true)
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
    background: #333333;
    position: relative;
    position: fixed;
    height: 100%;
    width: 100%;
    #ehunter-reader-app {
    }
}
</style>
