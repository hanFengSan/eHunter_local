import { Stats } from "fs";
import { FileItem } from "../bean/FileItem";

const util = require('util');
const fs = require('fs');
const path = require('path');

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

export class AlbumDirSorter {
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
        var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        fileItems.sort((a, b) => {
            return collator.compare(a.name, b.name);
        });
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
}