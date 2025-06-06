// @flow strict

export default function shuffle(array/*: Array<number> */)/*: void */ {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // $FlowIssue[unsupported-syntax]
    [array[i], array[j]] = [array[j], array[i]];
  }
}
