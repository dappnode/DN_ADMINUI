import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withTitle from "components/hoc/withTitle";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
// This page
import * as a from "../actions";
import * as s from "../selectors";
import isIpfsHash from "utils/isIpfsHash";
import isDnpDomain from "utils/isDnpDomain";
import { correctPackageName } from "../utils";
import filterDirectory from "../helpers/filterDirectory";
import { rootPath } from "../data";
import NoPackageFound from "./NoPackageFound";
import TypeFilter from "./TypeFilter";
import DnpStore from "./DnpStore";
// Components
import Input from "components/Input";
import { ButtonLight } from "components/Button";
import Loading from "components/generic/Loading";
import Error from "components/generic/Error";
import SubTitle from "components/SubTitle";
// Selectors
import { getMainnet } from "services/chainData/selectors";
import {
  getIsLoading,
  getLoadingError
} from "services/loadingStatus/selectors";
import { rootPath as packagesRootPath } from "pages/packages/data";
// Styles
import "./installer.scss";
import IsSyncing from "./IsSyncing";

function InstallerHome({
  // variables
  directory,
  mainnetIsSyncing,
  loading,
  error,
  history,
  // Actions
  fetchPackageData,
  fetchPackageDataFromQuery
}) {
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState({});

  useEffect(() => {
    // If the packageLink is a valid IPFS hash preload it's info
    if (isIpfsHash(query) || isDnpDomain(query))
      fetchPackageDataFromQuery(query);
  }, [query]);

  function openDnp(id) {
    const dnp = directory.find(({ name }) => name === id);
    if ((dnp || {}).tag === "UPDATED") {
      history.push(packagesRootPath + "/" + dnp.name);
    } else {
      fetchPackageData(id);
      history.push(rootPath + "/" + encodeURIComponent(id));
    }
  }

  function onTypeChange(type) {
    setSelectedTypes(ts => ({ ...ts, [type]: !ts[type] }));
  }

  const directoryFiltered = filterDirectory({
    directory,
    query,
    selectedTypes
  });

  /**
   * 1. If the query is a valid IPFS hash, open it
   * 2. If the query matches exactly one DNP, open it
   * 0. Else open the query
   */
  function runQuery() {
    if (isIpfsHash(query)) return openDnp(query);
    if (directoryFiltered.length === 1)
      return openDnp(directoryFiltered[0].name);
    else openDnp(query);
  }

  const types = {
    ...directory.reduce((obj, { manifest = {} }) => {
      if (manifest.type) obj[manifest.type] = false;
      return obj;
    }, {}),
    ...selectedTypes
  };

  /**
   * Isolate the switching logic:
   * 1. If there is a search and it's empty show "NoDnp"
   * 2. If it is still syncing, show "IsSyncing"
   * 3. If it is loading, show "Loading"
   * 0. Else show the DnpStore
   */
  function Body() {
    if (directory.length) {
      if (!directoryFiltered.length) return <NoPackageFound query={query} />;
      // All is good, display actual DnpStore
      const isFeatured = dnp => dnp.name.includes("raiden");
      const directoryFeatured = directoryFiltered.filter(dnp =>
        isFeatured(dnp)
      );
      const directoryNotFeatured = directoryFiltered.filter(
        dnp => !isFeatured(dnp)
      );
      return (
        <>
          <SubTitle>Featured</SubTitle>
          <DnpStore
            directory={directoryFeatured}
            openDnp={openDnp}
            featured={true}
          />
          <DnpStore directory={directoryNotFeatured} openDnp={openDnp} />
        </>
      );
    } else {
      if (mainnetIsSyncing) return <IsSyncing />;
      if (error) return <Error msg={`Error loading DNPs: ${error}`} />;
      if (loading) return <Loading msg="Loading DNPs..." />;
    }
    // Fallback
    return <Error msg={`Unknown error`} />;
  }

  return (
    <>
      <Input
        placeholder="DNP's name or IPFS hash"
        value={query}
        onValueChange={value => setQuery(correctPackageName(value))}
        onEnterPress={runQuery}
        append={<ButtonLight onClick={runQuery}>Search</ButtonLight>}
      />

      <TypeFilter types={types} onTypeChange={onTypeChange} />

      <Body />
    </>
  );
}

InstallerHome.propTypes = {
  // State -> props
  directory: PropTypes.array.isRequired,
  selectedTypes: PropTypes.object.isRequired,
  inputValue: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  mainnetIsSyncing: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  // Dispatch -> props
  fetchPackageData: PropTypes.func.isRequired,
  fetchPackageDataFromQuery: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  directory: s.getDnpDirectoryWithTagsNonCores,
  directoryLoaded: s.directoryLoaded,
  selectedTypes: s.getSelectedTypes,
  inputValue: s.getInputValue,
  mainnetIsSyncing: state => Boolean((getMainnet(state) || {}).syncing),
  loading: getIsLoading.dnpDirectory,
  error: getLoadingError.dnpDirectory
});

const mapDispatchToProps = {
  fetchPackageData: a.fetchPackageData,
  fetchPackageDataFromQuery: a.fetchPackageDataFromQuery
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTitle("Installer")
)(InstallerHome);
