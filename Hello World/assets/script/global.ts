import { _decorator, PhysicsSystem, geometry, Vec3, Node, Graphics, Color } from 'cc';
import { InputControl } from './input-control';
import { PrefabControl } from './prefab-control';

export class Global {
    static inputControl: InputControl;
    static prefab: PrefabControl
   
}

export enum EIgnoreLayer { Ground = 0, Player = 1, Enemy = 2  }

const {Ray} = geometry;

export class Utils {
    static MaxDistance = 15;
    // ray cast all
    static rayTo (from:Vec3, to:Vec3, ignLayer:number) {
        let mask = 0xffffffff;
        mask &= ~ignLayer;
        
        let dir:Vec3 = new Vec3();
        Vec3.subtract(dir, to, from);
        const outRay = Ray.create(from.x, from.y, from.z, dir.x, dir.y, dir.z);
        return new Promise((resolve) => {

            if (PhysicsSystem.instance.raycast(outRay, mask, Utils.MaxDistance)) {
                const r = PhysicsSystem.instance.raycastResults;
                for (let i = 0; i < r.length; i++) {
                    const item = r[i];
                    resolve(item.collider.node);
                    
                   // const modelCom = item.collider.node.getComponent(ModelComponent)!;
                   // modelCom.material = this.rayMaterial;
                }
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

            if (PhysicsSystem.instance.raycastClosest(outRay, mask, Utils.MaxDistance)) {
                const r = PhysicsSystem.instance.raycastClosestResult;
                resolve(r.collider.node);
               // console.log(r.collider.node.name, r.collider.node.getPosition());
                //const modelCom = r.collider.node.getComponent(ModelComponent)!;
                //modelCom.material = this.rayMaterial;
            }
        }); // promise
    };

}
