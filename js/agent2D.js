var agentArray = [];
var agentIdSeed = [];
var agentSpeed = 10;
var agentScale = 5;
var totalAgent = 40000;
var limitWorld = { x: 1500, y: 1500 };
var agentsVisible = false;
var gridSize = { height: 128, width: 128 };
var agentCoordinateArray = null;
var coordinateArrayCorrespondance = null;
// Dat GUI
var gui = new dat.GUI();

gui.add(this, 'agentsVisible').onChange(function(value) {
    toogleAgentsVisible(value);
});
/*
gui.add(this, 'restart');

gui.add(this, 'totalAgent', 100, 40000).onFinishChange(function(value) {
    restart();
});
*/

// Rainbow
var rainbow = new Rainbow();
// 50 for corner seed
rainbow.setNumberRange(1, totalAgent / 100);
rainbow.setSpectrum('red', 'yellow', 'blue', 'white');
// Particle
//var geometry = new THREE.SphereGeometry(agentScale, agentScale, agentScale);
var geometry = new THREE.Geometry();
geometry.colors = []
var mesh = null;
THREE.ImageUtils.crossOrigin = '';
var sprite = THREE.ImageUtils.loadTexture("http://i.imgur.com/lWBb0k4.png");
//var sprite = new THREE.TextureLoader().load("./disc.png");

buildGrid();
start();
timedChunk()

function restart() {
    clean();
    buildGrid();
    //totalAgent = 0;
    start();
    toogleAgentsVisible(!agentsVisible);
    toogleAgentsVisible(agentsVisible);
}

function start() {

    // Create seed agent
    /*
    agentArray.push(createAgentSeed({x: -750 , y : -750}));
    agentArray.push(createAgentSeed({x: 749 , y : -750}));
    agentArray.push(createAgentSeed({x: 749 , y : 749}));
    agentArray.push(createAgentSeed({x: -750 , y : 749}));
    */
    agentArray.push(createAgentSeed({ x: 0, y: 0 }));
    // Create no seed agent
    for (var i = 0; i < totalAgent; i++) {
        agentArray.push(createAgent());
    }
    var material = new THREE.PointsMaterial({ size: agentScale * 4, vertexColors: THREE.VertexColors, map: sprite, transparent: true });
    mesh = new THREE.Points(geometry, material);
    scene.add(mesh);
}

// Return a two dimentions array with all the adjacent grid square
function buildGrid() {

    agentCoordinateArray = new Array(gridSize.height);
    for (var u = 0; u < gridSize.height; u++) {
        agentCoordinateArray[u] = new Array(gridSize.width);
        for (var o = 0; o < gridSize.height; o++) {
            agentCoordinateArray[u][o] = [];
        }
    }

    coordinateArrayCorrespondance = new Array(gridSize.height);
    for (var u = 0; u < gridSize.height; u++) {
        coordinateArrayCorrespondance[u] = new Array(gridSize.width);
    }

    for (var i = 0; i < gridSize.height; i++) {
        for (var u = 0; u < gridSize.width; u++) {
            var tabCorrespondance = [];
            tabCorrespondance.push({ x: i, y: u });

            if (i + 1 < gridSize.height)
                tabCorrespondance.push({ x: i + 1, y: u });
            if (i - 1 >= 0)
                tabCorrespondance.push({ x: i - 1, y: u });

            if (u + 1 < gridSize.width)
                tabCorrespondance.push({ x: i, y: u + 1 });
            if (u - 1 >= 0)
                tabCorrespondance.push({ x: i, y: u - 1 });

            if ((i + 1 < gridSize.height) && (u + 1 < gridSize.width))
                tabCorrespondance.push({ x: i + 1, y: u + 1 });
            if ((i - 1 >= 0) && (u - 1 >= 0))
                tabCorrespondance.push({ x: i - 1, y: u - 1 });

            if ((i + 1 < gridSize.height) && (u - 1 >= 0))
                tabCorrespondance.push({ x: i + 1, y: u - 1 });
            if ((i - 1 >= 0) && (u + 1 < gridSize.width))
                tabCorrespondance.push({ x: i - 1, y: u + 1 });

            coordinateArrayCorrespondance[i][u] = tabCorrespondance;
        }
    }
}

function returnGridCoordinate(position) {
    var x_abs = limitWorld.x / 2 + position.x;
    var y_abs = limitWorld.y / 2 + position.y;
    var x_cal = limitWorld.x / gridSize.height;
    var y_cal = limitWorld.y / gridSize.width;

    return { x: Math.floor(x_abs / x_cal), y: Math.floor(y_abs / y_cal) };
}

function createAgent() {

    // Position
    var vertex = new THREE.Vector3();
    vertex.x = (Math.random() - 0.5) * limitWorld.x;
    vertex.y = (Math.random() - 0.5) * limitWorld.y;
    vertex.z = 0;
    geometry.vertices.push(vertex);
    // Color
    geometry.colors.push(new THREE.Color(0x000000));

    var behaviour = function(agent, indiceAgent) {
        if (agent.agent.type === 'noseed') {
            
            // var randX = Math.random() - 0.5;
            // var randY = Math.random() - 0.5;
            // var tmp = noise3(geometry.vertices[indiceAgent].x, geometry.vertices[indiceAgent].y);
            // var decX = tmp.x;
            // var decY = tmp.y;
            // var randomX = agentSpeed * (0 * randX + 0.8 * decX) + geometry.vertices[indiceAgent].x;
            // var randomY = agentSpeed * (0 * randY + 0.8 * decY) + geometry.vertices[indiceAgent].y;

            
           var randomX = (Math.random() - 0.5) * agentSpeed + geometry.vertices[indiceAgent].x;
           var randomY = (Math.random() - 0.5) * agentSpeed + geometry.vertices[indiceAgent].y;
           

            if ((randomX > -(limitWorld.x / 2) && randomX < (limitWorld.x / 2)) && (randomY > -(limitWorld.y / 2) && randomY < (limitWorld.y / 2))) {
                geometry.vertices[indiceAgent].x = randomX;
                geometry.vertices[indiceAgent].y = randomY;
                geometry.verticesNeedUpdate = true;
                var actualGridCoordinates = returnGridCoordinate(geometry.vertices[indiceAgent]);
                var arraycorrespondanceCoordinate = coordinateArrayCorrespondance[actualGridCoordinates.x][actualGridCoordinates.y];
                // Loop on all the adjacent square grid
                for (var i = 0; i < arraycorrespondanceCoordinate.length; i++) {
                    // Loop on all seed agent in one adjacent square grid
                    for (var u = 0; u < agentCoordinateArray[arraycorrespondanceCoordinate[i].x][arraycorrespondanceCoordinate[i].y].length; u++) {
                        try {
                            if (isCollided(geometry.vertices[indiceAgent], geometry.vertices[agentCoordinateArray[arraycorrespondanceCoordinate[i].x][arraycorrespondanceCoordinate[i].y][u]])) {
                                // Make a seed
                                agentIdSeed.push(indiceAgent);
                                agent.agent.type = 'seed';
                                agent.agent.generation = agentArray[agentCoordinateArray[arraycorrespondanceCoordinate[i].x][arraycorrespondanceCoordinate[i].y][u]].agent.generation + 1;
                                // Save coordinate of the agent
                                agentCoordinateArray[actualGridCoordinates.x][actualGridCoordinates.y].push(indiceAgent);
                                // Color
                                var hexColour = rainbow.colourAt(agent.agent.generation);
                                geometry.colors[indiceAgent] = new THREE.Color(parseInt("0x" + hexColour, 16));
                                geometry.colorsNeedUpdate = true;
                                break;
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        }
    }
    return { agent: { type: 'noseed', generation: null }, behaviour: behaviour };
}

function createAgentSeed(position) {
    var vertex = new THREE.Vector3();
    vertex.x = position.x;
    vertex.y = position.y;
    vertex.z = 0;
    geometry.vertices.push(vertex);
    var hexColour = rainbow.colourAt(0);
    geometry.colors.push(new THREE.Color(parseInt("0x" + hexColour, 16)));
    agentIdSeed.push(geometry.vertices.length - 1);
    var behaviour = function(agent) {}
    var gridPosition = returnGridCoordinate(geometry.vertices[geometry.vertices.length - 1])
    agentCoordinateArray[gridPosition.x][gridPosition.y].push(geometry.vertices.length - 1);
    return { agent: { type: 'seed', generation: 0 }, behaviour: behaviour };
}

//For compute the distance between 2 points (Vector3 : x,y,z) in 3D space
function distanceAB(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function isCollided(obj1, obj2) {
    if (Math.abs(obj1.x - obj2.x) < agentScale && Math.abs(obj1.y - obj2.y) < agentScale) {
        return true;
    } else {
        return false;
    }
}

function toogleAgentsVisible(isVisible) {
    for (var i = 0; i < agentArray.length; i++) {
        if (agentArray[i].agent.type === 'noseed') {
            geometry.colors[i] = new THREE.Color((isVisible) ? 0xffffff : 0x000000);
        }
    }
}

function clean() {
    scene.remove(mesh);
    mesh = null;
    var geometry = new THREE.Geometry();
    geometry.colors = [];
    agentArray = [];
    agentCoordinateArray = [];
    agentIdSeed = [];
    render();
}

function timedChunk(particles, positions, fn, context, callback) {
    var i = 0;
    var tick = function() {
        var start = new Date().getTime();
        for (; i < agentArray.length && (new Date().getTime()) - start < 50; i++) {
            agentArray[i].behaviour(agentArray[i], i);
            // fn.call(context, particles[i], positions[i]);
        }
        if (i < agentArray.length) {
            // Yield execution to rendering logic
            setTimeout(tick, 25);
        } else {
            timedChunk();
            // callback(positions, particles);
        }
    };
    setTimeout(tick, 25);
}


function noise(x, y) {
    var u = x / limitWorld.x;
    var v = y / limitWorld.y;

    return Math.sin(20 * u) * Math.sin(28 * v);
}

function noise2(x, y) {
    var uu = x / limitWorld.x;
    var vv = y / limitWorld.y;
    var t = clock.elapsedTime;
    var a = Math.cos(t) * 0.5;
    var b = Math.sin(t * 2.33) * 0.5;
    var p = new THREE.Vector3(uu, vv, a);
    var v = new THREE.Vector3();
    for (var i = 0; i < 50; i++) {
        var dp = p.dot(p);
        p.x = Math.abs(p.x) / dp;
        p.y = Math.abs(p.y) / dp;
        p.z = Math.abs(p.z) / dp;
        p.sub(new THREE.Vector3(1.0, 1.0, 0.5));
        p.x = Math.abs(p.x);
        p.y = Math.abs(p.y);
        p.z = Math.abs(p.z);
        v = p;
        v.multiply(new THREE.Vector3(1.3, 0.99, 0.7));
        p.x = v.x;
        p.z = v.y;
        p.y = v.z;
    }

    return new THREE.Vector2(p.x - 0.5, p.y - 0.5);
}

function noise3(x, y) {
    var uu = (x / limitWorld.x) * 2;
    var vv = (y / limitWorld.y) * 2;
    var d = uu * uu + vv * vv;
    var amp = 1 / (1 + Math.sqrt(d));

    return new THREE.Vector2(vv * amp, -uu * amp);


}
