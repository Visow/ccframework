import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass('GoComp')
export class GoComp extends Component {
    @property({ type: Node, tooltip: 'test component' })
    A: Node | null = null;
}