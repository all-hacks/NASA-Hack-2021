// src/components/three-iss.js
import React, { Fragment } from 'react';
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

const ThreeObject = () => {

  // Sample TLE
  var tleLine1 = '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992',
      tleLine2 = '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442';  

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
      {
        <mesh onClick={msgAlert}
          position={getVertex(
            positionGd.latitude,
            positionGd.longitude,
            80 + positionGd.height/10
//            120
          )}
        >
          <sphereGeometry args={[2]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      }
    </Fragment>
  );
};

export default ThreeObject;

