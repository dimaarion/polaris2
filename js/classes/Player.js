export default class Player{
  body
  scene
  parser
  cursors
  start = false
  magnet = null
  toggle = false
  constructor(scene) {
    this.scene = scene
  }

  setup(parser){
    this.parser = parser
    let p = this.parser.byName('player').map((el)=>{
      return {
        x:el.pos[0],
        y:el.pos[1],
        width:el.size[0],
        height:el.size[1],
      }
    })[0]

   this.body = this.scene.matter.add.image(p.x + p.width / 2,p.y + p.height / 2,"player",0,{chamfer: { radius: 50 }}).setFixedRotation()
     .setDepth(2).setScale(0.5)
   this.magnet = this.scene.add.image(this.body.body.position.x,this.body.body.position.y,"magnet",0)
     .setDepth(1).setScale(0.5)
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.scene.input.keyboard.on('keydown', function (event) {

      if(event.code === "Space"){
        this.toggle = !this.toggle
        this.scene.tweens.add({
          targets: this.magnet,
          angle: this.toggle?{ start: 0, to: 180 }:{ start: 180, to: 0 },
          ease: 'sine.inout',
          yoyo: false,
          repeat: 0,
          duration: 500
        });
      }

    },this);


  }


  draw(){
    this.magnet.setPosition(this.body.body.position.x,this.body.body.position.y)

    if(this.cursors.space.isDown){
      this.start = true
    }

    if(this.start){
      this.body.setVelocity(10,this.body.body.velocity.y)
    }

  }

}
