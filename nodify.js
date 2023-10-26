/**
 *
 * @template T, E
 * @callback callback
 * @param {E?} err error
 * @param {T?} data data
 * @returns {void}
 */

/**
 *
 * @template T
 * @param {Promise<T>} promise promise
 * @param {callback<T, Error>} cb callback
 * @returns {Promise<T>}
 */
module.exports = async function nodify(promise, cb) {
  if (!cb || typeof cb != "function") return promise;

  try {
    const data = await promise;
    cb(null, data);
  } catch (err) {
    cb(err, null);
  }
};
