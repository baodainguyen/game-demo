
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

 
@ccclass('BaseRada')
export class BaseRada extends Component {
    protected rad = 0;

    @property(Node)
    nodeDirection:Node = null!;
    @property({ slide: true, range: [10, 180, 10] })
    protected wideAngle = 60;    
    @property({ slide: true, range: [10, 69, 10] })
    protected range = 15;

    protected get Angle(){
        return this.wideAngle * Math.sin(this.rad);
    }
    protected get VecForward() {
        return new Vec3(this.nodeDirection.worldPosition.x, this.node.worldPosition.y, this.nodeDirection.worldPosition.z);
    }
}
