import { _decorator, Component, Node, Vec3 } from 'cc';
import { Global, Utils } from './global';
const { ccclass, property } = _decorator;

@ccclass('Rada')
export class Rada extends Component {
   @property(Node)
   nodeDirection:Node = null!;
    private target?:Node;
    private rad = 0;
    
    @property({ slide: true, range: [10, 180, 10] })
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
        //console.log(this.VecForward);
        Utils.rayClosestDir(this.node.getWorldPosition(), this.VecForward, this.range).then(
            (node:any) => {
                if(!Global.isEnvironment(node.name)) {
                    console.log('visible:' + node.name);
                    this.target = node;
                }
            }
        )
    };
    get TargetPos() {
        if(this.Target !== undefined) 
            return new Vec3(this.Target.position.x, this.node.position.y, this.Target.position.z);

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
        return new Vec3(this.nodeDirection.worldPosition.x, this.node.worldPosition.y, this.nodeDirection.worldPosition.z);
    }
}

