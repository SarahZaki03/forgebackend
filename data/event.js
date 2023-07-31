const { v4: generateId } = require("uuid");

const { NotFoundError } = require("../util/errors");
const { readData, writeData } = require("./util");

async function getAll() {
  const storedData = await readData();
  if (!storedData.events) {
    throw new NotFoundError("Could not find any events.");
  }
  return storedData.events;
}

async function get(id) {
  const storedData = await readData();
  if (!storedData.events || storedData.events.length === 0) {
    throw new NotFoundError("Could not find any events.");
  }

  const event = storedData.events.find((ev) => ev.id === id);
  if (!event) {
    throw new NotFoundError("Could not find event for id " + id);
  }

  return event;
}

async function getParcels(id) {
  const storedData = await readData();
  if (!storedData.parcels || storedData.parcels.length === 0) {
    throw new NotFoundError("Could not find any parcels.");
  }

  const parcels = storedData.parcels.find((ev) => ev.id === id);
  if (!parcels) {
    throw new NotFoundError("Could not find parcels for activity id " + id);
  }

  return parcels;
}

async function getparcel(activityid, id) {
  const storedData = await readData();
  if (!storedData.parcels || storedData.parcels.length === 0) {
    throw new NotFoundError("Could not find any parcels.");
  }

  const parcels = storedData.parcels.find((ev) => ev.id === activityid);
  // console.log(parcels.parcels);
  const parcel = parcels.parcels.find((p) => p.id == id);
  parcels.parcels.map((p) => console.log(p));
  // console.log();
  if (!parcel) {
    throw new NotFoundError("Could not find parcels for id " + id);
  }

  return parcel;
}

async function add(data) {
  const storedData = await readData();
  storedData.events.unshift({ ...data, id: generateId() });
  await writeData(storedData);
}

async function replace(id, data) {
  const storedData = await readData();
  if (!storedData.events || storedData.events.length === 0) {
    throw new NotFoundError("Could not find any events.");
  }

  const index = storedData.events.findIndex((ev) => ev.id === id);
  if (index < 0) {
    throw new NotFoundError("Could not find event for id " + id);
  }

  storedData.events[index] = { ...data, id };

  await writeData(storedData);
}

async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.events.filter((ev) => ev.id !== id);
  await writeData({ ...storedData, events: updatedData });
}

exports.getAll = getAll;
exports.get = get;
exports.add = add;
exports.replace = replace;
exports.remove = remove;
exports.getParcels = getParcels;
exports.getparcel = getparcel;
