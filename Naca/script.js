const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('solar-system').appendChild(renderer.domElement);

const planetData = [
    { size: 1.5, texture: 'textures/Sun.png', distance: 0, name: 'Sun', url: 'Sun.html' },
    { size: 0.5, texture: 'textures/Mercury.png', distance: 3, name: 'Mercury', url: "mercury.html" },
    { size: 0.6, texture: 'textures/Venus.png', distance: 5, name: 'Venus', url: 'venus.html' },
    { size: 0.7, texture: 'textures/earth.png', distance: 7, name: 'Earth', url: 'earth.html' },
    { size: 0.5, texture: 'textures/Mars.png', distance: 9, name: 'Mars', url: 'mars.html' },
    { size: 1.0, texture: 'textures/Jupiter.png', distance: 12, name: 'Jupiter', url: 'jupiter.html' },
    { size: 0.9, texture: 'textures/Saturn.png', distance: 16, name: 'Saturn', url: 'saturn.html' },
    { size: 0.7, texture: 'textures/Uranus.png', distance: 20, name: 'Uranus', url: 'uranus.html' },
    { size: 0.6, texture: 'textures/Neptune.png', distance: 24, name: 'Neptune', url: 'neptune.html' }
];

const textureLoader = new THREE.TextureLoader();
const planets = [];

function createOrbit(radius) {
    const points = [];
    const orbitSegments = 64;

    for (let i = 0; i <= orbitSegments; i++) {
        const angle = (i / orbitSegments) * Math.PI * 2;
        points.push(new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
    }

    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    scene.add(orbit);
}

planetData.forEach(data => {
    textureLoader.load(data.texture, (texture) => {
        const geometry = new THREE.SphereGeometry(data.size, 32, 32);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const planet = new THREE.Mesh(geometry, material);
        planet.userData = { distance: data.distance, angle: Math.random() * 2 * Math.PI, name: data.name, url: data.url };
        planets.push(planet);
        scene.add(planet);
        createOrbit(data.distance);
    }, undefined, function (error) {
        console.error('Error loading texture:', error);
    });
});

// Загрузка текстуры для фона
const backgroundTextureLoader = new THREE.TextureLoader();
const backgroundTexture = backgroundTextureLoader.load('textures/Sky.png');
const sphereGeometry = new THREE.SphereGeometry(200, 100, 200);
const sphereMaterial = new THREE.MeshBasicMaterial({
    map: backgroundTexture,
    side: THREE.BackSide
});
const backgroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(backgroundSphere);

const maxDistance = 75;
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.maxDistance = maxDistance;

camera.position.set(0, 50, 50);
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);

    const distanceToCenter = camera.position.length();
    if (distanceToCenter > maxDistance) {
        const normalizedPosition = camera.position.clone().normalize().multiplyScalar(maxDistance);
        camera.position.copy(normalizedPosition);
    }

 

    planets.forEach(planet => {
        planet.userData.angle += 0.001;
        planet.position.x = planet.userData.distance * Math.cos(planet.userData.angle);
        planet.position.z = planet.userData.distance * Math.sin(planet.userData.angle);
    });
   backgroundSphere.position.copy(camera.position);
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

const tooltip = document.getElementById('tooltip');

function onMouseMove(event) {
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        const planet = intersects[0].object;
        tooltip.innerText = planet.userData.name;
        tooltip.style.display = 'block';
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
    } else {
        tooltip.style.display = 'none';
    }
}

window.addEventListener('mousemove', onMouseMove);

function onClick(event) {
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        const planet = intersects[0].object;
        const url = planet.userData.url;

        if (url) {
            window.location.href = url; 
        }
    }
}
const apiKey = 'fs9xUJ9TwAP9t9oOMURptvYDlINjDdQdBJ9hsbcb';


function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Вычисляем даты
const currentDate = new Date();
const endDate = new Date(currentDate);  
endDate.setDate(currentDate.getDate() - 1); 

const startDate = new Date(currentDate);
startDate.setDate(currentDate.getDate() - 7);

const formattedStartDate = formatDate(startDate);
const formattedEndDate = formatDate(endDate);


const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formattedStartDate}&end_date=${formattedEndDate}&api_key=${apiKey}`;

console.log('API URL:', apiUrl); 
const asteroidTexture = new THREE.TextureLoader().load('textures/Astero.png');


async function fetchAsteroids() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        addAsteroidsToScene(data.near_earth_objects);
    } catch (error) {
        console.error('Ошибка при получении данных NASA NeoWs:', error);
    }
}



async function fetchAsteroids() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        addAsteroidsToScene(data.near_earth_objects);
    } catch (error) {
        console.error('Ошибка при получении данных NASA NeoWs:', error);
    }
}

function addAsteroidsToScene(nearEarthObjects) {
    for (const date in nearEarthObjects) {
        nearEarthObjects[date].forEach(asteroid => {
            const size = (asteroid.estimated_diameter.kilometers.estimated_diameter_min + asteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2;
            const distance = asteroid.close_approach_data[0].miss_distance.kilometers / 1000000; // Масштабируем расстояние

          
            const geometry = new THREE.SphereGeometry(size / 10, 32, 32); 
            const material = new THREE.MeshBasicMaterial({ map: asteroidTexture });
            const asteroidMesh = new THREE.Mesh(geometry, material);

          
            asteroidMesh.position.set(
                Math.random() * 50 - 25, 
                Math.random() * 50 - 25, 
                -distance
            );

          
            const outlineGeometry = new THREE.SphereGeometry(size / 10 + 0.05, 32, 32); 
            const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, opacity: 0.4, transparent: true }); 
            const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);

        
            outlineMesh.position.copy(asteroidMesh.position);

           
            scene.add(asteroidMesh);
            scene.add(outlineMesh);
        });
    }
}




window.onload = function() {
    fetchAsteroids();
};

window.addEventListener('click', onClick);


