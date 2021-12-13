/**
 * Testing bloom effects
 *
 * Draw some rectangles with a "glow" effect
 */
import { Canvas, Vector2, Vector3 } from "@react-three/fiber";
import React from "react";
import styled from "@emotion/styled";
import { CameraControls } from "../common/camera-controls";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { DoubleSide } from "three";

const Container = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid black;
`;

/* Hmm... linewidth does not work (see note on https://threejs.org/docs/#api/en/materials/LineBasicMaterial.linewidth) */
// const Rectangle = ({
//   geom,
//   position,
//   color,
// }: {
//   geom: Vector2;
//   position: Vector3;
//   color: string;
// }) => {
//   const plane = new PlaneGeometry(geom[0], geom[1]);
//   return (
//     <lineSegments position={position}>
//       <edgesGeometry args={[plane]} attach="geometry" />
//       <lineBasicMaterial color={color} attach="material" linewidth={20} />
//     </lineSegments>
//   );
// };

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

export const BloomEffectScene = () => {
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
              position={[x * 1.2, 0, Math.random() * 2 - 1]}
              geom={[1, x]}
              color="white"
            />
          ))}
        <CameraControls lookAt={[0, 0, 0]} />
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
