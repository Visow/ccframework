import inquirer from 'inquirer';
import { logError, logInfo } from '../utils/log';
import { uninstallModule } from '../utils/modules';

export async function removeModuleCommand() {
    try {
        const { moduleName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'moduleName',
                message: 'Enter the module name to remove:'
            }
        ]);

        logInfo(`Removing module: ${moduleName}...`);
        await uninstallModule(moduleName);

        logInfo(`Module ${moduleName} removed successfully!`);
    } catch (error) {
        logError(`Failed to remove module:`, error as Error);
    }
}
