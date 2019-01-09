// NOTE: BufferはNode.js側のオブジェクトで、
// webpackでbundleする際によしなに変換してくれる

export const encRaw = rawtext => {
  const v = Buffer.from(rawtext);
  return v.toString("base64");
};

export default (text = "") => {
  const date = new Date();
  const dateTime = date.getTime() + 600000;
  const res = encRaw(`${encRaw(text.toString())}/${dateTime.toString()}`);

  return res;
};
