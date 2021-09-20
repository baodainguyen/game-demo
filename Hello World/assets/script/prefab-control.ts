
import { _decorator, Component, Node, Prefab, instantiate, RigidBody, Vec3 } from 'cc';
import { Global } from './global';
import { Bullet } from './bullet';
const { ccclass, property } = _decorator;

@ccclass('PrefabControl')
export class PrefabControl extends Component {
    // [1]
    // dummy = '';

    @property(Prefab)
    bullet = null!;

    __preload () {
        Global.prefab = this;
    }
    newBullet(origin:Vec3, target:Vec3) {
       const _bullet = instantiate(this.bullet);
       _bullet.setWorldPosition(origin);
       let _scrpt = _bullet.getComponent(Bullet) as Bullet;
       if(_scrpt) {
           let dir = target;
           Vec3.subtract(dir, dir, origin);
           _scrpt.setDir(dir);
       }
    }
    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
