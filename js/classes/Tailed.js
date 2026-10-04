import Action from "./Action";

export default class Tailed{
  scene
  body
  action = new Action()
  tiles
  player
  constructor(scene,parser) {
    this.scene = scene;
    this.parser = parser;
  }

setup(player){
this.player = player
  this.tiles = this.parser.withoutBlur(this.parser.byNamePrefix('tile-'));
  this.body = this.tiles.map((el)=>this.action.createImage(this.scene,el,0).setDepth(0))
}

draw(player){

  this.body.forEach((el)=>{
    el.visible = this.action.isDistance(this.player.body.position, {x: el.x, y: el.y}, 2100);
  })

}

}
