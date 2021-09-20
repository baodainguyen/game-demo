
import { _decorator, Component, Node } from 'cc';
import { Global } from './global';
const { ccclass, property } = _decorator;
 
@ccclass('ActionControl')
export class ActionControl extends Component {
    // [1]
    // dummy = '';

    @property(Node)
    bulletSpawn:Node = null!;

    @property(Node)
    target:Node = null!;

    start () {
        // [3]
    }

    update (deltaTime: number) {
        
    }
    fire(event:Event, customEventData:any){
        Global.prefab.newBullet(this.bulletSpawn.getWorldPosition(), this.target.getWorldPosition());
    }

    load(event:Event, customEventData:any){
        console.log("Loading...");
        console.log(event);
        console.log(customEventData);
    }
}
