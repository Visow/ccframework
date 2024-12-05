import inquirer from 'inquirer';
import { logError, logInfo } from '../utils/log';
import { installModule } from '../utils/modules';

export async function updatedModules() {
    try {
        const { moduleName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'moduleName',
                message: 'Enter the module name (npm package or local path):'
            }
        ]);

        logInfo(`Installing module: ${moduleName}...`);
        await installModule(moduleName);

        logInfo(`Module ${moduleName} installed successfully!`);
    } catch (error) {
        logError(`Failed to add module: `, error as Error);
    }
}
