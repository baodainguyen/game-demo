
import { _decorator, Component, Node, EventTouch, Touch, Vec3 } from 'cc';
import { Global } from './global';
const { ccclass, property } = _decorator;

 
@ccclass('InputControl')
export class InputControl extends Component {

    @property(Node)
    canvas: Node = null!;

    isTouch = false;
    touchPosX = 0;
    touchPosZ = 0;
    movePosX = 0;
    movePosZ = 0;
    get MovePos(){
        return {
            x: this.movePosX, z: this.movePosZ
        }
    }
    
    __preload () {
        Global.inputControl = this;
    }


    start () {
        this.canvas.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.canvas.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.canvas.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    
    onTouchStart(touch: Touch, event: EventTouch){
        this.isTouch = true;
        this.touchPosX = touch.getLocation().x;
        this.touchPosZ = touch.getLocation().y;
        //console.log('onTouchStart', this.touchPosX, this.touchPosZ)
    }

    onTouchMove(touch: Touch, event: EventTouch){
        let touchLoc = touch.getLocation();
        let delX = touchLoc.x - this.touchPosX;
        let delZ = touchLoc.y - this.touchPosZ;

        this.movePosX = delX > 201 ? 201 : (delX < -201 ? -201 : delX);
        this.movePosZ = delZ > 201 ? 201 : (delZ < -201 ? -201 : delZ);
        //console.log('onTouchMove', this.movePosX, this.movePosZ)
    }

    onTouchEnd(touch: Touch, event: EventTouch){       
        this.resetMovePos();
    }
    resetMovePos(){
        this.isTouch = false;
        this.movePosX = 0;
        this.movePosZ = 0;
    }
}