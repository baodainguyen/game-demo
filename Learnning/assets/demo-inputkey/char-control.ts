import { _decorator, Component, Node, Vec3, RichText, SystemEvent, systemEvent, macro, Quat, misc } from 'cc';

const { ccclass, property } = _decorator;
 
@ccclass('CharControl')
export class CharControl extends Component {
    @property 
    speed = 0.5;
    X:number = 0;
    Z:number = 0;
    move(node:Node, speed:number){
        
        let pos = node.getPosition();
        pos.x += this.X;
        pos.z += this.Z;
        node.setPosition(pos.multiplyScalar(speed));
    }

    @property(RichText)
    bugLog = null!;

    onLoad() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    onKeyDown(event:any){
        switch(event.keyCode) {
            case macro.KEY.a:
                this.X -= 1;
                
                this.look(this.node, new Vec3(-1, 0, 0));
                break;
            case macro.KEY.d:
                this.X += 1;
                
                this.look(this.node, new Vec3(1, 0, 0));
                break;
            case macro.KEY.w:
                this.Z -= 1;
                
                this.look(this.node, new Vec3(0, 0, -1));
                break;
            case macro.KEY.s:
                this.Z += 1;
                
                this.look(this.node, new Vec3(0, 0, 1));
                break;
        }
    }
    
    look(node:Node, dir:Vec3){
        Vec3.multiplyScalar(dir, dir, -1);
        let t = node.getPosition();
        Vec3.add(t, t, dir);
        node.lookAt(t);
    }

    update (deltaTime: number) {
        this.move(this.node, this.speed);
    }

    rotate(node:Node, dir:Vec3){
        let tempQuatX = node.getRotation();
        let currentY = tempQuatX.y; console.log(misc.radiansToDegrees(currentY));

        Vec3.normalize(dir, dir);
        let rad = Math.atan2(dir.x, dir.z);
        
        Quat.fromAxisAngle(tempQuatX, Vec3.UP, rad);
        Quat.multiply(tempQuatX, tempQuatX, node.getRotation());
        node.setRotation(tempQuatX);

        this.bugLog.string = `y: ${node.getRotation().y};\n w: ${node.getRotation().w}`;

        let t = node.getPosition();
        Vec3.add(t, t, dir);
        node.lookAt(t);
    }

}

