/**
 * Actor的生命周期状态枚举
 */
export enum ActorStatus {
    STARTING,   // Actor正在启动
    RUNNING,    // Actor正在运行
    STOPPING,   // Actor正在停止
    STOPPED,    // Actor已停止
    FAILED      // Actor发生错误
}

/**
 * Actor错误接口，扩展自标准Error
 */
export interface ActorError extends Error {
    actorId: string;      // 发生错误的Actor ID
    timestamp: number;    // 错误发生的时间戳
}

/**
 * 消息优先级枚举
 */
export enum MessagePriority {
    LOW = 0,        // 低优先级
    NORMAL = 1,     // 普通优先级
    HIGH = 2,       // 高优先级
    CRITICAL = 3    // 关键优先级
}

/**
 * 消息接口定义
 */
export interface IMessage<T> {
    sender: string;           // 发送者ID
    recipient: string;        // 接收者ID
    content: T;              // 消息内容
    priority: MessagePriority;// 消息优先级
    timestamp: number;        // 消息创建时间戳
} 