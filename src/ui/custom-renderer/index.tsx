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
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import * as THREE from "three";

extend({ OrbitControls });

const Container = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid black;
`;

const Renderer = () => {
  const {
    gl,
    scene,
    camera,
    size: { width, height },
  } = useThree();

  const { finalComposer, bloomComposer } = useMemo(() => {
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.5,
      0.4,
      0.85
    );
    bloomPass.strength = 3;
    bloomPass.threshold = 0;
    bloomPass.radius = 0;
    const bloomComposer = new EffectComposer(gl);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture },
        },
        vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
        fragmentShader: `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;

        varying vec2 vUv;

        void main() {
          gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
        }
      `,
        defines: {},
      }),
      "baseTexture"
    );
    finalPass.needsSwap = true;

    const finalComposer = new EffectComposer(gl);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);
    return { finalComposer, bloomComposer };
  }, [scene, camera, gl, width, height]);

  const bloomLayer = useMemo(() => {
    const layers = new THREE.Layers();
    layers.set(BLOOM_SCENE);
    return layers;
  }, []);

  const darkMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: "black" });
  }, []);
  useFrame(({ scene }) => {
    // when rendering bloom, darken non-bloom materials
    const materials = {};
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (bloomLayer.test(obj.layers) === false) {
          materials[obj.uuid] = obj.material;
          obj.material = darkMaterial;
        }
      }
    });
    bloomComposer.render();
    // restore the materials for the final render
    scene.traverse((obj) => {
      if (materials[obj.uuid]) {
        (obj as THREE.Mesh).material = materials[obj.uuid];
        delete materials[obj.uuid];
      }
    });
    finalComposer.render();
  }, 1);
  return null;
};

const BLOOM_SCENE = 1;
const ENTIRE_SCENE = 0;

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

        <Renderer />
      </Canvas>
    </Container>
  );
};
