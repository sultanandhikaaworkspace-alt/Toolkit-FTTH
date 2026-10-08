/* Runs Python (Pyodide) off the main thread. Messages in: {type:"run", id, bytes, filename, options}. */
const BASE = new URL("py/", self.location.href).href;
const WHEELS = [
  "numpy-2.2.5-cp313-cp313-pyemscripten_2025_0_wasm32.whl",
  "typing_extensions-4.16.0-py3-none-any.whl",
  "pyparsing-3.3.3-py3-none-any.whl",
  "fonttools-4.66.1-py3-none-any.whl",
  "ezdxf-1.4.4-py3-none-any.whl",
  "et_xmlfile-2.0.0-py3-none-any.whl",
  "openpyxl-3.1.5-py2.py3-none-any.whl",
];

let ready = null;

function status(text, pct) { self.postMessage({ type: "status", text, pct }); }

async function boot() {
  status("Memuat Python…", 5);
  importScripts(BASE + "pyodide.js");
  const py = await loadPyodide({ indexURL: BASE, stdout: () => {}, stderr: () => {} });
  status("Memuat library Excel & DXF…", 55);
  await py.loadPackage(WHEELS.map((w) => BASE + "whl/" + w), { messageCallback: () => {}, errorCallback: () => {} });
  status("Menyiapkan program CMLD…", 90);
  const src = await (await fetch(BASE + "cmld_py.json")).json();
  py.FS.mkdirTree("/home/pyodide/app/cmld");
  for (const [path, text] of Object.entries(src)) py.FS.writeFile("/home/pyodide/app/" + path, text);
  py.runPython("import sys; sys.path.insert(0, '/home/pyodide/app'); import cmld.web, ezdxf, openpyxl");
  status("Siap", 100);
  return py;
}

self.onmessage = async (ev) => {
  const msg = ev.data;
  try {
    if (!ready) ready = boot();
    const py = await ready;
    if (msg.type !== "run") return;
    const process = py.pyimport("cmld.web")[msg.fn || "process"];
    const res = process(msg.bytes, msg.filename, JSON.stringify(msg.options));
    const out = res.toJs({ dict_converter: Object.fromEntries, create_pyproxies: false });
    res.destroy();
    process.destroy();
    const transfer = [];
    if (out.zip) transfer.push(out.zip.buffer);
    if (out.dxf) transfer.push(out.dxf.buffer);
    for (const k in out.files) transfer.push(out.files[k].buffer);
    self.postMessage({ type: "result", id: msg.id, fn: msg.fn || "process", result: out }, transfer);
  } catch (err) {
    self.postMessage({ type: "error", id: msg.id, fn: msg && msg.fn, message: String(err && err.message || err) });
  }
};
