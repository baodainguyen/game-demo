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
    private rotateInRange() {
        this.roteUI();
        
        Utils.rayClosestDir(this.node.getWorldPosition(), this.VecForward, this.range).then(
            (node:any) => {
               // console.log('visible:' + node.name, node.layer);
                if(!Global.isEnvironment(node.name) && Global.isVisible(node.layer)) {
                    Global.Target = node;
                }
            }
        )
    };
    private get existTarget() {
        return Global.Target && Global.Target.position;
    }
    private get TargetPos() {
        if(this.existTarget)
            return new Vec3(Global.Target.position.x, this.node.position.y, Global.Target.position.z);
        return Vec3.ZERO;
    }
}

