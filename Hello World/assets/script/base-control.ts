
import { _decorator, Component, Node, Vec3 } from 'cc';
import { EIgnoreLayer, Global, Utils } from './global';
const { ccclass, property } = _decorator;

@ccclass('BaseControl')
export class BaseControl extends Component {
    
    @property(Node)
    line:Node = null!;
    
    public fireTo(target:Node) {
        let from = this.line.getWorldPosition();
        let to = target.getWorldPosition();
        
        Utils.rayClosest(from, to, EIgnoreLayer.Ground).then((node:any) => {
            let ds = node.getWorldPosition();
            //console.log(node.name, ds, node.layer);
            let dst = Global.MaxDistance;
            if (Global.isEnvironment(node.name)) {
                this.line.setScale(new Vec3(1, 1, dst)); 
            } else {
                dst = Vec3.distance(ds, this.node.worldPosition);
                this.line.setScale(new Vec3(1, 1, dst - 1.177));

                Global.prefab.showHealthUI(node);

            }
            let self = this;
            this.scheduleOnce(function(){
                self.resetScale();
            }, 0.045);
        });
    }
    protected resetScale(){
        this.line.setScale(Vec3.ZERO);
    }
}


