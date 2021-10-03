// src/components/three-iss.js
import React, { Fragment } from 'react';
import * as THREE from 'three';

export const getVertex2 = (latitude, longitude, radius) => {
  const vector = new THREE.Vector3().setFromSpherical(
    new THREE.Spherical(
      radius,
      THREE.MathUtils.degToRad(90 - latitude),
      THREE.MathUtils.degToRad(longitude)
    )
  );
  return vector;
};

export const getVertex = (latitude, longitude, radius) => {
  const vector = new THREE.Vector3().setFromSpherical(
    new THREE.Spherical(
      radius,
      latitude,
      longitude
    )
  );
  return vector;
};

const ThreeDebris = ( { position, color, size} ) => {

  //console.log(position, color, size);

  function msg(position) {
    alert(`latitude: ${position.latitude}, longitude: ${position.longitude}, height: ${position.height}`);
  }

  return (
    <Fragment>
        <mesh onClick={() => msg(position)}
          position={getVertex(
            position.latitude,
            position.longitude,
            80 + position.height/10
          )}
        >
          <sphereGeometry args={[size]} />
          <meshBasicMaterial color={color} />
        </mesh>
    </Fragment>
  );
};

export default ThreeDebris;

