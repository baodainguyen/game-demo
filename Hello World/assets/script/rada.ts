
import { _decorator, Component, Node, systemEvent, SystemEvent, KeyCode, EventKeyboard } from 'cc';
import { Global, Utils } from './global';
const { ccclass, property } = _decorator;

@ccclass('Rada')
export class Rada extends Component {
    @property(Node)
    debug:Node = null!;

    private target:Node = null!;
    private rad = 0;
    
    @property({ slide: true, range: [10, 360, 10] })
    private wideAngle = 60;
    
    @property({ slide: true, range: [10, 69, 10] })
    private range = 30;

    update(dt:number){
        if(this.Target === undefined) {
            this.rotateInRange();
        } else {
            this.node.lookAt(this.TargetPos);
        }
    }
    rotateInRange() {
        this.rad += Math.PI / 24;
        this.node.setRotationFromEuler(0, this.Angle, 0);
        //console.log(this.VecForward, this.debug.position, this.debug.worldPosition);
        Utils.rayClosestDir(this.node.getWorldPosition(), this.VecForward, this.range).then(
            (node:any) => {
                if(!Global.isEnvironment(node.name) && !(this.target && this.target.position)) {
                    console.log('visible:' + node.name);
                    this.target = node;
                }
            }
        )
    };
    get TargetPos() {
        if(this.Target !== undefined) return this.Target.getPosition();
        return this.node.getPosition();
    }
    get Target() {
        if(this.target && this.target.position) return this.target;
        return undefined;
    }
    get Angle(){
        return this.wideAngle * Math.sin(this.rad);
    }
    get VecForward() {
        return Utils.getVec3Forward(this.node);
    }
}

