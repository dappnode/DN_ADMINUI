import React, { useState } from "react";
import * as api from "API/calls";
import BottomButtons from "../BottomButtons";
import SwitchBig from "components/SwitchBig";
// External
import { autoUpdateIds } from "services/dappnodeStatus/data";

/**
 * Offer the option to turn on system auto-updates
 */
export default function SystemAutoUpdates({
  onBack,
  onNext
}: {
  onBack?: () => void;
  onNext: () => void;
}) {
  const [autoUpdateOn, setAutoUpdateOn] = useState(false);

  /**
   * The only change it will persist is turning all auto-update settings on
   * If the user does not toggle the switch, the settings will be left as they are
   * which might be partially on / off
   */
  function onSetAutoUpdates() {
    const id = autoUpdateIds.SYSTEM_PACKAGES;
    if (autoUpdateOn)
      api.autoUpdateSettingsEdit({ id, enabled: true }).catch(e => {
        console.error(`Error on autoUpdateSettingsEdit ${id}: ${e.stack}`);
      });
    onNext();
  }

  return (
    <>
      <div className="header">
        <div className="title">System auto updates</div>
        <div className="description">
          Enable system auto-updates for DAppNode to install automatically the
          latest versions.
          <br />
          For major breaking updates, your approval will always be required.
        </div>
      </div>

      {/* This top div prevents the card from stretching vertically */}
      <div className="auto-updates-switch">
        <SwitchBig
          checked={autoUpdateOn}
          onChange={setAutoUpdateOn}
          label="Enable system auto-updates"
          id="auto-updates-switch"
        />
      </div>

      <BottomButtons onBack={onBack} onNext={onSetAutoUpdates} />
    </>
  );
}