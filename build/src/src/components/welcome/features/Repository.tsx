import React, { useState, useEffect } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { EthMultiClientsAndFallback } from "components/EthMultiClient";
import { EthClientTarget, EthClientFallback } from "types";
import { getEthClientTarget } from "services/dappnodeStatus/selectors";
import BottomButtons from "../BottomButtons";
import * as api from "API/calls";

/**
 * View to chose or change the Eth multi-client
 * There are three main options:
 * - Remote
 * - Light client
 * - Full node
 * There may be multiple available light-clients and fullnodes
 */
function Repository({
  onBack,
  onNext,
  // Redux
  ethClientTarget
}: {
  onBack?: () => void;
  onNext: () => void;
  ethClientTarget?: EthClientTarget | null;
}) {
  const [target, setTarget] = useState<EthClientTarget>("remote");
  // Use fallback by default
  const [fallback, setFallback] = useState<EthClientFallback>("on");

  useEffect(() => {
    if (ethClientTarget) setTarget(ethClientTarget);
  }, [ethClientTarget]);

  async function changeClient() {
    if (target) {
      api.ethClientTargetSet({ target }).catch(e => {
        console.error(`Error on ethClientTargetSet: ${e.stack}`);
      });
      // Only set the fallback if the user is setting a target
      // Otherwise, the fallback could be activated without the user wanting to
      if (fallback === "on")
        api.ethClientFallbackSet({ fallback }).catch(e => {
          console.error(`Error on ethClientFallbackSet: ${e.stack}`);
        });
    }
    onNext();
  }

  return (
    <>
      <div className="header">
        <div className="title">Repository Source</div>
        <div className="description">
          DAppNode uses smart contracts to access a decentralized respository of
          DApps
          <br />
          Choose to connect to a remote network or use your own local node
        </div>
      </div>

      <EthMultiClientsAndFallback
        target={target}
        onTargetChange={setTarget}
        showStats
        fallback={fallback}
        onFallbackChange={setFallback}
      />

      <BottomButtons onBack={onBack} onNext={changeClient} />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  ethClientTarget: getEthClientTarget
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Repository);
