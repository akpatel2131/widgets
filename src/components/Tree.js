export default function TreeCreation(list) {
  let mapTree = {};
  let node;
  let allRoots = [];

  for (let i = 0; i < list.length; i += 1) {
    mapTree[list[i].id] = i;
    list[i].children = [];
  }
  // console.log("mapTree", mapTree);

  for (let i = 0; i < list.length; i += 1) {
    node = list[i];
    // console.log("node", node);
    if (node.parentId) {
      // if no parent -> no DOM to be made (? check used)
      list[mapTree[node.parentId]]?.children.push(node);
    } else {
      allRoots.push(node);
    }
  }

  return allRoots;
}
