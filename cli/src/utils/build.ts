import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { glob } from 'glob';
import path from 'path';
import { rollup, RollupOptions } from 'rollup';
import { PackageJson } from 'type-fest';
import { FileUtil } from './file';
import { logError, logInfo, logWarning } from "./log";


interface IModule {
    package: PackageJson;
    path: string;
}

/** 打包所有模块 */
export async function buildAllModules() {
    const modules = await searchAllModules();
    for (const module of modules) {
        await buildModule(module);
    }
}

/** 根据模块名字，打包模块 */
export async function buildByModuleName(moduleName: string) {
    const module = await searchModule(moduleName);
    if (!module) {
        logError(`Module ${moduleName} not found`);
        return;
    }
    await buildModule(module);
}

/** 打包模块 */
async function buildModule(module: IModule, bTerser: boolean = true) {
    const version = module.package.version;
    const input = path.join(module.path, 'src/index.ts');
    const output = path.join(module.path, 'lib/index.js');

    if (!FileUtil.exists(input)) {
        logWarning(`Module ${module.package.name} not found, skip build ${module.package.name}`);
        return;
    }

    // 清理目录
    await FileUtil.cleanDir(path.join(module.path, 'lib'));

    // 如果有版本号，生成版本文件
    if (version) {
        const versionTs = `export const version = "${version}";`;
        FileUtil.writeFile(path.join(module.path, 'src/version.ts'), versionTs);
    }

    logInfo(`开始构建模块 ${module.package.name}代码包`);
    // Rollup 配置
    const rollupConfig: RollupOptions = {
        input,
        external: ['cc', 'cc/env'],
        plugins: [
            typescript({
                tsconfig: path.join(module.path, 'tsconfig.json')
            }),
            bTerser ? terser() : undefined
        ]
    };
    // 构建
    const bundle = await rollup(rollupConfig);
    // 生成普通版本
    await bundle.write({
        file: output,
        format: 'esm',
        extend: true,
        exports: 'named',
        name: module.package.name,
        banner: `/** ${module.package.name} v${version} */`
    });

    if (!bTerser) return;

    // logInfo(`开始构建模块 ${module.package.name}声明文件`);
    // const dtsFile = path.join(module.path, module.package.types!);
    // const dtsOpt: RollupOptions = {
    //     input: dtsFile,

    // }
    // const dtsBundle = await rollup(dtsOpt)
    // await dtsBundle.write({
    //     file: dtsFile,
    //     banner: `/** ${module.package.name} v${version} */`,
    //     plugins: [typescript({
    //         tsconfig: path.join(module.path, 'tsconfig.json'),
    //         compilerOptions: {
    //             moduleResolution: 'NodeNext'
    //         }
    //     }), dts()]
    // });
}

/** 搜索所有模块 */
async function searchAllModules(): Promise<IModule[]> {
    const modules = await glob('**/package.json', {
        cwd: process.cwd(),
        ignore: [
            '**/node_modules/**',
            '**/test/**',
            '**/tests/**',
            '**/lib/**',
            '**/dist/**',
            './cli/**',
        ],
        dot: false
    });

    return modules.map(module => ({
        package: JSON.parse(FileUtil.readFile(module)) as PackageJson,
        path: FileUtil.dirname(module)
    }));
}

/** 根据模块名字，找模块所在的文件夹 */
async function searchModule(moduleName: string): Promise<IModule | undefined> {
    try {

        const modules = await searchAllModules();

        logInfo(`找到的 package.json 文件数量: ${modules.length}`);
        logInfo(`找到的文件路径: ${JSON.stringify(modules, null, 2)}`);

        for (const module of modules) {
            if (!module.package.name) continue;
            let name = module.package.name;
            if (name.lastIndexOf('/') != -1) {
                name = name.slice(name.lastIndexOf('/') + 1);
            }
            if (name === moduleName) {
                return module;
            }
        }
    } catch (error) {
        console.error('搜索模块时发生错误:', error);
        return undefined;
    }
}

