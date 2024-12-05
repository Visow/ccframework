import { FileUtil } from './file';
import { logError } from './log';

// 创建模板
export function createProjectTemplate(targetPath: string, templateName: string): void {
    const templatePath = FileUtil.resolve(__dirname, '../../templates', templateName);

    try {
        // 检查目标路径是否存在
        if (FileUtil.exists(targetPath)) {
            throw new Error(`Target directory '${targetPath}' already exists.`);
        }

        // 拷贝模板
        FileUtil.copy(templatePath, targetPath);
    } catch (error) {
        logError(`Error creating project template: ${(error as Error).message}`);
        throw error;
    }
}
