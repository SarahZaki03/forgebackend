const fs = require("fs");
const express = require("express");
const formidable = require("express-formidable");
const {
  listObjects,
  uploadObject,
  translateObject,
  getManifest,
  urnify,
} = require("../services/aps.js");
const { run, runFragment } = require("./../services/gltf.js");
const { parseMeshes } = require("forge-convert-utils/lib/svf/meshes");

let router = express.Router();

router.get("/api/models", async function (req, res, next) {
  try {
    const objects = await listObjects();
    res.json(
      objects.map((o) => ({
        name: o.objectKey,
        urn: urnify(o.objectId),
      }))
    );
  } catch (err) {
    next(err);
  }
});

router.get("/api/models/:urn/gltf", async function (req, res, next) {
  try {
    console.log("entered models");
    fs.access(`./output/${req.params.urn}`, async (error) => {
      // To check if the given directory
      // already exists or not
      if (error) {
        // If current directory does not exist
        // then create it
        fs.mkdir(`./output/${req.params.urn}`, (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log("New Directory created successfully !!");
          }
        });
      } else {
        console.log("Given Directory already exists !!");
      }

      await run(req.params.urn, "/output/" + req.params.urn + "/");
    });
  } catch (err) {
    next(err);
  }
});

router.get("/api/models/:urn/status", async function (req, res, next) {
  try {
    const manifest = await getManifest(req.params.urn);
    if (manifest) {
      let messages = [];
      if (manifest.derivatives) {
        for (const derivative of manifest.derivatives) {
          messages = messages.concat(derivative.messages || []);
          if (derivative.children) {
            for (const child of derivative.children) {
              messages.concat(child.messages || []);
            }
          }
        }
      }
      res.json({
        status: manifest.status,
        progress: manifest.progress,
        messages,
      });
    } else {
      res.json({ status: "n/a" });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/api/models", formidable(), async function (req, res, next) {
  const file = req.files["model-file"];
  if (!file) {
    res.status(400).send('The required field ("model-file") is missing.');
    return;
  }
  try {
    const obj = await uploadObject(file.name, file.path);
    await translateObject(
      urnify(obj.objectId),
      req.fields["model-zip-entrypoint"]
    );
    res.json({
      name: obj.objectKey,
      urn: urnify(obj.objectId),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
