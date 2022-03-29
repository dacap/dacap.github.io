$(function(){
  var maxScore = 1;
  var $canvas = $('#map');
  var ctx = $canvas.get(0).getContext('2d');
  var tilew = 16;
  var tileh = 16;
  var mapw = Math.ceil($canvas.width() / tilew);
  var maph = Math.ceil($canvas.height() / tileh);
  var map = [];
  for (var v=0; v<maph; ++v) {
    var row = [];
    for (var u=0; u<mapw; ++u) {
      row.push({ solid: (u == mapw/2 && Math.abs(maph/2-v) < maph/4) });
    }
    map.push(row);
  }

  // Well-known points
  var pt1 = { u: mapw/2-10, v: maph/2 };
  var pt2 = { u: mapw/2+10, v: maph/2 };
  var hoverPt = undefined;

  findPath();
  renderMap();

  // Events
  $canvas.on('mousemove', onMouseMove);
  $canvas.on('mousedown', onMouseDown);

  function ptsDistance(a, b) {
    var w = a.u - b.u;
    var h = a.v - b.v;
    return Math.sqrt(w*w + h*h);
    // return Math.abs(w) + Math.abs(h);
  }

  function renderMap() {
    for (var v=0; v<maph; ++v) {
      for (var u=0; u<mapw; ++u) {
        var r = mapToCanvas(u, v);
        var tile = map[v][u];

        if (pt1.u == u && pt1.v == v)
          ctx.fillStyle = '#0000ff';
        else if (pt2.u == u && pt2.v == v)
          ctx.fillStyle = '#0000ff';
        else if (tile.solid)
          ctx.fillStyle = '#008000';
        else if (tile.best) {
          ctx.fillStyle = 'rgb(0, 0, 255)';
        }
        else if (tile.node && maxScore) {
          var k = 126 + Math.floor(126 * nodeScore(tile.node) / maxScore);
          ctx.fillStyle = 'rgb('+k+','+k+','+k+')';
        }
        else
          ctx.fillStyle = '#ffffff';

        ctx.fillRect(r.x, r.y, r.w, r.h);
      }
    }

    if (hoverPt !== undefined) {
      var ctxHoverPt = mapToCanvas(hoverPt);
      var pt = (ptsDistance(hoverPt, pt1) <= ptsDistance(hoverPt, pt2)) ? pt1: pt2;
      var ctxPt = mapToCanvas(pt);
      ctx.beginPath();
      ctx.moveTo(ctxPt.cx, ctxPt.cy);
      ctx.lineTo(ctxHoverPt.cx, ctxHoverPt.cy);
      ctx.strokeStyle = '#0000ff';
      ctx.stroke();

      ctx.beginPath();
      var angle = Math.atan2(ctxPt.cy-ctxHoverPt.cy,
                             ctxPt.cx-ctxHoverPt.cx);
      ctx.moveTo(ctxHoverPt.cx+16*Math.cos(angle)+4*Math.cos(angle+Math.PI/2),
                 ctxHoverPt.cy+16*Math.sin(angle)+4*Math.sin(angle+Math.PI/2));
      ctx.lineTo(ctxHoverPt.cx+16*Math.cos(angle)+4*Math.cos(angle-Math.PI/2),
                 ctxHoverPt.cy+16*Math.sin(angle)+4*Math.sin(angle-Math.PI/2));
      ctx.lineTo(ctxHoverPt.cx, ctxHoverPt.cy);
      ctx.fillStyle = '#0000ff';
      ctx.fill();
    }
  }

  function nodeScore(node) {
    return node.g + node.h;
  }

  function findPath() {
    var open = new BinaryHeap(bestNode);
    var close = [];

    var cur, bestpath;
    open.push(createNode(pt1));
    while (open.peek() != undefined) {
      cur = open.pop();
      close.push(cur);

      if (cur.pt.u == pt2.u && cur.pt.v == pt2.v) {
        bestpath = cur;
        break;
      }

      addAdjacents(cur);
    }

    for (var v=0; v<maph; ++v) {
      for (var u=0; u<mapw; ++u) {
        map[v][u].best = undefined;
        map[v][u].node = undefined;
      }
    }
    maxScore = 0;
    for (var i=0; i<close.length; ++i) {
      var node = close[i];
      map[node.pt.v][node.pt.u].node = node;
      maxScore = Math.max(maxScore, nodeScore(node));
    }
    if (bestpath) {
      cur = bestpath;
      while (cur) {
        map[cur.pt.v][cur.pt.u].best = cur;
        cur = cur.parent;
      }
    }

    function bestNode(nodeA, nodeB) {
      return nodeScore(nodeA) < nodeScore(nodeB);
    }

    function gcost(node) {
      return (node.parent ?
              node.parent.g+((node.pt.u != node.parent.pt.u &&
                              node.pt.v != node.parent.pt.v)? 4: 2) : 0);
    }

    function hcost(node) {
      return ptsDistance(node.pt, pt2);
    }

    function createNode(pt, parent) {
      var node = { pt:pt, g:0, h:0, parent:parent };
      node.g = gcost(node);
      node.h = hcost(node);
      return node;
    }

    function addNode(node) {
      if (map[node.pt.v][node.pt.u] &&
          map[node.pt.v][node.pt.u].solid)
        return;

      for (var i=0; i<close.length; ++i)
        if (close[i].pt.u == node.pt.u &&
            close[i].pt.v == node.pt.v) {
          return;
        }

      for (var i=0; i<open.list.length; ++i) {
        var openNode = open.list[i];
        if (openNode.pt.u == node.pt.u &&
            openNode.pt.v == node.pt.v) {
          if (bestNode(node, openNode) > 0) {
            openNode.parent = node.parent;
            openNode.g = gcost(openNode);
            open.sink(i);
          }
          return;
        }
      }

      open.push(node);
    }

    function addAdjacents(node) {
      var pt = node.pt;

      function add(du, dv) {
        addNode(createNode({ u: pt.u+du,
                             v: pt.v+dv }, node));
      }

      if (pt.v > 0) {
        if (pt.u > 0) add(-1, -1);
        add(0, -1);
        if (pt.u < mapw-1) add(+1, -1);
      }

      if (pt.u > 0) add(-1, 0);
      if (pt.u < mapw-1) add(+1, 0);

      if (pt.v < maph-1) {
        if (pt.u > 0) add(-1, +1);
        add(0, +1);
        if (pt.u < mapw-1) add(+1, +1);
      }
    }
  }

  function mouseEvToMap(ev) {
    return { u: Math.floor(ev.offsetX / tilew),
             v: Math.floor(ev.offsetY / tileh) };
  }

  function mapToCanvas(u, v) {
    if (v === undefined) {
      v = u.v;
      u = u.u;
    }
    var x = Math.floor(u * tilew);
    var y = Math.floor(v * tileh);
    return { x: x,
             y: y,
             w: tilew,
             h: tileh,
             cx: x + tilew/2,
             cy: y + tileh/2 };
  }

  function onMouseMove(ev) {
    hoverPt = mouseEvToMap(ev);
    renderMap();
  }

  function onMouseDown(ev) {
    var pt = mouseEvToMap(ev);
    if (ptsDistance(pt, pt1) <= ptsDistance(pt, pt2))
      pt1 = pt;
    else
      pt2 = pt;

    findPath();
    renderMap();
  }
})
