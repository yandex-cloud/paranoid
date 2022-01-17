import { Tree, TreeNode } from "./tree";
import { Data, Link, GraphNode, ParanoidOpts } from "./models";
import { NodeType } from "./constants";

export interface GraphGroupNode<TData = any> {
  name: string;
  type: NodeType;
  children: string[];
  data: TData;
}

export type Source = GraphGroupNode | GraphNode;

interface ElementWithChildren {
  children: string[];
  name: string;
  type?: string;
}

export default class Parser {
  data: Data;
  opts: ParanoidOpts;
  nodes = new Map<string, TreeNode>();

  constructor(data: Data, opts: ParanoidOpts) {
    this.data = data;
    this.opts = opts;
  }

  parseData() {
    const data = this.data;
    // groups also can be tree roots
    // get groups and add them to graph nodes
    const groups = this.getGroups(data);
    const nodesAndGroupNodes: Source[] = [...data.nodes];
    groups.forEach((children, name) => {
      nodesAndGroupNodes.push({ name, children, type: NodeType.Group });
    });

    // find each graph source (tree root)
    const sources = this.findSources(nodesAndGroupNodes, data.links);

    // build trees from sources
    let trees: Tree[] = [];
    let groupNodes: Record<string, TreeNode> = {};
    let nonGroupMembersChildren = new Map<string, TreeNode[]>();
    sources.forEach((source) => {
      const nodes = this.mapNodesToTree(source, nodesAndGroupNodes, data.links);
      groupNodes = { ...nodes.groups, ...groupNodes };
      nonGroupMembersChildren = new Map([
        ...nonGroupMembersChildren,
        ...nodes.notGroupMemebersChildren,
      ]);
      trees.push(nodes.tree);
    });

    nonGroupMembersChildren.forEach((children, groupName) => {
      if (groupNodes[groupName]) {
        groupNodes[groupName].addNodes(children);
      }
    });
    // filter out trees which members of groups
    trees = trees.reduce((acc, tree) => {
      const group = (tree.root.data as GraphNode).group;
      if (group) {
        groupNodes[group].members.push(tree);
      } else {
        acc.push(tree);
      }
      return acc;
    }, [] as Tree<Source>[]);

    return trees;
  }

  private getGroups({ nodes }: Data) {
    const groups = new Map<string, string[]>();

    nodes.forEach((node) => {
      if (node.group) {
        const group = groups.get(node.group);

        if (group) {
          group.push(node.name);
        } else {
          groups.set(node.group, [node.name]);
        }
      }
    });

    return groups;
  }

  private findSources(nodes: Source[], links: Link[]): Source[] {
    const parentLinks = links.map(({ to }) => to);
    // find nodes what doesn't have any income links, it should be our sources
    return nodes.reduce((acc, node) => {
      if (!parentLinks.includes(node.name)) {
        acc.push(node);
      }

      return acc;
    }, [] as Source[]);
  }

  private mapNodesToTree(source: Source, nodes: Source[], links: Link[]) {
    const treeRoot = this.createNode(source);
    const groups: Record<string, TreeNode> = {};
    this.appendGoup(groups, treeRoot);

    const treeNodes = nodes.map((node) => {
      const children = links.reduce((acc, link) => {
        if (link.from === node.name) {
          acc.push(link.to);
        }
        return acc;
      }, [] as string[]);

      return {
        ...node,
        children,
      };
    });

    const appendNodes = this.getAppender(treeNodes, groups);
    const sourceChildren =
      (treeNodes as { name: string; children?: string[] }[]).find(
        (node) => node.name === source.name
      )?.children || [];
    const notGroupMemebersChildren = appendNodes(treeRoot, sourceChildren);

    return {
      tree: new Tree(treeRoot),
      groups,
      notGroupMemebersChildren,
    };
  }

  private appendGoup(groups: Record<string, TreeNode>, node: TreeNode) {
    const data = node.data;
    const type = (node.data as GraphGroupNode).type;

    if (type === NodeType.Group) {
      groups[data.name] = node;
    }
  }

  private getAppender(
    data: ElementWithChildren[],
    groups: Record<string, TreeNode>
  ) {
    const notGroupMemebersChildren: Map<string, TreeNode[]> = new Map();
    const appendNodesToTree = (root: TreeNode, children: string[]) => {
      const treeNodeChildren = children.map((child) => {
        const node = data.find(
          ({ name }) => name === child
        ) as ElementWithChildren;
        const treeNode = this.createNode(node as Source);

        // save group if any
        this.appendGoup(groups, treeNode);
        if (node.children.length > 0) {
          appendNodesToTree(treeNode, node.children);
        }

        return treeNode;
      });
      const parentGroupName = (root.data as GraphNode).group;
      const parentHasGroup = Boolean(parentGroupName);
      const parentChildren: TreeNode[] = [];

      // this is groups what belong to parnet, but not included in group. They should be added to group children,
      // but they still have links form original parent node, not group
      const groupChildren: TreeNode[] = [];
      treeNodeChildren.forEach((tree) => {
        const group = (tree.data as GraphNode).group;

        if (!parentHasGroup) {
          parentChildren.push(tree);
        } else if (parentGroupName === group) {
          parentChildren.push(tree);
        } else {
          groupChildren.push(tree);
        }
      });
      root.addNodes(parentChildren);

      if (parentGroupName && groupChildren.length > 0) {
        const parentGroupChildren =
          notGroupMemebersChildren.get(parentGroupName);
        if (parentGroupChildren) {
          parentGroupChildren.push(...groupChildren);
        } else {
          notGroupMemebersChildren.set(parentGroupName, groupChildren);
        }
      }

      return notGroupMemebersChildren;
    };

    return appendNodesToTree;
  }

  private createNode(source: Source) {
    const node = new TreeNode(source);
    this.nodes.set(source.name, node);
    return node;
  }
}
