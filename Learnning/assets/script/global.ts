
import { _decorator, Node, Vec3, game } from 'cc';
const { ccclass, property } = _decorator;


export class Global {
    static PI = 3.14159265359;
    static SceneNames: string[] = [];
    
}

export class Utils {
    static getSquare( radius:number ) {
        return Global.PI * radius * radius;
    }
    static getR( square:number ) {
        let rr = square / Global.PI;
        let radius = Math.sqrt(rr);
        return Number(radius.toFixed(2));       // round 2 float pointer
    }

    // https://www.gamedev.net/forums/topic/56471-extracting-direction-vectors-from-quaternion/
    static getVec3Forward(node:Node) {
        let q = node.getWorldRotation();
        let x = 2 * (q.x * q.z + q.y * q.w);
        let y = 2 * (q.y * q.z - q.x * q.w);
        let z = 1 - 2 * (q.x * q.x + q.y * q.y);

        let a = node.getWorldPosition();
        let b = new Vec3(x, y, z);
        Vec3.add(a, a, b);
        return a;
    }
    static getVec3Left(node:Node) {
        let q = node.getWorldRotation();
        let x = 1 - 2 * (q.y * q.y + q.z * q.z);
        let y = 2 * (q.x * q.y - q.z * q.w);
        let z = 2 * (q.x * q.z + q.y * q.w);

        let a = node.getWorldPosition();
        let b = new Vec3(x, y, z);
        Vec3.add(a, a, b);
        return a;
    }

    static getScenes(){
        const sceneInfo = game._sceneInfos;
        const array: string[] = sceneInfo.map((i:any) => i.url).sort();
        console.log(sceneInfo);
        console.log(array);
        for (let i = 0; i < array.length; i++) {
            let str = array[i];
            if (str.includes("TestList") || str.includes("subPack") || str.includes('editor-only') || str.includes('experiment')) {
                continue;
            }
            const firstIndex = str.lastIndexOf('/') + 1;
            const lastIndex = str.lastIndexOf('.scene');
            Global.SceneNames.push(str.substring(firstIndex, lastIndex));
        }

        console.log(Global.SceneNames);
    }
}