import * as actions from "./actions";
import * as constants from "./constants";
import reducer from "./reducer";
import * as selectors from "./selectors";
import saga from "./sagas";
import InstallerRoot from "./components/InstallerRoot";
import ProgressLog from "./components/InstallCardComponents/ProgressLog";

const components = {
  InstallerRoot,
  ProgressLog
};

const component = InstallerRoot;

export default {
  actions,
  component,
  components,
  constants,
  reducer,
  selectors,
  saga
};
