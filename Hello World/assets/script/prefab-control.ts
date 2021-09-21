
import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { Global } from './global';
//import { Bullet } from './bullet';
const { ccclass, property } = _decorator;

@ccclass('PrefabControl')
export class PrefabControl extends Component {
    
    @property(Prefab)
    bullet = null!;

    __preload () {
        Global.prefab = this;
    }
    
    newBullet(origin:Node, target:Vec3) {
       let from:Vec3 = origin.getPosition();        
       const _bNode = instantiate(this.bullet);
       _bNode.lookAt(target);
       _bNode.setParent(this.node.getParent());
       _bNode.setPosition(from);

       this.scheduleOnce(function() {
            _bNode.setPosition(target);
        }, 3);


    //    let _scrpt = _bNode.getComponent(Bullet) as Bullet;
    //    if(_scrpt) {
    //        let dir = target;
    //        Vec3.subtract(dir, dir, origin);
    //        _scrpt.setDir(dir);
    //    }
    } 

    // update (deltaTime: number) {
    //     // [4]
    // }
}
