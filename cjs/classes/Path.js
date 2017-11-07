'use strict';
const {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
  ELEMENT_NODE
} = require('../shared/constants.js');

const prepend = (path, parent, node) => {
  path.unshift(
    'childNodes',
    path.indexOf.call(parent.childNodes, node)
  );
};

const createPath = node => {
  const path = [];
  let parentNode;
  switch (node.nodeType) {
    case ELEMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      parentNode = node;
      break;
    case COMMENT_NODE:
      parentNode = node.parentNode;
      prepend(path, parentNode, node);
      break;
    case ATTRIBUTE_NODE:
    default: // jsdom here does not provide a nodeType 2 ...
      parentNode = node.ownerElement;
      path.unshift('attributes', node.name);
      break;
  }
  for (
    node = parentNode;
    (parentNode = parentNode.parentNode);
    node = parentNode
  ) {
    prepend(path, parentNode, node);
  }
  return path;
};

function Path(type, node, name) {
  return {type, name, path: createPath(node)};
}
Object.defineProperty(exports, '__esModule', {value: true}).default = Path

Path.finder = (parent, path) => {
  const length = path.length;
  for (let i = 0; i < length; i++) {
    parent = parent[path[i++]][path[i]];
  }
  return parent;
};