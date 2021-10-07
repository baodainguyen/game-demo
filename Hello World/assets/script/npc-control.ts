import { _decorator, Vec3, Node, RigidBody, Animation } from 'cc';
import { BaseControl } from './base-control';
import { DnbAnim, Global } from './global';
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
    anim:DnbAnim = new DnbAnim();
    start() {
        this.anim.setAnim(this.getComponentInChildren(Animation) as Animation);
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
            this.anim.setFire();
        }
    }
    
    update() {
        if(this.radaScript && this.radaScript.HasTarget) {
            this.node.lookAt(this.radaScript.TargetPos);
            this.goToInRange(this.radaScript.TargetPos);            
        } else {
            this.stopRigid();
        }
    }
    private stopRigid() {
        this.rigid.setLinearVelocity(Vec3.ZERO);
        this.anim.setIdle();
    }
    private goToInRange(target:Vec3) {
        let dst = Vec3.squaredDistance(this.node.worldPosition, target);
        if(dst > Global.InRgSqrDist) {
            let offset = new Vec3();
            Vec3.subtract(offset, target, this.node.worldPosition);
            offset.normalize();
            Vec3.multiplyScalar(offset, offset, Global.WalkSpeed);
            this.rigid.setLinearVelocity(offset);
            this.anim.setRun();
        } else {
            this.stopRigid();
        }
    }
}

