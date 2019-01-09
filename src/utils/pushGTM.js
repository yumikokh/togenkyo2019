export default function pushGTM(eventCategory, eventAction, eventLabel = null) {
  if (!window.dataLayer) return;
  window.dataLayer.push({
    event: "analytics",
    eventCategory,
    eventAction,
    eventLabel
  });
}
