import { Stats } from "fs";
import { FileItem } from "../bean/FileItem";

const util = require('util');
const fs = require('fs');
const path = require('path');

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

export class DirBrowser {
    private dirPath: string;
    private stats: Stats | undefined;

    constructor(path: string) {
        this.dirPath = path;
    }

    async sort(): Promise<Array<FileItem>> {
        this.stats = await stat(this.dirPath);
        if (this.noDir())
            throw new Error('ERROR_NO_DIR');
        let fileItems = await this.getImgsFromDir();
        if (fileItems.length === 0)
            throw new Error('NO_IMG');
        fileItems = this.sortByNum(fileItems);
        return fileItems;
    }


    private noDir(): boolean {
        return !this.stats!.isDirectory();
    }

    private async getImgsFromDir(): Promise<Array<FileItem>> {
        let files = await readdir(this.dirPath);
        let fileItems = files.filter(i => /(\.jpg|\.png)$/i.test(i)).map(i => {
            return {
                name: i,
                path: path.join(this.dirPath, i)
            }
        })
        return fileItems;
    }

    private sortByNum(fileItems: Array<FileItem>): Array<FileItem> {
        let numTailList: Array<FileItem> = [];
        let numHeadList: Array<FileItem> = [];
        let otherList: Array<FileItem> = [];
        fileItems.forEach(i => {
            if (/^.*?\d+?(\.jpg|\.png)$/i.test(i.name)) {
                numTailList.push(i);
            } else if (/^\d+?.*?(\.jpg|\.png)$/i.test(i.name)) {
                numHeadList.push(i);
            } else {
                otherList.push(i);
            }
        });
        numTailList.sort((a, b) => {
            let reg = /^.*?(\d+?)(\.jpg|\.png)$/i;
            a.name.match(reg)
            let num1 = Number(RegExp.$1);
            b.name.match(reg)
            let num2 = Number(RegExp.$1);
            return num1 - num2;
        });
        numHeadList.sort((a, b) => {
            let reg = /^(\d+?).*?(\.jpg|\.png)$/i;
            a.name.match(reg)
            let num1 = Number(RegExp.$1);
            b.name.match(reg)
            let num2 = Number(RegExp.$1);
            return num1 - num2;
        });
        return numTailList.concat(numHeadList, otherList);
    }
}