import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { toastError } from "../utils";
import { NFTStorage } from "nft.storage";
var b64toBlob = require("b64-to-blob");
dotenv.config();

const client = new NFTStorage({
  token: process.env.REACT_APP_NFT_STORAGE_ACCESS_TOKEN as string,
});

export const useIpfs = () => {
  const upload = async (requestDataArray: any) => {
    const requestData = JSON.parse(requestDataArray);
    const [contentType, b64Data] = requestData[0].documentUrl.split(",");
    const blob = b64toBlob(b64Data, contentType);
    try {
      const cid = await client.storeBlob(blob);
      return cid;
    } catch (error) {
      console.error(error);
      toastError("Failed to upload");
    }
  };

  const getDataFromIpfs = async (cid: string) => {
    try {
      const decode = await fetch(`https://ipfs.io/ipfs/${cid}`);
      const res = await decode.json();

      if (res) {
        return res;
      } else {
        toastError("data not found");
        return "";
      }
    } catch (error) {
      console.error(error);
      toastError("Failed to fetch data from ipfs");
    }
  };

  return {
    upload,
    getDataFromIpfs,
  };
};
