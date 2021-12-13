/**
 * Putting stuff together, I want to
 * - draw some boxes representing the piano keys
 * - when a key is pressed, show a bloom effect on the key so it "glows"
 */
import { Canvas, extend, useThree, Vector2, Vector3 } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { CameraControls } from "../common/camera-controls";
import {
  SelectiveBloom,
  EffectComposer,
  Bloom,
} from "@react-three/postprocessing";
import { DoubleSide, Mesh } from "three";
import { OrbitControls } from "@react-three/drei";

extend({ OrbitControls });

const Container = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid black;
`;

const Key = ({ position, color }: { position: Vector3; color: string }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 5, 0.3]} attach="geometry" />
      <meshPhongMaterial color={color} />
    </mesh>
  );
};

export const Piano = () => {
  return (
    <Container>
      <Canvas
        flat
        dpr={window.devicePixelRatio}
        camera={{ far: 10000, position: [0, -5, 2] }}
      >
        <color attach="background" args={["black"]} />
        <CameraControls lookAt={[0, 0, 0]} />
        <Key position={[0, 0, 0]} color="white" />
        <Key position={[1.3, 0, 0]} color="#808080" />
        <ambientLight intensity={0.2} />
        <directionalLight position={[3, -2, 4]} intensity={0.5} />
        {/* <EffectComposer multisampling={8}>
           <SelectiveBloom
             kernelSize={5}
             luminanceThreshold={0}
             luminanceSmoothing={0.4}
             intensity={2.0}
             // selectionLayer={10}
             selection={bloomRef}
           />
         </EffectComposer> */}

        <EffectComposer multisampling={8}>
          <Bloom
            kernelSize={3}
            luminanceThreshold={0}
            luminanceSmoothing={0.4}
            intensity={0.6}
          />
          <Bloom
            kernelSize={5}
            luminanceThreshold={0}
            luminanceSmoothing={0}
            intensity={0.5}
          />
        </EffectComposer>
      </Canvas>
    </Container>
  );
};
