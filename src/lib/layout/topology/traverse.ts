import { ParanoidEmmiter } from "src/lib/event-emmiter";
import { getCanvasObject } from ".";
import { ParanoidOpts, Shapes } from "../../models";
import { TreeNode, Tree } from "../../tree";
import { getBottomOffset, LEFT_OFFSET } from "./get-node-coordinates";

export function doTraverse(
  canvas: fabric.Canvas,
  opts: ParanoidOpts,
  shapes: Shapes,
  tree: Tree,
  treeTop: number,
  treeLeft: number,
  em: ParanoidEmmiter
) {
  const dimensionsMap = new Map<TreeNode, { width: number; height: number }>();
  const spaceMap = new Map<TreeNode, number>();
  const childrenSpaceMap = new Map<TreeNode, number>();
  const canvasNodes: fabric.Object[] = [];

  tree.traverseBF((node) => {
    const { object, width, height } = getCanvasObject(
      canvas,
      node,
      0,
      0,
      opts,
      shapes,
      em
    );
    dimensionsMap.set(node, { width, height });
    canvasNodes.push(object);
  });

  function calculateSpace(node: TreeNode) {
    const { width } = dimensionsMap.get(node)!;
    // Минимальное пространство, которое элемент займет в любом случае - это его ширина
    let space = width;
    let totalChildrenSpace = 0;

    // Если элемент единственный потомок и его собственная ширина меньше занимаемого пространства родителя,
    // то устанавливаем в значение родителя
    if (
      node.parent &&
      node.parent.children.length === 1 &&
      spaceMap.has(node.parent)
    ) {
      const parentSpace = spaceMap.get(node.parent) as number;

      if (space < parentSpace) {
        space = parentSpace;
      }
    }

    // Записываем как можно раньше, чтобы при вычислении потомков, могли брать в расчет данные родителя
    spaceMap.set(node, space);

    if (node.children.length > 0) {
      // Сумма всех элементов + отступы
      totalChildrenSpace =
        (node.children.length - 1) * LEFT_OFFSET +
        node.children.reduce(
          (total, child) => total + calculateSpace(child),
          0
        );
      childrenSpaceMap.set(node, totalChildrenSpace);
    }

    // Если занимаемое место потомков больше элемента, обновляем значение
    space = Math.max(space, totalChildrenSpace);
    spaceMap.set(node, space);

    return space;
  }

  function setCoordinates(
    nodes: TreeNode[],
    topOffset: number,
    leftOffset: number
  ) {
    let nextNodeLeftOffset = leftOffset;
    let nextLeftOffset = leftOffset;

    for (const node of nodes) {
      const { width, height } = dimensionsMap.get(node)!;
      const nodeSpace = spaceMap.get(node) as number;
      const top = topOffset;
      const left =
        nextNodeLeftOffset + Math.floor(nodeSpace / 2) - Math.floor(width / 2);

      node.canvasNode!.set({ top, left });
      node.canvasNode!.setCoords();

      nextNodeLeftOffset = nextNodeLeftOffset + nodeSpace + LEFT_OFFSET;

      if (node.children.length) {
        let extraOffset = 0;
        const childrenSpace = childrenSpaceMap.get(node) as number;

        if (childrenSpace < nodeSpace) {
          extraOffset = Math.floor((nodeSpace - childrenSpace) / 2);
        }

        const childrenTopOffset =
          topOffset + height + getBottomOffset(node.children.length);
        const childrenLeftOffset = nextLeftOffset + extraOffset;
        setCoordinates(node.children, childrenTopOffset, childrenLeftOffset);
      }

      nextLeftOffset = nextNodeLeftOffset;
    }
  }

  calculateSpace(tree.root);
  setCoordinates([tree.root], treeTop, treeLeft);

  return canvasNodes;
}
