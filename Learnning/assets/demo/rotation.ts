
import { _decorator, Component, systemEvent, SystemEvent, macro, Quat, Vec3, Node } from 'cc';
import {Global, Utils} from '../demo/global'
const { ccclass, property } = _decorator;

@ccclass('Rotation')
export class Rotation extends Component {
    @property(Node)
    aaa = null!;

    private rad = 0;
    
    @property({ slide: true, range: [10, 360, 10] })
    private wideAngle = 60;

    onLoad() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    onKeyDown(event:any){
        switch(event.keyCode) {
            case macro.KEY.q:
                this.upAngle();

                this.node.setRotationFromEuler(0, this.Angle, 0);

                console.log(this.VecForward);
                console.log(this.aaa.getWorldPosition());
                break;
        }
    }

    upAngle(){
        this.rad += Global.PI / 24;
    }
    get Angle(){
        return this.wideAngle * this.Sin;
    }
    get Sin(){
        return Math.sin(this.rad);
    }
    
    // https://www.gamedev.net/forums/topic/56471-extracting-direction-vectors-from-quaternion/
    get VecForward() {
        return Utils.getVec3Forward(this.node);

    }

    // update (deltaTime: number) {
    //     this.upAngle();

    //     this.node.setRotationFromEuler(0, this.Angle, 0);
    // }
}
