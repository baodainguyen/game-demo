
import { _decorator, Component, RigidBody, BoxCollider, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('Bullet')
export class Bullet extends Component {
    
    rigid:RigidBody = null!;
    dir:Vec3 = Vec3.ZERO;
    setDir(_dir:Vec3) {
        this.dir = _dir;
        this.dir.normalize();        
    }

    start () {
        if(this.rigid == null) this.rigid = this.getComponent(RigidBody) as RigidBody;
        let collider = this.getComponent(BoxCollider) as BoxCollider;
        collider.on("onCollisionStay", this.onCollisionStay, this);
    }

    onCollisionStay (event:Event) {
        console.log(event.type, event);
        
    }

    update(dt:number){
        // this.rigid.setLinearVelocity(this.dir);
        // console.log('bullet')

        Vec3.multiplyScalar(this.dir, this.dir, 0.2);
        this.node.setWorldPosition(this.dir);
    }
}

