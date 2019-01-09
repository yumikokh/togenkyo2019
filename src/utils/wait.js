/**
 * @param {Number} ms 待機させたいms時間
 * @return {Promise}
 */

export default function wait(ms) {
  return () =>
    new Promise(resolve => {
      setTimeout(resolve, ms);
    });
}
