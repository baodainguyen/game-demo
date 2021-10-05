import { _decorator, Node, Vec3 } from 'cc';
import { BaseRada } from './base-rada';
import { Global, Utils } from './global';
const { ccclass } = _decorator;
 
@ccclass('NpcRada')
export class NpcRada extends BaseRada {
    public target:Node = null!;
    
    update(dt:number){
        if(!this.HasTarget) {
            this.rotateInRange();
        } else {
            this.node.lookAt(this.TargetPos);
        }
        //console.log(this.TargetPos);
    }
    private rotateInRange() {
        this.roteUI();
        
        Utils.rayClosestDir(this.node.getWorldPosition(), this.VecForward, this.range).then(
            (node:any) => {
                //console.log('visible:' + node.layer, node.name);
                if(!Global.isEnvironment(node.name) && Global.isPlayer(node.layer)) {
                    this.target = node;
                }
            }
        )
    };

    public get TargetPos() {
        if(this.target && this.target.worldPosition)
            return new Vec3(this.target.worldPosition.x, 
                            this.node.worldPosition.y, 
                            this.target.worldPosition.z);

        return Vec3.ZERO;
    }
    public get HasTarget() {
        return this.target && this.target.position && this.target.worldPosition;
    }
}
