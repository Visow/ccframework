import { Mailbox } from "./mailBox";
import { SupervisorStrategy } from "./supervisor";
import { ActorError, ActorStatus, IMessage, MessagePriority } from "./types";

/**
 * Actor基类，定义了Actor的基本行为和生命周期
 */
export abstract class Actor {
    private mailbox: Mailbox;                            // Actor的邮箱
    private id: string;                                  // Actor的唯一标识
    private status: ActorStatus = ActorStatus.STOPPED;   // Actor的当前状态
    private supervisor?: SupervisorStrategy;             // Actor的监督策略
    private children: Set<Actor> = new Set();            // Actor的子Actor集合
    private parent?: Actor;                    // 父Actor引用

    /**
     * @param id Actor的唯一标识
     * @param supervisor 可选的监督策略
     */
    constructor(id: string, supervisor?: SupervisorStrategy) {
        this.mailbox = new Mailbox();
        this.id = id;
        this.supervisor = supervisor;
    }

    /**
     * 启动Actor
     */
    public async start(): Promise<void> {
        if (this.status !== ActorStatus.STOPPED) return;
        this.status = ActorStatus.STARTING;
        try {
            await this.onStart();
            // 启动所有子Actor
            for (const child of this.children) {
                await child.start();
            }
            this.status = ActorStatus.RUNNING;
        } catch (error) {
            this.handleError(error as Error);
        }
    }

    /**
     * 停止Actor
     */
    public async stop(): Promise<void> {
        if (this.status === ActorStatus.STOPPING) return;
        this.status = ActorStatus.STOPPING;
        try {
            // 先停止所有子Actor
            for (const child of this.children) {
                await child.stop();
            }
            await this.onStop();
            this.mailbox.clear();
            this.status = ActorStatus.STOPPED;
        } catch (error) {
            this.handleError(error as Error);
        }
    }

    /**
     * 发送消息
     * @param recipient 接收者ID
     * @param content 消息内容
     * @param priority 消息优先级
     */
    public send<T>(recipient: string, content: T, priority: MessagePriority = MessagePriority.NORMAL): void {
        const message: IMessage<T> = {
            sender: this.id,
            recipient,
            content,
            priority,
            timestamp: Date.now()
        };
        this.mailbox.send(message);
    }

    /**
     * 处理邮箱中的消息
     */
    public async process(): Promise<void> {
        if (this.status !== ActorStatus.RUNNING) return;

        while (this.mailbox.hasMessages()) {
            const message = this.mailbox.receive();
            if (message) {
                try {
                    await this.receive(message);
                } catch (error) {
                    this.handleError(error as Error);
                }
            }
        }
    }

    /**
     * 添加子Actor
     * @param child 要添加的子Actor
     */
    protected async addChild(child: Actor): Promise<void> {
        // 如果child已经有父Actor，先从原父Actor中移除
        if (child.parent) {
            child.parent.removeChild(child);
        }

        this.children.add(child);
        child.parent = this;

        // 如果当前Actor有supervisor，子Actor继承这个supervisor
        if (this.supervisor) {
            child.supervisor = this.supervisor;
        }
        if (this.status === ActorStatus.RUNNING) {
            await child.start();
        }
    }

    /**
     * 移除子Actor
     * @param child 要移除的子Actor
     */
    protected async removeChild(child: Actor): Promise<void> {
        if (this.children.has(child)) {
            if (this.status === ActorStatus.RUNNING) {
                await child.stop();
            }
            this.children.delete(child);
            child.parent = undefined;
        }
    }

    /**
     * 获取所有子Actor
     */
    public getChildren(): Actor[] {
        return Array.from(this.children);
    }

    /**
     * 获取父Actor
     */
    public getParent(): Actor | undefined {
        return this.parent;
    }

    /**
     * 处理错误
     * @param error 错误对象
     */
    private handleError(error: Error): void {
        const actorError: ActorError = {
            ...error,
            actorId: this.id,
            timestamp: Date.now()
        };

        this.status = ActorStatus.FAILED;

        if (this.supervisor) {
            this.supervisor.handleError(this, actorError);
        } else if (this.parent) {
            // 如果没有supervisor但有父Actor，将错误传递给父Actor
            this.parent.handleError(error);
        } else {
            throw actorError;
        }
    }

    /** 抽象方法：处理接收到的消息 */
    protected abstract receive(message: IMessage<any>): Promise<void>;
    /** 抽象方法：Actor启动时的处理 */
    protected abstract onStart(): Promise<void>;
    /** 抽象方法：Actor停止时的处理 */
    protected abstract onStop(): Promise<void>;

    /**
     * 获取Actor的ID
     */
    public getId(): string {
        return this.id;
    }

    /**
     * 获取Actor的当前状态
     */
    public getStatus(): ActorStatus {
        return this.status;
    }
}
