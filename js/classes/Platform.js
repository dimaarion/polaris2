import Action from "./Action";

export default class Platform{
  scene
  body
  graphics
  action = new Action()
  constructor(scene,parser) {
    this.scene = scene;
    this.parser = parser;
  }

  setup(){
    this.graphics = this.scene.add.graphics();
    const platform = this.parser.withoutBlur(this.parser.byName('platform'));
    this.body = platform.map((el)=>{
      return this.scene.matter.add.rectangle(el.pos[0] + el.size[0] / 2,el.pos[1] + el.size[1] / 2,el.size[0],el.size[1],{
        isStatic:true,
        label:el.name,
        chamfer: { radius: 20 }
      })
    })

    platform.forEach((el)=>{
      this.graphics.fillStyle(this.action.hexToNum(el.fill), 1)
      this.graphics.fillRoundedRect(el.pos[0],el.pos[1],el.size[0],el.size[1],25)
    })
  }


}
