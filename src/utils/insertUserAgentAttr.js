import UA from "@/utils/UA";

export default () => {
  const HTML = document.documentElement;

  // 端末環境
  if (UA.isSP) HTML.setAttribute("data-env", "sp");
  else HTML.setAttribute("data-env", "pc");

  // 閲覧端末
  if (UA.iPad) HTML.setAttribute("data-device", "ipad");
  if (UA.iPhone) HTML.setAttribute("data-device", "iphone");
  if (UA.Android) HTML.setAttribute("data-device", "android");

  // OS
  if (UA.iOS) HTML.setAttribute("data-os", "ios");
  if (UA.Android) HTML.setAttribute("data-os", "android");

  // ブラウザ
  if (UA.IE) HTML.setAttribute("data-browser", "ie");
  if (UA.Edge) HTML.setAttribute("data-browser", "edge");
  if (UA.Chrome) HTML.setAttribute("data-browser", "chrome");
  if (UA.Firefox) HTML.setAttribute("data-browser", "firefox");
  if (UA.Safari) HTML.setAttribute("data-browser", "safari");
  if (UA.Opera) HTML.setAttribute("data-browser", "opera");
};
