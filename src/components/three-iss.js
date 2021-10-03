import React, { Fragment, useEffect, useState } from 'react';
import * as THREE from 'three';
import axios from 'axios';

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

const issFacts = [
"An international partnership of five space agencies from 15 countries operates the International Space Station.",
"The space station has been continuously occupied since November 2000.",
"An international crew of seven people live and work while traveling at a speed of five miles per second, orbiting Earth about every 90 minutes. Sometimes more are aboard the station during a crew handover.",
"In 24 hours, the space station makes 16 orbits of Earth, traveling through 16 sunrises and sunsets.",
"Peggy Whitson set the U.S. record for spending the most total time living and working in space at 665 days on Sept. 2, 2017.",
"The acre of solar panels that power the station means sometimes you can look up in the sky at dawn or dusk and see the spaceship flying over your home, even if you live in a big city.",
"The living and working space in the station is larger than a six-bedroom house (and has six sleeping quarters, two bathrooms, a gym, and a 360-degree view bay window).",
"To mitigate the loss of muscle and bone mass in the human body in microgravity, the astronauts work out at least two hours a day.",
"Astronauts and cosmonauts regularly conduct spacewalks for space station construction, maintenance and upgrades.",
"The solar array wingspan (356 feet, 109 meters) is longer than the world’s largest passenger aircraft, the Airbus A380 (262 feet, 80 meters).",
"The large modules and other pieces of the station were delivered on 42 assembly flights, 37 on the U.S. space shuttles and five on Russian Proton/Soyuz rockets.",
"The space station is 356 feet (109 meters) end-to-end, one yard shy of the full length of an American football field including the end zones.",
"Eight miles of wire connects the electrical power system aboard the space station.",
"The 55-foot robotic Canadarm2 has seven different joints and two end-effectors, or hands, and is used to move entire modules, deploy science experiments and even transport spacewalking astronauts.",
"Eight spaceships can be connected to the space station at once.",
"A spacecraft can arrive at the space station as soon as four hours after launching from Earth.",
"Four different cargo spacecraft deliver science, cargo and supplies: Northrop Grumman’s Cygnus, SpaceX’s Dragon, JAXA’s HTV, and the Russian Progress.",
"Through Expedition 60, the microgravity laboratory has hosted nearly 3,000 research investigations from researchers in more than 108 countries.",
"The station’s orbital path takes it over 90 percent of the Earth’s population, with astronauts taking millions of images of the planet below.",
"More than 20 different research payloads can be hosted outside the station at once, including Earth sensing equipment, materials science payloads, particle physics experiments like the Alpha Magnetic Spectrometer-02 and more.",
"The space station travels an equivalent distance to the Moon and back in about a day.",
"The Water Recovery System reduces crew dependence on water delivered by a cargo spacecraft by 65 percent – from about 1 gallon a day to a third of a gallon.",
"On-orbit software monitors approximately 350,000 sensors, ensuring station and crew health and safety.",
"The space station has an internal pressurized volume equal that of a Boeing 747.",
"More than 50 computers control the systems on the space station.",
"More than 3 million lines of software code on the ground support more than 1.5 million lines of flight software code.",
"In the International Space Station’s U.S. segment alone, more than 1.5 million lines of flight software code run on 44 computers communicating via 100 data networks transferring 400,000 signals."
];

const ThreeIss = () => {
  const [issNow, setIssNow] = useState(null);

  const poll = () => {
    axios
      .get('/api/get-iss-location')
      .then((response) => {
        setIssNow(response.data.iss_now);
      })
      .catch((error) => {
        console.log(error);
        throw new Error();
      });
  };

  function msg(position) {
    let rand = Math.floor(Math.random() * issFacts.length);
    console.log('iss facts length', rand);

    alert(`latitude: ${position.latitude}, longitude: ${position.longitude}, height: ${position.altitude}, fact: ${issFacts[rand]}`);
  }

  useEffect(() => {
    const pollInterval = setInterval(() => {
      poll();
    }, 5000);

    poll();
    return () => clearInterval(pollInterval);
  }, []);

  return (
    <Fragment>
      {issNow ? (
        <mesh onClick={() => msg(issNow)}
          position={getVertex(
            issNow.latitude,
            issNow.longitude,
            80+issNow.altitude / 10
//            120
          )}
        >
          <sphereGeometry args={[2]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      ) : null}
    </Fragment>
  );
};

export default ThreeIss;

