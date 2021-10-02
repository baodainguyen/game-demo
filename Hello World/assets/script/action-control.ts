import { _decorator, Node, Vec3 } from 'cc';
import { Global } from './global';
import { NpcControl } from './npc-control';
import { MoveControl } from './move-control';
const { ccclass, property } = _decorator;
 
@ccclass('ActionControl')
export class ActionControl extends NpcControl {
    
    // @property(Node) line:Node = null!;

    @property(Node)
    target:Node = null!;

    moveControl:MoveControl = null!;

    private dir:Vec3 = new Vec3();
    onEnable() {
        this.dir = this.target.getWorldPosition();
        Vec3.subtract(this.dir, this.dir, this.line.worldPosition)
    }

    start () {
        this.moveControl = this.getComponent(MoveControl) as MoveControl;
        this.resetScale();
    }
    update (dt: number) {
        Global.inputControl.IsFire && this.onFire();
    }
    
    private onFire() {
        this.fireTo(this.target);
    }
    // public fireTo(target:Node) { }

    fire(event:Event, customEventData:any){     // button Fire on CanvasUI
        this.onFire();
    }
    
    load(event:Event, customEventData:any){
        console.log("Loading...");
        console.log(event);
        console.log(customEventData);
    }
}
