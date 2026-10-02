import Phaser from "phaser";
import ParserLunacy from "../classes/ParserLunacy";
import Location_1 from "../json/Location_1.json"
import Action from "../classes/Action";
import Player from "../classes/Player";
import Magnet from "../classes/Magnet";
import Field from "../classes/Field";

export default class Level_1 extends Phaser.Scene {
      width = 4413
      height = 1080
      parser  = new ParserLunacy(Location_1)
      action = new Action()
      player = new Player(this)
      magnet = new Magnet(this,this.parser)
      field = new Field(this,this.parser)

      tunnels = {
        objects:[{}],
        graphics:{}
      }

      constructor() {
        super("level_1");
      }

      create() {
        this.matter.world.setBounds();
        this.tunnels.objects = this.parser.byName('tonel');
        this.tunnels.graphics = this.add.graphics();
        this.player.setup(this.parser)
        this.magnet.setup(this.player.body)
        this.field.setup()

        this.matter.world.engine.enableSleeping = true;
        this.cam = this.cameras.main;
        this.cam.startFollow(this.player.body, true);
        this.cam.setBounds(0, 0, this.width, this.height);
        this.cameras.main.setBounds(0, 0, this.width, this.height);
        this.matter.world.setBounds(0, 0, this.width, this.height);
        this.tunnels.objects.forEach((el)=>{
          this.tunnels.graphics.fillStyle(this.action.hexToNum(el.fill), 1)
          this.tunnels.graphics.fillRect(el.pos[0],el.pos[1],el.size[0],el.size[1])
        })
      }

      update(time, delta) {
        this.player.draw()
        this.magnet.draw(this.player.body)


      }
}
