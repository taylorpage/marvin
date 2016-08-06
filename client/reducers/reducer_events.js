import { SET_EVENTS } from '../actions/index.js';

export default function (state = [], action) {
  console.log(action);
  switch (action.type) {
    case SET_EVENTS:
      return state.concat(action.payload);
  }

  return state;
};