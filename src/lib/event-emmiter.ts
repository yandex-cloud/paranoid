import { TreeNode } from "./tree";

export class ResizeEvent extends CustomEvent<TreeNode> {}

export class ParanoidEmmiter extends EventTarget {
  dispatch(eventName: string, data: TreeNode) {
    this.dispatchEvent(new ResizeEvent(eventName, { detail: data }));
  }
}
