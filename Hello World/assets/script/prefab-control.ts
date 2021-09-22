
import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { Global } from './global';
//import { Bullet } from './bullet';
const { ccclass, property } = _decorator;

@ccclass('PrefabControl')
export class PrefabControl extends Component {
    
    @property(Prefab)
    splash = null!;

    __preload () {
        Global.prefab = this;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
