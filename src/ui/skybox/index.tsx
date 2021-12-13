/**
 * Simple skybox test
 */
import { Canvas, extend, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect } from "react";
import styled from "@emotion/styled";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Texture, TextureLoader, WebGLCubeRenderTarget } from "three";
import { CameraControls } from "../common/camera-controls";
// @ts-ignore
import SkyboxImage from "./assets/skybox3.jpg";
extend({ OrbitControls });

const Container = styled.div`
  width: 100%;
  height: 800px;
  border: 1px solid black;
`;

const Skybox = () => {
  const { scene, gl } = useThree();
  const texture = useLoader<Texture, string>(TextureLoader, SkyboxImage);
  console.log(texture.image.height);
  useEffect(() => {
    const rt = new WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(gl, texture);
    scene.background = rt.texture;
  }, [scene, gl, texture]);
  return null;
};

export const SkyboxScene = () => {
  return (
    <Container>
      <Canvas
        flat
        dpr={window.devicePixelRatio}
        camera={{ far: 10000, position: [50, 50, 10] }}
      >
        <Suspense fallback={null}>
          <Skybox />
        </Suspense>
        <CameraControls />
      </Canvas>
    </Container>
  );
};
