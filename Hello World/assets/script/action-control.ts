
import { _decorator, Component, Node, Vec3, clamp } from 'cc';
import { Global, EIgnoreLayer, Utils } from './global';
import { MoveControl } from './move-control';
const { ccclass, property } = _decorator;
 
@ccclass('ActionControl')
export class ActionControl extends Component {
    
    @property(Node)
    line:Node = null!;

    @property(Node)
    target:Node = null!;

    moveControl:MoveControl = null!;

    private dir:Vec3 = new Vec3();
    onEnable() {
        this.dir = this.target.getWorldPosition();
        Vec3.subtract(this.dir, this.dir, this.line.worldPosition)
    }

    start () {
        this.moveControl = this.getComponent(MoveControl) as MoveControl;
        this.resetScale();
    }
    resetScale(){
        this.line.setScale(Vec3.ZERO);
    }
    update (deltaTime: number) {
        if(Global.inputControl.IsFire) {
            this.onFire();
        }
    }
    
    onFire(){
        let from = this.line.getWorldPosition();
        let to = this.target.getWorldPosition();

        Utils.rayClosest(from, to, EIgnoreLayer.Ground).then((node:any) => {
            let ds = node.getWorldPosition();
            console.log(node.name, ds, node.layer);
            let dst = Global.MaxDistance;
            if(node.name == 'ground') {
                this.line.setScale(new Vec3(1, 1, dst)); 
            } else {
                dst = Vec3.distance(ds, this.node.worldPosition);
                this.line.setScale(new Vec3(1, 1, dst - 1.177));
            }
            
            this.scheduleOnce(this.resetScale, 0.045);
        });
    }
    fire(event:Event, customEventData:any){
        this.onFire();
    }
    
    load(event:Event, customEventData:any){
        console.log("Loading...");
        console.log(event);
        console.log(customEventData);
    }
}
