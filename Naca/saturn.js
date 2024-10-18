const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000); 
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth / 2, window.innerHeight); document.getElementById('solar-system').appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('textures/Saturn.png'); const geometry = new THREE.SphereGeometry(3, 32, 32);
const material = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(geometry, material);
scene.add(sun);


camera.position.z = 10;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

function animate() {
    requestAnimationFrame(animate);

        sun.rotation.y += 0.005;

    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    const width = window.innerWidth / 2;
    const height = window.innerHeight;

        camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});