import Action from "./Action";
import Phaser from "phaser";
export default class Player{
  body
  scene
  parser
  cursors
  action = new Action()
  start = false
  magnet = null
  toggle = false
  energy = null
  health = []
  countHealth = 13
  polar = "none"
  impulse = {x:0,y:0,force:1}
  graphics
  playerController
  speed = 10
  constructor(scene) {
    this.scene = scene
    this.health = this.action.createArray(this.countHealth)
  }

  setup(parser){
    this.parser = parser
    this.graphics = this.scene.add.graphics();
    let p = this.parser.byName('player').map((el)=>{
      return {
        x:el.pos[0],
        y:el.pos[1],
        width:el.size[0],
        height:el.size[1],
      }
    })[0]

    this.playerController = {
      player:this.scene.matter.add.sprite(p.x + p.width / 2,p.y + p.height / 2, 'player', 0),
      magnet:null,
      sensor:null
    }

    const M = Phaser.Physics.Matter.Matter;
    const w = this.playerController.player.width;
    const h = this.playerController.player.height;
    const sx = w / 2;
    const sy = h / 2;
    this.playerController.magnet = M.Bodies.circle(sx, sy, 128);
    this.playerController.sensor = M.Bodies.circle(sx, sy, 128,{ isSensor: true });
    const compoundBody = M.Body.create({
      parts: [this.playerController.magnet,this.playerController.sensor],
      friction: 0.01,
      restitution: 0.05 // Prevent body from sticking against a wall
    });
    this.playerController.player
      .setExistingBody(compoundBody)
      .setFixedRotation() // Sets max inertia to prevent rotation
      .setPosition(p.x + p.width / 2,p.y + p.height / 2);


   this.body = this.playerController.player
     .setDepth(3).setScale(1)
   this.magnet = this.scene.add.image(this.body.body.position.x,this.body.body.position.y,"magnet",0)
     .setDepth(4).setScale(1)
    this.energy = this.scene.add.image(this.body.body.position.x,this.body.body.position.y,"energy",0)
      .setDepth(5)
    this.health = this.health.map(()=> {
      return this.scene.add.image(this.energy.x, this.energy.y, "health", 0).setDepth(6)
    })

    this.cursors = this.scene.input.keyboard.createCursorKeys();


    this.scene.input.keyboard.on('keydown',(event)=>{
      if(event.code === "Space"){
        this.handle(event)
      }
      if(event.code === "ArrowUp"){
       this.impulse.y = -this.impulse.force
        this.impulse.x = 0
      }else if(event.code === "ArrowDown"){
        this.impulse.y = this.impulse.force
        this.impulse.x = 0
      }else if(event.code === "ArrowLeft"){
        this.impulse.x = -this.impulse.force
        this.impulse.y = 0
      }else if(event.code === "ArrowRight"){
        this.impulse.x = this.impulse.force
        this.impulse.y = 0
      }else {
        this.impulse.x = 0
        this.impulse.y = 0
      }
      this.scene.matter.body.applyForce(this.body.body,this.body.body.position,this.impulse)
    },this);

    this.scene.input.on('pointerdown', (event)=>{
     // this.handle(event)
    },this);



  }


  draw(){
    this.magnet.setPosition(this.body.body.position.x,this.body.body.position.y)
    this.energy.setPosition(this.body.body.position.x,this.body.body.position.y - 150)
    this.graphics.clear()
    this.graphics.fillStyle(this.action.hexToNum("#15D8E6"),1)
    this.graphics.fillRoundedRect(this.energy.x - 45,this.energy.y - 10,this.impulse.force * 100,11,2).setDepth(4)


    this.health.forEach((el,i)=> {
    el.setPosition((this.energy.x - 40) + i * el.width,this.energy.y + 14)
    })

    if(this.toggle){
      this.magnet.setFrame(1)
    }else {
      this.magnet.setFrame(0)
    }
    if(this.cursors.space.isDown){
      this.start = true
    }
  }

  handle(event){


      if(this.countHealth > 0){
        this.countHealth -= 1
      }

      this.health.forEach((el,i)=>{
        if(this.countHealth === i){
          el.visible = false
        }
      })
      this.toggle = !this.toggle
      this.scene.tweens.add({
        targets: this.magnet,
        angle: this.toggle?{ start: 0, to: 180 }:{ start: 180, to: 0 },
        ease: 'sine.inout',
        yoyo: false,
        repeat: 0,
        duration: 500
      });
    if(this.polar === "none"){
      this.polar = "plus"
    }else if(this.polar === "plus"){
      this.polar = "minus"
    }else if(this.polar === "minus"){
      this.polar = "plus"
    }
    }


}
