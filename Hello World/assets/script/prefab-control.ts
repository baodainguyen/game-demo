
import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { Global, Utils } from './global';
import { InteractObject } from './interact-object';
const { ccclass, property } = _decorator;

@ccclass('PrefabControl')
export class PrefabControl extends Component {
    @property(Node)
    public mainCamera:Node = null!;
    
    @property(Prefab)
    healthBar = null!;

    __preload () {
        Global.prefab = this;
    }

    showHealthUI(node:Node){
        let t:InteractObject = node.getComponent(InteractObject) as InteractObject;
        if(t && t.IsDead) return;
        if(t && t.HasBar) {
            t.hitShell();
            return;
        }
        let h = instantiate(this.healthBar) as Node;
        h.setParent(node);
        
        !!t && t.assignBar(h);
    }
   
}
