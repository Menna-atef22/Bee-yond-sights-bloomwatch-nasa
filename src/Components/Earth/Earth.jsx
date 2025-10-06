import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import worldMapTexture from "../../assets/test.png";

// This component contains the actual 3D object.
function EarthMesh() {
  const meshRef = useRef();
  
  // useTexture is a hook from 'drei' that simplifies loading textures.
  const texture = useTexture(worldMapTexture);

  // useFrame is a hook that runs on every rendered frame.
  useFrame(() => {
    if (meshRef.current) {
      // This is the animation loop
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} rotation-z={THREE.MathUtils.degToRad(23.5)}>
      <sphereGeometry args={[1, 64, 64]} />
      {/* R3F automatically handles cleanup for geometry and materials */}
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// This is your main component that sets up the scene.
function Earth() {
  return (
    <div style={{ width: "100%", height: "60vh" }}>
      <Canvas>
        {/* The Canvas component sets up the scene, camera, and renderer */}
        <ambientLight intensity={0.2} />
        <directionalLight color={0xe3f1ff} position={[0, 0, 10]} intensity={1.0} />
        
        <EarthMesh />
        
        {/* OrbitControls is a ready-made component in 'drei' */}
        <OrbitControls 
          enableZoom={true} 
          minDistance={1.25} 
          maxDistance={10} 
        />
      </Canvas>
    </div>
  );
}

export default Earth;