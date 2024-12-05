import inquirer from "inquirer";
import { buildAllModules, buildByModuleName } from "../utils/build";
import { logError } from "../utils/log";

export async function buildModuleCommand(options: { module: string }) {
    try {

        if (options.module) {
            if (options.module == "*") {
                await buildAllModules();
            } else {
                await buildByModuleName(options.module);
            }
        } else {
            const { moduleName } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'moduleName',
                    message: 'Enter the module name'
                }
            ]);
            await buildByModuleName(moduleName);
        }
    } catch (error) {
        logError(`Failed to build module: `, error as Error);
    }
} 