import string from '../assets/string.js'

class StringService {
    cn = {};
    en = {};
    jp = {};

    constructor() {
        this.initString();
    }

    initString() {
        for (let key in string) {
            this.cn[key] = string[key].cn;
            this.en[key] = string[key].en;
            this.jp[key] = string[key].jp;
        }
    }
}

let instance = new StringService();
export default instance;
