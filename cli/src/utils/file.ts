import { existsSync } from 'fs';
import fs from 'fs-extra';
import { rm } from 'fs/promises';
import path from 'path';

export class FileUtil {
    // 检查文件或目录是否存在
    static exists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    // 判断是否是文件
    static isFile(filePath: string): boolean {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    }

    // 判断是否是目录
    static isDirectory(filePath: string): boolean {
        return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
    }

    // 读取文件内容
    static readFile(filePath: string): string {
        return fs.readFileSync(filePath, 'utf-8');
    }

    // 写入文件内容
    static writeFile(filePath: string, content: string): void {
        fs.ensureFileSync(filePath);
        fs.writeFileSync(filePath, content, 'utf-8');
    }

    // 删除文件或目录
    static remove(filePath: string): void {
        fs.removeSync(filePath);
    }

    // 创建目录
    static createDir(dirPath: string): void {
        fs.ensureDirSync(dirPath);
    }

    // 复制文件或目录
    static copy(src: string, dest: string): void {
        fs.copySync(src, dest);
    }

    // 移动文件或目录
    static move(src: string, dest: string): void {
        fs.moveSync(src, dest);
    }

    // 读取 JSON 文件
    static readJson(filePath: string): any {
        return fs.readJsonSync(filePath);
    }

    // 写入 JSON 文件
    static writeJson(filePath: string, data: any): void {
        fs.ensureFileSync(filePath);
        fs.writeJsonSync(filePath, data, { spaces: 2 });
    }

    // 获取文件路径的绝对路径
    static resolve(...segments: string[]): string {
        return path.resolve(...segments);
    }

    // 获取文件路径的目录
    static dirname(filePath: string): string {
        return path.dirname(filePath);
    }

    // 获取文件名
    static basename(filePath: string): string {
        return path.basename(filePath);
    }

    static async cleanDir(dir: string) {
        if (existsSync(dir)) {
            await rm(dir, { recursive: true, force: true });
        }
    }
}