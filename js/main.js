'use strict';

import * as THREE from './three.module.js';
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
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.2, 100 );
	camera.position.z = 5;
	renderer = new THREE.WebGLRenderer({antialias:false});
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	document.body.appendChild( renderer.domElement );

	mouse = new THREE.Vector2();
	//raycaster = new THREE.Raycaster();
	current_sel = null;
	
	const room_geo = new THREE.BoxBufferGeometry( 
		45, 
		20, 
		45 );

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

	let line_geo = new THREE.BufferGeometry();
	let line_mat = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

	let positions = [];
	let colors = [];

	////////////
	

	
	let nodes = [];

	let count = 5;
	for (let i=0; i<count; i++) {
		let c = [255*1/*Math.random()*/, 0*Math.random(), 0*Math.random()];
		let o = new THREE.Vector2(2.0*(i-count/2),0); //p5.createVector(0, 0);
		let p = new THREE.Vector2(o.x, o.y+0.3); //p5.createVector(o.x, o.y + 0.5);
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

			p.push( this.previous.x, this.previous.y, 0.0 );
			p.push( this.origin.x, this.origin.y, 0.0 );
			c.push( this.newCol[0], this.newCol[1], this.newCol[2] );
			c.push( this.newCol[0], this.newCol[1], this.newCol[2] );

			//fill(this.newCol[0],this.newCol[1],this.newCol[2]);
			//ellipse(this.origin.x, this.origin.y, this.size, this.size);
			//stroke(this.newCol[0],this.newCol[1],this.newCol[2]);
			//line(this.origin.x, this.origin.y, this.previous.x, this.previous.y);
			//noStroke();
		}
		
		
		this.getChildren = function() {
			let children = [];
			let childs = /*p5.round*/ Math.floor( /*p5.randomGaussian*/ gaussian( this.childCount, this.childCountStdev )() + 0.5 );
			let direction = /*p5.createVector*/ new THREE.Vector2( this.origin.x - this.previous.x, this.origin.y - this.previous.y);
			//direction.normalize();

			for (let i=0; i<childs; i++) {
				let scale = 1.0;//randomGaussian( 1.0, distStdev);
				let newOrigin = /*p5.createVector*/ new THREE.Vector2( scale*direction.x, scale*direction.y );
				newOrigin.rotateAround( new THREE.Vector2(0,0),/*p5.randomGaussian*/gaussian( 0.0, this.dirStdev )() + depth*0.000001 );
				newOrigin.x += this.origin.x;
				newOrigin.y += this.origin.y;
				/*setTimeout( () => */
				children.push( new randomWalkTree( this.newCol, newOrigin, 
					this.origin, this.size, this.childCount - 0.0006, 
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
					cur.show(positions, colors);
					for (let n of cur.getChildren()) {
						cNodes.push(n);	
					}
				}
			}
		}
		
	}

	line_geo.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	line_geo.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	line_geo.computeBoundingSphere();
	return new THREE.LineSegments( line_geo, line_mat );

	///////////////	

}

function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;               
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }

       var retval = mean + stdev * y1;
       if(retval > 0) 
           return retval;
       return -retval;
   }
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

