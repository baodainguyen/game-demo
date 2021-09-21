import { _decorator, PhysicsSystem, geometry, Vec3 } from 'cc';
import { InputControl } from './input-control';
import { PrefabControl } from './prefab-control';

export class Global {
    static inputControl: InputControl;
    static prefab: PrefabControl
   
}

export enum EIgnoreLayer { Ground = 0, Player = 1, Enemy = 2  }

const {Ray} = geometry;
enum ERaycastType {
    ALL, CLOSEST
}
var _mask: number = 0xffffffff,
    _raycastType: ERaycastType = ERaycastType.ALL,
    _maxDistance = 99;

export class Utils {

    static rayTo (from:Vec3, to:Vec3, ignLayer:EIgnoreLayer) {
        _mask &= ~ignLayer;
        let dir:Vec3 = new Vec3();
        Vec3.subtract(dir, to, from);
        const outRay = Ray.create(from.x, from.y, from.z, dir.x, dir.y, dir.z);
        return new Promise((resolve) => {

            switch (_raycastType) {
                case ERaycastType.ALL:
                    if (PhysicsSystem.instance.raycast(outRay, _mask, _maxDistance)) {
                        const r = PhysicsSystem.instance.raycastResults;
                        for (let i = 0; i < r.length; i++) {
                            const item = r[i];
                            resolve(item.collider.node);
                            
                           // const modelCom = item.collider.node.getComponent(ModelComponent)!;
                           // modelCom.material = this.rayMaterial;
                        }
                    }
                    break;
                case ERaycastType.CLOSEST:
                    if (PhysicsSystem.instance.raycastClosest(outRay, _mask, _maxDistance)) {
                        const r = PhysicsSystem.instance.raycastClosestResult;
                        resolve(r.collider.node);
                       // console.log(r.collider.node.name, r.collider.node.getPosition());
                        //const modelCom = r.collider.node.getComponent(ModelComponent)!;
                        //modelCom.material = this.rayMaterial;
                    }
                    break;
            }
        }); // promise
    };
}
