
import { _decorator, Component, Node } from 'cc';
import { Global, EIgnoreLayer, Utils } from './global';
import { MoveControl } from './move-control';
const { ccclass, property } = _decorator;
 
@ccclass('ActionControl')
export class ActionControl extends Component {
    // [1]
    // dummy = '';

    @property(Node)
    bulletSpawn:Node = null!;

    @property(Node)
    target:Node = null!;

    moveControl:MoveControl = null!;

    start () {
        this.moveControl = this.getComponent(MoveControl) as MoveControl;
    }

    update (deltaTime: number) {
        
    }
    fire(event:Event, customEventData:any){
        //Global.prefab.newBullet(this.bulletSpawn.getWorldPosition(), this.target.getWorldPosition());
        Utils.rayTo(this.bulletSpawn.getWorldPosition(), this.target.getWorldPosition(), EIgnoreLayer.Ground).then((node:any) => {
            console.log(node.name, node.getPosition());
        });
    }

    load(event:Event, customEventData:any){
        console.log("Loading...");
        console.log(event);
        console.log(customEventData);
    }
}
