// @flow strict

/*::
import type {ImmutableTree} from './types.mjs';
*/

function countSize(
  tree/*: ImmutableTree<mixed> | null */,
)/*: number */ {
  if (tree === null) {
    return 0;
  }
  return 1 + countSize(tree.left) + countSize(tree.right);
}

function checkBalance(
  tree/*: ImmutableTree<mixed> */,
)/*: boolean */ {
  if (
    (tree.left === null || tree.left.size === 1) &&
    (tree.right === null || tree.right.size === 1)
  ) {
    return true;
  }
  return (
    (tree.left === null ? 0 : tree.left.size) <=
      (3 * (tree.right === null ? 0 : tree.right.size)) &&
    (tree.right === null ? 0 : tree.right.size) <=
      (3 * (tree.left === null ? 0 : tree.left.size))
  );
}

export default function checkTreeInvariants/*:: <T> */(
  tree/*: ImmutableTree<T> | null */,
  cmp/*: (T, T) => number */,
)/*: boolean */ {
  if (tree === null) {
    return true;
  }

  const actualSize = countSize(tree);
  if (tree.size !== actualSize) {
    throw Error('Wrong tree size');
  }

  const isBalanced = checkBalance(tree);
  if (!isBalanced) {
    throw Error('Unbalanced tree');
  }

  const left = tree.left;
  if (left) {
    if (cmp(left.value, tree.value) >= 0) {
      throw Error('Invalid left subtree');
    }
    checkTreeInvariants(left, cmp);
  }

  const right = tree.right;
  if (right) {
    if (cmp(right.value, tree.value) <= 0) {
      throw Error('Invalid right subtree');
    }
    checkTreeInvariants(right, cmp);
  }

  return true;
}
