import chalk from "chalk";


export function logSuccess(message: string) {
    console.log(chalk.green(`[SUCCESS] ${message}`));
}

export function logError(message: string, error?: Error) {
    console.error(chalk.red(`[ERROR] ${message}, ${error?.message}`));
    if (error) console.error(error.stack);
}

export function logWarning(message: string) {
    console.warn(chalk.yellow(`[WARN] ${message}`));
}

export function logInfo(message: string) {
    console.log(chalk.white(message));
}
