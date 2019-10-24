import { PackageReleaseMetadata } from "types-dappmanager";
import { UiSchema } from "react-jsonschema-form";
import { JSONSchema6 } from "json-schema";

// Setup schema types
export type SetupSchema = JSONSchema6;
export type SetupUiSchema = UiSchema;

/**
 * [NOTE] Items MUST be ordered by the directory order
 * - featured #0
 * - featured #1
 * - whitelisted #0
 * - whitelisted #1
 * - whitelisted #2
 * - other #0
 * - other #1
 *
 * [NOTE] Search result will never show up in the directory listing,
 * they will appear in a future dropdown under the searchbar
 */
export interface DirectoryItem {
  name: string;
  description: string; // = metadata.shortDescription || metadata.description
  avatar: string; // Must be URL to a resource in a DAPPMANAGER API
  isInstalled: boolean; // Show "UPDATE"
  isUpdated: boolean; // Show "UPDATED"
  whitelisted: boolean;
  isFeatured: boolean;
  featuredStyle?: {
    featuredBackground?: string;
    featuredColor?: string;
    featuredAvatarFilter?: string;
  };
}

export interface RequestedDnp {
  name: string; // "bitcoin.dnp.dappnode.eth"
  version: string; // "0.2.5", "/ipfs/Qm"
  origin: string | null; // "/ipfs/Qm"
  avatar: string; // "http://dappmanager.dappnode/avatar/Qm7763518d4";
  metadata: PackageReleaseMetadata;
  // Setup wizard
  setupSchema?: SetupSchema;
  setupUiSchema?: SetupUiSchema;
  // Additional data
  imageSize: number;
  isUpdated: boolean;
  isInstalled: boolean;
  // Settings must include the previous user settings
  settings: {
    envs?: {
      [dnpName: string]: {
        [envName: string]: string;
      };
      // "bitcoin.dnp.dappnode.eth": { MODE: "VALUE_SET_BEFORE" };
      // "ln.dnp.dappnode.eth": { WALLET: "" };
    };
    ports?: {
      [dnpName: string]: {
        [containerPortAndType: string]: string;
      };
      // "bitcoin.dnp.dappnode.eth": { "8443": "8443"; "8443/udp": "8443" };
      // "ln.dnp.dappnode.eth": { "7007": "" };
    };
    vols?: {
      [dnpName: string]: {
        [volumeName: string]: string;
      };
      // "bitcoin.dnp.dappnode.eth": { data: "" };
      // "ln.dnp.dappnode.eth": { data: "" };
    };
  };
  request: {
    compatible: {
      requiresCoreUpdate: boolean;
      resolving: boolean;
      isCompatible: boolean; // false;
      error: string; // "LN requires incompatible dependency";
      dnps: {
        [dnpName: string]: { from: string | null; to: string };
        // "bitcoin.dnp.dappnode.eth": { from: "0.2.5"; to: "0.2.6" };
        // "ln.dnp.dappnode.eth": { from: null; to: "0.2.2" };
      };
    };
    available: {
      isAvailable: boolean; // false;
      message: string; // "LN image not available";
    };
  };
}