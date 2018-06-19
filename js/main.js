'use strict';

//import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
//import {p5} from './p5.js';

var scene, room, lines, controls,
    camera, renderer, start_time, mouse, raycaster,
    current_sel;

init();
render();

function init() {

	//console.log(p5);
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 2.5, 9800 );
	camera.position.z = 125;
	camera.position.y = -40;
	renderer = new THREE.WebGLRenderer({antialias:false});
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	document.body.appendChild( renderer.domElement );

	mouse = new THREE.Vector2();
	//raycaster = new THREE.Raycaster();
	current_sel = null;
	
	const room_geo = new THREE.BoxBufferGeometry( 
		1450, 
		1200, 
		1450 );

	const room_mat = new THREE.MeshStandardMaterial( { 
		color: new THREE.Color( 0.6, 0.6, 0.6),
		roughness: 0.82,
		metalness: 0.01,
       		side: THREE.BackSide } );

	room = new THREE.Mesh( room_geo, room_mat );
	scene.add( room );

	lines = create_lines();
	scene.add(lines);

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

function create_lines() {

	let line_geo = new THREE.Geometry(); //new THREE.BufferGeometry();
	let line_mat = new THREE.LineBasicMaterial( { /*vertexColors: THREE.VertexColors*/ } );

	let positions = [];
	let colors = [];

	////////////
	

	
	let nodes = [];

	let count = 1;
	for (let i=0; i<count; i++) {
		let c = [255*1/*Math.random()*/, 0*Math.random(), 0*Math.random()];
		let o = new THREE.Vector3(2.0*(i-count/2),0, 0); //p5.createVector(0, 0);
		let p = new THREE.Vector3(o.x, o.y-3.5, o.z); //p5.createVector(o.x, o.y + 0.5);
		nodes.push( [new randomWalkTree( c, o, p, 3, 1.06, 0.5, 0.11, 0.1, 0 )] );
		//nodes.push( [new randomWalkTree( c, o, p, 3, 1.06, 0.5, 0.01, 0.1, 0 )] );
		//nodes.push( [new randomWalkTree( c, o, p, 3, 1.06, 0.5, 0.01, 0.1, 0 )] );
		//nodes.push( [new randomWalkTree( c, o, p, 3, 1.06, 0.5, 0.01, 0.1, 0 )] );
		//nodes.push( [new randomWalkTree( c, o, p, 3, 1.06, 0.5, 0.01, 0.1, 0 )] );
	}

	function randomWalkTree(col, origin, previous, size, childCount, childCountStdev, dirStdev, distStdev, depth) {
		//translate(width / 2, height / 2);
		this.newCol = [0,0,0];
		this.newCol[0] += col[0]+65*(Math.random()-0.4);
		this.newCol[1] += col[1]+65*(Math.random()-0.5);
		this.newCol[1] = Math.min( this.newCol[1], this.newCol[0] );
		this.newCol[2] += col[2]+45*(Math.random()-0.5);
		
		this.col = col;
		this.origin = origin;
		this.previous = previous;
		this.size = size;
		this.childCount = childCount;
		this.childCountStdev = childCountStdev;
		this.dirStdev = dirStdev;
		this.distStdev = distStdev;
		this.depth = depth;
		
		this.show = function(p, c) {

			p.push( new THREE.Vector3( this.previous.x, this.previous.y, this.previous.z ) );
			p.push( new THREE.Vector3( this.origin.x, this.origin.y, this.origin.z ) );
			/*
			p.push( this.previous.x, this.previous.y, 0.0 );
			p.push( this.origin.x, this.origin.y, 0.0 );
			c.push( this.newCol[0], this.newCol[1], this.newCol[2] );
			c.push( this.newCol[0], this.newCol[1], this.newCol[2] );
			*/
			//fill(this.newCol[0],this.newCol[1],this.newCol[2]);
			//ellipse(this.origin.x, this.origin.y, this.size, this.size);
			//stroke(this.newCol[0],this.newCol[1],this.newCol[2]);
			//line(this.origin.x, this.origin.y, this.previous.x, this.previous.y);
			//noStroke();
		}
		
		
		this.getChildren = function() {
			let children = [];
			let childs = Math.floor( gaussian( this.childCount, this.childCountStdev ) + 0.5 );
			let dist = this.origin.distanceTo(this.previous);
			let direction = new THREE.Vector3( this.origin.x - this.previous.x, 
					                   this.origin.y - this.previous.y, 
							   this.origin.z - this.previous.z );
			//direction.normalize();

			for (let i=0; i<childs; i++) {
				let scale = 1.0;//randomGaussian( 1.0, distStdev);
				let newOrigin = new THREE.Vector3( scale*direction.x, scale*direction.y, scale*direction.z );
				//newOrigin.rotateAround( new THREE.Vector2(0,0),/*p5.randomGaussian*/gaussian( 0.0, this.dirStdev ) + depth*0.000001 );
				let rDir = randomDir();
				newOrigin.x += rDir.x;
				newOrigin.y += rDir.y;
				newOrigin.z += rDir.z;
				newOrigin.normalize();
				newOrigin.multiplyScalar(dist);
				newOrigin.x += this.origin.x;
				newOrigin.y += this.origin.y;
				newOrigin.z += this.origin.z;
				/*setTimeout( () => */
				children.push( new randomWalkTree( this.newCol, newOrigin, 
					this.origin, this.size, this.childCount - 0.0016, 
					this.childCountStdev+0.002, this.dirStdev+0.00001*this.depth, this.distStdev, this.depth + 1 ) );
			}
			return children;
		}
		
	}

	
	for (let iter = 0; iter < 1900; iter++) {
		//for (let i=0; i < 1; i++) {
		for (let cNodes of nodes) {
			for (let i=0; i < 20; i++) {
				if (cNodes.length > 0) {
					let cur = cNodes.pop();
					cur.show(/*positions*/ line_geo.vertices, colors);
					for (let n of cur.getChildren()) {
						cNodes.push(n);
					}
				}
			}
		}
		
	}

	//line_geo.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	//line_geo.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	//line_geo.computeBoundingSphere();
	let mesh_lines = new MeshLine();
	mesh_lines.setGeometry(line_geo);
	let mesh_lines_mat = new MeshLineMaterial({resolution: new THREE.Vector2( window.innerWidth, window.innerHeight )});
	return new THREE.Mesh( mesh_lines.geometry, mesh_lines_mat);//THREE.LineSegments( line_geo, line_mat );

	///////////////	

}

function gaussian(mean, stdev) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return stdev*Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )+mean;
}

function randomDir() {
	let v = new THREE.Vector3( gaussian(0.0, 1.0), gaussian(0.0, 1.0), gaussian(0.0, 1.0) );
	v.normalize();
	return v;
}

function render() {
	
	requestAnimationFrame( render );
	const t = Date.now()-start_time;
	lines.rotation.y += 0.01;
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

