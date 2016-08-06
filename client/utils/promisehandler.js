/*********************************************
      Middleware
  Handles any intermediate tasks between action creator and reducers.
  This particular piece of code handles promises from http requests using the axios library.
**********************************************/

export default function({dispatch}) {
  /*
    Check to see if the payload either:
      a) doesn't exist
      b) is not a Promise object
    The action is then sent to the reducers
  */
  return next => action => {
    if (!action.payload || !action.payload.then) {
      return next(action);
    }

    /*
      If payload is Promise, stop action and allow to finish.
    */
      action.payload
      .then(function(result) {
        /*
          Point new variable to the original action object but replace the payload property with the return promise
        */
        const newAction = { ...action, payload: result };
        /*
          Dispatch the newly referenced object
            a) Sends it back up the action creator chain
            b) Will pass the conditional on line 15 since the action is no longer a promise.
        */
        dispatch(newAction);
      });
  }
}