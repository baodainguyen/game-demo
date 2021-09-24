
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


export class Global {
    static PI = 3.14159265359;

    
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
}