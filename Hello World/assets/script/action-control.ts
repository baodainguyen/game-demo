
import { _decorator, Component, Node, Vec3 } from 'cc';
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

    start () {
        this.moveControl = this.getComponent(MoveControl) as MoveControl;
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
            console.log(node.name, node.getPosition());
            this.line.setScale(new Vec3(1, 1, Utils.MaxDistance));

            let self = this;
            this.scheduleOnce(function() {
                self.line.setScale(Vec3.ZERO);
            }, 0.09);
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
