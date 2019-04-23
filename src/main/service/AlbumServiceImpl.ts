import { AlbumService, PreviewThumbnailStyle } from '../../../core/service/AlbumService'
import { FileItem } from '../bean/FileItem';
import { ImgPageInfo } from '../../../core/bean/ImgPageInfo';
import { ThumbInfo, ThumbMode } from '../../../core/bean/ThumbInfo';

const util = require('util');
const fs = require('fs');
const path = require('path');
const ImageSize = require('image-size');

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const sizeOf = util.promisify(ImageSize);

export class AlbumServiceImpl extends AlbumService {
    private imgPageInfos: Array<ImgPageInfo> = [];
    private thumbInfos: Array<ThumbInfo> = [];
    private title: string = '';

    constructor() {
        super();
    }

    static fromJSON(o: Object): AlbumServiceImpl {
        return Object.assign(new AlbumServiceImpl(), o);
    }

    async parseFileItems(dirPath: string, fileItems: Array<FileItem>): Promise<void> {
        this.imgPageInfos = [];
        this.thumbInfos = [];
        for (let i = 0; i < fileItems.length; i++) {
            let id = fileItems[i].name;
            let index = i;
            let pageUrl = fileItems[i].path;
            let src = path.join('file:///', fileItems[i].path);
            let dimensions = await sizeOf(fileItems[i].path);
            let heightOfWidth = dimensions.height / dimensions.width;
            this.imgPageInfos.push({ id, index, pageUrl, src, heightOfWidth });
            this.thumbInfos.push({ id, src, mode: ThumbMode.IMG });
        }
        this.title = path.basename(dirPath);
    }

    async getPageCount(): Promise<number> {
        return this.imgPageInfos.length;
    }

    async getCurPageNum(): Promise<number> {
        return 0;
    }

    async getTitle(): Promise<string> {
        return this.title;
    }

    async getImgPageInfos(): Promise<Array<ImgPageInfo>> {
        return this.imgPageInfos;
    }

    async getImgPageInfo(index: number): Promise<ImgPageInfo> {
        return this.imgPageInfos[index];
    }

    async getImgSrc(index: number, mode): Promise<string> {
        return this.imgPageInfos[index].src;
    }

    async getNewImgSrc(index: number, mode): Promise<string> {
        return this.imgPageInfos[index].src;
    }
    async getThumbInfos(noCache?: boolean): Promise<Array<ThumbInfo>> {
        return this.thumbInfos;
    }

    async getThumbInfo(index: number): Promise<ThumbInfo> {
        return this.thumbInfos[index];
    }

    async getAlbumId(): Promise<string> {
        return await this.getTitle();
    }

    async getPreviewThumbnailStyle(index: number, imgPageInfo: ImgPageInfo, thumbInfo: ThumbInfo): Promise<PreviewThumbnailStyle> {
        return {
            'background-image': '',
            'background-position': '',
            'background-size': ''
        };
    }

    supportOriginImg(): boolean {
        return false;
    }
    supportImgChangeSource(): boolean {
        return false;
    }

    supportThumbView(): boolean {
        return true;
    }
}