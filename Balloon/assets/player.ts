
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    // [1]
    // dummy = '';

    @property(Node)
    target:Node = null!;

    start () {
        // [3]
    }

    update (deltaTime: number) {
       
    }
}

