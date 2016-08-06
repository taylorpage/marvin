export const SET_EVENTS = 'SET_EVENTS';

export function setEvents (event) {
  return {
    type: SET_EVENTS,
    payload: event
  };
}
