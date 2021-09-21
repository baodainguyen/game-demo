
import { _decorator, Component, Scene, Prefab, instantiate, director, Vec3 } from 'cc';
import { Global } from './global';
import { Bullet } from './bullet';
const { ccclass, property } = _decorator;

@ccclass('PrefabControl')
export class PrefabControl extends Component {
    
    @property(Prefab)
    bullet = null!;

    __preload () {
        Global.prefab = this;
    }
    start(){
        let scen = director.getScene();
    }
    newBullet(origin:Vec3, target:Vec3) {
        let scene = director.getScene();
       const _bNode = instantiate(this.bullet);
       scene?.addChild(_bNode);
       _bNode.setWorldPosition(origin);
       let _scrpt = _bNode.getComponent(Bullet) as Bullet;
       if(_scrpt) {
           let dir = target;
           Vec3.subtract(dir, dir, origin);
           _scrpt.setDir(dir);
       }
    } 

    // update (deltaTime: number) {
    //     // [4]
    // }
}
