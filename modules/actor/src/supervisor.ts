import { Actor } from "./actor";
import { ActorError } from "./types";

/**
 * Actor监督策略类，负责处理Actor的错误和重启策略
 */
export class SupervisorStrategy {
    private maxRetries: number;                           // 最大重试次数
    private withinTimeWindow: number;                     // 重试时间窗口（毫秒）
    private retryCount: Map<string, number> = new Map();  // 记录每个Actor的重试次数
    private lastErrorTime: Map<string, number> = new Map();// 记录每个Actor最后一次错误的时间

    /**
     * @param maxRetries 最大重试次数，默认为3
     * @param withinTimeWindow 重试时间窗口（毫秒），默认为60秒
     */
    constructor(maxRetries: number = 3, withinTimeWindow: number = 60000) {
        this.maxRetries = maxRetries;
        this.withinTimeWindow = withinTimeWindow;
    }

    /**
     * 处理Actor发生的错误
     * @param actor 发生错误的Actor
     * @param error 错误信息
     */
    public async handleError(actor: Actor, error: ActorError): Promise<void> {
        console.error(error);
        const actorId = actor.getId();
        const currentTime = Date.now();
        const lastError = this.lastErrorTime.get(actorId) || 0;
        const retries = this.retryCount.get(actorId) || 0;

        if (currentTime - lastError > this.withinTimeWindow) {
            // 超过时间窗口，重置重试计数
            this.retryCount.set(actorId, 1);
            await this.restart(actor);
        } else if (retries < this.maxRetries) {
            // 在时间窗口内且未超过最大重试次数
            this.retryCount.set(actorId, retries + 1);
            await this.restart(actor);
        } else {
            // 超过最大重试次数，停止Actor
            await this.stop(actor);
        }

        this.lastErrorTime.set(actorId, currentTime);
    }

    /**
     * 重启Actor
     * @param actor 要重启的Actor
     */
    private async restart(actor: Actor): Promise<void> {
        await actor.stop();
        await actor.start();
    }

    /**
     * 停止Actor
     * @param actor 要停止的Actor
     */
    private async stop(actor: Actor): Promise<void> {
        await actor.stop();
    }
} 