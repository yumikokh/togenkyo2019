/**
 * 画像をプリロードする。
 * @param {String} url 画像パス。
 * @return {Promise.<Object>}
 */

export function preloadImage(url) {
  if (!url) return Promise.reject("invalid url.");

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(`preloadImage: ${url}`);
    img.src = url;
  });
}

/**
 * 上記、preloadImageを使って、複数の画像をプリロードする。
 * 引数と同じ形式で結果を返す。
 * @param {(Array|Object).<String>} urls 画像パスが入った配列or連想配列。
 * @return {Promise.<(Array|Object)>}
 */

export function preloadImages(urls) {
  if (typeof urls !== "object") return Promise.reject("invalid urls.");

  const isArray = Array.isArray(urls);
  const ary = isArray ? urls : Object.values(urls);

  return Promise.all(ary.map(url => preloadImage(url))).then(result => {
    if (isArray) return result;

    const obj = Object.assign({}, urls);

    Object.keys(obj).forEach((key, index) => {
      obj[key] = result[index];
    });

    return obj;
  });
}
