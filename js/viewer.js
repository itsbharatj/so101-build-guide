// Lightweight STL preview using three.js. Loaded lazily when the viewer
// scrolls near the viewport so the rest of the page stays fast.
const host = document.getElementById("viewer");
const msg = document.getElementById("viewer-msg");
let api = null;
let pending = window.__so101InitialPart;

window.addEventListener("stl:view", (e) => {
  pending = e.detail.url;
  if (api) api.load(pending);
  else boot();
});

const io = new IntersectionObserver((entries) => {
  if (entries.some((en) => en.isIntersecting)) { io.disconnect(); boot(); }
}, { rootMargin: "400px" });
io.observe(host);

let booting = false;
async function boot() {
  if (booting || api) return;
  booting = true;
  if (location.protocol === "file:") {
    msg.textContent = "The 3D preview needs the page to be served over http(s), e.g. GitHub Pages or `python3 -m http.server`. Downloads still work.";
    return;
  }
  try {
    const THREE = await import("three");
    const { STLLoader } = await import("three/addons/loaders/STLLoader.js");
    const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");
    api = createViewer(THREE, STLLoader, OrbitControls);
    api.load(pending);
  } catch (err) {
    console.error(err);
    msg.textContent = "Couldn't load the 3D viewer. You can still download the parts.";
  }
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#ff5a1f";
}

function createViewer(THREE, STLLoader, OrbitControls) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 5000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;
  controls.addEventListener("start", () => (controls.autoRotate = false));

  scene.add(new THREE.HemisphereLight(0xffffff, 0x888070, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(1, 2, 1.5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.6);
  rim.position.set(-2, -1, -1);
  scene.add(rim);

  const material = new THREE.MeshStandardMaterial({ color: cssVar("--accent"), roughness: 0.55, metalness: 0.05 });
  window.addEventListener("themechange", () => material.color.set(cssVar("--accent")));

  let mesh = null;
  const loader = new STLLoader();
  let token = 0;

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  resize();

  function load(url) {
    const my = ++token;
    msg.style.display = "grid";
    msg.textContent = "Loading part…";
    loader.load(url, (geom) => {
      if (my !== token) return;
      geom.computeVertexNormals();
      geom.center();
      // STL parts are Z-up; rotate to three.js Y-up.
      geom.rotateX(-Math.PI / 2);
      geom.computeBoundingSphere();
      if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); }
      mesh = new THREE.Mesh(geom, material);
      scene.add(mesh);
      const r = geom.boundingSphere.radius;
      camera.position.set(r * 1.9, r * 1.3, r * 2.3);
      camera.near = r / 100; camera.far = r * 100;
      camera.updateProjectionMatrix();
      controls.target.set(0, 0, 0);
      controls.autoRotate = true;
      controls.update();
      msg.style.display = "none";
    }, undefined, () => {
      if (my === token) msg.textContent = "Couldn't load this part.";
    });
  }

  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
  return { load };
}
