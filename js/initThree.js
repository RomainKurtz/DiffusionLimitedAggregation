if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer;

var cross;

init();
animate();

function init() {


    //camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 1000000);
    camera = new THREE.PerspectiveCamera( 45,window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 2000;

    
    // world

    scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2(0xcccccc, 0.002);




    // lights

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    light = new THREE.DirectionalLight(0x002288);
    light.position.set(-1, -1, -1);
    scene.add(light);

    light = new THREE.AmbientLight(0x222222);
    scene.add(light);


    // renderer

    renderer = new THREE.WebGLRenderer({ antialias: false });



    // renderer.setClearColor(scene.fog.color);
    //renderer.setClearColor(new THREE.Color(0xcccccc));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    controls = new THREE.TrackballControls(camera, renderer.domElement);

    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noRotate = true;
    controls.noZoom = false;
    controls.noPan = false;

    controls.minDistance = 100;
    controls.maxDistance = 3000;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [65, 83, 68];

    controls.addEventListener('change', render);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);

    window.addEventListener('resize', onWindowResize, false);

    render();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();

    render();

}

function animate() {

    requestAnimationFrame(animate);
    controls.update();

    render();

}

function render() {

    renderer.render(scene, camera);
    stats.update();

}
