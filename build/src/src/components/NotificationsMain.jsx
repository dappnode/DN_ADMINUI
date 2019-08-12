import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
// Selectors
import {
  getCoreUpdateAvailable,
  getIsCoreUpdateTypePatch,
  getUpdatingCore
} from "services/coreUpdate/selectors";
import { getAreWifiCredentialsDefault } from "services/dnpInstalled/selectors";
import {
  getIsWifiRunning,
  getPasswordIsInsecure,
  getIsCoreAutoUpdateActive
} from "services/dappnodeStatus/selectors";
import { rootPath as systemRootPath, updatePath } from "pages/system/data";
import { rootPath as packagesRootPath } from "pages/packages/data";

/**
 * Aggregate notification and display logic
 */
const NotificationsView = ({
  coreUpdateAvailable,
  updatingCore,
  isCoreUpdateTypePatch,
  isCoreAutoUpdateActive,
  areWifiCredentialsDefault,
  isWifiRunning,
  passwordIsInsecure
}) => {
  const notifications = [
    /**
     * [SYSTEM-UPDATE]
     * Tell the user to update the core DNPs
     */
    {
      id: "systemUpdate",
      linkText: "Update",
      linkPath: systemRootPath + "/" + updatePath,
      body:
        "**DAppNode system update available.** Click **Update** to review and approve it",
      active:
        coreUpdateAvailable &&
        !updatingCore &&
        // Show if NOT patch, or if patch is must not be active
        (!isCoreUpdateTypePatch || !isCoreAutoUpdateActive)
    },
    /**
     * [WIFI-PASSWORD]
     * Tell the user to change the wifi credentials
     */
    {
      id: "wifiCredentials",
      linkText: "Change",
      linkPath: packagesRootPath + "/wifi.dnp.dappnode.eth/config",
      body:
        "**Change the DAppNode WIFI credentials**, they are insecure default values.",
      active: areWifiCredentialsDefault && isWifiRunning
    },
    /**
     * [HOST-USER-PASSWORD]
     * Tell the user to change the host's "dappnode" user password
     */
    {
      id: "hostPasswordInsecure",
      linkText: "Change",
      linkPath: systemRootPath,
      body:
        "**Change the host 'dappnode' user password**, it's an insecure default.",
      active: passwordIsInsecure
    }
  ];

  return (
    <div>
      {notifications
        .filter(({ active }) => active)
        .map(({ id, linkText, linkPath, body }) => (
          <div
            id={id}
            key={id}
            className="alert alert-warning alert-dismissible show"
            role="alert"
          >
            <Link
              className="btn btn-warning float-right"
              style={{ marginLeft: "0.5rem" }}
              to={linkPath}
            >
              {linkText}
            </Link>

            <ReactMarkdown source={body} />

            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ))}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  coreUpdateAvailable: getCoreUpdateAvailable,
  updatingCore: getUpdatingCore,
  isCoreUpdateTypePatch: getIsCoreUpdateTypePatch,
  isCoreAutoUpdateActive: getIsCoreAutoUpdateActive,
  areWifiCredentialsDefault: getAreWifiCredentialsDefault,
  isWifiRunning: getIsWifiRunning,
  passwordIsInsecure: getPasswordIsInsecure
});

export default connect(
  mapStateToProps,
  null
)(NotificationsView);
