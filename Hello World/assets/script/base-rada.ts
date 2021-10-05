import { _decorator, Component, Vec3 } from 'cc';
import { Utils } from './global';
const { ccclass, property } = _decorator;

@ccclass('BaseRada')
export class BaseRada extends Component {
    protected rad = 0;

    @property({ slide: true, range: [10, 180, 10] })
    protected wideAngle = 60;    
    @property({ slide: true, range: [10, 69, 10] })
    protected range = 15;

    protected roteUI() {
        this.rad += Math.PI / 24;
        this.node.setRotationFromEuler(0, this.Angle, 0);
    }
    protected get Angle(){
        return this.wideAngle * Math.sin(this.rad);
    }
    protected get VecForward() {
        let forW = Utils.getVec3Forward(this.node);
        Vec3.subtract(forW, this.node.worldPosition, forW);
        return forW;
    }
}
