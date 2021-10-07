import { _decorator, PhysicsSystem, geometry, Vec3, Node,Animation } from 'cc';
import { InputControl } from './input-control';
import { PrefabControl } from './prefab-control';

export class Global {
    static inputControl: InputControl;
    static prefab: PrefabControl
    static MaxDistance = 69;
    static Target:Node = null!;
    static InRgSqrDist = 10 * 10;
    static WalkSpeed = 3.6;
    static isPlayer(layer:number) {
        return layer == EIgnoreLayer.Player;
    }
    static isVisible(layer:number) {
        return layer == EIgnoreLayer.Enemy;
    }
    static isEnvironment(name:string) {
        return name.includes('ground') || name.includes('stone');
    }
    
}

export enum EIgnoreLayer { Ground = 1 << 0, Player = 1 << 1, Enemy = 1 << 2  }

const {Ray} = geometry;

export class Utils {
    // ray cast all
    static rayTo (from:Vec3, to:Vec3, ignLayer:number) {
        let mask = 0xffffffff;
        mask &= ~ignLayer;        
        let dir:Vec3 = new Vec3();
        Vec3.subtract(dir, to, from);
        const outRay = Ray.create(from.x, from.y, from.z, dir.x, dir.y, dir.z);
        return new Promise((resolve) => {
            if (PhysicsSystem.instance.raycast(outRay, mask, Global.MaxDistance)) {
                const r = PhysicsSystem.instance.raycastResults;
                for (let i = 0; i < r.length; i++) {
                    const item = r[i];
                    resolve(item.collider.node);                    
                }
            }
        }); // promise
    };
    static rayClosestDir(from:Vec3, dir:Vec3, range:number){        
        let mask = 0xffffffff;
        mask &= ~EIgnoreLayer.Ground;

        const outRay = Ray.create(from.x, from.y, from.z, dir.x, dir.y, dir.z);
        return new Promise((resolve) => {
            if (PhysicsSystem.instance.raycastClosest(outRay, mask, range)) {
                const r = PhysicsSystem.instance.raycastClosestResult;
                resolve(r.collider.node);
            }
        }); // promise
    };
    static rayClosest(from:Vec3, to:Vec3, ignLayer:number) { //DrawNode
        let mask = 0xffffffff;
        mask &= ~ignLayer;

        let dir:Vec3 = new Vec3();
        Vec3.subtract(dir, to, from);
        const outRay = Ray.create(from.x, from.y, from.z, dir.x, dir.y, dir.z);
        return new Promise((resolve) => {
            if (PhysicsSystem.instance.raycastClosest(outRay, mask, Global.MaxDistance)) {
                const r = PhysicsSystem.instance.raycastClosestResult;
                resolve(r.collider.node);
               // console.log(r.collider.node.name/*, r.collider.node.getPosition()*/);
            }
        }); // promise
    };
    static lookAt(node:Node, posTarget:Vec3) {        
        node.lookAt(posTarget.multiplyScalar(-1));
    }
// https://www.gamedev.net/forums/topic/56471-extracting-direction-vectors-from-quaternion/
    static getVec3Forward(node:Node) {
        let q = node.getWorldRotation();
        let x = 2 * (q.x * q.z + q.y * q.w);
        let y = 2 * (q.y * q.z - q.x * q.w);
        let z = 1 - 2 * (q.x * q.x + q.y * q.y);
        let a = node.getWorldPosition();
        Vec3.add(a, a, new Vec3(x, y, z));
        return a;
    };
}
export class DnbAnim {
    private anim:Animation = null!;
    public setAnim(a:Animation){this.anim = a;}
    public setIdle() { 
        if(this.anim.defaultClip?.name != 'idle') {
            this.anim.play('idle'); this.anim.defaultClip = this.anim.clips[0];
        } }
    public setRun() {
        if(this.anim.defaultClip?.name != 'run') {
            this.anim.play('run'); this.anim.defaultClip = this.anim.clips[1];
        } }
    public setFire() {
        if(this.anim.defaultClip?.name != 'shoot') {
            this.anim.play('shoot'); this.anim.defaultClip = this.anim.clips[2];
        }}
}