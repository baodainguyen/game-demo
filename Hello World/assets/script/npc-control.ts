
import { _decorator, Node, Vec3, RigidBodyComponent } from 'cc';
import { BaseControl } from './base-control';
import { NpcRada } from './npc-rada';
const { ccclass, property } = _decorator;
 
@ccclass('NpcControl')
export default class NpcControl extends BaseControl {
    @property(NpcRada)
    npcRada:NpcRada = null!;

    start() {
        this.line.setScale(Vec3.ZERO);
    }

    onEnable(){
        this.schedule(this.fire, 0.39);
    }

    onDisable() {
        this.unschedule(this.fire);
    }

    private fire() {
        if(this.npcRada && this.npcRada.Target) {
            //this.node.lookAt(this.npcRada.TargetPos);
            this.fireTo(this.npcRada.Target);
        }
    }
    update() {
        if(this.npcRada && this.npcRada.Target) {
            this.node.lookAt(this.npcRada.TargetPos, Vec3.UP);
        }
    }
}

