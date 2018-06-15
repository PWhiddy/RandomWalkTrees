'use strict';

import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';

var scene, room, controls,
    camera, renderer, start_time, mouse, raycaster,
    current_sel;

init();
render();

function init() {

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.2, 50 );
	camera.position.z = 5;
	renderer = new THREE.WebGLRenderer({antialias:false});
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	document.body.appendChild( renderer.domElement );

	mouse = new THREE.Vector2();
	//raycaster = new THREE.Raycaster();
	current_sel = null;
	
	const room_geo = new THREE.BoxBufferGeometry( 
		15, 
		8, 
		15 );

	const room_mat = new THREE.MeshStandardMaterial( { 
		color: new THREE.Color( 0.6, 0.6, 0.6),
		roughness: 0.82,
		metalness: 0.01,
       		side: THREE.BackSide } );

	room = new THREE.Mesh( room_geo, room_mat );
	scene.add( room );


	// setup lights
	const hemisphereLight = new THREE.HemisphereLight(0x889999, 0x445555);
	scene.add(hemisphereLight);

	window.addEventListener('resize', onWindowResize, false);
	//window.addEventListener('click', onMouseClick, false);
	//document.addEventListener('mousemove', onMouseMove, false);
	//document.addEventListener('keydown', keypress.bind(null,true));
	//document.addEventListener('keyup', keypress.bind(null,false));
	
  	controls = new OrbitControls(camera, renderer.domElement);
  	controls.enableDampening = true;
  	controls.dampeningFactor = 0.2;

	start_time = Date.now();
}

function render() {
	
	requestAnimationFrame( render );
	const t = Date.now()-start_time;
	//controls.update()
	//room.position.z += 0.51;
	renderer.render(scene, camera);
};

function keypress(down, e) {
	if (e.key === "Escape") {
		console.log("a thing happened!");
	}
}

// Raycast to sculptures
function onMouseMove(event) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseClick(event) {
	if (current_sel !== null) {

	}
}

function onWindowResize() {
    	camera.aspect = window.innerWidth / window.innerHeight;
    	camera.updateProjectionMatrix();
    	renderer.setSize( window.innerWidth, window.innerHeight );
}

