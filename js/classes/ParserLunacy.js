export default class ParserLunacy {
  constructor(nodes) {
    this.nodes = nodes || [];
  }

  // ---------- базовый доступ ----------

  /** Все узлы как есть */
  all() {
    return this.nodes;
  }

  /** Узлы с точным совпадением имени */
  byName(name) {
    return this.nodes.filter((n) => n.name === name);
  }

  /** Узлы, чьё имя начинается с префикса (например, служебные конвенции вида "gate_") */
  byNamePrefix(prefix) {
    return this.nodes.filter((n) => n.name && n.name.startsWith(prefix));
  }

  /** Узлы по типу элемента Lunacy (RECT, GROUP, PATH и т.п.) */
  byType(type) {
    return this.nodes.filter((n) => n._t === type);
  }

  /** Узел по id */
  byId(id) {
    return this.nodes.find((n) => n.id === id);
  }

  /** Отфильтровать произвольным предикатом */
  where(predicate) {
    return this.nodes.filter(predicate);
  }

  /** Исключить узлы с эффектом blur (частый паттерн: гало-копия + "ядро" без blur) */
  withoutBlur(nodes = this.nodes) {
    return nodes.filter((n) => !n.blur);
  }

  /** Только узлы с эффектом blur */
  onlyBlur(nodes = this.nodes) {
    return nodes.filter((n) => !!n.blur);
  }

  // ---------- геометрия ----------

  bbox(node) {
    const [x, y] = node.pos || [0, 0];
    const [width, height] = node.size || [0, 0];
    return { x, y, width, height };
  }

  center(node) {
    const b = this.bbox(node);
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }

  /** Длина пересечения двух интервалов [aStart,aEnd] и [bStart,bEnd] на одной оси */
  static intervalOverlap(aStart, aEnd, bStart, bEnd) {
    return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
  }

  /** Площадь пересечения bbox двух узлов (0, если не пересекаются) */
  bboxOverlapArea(a, b) {
    const ba = this.bbox(a);
    const bb = this.bbox(b);
    const ox = ParserLunacy.intervalOverlap(ba.x, ba.x + ba.width, bb.x, bb.x + bb.width);
    const oy = ParserLunacy.intervalOverlap(ba.y, ba.y + ba.height, bb.y, bb.y + bb.height);
    return ox * oy;
  }

  /** Содержит ли bbox узла точку */
  containsPoint(node, point) {
    const b = this.bbox(node);
    return point.x >= b.x && point.x <= b.x + b.width && point.y >= b.y && point.y <= b.y + b.height;
  }

  /** Все узлы, чей bbox содержит точку */
  nodesAtPoint(point, nodes = this.nodes) {
    return nodes.filter((n) => this.containsPoint(n, point));
  }

  /** Ближайший к точке узел (по расстоянию между центрами) */
  nearest(point, nodes = this.nodes) {
    let best;
    let bestDist = Infinity;
    for (const n of nodes) {
      const c = this.center(n);
      const d = (c.x - point.x) ** 2 + (c.y - point.y) ** 2;
      if (d < bestDist) {
        bestDist = d;
        best = n;
      }
    }
    return best;
  }

  // ---------- цвет ----------

  /** Нормализованный HEX без "#", в верхнем регистре (или null, если заливки нет) */
  colorOf(node) {
    if (!node.fill) return null;
    return node.fill.toUpperCase().replace('#', '');
  }

  /** Совпадает ли цвет узла с одним из вариантов (без учёта регистра/решётки) */
  colorMatches(node, variants) {
    const c = this.colorOf(node);
    if (!c) return false;
    return variants.some((v) => v.toUpperCase().replace('#', '') === c);
  }

  // ---------- метаданные из имени слоя ----------

  /**
   * Достаёт значение из имени слоя по шаблону "key=value", например
   * имя "gate_requires=+" с key="requires" вернёт "+".
   */
  static metaFromName(name, key) {
    if (!name) return null;
    const match = name.match(new RegExp(`${key}=([^_]+)`));
    return match ? match[1] : null;
  }

  /** То же самое, но сразу для узла */
  meta(node, key) {
    return ParserLunacy.metaFromName(node.name, key);
  }

  // ---------- группировка ----------

  /** Сгруппировать узлы по значению, которое вернёт селектор */
  groupBy(nodes, selector) {
    return nodes.reduce((acc, n) => {
      const key = selector(n);
      (acc[key] = acc[key] || []).push(n);
      return acc;
    }, {});
  }
}

// поддержка и ES-модулей, и CommonJS, и прямого подключения через <script>
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParserLunacy;
}
if (typeof window !== 'undefined') {
  window.ParserLunacy = ParserLunacy;
}
