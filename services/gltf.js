const path = require("path");
const { ModelDerivativeClient, ManifestHelper } = require("forge-server-utils");
const { SvfReader, GltfWriter } = require("forge-convert-utils");
const { APS_CLIENT_ID, APS_CLIENT_SECRET } = process.env;

async function run(urn, outputDir) {
  const auth = {
    client_id: APS_CLIENT_ID,
    client_secret: APS_CLIENT_SECRET,
  };
  console.log("entered RUN");
  console.log(auth);
  const modelDerivativeClient = new ModelDerivativeClient(auth);
  const manifestHelper = new ManifestHelper(
    await modelDerivativeClient.getManifest(urn)
  );
  console.log("end modelDerivativeClient.getManifest(urn)");
  const derivatives = manifestHelper.search({
    type: "resource",
    role: "graphics",
  });
  const readerOptions = {
    log: console.log,
  };
  const writerOptions = {
    deduplicate: true,
    skipUnusedUvs: true,
    center: true,
    log: console.log,
    filter: (dbid) => dbid >= 100 && dbid <= 200, // only output objects with dbIDs between 100 and 200
  };
  const writer = new GltfWriter(writerOptions);
  for (const derivative of derivatives.filter(
    (d) => d.mime === "application/autodesk-svf"
  )) {
    console.log("entered reader");
    console.log("entered reader " + derivative.guid);
    const reader = await SvfReader.FromDerivativeService(
      urn,
      derivative.guid,
      auth
    );
    const scene = await reader.read(readerOptions);
    console.log("end reader");
    await writer.write(scene, path.join(outputDir, derivative.guid));

    // await writer.write(scene, path.join(__dirname, outputDir));
    console.log("end writer");
  }
}

async function runFragment(urn) {
  const auth = {
    client_id: APS_CLIENT_ID,
    client_secret: APS_CLIENT_SECRET,
  };
  console.log("entered RUN");
  console.log(auth);
  const modelDerivativeClient = new ModelDerivativeClient(auth);
  console.log(modelDerivativeClient + " result ");
  const manifestHelper = new ManifestHelper(
    await modelDerivativeClient.getManifest(urn)
  );
  console.log("getManifest RUN");
  const derivatives = manifestHelper.search({
    type: "resource",
    role: "graphics",
  });
  console.log(manifestHelper);
  for (const derivative of derivatives.filter(
    (d) => d.mime === "application/autodesk-svf"
  )) {
    console.log(derivatives);
    const reader = await SvfReader.FromDerivativeService(
      urn,
      derivative.guid,
      auth
    );
    for await (const fragment of reader.enumerateFragments()) {
      console.log(fragment);
    }
  }
}

// run("your model urn", "path/to/output/folder");
module.exports = { run, runFragment };
