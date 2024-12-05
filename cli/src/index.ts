#!/usr/bin/env node

import { Command } from 'commander';
import { addModuleCommand } from './commands/addModules';
import { buildModuleCommand } from './commands/buildModules';
import { initCommand } from './commands/init';
import { listModulesCommand } from './commands/listModules';
import { removeModuleCommand } from './commands/removeModules';
import { updatedModules } from './commands/updateModules';

const program = new Command();

program
    .version('1.0.0')
    .description('MyFramework CLI tool');

// 注册命令：项目初始化
program
    .command('init')
    .description('Initialize a new project')
    .action(initCommand);

program
    .command('add')
    .description('Add Module to project')
    .action(addModuleCommand);

program
    .command('remove')
    .description('remove Module to project')
    .action(removeModuleCommand);

program
    .command('list')
    .description('list Modules to project')
    .action(listModulesCommand);

program
    .command('update')
    .description('update Module to project')
    .action(updatedModules);

program
    .command("build")
    .option("-m, --module <module>", "build module")
    .description("build modules")
    .action(buildModuleCommand);

// 解析命令行参数
program.parse(process.argv);

