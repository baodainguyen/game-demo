import { _decorator, Node, Vec3 } from 'cc';
import { Global } from './global';
import { NpcControl } from './npc-control';
import { MoveControl } from './move-control';
const { ccclass, property } = _decorator;
 
@ccclass('ActionControl')
export class ActionControl extends NpcControl {
    
    // @property(Node)
    // line:Node = null!;

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
    // public fireTo(target:Node) {
    //     let from = this.line.getWorldPosition();
    //     let to = target.getWorldPosition();
        
    //     Utils.rayClosest(from, to, EIgnoreLayer.Ground).then((node:any) => {
    //         let ds = node.getWorldPosition();
    //         //console.log(node.name, ds, node.layer);
    //         let dst = Global.MaxDistance;
    //         if(node.name == 'ground') {
    //             this.line.setScale(new Vec3(1, 1, dst)); 
    //         } else {
    //             dst = Vec3.distance(ds, this.node.worldPosition);
    //             this.line.setScale(new Vec3(1, 1, dst - 1.177));

    //             Global.prefab.showHealthUI(node);

    //         }
    //         let self = this;
    //         this.scheduleOnce(function(){
    //             self.resetScale();
    //         }, 0.045);
    //     });
    // }
    fire(event:Event, customEventData:any){     // button Fire on CanvasUI
        this.onFire();
    }
    
    load(event:Event, customEventData:any){
        console.log("Loading...");
        console.log(event);
        console.log(customEventData);
    }
}
