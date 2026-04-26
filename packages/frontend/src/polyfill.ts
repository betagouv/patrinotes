// @ts-ignore
import structuredClone from "@ungap/structured-clone";
if (!("structuredClone" in globalThis)) {
  globalThis.structuredClone = structuredClone;
}

// Array.prototype.at — not available in older browsers (Chrome < 92, Safari < 15.4)
// Required by pdfjs-dist internals
if (!Array.prototype.at) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.at = function (index: number) {
    const i = index < 0 ? this.length + index : index;
    return i < 0 || i >= this.length ? undefined : this[i];
  };
}
// Same for typed arrays used by pdfjs
for (const TypedArray of [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array] as const) {
  if (!TypedArray.prototype.at) {
    // eslint-disable-next-line no-extend-native
    (TypedArray.prototype as any).at = Array.prototype.at;
  }
}
