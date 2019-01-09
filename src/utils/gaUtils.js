/* eslint-disable-next-line */
export function sendEvent(category, action, label = null) {
  gtag("event", action, {
    event_category: category,
    event_label: label
  });
}
