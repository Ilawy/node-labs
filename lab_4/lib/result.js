/**
 * @template T
 * @param {Promise<T>} promise
 * @returns {Promise<[null, T] | [Error, null]>}
 */
export async function wrapPromise(promise) {
  try {
        const v = await promise;
        return [null, v];
    } catch (e) {
        return [e, null];
    }
}

