import Action from "./Action";

export default class Magnet{
  scene
  body = []
  graphics
  parser
  action = new Action()
  polar = "none"
  force
  cursors
  magnets
  player
  constructor(scene,parser) {
    this.scene = scene;
    this.parser = parser;
  }

  setup(player){
    this.player = player
      this.graphics = this.scene.add.graphics();
    this.magnets = this.parser.withoutBlur(this.parser.byNamePrefix('magnet-'));
      this.body = this.magnets.map((el)=>{
        return this.action.createMatterImage(this.scene,el,{isStatic:true,isSensor:true,chamfer: { radius: 20 }}).setDepth(1)
      })
    this.scene.matter.world.on('collisionactive', function (event) {
      for (let i = 0; i < event.pairs.length; i++) {
        const bodyA = event.pairs[i].bodyA;
        const bodyB = event.pairs[i].bodyB;
if(bodyA === this.player.playerController.sensor && (bodyB.label === "magnet-minG" || bodyB.label === "magnet-plusG")){
  this.player.body.setVelocity(this.player.speed,this.player.body.body.velocity.y)
}

      }

    }, this);
  }

  draw(){
    this.body.forEach((el)=>{
      el.visible = this.action.isDistance(this.player.body.body.position, el.body.position, 2600);
      if(this.action.isDistance(this.player.body.body.position,el.body.position,1200)){
        if(this.player.polar === "plus"){
          if(el.body.label === "magnet-plusG"){
            this.force = {
              x: this.player.body.body.velocity.x,
              y: 10//(el.body.position.x - this.player.playerController.magnet.position.x) * 0.1 * 0.0001
            };
          }

        }else if(this.player.polar === "minus"){
          if(el.body.label === "magnet-minG"){
            this.force = {
              x: this.player.body.body.velocity.x,
              y: -10
            };
          }

        }
        console.log(this.player.polar)
        if(this.player.polar !== "none" && this.player.countHealth > 0){
         // this.scene.matter.body.applyForce(this.player.body.body,this.player.body.body.position,this.force)

          this.player.body.setVelocity(this.force.x,this.force.y)
        }
      }
    })
  }
}
