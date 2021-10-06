import { _decorator, Vec3, Node, RigidBody, SkeletalAnimation } from 'cc';
import { BaseControl } from './base-control';
import { Global } from './global';
import { NpcRada } from './npc-rada';
const { ccclass } = _decorator;
 
@ccclass('NpcControl')
export default class NpcControl extends BaseControl {
    private rigid:RigidBody = null!;
    private radaScript:NpcRada = null!;
    public setTarget(target:Node) {
        if(this.radaScript) {
            this.radaScript.target = target;
        }
    }

    start() {
        if(this.rigid == null) this.rigid = this.getComponent(RigidBody) as RigidBody;
        this.line.setScale(Vec3.ZERO);
        this.radaScript = this.getComponentInChildren(NpcRada) as NpcRada;
    }

    onEnable(){
        this.schedule(this.checkTargetAndFire, 1.2);
    }

    onDisable() {
        this.unschedule(this.checkTargetAndFire);
    }

    private checkTargetAndFire() {
        if(this.radaScript && this.radaScript.HasTarget) {
            this.fireTo(this.radaScript.target);
        }
    }
    private ChangeAnim = 0;
    update() {
        if(this.radaScript && this.radaScript.HasTarget) {
            this.node.lookAt(this.radaScript.TargetPos);
            this.goToInRange(this.radaScript.TargetPos);            
        } else {
            this.stopRigid();
        }

        if(this.ChangeAnim != 0) {
            let s = this.node.getComponentInChildren(SkeletalAnimation) as SkeletalAnimation;
            if(s) {
                console.log(s)
                s.stop();
                switch(this.ChangeAnim) {
                    case 1:
                        s.defaultClip = s.clips[1];
                    break;
                    case 2:
                        s && (s.defaultClip = s.clips[2]);
                    break;
                    case 3:
                        s && (s.defaultClip = s.clips[0]);
                    break;
                }
                s.play();
            }            
            this.ChangeAnim = 0;
        }
        
    }
    private stopRigid() {
        this.rigid.setLinearVelocity(Vec3.ZERO);
    }
    private goToInRange(target:Vec3) {
        let dst = Vec3.squaredDistance(this.node.worldPosition, target);
        if(dst > Global.InRgSqrDist) {
            let offset = new Vec3();
            Vec3.subtract(offset, target, this.node.worldPosition);
            offset.normalize();
            Vec3.multiplyScalar(offset, offset, Global.WalkSpeed);
            this.rigid.setLinearVelocity(offset);
            this.ChangeAnim = 1;
        } else {
            this.stopRigid();
            if(this.radaScript && this.radaScript.HasTarget) this.ChangeAnim = 2;
        }
    }
}

