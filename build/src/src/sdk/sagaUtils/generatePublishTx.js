import semverToArray from "../utils/semverToArray";
import web3 from "./web3";
import { isAddress } from "web3-utils";
import resolveEns from "./resolveEns";
import registryContract from "contracts/registry.json";
import repoContract from "contracts/repository.json";

const isZeroAddress = address => parseInt(address, 10) === 0;

function getRegistryFromRepo(repoName) {
  return repoName
    .split(".")
    .slice(1)
    .join(".");
}

// Check if the registry and repo exist
async function resolveRepoName(repoName) {
  const registryName = getRegistryFromRepo(repoName);
  const [repoAddress, registryAddress] = await Promise.all(
    [repoName, registryName].map(resolveEns)
  );
  return { repoAddress, registryAddress };
}

/**
 * Generates the transaction data necessary to publish the package.
 * It will check if the repository exists first:
 * - If it exists:
 * - If it does not exists:
 *
 * Then it will construct the txData object = {to, value, data, gasLimit} and:
 * - Write it on deploy.txt
 * - Show it on screen
 */

async function generatePublishTx({
  ensName,
  manifestIpfsPath,
  version,
  developerAddress
}) {
  const { repoAddress, registryAddress } = resolveRepoName(ensName);

  // Compute tx data
  const contentURI =
    "0x" + Buffer.from(manifestIpfsPath, "utf8").toString("hex");
  // @param _contractAddress address for smart contract logic for version (if set to 0, it uses last versions' contractAddress)
  const contractAddress = "0x0000000000000000000000000000000000000000";
  const shortName = ensName.split(".")[0];

  // Ensure that a valid registry exists
  if (!registryAddress)
    throw Error(`There must exist a registry for DNP name ${ensName}`);

  // If repository exists, push new version to it
  if (repoAddress) {
    // newVersion(
    //     uint16[3] _newSemanticVersion,
    //     address _contractAddress,
    //     bytes _contentURI
    // )
    const repo = new web3.eth.Contract(repoContract.abi, repoAddress);
    const newVersionCall = repo.methods.newVersion(
      version.split("."), // uint16[3] _newSemanticVersion
      contractAddress, // address _contractAddress
      contentURI // bytes _contentURI
    );
    return {
      To: repoAddress,
      Value: 0,
      Data: newVersionCall.encodeABI(),
      "Gas limit": 300000
    };
  }
  // If repo does not exist, create a new repo and push version
  else {
    // A developer address can be provided by the option developerAddress.
    // If it is not provided a prompt will ask for it
    if (
      !developerAddress ||
      !isAddress(developerAddress) ||
      isZeroAddress(developerAddress)
    ) {
      throw Error(
        "The developer address must be valid and non-zero. Please make sure it is correct"
      );
    }

    // newRepoWithVersion(
    //     string _name,
    //     address _dev,
    //     uint16[3] _initialSemanticVersion,
    //     address _contractAddress,
    //     bytes _contentURI
    // )
    const registry = new web3.eth.Contract(
      registryContract.abi,
      registryAddress
    );
    const newRepoWithVersionCall = registry.methods.newRepoWithVersion(
      shortName, // string _name
      developerAddress, // address _dev
      semverToArray(version), // uint16[3] _initialSemanticVersion
      contractAddress, // address _contractAddress
      contentURI // bytes _contentURI
    );
    return {
      To: registryAddress,
      Value: 0,
      Data: newRepoWithVersionCall.encodeABI(),
      "Gas limit": 1100000
    };
  }
}

module.exports = generatePublishTx;
