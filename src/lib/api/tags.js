// lib/api/tags.js
import api from "../axios";

export function getPrimaryTags() {
  return api.get("/tags/primary");
}

export function createPrimaryTag(tag) {
  return api.post("/tags/primary", { tag });
}

export function getSecondaryTags() {
  return api.get("/tags/secondary");
}

export function createSecondaryTag(tag) {
  return api.post("/tags/secondary", { tag });
}
