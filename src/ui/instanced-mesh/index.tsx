/**
 * Simple instanced mesh test with shadows
 *
 * Instanced meshes can solve performance issues if the same mesh needs to be used over and over
 * But all the instances must share the same geometry and material
 * Position, rotation, scale could be transformed (via setMatrixAt)
 */
import { Canvas, extend } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraControls } from "../common/camera-controls";
import { InstancedMesh, DoubleSide, Object3D } from "three";
// @ts-ignore
extend({ OrbitControls });

const Container = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid black;
`;

export const Boxes = () => {
  const ref = useRef<InstancedMesh>();
  useEffect(() => {
    if (ref.current) {
      const tempObj = new Object3D();
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          for (let z = 0; z < 10; z++) {
            tempObj.position.set(x * 1.2 - 6, y * 1.2 - 6, z * 1.2 - 6);
            tempObj.updateMatrix();
            ref.current.setMatrixAt(x * 100 + y * 10 + z, tempObj.matrix);
          }
        }
      }
    }
  }, [ref]);
  return (
    <instancedMesh ref={ref} args={[null, null, 1000]} castShadow receiveShadow>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color="red" side={DoubleSide} />
    </instancedMesh>
  );
};

export const InstancedMeshScene = () => {
  return (
    <Container>
      <Canvas
        flat
        dpr={window.devicePixelRatio}
        camera={{ far: 10000, position: [0, 0, 10] }}
        shadows
      >
        <Boxes />
        {/* <ambientLight /> */}
        <pointLight position={[0, 0, 12]} castShadow />
        <pointLight position={[4, 4, -12]} castShadow />
        <CameraControls lookAt={[0, 0, 0]} />
      </Canvas>
    </Container>
  );
};
