
import { _decorator, Component, Node, clamp } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('HealthBar')
export class HealthBar extends Component {

    @property(Node)
    value:Node = null!;

    public scale(percent:number){
        percent = clamp(percent, 0, 1);
        this.value.setScale(percent, 1, 1);
    }

}