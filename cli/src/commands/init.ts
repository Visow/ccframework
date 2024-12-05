import inquirer from 'inquirer';
import path from 'path';
import { logError, logSuccess } from '../utils/log';
import { createProjectTemplate } from "../utils/template";

export async function initCommand() {
    try {
        // 交互式询问
        const answers = await inquirer.prompt([
            { type: 'input', name: 'projectName', message: 'Project name:' },
            {
                type: 'list',
                name: 'template',
                message: 'Choose a template:',
                choices: ['basic', 'package', '2d-game', '3d-game'],
                default: 'package'
            },
        ]);

        // 创建项目
        const targetPath = path.resolve(process.cwd(), answers.projectName);
        createProjectTemplate(targetPath, answers.template);

        logSuccess(`Project '${answers.projectName}' initialized successfully!`);
    } catch (error) {
        logError('Failed to initialize project:', error as Error);
    }
}
