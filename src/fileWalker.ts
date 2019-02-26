import * as fs from "fs-extra";
import {Stats} from "fs-extra";
import * as Path from "path";
import {ParsedPath} from "path";

type IFileNameFilter = (fileName: string) => boolean;
type IFileHandler = (file: IFileObj) => void;
type IFileConvertor<T> = (file: IFileObj) => T;

interface INest<T> {
    [ind: number]: T| INest<T>;
    push: (item: T | T[] | INest<T>) => number;
}

export interface IFileObj {
    path: string;
    parsed: ParsedPath;
    stat: Stats;
}

const basicFileNameFilter: IFileNameFilter = (fileName: string) => !fileName.match(/\..*\.swp/);

export class FileWalker {

    public static listSync(
        dirIn: string,
        filter: IFileNameFilter = basicFileNameFilter): string[] {
        const fileNames = fs
            .readdirSync(dirIn)
            .filter(filter);
        return fileNames;
    }

    public static listPathSync(
        dirIn: string,
        filter: IFileNameFilter = basicFileNameFilter): string[] {
        return this.listSync(dirIn, filter).map((f) => Path.resolve(dirIn, f));
    }

    public static listParsedPathSync(
        dirIn: string,
        filter: IFileNameFilter = basicFileNameFilter): ParsedPath[] {
        return this.listPathSync(dirIn, filter).map((f) => Path.parse(f));
    }

    public static listStatSync(
        dirIn: string,
        filter: IFileNameFilter = basicFileNameFilter): Array<{ path: string, stat: Stats }> {
        return this.listPathSync(dirIn, filter).map((f) => ({path: f, stat: fs.statSync(f)}));
    }

    public static listAllSync(
        dirIn: string,
        filter: IFileNameFilter = basicFileNameFilter): IFileObj[] {
        return this.listPathSync(dirIn, filter).map((f) => ({path: f, parsed: Path.parse(f), stat: fs.statSync(f)}));
    }

    public static forEachSync(
        dirIn: string,
        cb: IFileHandler,
        recursive: boolean = false,
        filter: IFileNameFilter = basicFileNameFilter): void {
        const listAll = this.listAllSync(dirIn, filter);
        listAll.forEach((fObj) => {
            if (fObj.stat.isFile()) {
                cb(fObj);
            } else if (recursive && fObj.stat.isDirectory()) {
                this.forEachSync(fObj.path, cb, recursive, filter);
            }
        });
    }

    public static mapSync<T>(
        dirIn: string,
        cb: IFileConvertor<T>,
        recursive: boolean = false,
        filter: IFileNameFilter = basicFileNameFilter): INest<T> {
        const listAll = this.listAllSync(dirIn, filter);
        const ret: any[] = [];
        listAll.forEach((fObj) => {
            if (fObj.stat.isFile()) {
                ret.push(cb(fObj));
            } else if (recursive && fObj.stat.isDirectory()) {
                ret.push(this.mapSync(fObj.path, cb, recursive, filter));
            }
        });
        return ret;
    }

}
