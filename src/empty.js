// @flow strict

/*::
import type {EmptyImmutableTree} from './types.js';
*/

// $FlowIgnore[unclear-type]
let _empty/*: any */ = {
  left: null,
  right: null,
  size: 0,
  value: undefined,
};
_empty.left = _empty;
_empty.right = _empty;
Object.freeze(_empty);

const empty/*: EmptyImmutableTree */ = _empty;

export default empty;
