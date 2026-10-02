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
  constructor(scene,parser) {
    this.scene = scene;
    this.parser = parser;
  }

  setup(player){
      this.graphics = this.scene.add.graphics();
    this.magnets = this.parser.withoutBlur(this.parser.byName('magnet-plus'));
      this.body = this.magnets.map((el)=>{
        return this.scene.matter.add.rectangle(el.pos[0] + el.size[0] / 2,el.pos[1] + el.size[1] / 2,el.size[0],el.size[1],{
          isStatic:true,
          label:el.name,
          chamfer: { radius: 20 },
        })
      })

    this.cursors = this.scene.input.keyboard.createCursorKeys();

      document.addEventListener("keydown",(e)=>{
           if(e.code === "Space"){
             if(this.polar === "none"){
               this.polar = "plus"
             }else if(this.polar === "plus"){
               this.polar = "minus"
             }else if(this.polar === "minus"){
               this.polar = "plus"
             }
           }
      })


  }

  draw(player){
    this.graphics.clear()
    this.magnets.forEach((el)=>{
      if (this.action.getDistance(player.body.position,{x:el.pos[0] + el.size[0] / 2,y:el.pos[1] + el.size[1] / 2,width:el.size[0],height:el.size[1]},1950)) {
        this.graphics.fillStyle(this.action.hexToNum(el.fill), 1)
        this.graphics.fillRoundedRect(el.pos[0], el.pos[1], el.size[0], el.size[1], 25)
      }
    })
    this.body.forEach((el)=>{
     if(this.polar === "plus"){
       this.force = {
         x: (el.position.x - player.body.position.x) * 0.1 * 0.0001,
         y: (el.position.y - player.body.position.y) * 0.1 * 0.0001
       };
     }else if(this.polar === "minus"){
       this.force = {
         x: -(el.position.x - player.body.position.x) * 0.1 * 0.0001,
         y: -(el.position.y - player.body.position.y) * 0.1 * 0.0001
       };
     }
     if(this.polar !== "none"){
       this.scene.matter.body.applyForce(player.body,player.body.position,this.force)
     }

    })

  }

}
