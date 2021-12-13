/**
 * Testing bloom effects
 *
 * Draw some rectangles with a "glow" effect
 */
import { Canvas, extend, Vector2, Vector3 } from "@react-three/fiber";
import React, { Suspense } from "react";
import styled from "@emotion/styled";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraControls } from "../common/camera-controls";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { DoubleSide } from "three";
import { Reflector, useTexture } from "@react-three/drei";
import NormalTexture from "./assets/SurfaceImperfections003_1K_Normal.jpg";
import FloorTexture from "./assets/SurfaceImperfections003_1K_var1.jpg";

extend({ OrbitControls });

const Container = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid black;
`;

const Rectangle = ({
  geom,
  position,
  color,
}: {
  geom: Vector2;
  position: Vector3;
  color: string;
}) => {
  return (
    <mesh position={position}>
      <planeGeometry args={[geom[0], geom[1]]} attach="geometry" />
      <meshBasicMaterial color={color} attach="material" side={DoubleSide} />
    </mesh>
  );
};

const Mirror = () => {
  const [floor, normal] = useTexture([FloorTexture, NormalTexture]);
  return (
    <Reflector
      resolution={1024}
      args={[30, 30]}
      mirror={1}
      mixBlur={10}
      mixStrength={1}
      // rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      blur={[300, 120]}
      position-z={-3}
    >
      {(Material, props) => (
        <Material
          color="#f0f0f0"
          metalness={0}
          roughnessMap={floor}
          roughness={1}
          normalMap={normal}
          // normalScale={[0.6, 0.6]}
          {...props}
        />
      )}
    </Reflector>
  );
};

export const ReflectorScene = () => {
  return (
    <Container>
      <Canvas
        flat
        dpr={window.devicePixelRatio}
        camera={{ far: 10000, position: [0, 0, 10] }}
      >
        <color attach="background" args={["black"]} />
        <ambientLight />
        {Array(10)
          .fill(null)
          .map((_, x) => (
            <Rectangle
              key={x}
              position={[x * 1.2, 0, 0]}
              geom={[1, x]}
              color="white"
            />
          ))}
        <CameraControls lookAt={[0, 0, 0]} />
        <Suspense fallback={null}>
          <Mirror />
        </Suspense>
        <mesh position={[1, 1, 1]}>
          <boxGeometry args={[1, 1, 1]} attach="geometry" />
          <meshBasicMaterial color="blue" attach="material" />
        </mesh>
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
