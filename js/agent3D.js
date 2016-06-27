var agentArray = [];
var sendArray = [];
var agentSpeed = 20;
var agentScale = 20;
var limitWorld = { x: 1000, y: 1000, z:1000 };

agentArray.push(createAgentSeed());
for (var i = 0; i < 1000; i++) {
    agentArray.push(createAgent());
}

function createAgent() {
    var geometry = new THREE.SphereGeometry(agentScale, agentScale, agentScale);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading });

    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = (Math.random() - 0.5) * limitWorld.x;
    mesh.position.y = (Math.random() - 0.5) * limitWorld.y;
    mesh.position.z = (Math.random() - 0.5) * limitWorld.z;
    //mesh.position.z = (Math.random() - 0.5) * 1000;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add(mesh);

    var behaviour = function(agent, indiceAgent) {

        if (agent.agent === 'noseed') {
            var randomX = (Math.random() - 0.5) * agentSpeed + agent.mesh.position.x;
            var randomY = (Math.random() - 0.5) * agentSpeed + agent.mesh.position.y;
            var randomZ = (Math.random() - 0.5) * agentSpeed + agent.mesh.position.z;
            if ((randomX > -(limitWorld.x/2) && randomX < (limitWorld.x/2)) && (randomY > -(limitWorld.y/2) && randomY < (limitWorld.y/2))&& (randomZ > -(limitWorld.z/2) && randomZ < (limitWorld.z/2))) {
                agent.mesh.position.x = randomX;
                agent.mesh.position.y = randomY;
                agent.mesh.updateMatrix();
                for (var u = 0; u < agentArray.length; u++) {
                    if (agentArray[u].agent === 'seed') {
                        if (isCollided(agent.mesh, agentArray[u].mesh)) {
                            agent.agent = 'seed';
                            agent.mesh.material.color = new THREE.Color(0xff0000);
                            agent.mesh.material.needsUpdate = true;
                            //sendArray.push(sendArray[u]);
                        }
                    }
                }
            }
        }

    }

    return { agent: 'noseed', mesh: mesh, behaviour: behaviour };

}

function createAgentSeed() {
    var geometry = new THREE.SphereGeometry(agentScale, agentScale, agentScale);
    var material = new THREE.MeshPhongMaterial({ color: 0xff0000, shading: THREE.FlatShading });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 0;
    mesh.position.y = -250;
    //mesh.position.z = (Math.random() - 0.5) * 1000;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add(mesh);

    var behaviour = function(agent) {

    }

    return { agent: 'seed', mesh: mesh, behaviour: behaviour };

}

function updateAgent() {
    for (var i = 0; i < agentArray.length; i++) {
        agentArray[i].behaviour(agentArray[i], i);
    }
}

//For compute the distance between 2 points (Vector3 : x,y,z) in 3D space
function distanceAB(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function isCollided(obj1, obj2) {
    var okFactor = 1.2;
    if (Math.abs(obj1.position.x - obj2.position.x) < (agentScale * okFactor) && Math.abs(obj1.position.y - obj2.position.y) < (agentScale * okFactor) && Math.abs(obj1.position.z - obj2.position.z) < (agentScale * okFactor)) {
        return true;
    } else {
        return false;
    }
}
