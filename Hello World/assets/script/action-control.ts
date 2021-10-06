import { _decorator, Node, Vec3 } from 'cc';
import { Global, Utils } from './global';
import { MoveControl } from './move-control';
import { BaseControl } from './base-control';
const { ccclass, property } = _decorator;
 
@ccclass('ActionControl')
export class ActionControl extends BaseControl {
    
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
        Global.inputControl.IsFire && this.fireOnDirect();
    }
    
    private fireOnDirect() {
        let from = this.line.getWorldPosition();
        let dir = Utils.getVec3Forward(this.line);
        Vec3.subtract(dir, dir, from);
        Utils.rayClosestDir(from, dir, Global.MaxDistance).then(
            (node:any) => {
                let dst = Global.MaxDistance;
                if(Global.isEnvironment(node.name)) {
                    this.line.setScale(new Vec3(1, 1, dst))
                } 
                else {
                    dst = Vec3.distance(node.worldPosition, this.line.worldPosition);
                    this.line.setScale(new Vec3(1, 1, dst));
                    
                    Global.prefab.showHealthUI(node, this.node);
                }
                
                this.scheduleOnce(this.resetScale, 0.045);
        });
    }
}
