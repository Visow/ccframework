import { logError, logInfo } from '../utils/log';
import { getInstalledModules } from '../utils/modules';

export async function listModulesCommand() {
    try {
        const modules = await getInstalledModules();

        if (modules.length === 0) {
            logInfo('No modules found.');
            return;
        }

        logInfo('Installed modules:');
        modules.forEach((mod, index) => {
            console.log(`${index + 1}. ${mod.name} (v${mod.version}) - ${mod.description}`);
        });
    } catch (error) {
        logError(`Failed to list modules:`, error as Error);
    }
}
