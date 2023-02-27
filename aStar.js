// from: an object with x, y fields.
// to: an object with x, y fields.
// obstacles: an array of such objects with the coordinates that cannot be used.
// maxsteps: maximum algorithm steps before giving up
// return: an array describing the path, from 'from' to 'to', exluding 'from'.
//         null if path cannot be found.
function shortestPath(from, to, obstacles, maxSteps) {
  var openNodes = [{
    node: from,
    g: 0,
    f: hCost(from, to),
    parent: null
  }];

  var closedNodes = [...obstacles];

  while (maxSteps-- > 0 && openNodes.length > 0) {
    var currentNode = popNodeWithSmallestF(openNodes);
    closedNodes.push(currentNode.node);

    if (nodeEquals(currentNode.node, to)) {
      var path = [];
      for (var n = currentNode; n.parent != null; n = n.parent) {
        path.unshift(n.node);
      }
      return path;
    }

    var neighbors = getNeighbors(currentNode.node);
    for (var i = 0; i < neighbors.length; i++) {
      n = neighbors[i];
      if (hasNode(closedNodes, n)) {
        continue;
      }

      addOrReplaceIfShorter(openNodes, {
        node: n,
        g: currentNode.g + 1,
        f: currentNode.g + 1 + hCost(n, to),
        parent: currentNode
      });
    }
  }

  return null;
}

function popNodeWithSmallestF(nodes) {
  var smallest = 0;
  for (var i = 1; i < nodes.length; i++) {
    if (nodes[i].f < nodes[smallest].f) {
      smallest = i;
    }
  }
  return nodes.splice(smallest, 1)[0];
}

function getNeighbors(node) {
  return [{
      x: node.x - 1,
      y: node.y
    },
    {
      x: node.x + 1,
      y: node.y
    },
    {
      x: node.x,
      y: node.y - 1
    },
    {
      x: node.x,
      y: node.y + 1
    }
  ];
}

function nodeEquals(n1, n2) {
  return n1.x == n2.x && n1.y == n2.y;
}

function hCost(from, to) {
  return Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
}

function hasNode(nodes, n) {
  for (var i = 0; i < nodes.length; i++) {
    node = nodes[i];
    if (nodeEquals(node, n)) {
      return true;
    }
  }
  return false;
}

function addOrReplaceIfShorter(nodes, n) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodeEquals(nodes[i].node, n.node)) {
      if (n.f < nodes[i].f) {
        nodes[i] = n;
      }
      return;
    }
  }
  nodes.push(n);
}
