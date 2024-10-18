const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000); 
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth / 2, window.innerHeight); document.getElementById('solar-system').appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('textures/earth.png'); const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const moonTexture = textureLoader.load('textures/moon.png'); const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32); const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

moon.position.set(1.5, 0, 0); const moonOrbitRadius = 1.5; let moonAngle = 0; camera.position.z = 10;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.color = 'white';
tooltip.style.pointerEvents = 'none';
tooltip.style.visibility = 'hidden'; document.body.appendChild(tooltip);

function handleMoonClick() {
        window.location.href = 'moon.html'; }

renderer.domElement.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2(
        (event.clientX / (window.innerWidth / 2)) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(moon);
    if (intersects.length > 0) {
        handleMoonClick();     }
});

function animate() {
    requestAnimationFrame(animate);

        earth.rotation.y += 0.005;

        moonAngle += 0.01;     moon.position.x = moonOrbitRadius * Math.cos(moonAngle);
    moon.position.z = moonOrbitRadius * Math.sin(moonAngle);

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

renderer.domElement.addEventListener('mousemove', (event) => {
    const mouse = new THREE.Vector2(
        (event.clientX / (window.innerWidth / 2)) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(moon);
    if (intersects.length > 0) {
        tooltip.innerHTML = 'Місяць';
        tooltip.style.visibility = 'visible';
        tooltip.style.left = `${event.clientX + 10}px`;         tooltip.style.top = `${event.clientY + 10}px`;
    } else {
        tooltip.style.visibility = 'hidden';     }
});