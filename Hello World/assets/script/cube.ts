
import { _decorator, Component, Node, RigidBody, Vec3, TiledUserNodeData } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cube')
export class Cube extends Component {
    @property(RigidBody)
    rigid:RigidBody = null!;

    @property(Node)
    target:Node = null!;
    
    dir:Vec3 = Vec3.ZERO;

    start () {
        this.dir = this.node.getWorldPosition();
        Vec3.subtract(this.dir, this.target.getWorldPosition(), this.dir);
        this.dir = this.dir.normalize();
    }
    fire(){
        
        Vec3.multiplyScalar(this.dir, this.dir, 0.5);
        this.rigid.applyForce(this.dir);
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
}

