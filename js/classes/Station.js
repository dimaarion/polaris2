import Action from "./Action";

export default class Station{
  graphics
  parser
  action = new Action()
  polar = "none"
  force
  cursors
  player
  body = []
  blockR = []
  constructor(scene,parser) {
    this.scene = scene;
    this.parser = parser;
  }

  setup(player){
    this.player = player
    this.body = this.parser.byName('stantion')
    this.body = this.body.map((el)=>{
      return this.action.createMatterImage(this.scene,el,{isSensor:true,isStatic:true,label:"stat"}).setDepth(1)
    })
    this.blockR = this.body.map((el)=>this.scene.add.image(el.body.position.x,el.body.position.y - 13,"stantion-r").setDepth(1))
    this.blockR.forEach((el)=>{
      this.scene.tweens.add({
        targets:el,
        angle:{start:0,to:360},
        ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 5000,
        repeat: -1,            // -1: infinity
        yoyo: false,
    })
    })
    this.scene.matter.world.on('collisionactive', function (event, bodyA, bodyB) {
      this.body.forEach((el)=>{
        if(bodyA === this.player.playerController.sensor && bodyB === el.body){
          this.player.health.filter((f)=>f).forEach((he)=>{
            he.visible = true
            this.player.countHealth = 13
          })

        }
      })
    }, this);
  }


}
