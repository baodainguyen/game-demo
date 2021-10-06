import { _decorator, Component, Event, BoxCollider, Vec3, RigidBody } from 'cc';
import { Global } from './global';
const { ccclass, property } = _decorator;

@ccclass('MoveControl')
export class MoveControl extends Component {
   
    @property
    speed = 0;

    @property
    rotateSpeed = 0.5;

    rigid:RigidBody = null!;
    posTarget:Vec3 = Vec3.ZERO;
    get Target():Vec3{ return this.posTarget; }
    
    start () {
        if(this.rigid == null) this.rigid = this.getComponent(RigidBody) as RigidBody;
        let collider = this.getComponent(BoxCollider) as BoxCollider;
        collider.on("onCollisionStay", this.onCollisionStay, this);
    }
    onCollisionStay (event:Event) {
        //console.log(event.type, event);
        
        this.stopRigid();
    }

    update (dt: number) {
        
        if(Global.inputControl.isTouch) {
            this.movingBy(Global.inputControl.MovePos.x, Global.inputControl.MovePos.z);
        } else {
            this.stopRigid();
        }
        
    }
    private stopRigid(){
        this.rigid.setLinearVelocity(Vec3.ZERO);
        this.rigid.setAngularVelocity(Vec3.ZERO);
    }
    private movingBy(x:number, z:number, y?:number) {
        let pos = this.node.getWorldPosition();

        pos = this.getLimitPos(pos);
        
        if(y) {
            this.posTarget = new Vec3 (x, y, z);
        } else {
            this.posTarget = new Vec3 (x, pos.y, z);
        }

        let offset = new Vec3();
        Vec3.subtract(offset, this.posTarget, this.node.worldPosition);

        this.node.lookAt(this.posTarget);

        offset.normalize();
        Vec3.multiplyScalar(offset, offset, this.speed);

        this.rigid.setLinearVelocity(offset);
        
    }
    private getLimitPos(pos:Vec3){
        pos.x = pos.x < -16.2 ? -16.2 : pos.x;
        pos.x = pos.x > 22.2 ? 22.2 : pos.x;
        pos.z = pos.z < -28.8 ? -28.8 : pos.z;
        pos.z = pos.z > 4.53 ? 4.53 : pos.z;
        return pos;
    }
}
