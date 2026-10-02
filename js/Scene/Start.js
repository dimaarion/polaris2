import Phaser from "phaser";
export default class Start extends Phaser.Scene {
   constructor() {
     super("Start");
   }

   create() {
        this.scene.start("level_1")
   }


}
