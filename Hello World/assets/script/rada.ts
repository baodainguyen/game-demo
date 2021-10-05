import { _decorator, Vec3 } from 'cc';
import { BaseRada } from './base-rada';
import { Global, Utils } from './global';
const { ccclass, property } = _decorator;

@ccclass('Rada')
export class Rada extends BaseRada {

    update(dt:number){
        if(!this.existTarget) {
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
                    Global.Target = node;
                }
            }
        )
    };
    private get existTarget() {        
        //console.log(Global.Target)
        return Global.Target && Global.Target.position;
    }
    private get TargetPos() {
        if(this.existTarget)
            return new Vec3(Global.Target.position.x, this.node.position.y, Global.Target.position.z);
        return Vec3.ZERO;
    }
}

