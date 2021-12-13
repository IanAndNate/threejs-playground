import { extend, useThree, useFrame, Vector3 } from "@react-three/fiber";
import React, { useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ OrbitControls });

interface Props {
  lookAt?: Vector3;
}

export const CameraControls = ({ lookAt }: Props) => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef<OrbitControls>();
  useFrame(() => controls.current.update());
  return (
    //@ts-ignore
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={true}
      // maxAzimuthAngle={Math.PI / 4}
      // maxPolarAngle={Math.PI}
      // minAzimuthAngle={-Math.PI / 4}
      // minPolarAngle={0}
      target={lookAt || [50, 50, 0]}
    />
  );
};
