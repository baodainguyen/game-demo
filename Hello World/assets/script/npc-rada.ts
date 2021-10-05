
import { _decorator, Node, Vec3 } from 'cc';
import { BaseRada } from './base-rada';
import { Global, Utils } from './global';
const { ccclass, property } = _decorator;
 
@ccclass('NpcRada')
export class NpcRada extends BaseRada {
    private target:Node = null!;
    
    update(dt:number){
        if(!this.Target) {
            this.rotateInRange();
        } else {
            this.node.lookAt(this.TargetPos);
        }
    }
    rotateInRange() {
        this.rad += Math.PI / 24;
        this.node.setRotationFromEuler(0, this.Angle, 0);
        
        Utils.rayClosestDir(this.node.getWorldPosition(), this.VecForward, this.range).then(
            (node:any) => {
                if(!Global.isEnvironment(node.name)) {
                    //console.log('visible:' + node.name);
                    this.target = node;
                }
            }
        )
    };

    protected get TargetPos() {
        if(this.Target !== undefined) 
            return new Vec3(this.Target.position.x, this.node.position.y, this.Target.position.z);

        return this.node.getPosition();
    }
    protected get Target() {
        if(this.target && this.target.position) return this.target;
        return undefined;
    }
    
}
