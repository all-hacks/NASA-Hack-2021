// src/components/three-iss.js
import React, { Fragment, useRef, useState } from 'react';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber'

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

function Box(props) {
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const ThreeBox = () => {

  // Sample TLE
  var tleLine1 = '1 22675U 93036A   21275.06108112  .00000013  00000+0  14382-4 0  9994',
      tleLine2 = '2 22675  74.0388 234.5571 0025645 329.6232  30.3431 14.32581580478549';

  // Initialize a satellite record
  var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

  var now = new Date();

  //  Or you can use a JavaScript Date
  var positionAndVelocity = satellite.propagate(satrec, now);

  // You will need GMST for some of the coordinate transforms.
  // http://en.wikipedia.org/wiki/Sidereal_time#Definition
  var gmst = satellite.gstime(now);

  var positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

  console.log(positionGd);

  function msgAlert() {
    alert('test');
  }

  return (
    <Fragment>
      <Box position={getVertex(
            positionGd.latitude,
            positionGd.longitude,
            80 + positionGd.height/10
          )} />
    </Fragment>
  );
};

export default ThreeBox;

