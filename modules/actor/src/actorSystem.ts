import { Singleton } from "@ccframework/core";
import { Actor } from "./actor";
import { SupervisorStrategy } from "./supervisor";

/**
 * Actor系统类，负责管理所有Actor实例
 */
export class ActorSystem extends Singleton {
    private actors: Map<string, Actor> = new Map();         // 存储所有Actor的映射
    private defaultSupervisor: SupervisorStrategy;          // 默认的监督策略

    constructor() {
        super();
        this.defaultSupervisor = new SupervisorStrategy();
    }


    /**
     * 注册Actor到系统
     * @param actor 要注册的Actor
     */
    public registerActor(actor: Actor): void {
        this.actors.set(actor.getId(), actor);
    }

    /**
     * 从系统中注销Actor
     * @param actorId 要注销的ActorID
     */
    public unregisterActor(actorId: string): void {
        this.actors.delete(actorId);
    }

    /**
     * 根据ID获取Actor
     * @param actorId ActorID
     */
    public getActor(actorId: string): Actor | undefined {
        return this.actors.get(actorId);
    }

    /**
     * 启动所有注册的Actor
     */
    public async startAll(): Promise<void> {
        for (const actor of this.actors.values()) {
            await actor.start();
        }
    }

    /**
     * 停止所有注册的Actor
     */
    public async stopAll(): Promise<void> {
        for (const actor of this.actors.values()) {
            await actor.stop();
        }
    }

    /**
     * 处理所有Actor的消息
     */
    public async processAll(): Promise<void> {
        for (const actor of this.actors.values()) {
            await actor.process();
        }
    }
}