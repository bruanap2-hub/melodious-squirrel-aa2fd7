import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowLeft, Sparkles } from "lucide-react";
import { magicAudio } from "../lib/audio";

const PUZZLE = ["flame", "moon", "book", "key"];

const CLUES = {
  flame: "Primeiro nasceu a luz.",
  moon: "Depois, a noite guardou o caminho.",
  book: "Então, a história foi escrita.",
  key: "Por fim, aquilo que estava fechado pôde ser aberto.",
};

function createCanvasTexture(draw, width = 512, height = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  draw(ctx, width, height);

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;

  return texture;
}

function woodTexture() {
  return createCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = "#241914";
    ctx.fillRect(0, 0, w, h);

    for (let y = 0; y < h; y += 28) {
      ctx.fillStyle = y % 56 === 0 ? "#35251d" : "#2b1e18";
      ctx.fillRect(0, y, w, 26);

      for (let x = 0; x < w; x += 90) {
        ctx.strokeStyle = "rgba(10,6,4,.28)";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x, y + 7);

        ctx.bezierCurveTo(
          x + 30,
          y - 4,
          x + 60,
          y + 18,
          x + 90,
          y + 5,
        );

        ctx.stroke();
      }
    }
  });
}

function stoneTexture() {
  return createCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = "#252628";
    ctx.fillRect(0, 0, w, h);

    for (let y = 0; y < h; y += 70) {
      for (let x = 0; x < w; x += 120) {
        const ox = ((x / 120 + y / 70) % 2) * 20;

        ctx.fillStyle = `rgb(${35 + Math.random() * 15}, ${
          35 + Math.random() * 15
        }, ${36 + Math.random() * 15})`;

        ctx.fillRect(x + ox, y, 112, 62);

        ctx.strokeStyle = "rgba(0,0,0,.45)";
        ctx.lineWidth = 3;
        ctx.strokeRect(x + ox, y, 112, 62);
      }
    }
  });
}

function fabricTexture() {
  return createCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = "#382a25";
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 2500; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const a = 0.025 + Math.random() * 0.05;

      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(x, y, 1, 1);
    }
  });
}

function makeBox(
  scene,
  {
    x,
    y,
    z,
    width,
    height,
    depth,
    material,
    name,
    castShadow = true,
    receiveShadow = true,
  },
) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material,
  );

  mesh.position.set(x, y, z);
  mesh.name = name || "";
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;

  scene.add(mesh);

  return mesh;
}

function createMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.72,
    metalness: options.metalness ?? 0,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    map: options.map || null,
  });
}

function createBook(
  scene,
  x,
  y,
  z,
  color,
  rotation = 0,
) {
  const material = createMaterial(color, {
    roughness: 0.82,
  });

  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.07, 0.55),
    material,
  );

  book.position.set(x, y, z);
  book.rotation.y = rotation;
  book.castShadow = true;
  book.receiveShadow = true;

  scene.add(book);

  return book;
}

function createCylinder(
  scene,
  x,
  y,
  z,
  radius,
  height,
  color,
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(
      radius,
      radius,
      height,
      16,
    ),
    createMaterial(color, {
      roughness: 0.7,
    }),
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);

  return mesh;
}

function createFrame(
  scene,
  x,
  y,
  z,
  width,
  height,
  rotationY = 0,
) {
  const group = new THREE.Group();

  group.position.set(x, y, z);
  group.rotation.y = rotationY;

  const frameMaterial = createMaterial(0x493329, {
    roughness: 0.58,
  });

  const pictureMaterial = createMaterial(0x111316, {
    roughness: 0.9,
  });

  const inner = new THREE.Mesh(
    new THREE.PlaneGeometry(
      width - 0.16,
      height - 0.16,
    ),
    pictureMaterial,
  );

  inner.position.z = 0.025;

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.09, 0.1),
    frameMaterial,
  );

  top.position.y = height / 2;

  const bottom = top.clone();

  bottom.position.y = -height / 2;

  const left = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, height, 0.1),
    frameMaterial,
  );

  left.position.x = -width / 2;

  const right = left.clone();

  right.position.x = width / 2;

  group.add(
    inner,
    top,
    bottom,
    left,
    right,
  );

  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(group);

  return group;
}

function createFlame(scene) {
  const group = new THREE.Group();

  group.position.set(-3.2, 1.12, -6.9);

  const glow = new THREE.PointLight(
    0xff9b35,
    3.5,
    7,
    2,
  );

  glow.position.set(0, 0.8, 0);

  group.add(glow);

  const flameMaterial = new THREE.MeshBasicMaterial({
    color: 0xffa52f,
    transparent: true,
    opacity: 0.86,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  for (let i = 0; i < 7; i++) {
    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(
        0.12 + Math.random() * 0.1,
        0.55 + Math.random() * 0.45,
        7,
      ),
      flameMaterial.clone(),
    );

    flame.position.set(
      (Math.random() - 0.5) * 0.65,
      0.25 + Math.random() * 0.5,
      (Math.random() - 0.5) * 0.28,
    );

    flame.rotation.z =
      (Math.random() - 0.5) * 0.45;

    group.add(flame);
  }

  const innerMaterial = new THREE.MeshBasicMaterial({
    color: 0xffe8a0,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  const inner = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.6, 7),
    innerMaterial,
  );

  inner.position.y = 0.3;

  group.add(inner);

  group.userData.interactiveId = "flame";

  scene.add(group);

  return group;
}
function createMoon(scene) {
  const group = new THREE.Group();

  group.position.set(3.55, 4.25, -7.08);

  const moonMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8e1c7,
    emissive: 0xaaa47c,
    emissiveIntensity: 0.7,
    roughness: 0.9,
    metalness: 0,
  });

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.52, 32, 32),
    moonMaterial,
  );

  moon.scale.set(1, 1, 0.32);

  group.add(moon);

  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0xf5e9bd,
    transparent: true,
    opacity: 0.13,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const halo = new THREE.Mesh(
    new THREE.CircleGeometry(0.9, 32),
    haloMaterial,
  );

  halo.position.z = -0.08;

  group.add(halo);

  const moonLight = new THREE.PointLight(
    0xded7bd,
    1.8,
    6,
    2,
  );

  moonLight.position.set(0, 0, 0.2);

  group.add(moonLight);

  group.userData.interactiveId = "moon";

  scene.add(group);

  return group;
}

function createInteractiveBook(scene) {
  const group = new THREE.Group();

  group.position.set(0.72, 1.48, -1.05);
  group.rotation.y = -0.22;

  const coverMaterial = createMaterial(0x51372d, {
    roughness: 0.78,
  });

  const pageMaterial = createMaterial(0xd9cba7, {
    roughness: 0.92,
  });

  const coverBottom = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.06, 0.78),
    coverMaterial,
  );

  coverBottom.position.y = 0;

  const pages = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.085, 0.7),
    pageMaterial,
  );

  pages.position.y = 0.045;

  const coverTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.045, 0.78),
    coverMaterial,
  );

  coverTop.position.set(
    0,
    0.105,
    0,
  );

  group.add(
    coverBottom,
    pages,
    coverTop,
  );

  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.15, 0.8),
    coverMaterial,
  );

  spine.position.x = -0.275;

  group.add(spine);

  const claspMaterial = createMaterial(0xb18a4b, {
    roughness: 0.42,
    metalness: 0.65,
  });

  const clasp = new THREE.Mesh(
    new THREE.BoxGeometry(0.075, 0.055, 0.08),
    claspMaterial,
  );

  clasp.position.set(
    0.235,
    0.14,
    0,
  );

  group.add(clasp);

  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  group.userData.interactiveId = "book";

  scene.add(group);

  return group;
}

function createInteractiveKey(scene) {
  const group = new THREE.Group();

  group.position.set(
    -1.18,
    1.52,
    -1.18,
  );

  const metalMaterial = createMaterial(0xc3a35b, {
    roughness: 0.35,
    metalness: 0.8,
  });

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(
      0.13,
      0.035,
      12,
      24,
    ),
    metalMaterial,
  );

  ring.rotation.x = Math.PI / 2;

  group.add(ring);

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.025,
      0.025,
      0.48,
      12,
    ),
    metalMaterial,
  );

  shaft.rotation.z = Math.PI / 2;

  shaft.position.x = 0.25;

  group.add(shaft);

  const tooth1 = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.075,
      0.055,
      0.045,
    ),
    metalMaterial,
  );

  tooth1.position.set(
    0.38,
    -0.02,
    0,
  );

  group.add(tooth1);

  const tooth2 = tooth1.clone();

  tooth2.position.set(
    0.32,
    0.055,
    0,
  );

  group.add(tooth2);

  group.rotation.z = -0.25;

  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  group.userData.interactiveId = "key";

  scene.add(group);

  return group;
}

function createSecretDoor(scene) {
  const group = new THREE.Group();

  group.position.set(
    0,
    0,
    -7.03,
  );

  const frameMaterial = createMaterial(
    0x171313,
    {
      roughness: 0.62,
    },
  );

  const doorMaterial = createMaterial(
    0x30211d,
    {
      roughness: 0.75,
    },
  );

  const frameLeft = makeBox(scene, {
    x: -2.05,
    y: 2.25,
    z: -7.02,
    width: 0.25,
    height: 4.5,
    depth: 0.3,
    material: frameMaterial,
    name: "secret-door-frame-left",
  });

  const frameRight = makeBox(scene, {
    x: 2.05,
    y: 2.25,
    z: -7.02,
    width: 0.25,
    height: 4.5,
    depth: 0.3,
    material: frameMaterial,
    name: "secret-door-frame-right",
  });

  const frameTop = makeBox(scene, {
    x: 0,
    y: 4.38,
    z: -7.02,
    width: 4.35,
    height: 0.25,
    depth: 0.3,
    material: frameMaterial,
    name: "secret-door-frame-top",
  });

  const door = new THREE.Group();

  door.position.set(
    -1.85,
    0,
    0,
  );

  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(
      3.7,
      4.05,
      0.22,
    ),
    doorMaterial,
  );

  panel.position.set(
    1.85,
    2.05,
    0,
  );

  panel.castShadow = true;
  panel.receiveShadow = true;

  door.add(panel);

  const insetMaterial = createMaterial(
    0x1d1512,
    {
      roughness: 0.8,
    },
  );

  const upperInset = new THREE.Mesh(
    new THREE.BoxGeometry(
      2.55,
      1.22,
      0.055,
    ),
    insetMaterial,
  );

  upperInset.position.set(
    1.85,
    3.05,
    0.14,
  );

  door.add(upperInset);

  const lowerInset = new THREE.Mesh(
    new THREE.BoxGeometry(
      2.55,
      1.4,
      0.055,
    ),
    insetMaterial,
  );

  lowerInset.position.set(
    1.85,
    1.35,
    0.14,
  );

  door.add(lowerInset);

  const doorSymbolMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xb29455,
      emissive: 0x6e5325,
      emissiveIntensity: 0.15,
      roughness: 0.4,
      metalness: 0.65,
    });

  const symbol = new THREE.Mesh(
    new THREE.TorusGeometry(
      0.42,
      0.035,
      10,
      32,
    ),
    doorSymbolMaterial,
  );

  symbol.position.set(
    1.85,
    2.2,
    0.2,
  );

  symbol.rotation.x = Math.PI / 2;

  door.add(symbol);

  const vertical = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.045,
      0.75,
      0.045,
    ),
    doorSymbolMaterial,
  );

  vertical.position.set(
    1.85,
    2.2,
    0.22,
  );

  door.add(vertical);

  const horizontal = new THREE.Mesh(
    new THREE.BoxGeometry(
      0.75,
      0.045,
      0.045,
    ),
    doorSymbolMaterial,
  );

  horizontal.position.set(
    1.85,
    2.2,
    0.22,
  );

  door.add(horizontal);

  const handle = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.09,
      16,
      16,
    ),
    createMaterial(0xb18a4b, {
      roughness: 0.35,
      metalness: 0.75,
    }),
  );

  handle.position.set(
    3.15,
    2.05,
    0.2,
  );

  door.add(handle);

  group.add(door);

  group.userData.door = door;
  group.userData.opening = false;

  scene.add(group);

  return group;
}

function createMemoryChamber(scene) {
  const chamber = new THREE.Group();

  chamber.position.set(
    0,
    0,
    -11.2,
  );

  const chamberMaterial = createMaterial(
    0x18171b,
    {
      roughness: 0.85,
    },
  );

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(
      3.7,
      32,
    ),
    chamberMaterial,
  );

  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.03;

  chamber.add(floor);

  const pedestalMaterial =
    createMaterial(0x3c3028, {
      roughness: 0.65,
    });

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(
      0.75,
      0.9,
      0.8,
      24,
    ),
    pedestalMaterial,
  );

  pedestal.position.y = 0.4;

  chamber.add(pedestal);

  const memoryMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xb7a3ff,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

  const memory = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.62,
      24,
      24,
    ),
    memoryMaterial,
  );

  memory.position.y = 1.35;

  memory.scale.set(
    1,
    1.25,
    1,
  );

  chamber.add(memory);

  const memoryLight = new THREE.PointLight(
    0xb7a3ff,
    2.8,
    7,
    2,
  );

  memoryLight.position.set(
    0,
    1.35,
    0,
  );

  chamber.add(memoryLight);

  const ringMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x8d78cf,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    });

  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(
        0.9 + i * 0.3,
        0.018,
        8,
        64,
      ),
      ringMaterial,
    );

    ring.rotation.x =
      Math.PI / 2 +
      i * 0.18;

    ring.position.y =
      0.65 +
      i * 0.35;

    chamber.add(ring);
  }

  scene.add(chamber);

  return chamber;
}

function createParticles(scene) {
  const count = 420;

  const positions = new Float32Array(
    count * 3,
  );

  for (let i = 0; i < count; i++) {
    positions[i * 3] =
      (Math.random() - 0.5) * 11;

    positions[i * 3 + 1] =
      Math.random() * 5.8 + 0.2;

    positions[i * 3 + 2] =
      -8 +
      Math.random() * 11;
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3,
    ),
  );

  const material =
    new THREE.PointsMaterial({
      color: 0xd4bd86,
      size: 0.025,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
      blending:
        THREE.AdditiveBlending,
    });

  const particles = new THREE.Points(
    geometry,
    material,
  );

  particles.name = "ambient-particles";

  scene.add(particles);

  return particles;
}

function buildRoom(scene) {
  const woodMap = woodTexture();
  const stoneMap = stoneTexture();
  const fabricMap = fabricTexture();

  woodMap.repeat.set(2.5, 2.5);
  stoneMap.repeat.set(3, 2);
  fabricMap.repeat.set(3, 3);

  const floorMaterial = createMaterial(
    0x211814,
    {
      roughness: 0.82,
      map: woodMap,
    },
  );

  const wallMaterial = createMaterial(
    0x29292b,
    {
      roughness: 0.92,
      map: stoneMap,
    },
  );

  const ceilingMaterial = createMaterial(
    0x171516,
    {
      roughness: 0.9,
    },
  );

  const woodMaterial = createMaterial(
    0x2f2019,
    {
      roughness: 0.76,
      map: woodMap,
    },
  );

  const darkWoodMaterial =
    createMaterial(0x1d1410, {
      roughness: 0.82,
    });

  const fabricMaterial = createMaterial(
    0x342925,
    {
      roughness: 0.96,
      map: fabricMap,
    },
  );

  const goldMaterial = createMaterial(
    0xa17a3f,
    {
      roughness: 0.45,
      metalness: 0.55,
    },
  );

  makeBox(scene, {
    x: 0,
    y: -0.18,
    z: -1.5,
    width: 12,
    height: 0.35,
    depth: 11,
    material: floorMaterial,
    name: "floor",
  });

  makeBox(scene, {
    x: 0,
    y: 3,
    z: -7,
    width: 12,
    height: 6,
    depth: 0.35,
    material: wallMaterial,
    name: "back-wall",
  });

  makeBox(scene, {
    x: -6,
    y: 3,
    z: -1.5,
    width: 0.35,
    height: 6,
    depth: 11,
    material: wallMaterial,
    name: "left-wall",
  });

  makeBox(scene, {
    x: 6,
    y: 3,
    z: -1.5,
    width: 0.35,
    height: 6,
    depth: 11,
    material: wallMaterial,
    name: "right-wall",
  });

  makeBox(scene, {
    x: 0,
    y: 6,
    z: -1.5,
    width: 12,
    height: 0.35,
    depth: 11,
    material: ceilingMaterial,
    name: "ceiling",
  });

  for (let x = -5; x <= 5; x += 2.5) {
    makeBox(scene, {
      x,
      y: 5.65,
      z: -1.5,
      width: 0.22,
      height: 0.35,
      depth: 11,
      material: darkWoodMaterial,
      name: "ceiling-beam",
    });
  }

  for (let z = -6; z <= 3; z += 2.5) {
    makeBox(scene, {
      x: 0,
      y: 5.72,
      z,
      width: 12,
      height: 0.22,
      depth: 0.22,
      material: darkWoodMaterial,
      name: "cross-beam",
    });
  }

  // Lareira de pedra
  makeBox(scene, {
    x: -3.2,
    y: 1.65,
    z: -6.82,
    width: 3.15,
    height: 3.3,
    depth: 0.62,
    material: wallMaterial,
    name: "fireplace",
  });

  makeBox(scene, {
    x: -3.2,
    y: 3.35,
    z: -6.48,
    width: 3.65,
    height: 0.32,
    depth: 0.85,
    material: darkWoodMaterial,
    name: "fireplace-mantel",
  });

  makeBox(scene, {
    x: -3.2,
    y: 0.12,
    z: -6.48,
    width: 2.8,
    height: 0.22,
    depth: 0.95,
    material: darkWoodMaterial,
    name: "fireplace-hearth",
  });

  // Nicho escuro da fogueira
  makeBox(scene, {
    x: -3.2,
    y: 1.12,
    z: -6.42,
    width: 2.25,
    height: 1.65,
    depth: 0.25,
    material: createMaterial(0x090807, {
      roughness: 1,
    }),
    name: "fireplace-opening",
  });

  createFlame(scene);

  // Estante esquerda
  makeBox(scene, {
    x: -5.05,
    y: 2.6,
    z: -4.65,
    width: 1.25,
    height: 5.0,
    depth: 0.65,
    material: darkWoodMaterial,
    name: "bookshelf-left",
  });

  for (let y = 0.75; y <= 4.4; y += 0.9) {
    makeBox(scene, {
      x: -5.05,
      y,
      z: -4.28,
      width: 1.35,
      height: 0.12,
      depth: 0.82,
      material: woodMaterial,
      name: "bookshelf-shelf",
    });

    for (let i = 0; i < 6; i++) {
      const colors = [
        0x4b2d2d,
        0x304039,
        0x493a25,
        0x382d45,
        0x5b4730,
      ];

      const book = new THREE.Mesh(
        new THREE.BoxGeometry(
          0.13 +
            Math.random() * 0.08,
          0.55 +
            Math.random() * 0.18,
          0.38,
        ),
        createMaterial(
          colors[
            Math.floor(
              Math.random() *
                colors.length,
            )
          ],
          {
            roughness: 0.86,
          },
        ),
      );

      book.position.set(
        -5.48 +
          i * 0.18,
        y + 0.37,
        -4.26,
      );

      book.rotation.z =
        (Math.random() - 0.5) *
        0.08;

      book.castShadow = true;
      book.receiveShadow = true;

      scene.add(book);
    }
  }

  // Estante direita
  makeBox(scene, {
    x: 5.05,
    y: 2.6,
    z: -4.65,
    width: 1.25,
    height: 5.0,
    depth: 0.65,
    material: darkWoodMaterial,
    name: "bookshelf-right",
  });

  for (let y = 0.75; y <= 4.4; y += 0.9) {
    makeBox(scene, {
      x: 5.05,
      y,
      z: -4.28,
      width: 1.35,
      height: 0.12,
      depth: 0.82,
      material: woodMaterial,
      name: "bookshelf-shelf-right",
    });

    for (let i = 0; i < 6; i++) {
      const colors = [
        0x513335,
        0x2d3c37,
        0x4b3b24,
        0x40334e,
        0x59452f,
      ];

      const book = new THREE.Mesh(
        new THREE.BoxGeometry(
          0.13 +
            Math.random() * 0.08,
          0.55 +
            Math.random() * 0.18,
          0.38,
        ),
        createMaterial(
          colors[
            Math.floor(
              Math.random() *
                colors.length,
            )
          ],
          {
            roughness: 0.86,
          },
        ),
      );

      book.position.set(
        4.48 +
          i * 0.18,
        y + 0.37,
        -4.26,
      );

      book.rotation.z =
        (Math.random() - 0.5) *
        0.08;

      book.castShadow = true;
      book.receiveShadow = true;

      scene.add(book);
    }
  }

  // Sofá
  makeBox(scene, {
    x: 1.95,
    y: 0.7,
    z: -3.35,
    width: 3.2,
    height: 0.7,
    depth: 1.25,
    material: fabricMaterial,
    name: "sofa-seat",
  });

  makeBox(scene, {
    x: 1.95,
    y: 1.5,
    z: -3.85,
    width: 3.2,
    height: 1.5,
    depth: 0.35,
    material: fabricMaterial,
    name: "sofa-back",
  });

  makeBox(scene, {
    x: 0.48,
    y: 1.15,
    z: -3.35,
    width: 0.35,
    height: 1.35,
    depth: 1.25,
    material: fabricMaterial,
    name: "sofa-arm-left",
  });

  makeBox(scene, {
    x: 3.42,
    y: 1.15,
    z: -3.35,
    width: 0.35,
    height: 1.35,
    depth: 1.25,
    material: fabricMaterial,
    name: "sofa-arm-right",
  });

  // Almofadas
  for (let i = 0; i < 3; i++) {
    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.65,
        0.22,
        0.65,
      ),
      createMaterial(
        [
          0x45302b,
          0x3c443e,
          0x51452e,
        ][i],
        {
          roughness: 0.95,
        },
      ),
    );

    pillow.position.set(
      1.05 + i * 0.9,
      1.05,
      -3.48,
    );

    pillow.rotation.y =
      (i - 1) * 0.16;

    pillow.castShadow = true;
    pillow.receiveShadow = true;

    scene.add(pillow);
  }

  // Mesa central
  createCylinder(
    scene,
    0.35,
    0.7,
    -1.0,
    1.15,
    0.16,
    0x3b281d,
  );

  createCylinder(
    scene,
    0.35,
    0.28,
    -1.0,
    0.12,
    0.72,
    0x2b1b14,
  );

  // Base da mesa
  createCylinder(
    scene,
    0.35,
    0.08,
    -1.0,
    0.55,
    0.12,
    0x241711,
  );

  createInteractiveBook(scene);
  createInteractiveKey(scene);

  // Velas
  for (let i = 0; i < 4; i++) {
    const candleX =
      -1.1 + i * 0.8;

    createCylinder(
      scene,
      candleX,
      1.02,
      -1.0,
      0.065,
      0.55,
      0xd5c6a4,
    );

    const candleFlame =
      new THREE.Mesh(
        new THREE.ConeGeometry(
          0.06,
          0.22,
          7,
        ),
        new THREE.MeshBasicMaterial({
          color: 0xffc45c,
          transparent: true,
          opacity: 0.88,
          blending:
            THREE.AdditiveBlending,
        }),
      );

    candleFlame.position.set(
      candleX,
      1.4,
      -1.0,
    );

    scene.add(candleFlame);

    const candleLight =
      new THREE.PointLight(
        0xffb45a,
        0.65,
        2.5,
        2,
      );

    candleLight.position.set(
      candleX,
      1.45,
      -1.0,
    );

    scene.add(candleLight);
  }

  // Quadros
  createFrame(
    scene,
    -4.15,
    3.75,
    -6.73,
    1.35,
    1.75,
  );

  createFrame(
    scene,
    4.05,
    3.65,
    -6.73,
    1.6,
    1.25,
  );

  createFrame(
    scene,
    4.35,
    2.25,
    -6.73,
    1.05,
    1.4,
  );

  // Janela
  const windowFrameMaterial =
    createMaterial(0x171311, {
      roughness: 0.65,
    });

  makeBox(scene, {
    x: 3.55,
    y: 3.15,
    z: -6.78,
    width: 2.25,
    height: 2.5,
    depth: 0.3,
    material: windowFrameMaterial,
    name: "window-frame",
  });

  const nightMaterial =
    createMaterial(0x101727, {
      roughness: 0.98,
      emissive: 0x10172a,
      emissiveIntensity: 0.22,
    });

  makeBox(scene, {
    x: 3.55,
    y: 3.15,
    z: -6.58,
    width: 1.72,
    height: 1.95,
    depth: 0.08,
    material: nightMaterial,
    name: "window-night",
  });

  makeBox(scene, {
    x: 3.55,
    y: 3.15,
    z: -6.35,
    width: 0.1,
    height: 2.0,
    depth: 0.12,
    material: windowFrameMaterial,
    name: "window-divider",
  });

  makeBox(scene, {
    x: 3.55,
    y: 3.15,
    z: -6.35,
    width: 1.75,
    height: 0.1,
    depth: 0.12,
    material: windowFrameMaterial,
    name: "window-divider-horizontal",
  });

  createMoon(scene);

  // Porta secreta
  const door = createSecretDoor(scene);

  // Câmara além da porta
  createMemoryChamber(scene);

  // Tapete
  const rugMaterial =
    createMaterial(0x2e2220, {
      roughness: 1,
    });

  const rug = new THREE.Mesh(
    new THREE.BoxGeometry(
      4.8,
      0.045,
      2.9,
    ),
    rugMaterial,
  );

  rug.position.set(
    0.2,
    0.025,
    -1.15,
  );

  rug.receiveShadow = true;

  scene.add(rug);

// Pequenos detalhes decorativos
  for (let i = 0; i < 7; i++) {
    const vase = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.1,
        0.14,
        0.32,
        12,
      ),
      goldMaterial,
    );

    vase.position.set(
      -4.85 +
        (i % 2) * 0.25,
      4.7 -
        Math.floor(i / 2) * 0.75,
      -4.2,
    );

    vase.castShadow = true;

    scene.add(vase);
  }

  const particles =
    createParticles(scene);

  return {
    flame: scene.children.find(
      (object) =>
        object.userData?.interactiveId ===
        "flame",
    ),

    moon: scene.children.find(
      (object) =>
        object.userData?.interactiveId ===
        "moon",
    ),

    book: scene.children.find(
      (object) =>
        object.userData?.interactiveId ===
        "book",
    ),

    key: scene.children.find(
      (object) =>
        object.userData?.interactiveId ===
        "key",
    ),

    door,

    particles,
  };
}
export default function CommonRoom({
  onBack,
  onEnterMemories,
}) {
  const mountRef = useRef(null);

  const [notice, setNotice] = useState(
    "Algo nesta sala parece estar esperando por você.",
  );

  const [step, setStep] = useState(0);
  const [solved, setSolved] = useState(false);
  const [entered, setEntered] = useState(false);

  const puzzleRef = useRef([]);
  const solvedRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) {
      return undefined;
    }

    const container = mountRef.current;

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(
      0x09090d,
    );

    scene.fog = new THREE.FogExp2(
      0x09090d,
      0.045,
    );

    const camera = new THREE.PerspectiveCamera(
      58,
      container.clientWidth /
        Math.max(container.clientHeight, 1),
      0.05,
      100,
    );

    camera.position.set(
      0.4,
      2.05,
      2.9,
    );

    camera.lookAt(
      0,
      1.8,
      -4.5,
    );

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        1.8,
      ),
    );

    renderer.setSize(
      container.clientWidth,
      container.clientHeight,
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.05;

    container.appendChild(
      renderer.domElement,
    );

    const ambientLight =
      new THREE.AmbientLight(
        0x77727c,
        0.42,
      );

    scene.add(ambientLight);

    const moonLight =
      new THREE.DirectionalLight(
        0xb7c1e8,
        0.7,
      );

    moonLight.position.set(
      4,
      6,
      -5,
    );

    moonLight.castShadow = true;

    moonLight.shadow.mapSize.set(
      1024,
      1024,
    );

    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 30;

    moonLight.shadow.camera.left = -10;
    moonLight.shadow.camera.right = 10;
    moonLight.shadow.camera.top = 10;
    moonLight.shadow.camera.bottom = -10;

    scene.add(moonLight);

    const room = buildRoom(scene);

    const raycaster =
      new THREE.Raycaster();

    const pointer =
      new THREE.Vector2();

    let dragging = false;
    let pointerDownX = 0;
    let pointerDownY = 0;

    let yaw = 0;
    let pitch = -0.04;

    let lastPointerX = 0;
    let lastPointerY = 0;

    let animationFrame = 0;

    let disposed = false;

    const clamp = (
      value,
      min,
      max,
    ) =>
      Math.max(
        min,
        Math.min(max, value),
      );

    const getPointer = (
      event,
    ) => {
      const rect =
        renderer.domElement.getBoundingClientRect();

      pointer.x =
        ((event.clientX - rect.left) /
          rect.width) *
          2 -
        1;

      pointer.y =
        -(
          (event.clientY - rect.top) /
          rect.height
        ) *
          2 +
        1;
    };

    const findInteractiveObject = (
      object,
    ) => {
      let current = object;

      while (
        current &&
        current !== scene
      ) {
        if (
          current.userData?.interactiveId
        ) {
          return current;
        }

        current = current.parent;
      }

      return null;
    };

    const investigate = (
      interactiveObject,
    ) => {
      if (!interactiveObject) {
        return;
      }

      const id =
        interactiveObject.userData
          ?.interactiveId;

      if (!id || solvedRef.current) {
        return;
      }

      const expected =
        PUZZLE[
          puzzleRef.current.length
        ];

      if (id === expected) {
        puzzleRef.current.push(id);

        setStep(
          puzzleRef.current.length,
        );

        setNotice(
          CLUES[id],
        );

        try {
          magicAudio?.chime?.();
        } catch {
          // Áudio é opcional.
        }

        if (
          puzzleRef.current.length ===
          PUZZLE.length
        ) {
          solvedRef.current = true;

          setSolved(true);

          setNotice(
            "A sala reconheceu o caminho. A porta começou a despertar.",
          );

          try {
            magicAudio?.chime?.();
          } catch {
            // Áudio é opcional.
          }
        }

        return;
      }

      if (
        puzzleRef.current.includes(id)
      ) {
        setNotice(
          "Esse vestígio já foi despertado.",
        );

        return;
      }

      puzzleRef.current = [];

      setStep(0);

      setNotice(
        "A sequência se perdeu. A sala pede que você comece novamente.",
      );
    };

    const handlePointerDown = (
      event,
    ) => {
      dragging = true;

      pointerDownX =
        event.clientX;

      pointerDownY =
        event.clientY;

      lastPointerX =
        event.clientX;

      lastPointerY =
        event.clientY;

      renderer.domElement.setPointerCapture?.(
        event.pointerId,
      );
    };

    const handlePointerMove = (
      event,
    ) => {
      if (!dragging) {
        return;
      }

      const dx =
        event.clientX -
        lastPointerX;

      const dy =
        event.clientY -
        lastPointerY;

      lastPointerX =
        event.clientX;

      lastPointerY =
        event.clientY;

      yaw -= dx * 0.0045;

      pitch -= dy * 0.0038;

      pitch = clamp(
        pitch,
        -0.75,
        0.45,
      );
    };

    const handlePointerUp = (
      event,
    ) => {
      if (!dragging) {
        return;
      }

      dragging = false;

      renderer.domElement.releasePointerCapture?.(
        event.pointerId,
      );

      const distance =
        Math.hypot(
          event.clientX -
            pointerDownX,
          event.clientY -
            pointerDownY,
        );

      if (distance > 12) {
        return;
      }

      getPointer(event);

      raycaster.setFromCamera(
        pointer,
        camera,
      );

      const intersections =
        raycaster.intersectObjects(
          scene.children,
          true,
        );

      if (!intersections.length) {
        return;
      }

      const target =
        findInteractiveObject(
          intersections[0].object,
        );

      investigate(target);
    };

    const handleResize = () => {
      if (!container) {
        return;
      }

      const width =
        Math.max(
          container.clientWidth,
          1,
        );

      const height =
        Math.max(
          container.clientHeight,
          1,
        );

      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height,
      );

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio || 1,
          1.8,
        ),
      );
    };

    renderer.domElement.style.touchAction =
      "none";

    renderer.domElement.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    renderer.domElement.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    renderer.domElement.addEventListener(
      "pointerup",
      handlePointerUp,
    );

    renderer.domElement.addEventListener(
      "pointercancel",
      handlePointerUp,
    );

    window.addEventListener(
      "resize",
      handleResize,
    );

    const animate = () => {
      if (disposed) {
        return;
      }

      animationFrame =
        requestAnimationFrame(
          animate,
        );

      const elapsed =
        performance.now() * 0.001;

      const direction =
        new THREE.Vector3();

      direction.set(
        Math.sin(yaw) *
          Math.cos(pitch),
        Math.sin(pitch),
        -Math.cos(yaw) *
          Math.cos(pitch),
      );

      const lookTarget =
        camera.position
          .clone()
          .add(direction);

      camera.lookAt(
        lookTarget,
      );

      // Fogo
      if (room.flame) {
        const flame =
          room.flame;

        const pulse =
          1 +
          Math.sin(
            elapsed * 8,
          ) *
            0.055;

        flame.scale.set(
          pulse,
          0.95 +
            Math.sin(
              elapsed * 9,
            ) *
              0.08,
          pulse,
        );

        const light =
          flame.children.find(
            (child) =>
              child.isPointLight,
          );

        if (light) {
          light.intensity =
            3.2 +
            Math.sin(
              elapsed * 11,
            ) *
              0.45;
        }
      }

      // Lua
      if (room.moon) {
        room.moon.rotation.z =
          Math.sin(
            elapsed * 0.18,
          ) *
          0.02;
      }

      // Partículas
      if (room.particles) {
        room.particles.rotation.y =
          elapsed * 0.008;

        room.particles.position.y =
          Math.sin(
            elapsed * 0.35,
          ) *
          0.04;
      }

      // Porta secreta
      if (
        solvedRef.current &&
        room.door?.userData?.door
      ) {
        const door =
          room.door.userData.door;

        if (
          door.rotation.y >
          -1.15
        ) {
          door.rotation.y =
            Math.max(
              -1.15,
              door.rotation.y -
                0.006,
            );
        }

        if (
          door.rotation.y <
            -0.55 &&
          !entered
        ) {
          setEntered(true);
        }
      }

      // Câmara das memórias
      const memory =
        scene.getObjectByProperty(
          "type",
          "Mesh",
        );

      if (memory) {
        // Pequena variação atmosférica
        // sem alterar a estrutura da cena.
      }

      renderer.render(
        scene,
        camera,
      );
    };

    animate();

    return () => {
      disposed = true;

      cancelAnimationFrame(
        animationFrame,
      );

      renderer.domElement.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );

      renderer.domElement.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      renderer.domElement.removeEventListener(
        "pointerup",
        handlePointerUp,
      );

      renderer.domElement.removeEventListener(
        "pointercancel",
        handlePointerUp,
      );

      window.removeEventListener(
        "resize",
        handleResize,
      );

      scene.traverse(
        (object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }

          if (
            object.material
          ) {
            const materials =
              Array.isArray(
                object.material,
              )
                ? object.material
                : [object.material];

            materials.forEach(
              (material) => {
                if (material.map) {
                  material.map.dispose();
                }

                material.dispose();
              },
            );
          }
        },
      );

      renderer.dispose();

      if (
        renderer.domElement.parentNode ===
        container
      ) {
        container.removeChild(
          renderer.domElement,
        );
      }
    };
  }, [entered]);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background:
          "#08080b",
      }}
    >
      <div
        ref={mountRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: "16px",
          padding:
            "18px 20px",
          pointerEvents:
            "none",
          background:
            "linear-gradient(to bottom, rgba(5,5,8,.78), rgba(5,5,8,0))",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            pointerEvents:
              "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            minHeight: "44px",
            padding:
              "10px 15px",
            border:
              "1px solid rgba(220,195,130,.3)",
            borderRadius:
              "10px",
            background:
              "rgba(12,10,12,.72)",
            color: "#eadfca",
            cursor: "pointer",
            backdropFilter:
              "blur(8px)",
          }}
        >
          <ArrowLeft
            size={17}
          />

          Voltar
        </button>

        <div
          style={{
            textAlign: "right",
            color: "#eadfca",
            textShadow:
              "0 2px 12px rgba(0,0,0,.8)",
          }}
        >
          <div
            style={{
              fontSize:
                "clamp(13px, 2vw, 18px)",
              letterSpacing:
                "0.18em",
              fontWeight: 700,
            }}
          >
            A SALA DOS QUE FICAM
          </div>

          <div
            style={{
              marginTop: "4px",
              fontSize:
                "clamp(10px, 1.5vw, 13px)",
              opacity: 0.68,
            }}
          >
            Algumas memórias não
            precisam ser procuradas.
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "24px",
          transform:
            "translateX(-50%)",
          width:
            "min(560px, calc(100% - 32px))",
          padding:
            "14px 16px",
          border:
            "1px solid rgba(220,195,130,.22)",
          borderRadius:
            "14px",
          background:
            "rgba(8,7,10,.74)",
          backdropFilter:
            "blur(10px)",
          color: "#eee4d0",
          textAlign: "center",
          boxShadow:
            "0 12px 40px rgba(0,0,0,.35)",
          pointerEvents:
            "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            gap: "8px",
            marginBottom:
              "10px",
          }}
        >
          {PUZZLE.map(
            (item, index) => (
              <span
                key={item}
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius:
                    "50%",
                  background:
                    index <
                    step
                      ? "#d5b66a"
                      : "rgba(235,220,185,.22)",
                  boxShadow:
                    index <
                    step
                      ? "0 0 12px rgba(213,182,106,.7)"
                      : "none",
                }}
              />
            ),
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            gap: "8px",
            marginBottom:
              "7px",
            fontSize:
              "13px",
            letterSpacing:
              "0.08em",
            textTransform:
              "uppercase",
            opacity: 0.65,
          }}
        >
          <Sparkles
            size={14}
          />

          Explore a sala
        </div>

        <div
          style={{
            fontSize:
              "clamp(13px, 2vw, 16px)",
            lineHeight: 1.5,
          }}
        >
          {notice}
        </div>

        <div
          style={{
            marginTop:
              "9px",
            fontSize:
              "11px",
            opacity: 0.42,
          }}
        >
          Arraste para olhar ao redor
          • Toque nos objetos para
          investigar
        </div>
      </div>

      {solved && (
        <div
          style={{
            position:
              "absolute",
            inset: 0,
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: "24px",
            background:
              "radial-gradient(circle, rgba(100,75,150,.16), rgba(0,0,0,.65))",
            pointerEvents:
              "none",
          }}
        >
          <div
            style={{
              width:
                "min(480px, 100%)",
              padding:
                "28px 24px",
              border:
                "1px solid rgba(214,188,119,.4)",
              borderRadius:
                "18px",
              background:
                "rgba(12,9,16,.88)",
              backdropFilter:
                "blur(14px)",
              color:
                "#f0e5d1",
              textAlign:
                "center",
              boxShadow:
                "0 24px 80px rgba(0,0,0,.55)",
            }}
          >
            <Sparkles
              size={28}
              style={{
                marginBottom:
                  "12px",
              }}
            />

            <div
              style={{
                fontSize:
                  "clamp(19px, 4vw, 28px)",
                letterSpacing:
                  "0.12em",
                fontWeight:
                  700,
                marginBottom:
                  "10px",
              }}
            >
              A CÂMARA DAS MEMÓRIAS
            </div>

            <p
              style={{
                margin: 0,
                lineHeight: 1.65,
                fontSize:
                  "14px",
                opacity: 0.8,
              }}
            >
              A sequência foi
              descoberta. A porta
              que estava escondida
              finalmente reconheceu
              você.
            </p>

            <div
              style={{
                marginTop:
                  "14px",
                fontSize:
                  "12px",
                opacity: 0.55,
              }}
            >
              A porta está se abrindo...
            </div>
          </div>
        </div>
      )}

      {entered &&
        onEnterMemories && (
          <button
            type="button"
            onClick={onEnterMemories}
            style={{
              position:
                "absolute",
              left: "50%",
              bottom: "105px",
              transform:
                "translateX(-50%)",
              minHeight: "46px",
              padding:
                "12px 20px",
              border:
                "1px solid rgba(222,194,126,.55)",
              borderRadius:
                "12px",
              background:
                "rgba(24,17,27,.88)",
              color:
                "#f2e5c9",
              cursor:
                "pointer",
              fontWeight:
                700,
              letterSpacing:
                "0.08em",
              boxShadow:
                "0 8px 30px rgba(0,0,0,.45)",
              zIndex: 5,
            }}
          >
            ENTRAR NAS MEMÓRIAS
          </button>
        )}
    </section>
  );
}
