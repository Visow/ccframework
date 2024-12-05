import { Go } from "@ccframework/core";
import { _decorator, Node } from "cc";
import { DEV } from "cc/env";
const { ccclass, property } = _decorator;

@ccclass('Go')
export class CGo extends Go {

    @property({ type: Node, tooltip: (DEV && 'test ccclass') || undefined })
    A: Node | null = null;

}