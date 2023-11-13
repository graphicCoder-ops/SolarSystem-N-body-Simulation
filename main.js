import * as THREE from 'three';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';

const G_constant=1; // actual value is 6.67E-11; Gravitational Constant

const Delta=0.00001;

//Materials
const SunMaterial=new THREE.MeshBasicMaterial({color:0xfc4103});

class Planet{
    constructor(radius,x,y,z,material,mass){
       const sphereMesh=new THREE.SphereGeometry(radius,32,32);
        this.planet= new THREE.Mesh(sphereMesh,material);
        this.planet.position.set(x,y,z);
        this.Velocity=new THREE.Vector3(0,0,0);
        this.Acceleration=new THREE.Vector3(0,0,0);
        this.mass=mass;

    }
    setIntialVelocity(xSpeed,ySpeed,zSpeed){
        this.Velocity.set(xSpeed,ySpeed,zSpeed);
    }
    update(){
        //updating acceleration
        this.Velocity.add(this.Acceleration.multiplyScalar(Delta));
        //updating position
        this.planet.position.x+=this.Velocity.x;
        this.planet.position.y+=this.Velocity.y;
        this.planet.position.z+=this.Velocity.z;
    }
    calculateAcceleration(otherPlanets){
        
            for(var i=0;i<otherPlanets.length;i++){
            const Distance= this.planet.position.distanceTo(otherPlanets[i].planet.position);
            // maybe need to mod
            this.Acceleration.x+=(-1*G_constant*otherPlanets[i].mass*(this.planet.position.x-otherPlanets[i].planet.position.x))/Distance;
            this.Acceleration.y+=(-1*G_constant*otherPlanets[i].mass*(this.planet.position.y-otherPlanets[i].planet.position.y))/Distance;
            this.Acceleration.z+=(-1*G_constant*otherPlanets[i].mass*(this.planet.position.z-otherPlanets[i].planet.position.z))/Distance;
            }
        
        }
        }


//Creating Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1,100000);


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new ArcballControls( camera, renderer.domElement, scene );


//Layout Mesh
/*
const geometry = new THREE.PlaneGeometry( 10000, 10000,900,900 );
const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide,wireframe:true} );
const plane = new THREE.Mesh( geometry, material );
plane.rotateX(1.570);
scene.add( plane );*/

// Planet Meshes
const Sun=new Planet(30,0,0,0,SunMaterial,1000);

const Earth=new Planet(5,150,0,0,new THREE.MeshStandardMaterial({color:0x00ff00}),1);
Earth.setIntialVelocity(0,0,1);

const Mars=new Planet(5,228,0,0,new THREE.MeshStandardMaterial({color:0xff0000}),1);
Mars.setIntialVelocity(0,0,1);

const Venus=new Planet(3,108,0,0,new THREE.MeshStandardMaterial({color:0xffff00}),1);
Venus.setIntialVelocity(0,0,1);

const Mercury=new Planet(3,58,0,0,new THREE.MeshStandardMaterial({color:0xffffff}),1);
Mercury.setIntialVelocity(0,0,1);

const Jupiter=new Planet(20,778,0,0,new THREE.MeshStandardMaterial({color:0xf5d576}),1);
Jupiter.setIntialVelocity(0,0,1);

const Saturn=new Planet(15,1434,0,0,new THREE.MeshStandardMaterial({color:0xf5d576}),1);
Saturn.setIntialVelocity(0,0,1);

const Uranus=new Planet(10,2871,0,0,new THREE.MeshStandardMaterial({color:0xaaaaff}),1);
Uranus.setIntialVelocity(0,0,1);

const Neptune=new Planet(10,4495,0,0,new THREE.MeshStandardMaterial({color:0x0000ff}),1);
Neptune.setIntialVelocity(0,0,1);
// Lights
const SunLight=new THREE.PointLight(0xfc4103,1000000,1000000);
SunLight.position.set(0,0,0);


// adding planets to scene
scene.add(SunLight);
scene.add(Sun.planet);
scene.add(Mercury.planet);
scene.add(Venus.planet);
scene.add(Earth.planet);
scene.add(Mars.planet);
scene.add(Jupiter.planet);
scene.add(Saturn.planet);
scene.add(Uranus.planet);
scene.add(Neptune.planet);

// Camera Position
camera.position.z=300;
camera.position.y=20;
// Setting camera frustum



//updating
function update() {
	requestAnimationFrame( update );
    Sun.calculateAcceleration([Mercury,Venus,Earth,Mars,Jupiter,Saturn,Uranus,Neptune]);
    Mercury.calculateAcceleration([Sun,Venus,Earth,Mars,Jupiter,Saturn,Uranus,Neptune]);
    Venus.calculateAcceleration([Sun,Mercury,Earth,Mars,Jupiter,Saturn,Uranus,Neptune]);
    Earth.calculateAcceleration([Sun,Mercury,Venus,Mars,Jupiter,Saturn,Uranus,Neptune]);
    Mars.calculateAcceleration([Sun,Mercury,Venus,Earth,Jupiter,Saturn,Uranus,Neptune]);
    Jupiter.calculateAcceleration([Sun,Mercury,Venus,Earth,Mars,Saturn,Uranus,Neptune]);
    Saturn.calculateAcceleration([Sun,Mercury,Venus,Earth,Mars,Jupiter,Uranus,Neptune]);
    Uranus.calculateAcceleration([Sun,Mercury,Venus,Earth,Mars,Jupiter,Saturn,Neptune]);
    Neptune.calculateAcceleration([Sun,Mercury,Venus,Earth,Mars,Jupiter,Saturn,Uranus]);
    Sun.update();
    Mercury.update();
    Venus.update();
    Earth.update();
    Mars.update();
    Jupiter.update();
    Saturn.update();
    Uranus.update();
    Neptune.update();
	renderer.render( scene, camera );
}
update();

controls.update();