import React, { useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import {
  fallbackToBoolean,
  booleanToFallback
} from "components/EthMultiClient";
import { EthClientFallback } from "types";
import { getEthClientFallback } from "services/dappnodeStatus/selectors";
import BottomButtons from "../BottomButtons";
import * as api from "API/calls";
import Alert from "react-bootstrap/Alert";
import SwitchBig from "components/SwitchBig";

/**
 * View to chose or change the Eth multi-client
 * There are three main options:
 * - Remote
 * - Light client
 * - Full node
 * There may be multiple available light-clients and fullnodes
 */
function RepositoryFallback({
  onBack,
  onNext,
  // Redux
  ethClientFallback
}: {
  onBack?: () => void;
  onNext: () => void;
  ethClientFallback?: EthClientFallback;
}) {
  // Use fallback by default
  const [fallback, setFallback] = useState<EthClientFallback>("on");

  useEffect(() => {
    if (ethClientFallback) setFallback(ethClientFallback);
  }, [ethClientFallback]);

  async function changeFallback() {
    api.ethClientFallbackSet({ fallback }).catch(e => {
      console.error(`Error on ethClientFallbackSet: ${e.stack}`);
    });

    onNext();
  }

  return (
    <>
      <div className="header">
        <div className="title">Repository Fallback</div>
        <div className="description">
          DAppNode uses smart contracts to access a decentralized respository of
          DApps
          <br />
          Choose to use a remote node maintained by DAppNode Association if your
          node is not available (while syncing or failed)
        </div>
      </div>

      <div className="repository-fallback-switch">
        <SwitchBig
          checked={fallbackToBoolean(fallback)}
          onChange={bool => setFallback(booleanToFallback(bool))}
          label="Use remote during syncing or errors"
          id="repository-fallback-switch"
        />

        {fallback === "off" && (
          <Alert variant="warning">
            If your node is not available, you won't be able to update packages
            or access the DAppStore.
          </Alert>
        )}
      </div>

      <BottomButtons onBack={onBack} onNext={changeFallback} />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  ethClientFallback: getEthClientFallback
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoryFallback);