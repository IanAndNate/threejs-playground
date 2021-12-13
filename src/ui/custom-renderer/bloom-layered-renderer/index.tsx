import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import * as THREE from "three";

interface Props {
  bloomLayer: number;
}

export const BloomLayeredRenderer = ({ bloomLayer }: Props) => {
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
  
    const bloomThreeLayer = useMemo(() => {
      const layers = new THREE.Layers();
      layers.set(bloomLayer);
      return layers;
    }, [bloomLayer]);
  
    const darkMaterial = useMemo(() => {
      return new THREE.MeshBasicMaterial({ color: "black" });
    }, []);
    useFrame(({ scene }) => {
      // when rendering bloom, darken non-bloom materials
      const materials = {};
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (bloomThreeLayer.test(obj.layers) === false) {
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