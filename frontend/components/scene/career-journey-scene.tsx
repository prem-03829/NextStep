"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import anime from "animejs";
import * as THREE from "three";
import { MathUtils, Vector3 } from "three";

type SceneProps = {
  progress: number;
  activeSection: number;
};

type HorizonRigProps = {
  progress: number;
  activeSection: number;
  reducedMotion: boolean;
};

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reducedMotion;
}

function roadX(z: number) {
  return 0.5 + Math.sin(z * 0.03) * 1.2 + Math.sin(z * 0.011) * 1.8;
}

function Road() {
  const segments = useMemo(
    () =>
      Array.from({ length: 180 }, (_, index) => {
        const z = 8 - index * 2.4;
        const nextZ = z - 2.4;
        const x = roadX(z);
        const nextX = roadX(nextZ);
        const angle = Math.atan2(nextX - x, nextZ - z);

        return {
          key: `road-${index}`,
          position: new Vector3(x, -1.72, z),
          angle,
          showMarker: index % 5 === 0,
        };
      }),
    [],
  );

  return (
    <group>
      {segments.map((segment) => (
        <group
          key={segment.key}
          position={segment.position.toArray() as [number, number, number]}
          rotation={[-0.02, segment.angle, 0]}
        >
          <mesh receiveShadow>
            <boxGeometry args={[5.2, 0.05, 2.5]} />
            <meshStandardMaterial
              color="#20283d"
              roughness={1}
              metalness={0}
              flatShading
            />
          </mesh>

          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.14, 0.01, segment.showMarker ? 0.9 : 0.2]} />
            <meshStandardMaterial color="#f3f6fd" roughness={1} metalness={0} flatShading />
          </mesh>

          <mesh position={[2.02, 0.025, 0]}>
            <boxGeometry args={[0.08, 0.01, 2.2]} />
            <meshStandardMaterial color="#dce6f4" roughness={1} metalness={0} flatShading />
          </mesh>

          <mesh position={[-2.02, 0.025, 0]}>
            <boxGeometry args={[0.08, 0.01, 2.2]} />
            <meshStandardMaterial color="#dce6f4" roughness={1} metalness={0} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Landscape() {
  const upperSkyTexture = useVerticalGradientTexture(
    "rgba(8, 16, 36, 0.98)",
    "rgba(16, 24, 52, 0.9)",
    "rgba(16, 24, 52, 0)",
  );
  const midSkyTexture = useVerticalGradientTexture(
    "rgba(24, 30, 58, 0.88)",
    "rgba(34, 33, 66, 0.66)",
    "rgba(34, 33, 66, 0)",
  );
  const dawnTexture = useVerticalGradientTexture(
    "rgba(122, 82, 90, 0.06)",
    "rgba(210, 127, 104, 0.22)",
    "rgba(210, 127, 104, 0)",
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.76, -120]} receiveShadow>
        <planeGeometry args={[220, 320]} />
        <meshStandardMaterial color="#09111f" roughness={1} metalness={0} flatShading />
      </mesh>

      <mesh position={[0, 22, -186]}>
        <planeGeometry args={[300, 72]} />
        <meshBasicMaterial map={upperSkyTexture} transparent opacity={1} depthWrite={false} />
      </mesh>

      <mesh position={[0, 13, -192]}>
        <planeGeometry args={[280, 42]} />
        <meshBasicMaterial map={midSkyTexture} transparent opacity={1} depthWrite={false} />
      </mesh>

      <mesh position={[0, 6.2, -196]}>
        <planeGeometry args={[240, 20]} />
        <meshBasicMaterial map={midSkyTexture} transparent opacity={0.55} depthWrite={false} />
      </mesh>

      <mesh position={[0, 2.3, -199]}>
        <planeGeometry args={[220, 9]} />
        <meshBasicMaterial map={dawnTexture} transparent opacity={1} depthWrite={false} />
      </mesh>

      <mesh position={[0, -0.6, -202]}>
        <planeGeometry args={[260, 4.5]} />
        <meshBasicMaterial map={dawnTexture} transparent opacity={0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}

function useRadialGlowTexture(innerColor: string, outerColor: string) {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    if (!context) {
      return new THREE.Texture();
    }

    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.08,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(0.38, innerColor);
    gradient.addColorStop(1, outerColor);
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [innerColor, outerColor]);
}

function useVerticalGradientTexture(
  topColor: string,
  middleColor: string,
  bottomColor: string,
) {
  return useMemo(() => {
    const width = 64;
    const height = 512;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) {
      return new THREE.Texture();
    }

    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, topColor);
    gradient.addColorStop(0.48, middleColor);
    gradient.addColorStop(1, bottomColor);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [topColor, middleColor, bottomColor]);
}

function Sun({
  progressRef,
}: {
  progressRef: MutableRefObject<{ value: number }>;
}) {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const auraRef = useRef<THREE.Sprite>(null);
  const horizonGlowRef = useRef<THREE.Sprite>(null);
  const glowTexture = useRadialGlowTexture(
    "rgba(255, 214, 158, 0.95)",
    "rgba(255, 214, 158, 0)",
  );
  const auraTexture = useRadialGlowTexture(
    "rgba(255, 154, 112, 0.55)",
    "rgba(255, 154, 112, 0)",
  );
  const horizonTexture = useRadialGlowTexture(
    "rgba(255, 140, 106, 0.45)",
    "rgba(255, 140, 106, 0)",
  );

  useFrame((_, delta) => {
    const t = progressRef.current.value;
    const sunrise = MathUtils.clamp((t - 0.58) / 0.42, 0, 1);
    const eased = 1 - Math.pow(1 - sunrise, 3);
    const riseY = -2.4 + eased * 3.2;
    const sunZ = -183;
    const sunX = 6.2;

    if (sunRef.current) {
      sunRef.current.position.set(sunX, riseY, sunZ);
      sunRef.current.scale.setScalar(1.18);
      const material = sunRef.current.material as THREE.MeshBasicMaterial;
      material.color.setStyle(sunrise < 0.55 ? "#ff9e63" : "#ffd89a");
    }

    if (glowRef.current) {
      glowRef.current.position.set(sunX, riseY + 1.8, sunZ + 0.2);
      glowRef.current.scale.x = MathUtils.lerp(glowRef.current.scale.x, 16, 0.08 + delta);
      glowRef.current.scale.y = MathUtils.lerp(glowRef.current.scale.y, 10, 0.08 + delta);
      const material = glowRef.current.material as THREE.SpriteMaterial;
      material.opacity = MathUtils.lerp(material.opacity, 0.08 + eased * 0.12, 0.08);
    }

    if (auraRef.current) {
      auraRef.current.position.set(sunX, riseY + 2.2, sunZ + 0.1);
      auraRef.current.scale.x = MathUtils.lerp(auraRef.current.scale.x, 24, 0.08 + delta);
      auraRef.current.scale.y = MathUtils.lerp(auraRef.current.scale.y, 12, 0.08 + delta);
      const material = auraRef.current.material as THREE.SpriteMaterial;
      material.opacity = MathUtils.lerp(material.opacity, 0.04 + eased * 0.05, 0.08);
    }

    if (horizonGlowRef.current) {
      horizonGlowRef.current.position.set(sunX * 0.64, 0.5 + eased * 0.25, -188);
      horizonGlowRef.current.scale.x = MathUtils.lerp(horizonGlowRef.current.scale.x, 62, 0.08 + delta);
      horizonGlowRef.current.scale.y = MathUtils.lerp(horizonGlowRef.current.scale.y, 9, 0.08 + delta);
      const material = horizonGlowRef.current.material as THREE.SpriteMaterial;
      material.opacity = MathUtils.lerp(material.opacity, 0.06 + eased * 0.08, 0.08);
    }
  });

  return (
    <group>
      <sprite ref={horizonGlowRef} position={[0, 0.5, -188]} scale={[62, 9, 1]}>
        <spriteMaterial
          map={horizonTexture}
          transparent
          opacity={0.08}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <mesh ref={sunRef}>
        <sphereGeometry args={[2.1, 40, 40]} />
        <meshBasicMaterial color="#ffb36b" />
      </mesh>
      <sprite ref={auraRef} position={[0, 0, 0]} scale={[24, 12, 1]}>
        <spriteMaterial
          map={auraTexture}
          transparent
          opacity={0.06}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite ref={glowRef} position={[0, 0, 0]} scale={[16, 10, 1]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0.12}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

function StarField() {
  const pointsRef = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const values = new Float32Array(900 * 3);
    for (let index = 0; index < 900; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 220;
      values[index * 3 + 1] = Math.random() * 80 + 6;
      values[index * 3 + 2] = -Math.random() * 260;
    }
    return values;
  });

  useFrame((state) => {
    if (!pointsRef.current) {
      return;
    }
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.002;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f7fbff"
        size={0.52}
        sizeAttenuation
        transparent
        opacity={0.16}
        depthWrite={false}
      />
    </points>
  );
}

function GuidanceBands({
  progressRef,
}: {
  progressRef: MutableRefObject<{ value: number }>;
}) {
  const bandRefs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame((state) => {
    const t = progressRef.current.value;

    bandRefs.current.forEach((band, index) => {
      if (!band) {
        return;
      }

      band.rotation.z = state.clock.elapsedTime * (0.04 + index * 0.01);
      band.rotation.y = Math.sin(state.clock.elapsedTime * 0.12 + index) * 0.18;
      band.position.y = 8 + index * 1.8 + Math.sin(state.clock.elapsedTime * 0.4 + index) * 0.28;

      const material = band.material as THREE.MeshBasicMaterial;
      material.opacity = MathUtils.lerp(0.03, 0.12, Math.max(t, 0.18));
    });
  });

  return (
    <group position={[4, 0, -168]}>
      {[
        { radius: 12, tube: 0.08, color: "#8dc1ff", rotation: 0.46 },
        { radius: 17, tube: 0.06, color: "#ffab7a", rotation: -0.18 },
        { radius: 22, tube: 0.05, color: "#cbdcff", rotation: 0.2 },
      ].map((band, index) => (
        <mesh
          key={band.radius}
          ref={(node) => {
            bandRefs.current[index] = node;
          }}
          rotation={[Math.PI / 2.8, 0, band.rotation]}
        >
          <torusGeometry args={[band.radius, band.tube, 16, 180]} />
          <meshBasicMaterial color={band.color} transparent opacity={0.04} />
        </mesh>
      ))}
    </group>
  );
}

function RoadsideBeacons({
  progressRef,
}: {
  progressRef: MutableRefObject<{ value: number }>;
}) {
  const beaconRefs = useRef<Array<THREE.Mesh | null>>([]);
  const beacons = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => {
        const z = -20 - index * 10;
        const side = index % 2 === 0 ? -1 : 1;
        return {
          x: roadX(z) + side * 2.85,
          z,
        };
      }),
    [],
  );

  useFrame((state) => {
    const cameraZ = MathUtils.lerp(6, -168, progressRef.current.value);

    beaconRefs.current.forEach((beacon, index) => {
      if (!beacon) {
        return;
      }

      const distance = Math.abs(cameraZ - beacons[index].z);
      const visibility = MathUtils.clamp(1 - distance / 40, 0, 1);
      beacon.position.y = -0.76 + Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.05;

      const material = beacon.material as THREE.MeshBasicMaterial;
      material.opacity = 0.08 + visibility * 0.24;
    });
  });

  return (
    <group>
      {beacons.map((beacon, index) => (
        <mesh
          key={`beacon-${beacon.z}`}
          ref={(node) => {
            beaconRefs.current[index] = node;
          }}
          position={[beacon.x, -0.76, beacon.z]}
        >
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color={index % 2 === 0 ? "#8fc6ff" : "#ffb27d"} transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function FeatureSigns({
  progressRef,
  activeSection,
}: {
  progressRef: MutableRefObject<{ value: number }>;
  activeSection: number;
}) {
  const signRefs = useRef<Array<THREE.Group | null>>([]);
  const signs = useMemo(
    () => [
      { label: "Discover Yourself", z: -40, side: -1 },
      { label: "Skill Gap Analysis", z: -76, side: 1 },
      { label: "Explore Careers", z: -114, side: -1 },
      { label: "Choose Your Path", z: -152, side: 1 },
    ],
    [],
  );

  useFrame((_, delta) => {
    const cameraZ = MathUtils.lerp(6, -168, progressRef.current.value);

    signRefs.current.forEach((sign, index) => {
      if (!sign) {
        return;
      }

      const data = signs[index];
      const baseX = roadX(data.z) + data.side * 4.2;
      const distance = Math.abs(cameraZ - data.z);
      const visibility = MathUtils.clamp(1 - distance / 38, 0, 1);
      const activeBoost = activeSection === index + 1 ? 0.2 : 0;
      sign.position.x = MathUtils.lerp(sign.position.x, baseX, 0.08 + delta);
      sign.position.y = MathUtils.lerp(
        sign.position.y,
        -0.45 + visibility * 0.2,
        0.08 + delta,
      );
      sign.position.z = data.z;
      sign.rotation.y = MathUtils.lerp(
        sign.rotation.y,
        data.side === -1 ? 0.28 : -0.28,
        0.08,
      );
      sign.scale.setScalar(MathUtils.lerp(sign.scale.x, 0.7 + visibility * 0.35, 0.08));

      sign.children.forEach((child, childIndex) => {
        if (!(child instanceof THREE.Mesh)) {
          return;
        }
        const material = child.material as THREE.MeshStandardMaterial;
        if (childIndex === 0) {
          material.opacity = 0.3 + visibility * 0.5;
        } else {
          material.opacity = 0.22 + visibility * 0.52 + activeBoost;
          material.emissiveIntensity = visibility * 0.5 + activeBoost;
        }
      });
    });
  });

  return (
    <group>
      {signs.map((sign, index) => (
        <group
          key={sign.label}
          ref={(node) => {
            signRefs.current[index] = node;
          }}
          position={[roadX(sign.z) + sign.side * 4.2, -0.45, sign.z]}
          scale={0.7}
        >
          <mesh position={[0, -0.9, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1.7, 10]} />
            <meshStandardMaterial
              color="#7f8aa5"
              transparent
              opacity={0.3}
              roughness={1}
              metalness={0}
              flatShading
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.6, 0.85, 0.14]} />
            <meshStandardMaterial
              color="#dde7f5"
              emissive="#9cb9df"
              emissiveIntensity={0.1}
              transparent
              opacity={0.24}
              roughness={1}
              metalness={0}
              flatShading
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function HorizonRig({ progress, activeSection, reducedMotion }: HorizonRigProps) {
  const current = useRef({ value: 0 });
  const cameraTarget = useRef(new Vector3(0, -0.4, 6));
  const fogRef = useRef(new THREE.Fog(0x0a0a1a, 20, 200));
  const moonlightRef = useRef<THREE.DirectionalLight>(null);
  const futureLightRef = useRef<THREE.PointLight>(null);
  const headlightRef = useRef<THREE.PointLight>(null);
  const backgroundColor = useRef(new THREE.Color("#050816"));

  useEffect(() => {
    anime.remove(current.current);
    anime({
      targets: current.current,
      value: progress,
      duration: reducedMotion ? 220 : 1200,
      easing: "easeInOutSine",
    });
  }, [progress, reducedMotion]);

  useFrame((state, delta) => {
    const t = current.current.value;
    const sunrise = MathUtils.clamp((t - 0.58) / 0.42, 0, 1);
    const eased = 1 - Math.pow(1 - sunrise, 3);
    const z = MathUtils.lerp(6, -168, t);
    const x = roadX(z);
    const aheadZ = z - 18;
    const aheadX = roadX(aheadZ);
    const sway = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.28) * 0.12;
    const lookLift = MathUtils.lerp(0.04, 1.8, eased);

    cameraTarget.current.set(x + 0.5 + sway, -0.42, z);
    state.camera.position.lerp(cameraTarget.current, 1 - Math.pow(0.00008, delta));
    state.camera.lookAt(aheadX + 0.2, -0.54 + Math.sin(t * Math.PI) * 0.08 + lookLift, aheadZ - 3);
    state.camera.rotation.z = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.22) * 0.008;

    if (moonlightRef.current) {
      moonlightRef.current.intensity = MathUtils.lerp(0.22, 0.12, t);
    }

    if (futureLightRef.current) {
      futureLightRef.current.intensity = MathUtils.lerp(0.24, 3.8, eased);
      futureLightRef.current.color.setStyle(eased < 0.55 ? "#f29e78" : "#ffd7ae");
    }

    if (headlightRef.current) {
      headlightRef.current.position.set(x, -0.1, z - 2);
      headlightRef.current.intensity = MathUtils.lerp(0.4, 0.75, 1 - t * 0.4);
    }

    fogRef.current.near = MathUtils.lerp(20, 24, t);
    fogRef.current.far = MathUtils.lerp(200, 132, t);
    fogRef.current.color.lerpColors(
      new THREE.Color("#20283d"),
      new THREE.Color("#765d68"),
      eased * 0.9,
    );
    state.scene.fog = fogRef.current;

    backgroundColor.current.lerpColors(
      new THREE.Color("#0a0f2c"),
      new THREE.Color("#d58973"),
      eased * 0.42,
    );
    state.scene.background = backgroundColor.current;
  });

  return (
    <>
      <mesh position={[0, 38, -188]}>
        <planeGeometry args={[320, 128]} />
        <meshBasicMaterial color="#081024" />
      </mesh>
      <mesh position={[0, 16, -196]}>
        <planeGeometry args={[300, 52]} />
        <meshBasicMaterial color="#1b1d3a" transparent opacity={0.94} />
      </mesh>
      <mesh position={[0, 1.6, -182]}>
        <planeGeometry args={[280, 20]} />
        <meshBasicMaterial color="#d27f68" transparent opacity={0.12} />
      </mesh>
      <ambientLight intensity={0.34} color="#b9c9ea" />
      <directionalLight
        ref={moonlightRef}
        position={[6, 10, 8]}
        intensity={0.26}
        color="#b3cfff"
      />
      <pointLight
        ref={futureLightRef}
        position={[6.2, 1.8, -183]}
        intensity={1.1}
        distance={90}
        color="#ffb88c"
      />
      <pointLight
        ref={headlightRef}
        position={[0, -0.1, 4]}
        intensity={0.28}
        distance={18}
        color="#edf2fb"
      />

      <StarField />

      <Landscape />
      <Road />
      <RoadsideBeacons progressRef={current} />
      <FeatureSigns progressRef={current} activeSection={activeSection} />
      <GuidanceBands progressRef={current} />
      <Sun progressRef={current} />
      {!reducedMotion && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.28} luminanceThreshold={0.32} mipmapBlur />
        </EffectComposer>
      )}
    </>
  );
}

export function CareerJourneyScene({ progress, activeSection }: SceneProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, -0.4, 6], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      shadows={false}
    >
      <HorizonRig
        progress={progress}
        activeSection={activeSection}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
