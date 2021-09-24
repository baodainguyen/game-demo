import { _decorator, Component, Node, Vec3, Quat, systemEvent, SystemEvent, macro, clamp, Vec2, RigidBody } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Player')
@requireComponent(RigidBody)
export class Player extends Component {
    @property({ type: Vec2 })
    public readonly vertical: Vec2 = new Vec2();

    @property({ type: Vec2 })
    public readonly torque: Vec2 = new Vec2();

    @property(RigidBody)
    public rigidBody: RigidBody = null!;

    private _forceZ: number = 0;
    private _force: Vec3 = new Vec3();
    private _linearVelocity: Vec3 = new Vec3();

    private verticalState:number = 0;  // 1 || -1
    private horizontalState:number = 0; // 1 || -1

    onLoad () {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    onKeyDown (event:any) {
        console.log('key down')
        switch(event.keyCode) {
            case macro.KEY.w:
                this.verticalState = 1;
                break;
            case macro.KEY.s:
                this.verticalState = -1;
                break;
                case macro.KEY.d:
                    this.horizontalState = -1;
                    break;
            case macro.KEY.a:
                this.horizontalState = 1;
                break;
        }
    }

    onKeyUp (event:any) {
        this.horizontalState = 0;
        this.verticalState = 0;
    }

    start () {
        //this.rigidBody = this.getComponent(RigidBody);
    }

    update (deltaTime: number) {

        // add world velocity

        if (this.verticalState == 1) {
            this._forceZ += this.vertical.x * deltaTime;
        } else if (this.verticalState == -1) {
            this._forceZ += -this.vertical.x * deltaTime;
        } else {
            this._forceZ = 0;
        }

        // translate by velocity

        if (this._forceZ != 0) {
            this._forceZ = clamp(this._forceZ, -this.vertical.y, this.vertical.y);
            this._force.set(0, 0, this._forceZ);
            Vec3.transformQuat(this._force, this._force, this.node.worldRotation);
            this.rigidBody.getLinearVelocity(this._linearVelocity);
            this._linearVelocity.x = this._force.x;
            this._linearVelocity.z = this._force.z;
            this.rigidBody.setLinearVelocity(this._linearVelocity);
        }

        // rotation by transform

        if (this._forceZ != 0) {
            const factor = Math.abs(1.5 * this._forceZ / this.vertical.y);
            if (this.horizontalState == 1) {
                this.node.rotate(Quat.fromEuler(new Quat(), 0, this.torque.x * deltaTime * factor, 0), 1);
            } else if (this.horizontalState == -1) {
                this.node.rotate(Quat.fromEuler(new Quat(), 0, -this.torque.x * deltaTime * factor, 0), 1);
            }
        }

        // reset angular velocity

        this.rigidBody.getAngularVelocity(this._force);
        this._force.y = 0;
        this.rigidBody.setAngularVelocity(this._force);
    }
}

