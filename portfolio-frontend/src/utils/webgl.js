// Cheap, one-time WebGL capability check. Some browsers/machines run with
// hardware acceleration disabled or the GPU process sandboxed — in that case
// THREE.WebGLRenderer fails to get a context, and a mounted <Canvas> retries
// on every animation frame, flooding the console forever. Check once up
// front and skip mounting the 3D canvas entirely if it's not available.
let cached = null;

export function isWebGLAvailable() {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    cached = !!gl;
    if (gl?.getExtension) gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}
