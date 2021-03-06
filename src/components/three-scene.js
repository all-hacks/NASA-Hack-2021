// src/components/three-scene.js
import React, { Fragment } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import ThreeSphere from './three-sphere';
import ThreeGeo from './three-geo';
import ThreeIss from './three-iss';
import ThreeObject from './three-object';
import ThreeBox from './three-box';
import ThreeDebris from './three-debris';

import { data } from './two-line-debris';
import { cosmos } from './cosmos-debris';
import { iridium } from './iridium-debris';
import { brightest } from './100-brightest-debris';
import { chineseASAT } from './chinese-asat-debris';
import * as THREE from 'three';

var satellite = require('satellite.js');

export const getVertex = (latitude, longitude, radius) => {
  const vector = new THREE.Vector3().setFromSpherical(
    new THREE.Spherical(
      radius,
      THREE.MathUtils.degToRad(90 - latitude),
      THREE.MathUtils.degToRad(longitude)
    )
  );
  return vector;
};


function computePositions(data, positions, now) {
  let count = data.length/2;

  for (let i=0; i<count; i++) {
    // Sample TLE
    var tleLine1 = data[2*i], tleLine2 = data[2*i + 1];

    //console.log(tleLine1, tleLine2);

    // Initialize a satellite record
    var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

    //  Or you can use a JavaScript Date
    var positionAndVelocity = satellite.propagate(satrec, now);

    // You will need GMST for some of the coordinate transforms.
    // http://en.wikipedia.org/wiki/Sidereal_time#Definition
    var gmst = satellite.gstime(now);

    var positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

    positions.push(positionGd);

  }
}

var now = new Date();

var iridiumPositions = [];
computePositions(iridium, iridiumPositions, now);

//console.log(iridiumPositions);

var cosmosPositions = [];
computePositions(cosmos, cosmosPositions, now);

var brightestPositions = [];
computePositions(brightest, brightestPositions, now);

console.log('brightest', brightest.length);

var chineseASATPositions = [];
computePositions(chineseASAT, chineseASATPositions, now);

console.log(data.length);

  let debris = [];

  let count = data.length/2;
  for (let i=0; i<count; i++) {
  // Sample TLE
  var tleLine1 = data[2*i],
      tleLine2 = data[2*i + 1];

  //console.log(tleLine1, tleLine2);

  // Initialize a satellite record
  var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

  var now = new Date();

  //  Or you can use a JavaScript Date
  var positionAndVelocity = satellite.propagate(satrec, now);

  // You will need GMST for some of the coordinate transforms.
  // http://en.wikipedia.org/wiki/Sidereal_time#Definition
  var gmst = satellite.gstime(now);

  var positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

  debris.push(positionGd);

  }

const ThreeScene = () => {

  return (
    <Canvas
      gl={{ antialias: false, alpha: false }}
      camera={{
        fov: 45,
        position: [0, 0, 300]
      }}
      onCreated={({ gl }) => {
        gl.setClearColor('#ffffff');
      }}
      style={{
        width: '100vw',
        height: '100vh',
        cursor: 'move'
      }}
    >

      <OrbitControls enableRotate={true} enableZoom={false} enablePan={false} />
      <ThreeSphere />
      <ThreeGeo />
      <ThreeIss />

      {
        chineseASATPositions.map((position, index) => (
          <ThreeDebris key={index} position={position} color="yellow" size="0.5" />
        ))
      }
      {
        iridiumPositions.map((position, index) => (
          <ThreeDebris key={index} position={position} color="orange" size="0.5" />
        ))
      }
      {
        cosmosPositions.map((position, index) => (
          <ThreeDebris key={index} position={position} color="green" size="0.5" />
        ))
      }
    </Canvas>
  );
};

export default ThreeScene;

