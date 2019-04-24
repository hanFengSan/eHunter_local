<template>
  <div class="reader vue-container">
    <app></app>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import { AlbumServiceImpl } from '../../main/service/AlbumServiceImpl.ts';
import app from '../../../core/app';
import core from '../../../core';
import config from '../../config.js';
const { dialog } = require('electron').remote;

export default {
    name: 'Reader',
    data() {
        let  service = AlbumServiceImpl.fromJSON(this.$route.params.albumData);
        console.log(service);
        return {
            service: {
                album: AlbumServiceImpl.fromJSON(this.$route.params.albumData),
                eHunter: {
                    showEHunterView: () => this.$router.go(-1)
                }
            }
        };
    },

    created() {},

    provide() {
        return {
            service: this.service,
            config,
            disableLoading: true
        };
    },

    components: { app },

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
}
</style>
