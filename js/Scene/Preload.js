import Phaser from "phaser";
export default class Preload extends Phaser.Scene {
    constructor() {
      super("Preload");
    }

    preload() {
      this.load.image('player', './img/player.png');
      this.load.image('magnet', './img/magnet.png');
    }

    create() {
      this.scene.start('Start');
    }
}
