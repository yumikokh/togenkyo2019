export default function() {
  return window.pageYOffset !== undefined
    ? window.pageYOffset
    : document.documentElement.scrollTop;
}

// 横も追加
export function getScrollLeft() {
  return window.pageXOffset !== undefined
    ? window.pageXOffset
    : document.documentElement.scrollLeft;
}
