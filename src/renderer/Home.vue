<template>
  <div ref="home" class="home">
    <div class="content">
      <h1>{{ string.dropDir }}</h1>
      <a class="button" @click="selectAlbumDir">{{ string.openDir }}</a>
    </div>
    <div class="ehunter-tag">EHUNTER</div>
    <ul class="lang-selector">
      <li v-for="lang of langList" :key="lang.name" @click="selectLang(lang.val)">{{ lang.name }}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { ipcRenderer } from 'electron';
import { AlbumServiceImpl } from '../main/service/AlbumServiceImpl.ts';
import SettingService from './service/SettingService.ts';
import * as tags from './assets/value/tags.js';
const { dialog } = require('electron').remote;

export default {
    name: 'Home',
    data() {
        return {
            dir: '',
            langList: [
                { name: '简体中文', val: tags.LANG_CN },
                { name: 'English', val: tags.LANG_EN },
                { name: '日本語', val: tags.LANG_JP }
            ]
        };
    },

    beforeCreate() {
        SettingService.initSettings();
    },

    mounted() {
        this.initDrop();
        this.initMsgListener();
    },

    beforeDestroy() {
        this.removeDrop();
    },

    computed: {
        ...mapGetters(['string'])
    },

    methods: {
        ...mapActions(['setString']),
        selectAlbumDir() {
            let openDirectory = dialog.showOpenDialog({
                properties: ['openDirectory']
            });
            if (openDirectory) {
                let dir = openDirectory[0];
                ipcRenderer.send('SELECT_ALBUM_DIR', dir);
            }
        },

        initDrop() {
            this.$refs.home.ondragenter = this.$refs.home.ondragover = this.$refs.home.ondragleave = e => {
                e.preventDefault();
                e.stopPropagation();
            }
            this.$refs.home.addEventListener('drop', this.listenDrop, false);
        },

        removeDrop() {
            this.$refs.home.removeEventListener('drop', this.listenDrop, false);
        },

        listenDrop(e) {
            event.preventDefault();
            ipcRenderer.send('SELECT_ALBUM_DIR', event.dataTransfer.files[0].path);
        },

        initMsgListener() {
            ipcRenderer.on('ALBUM_DATA', async (event, data) => {
                this.$router.push({ name: 'CoreApp', params: { albumData: data } });
            });
            ipcRenderer.on('ERROR', (event, msg) => {
                switch (msg) {
                    case 'ERROR_NO_DIR':
                        dialog.showErrorBox(this.string.error, this.string.noDir);
                        break;
                    case 'NO_IMG':
                        dialog.showErrorBox(this.string.error, this.string.noImg);
                        break;
                    default:
                        dialog.showErrorBox('Error', msg);
                }
            });
        },

        selectLang(langCode) {
            SettingService.setLang(langCode);
        }
    }
};
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #333333;
    overflow: hidden;
    position: relative;
    height: 100vh;
    > .content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-bottom: 50px;
        color: rgba(255, 255, 255, 0.3);
        h1 {
            font-size: 24px;
            font-weight: bold;
        }
        .button {
            color: #eee;
            font-size: 14px;
            text-align: center;
            text-transform: uppercase;
            cursor: pointer;
            user-select: none;
            outline: none;
            margin: 8px;
            border-radius: 10px;
            line-height: 36px;
            background-color: hsl(122, 39, 49);
            font-size: 14px;
            min-width: 88px;
            height: 36px;
            line-height: 36px;
            border-radius: 2px;
            box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 1px 5px 0 rgba(0, 0, 0, 0.12);
            display: inline-block;
            overflow: hidden;
            position: relative;
            transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
            text-decoration: none;
            text-align: center;
            border: none;
            padding: 0 10px;
            &:hover {
                background-color: hsl(122, 39, 57);
            }
            &:active {
                background-color: hsl(122, 39, 44);
            }
        }
    }
    .ehunter-tag {
        position: absolute;
        right: 8vh;
        bottom: 8vh;
        padding: 1vh 10vh;
        background: #4caf50;
        color: white;
        font-size: 1.8vh;
        transform-origin: center;
        transform: translate(50%, 50%) rotate(-45deg);
    }

    .lang-selector {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        margin: 0;
        padding: 0;
        > li {
            display: flex;
            font-size: 12px;
            transition: all 0.2s ease;
            color: rgba(255, 255, 255, 0.3);
            padding: 10px;
            user-select: none;
            cursor: pointer;
            &:hover {
                color: rgba(255, 255, 255, 1);
            }
            &:active {
                color: rgba(255, 255, 255, 0.7);
            }
        }
    }
}
</style>
