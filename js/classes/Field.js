import Action from "./Action";

export default class Field{
  scene
  body = []
  graphics
  parser
  action = new Action()
  polar = "none"
  force
  cursors
  constructor(scene,parser) {
    this.scene = scene;
    this.parser = parser;
  }

  setup(){
    this.graphics = this.scene.add.graphics();
    const field = this.parser.byName('field');

    this.body = field.map((el)=>{
      return this.scene.matter.add.rectangle(el.pos[0] + el.size[0] / 2,el.pos[1] + el.size[1] / 2,el.size[0],el.size[1],
        {
        isStatic:true,
        label:el.name,
      })
    })

    field.forEach((el)=>{
    let g  =  this.action.parseAndDrawPath(this.scene,el).enableFilters();

    })




  }

}
