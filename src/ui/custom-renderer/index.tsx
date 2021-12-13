/**
 * Trying to apply https://threejs.org/examples/?q=bloom#webgl_postprocessing_unreal_bloom_selective
 * But use react-three/fiber
 * The fact that this basically uses a ton of imperative code begs the question of the value of R3F altogether
 *
 * tbh I can't even explain how the render passes work
 * The first render of bloomcomposer we override meshes of non-bloom materials to black and render the bloom
 * (However, this composer has renderToScreen=false so it's just prepping the final pass)
 * Then we restore all the materials and do a render of the finalcomposer
 * The final composer uses a custom shader pass which combines the rendered output of bloom composer with the base texture
 * appropriately.
 */
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { CameraControls } from "../common/camera-controls";
import { OrbitControls } from "@react-three/drei";
// TODO yarn add postprocessing and import from there
import * as THREE from "three";
import { BloomLayeredRenderer } from "./bloom-layered-renderer";

extend({ OrbitControls });

const Container = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid black;
`;

const BLOOM_SCENE = 1;

export const CustomRenderer = () => {
  const glowing = useMemo(() => {
    const layers = new THREE.Layers();
    layers.enable(BLOOM_SCENE);
    return layers;
  }, []);

  return (
    <Container>
      <Canvas
        flat
        dpr={window.devicePixelRatio}
        camera={{ far: 10000, position: [0, -5, 2] }}
      >
        <color attach="background" args={["black"]} />
        <CameraControls lookAt={[0, 0, 0]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[3, -2, 4]} intensity={0.8} />

        <mesh position={[-1.2, 0, 0]} layers={glowing}>
          <boxGeometry args={[1, 1, 1]} attach="geometry" />
          <meshPhongMaterial color="#00ff00" />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} attach="geometry" />
          <meshPhongMaterial color="#ff0000" />
        </mesh>

        <mesh position={[1.2, 0, 0]} layers={glowing}>
          <boxGeometry args={[1, 1, 1]} attach="geometry" />
          <meshPhongMaterial color="#0000ff" />
        </mesh>

        <BloomLayeredRenderer bloomLayer={BLOOM_SCENE} />
      </Canvas>
    </Container>
  );
};
