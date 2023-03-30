import fs from "fs";
import https from "https";
import fetch from "node-fetch";

main().then();

async function main() {
  // configureGlobalCert();
  const testUrl = process.env["apps.tinkoffbusiness.wss"] + "/api/v1/nominal-accounts/virtual-accounts/balances";
  const tinkoffToken = process.env["apps.tinkoffbusiness.token_PASSWORD"];
  const authorization=`Bearer ${tinkoffToken}`;
  const agent = configureAgent();

  const options = {
    headers: {
      authorization 
    },
    agent
  };  
  const testRes = await fetch(testUrl, options);
  await checkResponse(testRes);
  console.log(await testRes.json());
}

/**
 * throws error if response is not ok
 * @param {*} res result of fetch
 * @returns result of fetch
 */
async function checkResponse(res) {
  if (!res.ok) {
    const msg = await res.text();
    console.log("error", res.url, msg);
    throw new Error(msg);
  }
  return res;
}

function configureGlobalCert() {
  const certfile = process.env["apps.tinkoffbusiness.certfile"];
  const passphrase = process.env["apps.tinkoffbusiness.cert_PASSWORD"];

  Object.assign(https.globalAgent.options, configureCert(certfile, passphrase));
}

function configureAgent() {
  const certfile = process.env["apps.tinkoffbusiness.certfile"];
  const passphrase = process.env["apps.tinkoffbusiness.cert_PASSWORD"];

  return new https.Agent(configureCert(certfile, passphrase));
}

function configureCert(certfile, passphrase) {
  const cert = certfile ? fs.readFileSync(certfile) : null;
  const certConfig = {
    cert,
    key: cert,
    passphrase,
  };
  return certConfig;
}
