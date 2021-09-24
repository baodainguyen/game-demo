
import { _decorator, Component, systemEvent, SystemEvent, Vec3, randomRange, clamp, macro } from 'cc';
const { ccclass, property } = _decorator;


 
@ccclass('Camera')
export class Camera extends Component {

    private duration = 1.16;
	public speed = 0.9;
	public magnitude = 0.36;

    // [2]
    // @property
    // serializableDummy = 0;

    onLoad() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    onKeyDown(event:any){
        switch(event.keyCode) {
            case macro.KEY.r:
                //this.initVal();
               this.shake(0.016684999999999946);
                break;
        }
    }
    start(){
       this.originCamPos = this.node.getWorldPosition();
       //this.elapsed = this.duration;
    }
    update (deltaTime: number) {
        
    }
    updateShake(deltaTime:number){
        if(this.elapsed < this.duration){
            this.elapsed += deltaTime;			

            let percentComplete = this.elapsed / this.duration;			

        // We want to reduce the shake from full power to 0 starting half way through
            let damper = 1.0 - clamp(2.0 * percentComplete - 1.0, 0.0, 1.0);

        // Calculate the noise parameter starting randomly and going as fast as speed allows
            let alpha = this.randomStart + this.speed * percentComplete;

        // map noise to [-1, 1]
            let x = this.noise(alpha, 0.0) * 2.0 - 1.0;
            let y = this.noise(0.0, alpha) * 2.0 - 1.0;
            
            x *= this.magnitude * damper;
            y *= this.magnitude * damper;

            x = this.originCamPos.x + x;
            y = this.originCamPos.y + y;

            this.node.setWorldPosition(new Vec3(x, y, this.originCamPos.z));

            console.log(this.node.getWorldPosition(), this.randomStart)
        }
    }
    elapsed = 0.0;
    originCamPos:Vec3;
    randomStart = 0;
    initVal(){
        this.elapsed = 0.0;
        this.randomStart = randomRange(-6.9, 6.9);
        this.originCamPos = this.node.getWorldPosition();
    }
    shake(deltaTime:number) {   // 0.016684999999999946
        let elapsed = 0.0;
        let randomStart = randomRange(-6.9, 6.9);
        let originCamPos = this.node.getWorldPosition();
        
        this.schedule(function(){
            if(elapsed < this.duration){
                elapsed += deltaTime;			
			
			    let percentComplete = elapsed / this.duration;			
			
			// We want to reduce the shake from full power to 0 starting half way through
			    let damper = 1.0 - clamp(2.0 * percentComplete - 1.0, 0.0, 1.0);
			
			// Calculate the noise parameter starting randomly and going as fast as speed allows
			    let alpha = randomStart + this.speed * percentComplete;
			
			// map noise to [-1, 1]
                let x = this.noise(alpha, 0.0) * 2.0 - 1.0;
                let y = this.noise(0.0, alpha) * 2.0 - 1.0;
                
                x *= this.magnitude * damper;
                y *= this.magnitude * damper;

                x = originCamPos.x + x;
                y = originCamPos.y + y;

                this.node.setWorldPosition(new Vec3(x, y, originCamPos.z));
			            
            }
           // console.log(this.duration - elapsed);
            console.log(this.node.getPosition());
        }, deltaTime, 69, 0);
    }
    noise(x:number, y:number) { //http://stackoverflow.com/questions/16569660/2d-perlin-noise-in-c
        let n = x + y * 57;
        n = (n << 13) ^ n;
        return (1.0 - ((n * ((n * n * 15731) + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
    }
}

