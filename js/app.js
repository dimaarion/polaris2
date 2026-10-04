import Phaser from "phaser";
import Start from "./Scene/Start";
import Preload from "./Scene/Preload";
import Level_1 from "./Scene/Level_1";

const config = {
  type: Phaser.AUTO,           // WebGL с фоллбеком на Canvas — не трогать, это уже правильно

  // Берём реф-разрешение из раздела 10 ГДД, а не произвольные 800×600 —
  // тогда пиксельные размеры пластин/сегментов из Lunacy-парсера
  // совпадают с игровыми координатами без пересчёта масштаба
  width: 1920,
  height: 1080,

  scale: {
    parent: 'polaris',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 480, height: 270 },   // не схлопывается на маленьких экранах
    max: { width: 2560, height: 1440 }, // не распухает на огромных
  },
  backgroundColor: '#0a0e14',   // тёмный космос/фон из ГДД, не чёрный чистый — мягче на глазах
  render: {
    antialias: true,            // у вас плавные кривые/скруглённые формы — важно
    pixelArt: false,            // явно: это НЕ пиксель-арт, сглаживание нужно
    roundPixels: false,         // не округлять позиции — иначе плавное скольжение/докинг дёргается
  },

  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 },  // НЕ стандартная гравитация игры-платформера —
      // это именно тот слабый тай-брейк из раздела 3.4 ГДД
      // ("при равном притяжении робот всегда оседает вниз")
      debug: process.env.NODE_ENV !== 'production', // debug-отрисовка хитбоксов только в деве
      debugShowBody: true,
      debugShowStaticBody: true,
      enableSleeping: true
    }
  },

  fps: {
    target: 60,
    forceSetTimeOut: false,
  },
  plugins:{
    scene:[

    ]
  },
  scene: [Preload,Start,Level_1],

};

let game = new Phaser.Game(config);


