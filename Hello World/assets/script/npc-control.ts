import { _decorator, Vec3 } from 'cc';
import { BaseControl } from './base-control';
import { NpcRada } from './npc-rada';
const { ccclass } = _decorator;
 
@ccclass('NpcControl')
export default class NpcControl extends BaseControl {
    
    private radaScript:NpcRada = null!;

    start() {
        this.line.setScale(Vec3.ZERO);
        this.radaScript = this.getComponentInChildren(NpcRada) as NpcRada;
    }

    onEnable(){
        this.schedule(this.fire, 1.2);
    }

    onDisable() {
        this.unschedule(this.fire);
    }

    private fire() {
        if(this.radaScript && this.radaScript.HasTarget) {
            this.fireTo(this.radaScript.target);
        }
    }
    update() {
        if(this.radaScript && this.radaScript.HasTarget) {
            this.node.lookAt(this.radaScript.TargetPos);
        }
    }
}

