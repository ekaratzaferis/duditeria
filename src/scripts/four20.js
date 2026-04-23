let U = "";
const xn = {
  AbrilFatface_Regular: { center: "/fonts/AbrilFatface_Regular.ttf" },
  Airstream: { center: "/fonts/Airstream.ttf" },
  Alata_Regular: { center: "/fonts/Alata_Regular.ttf" },
  Anton_Regular: { center: "/fonts/Anton_Regular.ttf" },
  AveriaSerif: { center: "/fonts/AveriaSerifLibre-Bold.ttf" },
  Braille: { center: "/fonts/Braille.ttf" },
  BrailleOutline: { center: "/fonts/BrailleOutline.ttf" },
  Butler_Bold: { center: "/fonts/Butler_Bold.otf" },
  DelaGothicOne_Regular: { center: "/fonts/DelaGothicOne_Regular.ttf" },
  gotham_medium: { center: "/fonts/GothamMedium.ttf" },
  gotham_regular_bold: { center: "/fonts/Gotham_Bold_Regular.ttf" },
  Jersey: { center: "/fonts/Jersey.ttf" },
  LobsterTwo: { center: "/fonts/LobsterTwo.ttf" },
  Niconne: { center: "/fonts/Niconne-Regular.ttf" },
  Pacifico_Regular: { center: "/fonts/Pacifico_Regular.ttf" },
  Pecita: { center: "/fonts/Pecita.ttf" },
  PermanentMarker: { center: "/fonts/PermanentMarker-Regular.ttf" },
  PirataOne_Regular: { center: "/fonts/PirataOne_Regular.ttf" },
  RacingSansOne_Regular: { center: "/fonts/RacingSansOne_Regular.ttf" },
  round_regular: {
    left: "/fonts/Round_Monogram_Left.ttf",
    center: "/fonts/Round_Monogram_Center.ttf",
    right: "/fonts/Round_Monogram_Right.ttf"
  },
  Shrikhand_Regular: { center: "/fonts/Shrikhand_Regular.ttf" },
  Viafont: { center: "/fonts/Viafont.ttf" },
  WorldTour: { center: "/fonts/WorldTour.ttf" },
  Yesteryear: { center: "/fonts/Yesteryear-Regular.ttf" }
}, En = {
  AbrilFatface_Regular: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: { scale: 0.95, align: "middle" }
  },
  Airstream: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: { scale: 0.9, align: "middle" }
  },
  Alata_Regular: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  Anton_Regular: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: { scale: 0.9, align: "middle" }
  },
  AveriaSerif: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  Braille: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !1,
    measurementCorrection: { scale: 0.75, align: "top" }
  },
  BrailleOutline: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !1,
    measurementCorrection: { scale: 0.75, align: "top" }
  },
  Butler_Bold: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  DelaGothicOne_Regular: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: { scale: 0.8, align: "middle" }
  },
  gotham_medium: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  gotham_regular_bold: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  Jersey: {
    supportsSpecialCharacters: !1,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  LobsterTwo: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: { scale: 0.9, align: "middle" }
  },
  Niconne: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: { scale: 0.9, align: "middle" }
  },
  Pacifico_Regular: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: { scale: 0.7, align: "middle" }
  },
  Pecita: {
    supportsSpecialCharacters: !1,
    supportsNumbers: !1,
    needsOpticalAlignment: !0,
    measurementCorrection: { scale: 0.9, align: "middle" }
  },
  PermanentMarker: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  PirataOne_Regular: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  RacingSansOne_Regular: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  round_regular: {
    supportsSpecialCharacters: !1,
    supportsNumbers: !1,
    needsOpticalAlignment: !1,
    measurementCorrection: null
  },
  Shrikhand_Regular: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  Viafont: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  WorldTour: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: null
  },
  Yesteryear: {
    supportsSpecialCharacters: !0,
    supportsNumbers: !0,
    needsOpticalAlignment: !0,
    measurementCorrection: { scale: 0.9, align: "middle" }
  }
}, nn = {};
function Vn(n) {
  U = n;
}
function Un(n, t, e) {
  nn[n] = { urls: t, meta: e };
}
function rn(n) {
  if (nn[n])
    return nn[n];
  if (xn[n]) {
    const t = xn[n], e = {};
    return t.center && (e.center = U + t.center), t.left && (e.left = U + t.left), t.right && (e.right = U + t.right), { urls: e, meta: En[n] || {} };
  }
  return null;
}
const Fn = {}, Pn = async (n) => {
  if (!("fonts" in document)) return;
  const t = rn(n);
  if (!t) return;
  const { urls: e } = t, r = "truetype";
  if (e.left && e.center && e.right) {
    const a = new FontFace(`${n}_left`, `url('${e.left}') format('${r}')`), i = new FontFace(`${n}_center`, `url('${e.center}') format('${r}')`), s = new FontFace(`${n}_right`, `url('${e.right}') format('${r}')`);
    await Promise.all([
      a.load().then((u) => document.fonts.add(u)),
      i.load().then((u) => document.fonts.add(u)),
      s.load().then((u) => document.fonts.add(u))
    ]);
  } else e.center && await new FontFace(`${n}`, `url('${e.center}') format('${r}')`).load().then((i) => document.fonts.add(i));
  return Fn[n] = !0, { name: n };
}, Dn = async (n) => Fn[n] ? { name: n } : await Pn(n), Hn = async (n) => {
  const t = rn(n);
  if (!t || !t.urls.center) return;
  const e = await fetch(t.urls.center).then((r) => r.blob());
  return await new Promise((r) => {
    const a = new FileReader();
    a.onload = async () => {
      await Pn(n), r(a.result);
    }, a.readAsDataURL(e);
  });
}, tn = async (n) => new Promise((t, e) => {
  const r = n.format || "png";
  let a = document.createElement("canvas");
  const i = a.getContext("2d"), s = new Image();
  s.crossOrigin = "Anonymous", s.onerror = function(c) {
    console.error("an error happened while loading the image..."), e(c);
  };
  const u = n.width, p = n.height;
  a.width = u, a.height = p, s.onload = function() {
    let c = s.width || u, l = s.height || p;
    c > l ? (l *= u / c, c = u) : (c *= p / l, l = p);
    const f = (u - c) / 2, m = (p - l) / 2;
    if (i.clearRect(0, 0, n.width, n.height), Gn())
      setTimeout(() => {
        i.drawImage(s, f, m, c, l), a.toBlob(() => {
          const o = a.toDataURL("image/" + r);
          a.height = 0, a.width = 0, a = void 0, t(o);
        });
      }, 1);
    else {
      i.drawImage(s, f, m, c, l);
      const o = a.toDataURL("image/" + r);
      a.height = 0, a.width = 0, a = void 0, t(o);
    }
  }, s.src = n.src;
});
function Gn() {
  const n = navigator.userAgent.toLowerCase();
  if (n.indexOf("safari") !== -1)
    return !(n.indexOf("chrome") > -1);
}
(() => {
  if (!e())
    return;
  const n = CanvasRenderingContext2D.prototype, t = n.drawImage;
  if (!t) {
    console.error("This script requires a basic implementation of drawImage");
    return;
  }
  n.drawImage = function(u, p, c) {
    if (!(arguments.length === 9))
      return t.apply(this, [...arguments]);
    const f = r(...arguments);
    if (!a(f))
      return t.apply(this, f);
  };
  function e() {
    const s = document.createElement("canvas").getContext("2d");
    s.fillRect(0, 0, 40, 40), s.drawImage(s.canvas, -40, -40, 80, 80, 50, 50, 20, 20);
    const u = s.getImageData(50, 50, 30, 30), p = new Uint32Array(u.data.buffer), c = (m, o) => p[o * u.width + m], l = [
      [9, 9],
      [20, 9],
      [9, 20],
      [20, 20]
    ], f = [
      [10, 10],
      [19, 10],
      [10, 19],
      [19, 19]
    ];
    return l.some(([m, o]) => c(m, o) !== 0) || f.some(([m, o]) => c(m, o) === 0);
  }
  function r(s, u, p, c, l, f, m, o, h) {
    const { width: d, height: x } = i(s);
    c < 0 && (u += c, c = Math.abs(c)), l < 0 && (p += l, l = Math.abs(l)), o < 0 && (f += o, o = Math.abs(o)), h < 0 && (m += h, h = Math.abs(h));
    const y = Math.max(u, 0), v = Math.min(u + c, d), w = Math.max(p, 0), k = Math.min(p + l, x), g = o / c, b = h / l;
    return [
      s,
      y,
      w,
      v - y,
      k - w,
      u < 0 ? f - u * g : f,
      p < 0 ? m - p * b : m,
      (v - y) * g,
      (k - w) * b
    ];
  }
  function a(s) {
    return [
      3,
      4,
      7,
      8
    ].some((u) => !s[u]);
  }
  function i(s) {
    const u = (p) => {
      const c = globalThis[p];
      return c && s instanceof c;
    };
    if (u("HTMLImageElement"))
      return {
        width: s.naturalWidth,
        height: s.naturalHeight
      };
    if (u("HTMLVideoElement"))
      return {
        width: s.videoWidth,
        height: s.videoHeight
      };
    if (u("SVGImageElement"))
      throw new TypeError("SVGImageElement isn't yet supported as source image.", "UnsupportedError");
    if (u("HTMLCanvasElement") || u("ImageBitmap"))
      return s;
  }
})();
const Zn = `/* eslint strict: 0 */
onmessage = function(e) {
    if (e.data.action === 'getBitamp') {

        bm = new Bitmap(e.data.argument.width, e.data.argument.height);
        postMessage({
            action: e.data.action,
            bm
        });

    } else if (e.data.action === 'setBitmap') {

        bm.data = e.data.argument.data;
        if (e.data.argument.rotationScale) {
            bm.rotationScale = e.data.argument.rotationScale;
        }

        postMessage({
            action: e.data.action,
            bm
        });

    } else if (e.data.action === 'clear') {

        clear();
        postMessage({
            action: e.data.action
        });

    } else if (e.data.action === 'setInfo') {

        info = e.data.argument;
        postMessage({
            action: e.data.action,
            bm
        });

    } else if (e.data.action === 'process') {

        process(() => {
            postMessage({
                action: e.data.action,
                bm,
                pathlist,
                boundingBox
            });
        });

    }
};

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.copy = function() {
    return new Point(this.x, this.y);
};

function Bitmap(w, h) {
    this.w = w;
    this.h = h;
    this.size = w * h;
    this.arraybuffer = new ArrayBuffer(this.size);
    this.data = new Int8Array(this.arraybuffer);
}

Bitmap.prototype.at = function(x, y) {
    return (x >= 0 && x < this.w && y >= 0 && y < this.h && this.data[this.w * y + x] === 1);
};

Bitmap.prototype.index = function(i) {
    const point = new Point();
    point.y = Math.floor(i / this.w);
    point.x = i - point.y * this.w;
    return point;
};

Bitmap.prototype.flip = function(x, y) {
    if (this.at(x, y)) {
        this.data[this.w * y + x] = 0;
    } else {
        this.data[this.w * y + x] = 1;
    }
};

Bitmap.prototype.copy = function() {
    const bm = new Bitmap(this.w, this.h);
    let i;
    for (i = 0; i < this.size; i++) {
        bm.data[i] = this.data[i];
    }
    return bm;
};

function Path() {
    this.area = 0;
    this.len = 0;
    this.curve = {};
    this.pt = [];
    this.minX = 10000000000;
    this.minY = 10000000000;
    this.maxX = -1000;
    this.maxY = -1000;
}

function Curve(n) {
    this.n = n;
    this.tag = new Array(n);
    this.c = new Array(n * 3);
    this.alphaCurve = 0;
    this.vertex = new Array(n);
    this.alpha = new Array(n);
    this.alpha0 = new Array(n);
    this.beta = new Array(n);
}

let bm = null;
let boundingBox = null;
let pathlist = [];
let info = undefined;

function bmToPathlist() {
    const bm1 = bm.copy();
    let currentPoint = new Point(0, 0);
    let path;

    // bm.opticalCenter = {
    //     c: 0,
    //     xs: 0,
    //     ys: 0
    // };

    function findNext(point) {
        let i = bm1.w * point.y + point.x;
        while (i < bm1.size && bm1.data[i] !== 1) {
            i++;
        }
        return i < bm1.size && bm1.index(i);
    }

    function majority(x, y) {
        let i;
        let a;
        let ct;
        for (i = 2; i < 5; i++) {
            ct = 0;
            for (a = -i + 1; a <= i - 1; a++) {
                ct += bm1.at(x + a, y + i - 1) ? 1 : -1;
                ct += bm1.at(x + i - 1, y + a - 1) ? 1 : -1;
                ct += bm1.at(x + a - 1, y - i) ? 1 : -1;
                ct += bm1.at(x - i, y + a) ? 1 : -1;
            }
            if (ct > 0) {
                return 1;
            } else if (ct < 0) {
                return 0;
            }
        }
        return 0;
    }

    function findPath(point) {
        const path = new Path();
        let x = point.x;
        let y = point.y;
        let dirx = 0;
        let diry = 1;
        let tmp;

        path.sign = bm.at(point.x, point.y) ? '+' : '-';

        // eslint-disable-next-line
    	while (1) {
            // bm.opticalCenter.c++;
            // bm.opticalCenter.xs += x;
            // bm.opticalCenter.ys += y;

            path.pt.push(new Point(x, y));

            if (x > path.maxX) {
                path.maxX = x;
            }
            if (x < path.minX) {
                path.minX = x;
            }
            if (y > path.maxY) {
                path.maxY = y;
            }
            if (y < path.minY) {
                path.minY = y;
            }
            path.len++;

            x += dirx;
            y += diry;
            path.area -= x * diry;

            if (x === point.x && y === point.y) {
                break;
            }

            const l = bm1.at(x + (dirx + diry - 1) / 2, y + (diry - dirx - 1) / 2);
            const r = bm1.at(x + (dirx - diry - 1) / 2, y + (diry + dirx - 1) / 2);

            if (r && !l) {
                if (info.turnpolicy === 'right' || (info.turnpolicy === 'black' && path.sign === '+') || (info.turnpolicy === 'white' && path.sign === '-') || (info.turnpolicy === 'majority' && majority(x, y)) || (info.turnpolicy === 'minority' && !majority(x, y))) {
                    tmp = dirx;
                    dirx = -diry;
                    diry = tmp;
                } else {
                    tmp = dirx;
                    dirx = diry;
                    diry = -tmp;
                }
            } else if (r) {
                tmp = dirx;
                dirx = -diry;
                diry = tmp;
            } else if (!l) {
                tmp = dirx;
                dirx = diry;
                diry = -tmp;
            }
        }
        return path;
    }

    function xorPath(path) {
        let y1 = path.pt[0].y;
        const len = path.len;
        let x;
        let y;
        let maxX;
        let minY;
        let i;
        let j;
        for (i = 1; i < len; i++) {
            x = path.pt[i].x;
            y = path.pt[i].y;

            if (y !== y1) {
                minY = y1 < y ? y1 : y;
                maxX = path.maxX;
                for (j = x; j < maxX; j++) {
                    bm1.flip(j, minY);
                }
                y1 = y;
            }
        }
    }

    while ((currentPoint = findNext(currentPoint))) {
        path = findPath(currentPoint);

        xorPath(path);

        if (path.area > info.turdsize) {
            pathlist.push(path);
        }
    }

    function rectangularContain(path1, path2) {
        return (path1.maxX <= path2.maxX && path1.maxY <= path2.maxY && path1.minX >= path2.minX && path1.minY >= path2.minY);
    }

    function scanContain(smallArea, largeArea) {
        let contained = false;
        const step = Math.max(1, parseInt((smallArea.maxY - smallArea.minY) / 5));

        for (let y = smallArea.minY; y < smallArea.maxY; y = y + step) {
            const smallAreaXs = smallArea.pt.filter(p => p.y === y).map(p => {
                p.name = 'small';
                return p;
            });

            const largeAreaXs = largeArea.pt.filter(p => p.y === y).map(p => {
                p.name = 'large';
                return p;
            });

            const xs = largeAreaXs.concat(smallAreaXs).sort((a, b) => (a.x > b.x ? 1 : b.x > a.x ? -1 : 0));

            let scanning = false;
            for (let i = 0; i < xs.length; i++) {
                if (i - 1 >= 0 && xs[i].x - 1 === xs[i - 1].x) {
                    continue; // ignore consecutive points //
                } else {
                    if (!scanning) {
                        if (xs[i].name === 'large') scanning = true;
                    } else {
                        if (xs[i].name === 'small') {
                            contained = true;
                            break;
                        } else {
                            scanning = false;
                        }
                    }
                }
            }
            if (contained === true) break;
        }
        return contained;
    }

    // Check if path1 is contained in path2 //
    function isContained(path1, path2) {
        if (rectangularContain(path1, path2)) {
            return scanContain(path1, path2);
        } else return false;
    }

    // Check if the given path describes a hole based on the rotation //
    function isHole(path) {
        return path.sign === '-';
    }

    // Check if a hole is contained to any other shape //
    function isOrphanHole(i, list) {
        let orphan = true;
        for (let j = 0; j < list.length; j++) {
            if (j === i || isHole(list[j])) continue;
            if (isContained(list[i], list[j])) {
                orphan = false;
            }
        }
        return orphan;
    }

    function isOrphanSolid(i, list) {
        if (isHole(list[i])) return false;

        let orphan = true;
        for (let j = 0; j < list.length; j++) {
            if (j === i) continue;
            if (isHole(list[j]) && isContained(list[i], list[j])) {
                orphan = false;
            }
        }
        return orphan;
    }

    // Rearrange paths for better hole-cutting //
    function rearrangePaths(list, newList) {
        // ThreeJS expects to find orphan holes in certain order //
        // When we invert (solids are now holes) they should be right after the hole they belong too //
        // When we don't, they should right after the solids that they belong too //

        for (let i = 0; i < list.length; i++) {
            if (info.invert) {
                if (isOrphanSolid(i, list)) {
                    newList.push(list[i]);
                    list[i].toDelete = true;
                }
            } else {
                if (isHole(list[i]) && isOrphanHole(i, list)) {
                    newList.push(list[i]);
                    list[i].toDelete = true;
                }
            }
        }

        // Remove the shapes that we detected above //
        list = list.filter(l => !l.toDelete);

        // Pop the next shape (it should be an outer shape since potrace places them by scanning from the top left to the bottom right corner) //
        if (list.length) {
            newList.push(list[0]);
            list.splice(0, 1);
        }

        // Restart if we have more shapes on the list //
        if (list.length) {
            rearrangePaths(list, newList);
        }
    }

    // Construct the bounding box of a pathlist //
    function getBoundingBox(pathlist) {
        const bb = {
            minX: pathlist[0].minX,
            minY: pathlist[0].minY,
            maxX: pathlist[0].maxX,
            maxY: pathlist[0].maxY
        };

        for (const path of pathlist) {
            if (path.maxX > bb.maxX) bb.maxX = path.maxX;
            if (path.maxY > bb.maxY) bb.maxY = path.maxY;
            if (path.minX < bb.minX) bb.minX = path.minX;
            if (path.minY < bb.minY) bb.minY = path.minY;
        }

        bb.width = bb.maxX - bb.minX;
        bb.height = bb.maxY - bb.minY;
        bb.center = {
            x: (bb.minX + bb.maxX) / 2,
            y: (bb.minY + bb.maxY) / 2
        };

        return bb;
    }

    const newPathList = [];
    // Re-arrange to ensure correct solid/hole order //
    rearrangePaths(pathlist, newPathList, pathlist.length);

    // Reassign list //
    pathlist = newPathList;
    // console.debug(JSON.stringify(pathlist[0])); // DON'T DELETE THIS. it is for getting outline

    if (pathlist.length > 0) {
        boundingBox = getBoundingBox(pathlist);

        // calculate the optical center before trimming //
        // pathlist.translationForOpticalCenter = {
        //     x: boundingBox.center.x - (bm.opticalCenter.xs / bm.opticalCenter.c),
        //     y: boundingBox.center.y - (bm.opticalCenter.ys / bm.opticalCenter.c)
        // };

        // trim whitespace from image //
        if (info.trimWhiteSpace) {
            for (let i = 0; i < pathlist.length; i++) {
                for (let j = 0; j < pathlist[i].pt.length; j++) {
                    pathlist[i].pt[j].x -= boundingBox.minX;
                    pathlist[i].pt[j].y -= boundingBox.minY;
                }

                pathlist[i].minX = 0;
                pathlist[i].minY = 0;
                pathlist[i].maxX = boundingBox.width;
                pathlist[i].maxY = boundingBox.height;
            }

            // recalculate
            boundingBox = getBoundingBox(pathlist);
        }
    }
}

function processPath() {
    function Quad() {
        this.data = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ];
    }

    Quad.prototype.at = function(x, y) {
        return this.data[x * 3 + y];
    };

    function Sum(x, y, xy, x2, y2) {
        this.x = x;
        this.y = y;
        this.xy = xy;
        this.x2 = x2;
        this.y2 = y2;
    }

    function mod(a, n) {
        return a >= n ? a % n : a >= 0 ? a : n - 1 - ((-1 - a) % n);
    }

    function xprod(p1, p2) {
        return p1.x * p2.y - p1.y * p2.x;
    }

    function cyclic(a, b, c) {
        if (a <= c) {
            return a <= b && b < c;
        } else {
            return a <= b || b < c;
        }
    }

    function sign(i) {
        return i > 0 ? 1 : i < 0 ? -1 : 0;
    }

    function quadform(Q, w) {
        const v = new Array(3);
        let i;
        let j;
        let sum;

        v[0] = w.x;
        v[1] = w.y;
        v[2] = 1;
        sum = 0.0;

        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                sum += v[i] * Q.at(i, j) * v[j];
            }
        }
        return sum;
    }

    function interval(lambda, a, b) {
        const res = new Point();

        res.x = a.x + lambda * (b.x - a.x);
        res.y = a.y + lambda * (b.y - a.y);
        return res;
    }

    // eslint-disable-next-line
	function dorth_infty(p0, p2) {
        const r = new Point();

        r.y = sign(p2.x - p0.x);
        r.x = -sign(p2.y - p0.y);

        return r;
    }

    function ddenom(p0, p2) {
        const r = dorth_infty(p0, p2);

        return r.y * (p2.x - p0.x) - r.x * (p2.y - p0.y);
    }

    function dpara(p0, p1, p2) {
        const x1 = p1.x - p0.x;
        const y1 = p1.y - p0.y;
        const x2 = p2.x - p0.x;
        const y2 = p2.y - p0.y;

        return x1 * y2 - x2 * y1;
    }

    function cprod(p0, p1, p2, p3) {
        const x1 = p1.x - p0.x;
        const y1 = p1.y - p0.y;
        const x2 = p3.x - p2.x;
        const y2 = p3.y - p2.y;

        return x1 * y2 - x2 * y1;
    }

    function iprod(p0, p1, p2) {
        const x1 = p1.x - p0.x;
        const y1 = p1.y - p0.y;
        const x2 = p2.x - p0.x;
        const y2 = p2.y - p0.y;

        return x1 * x2 + y1 * y2;
    }

    function iprod1(p0, p1, p2, p3) {
        const x1 = p1.x - p0.x;
        const y1 = p1.y - p0.y;
        const x2 = p3.x - p2.x;
        const y2 = p3.y - p2.y;

        return x1 * x2 + y1 * y2;
    }

    function ddist(p, q) {
        return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y));
    }

    function bezier(t, p0, p1, p2, p3) {
        const s = 1 - t;
        const res = new Point();

        res.x = s * s * s * p0.x + 3 * (s * s * t) * p1.x + 3 * (t * t * s) * p2.x + t * t * t * p3.x;
        res.y = s * s * s * p0.y + 3 * (s * s * t) * p1.y + 3 * (t * t * s) * p2.y + t * t * t * p3.y;

        return res;
    }

    function tangent(p0, p1, p2, p3, q0, q1) {
        const A = cprod(p0, p1, q0, q1);
        const B = cprod(p1, p2, q0, q1);
        const C = cprod(p2, p3, q0, q1);

        const a = A - 2 * B + C;
        const b = -2 * A + 2 * B;
        const c = A;
        const d = b * b - 4 * a * c;

        if (a === 0 || d < 0) {
            return -1.0;
        }

        const s = Math.sqrt(d);

        const r1 = (-b + s) / (2 * a);
        const r2 = (-b - s) / (2 * a);

        if (r1 >= 0 && r1 <= 1) {
            return r1;
        } else if (r2 >= 0 && r2 <= 1) {
            return r2;
        } else {
            return -1.0;
        }
    }

    function calcSums(path) {
        let i;
        let x;
        let y;
        path.x0 = path.pt[0].x;
        path.y0 = path.pt[0].y;

        path.sums = [];
        const s = path.sums;
        s.push(new Sum(0, 0, 0, 0, 0));
        for (i = 0; i < path.len; i++) {
            x = path.pt[i].x - path.x0;
            y = path.pt[i].y - path.y0;
            s.push(new Sum(s[i].x + x, s[i].y + y, s[i].xy + x * y, s[i].x2 + x * x, s[i].y2 + y * y));
        }
    }

    function calcLon(path) {
        const n = path.len;
        const pt = path.pt;
        let dir;
        const pivk = new Array(n);
        const nc = new Array(n);
        const ct = new Array(4);
        path.lon = new Array(n);

        const constraint = [new Point(), new Point()];
        const cur = new Point();
        const off = new Point();
        const dk = new Point();
        let foundk;

        let i;
        let j;
        let k1;
        let a;
        let b;
        let c;
        let d;
        let k = 0;
        for (i = n - 1; i >= 0; i--) {
            if (pt[i].x !== pt[k].x && pt[i].y !== pt[k].y) {
                k = i + 1;
            }
            nc[i] = k;
        }

        for (i = n - 1; i >= 0; i--) {
            ct[0] = ct[1] = ct[2] = ct[3] = 0;
            dir = (3 + 3 * (pt[mod(i + 1, n)].x - pt[i].x) + (pt[mod(i + 1, n)].y - pt[i].y)) / 2;
            ct[dir]++;

            constraint[0].x = 0;
            constraint[0].y = 0;
            constraint[1].x = 0;
            constraint[1].y = 0;

            k = nc[i];
            k1 = i;

            // eslint-disable-next-line
      		while (1) {
                foundk = 0;
                dir = (3 + 3 * sign(pt[k].x - pt[k1].x) + sign(pt[k].y - pt[k1].y)) / 2;
                ct[dir]++;

                if (ct[0] && ct[1] && ct[2] && ct[3]) {
                    pivk[i] = k1;
                    foundk = 1;
                    break;
                }

                cur.x = pt[k].x - pt[i].x;
                cur.y = pt[k].y - pt[i].y;

                if (xprod(constraint[0], cur) < 0 || xprod(constraint[1], cur) > 0) {
                    break;
                }

                if (Math.abs(cur.x) <= 1 && Math.abs(cur.y) <= 1) {
                    //
                } else {
                    off.x = cur.x + (cur.y >= 0 && (cur.y > 0 || cur.x < 0) ? 1 : -1);
                    off.y = cur.y + (cur.x <= 0 && (cur.x < 0 || cur.y < 0) ? 1 : -1);
                    if (xprod(constraint[0], off) >= 0) {
                        constraint[0].x = off.x;
                        constraint[0].y = off.y;
                    }
                    off.x = cur.x + (cur.y <= 0 && (cur.y < 0 || cur.x < 0) ? 1 : -1);
                    off.y = cur.y + (cur.x >= 0 && (cur.x > 0 || cur.y < 0) ? 1 : -1);
                    if (xprod(constraint[1], off) <= 0) {
                        constraint[1].x = off.x;
                        constraint[1].y = off.y;
                    }
                }
                k1 = k;
                k = nc[k1];
                if (!cyclic(k, i, k1)) {
                    break;
                }
            }

            if (foundk === 0) {
                dk.x = sign(pt[k].x - pt[k1].x);
                dk.y = sign(pt[k].y - pt[k1].y);
                cur.x = pt[k1].x - pt[i].x;
                cur.y = pt[k1].y - pt[i].y;

                a = xprod(constraint[0], cur);
                b = xprod(constraint[0], dk);
                c = xprod(constraint[1], cur);
                d = xprod(constraint[1], dk);

                j = 10000000;
                if (b < 0) {
                    j = Math.floor(a / -b);
                }
                if (d > 0) {
                    j = Math.min(j, Math.floor(-c / d));
                }
                pivk[i] = mod(k1 + j, n);
            }
        }

        j = pivk[n - 1];
        path.lon[n - 1] = j;
        for (i = n - 2; i >= 0; i--) {
            if (cyclic(i + 1, pivk[i], j)) {
                j = pivk[i];
            }
            path.lon[i] = j;
        }

        for (i = n - 1; cyclic(mod(i + 1, n), j, path.lon[i]); i--) {
            path.lon[i] = j;
        }
    }

    function bestPolygon(path) {
        function penalty3(path, i, j) {
            const n = path.len;
            const pt = path.pt;
            const sums = path.sums;
            let x;
            let y;
            let xy;
            let x2;
            let y2;
            let k;
            let r = 0;

            if (j >= n) {
                j -= n;
                r = 1;
            }

            if (r === 0) {
                x = sums[j + 1].x - sums[i].x;
                y = sums[j + 1].y - sums[i].y;
                x2 = sums[j + 1].x2 - sums[i].x2;
                xy = sums[j + 1].xy - sums[i].xy;
                y2 = sums[j + 1].y2 - sums[i].y2;
                k = j + 1 - i;
            } else {
                x = sums[j + 1].x - sums[i].x + sums[n].x;
                y = sums[j + 1].y - sums[i].y + sums[n].y;
                x2 = sums[j + 1].x2 - sums[i].x2 + sums[n].x2;
                xy = sums[j + 1].xy - sums[i].xy + sums[n].xy;
                y2 = sums[j + 1].y2 - sums[i].y2 + sums[n].y2;
                k = j + 1 - i + n;
            }

            const px = (pt[i].x + pt[j].x) / 2.0 - pt[0].x;
            const py = (pt[i].y + pt[j].y) / 2.0 - pt[0].y;
            const ey = pt[j].x - pt[i].x;
            const ex = -(pt[j].y - pt[i].y);

            const a = (x2 - 2 * x * px) / k + px * px;
            const b = (xy - x * py - y * px) / k + px * py;
            const c = (y2 - 2 * y * py) / k + py * py;

            const s = ex * ex * a + 2 * ex * ey * b + ey * ey * c;

            return Math.sqrt(s);
        }

        let i;
        let j;
        let k;
        const n = path.len;
        const pen = new Array(n + 1);
        const prev = new Array(n + 1);
        const clip0 = new Array(n);
        const clip1 = new Array(n + 1);
        const seg0 = new Array(n + 1);
        const seg1 = new Array(n + 1);
        let thispen;
        let best;
        let c;

        for (i = 0; i < n; i++) {
            c = mod(path.lon[mod(i - 1, n)] - 1, n);
            if (c === i) {
                c = mod(i + 1, n);
            }
            if (c < i) {
                clip0[i] = n;
            } else {
                clip0[i] = c;
            }
        }

        j = 1;
        for (i = 0; i < n; i++) {
            while (j <= clip0[i]) {
                clip1[j] = i;
                j++;
            }
        }

        i = 0;
        for (j = 0; i < n; j++) {
            seg0[j] = i;
            i = clip0[i];
        }
        seg0[j] = n;
        const m = j;

        i = n;
        for (j = m; j > 0; j--) {
            seg1[j] = i;
            i = clip1[i];
        }
        seg1[0] = 0;

        pen[0] = 0;
        for (j = 1; j <= m; j++) {
            for (i = seg1[j]; i <= seg0[j]; i++) {
                best = -1;
                for (k = seg0[j - 1]; k >= clip1[i]; k--) {
                    thispen = penalty3(path, k, i) + pen[k];
                    if (best < 0 || thispen < best) {
                        prev[i] = k;
                        best = thispen;
                    }
                }
                pen[i] = best;
            }
        }
        path.m = m;
        path.po = new Array(m);

        for (i = n, j = m - 1; i > 0; j--) {
            i = prev[i];
            path.po[j] = i;
        }
    }

    function adjustVertices(path) {
        function pointslope(path, i, j, ctr, dir) {
            const n = path.len;
            const sums = path.sums;
            let a;
            let c;
            let l;
            let r = 0;

            while (j >= n) {
                j -= n;
                r += 1;
            }
            while (i >= n) {
                i -= n;
                r -= 1;
            }
            while (j < 0) {
                j += n;
                r -= 1;
            }
            while (i < 0) {
                i += n;
                r += 1;
            }

            const x = sums[j + 1].x - sums[i].x + r * sums[n].x;
            const y = sums[j + 1].y - sums[i].y + r * sums[n].y;
            const x2 = sums[j + 1].x2 - sums[i].x2 + r * sums[n].x2;
            const xy = sums[j + 1].xy - sums[i].xy + r * sums[n].xy;
            const y2 = sums[j + 1].y2 - sums[i].y2 + r * sums[n].y2;
            const k = j + 1 - i + r * n;

            ctr.x = x / k;
            ctr.y = y / k;

            a = (x2 - (x * x) / k) / k;
            const b = (xy - (x * y) / k) / k;
            c = (y2 - (y * y) / k) / k;

            const lambda2 = (a + c + Math.sqrt((a - c) * (a - c) + 4 * b * b)) / 2;

            a -= lambda2;
            c -= lambda2;

            if (Math.abs(a) >= Math.abs(c)) {
                l = Math.sqrt(a * a + b * b);
                if (l !== 0) {
                    dir.x = -b / l;
                    dir.y = a / l;
                }
            } else {
                l = Math.sqrt(c * c + b * b);
                if (l !== 0) {
                    dir.x = -c / l;
                    dir.y = b / l;
                }
            }
            if (l === 0) {
                dir.x = dir.y = 0;
            }
        }

        const m = path.m;
        const po = path.po;
        const n = path.len;
        const pt = path.pt;
        const x0 = path.x0;
        const y0 = path.y0;
        const ctr = new Array(m);
        const dir = new Array(m);
        const q = new Array(m);
        const v = new Array(3);
        let d;
        let i;
        let j;
        let k;
        let l;
        const s = new Point();

        path.curve = new Curve(m);

        for (i = 0; i < m; i++) {
            j = po[mod(i + 1, m)];
            j = mod(j - po[i], n) + po[i];
            ctr[i] = new Point();
            dir[i] = new Point();
            pointslope(path, po[i], j, ctr[i], dir[i]);
        }

        for (i = 0; i < m; i++) {
            q[i] = new Quad();
            d = dir[i].x * dir[i].x + dir[i].y * dir[i].y;
            if (d === 0.0) {
                for (j = 0; j < 3; j++) {
                    for (k = 0; k < 3; k++) {
                        q[i].data[j * 3 + k] = 0;
                    }
                }
            } else {
                v[0] = dir[i].y;
                v[1] = -dir[i].x;
                v[2] = -v[1] * ctr[i].y - v[0] * ctr[i].x;
                for (l = 0; l < 3; l++) {
                    for (k = 0; k < 3; k++) {
                        q[i].data[l * 3 + k] = (v[l] * v[k]) / d;
                    }
                }
            }
        }

        let Q;
        let w;
        let dx;
        let dy;
        let det;
        let min;
        let cand;
        let xmin;
        let ymin;
        let z;
        for (i = 0; i < m; i++) {
            Q = new Quad();
            w = new Point();

            s.x = pt[po[i]].x - x0;
            s.y = pt[po[i]].y - y0;

            j = mod(i - 1, m);

            for (l = 0; l < 3; l++) {
                for (k = 0; k < 3; k++) {
                    Q.data[l * 3 + k] = q[j].at(l, k) + q[i].at(l, k);
                }
            }

            // eslint-disable-next-line
      		while (1) {
                det = Q.at(0, 0) * Q.at(1, 1) - Q.at(0, 1) * Q.at(1, 0);
                if (det !== 0.0) {
                    w.x = (-Q.at(0, 2) * Q.at(1, 1) + Q.at(1, 2) * Q.at(0, 1)) / det;
                    w.y = (Q.at(0, 2) * Q.at(1, 0) - Q.at(1, 2) * Q.at(0, 0)) / det;
                    break;
                }

                if (Q.at(0, 0) > Q.at(1, 1)) {
                    v[0] = -Q.at(0, 1);
                    v[1] = Q.at(0, 0);
                } else if (Q.at(1, 1)) {
                    v[0] = -Q.at(1, 1);
                    v[1] = Q.at(1, 0);
                } else {
                    v[0] = 1;
                    v[1] = 0;
                }
                d = v[0] * v[0] + v[1] * v[1];
                v[2] = -v[1] * s.y - v[0] * s.x;
                for (l = 0; l < 3; l++) {
                    for (k = 0; k < 3; k++) {
                        Q.data[l * 3 + k] += (v[l] * v[k]) / d;
                    }
                }
            }
            dx = Math.abs(w.x - s.x);
            dy = Math.abs(w.y - s.y);
            if (dx <= 0.5 && dy <= 0.5) {
                path.curve.vertex[i] = new Point(w.x + x0, w.y + y0);
                continue;
            }

            min = quadform(Q, s);
            xmin = s.x;
            ymin = s.y;

            if (Q.at(0, 0) !== 0.0) {
                for (z = 0; z < 2; z++) {
                    w.y = s.y - 0.5 + z;
                    w.x = -(Q.at(0, 1) * w.y + Q.at(0, 2)) / Q.at(0, 0);
                    dx = Math.abs(w.x - s.x);
                    cand = quadform(Q, w);
                    if (dx <= 0.5 && cand < min) {
                        min = cand;
                        xmin = w.x;
                        ymin = w.y;
                    }
                }
            }

            if (Q.at(1, 1) !== 0.0) {
                for (z = 0; z < 2; z++) {
                    w.x = s.x - 0.5 + z;
                    w.y = -(Q.at(1, 0) * w.x + Q.at(1, 2)) / Q.at(1, 1);
                    dy = Math.abs(w.y - s.y);
                    cand = quadform(Q, w);
                    if (dy <= 0.5 && cand < min) {
                        min = cand;
                        xmin = w.x;
                        ymin = w.y;
                    }
                }
            }

            for (l = 0; l < 2; l++) {
                for (k = 0; k < 2; k++) {
                    w.x = s.x - 0.5 + l;
                    w.y = s.y - 0.5 + k;
                    cand = quadform(Q, w);
                    if (cand < min) {
                        min = cand;
                        xmin = w.x;
                        ymin = w.y;
                    }
                }
            }

            path.curve.vertex[i] = new Point(xmin + x0, ymin + y0);
        }
    }

    function reverse(path) {
        const curve = path.curve;
        const m = curve.n;
        const v = curve.vertex;
        let i;
        let j;
        let tmp;

        for (i = 0, j = m - 1; i < j; i++, j--) {
            tmp = v[i];
            v[i] = v[j];
            v[j] = tmp;
        }
    }

    function smooth(path) {
        const m = path.curve.n;
        const curve = path.curve;

        let i;
        let j;
        let k;
        let dd;
        let denom;
        let alpha;
        let p2;
        let p3;
        let p4;

        for (i = 0; i < m; i++) {
            j = mod(i + 1, m);
            k = mod(i + 2, m);
            p4 = interval(1 / 2.0, curve.vertex[k], curve.vertex[j]);

            denom = ddenom(curve.vertex[i], curve.vertex[k]);
            if (denom !== 0.0) {
                dd = dpara(curve.vertex[i], curve.vertex[j], curve.vertex[k]) / denom;
                dd = Math.abs(dd);
                alpha = dd > 1 ? 1 - 1.0 / dd : 0;
                alpha = alpha / 0.75;
            } else {
                alpha = 4 / 3.0;
            }
            curve.alpha0[j] = alpha;

            if (alpha >= info.alphamax) {
                curve.tag[j] = 'CORNER';
                curve.c[3 * j + 1] = curve.vertex[j];
                curve.c[3 * j + 2] = p4;
            } else {
                if (alpha < 0.55) {
                    alpha = 0.55;
                } else if (alpha > 1) {
                    alpha = 1;
                }
                p2 = interval(0.5 + 0.5 * alpha, curve.vertex[i], curve.vertex[j]);
                p3 = interval(0.5 + 0.5 * alpha, curve.vertex[k], curve.vertex[j]);
                curve.tag[j] = 'CURVE';
                curve.c[3 * j + 0] = p2;
                curve.c[3 * j + 1] = p3;
                curve.c[3 * j + 2] = p4;
            }
            curve.alpha[j] = alpha;
            curve.beta[j] = 0.5;
        }
        curve.alphacurve = 1;
    }

    function optiCurve(path) {
        function Opti() {
            this.pen = 0;
            this.c = [new Point(), new Point()];
            this.t = 0;
            this.s = 0;
            this.alpha = 0;
        }

        function optiPenalty(path, i, j, res, opttolerance, convc, areac) {
            const m = path.curve.n;
            const curve = path.curve;
            const vertex = curve.vertex;
            let k;
            let k2;
            let area;
            let d;
            let d1;
            let d2;
            let p1;
            let p2;
            let pt;
            let t;
            let k1;

            if (i === j) {
                return 1;
            }

            k = i;
            const i1 = mod(i + 1, m);
            k1 = mod(k + 1, m);
            const conv = convc[k1];
            if (conv === 0) {
                return 1;
            }
            d = ddist(vertex[i], vertex[i1]);
            for (k = k1; k !== j; k = k1) {
                k1 = mod(k + 1, m);
                k2 = mod(k + 2, m);
                if (convc[k1] !== conv) {
                    return 1;
                }
                if (sign(cprod(vertex[i], vertex[i1], vertex[k1], vertex[k2])) !== conv) {
                    return 1;
                }

                if (iprod1(vertex[i], vertex[i1], vertex[k1], vertex[k2]) < d * ddist(vertex[k1], vertex[k2]) * -0.999847695156) {
                    return 1;
                }
            }

            const p0 = curve.c[mod(i, m) * 3 + 2].copy();
            p1 = vertex[mod(i + 1, m)].copy();
            p2 = vertex[mod(j, m)].copy();
            const p3 = curve.c[mod(j, m) * 3 + 2].copy();

            area = areac[j] - areac[i];
            area -= dpara(vertex[0], curve.c[i * 3 + 2], curve.c[j * 3 + 2]) / 2;
            if (i >= j) {
                area += areac[m];
            }

            const A1 = dpara(p0, p1, p2);
            const A2 = dpara(p0, p1, p3);
            const A3 = dpara(p0, p2, p3);
            const A4 = A1 + A3 - A2;

            if (A2 === A1) {
                return 1;
            }

            t = A3 / (A3 - A4);
            const s = A2 / (A2 - A1);
            const A = (A2 * t) / 2.0;

            if (A === 0.0) {
                return 1;
            }

            const R = area / A;
            const alpha = 2 - Math.sqrt(4 - R / 0.3);

            res.c[0] = interval(t * alpha, p0, p1);
            res.c[1] = interval(s * alpha, p3, p2);
            res.alpha = alpha;
            res.t = t;
            res.s = s;

            p1 = res.c[0].copy();
            p2 = res.c[1].copy();

            res.pen = 0;

            for (k = mod(i + 1, m); k !== j; k = k1) {
                k1 = mod(k + 1, m);
                t = tangent(p0, p1, p2, p3, vertex[k], vertex[k1]);
                if (t < -0.5) {
                    return 1;
                }
                pt = bezier(t, p0, p1, p2, p3);
                d = ddist(vertex[k], vertex[k1]);
                if (d === 0.0) {
                    return 1;
                }
                d1 = dpara(vertex[k], vertex[k1], pt) / d;
                if (Math.abs(d1) > opttolerance) {
                    return 1;
                }
                if (iprod(vertex[k], vertex[k1], pt) < 0 || iprod(vertex[k1], vertex[k], pt) < 0) {
                    return 1;
                }
                res.pen += d1 * d1;
            }

            for (k = i; k !== j; k = k1) {
                k1 = mod(k + 1, m);
                t = tangent(p0, p1, p2, p3, curve.c[k * 3 + 2], curve.c[k1 * 3 + 2]);
                if (t < -0.5) {
                    return 1;
                }
                pt = bezier(t, p0, p1, p2, p3);
                d = ddist(curve.c[k * 3 + 2], curve.c[k1 * 3 + 2]);
                if (d === 0.0) {
                    return 1;
                }
                d1 = dpara(curve.c[k * 3 + 2], curve.c[k1 * 3 + 2], pt) / d;
                d2 = dpara(curve.c[k * 3 + 2], curve.c[k1 * 3 + 2], vertex[k1]) / d;
                d2 *= 0.75 * curve.alpha[k1];
                if (d2 < 0) {
                    d1 = -d1;
                    d2 = -d2;
                }
                if (d1 < d2 - opttolerance) {
                    return 1;
                }
                if (d1 < d2) {
                    res.pen += (d1 - d2) * (d1 - d2);
                }
            }

            return 0;
        }

        const curve = path.curve;
        const m = curve.n;
        const vert = curve.vertex;
        const pt = new Array(m + 1);
        const pen = new Array(m + 1);
        const len = new Array(m + 1);
        const opt = new Array(m + 1);
        let i;
        let j;
        let r;
        let o = new Opti();
        let i1;
        let area;
        let alpha;

        const convc = new Array(m);
        const areac = new Array(m + 1);

        for (i = 0; i < m; i++) {
            if (curve.tag[i] === 'CURVE') {
                convc[i] = sign(
                    dpara(vert[mod(i - 1, m)], vert[i], vert[mod(i + 1, m)])
                );
            } else {
                convc[i] = 0;
            }
        }

        area = 0.0;
        areac[0] = 0.0;
        const p0 = curve.vertex[0];
        for (i = 0; i < m; i++) {
            i1 = mod(i + 1, m);
            if (curve.tag[i1] === 'CURVE') {
                alpha = curve.alpha[i1];
                area += (0.3 * alpha * (4 - alpha) * dpara(curve.c[i * 3 + 2], vert[i1], curve.c[i1 * 3 + 2])) / 2;
                area += dpara(p0, curve.c[i * 3 + 2], curve.c[i1 * 3 + 2]) / 2;
            }
            areac[i + 1] = area;
        }

        pt[0] = -1;
        pen[0] = 0;
        len[0] = 0;

        for (j = 1; j <= m; j++) {
            pt[j] = j - 1;
            pen[j] = pen[j - 1];
            len[j] = len[j - 1] + 1;

            for (i = j - 2; i >= 0; i--) {
                r = optiPenalty(path, i, mod(j, m), o, info.opttolerance, convc, areac);
                if (r) {
                    break;
                }
                if (len[j] > len[i] + 1 || (len[j] === len[i] + 1 && pen[j] > pen[i] + o.pen)) {
                    pt[j] = i;
                    pen[j] = pen[i] + o.pen;
                    len[j] = len[i] + 1;
                    opt[j] = o;
                    o = new Opti();
                }
            }
        }
        const om = len[m];
        const ocurve = new Curve(om);
        const s = new Array(om);
        const t = new Array(om);

        j = m;
        for (i = om - 1; i >= 0; i--) {
            if (pt[j] === j - 1) {
                ocurve.tag[i] = curve.tag[mod(j, m)];
                ocurve.c[i * 3 + 0] = curve.c[mod(j, m) * 3 + 0];
                ocurve.c[i * 3 + 1] = curve.c[mod(j, m) * 3 + 1];
                ocurve.c[i * 3 + 2] = curve.c[mod(j, m) * 3 + 2];
                ocurve.vertex[i] = curve.vertex[mod(j, m)];
                ocurve.alpha[i] = curve.alpha[mod(j, m)];
                ocurve.alpha0[i] = curve.alpha0[mod(j, m)];
                ocurve.beta[i] = curve.beta[mod(j, m)];
                s[i] = t[i] = 1.0;
            } else {
                ocurve.tag[i] = 'CURVE';
                ocurve.c[i * 3 + 0] = opt[j].c[0];
                ocurve.c[i * 3 + 1] = opt[j].c[1];
                ocurve.c[i * 3 + 2] = curve.c[mod(j, m) * 3 + 2];
                ocurve.vertex[i] = interval(
                    opt[j].s,
                    curve.c[mod(j, m) * 3 + 2],
                    vert[mod(j, m)]
                );
                ocurve.alpha[i] = opt[j].alpha;
                ocurve.alpha0[i] = opt[j].alpha;
                s[i] = opt[j].s;
                t[i] = opt[j].t;
            }
            j = pt[j];
        }

        for (i = 0; i < om; i++) {
            i1 = mod(i + 1, om);
            ocurve.beta[i] = s[i] / (s[i] + t[i1]);
        }
        ocurve.alphacurve = 1;
        path.curve = ocurve;
    }

    for (let i = 0; i < pathlist.length; i++) {
        const path = pathlist[i];
        calcSums(path);
        calcLon(path);
        bestPolygon(path);
        adjustVertices(path);

        if (path.sign === '-') {
            reverse(path);
        }

        smooth(path);

        if (info.optcurve) {
            optiCurve(path);
        }
    }
}

function process(callback) {
    bmToPathlist();
    processPath();
    callback();
}

function clear() {
    bm = null;
    pathlist = [];
}`;
var Jn = /,?([a-z]),?/gi, gn = parseFloat, j = Math, $ = j.PI, P = j.min, B = j.max, yn = j.pow, O = j.abs, Kn = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?[\s]*,?[\s]*)+)/ig, nt = /(-?\d*\.?\d*(?:e[-+]?\d+)?)[\s]*,?[\s]*/ig, D = Array.isArray || function(n) {
  return n instanceof Array;
};
function an(n, t) {
  return Object.prototype.hasOwnProperty.call(n, t);
}
function Q(n) {
  if (typeof n == "function" || Object(n) !== n)
    return n;
  var t = new n.constructor();
  for (var e in n)
    an(n, e) && (t[e] = Q(n[e]));
  return t;
}
function tt(n, t) {
  for (var e = 0, r = n.length; e < r; e++) if (n[e] === t)
    return n.push(n.splice(e, 1)[0]);
}
function et(n) {
  function t() {
    var e = Array.prototype.slice.call(arguments, 0), r = e.join("␀"), a = t.cache = t.cache || {}, i = t.count = t.count || [];
    return an(a, r) ? (tt(i, r), a[r]) : (i.length >= 1e3 && delete a[i.shift()], i.push(r), a[r] = n(...arguments), a[r]);
  }
  return t;
}
function rt(n) {
  if (!n)
    return null;
  var t = I(n);
  if (t.arr)
    return Q(t.arr);
  var e = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, r = [];
  return D(n) && D(n[0]) && (r = Q(n)), r.length || String(n).replace(Kn, function(a, i, s) {
    var u = [], p = i.toLowerCase();
    for (s.replace(nt, function(c, l) {
      l && u.push(+l);
    }), p == "m" && u.length > 2 && (r.push([i, ...u.splice(0, 2)]), p = "l", i = i == "m" ? "l" : "L"); u.length >= e[p] && (r.push([i, ...u.splice(0, e[p])]), !!e[p]); )
      ;
  }), r.toString = I.toString, t.arr = Q(r), r;
}
function I(n) {
  var t = I.ps = I.ps || {};
  return t[n] ? t[n].sleep = 100 : t[n] = {
    sleep: 100
  }, setTimeout(function() {
    for (var e in t)
      an(t, e) && e != n && (t[e].sleep--, !t[e].sleep && delete t[e]);
  }), t[n];
}
function en(n, t, e, r) {
  return arguments.length === 1 && (t = n.y, e = n.width, r = n.height, n = n.x), {
    x: n,
    y: t,
    width: e,
    height: r,
    x2: n + e,
    y2: t + r
  };
}
function Bn() {
  return this.join(",").replace(Jn, "$1");
}
function H(n) {
  var t = Q(n);
  return t.toString = Bn, t;
}
function vn(n, t, e, r, a, i, s, u, p) {
  var c = 1 - p, l = yn(c, 3), f = yn(c, 2), m = p * p, o = m * p, h = l * n + f * 3 * p * e + c * 3 * p * p * a + o * s, d = l * t + f * 3 * p * r + c * 3 * p * p * i + o * u;
  return {
    x: G(h),
    y: G(d)
  };
}
function wn(n) {
  var t = lt(...n);
  return en(
    t.x0,
    t.y0,
    t.x1 - t.x0,
    t.y1 - t.y0
  );
}
function T(n, t, e) {
  return t >= n.x && t <= n.x + n.width && e >= n.y && e <= n.y + n.height;
}
function at(n, t) {
  return n = en(n), t = en(t), T(t, n.x, n.y) || T(t, n.x2, n.y) || T(t, n.x, n.y2) || T(t, n.x2, n.y2) || T(n, t.x, t.y) || T(n, t.x2, t.y) || T(n, t.x, t.y2) || T(n, t.x2, t.y2) || (n.x < t.x2 && n.x > t.x || t.x < n.x2 && t.x > n.x) && (n.y < t.y2 && n.y > t.y || t.y < n.y2 && t.y > n.y);
}
function kn(n, t, e, r, a) {
  var i = -3 * t + 9 * e - 9 * r + 3 * a, s = n * i + 6 * t - 12 * e + 6 * r;
  return n * s - 3 * t + 3 * e;
}
function bn(n, t, e, r, a, i, s, u, p) {
  p == null && (p = 1), p = p > 1 ? 1 : p < 0 ? 0 : p;
  for (var c = p / 2, l = 12, f = [-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816], m = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472], o = 0, h = 0; h < l; h++) {
    var d = c * f[h] + c, x = kn(d, n, e, a, s), y = kn(d, t, r, i, u), v = x * x + y * y;
    o += m[h] * j.sqrt(v);
  }
  return c * o;
}
function it(n, t, e, r, a, i, s, u) {
  if (!(B(n, e) < P(a, s) || P(n, e) > B(a, s) || B(t, r) < P(i, u) || P(t, r) > B(i, u))) {
    var p = (n * r - t * e) * (a - s) - (n - e) * (a * u - i * s), c = (n * r - t * e) * (i - u) - (t - r) * (a * u - i * s), l = (n - e) * (i - u) - (t - r) * (a - s);
    if (l) {
      var f = G(p / l), m = G(c / l), o = +f.toFixed(2), h = +m.toFixed(2);
      if (!(o < +P(n, e).toFixed(2) || o > +B(n, e).toFixed(2) || o < +P(a, s).toFixed(2) || o > +B(a, s).toFixed(2) || h < +P(t, r).toFixed(2) || h > +B(t, r).toFixed(2) || h < +P(i, u).toFixed(2) || h > +B(i, u).toFixed(2)))
        return { x: f, y: m };
    }
  }
}
function G(n) {
  return Math.round(n * 1e11) / 1e11;
}
function st(n, t, e) {
  var r = wn(n), a = wn(t);
  if (!at(r, a))
    return [];
  for (var i = bn(...n), s = bn(...t), u = Cn(n) ? 1 : ~~(i / 5) || 1, p = Cn(t) ? 1 : ~~(s / 5) || 1, c = [], l = [], f = {}, m = [], o = 0; o < u + 1; o++) {
    var h = vn(...n, o / u);
    c.push({ x: h.x, y: h.y, t: o / u });
  }
  for (o = 0; o < p + 1; o++)
    h = vn(...t, o / p), l.push({ x: h.x, y: h.y, t: o / p });
  for (o = 0; o < u; o++)
    for (var d = 0; d < p; d++) {
      var x = c[o], y = c[o + 1], v = l[d], w = l[d + 1], k = O(y.x - x.x) < 0.01 ? "y" : "x", g = O(w.x - v.x) < 0.01 ? "y" : "x", b = it(x.x, x.y, y.x, y.y, v.x, v.y, w.x, w.y), C;
      if (b) {
        if (C = b.x.toFixed(9) + "#" + b.y.toFixed(9), f[C])
          continue;
        f[C] = !0;
        var S = x.t + O((b[k] - x[k]) / (y[k] - x[k])) * (y.t - x.t), M = v.t + O((b[g] - v[g]) / (w[g] - v[g])) * (w.t - v.t);
        S >= 0 && S <= 1 && M >= 0 && M <= 1 && m.push({
          x: b.x,
          y: b.y,
          t1: S,
          t2: M
        });
      }
    }
  return m;
}
function ct(n, t, e) {
  n = jn(n), t = jn(t);
  for (var r, a, i, s, u, p, c, l, f, m, o = e ? 0 : [], h = 0, d = n.length; h < d; h++) {
    var x = n[h];
    if (x[0] == "M")
      r = u = x[1], a = p = x[2];
    else {
      x[0] == "C" ? (f = [r, a, ...x.slice(1)], r = f[6], a = f[7]) : (f = [r, a, r, a, u, p, u, p], r = u, a = p);
      for (var y = 0, v = t.length; y < v; y++) {
        var w = t[y];
        if (w[0] == "M")
          i = c = w[1], s = l = w[2];
        else {
          w[0] == "C" ? (m = [i, s, ...w.slice(1)], i = m[6], s = m[7]) : (m = [i, s, i, s, c, l, c, l], i = c, s = l);
          var k = st(f, m);
          {
            for (var g = 0, b = k.length; g < b; g++)
              k[g].segment1 = h, k[g].segment2 = y, k[g].bez1 = f, k[g].bez2 = m;
            o = o.concat(k);
          }
        }
      }
    }
  }
  return o;
}
function ot(n) {
  var t = I(n);
  if (t.abs)
    return H(t.abs);
  if ((!D(n) || !D(n && n[0])) && (n = rt(n)), !n || !n.length)
    return [["M", 0, 0]];
  var e = [], r = 0, a = 0, i = 0, s = 0, u = 0, p;
  n[0][0] == "M" && (r = +n[0][1], a = +n[0][2], i = r, s = a, u++, e[0] = ["M", r, a]);
  for (var c, l, f = u, m = n.length; f < m; f++) {
    if (e.push(c = []), l = n[f], p = l[0], p != p.toUpperCase())
      switch (c[0] = p.toUpperCase(), c[0]) {
        case "A":
          c[1] = l[1], c[2] = l[2], c[3] = l[3], c[4] = l[4], c[5] = l[5], c[6] = +l[6] + r, c[7] = +l[7] + a;
          break;
        case "V":
          c[1] = +l[1] + a;
          break;
        case "H":
          c[1] = +l[1] + r;
          break;
        case "M":
          i = +l[1] + r, s = +l[2] + a;
        default:
          for (var o = 1, h = l.length; o < h; o++)
            c[o] = +l[o] + (o % 2 ? r : a);
      }
    else
      for (var d = 0, x = l.length; d < x; d++)
        c[d] = l[d];
    switch (p = p.toUpperCase(), c[0]) {
      case "Z":
        r = +i, a = +s;
        break;
      case "H":
        r = c[1];
        break;
      case "V":
        a = c[1];
        break;
      case "M":
        i = c[c.length - 2], s = c[c.length - 1];
      default:
        r = c[c.length - 2], a = c[c.length - 1];
    }
  }
  return e.toString = Bn, t.abs = H(e), e;
}
function Cn(n) {
  return n[0] === n[2] && n[1] === n[3] && n[4] === n[6] && n[5] === n[7];
}
function W(n, t, e, r) {
  return [
    n,
    t,
    e,
    r,
    e,
    r
  ];
}
function Sn(n, t, e, r, a, i) {
  var s = 0.3333333333333333, u = 2 / 3;
  return [
    s * n + u * e,
    s * t + u * r,
    s * a + u * e,
    s * i + u * r,
    a,
    i
  ];
}
function Mn(n, t, e, r, a, i, s, u, p, c) {
  var l = $ * 120 / 180, f = $ / 180 * (+a || 0), m = [], o, h = et(function(mn, dn, N) {
    var Nn = mn * j.cos(N) - dn * j.sin(N), Wn = mn * j.sin(N) + dn * j.cos(N);
    return { x: Nn, y: Wn };
  });
  if (c)
    C = c[0], S = c[1], g = c[2], b = c[3];
  else {
    o = h(n, t, -f), n = o.x, t = o.y, o = h(u, p, -f), u = o.x, p = o.y;
    var d = (n - u) / 2, x = (t - p) / 2, y = d * d / (e * e) + x * x / (r * r);
    y > 1 && (y = j.sqrt(y), e = y * e, r = y * r);
    var v = e * e, w = r * r, k = (i == s ? -1 : 1) * j.sqrt(O((v * w - v * x * x - w * d * d) / (v * x * x + w * d * d))), g = k * e * x / r + (n + u) / 2, b = k * -r * d / e + (t + p) / 2, C = j.asin(((t - b) / r).toFixed(9)), S = j.asin(((p - b) / r).toFixed(9));
    C = n < g ? $ - C : C, S = u < g ? $ - S : S, C < 0 && (C = $ * 2 + C), S < 0 && (S = $ * 2 + S), s && C > S && (C = C - $ * 2), !s && S > C && (S = S - $ * 2);
  }
  var M = S - C;
  if (O(M) > l) {
    var A = S, _ = u, qn = p;
    S = C + l * (s && S > C ? 1 : -1), u = g + e * j.cos(S), p = b + r * j.sin(S), m = Mn(u, p, e, r, a, 0, s, _, qn, [S, A, g, b]);
  }
  M = S - C;
  var Xn = j.cos(C), In = j.sin(C), Ln = j.cos(S), zn = j.sin(S), cn = j.tan(M / 4), on = 4 / 3 * e * cn, ln = 4 / 3 * r * cn, un = [n, t], X = [n + on * In, t - ln * Xn], pn = [u + on * zn, p - ln * Ln], hn = [u, p];
  if (X[0] = 2 * un[0] - X[0], X[1] = 2 * un[1] - X[1], c)
    return [X, pn, hn].concat(m);
  m = [X, pn, hn].concat(m).join().split(",");
  for (var fn = [], R = 0, Qn = m.length; R < Qn; R++)
    fn[R] = R % 2 ? h(m[R - 1], m[R], f).y : h(m[R], m[R + 1], f).x;
  return fn;
}
function lt(n, t, e, r, a, i, s, u) {
  for (var p = [], c = [[], []], l, f, m, o, h, d, x, y, v = 0; v < 2; ++v) {
    if (v == 0 ? (f = 6 * n - 12 * e + 6 * a, l = -3 * n + 9 * e - 9 * a + 3 * s, m = 3 * e - 3 * n) : (f = 6 * t - 12 * r + 6 * i, l = -3 * t + 9 * r - 9 * i + 3 * u, m = 3 * r - 3 * t), O(l) < 1e-12) {
      if (O(f) < 1e-12)
        continue;
      o = -m / f, 0 < o && o < 1 && p.push(o);
      continue;
    }
    x = f * f - 4 * m * l, y = j.sqrt(x), !(x < 0) && (h = (-f + y) / (2 * l), 0 < h && h < 1 && p.push(h), d = (-f - y) / (2 * l), 0 < d && d < 1 && p.push(d));
  }
  for (var w = p.length, k = w, g; w--; )
    o = p[w], g = 1 - o, c[0][w] = g * g * g * n + 3 * g * g * o * e + 3 * g * o * o * a + o * o * o * s, c[1][w] = g * g * g * t + 3 * g * g * o * r + 3 * g * o * o * i + o * o * o * u;
  return c[0][k] = n, c[1][k] = t, c[0][k + 1] = s, c[1][k + 1] = u, c[0].length = c[1].length = k + 2, {
    x0: P(...c[0]),
    y0: P(...c[1]),
    x1: B(...c[0]),
    y1: B(...c[1])
  };
}
function jn(n) {
  var t = I(n);
  if (t.curve)
    return H(t.curve);
  for (var e = ot(n), r = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null }, a = function(o, h, d) {
    var x, y;
    if (!o)
      return ["C", h.x, h.y, h.x, h.y, h.x, h.y];
    switch (!(o[0] in { T: 1, Q: 1 }) && (h.qx = h.qy = null), o[0]) {
      case "M":
        h.X = o[1], h.Y = o[2];
        break;
      case "A":
        o = ["C", ...Mn(h.x, h.y, ...o.slice(1))];
        break;
      case "S":
        d == "C" || d == "S" ? (x = h.x * 2 - h.bx, y = h.y * 2 - h.by) : (x = h.x, y = h.y), o = ["C", x, y, ...o.slice(1)];
        break;
      case "T":
        d == "Q" || d == "T" ? (h.qx = h.x * 2 - h.qx, h.qy = h.y * 2 - h.qy) : (h.qx = h.x, h.qy = h.y), o = ["C", ...Sn(h.x, h.y, h.qx, h.qy, o[1], o[2])];
        break;
      case "Q":
        h.qx = o[1], h.qy = o[2], o = ["C", ...Sn(h.x, h.y, o[1], o[2], o[3], o[4])];
        break;
      case "L":
        o = ["C", ...W(h.x, h.y, o[1], o[2])];
        break;
      case "H":
        o = ["C", ...W(h.x, h.y, o[1], h.y)];
        break;
      case "V":
        o = ["C", ...W(h.x, h.y, h.x, o[1])];
        break;
      case "Z":
        o = ["C", ...W(h.x, h.y, h.X, h.Y)];
        break;
    }
    return o;
  }, i = function(o, h) {
    if (o[h].length > 7) {
      o[h].shift();
      for (var d = o[h]; d.length; )
        s[h] = "A", o.splice(h++, 0, ["C", ...d.splice(0, 6)]);
      o.splice(h, 1), l = e.length;
    }
  }, s = [], u = "", p = "", c = 0, l = e.length; c < l; c++) {
    e[c] && (u = e[c][0]), u != "C" && (s[c] = u, c && (p = s[c - 1])), e[c] = a(e[c], r, p), s[c] != "A" && u == "C" && (s[c] = "C"), i(e, c);
    var f = e[c], m = f.length;
    r.x = f[m - 2], r.y = f[m - 1], r.bx = gn(f[m - 4]) || r.x, r.by = gn(f[m - 3]) || r.y;
  }
  return t.curve = H(e), e;
}
const F = {
  isReady: !1,
  turnpolicy: "minority",
  turdsize: 2,
  optcurve: !0,
  alphamax: 1,
  opttolerance: 0.4,
  flatten: !1,
  // Flattens a curve by splitting it to multiple lines //
  line: {
    segmentation: {
      amount: 2,
      // how many segments to create per line //
      min: 8
      // min length of a segment
    },
    implementation: "L"
    // Use the L,C,S command for lines //
  },
  stretchingTolerance: 0.03
};
function ut(n, t, e) {
  t.width = n.width, t.height = n.height;
  const r = t.getContext("2d", { willReadFrequently: !0 });
  r.fillStyle = "white", r.fillRect(0, 0, t.width, t.height), r.drawImage(n, 0, 0), q(
    "getBitamp",
    {
      width: t.width,
      height: t.height
    },
    function(a) {
      const i = a.bm, s = r.getImageData(0, 0, i.w, i.h), u = s.data.length;
      let p, c;
      for (p = 0, c = 0; p < u; p += 4, c++) {
        const l = pt(s.data[p], s.data[p + 1], s.data[p + 2]), f = l.s, m = l.v;
        f < 0.2 && m > 0.8 ? i.data[c] = 0 : i.data[c] = 1;
      }
      F.isReady = !0, q("setBitmap", i, e);
    }
  );
}
function pt(n, t, e) {
  arguments.length === 1 && (t = n.g, e = n.b, n = n.r);
  const r = Math.max(n, t, e), a = Math.min(n, t, e), i = r - a;
  let s;
  const u = r === 0 ? 0 : i / r, p = r / 255;
  switch (r) {
    case a:
      s = 0;
      break;
    case n:
      s = t - e + i * (t < e ? 6 : 0), s /= 6 * i;
      break;
    case t:
      s = e - n + i * 2, s /= 6 * i;
      break;
    case e:
      s = n - t + i * 4, s /= 6 * i;
      break;
  }
  return {
    h: s,
    s: u,
    v: p
  };
}
const ht = Object.assign({
  "./potrace_worker.js": Zn
})["./potrace_worker.js"], ft = new Blob([ht], { type: "application/javascript" }), mt = URL.createObjectURL(ft), Rn = new Worker(mt), z = {};
function q(n, t, e) {
  e && (z[n] = e), Rn.postMessage({
    action: n,
    argument: typeof t == "function" ? void 0 : t
  });
}
Rn.onmessage = function(n) {
  z[n.data.action] && typeof z[n.data.action] == "function" && (z[n.data.action](n.data), z[n.data.action] = void 0);
};
function Z(n, t, e) {
  const r = document.createElement("canvas"), a = new Image();
  a.crossOrigin = "Anonymous", a.onload = function() {
    ut(a, r, (i) => {
      t(i);
    });
  }, a.onerror = e, a.src = n;
}
function J(n) {
  return new Promise(function(t, e) {
    F.isReady ? q("clear", void 0, function() {
      Z(n, t, e);
    }) : Z(n, t, e);
  });
}
function An(n) {
  return new Promise(function(t, e) {
    F.isReady ? q("clear", void 0, function() {
      Z(n, t, e);
    }) : Z(n, t, e);
  });
}
function $n(n, t) {
  function e(i) {
    function s(o) {
      let h = "C " + i.c[o * 3 + 0].x.toFixed(3) + " " + i.c[o * 3 + 0].y.toFixed(3) + ",";
      return h += i.c[o * 3 + 1].x.toFixed(3) + " " + i.c[o * 3 + 1].y.toFixed(3) + ",", h += i.c[o * 3 + 2].x.toFixed(3) + " " + i.c[o * 3 + 2].y.toFixed(3) + " ", l = {
        x: i.c[o * 3 + 2].x.toFixed(3),
        y: i.c[o * 3 + 2].y.toFixed(3)
      }, a(l), h;
    }
    function u(o) {
      let h = "";
      const d = [
        {
          x: i.c[o * 3 + 1].x.toFixed(3),
          y: i.c[o * 3 + 1].y.toFixed(3)
        },
        {
          x: i.c[o * 3 + 2].x.toFixed(3),
          y: i.c[o * 3 + 2].y.toFixed(3)
        }
      ];
      a(d[0]), a(d[1]), x(l, d[0]), x(d[0], d[1]);
      function x(v, w) {
        const k = [w];
        y(
          {
            p1: v,
            p2: w
          },
          F.line.segmentation.amount,
          F.line.segmentation.min,
          k
        );
        let g = v;
        for (const b of k)
          F.line.implementation === "S" ? h += `S ${b.x} ${b.y} ${b.x} ${b.y} ` : F.line.implementation === "L" ? h += `L ${b.x} ${b.y} ` : F.line.implementation === "C" && (h += `C ${g.x} ${g.y} ${b.x} ${b.y} ${b.x} ${b.y} `), g = b;
      }
      function y(v, w, k, g) {
        const b = (A, _) => Math.sqrt(Math.pow(parseFloat(_.x) - parseFloat(A.x), 2) + Math.pow(parseFloat(_.y) - parseFloat(A.y), 2)), C = (A, _) => ({
          x: parseFloat(A.p1.x) + _ * (parseFloat(A.p2.x) - parseFloat(A.p1.x)),
          y: parseFloat(A.p1.y) + _ * (parseFloat(A.p2.y) - parseFloat(A.p1.y))
        }), S = C(v, 1 / w);
        if (b(v.p1, S) < parseFloat(k))
          y(v, --w, k, g);
        else
          for (let A = w; A >= 1; A--)
            g.unshift(C(v, A / w));
      }
      return l = d[1], h;
    }
    const p = i.n;
    let c, l = {
      x: i.c[(p - 1) * 3 + 2].x.toFixed(3),
      y: i.c[(p - 1) * 3 + 2].y.toFixed(3)
    };
    a(l);
    let m = "M" + l.x + " " + l.y + " ";
    for (c = 0; c < p; c++)
      i.tag[c] === "CURVE" ? m += s(c) : i.tag[c] === "CORNER" && (m += u(c));
    return m += " Z ", m;
  }
  let r = {};
  function a(i) {
    parseFloat(i.x) >= parseFloat(r.max.x) && (r.max.x = parseFloat(i.x)), parseFloat(i.x) <= parseFloat(r.min.x) && (r.min.x = parseFloat(i.x)), parseFloat(i.y) >= parseFloat(r.max.y) && (r.max.y = parseFloat(i.y)), parseFloat(i.y) <= parseFloat(r.min.y) && (r.min.y = parseFloat(i.y));
  }
  if (n.length === 0)
    return "blank";
  {
    const i = n[0].curve;
    r = {
      min: {
        x: parseFloat(i.c[(i.n - 1) * 3 + 2].x.toFixed(3)),
        y: parseFloat(i.c[(i.n - 1) * 3 + 2].y.toFixed(3))
      },
      max: {
        x: parseFloat(i.c[(i.n - 1) * 3 + 2].x.toFixed(3)),
        y: parseFloat(i.c[(i.n - 1) * 3 + 2].y.toFixed(3))
      }
    };
    const s = void 0, u = parseInt(t.w), p = parseInt(t.h), c = {
      w: u,
      h: p,
      len: n.length,
      path: "",
      strokec: s === "curve" ? "black" : "none",
      fillc: s === "curve" ? "none" : "black",
      fillrule: s === "curve" ? "" : ' fill-rule="evenodd"',
      transform: "",
      print: function() {
        return Tn(this);
      },
      printWithCross: function() {
        return dt(this);
      }
    };
    let l;
    for (let f = 0; f < c.len; f++)
      l = n[f].curve, c.path += e(l);
    return c;
  }
}
function Tn(n) {
  return `
        <svg id="potrace-svg" version="1.1" viewBox="0 0 ${n.w} ${n.h}" width="${n.w}" height="${n.h}" xmlns="http://www.w3.org/2000/svg">
            <path id="potracePath" d="${n.path}" stroke="${n.strokec}" fill="purple" ${n.fillrule} transform="${n.transform}"/>
        </svg>`;
}
function dt(n) {
  return `
        <svg id="potrace-svg" version="1.1" viewBox="0 0 ${n.w} ${n.h}" width="${n.w}" height="${n.h}" xmlns="http://www.w3.org/2000/svg">
            <path id="potracePath" d="${n.path}" stroke="${n.strokec}" fill="purple" ${n.fillrule} transform="${n.transform}"/>
            <path id="crossHelper" d="M0,${n.h / 2} L${n.w},${n.h / 2} M${n.w / 2},0 L${n.w / 2},${n.h} Z" stroke="black" fill="none"/>
        </svg>`;
}
function xt(n, t) {
  return {
    imageBB: t,
    containerBB: n,
    ratio: {
      width: t.width / n.width,
      height: t.height / n.height
    },
    translation: {
      x: t.center.x - n.center.x,
      y: t.center.y - n.center.y
    },
    translationInWidths: {
      x: (t.center.x - n.center.x) / t.width,
      y: (t.center.y - n.center.y) / t.width
    }
  };
}
function Yn(n, t) {
  if (!t) return n;
  let e = 0, r = 0;
  return typeof t == "number" ? (e = t / 2, r = t / 2) : (e = t.x ? t.x : 0, r = t.y ? t.y : 0), {
    ...n,
    width: Math.max(0, n.width - 2 * e),
    height: Math.max(0, n.height - 2 * r)
  };
}
function gt(n, t, e, r = F.stretchingTolerance, a, i) {
  const s = yt(t.svg.path, t.svg.w / 2, t.svg.h / 2), u = sn(s, -e.x, -e.y), p = Y(u, a, n.svg.w / 2, n.svg.h / 2), c = i || n.svg.path;
  function l(f, m, o, h, d) {
    const x = Y(m, o, n.svg.w / 2, n.svg.h / 2);
    return f[o] === void 0 && (f[o] = ct(c, x).length), o - h < r && f[o] === 0 ? o : f[o] === 0 ? l(f, m, d, o, o) : l(f, m, (o + h) / 2, h, o);
  }
  return l({}, p, 1, 0, 1);
}
function yt(n, t, e) {
  const r = /[+-]?\d+(\.\d+)?([eE][+-]?\d+)?/g, a = n.toUpperCase().split("Z");
  let i = "";
  for (let s = 0; s < a.length; s++)
    if (a[s].trim().length !== 0 && s < a.length - 1) {
      const u = a[s].match(r);
      i += `M${u[0]} ${u[1]} L${t} ${e} Z `, i += a[s] + "Z ";
    }
  return i;
}
function E(n, t = F.line.segmentation) {
  if (t <= 1)
    return n;
  const e = [n[0]], r = (n[1] - n[0]) / t;
  for (let a = 1; a < t; a++) {
    const i = n[0] + a * r;
    e.push(Math.round(i));
  }
  return e.push(n[1]), e;
}
function vt(n, t) {
  const e = s(E([0, n]), 0), r = s(n, E([0, t])), a = s(E([n, 0]), t), i = s(0, E([t, 0]));
  function s(u, p) {
    return Array.isArray(u) ? u.reduce(function(c, l, f, m) {
      return c + `L${l},${p} `;
    }, "") : p.reduce(function(c, l, f, m) {
      return c + `L${u},${l} `;
    }, "");
  }
  return ` M0,0 ${e} ${r} ${a} ${i} Z`;
}
function sn(n, t, e) {
  const r = /[+-]?\d+(\.\d+)?([eE][+-]?\d+)?/g;
  let a = 0;
  return n.replace(r, function(i) {
    return a++, parseFloat(i) + (a % 2 === 1 ? t : e);
  });
}
function Y(n, t, e, r) {
  const a = /[+-]?\d+(\.\d+)?([eE][+-]?\d+)?/g;
  let i = 0;
  return n.replace(a, function(s) {
    return i++, (s - (i % 2 === 1 ? e : r)) * t + (i % 2 === 1 ? e : r);
  });
}
function wt(n, t, e, r, a) {
  const i = /[+-]?\d+(\.\d+)?([eE][+-]?\d+)?/g;
  let s = 0;
  return n.replace(i, function(u) {
    s++;
    const p = s % 2 === 1, c = p ? r : a, l = p ? t : e;
    return (parseFloat(u) - c) * l + c;
  });
}
function kt(n, t) {
  if (!t) return n.svg.path;
  const e = Yn(n.boundingBox, t), r = n.boundingBox.width && isFinite(n.boundingBox.width) && n.boundingBox.width !== 0 ? e.width / n.boundingBox.width : 1, a = n.boundingBox.height && isFinite(n.boundingBox.height) && n.boundingBox.height !== 0 ? e.height / n.boundingBox.height : 1;
  return wt(n.svg.path, r, a, n.boundingBox.center.x, n.boundingBox.center.y);
}
function bt(n, t) {
  const e = /[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?/g, r = [];
  n.replace(e, (d) => (r.push(parseFloat(d)), d));
  let a = 1 / 0, i = -1 / 0, s = 1 / 0, u = -1 / 0;
  for (let d = 0; d < r.length; d += 2) {
    const x = r[d], y = r[d + 1];
    !isNaN(x) && !isNaN(y) && (a = Math.min(a, x), i = Math.max(i, x), s = Math.min(s, y), u = Math.max(u, y));
  }
  const p = (a + i) / 2, c = (s + u) / 2, l = t * Math.PI / 180, f = Math.cos(l), m = Math.sin(l);
  let o = 0;
  return n.replace(e, () => {
    const d = o++, x = r[d];
    if (d % 2 === 0) {
      const y = x - p, v = r[d + 1] - c;
      return (y * f - v * m + p).toFixed(3);
    } else {
      const y = r[d - 1] - p, v = x - c;
      return (y * m + v * f + c).toFixed(3);
    }
  });
}
function Ct(n, t) {
  const e = t * Math.PI / 180, r = Math.cos(e), a = Math.sin(e), i = n.center.x, s = n.center.y, u = [
    [n.minX, n.minY],
    [n.maxX, n.minY],
    [n.maxX, n.maxY],
    [n.minX, n.maxY]
  ];
  function p(h, d) {
    const x = h - i, y = d - s;
    return [x * r - y * a + i, x * a + y * r + s];
  }
  const c = u.map(([h, d]) => p(h, d));
  let l = 1 / 0, f = -1 / 0, m = 1 / 0, o = -1 / 0;
  for (const [h, d] of c)
    l = Math.min(l, h), f = Math.max(f, h), m = Math.min(m, d), o = Math.max(o, d);
  return {
    minX: l,
    maxX: f,
    minY: m,
    maxY: o,
    width: f - l,
    height: o - m,
    center: {
      x: (l + f) / 2,
      y: (m + o) / 2
    }
  };
}
async function K(n, t) {
  return new Promise(function(e, r) {
    q("setInfo", n, function() {
      q("process", void 0, function(a) {
        const i = {
          boundingBox: a.boundingBox,
          svg: $n(
            a.pathlist,
            n.trimWhiteSpace ? {
              w: a.boundingBox.width,
              h: a.boundingBox.height
            } : {
              w: a.bm.w,
              h: a.bm.h
            }
          ),
          pathlist: a.pathlist,
          bm: a.bm
        };
        q("clear", void 0, function() {
          e(i);
        });
      });
    });
  });
}
const St = async (n) => {
  n.rotation || (n.rotation = {
    amount: 0,
    apply: !1
  }), n.preScale || (n.preScale = 1), n.postScale || (n.postScale = 1), n.preTranslate ? n.preTranslate = {
    x: 0,
    y: 0,
    ...n.preTranslate
  } : n.preTranslate = {
    x: 0,
    y: 0
  }, n.postTranslate ? n.postTranslate = {
    x: 0,
    y: 0,
    ...n.postTranslate
  } : n.postTranslate = {
    x: 0,
    y: 0
  }, n.image.URL ? await An(n.image.URL) : await J(n.image.file);
  const t = await K({
    ...F,
    invert: n.invert,
    trimWhiteSpace: n.trimWhiteSpace
  });
  let e;
  n.container ? (n.container.URL ? await An(n.container.URL) : await J(n.container.file), e = await K({
    ...F,
    invert: !1,
    trimWhiteSpace: n.trimWhiteSpace
  })) : (n.invert || n.applyStretch) && (await J(
    "data:image/svg+xml;base64," + window.btoa(
      Tn({
        w: parseInt(t.bm.w),
        h: parseInt(t.bm.h),
        path: vt(t.bm.w, t.bm.h),
        strokec: "none",
        fillrule: ' fill-rule="evenodd"',
        transform: ""
      })
    )
  ), e = await K({
    ...F,
    containerPath: void 0,
    trimWhiteSpace: !0
  }));
  const r = {};
  if (t.svg.path === void 0)
    return r.svg = "blank", r;
  e && (r.displacement = xt(e.boundingBox, t.boundingBox));
  const a = {
    translate: {
      x: 0,
      y: 0
    },
    scale: 1
  };
  n.opticallyCenter && (a.translate.x += t.pathlist.translationForOpticalCenter.x, a.translate.y += t.pathlist.translationForOpticalCenter.y), (n.preTranslate.x !== 0 || n.preTranslate.y !== 0) && (a.translate.x += n.preTranslate.x, a.translate.y += n.preTranslate.y), n.preScale !== 1 && (a.scale *= n.preScale), (a.scale !== 1 || a.translate.x !== 0 || a.translate.y !== 0) && (t.svg.path = sn(t.svg.path, a.translate.x, a.translate.y), t.svg.path = Y(t.svg.path, a.scale, t.svg.w / 2, t.svg.h / 2));
  let i, s = 1, u;
  if (n.calculateStretch || n.applyStretch) {
    const c = Math.min(
      e.boundingBox.height / t.boundingBox.height,
      e.boundingBox.width / t.boundingBox.width
    ), l = Yn(e.boundingBox, n.padding);
    i = Math.min(l.height / t.boundingBox.height, l.width / t.boundingBox.width), u = kt(e, n.padding), s = c && isFinite(c) && c !== 0 ? i / c : 1;
  }
  n.rotation.apply && n.rotation.amount !== 0 && (t.svg.path = bt(t.svg.path, n.rotation.amount), t.boundingBox = Ct(t.boundingBox, n.rotation.amount));
  let p;
  if ((n.calculateStretch || n.applyStretch) && (p = gt(e, t, r.displacement.translation, n.stretchTolerance, i, u)), n.invert) {
    if (n.container && V(t, e, r.displacement, n.postTranslate), n.applyStretch) {
      const l = L({
        image: t,
        currentlyAppliedScale: a.scale,
        adjustmentsToBeApplited: i * p * n.postScale,
        padding: n.padding,
        skipPadding: !0,
        paddingScaleToReport: s
      });
      r.scales = {
        toFitContainerBB: i,
        toFitContainer: p,
        paddingScale: l,
        postScale: n.postScale,
        preScale: a.scale
      };
    } else {
      const l = L({
        image: t,
        currentlyAppliedScale: a.scale,
        adjustmentsToBeApplited: n.postScale,
        padding: n.padding
      });
      r.scales = {
        paddingScale: l,
        postScale: n.postScale,
        preScale: a.scale
      };
    }
    const c = e.pathlist[e.pathlist.length - 1];
    c.sign = "-", t.svg.path = $n([c], {
      width: e.svg.w,
      height: e.svg.h
    }).path + t.svg.path;
  } else if (n.includeContainer) {
    V(t, e, r.displacement, n.postTranslate);
    const c = n.applyStretch ? i * p : 1, l = L({
      image: t,
      currentlyAppliedScale: a.scale,
      adjustmentsToBeApplited: n.postScale * c,
      padding: n.padding,
      skipPadding: !!n.applyStretch,
      paddingScaleToReport: n.applyStretch ? s : void 0
    });
    r.scales = {
      paddingScale: l,
      postScale: n.postScale,
      preScale: a.scale
    }, (n.applyStretch || n.calculateStretch) && (r.scales.toFitContainer = p, r.scales.toFitContainerBB = i), t.svg.path += e.svg.path;
  } else if (n.applyStretch) {
    V(t, e, r.displacement, n.postTranslate);
    const c = L({
      image: t,
      currentlyAppliedScale: a.scale,
      adjustmentsToBeApplited: i * p * n.postScale,
      padding: n.padding,
      skipPadding: !0,
      paddingScaleToReport: s
    });
    r.scales = {
      toFitContainerBB: i,
      toFitContainer: p,
      paddingScale: c,
      postScale: n.postScale,
      preScale: a.scale
    };
  } else {
    V(
      t,
      t,
      {
        translation: {
          x: 0,
          y: 0
        }
      },
      n.postTranslate
    );
    const c = L({
      image: t,
      currentlyAppliedScale: a.scale,
      adjustmentsToBeApplited: n.postScale,
      padding: n.padding
    });
    r.scales = {
      paddingScale: c,
      postScale: n.postScale,
      preScale: a.scale
    };
  }
  return r.svg = t.svg.print(), r;
};
function V(n, t, e, r) {
  const a = {
    x: -e.translation.x + r.x,
    y: -e.translation.y + r.y
  }, i = {
    w: t.svg.w,
    h: t.svg.h
  };
  n.svg.w = i.w, n.svg.h = i.h, n.svg.path = sn(n.svg.path, a.x, a.y);
}
function L({ image: n, currentlyAppliedScale: t, adjustmentsToBeApplited: e, padding: r, skipPadding: a = !1, paddingScaleToReport: i }) {
  if (a)
    return n.svg.path = Y(n.svg.path, e, n.svg.w / 2, n.svg.h / 2), typeof i == "number" ? i : 1;
  if (r)
    if (typeof r == "number") {
      let s;
      const u = n.boundingBox.width, p = n.boundingBox.height, c = u * t * e, l = p * t * e;
      return c > l ? (s = (c - r) / c, n.svg.path = Y(n.svg.path, e * s, n.svg.w / 2, n.svg.h / 2)) : (s = (l - r) / l, n.svg.path = Y(n.svg.path, e * s, n.svg.w / 2, n.svg.h / 2)), s;
    } else {
      const s = r.x ? r.x : 0, u = r.y ? r.y : 0, p = n.boundingBox.width, c = n.boundingBox.height, l = p * t * e, f = c * t * e;
      let m = 1, o = 1;
      s && (m = (l - 2 * s) / l), u && (o = (f - 2 * u) / f);
      let h = 1;
      return s && u ? h = Math.min(m, o) : s ? h = m : u && (h = o), n.svg.path = Y(n.svg.path, e * h, n.svg.w / 2, n.svg.h / 2), h;
    }
  else
    return n.svg.path = Y(n.svg.path, e, n.svg.w / 2, n.svg.h / 2), 1;
}
const On = async function(n) {
  const t = { ...n };
  t.image = { file: n.src }, delete n.src, n.container && (t.container = { file: n.container }, delete n.container);
  const e = await St(t);
  if (e.svg === "blank") throw new Error("blank_svg");
  return e.base64 = "data:image/svg+xml;base64," + window.btoa(e.svg), e;
};
function jt(n) {
  const r = n.getContext("2d").getImageData(0, 0, n.width, n.height).data;
  n.width;
  let a = n.height, i = 0, s = 0, u = 0;
  for (let f = 0; f < n.height; f++)
    for (let m = 0; m < n.width; m++) {
      const o = (f * n.width + m) * 4;
      r[o] === 0 && r[o + 1] === 0 && r[o + 2] === 0 && r[o + 3] > 0 && (a = Math.min(a, f), i = Math.max(i, f), s += f, u++);
    }
  if (u === 0)
    return { pixels: 0, percentage: 0 };
  const p = (a + i) / 2, c = s / u, l = p - c;
  return {
    pixels: l,
    percentage: l / (i - a)
  };
}
const At = async (n) => {
  n.resize || (n.resize = { width: 1024, height: 1024 }), await Dn(n.fontFamily);
  const t = rn(n.fontFamily), e = t ? t.urls : {}, r = t ? t.meta : {}, a = n.fontWeight === "bold" ? "bold " : "", i = !!(e.left && e.center && e.right);
  let s = document.createElement("canvas");
  s.width = n.resize.width, s.height = n.resize.height;
  const u = 10, p = 1, c = s.width * 0.01, l = s.getContext("2d"), f = n.text.split(/\r?\n/);
  let m = 2e3, o = !1;
  for (; !o && m > u; ) {
    l.font = a + `${m}px ` + n.fontFamily + (i ? "_center" : "");
    const k = f.map((S) => l.measureText(S).width), g = Math.max(...k), C = m * p * f.length;
    g <= s.width - c * 2 && C <= s.height - c * 2 ? o = !0 : m = Math.floor(m * 0.98);
  }
  l.clearRect(0, 0, s.width, s.height), l.fillStyle = "black", l.textAlign = "center", r.measurementCorrection ? (m = Math.floor(m * r.measurementCorrection.scale), l.textBaseline = r.measurementCorrection.align) : l.textBaseline = "middle";
  const h = m * p, d = h * f.length, x = (s.height - d) / 2 + h / 2;
  if (i) {
    let k = s.width / 2;
    for (let g = 0; g < n.text.length; g++) {
      const b = l.measureText(n.text).width;
      n.text.length === 1 ? l.font = a + `${m}px ` + n.fontFamily + "_center" : g === n.text.length - 1 ? l.font = a + `${m}px ` + n.fontFamily + "_right" : g > 0 ? l.font = a + `${m}px ` + n.fontFamily + "_center" : l.font = a + `${m}px ` + n.fontFamily + "_left";
      const C = l.measureText(n.text[g]).width;
      n.text.length > 1 && (g === 0 ? k += C / 2 - b / 2 : k += C), l.fillText(n.text[g], k, s.height / 2);
    }
  } else
    l.font = a + `${m}px ` + n.fontFamily, f.forEach((k, g) => {
      const b = x + g * h;
      l.fillText(k, s.width / 2, b);
    });
  const v = f.length === 1 && f[0].length > 1 && r.needsOpticalAlignment !== !1 ? jt(s) : { pixels: 0, percentage: 0 }, w = s.toDataURL("image/png;base64");
  return s.height = 0, s.width = 0, s = void 0, {
    base64: w,
    offsetY: {
      pixels: -v.pixels,
      percentage: -v.percentage
    }
  };
}, _n = async (n) => (n.resize && n.resize.width && n.resize.height && (n.src = await tn({
  src: n.src,
  height: n.resize.height,
  width: n.resize.width,
  format: "png"
})), n.resizeContainer && n.resizeContainer.width && n.resizeContainer.height && n.container && (n.container = await tn({
  src: n.container,
  height: n.resizeContainer.height,
  width: n.resizeContainer.width,
  format: "png"
})), n.resize && delete n.resize, n.resizeContainer && delete n.resizeContainer, await On({
  src: n.src,
  container: n.container,
  invert: n.invert,
  includeContainer: n.includeContainer,
  applyStretch: n.applyStretch,
  calculateStretch: n.calculateStretch,
  padding: n.padding,
  trimWhiteSpace: n.trimWhiteSpace,
  opticallyCenter: n.opticallyCenter,
  preScale: n.preScale,
  preTranslate: n.preTranslate,
  postScale: n.postScale,
  postTranslate: n.postTranslate,
  rotation: n.rotation
})), Ft = async (n) => {
  const { base64: t, offsetY: e } = await At({
    resize: n.resize,
    text: n.text,
    fontFamily: n.fontFamily,
    fontWeight: n.fontWeight,
    fontSize: n.fontSize
  });
  if (e && !n.rotation?.apply) {
    const a = 1 - e.percentage;
    e.scaleToFit = a, (n.autoBalance === "offset" || n.autoBalance === "contain") && (n.preTranslate = { x: 0, y: -e.pixels }, n.autoBalance === "contain" && (n.preScale = a));
  }
  return {
    ...await _n({ src: t, ...n }),
    offsetY: e || void 0
  };
}, Pt = async (n) => {
  const t = await Hn(n.fontFamily), e = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMin slice" viewBox="0 0 320 320" width="320" height="320">
      <defs>
        ${t ? `<style type="text/css">
          @font-face {
            font-family: "${n.fontFamily}";
            src: url(${t});
          }
        </style>` : ""}
        <path id="s" d="M 151.32 159.973 c 3.65 3.65 -3.119 6.72 -6.066 6.066 c -7.986 -1.773 -9.27 -12.002 -6.066 -18.198 c 5.731 -11.082 20.612 -12.38 30.33 -6.065 c 14.26 9.267 15.584 29.339 6.065 42.46 c -12.686 17.49 -38.107 18.828 -54.592 6.067 c -20.745 -16.06 -22.09 -46.897 -6.066 -66.725 c 19.408 -24.015 55.695 -25.365 78.856 -6.066 c 27.294 22.744 28.648 64.502 6.066 90.988 c -26.071 30.58 -73.313 31.935 -103.12 6.066 c -33.869 -29.394 -35.225 -82.127 -6.066 -115.252 c 32.713 -37.16 90.944 -38.518 127.384 -6.065 c 40.455 36.028 41.813 99.762 6.065 139.515 c -39.342 43.75 -108.581 45.11 -151.646 6.065 c -47.048 -42.655 -48.408 -117.402 -6.066 -163.778 c 45.966 -50.346 126.224 -51.706 175.91 -6.066 c 53.645 49.277 55.005 135.047 6.066 188.042 c -52.587 56.945 -143.87 58.305 -200.174 6.066 c -60.244 -55.895 -61.605 -152.693 -6.066 -212.306 c 59.204 -63.545 161.518 -64.906 224.438 -6.065 c 53.59 50.116 66.879 131.92 33.787 197.072" />
      </defs>
      <text font-family="${n.fontFamily}" font-size="${n.fontSize ? n.fontSize.split("px")[0] : 25}" font-weight="${n.fontWeight}" letter-spacing="2px">
        <textPath id="text" xlink:href="#s">&#160;&#160;&#160;&#160;${n.text.replaceAll(" ", "&#160;")}</textPath>
      </text>
    </svg>`, r = {
    width: n.resize ? n.resize.width : 1024,
    height: n.resize ? n.resize.height : 1024
  }, a = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMin slice" viewBox="0 0 ${r.width} ${r.height}" width="${r.width}" height="${r.height}">
    <path id="s" d="M0,0 L${r.width},0 L${r.width},${r.height} L0,${r.height} L0,0 Z" />
  </svg>`, i = "data:image/svg+xml;," + encodeURIComponent(e), s = await tn({
    src: i,
    width: r.width,
    height: r.height,
    format: "PNG"
  });
  return await On({
    src: s,
    applyStretch: !0,
    container: n.container || "data:image/svg+xml;," + encodeURIComponent(a),
    invert: n.invert,
    includeContainer: n.invert,
    trimWhiteSpace: !0,
    postScale: n.postScale,
    postTranslate: n.postTranslate,
    rotation: n.rotation
  });
};
function Bt(n, t, e = {}) {
  const r = typeof t == "string" ? { center: t } : t, a = {
    supportsSpecialCharacters: e.supportsSpecialCharacters ?? !0,
    supportsNumbers: e.supportsNumbers ?? !0,
    needsOpticalAlignment: e.needsOpticalAlignment ?? !0,
    measurementCorrection: e.measurementCorrection || null
  };
  Un(n, r, a);
}
function Mt({ assetsUrl: n } = {}) {
  n !== void 0 && Vn(n);
}
const Rt = {
  imageToSVG: _n,
  textToSVG: Ft,
  textToSpiralSVG: Pt,
  learnFont: Bt,
  configure: Mt
};
export {
  Mt as configure,
  Rt as default,
  _n as imageToSVG,
  Bt as learnFont,
  Ft as textToSVG,
  Pt as textToSpiralSVG
};
