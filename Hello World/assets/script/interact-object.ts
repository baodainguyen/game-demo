
import { _decorator, Component, Node } from 'cc';
import { HealthBar } from './health-bar';
const { ccclass } = _decorator;

@ccclass('InteractObject')
export class InteractObject extends Component {
    private healthBar?:HealthBar;
    private health:number = 100;
    
    private isDead = false;
    public get IsDead(){return this.isDead;}
    public hitShell() {
        if(this.health < 0) {
            this.destroyHealthBar();
            return;
        }

        let n = Math.random();
        n += 1;     // hardcode
        this.health -= n;
        if(this.health < 0) {
            this.isDead = true;
            this.timeCount = 0;
            this.deadAnimation();
        }
        this.scaleHealthBar();
    }

    private deadAnimation() {
        // do animation in 2.1 seconds

    }
    destroyHealthBar() {
        this.healthBar && this.healthBar.node.destroy();
        this.healthBar = undefined;
    }
    private scaleHealthBar() {
        let p = this.health / 100;
        this.healthBar && this.healthBar.scale(p);
    }
    public assignBar(n:Node) {
        if(!this.HasBar) {
            this.healthBar = n.getComponent(HealthBar) as HealthBar;
            this.hitShell();

            this.timeCount = 0;
        };        
       this.scaleHealthBar();
    }
    public get HasBar():boolean {
        return !!this.healthBar;
    }

    private timeCount:number = 0;
    update(dt:number) {
        if(this.HasBar) {
            this.timeCount += dt;
            if(this.timeCount > 0.81) {
                this.destroyHealthBar();
            }
        }
        if(this.isDead) {
            this.timeCount += dt;
            if(this.timeCount > 2.1) 
                this.node.destroy();
        }
        
    }
}

