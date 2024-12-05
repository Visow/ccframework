import { IMessage } from "./types";

/**
 * Mailbox类负责管理Actor的消息队列
 */
export class Mailbox {
    /** 存储消息的队列 */
    private messages: IMessage<any>[] = [];

    /**
     * 发送消息到邮箱
     * @param message 要发送的消息
     */
    public send<T>(message: IMessage<T>): void {
        this.messages.push(message);
        // 根据消息优先级对队列进行排序
        this.messages.sort((a, b) => b.priority - a.priority);
    }

    /**
     * 获取并移除队列中的下一条消息
     * @returns 下一条消息，如果队列为空则返回undefined
     */
    public receive(): IMessage<any> | undefined {
        return this.messages.shift();
    }

    /**
     * 检查邮箱是否有待处理的消息
     * @returns 如果有消息返回true，否则返回false
     */
    public hasMessages(): boolean {
        return this.messages.length > 0;
    }

    /**
     * 清空邮箱中的所有消息
     */
    public clear(): void {
        this.messages = [];
    }
}

