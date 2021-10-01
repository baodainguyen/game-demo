
import { _decorator, Component, Node } from 'cc';
import { NpcControl } from './npc-control';
import { Utils } from './global';
const { ccclass, property } = _decorator;
 
@ccclass('Test')
export class Test extends Component {
    acControl:NpcControl = null!;

    @property(Node)
    target:Node = null!;

    start () {
        this.acControl = this.getComponent(NpcControl) as NpcControl;
        Utils.lookAt(this.node, this.target.getPosition());
        
        let self = this;
        this.schedule(function(){
            if(self.target.position)
                self.acControl.fireTo(self.target);
        }, 1.5);
    }

}

