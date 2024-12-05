import { execSync } from 'child_process';
import path from 'path';
import { FileUtil } from './file';

const modulesConfigPath = path.resolve(process.cwd(), 'ccvisow.json');

// 读取已经安装的模块
export async function getInstalledModules(): Promise<{ name: string; version: string; description: string }[]> {
    if (!FileUtil.exists(modulesConfigPath)) {
        return [];
    }
    const config = await FileUtil.readJson(modulesConfigPath);
    return config.modules || [];
}

// 安装新的模块
export async function installModule(moduleName: string): Promise<void> {
    execSync(`npm install ${moduleName}`, { stdio: 'inherit' });

    // 更新模块配置
    const modules = await getInstalledModules();
    const pkgJsonPath = path.resolve('node_modules', moduleName, 'package.json');
    const pkg = await FileUtil.readJson(pkgJsonPath);

    modules.push({
        name: pkg.name,
        version: pkg.version,
        description: pkg.description
    });

    await FileUtil.writeJson(modulesConfigPath, { modules });
}

// 卸载模块
export async function uninstallModule(moduleName: string): Promise<void> {
    execSync(`npm uninstall ${moduleName}`, { stdio: 'inherit' });

    // 更新模块配置
    const modules = await getInstalledModules();
    const updatedModules = modules.filter(mod => mod.name !== moduleName);
    await FileUtil.writeJson(modulesConfigPath, { modules: updatedModules });
}
