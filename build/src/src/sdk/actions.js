// INSTALLER
import t from "./actionTypes";

// Used in package root

export const updateRegistryFetching = (registryEns, fetching) => ({
  type: t.UPDATE_REGISTRY,
  registryEns,
  data: { fetching }
});

export const updateRegistry = (registryEns, data) => ({
  type: t.UPDATE_REGISTRY,
  registryEns,
  data
});

export const updateRepo = (registryEns, repoName, data) => ({
  type: t.UPDATE_REPO,
  registryEns,
  repoName,
  data
});

export const validateRepoName = repoName => ({
  type: t.VALIDATE_REPO_NAME,
  repoName
});

export const updateRepoName = (repoName, data) => ({
  type: t.UPDATE_REPO_NAME,
  repoName,
  data
});

export const updateQuery = (id, value) => ({
  type: t.UPDATE_QUERY,
  id,
  value
});

export const updateQueryResult = (id, data) => ({
  type: t.UPDATE_QUERY_RESULT,
  id,
  data
});

export const fetchRegistry = registryEns => ({
  type: t.FETCH_REGISTRY,
  registryEns
});

// #### After removing a package, uninstallChain
