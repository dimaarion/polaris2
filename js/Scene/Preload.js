import Phaser from "phaser";
import Location_1 from "../json/Location_1.json"
import ParserLunacy from "../classes/ParserLunacy";
export default class Preload extends Phaser.Scene {
  tiles
  parser  = new ParserLunacy(Location_1)
  constructor() {
      super("Preload");
    }

    preload() {
      this.load.image('player', './img/player.png');
      this.load.spritesheet('magnet', './img/magnet.png',{
        frameWidth:256,
        frameHeight:256
      });
      this.load.image('magnet-min', './img/magnet-min.png');
      this.load.image('magnet-plus', './img/magnet-plus.png');
      this.load.image('magnet-v', './img/objects/magnet-v.png');
      this.load.image('magnet-g', './img/objects/magnet-g.png');
      this.load.image('magnet-point', './img/objects/maghet-point.png');
      this.load.image('magnet-b', './img/objects/magnet-b.png');
      this.load.image('magnet-bgr', './img/objects/magnet-bgr.png');
      this.load.image('magnet-bgl', './img/objects/magnet-bgl.png');
      this.load.image('magnet-minG', './img/objects/magnet-minG.png');
      this.load.image('magnet-plusG', './img/objects/magnet-plusG.png');
      this.load.image('energy', './img/energy.png');
      this.load.image('health', './img/health.png');
      this.load.image('stantion', './img/objects/stantion.png');
      this.load.image('stantion-r', './img/objects/stantion-r.png');
      this.tiles = this.parser.withoutBlur(this.parser.byNamePrefix('tile-'));
      this.tiles.forEach((el)=>{
        this.load.image(el.name, `./img/tiles/${el.name}.png`);
      })

    }

    create() {
      this.scene.start('Start');
    }
}
