import Phaser from "phaser";
export default class Action{

  hexToNum(hex) {
    return Phaser.Display.Color.HexStringToColor(hex).color;
  }

  parseAndDrawPath(scene, pathData) {
    const graphics = scene.add.graphics();

    // 1. Парсим цвет из HEX-строки "FE523A"
    const color = parseInt(pathData.fill, 16);
    const strokeWidth = pathData.thickness || 2;
    const alpha = 1;

    // Устанавливаем стиль линии
    graphics.lineStyle(strokeWidth, color, alpha);

    // 2. Получаем размеры и позицию
    const [posX, posY] = pathData.pos;
    const [width, height] = pathData.size;

    // 3. Переводим координаты из 0..1 в пиксели с учетом позиции
    const points = pathData.points.map(pt => ({
      x: posX + pt[0] * width,
      y: posY + pt[1] * height
    }));

    if (points.length < 2) return graphics;

    // 4. Отрисовываем путь
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y);
    }

    // Если это замкнутый контур — раскомментируйте:
    // graphics.closePath();

    graphics.strokePath();

    return graphics;
  }

  getDistance(playerPos, objectPos, threshold = 100) {
    // Предполагаем, что objectPos содержит width и height (или передаем по умолчанию)
    const width = objectPos.width || 0;
    const height = objectPos.height || 0;

    // Если координаты объекта находятся в его центре, находим границы:
    const minX = objectPos.x - width / 2;
    const maxX = objectPos.x + width / 2;
    const minY = objectPos.y - height / 2;
    const maxY = objectPos.y + height / 2;

    // Находим ближайшую к игроку точку на поверхности/грани прямоугольника
    const closestX = Math.max(minX, Math.min(playerPos.x, maxX));
    const closestY = Math.max(minY, Math.min(playerPos.y, maxY));

    // Вычисляем дельту от игрока до этой ближайшей точки
    const dx = playerPos.x - closestX;
    const dy = playerPos.y - closestY;

    // Считаем расстояние (Math.hypot быстрее и читаемее, чем Math.sqrt + Math.pow)
    const dist = Math.hypot(dx, dy);

    return dist < threshold;
  }

  collideRectRect = function (x, y, w, h, x2, y2, w2, h2) {
    //2d
    //add in a thing to detect rectMode CENTER
    return x + w >= x2 &&    // r1 right edge past r2 left
      x <= x2 + w2 &&    // r1 left edge past r2 right
      y + h >= y2 &&    // r1 top edge past r2 bottom
      y <= y2 + h2;

  };

  createMatterImage(scene,el,options,frame = 0){
    return   scene.matter.add.image(el.pos[0] + el.size[0] / 2,el.pos[1] + el.size[1] / 2,el.name,frame, {
      ...options,label: el.name})
  }

  createImage(scene,el,frame = 0) {
    return scene.add.image(el.pos[0] + el.size[0] / 2, el.pos[1] + el.size[1] / 2, el.name, frame)
  }

  isDistance(playerPos,objectPos,threshold = 100){
    const dist = Math.sqrt(
      Math.pow(playerPos.x - objectPos.x, 2) + Math.pow(playerPos.y - objectPos.y, 2) // Можно считать только в 2D (X и y)
    );
    return dist < threshold;
  }

  createArray(n = 0){
    let a = []
    for (let i = 0; i < n; i++ ){
      a[i] = i
    }
    return a
  }
}
