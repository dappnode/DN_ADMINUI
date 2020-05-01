import * as selectors from "./selectors";
import reducer from "./reducer";
import { mountPoint } from "./data";

/**
 * Service > connectionStatus
 *
 * Keeps track of the DAppNode's WAMP connection status.
 * Some redux-sagas may want to consult this state to know if the connection is open
 * before doing a call that will fail.
 *
 * [Tested]
 */

export { CONNECTION_OPEN, CONNECTION_CLOSE } from "./types";

export default {
  mountPoint,
  selectors,
  reducer
};