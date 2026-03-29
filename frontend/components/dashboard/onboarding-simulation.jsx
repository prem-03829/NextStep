"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Coffee,
  MessageSquare,
  Send,
  Sparkles,
  Terminal,
  User,
  X,
  Zap,
} from "lucide-react";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

const initialTasks = [
  { id: "t1", text: "Onboarding: Sync with Sarah from HR", status: "todo" },
  { id: "t2", text: "Technical: Review sprint expectations with Mike", status: "todo" },
  { id: "t3", text: "Workspace: Locate your assigned workstation", status: "todo" },
  { id: "t4", text: "System: Confirm your security credentials", status: "todo" },
  { id: "t5", text: "Social: Introduce yourself to Alex from QA", status: "todo" },
  { id: "t6", text: "Comfort: Adjust your sit-stand desk height", status: "todo" },
  { id: "t7", text: "Context: Review the architecture board", status: "todo" },
  { id: "t8", text: "Recharge: Visit the coffee hub", status: "todo" },
];

const quickSignals = [
  { label: "Movement", value: "WASD", icon: Terminal },
  { label: "Interact", value: "E", icon: MessageSquare },
  { label: "Goal", value: "Finish onboarding", icon: CheckCircle2 },
];

export default function OnboardingSimulation() {
  const [isDialogueActive, setIsDialogueActive] = useState(false);
  const [activeNPC, setActiveNPC] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);

  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const raycasterRef = useRef(null);
  const animationRef = useRef();
  const showPromptRef = useRef(false);
  const dialogueRef = useRef(false);
  const lastTargetRef = useRef(null);
  const isMountedRef = useRef(true);
  const controlsRef = useRef({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    velocity: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    interactables: [],
  });

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const completedTaskCount = useMemo(
    () => tasks.filter((task) => task.status === "done").length,
    [tasks]
  );

  const updateTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, status: "done" } : task
      )
    );
  };

  const callGemini = async (history, npcInfo) => {
    if (!apiKey) {
      return `${npcInfo.name} is available for a short onboarding chat, but the Gemini API key is not configured yet.`;
    }

    setIsAILoading(true);

    try {
      const contents = history.map((message) => ({
        role: message.role === "user" ? "user" : "model",
        parts: [{ text: message.text }],
      }));

      const systemPrompt = `You are ${npcInfo.name}, the ${npcInfo.role}. Context: ${npcInfo.personality}. Keep responses strictly to 1 or 2 sentences. Use warm, professional language. Do not use Markdown formatting.`;

      const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
        }),
      });

      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Let's reconnect in a few minutes."
      );
    } catch {
      return "The office chat channel is having trouble right now. Please try again in a moment.";
    } finally {
      if (isMountedRef.current) {
        setIsAILoading(false);
      }
    }
  };

  useEffect(() => {
    dialogueRef.current = isDialogueActive;
  }, [isDialogueActive]);

  useEffect(() => {
    isMountedRef.current = true;

    const mountNode = mountRef.current;
    if (!mountNode) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050816);
    scene.fog = new THREE.Fog(0x050816, 8, 36);

    const camera = new THREE.PerspectiveCamera(
      72,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.7, 9.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountNode.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    raycasterRef.current = new THREE.Raycaster();
    controlsRef.current.interactables = [];

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(52, 52),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.92,
        metalness: 0.08,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const addGlowDisc = (x, z, color, opacity) => {
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(4.6, 40),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          depthWrite: false,
        })
      );
      disc.rotation.x = -Math.PI / 2;
      disc.position.set(x, 0.02, z);
      scene.add(disc);
    };

    addGlowDisc(-7, -5, 0x60a5fa, 0.07);
    addGlowDisc(7, 4, 0xfb923c, 0.05);

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.08,
      roughness: 0.22,
      metalness: 0.16,
    });

    const addWall = (x, z, rotationY) => {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(24, 4.2, 0.15),
        wallMaterial
      );
      wall.position.set(x, 2.1, z);
      wall.rotation.y = rotationY;
      scene.add(wall);
    };

    addWall(0, -12, 0);
    addWall(0, 12, 0);
    addWall(-12, 0, Math.PI / 2);
    addWall(12, 0, Math.PI / 2);

    scene.add(new THREE.AmbientLight(0xe0f2fe, 0.8));

    const keyLight = new THREE.DirectionalLight(0x93c5fd, 1.25);
    keyLight.position.set(6, 10, 6);
    scene.add(keyLight);

    const warmLight = new THREE.PointLight(0xfb923c, 18, 24, 2);
    warmLight.position.set(0, 4, -7);
    scene.add(warmLight);

    const buildDesk = (x, z, name, role, color, emoji, personality, isPlayer) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const top = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.08, 1.6),
        new THREE.MeshStandardMaterial({
          color: 0x162033,
          roughness: 0.5,
          metalness: 0.25,
        })
      );
      top.position.y = 1;
      group.add(top);

      const monitorGeometry = new THREE.BoxGeometry(1.35, 0.72, 0.06);
      const monitorMaterial = new THREE.MeshStandardMaterial({
        color: 0x020617,
        emissive: 0x60a5fa,
        emissiveIntensity: 0.24,
      });

      const leftMonitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
      leftMonitor.position.set(-0.72, 1.44, -0.38);
      leftMonitor.rotation.y = 0.16;
      group.add(leftMonitor);

      const rightMonitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
      rightMonitor.position.set(0.72, 1.44, -0.38);
      rightMonitor.rotation.y = -0.16;
      group.add(rightMonitor);

      const keyboard = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.03, 0.24),
        new THREE.MeshStandardMaterial({ color: 0x334155 })
      );
      keyboard.position.set(0, 1.05, 0.02);
      group.add(keyboard);

      const deskAccent = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
      );
      deskAccent.position.set(-0.92, 1.06, 0.12);
      group.add(deskAccent);

      if (!isPlayer) {
        const npc = new THREE.Group();
        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 0.82, 18),
          new THREE.MeshStandardMaterial({ color })
        );
        body.position.y = 0.76;
        npc.add(body);

        const head = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 18, 18),
          new THREE.MeshStandardMaterial({ color: 0xffd7b8 })
        );
        head.position.y = 1.32;
        npc.add(head);

        const aura = new THREE.Mesh(
          new THREE.RingGeometry(0.26, 0.34, 32),
          new THREE.MeshBasicMaterial({
            color: 0x93c5fd,
            transparent: true,
            opacity: 0.34,
            side: THREE.DoubleSide,
          })
        );
        aura.rotation.x = -Math.PI / 2;
        aura.position.y = 0.02;
        npc.add(aura);

        npc.position.z = 0.62;
        npc.userData = { type: "person", name, role, emoji, personality };
        group.add(npc);
        controlsRef.current.interactables.push(npc);
      } else {
        top.userData = {
          type: "desk",
          name: "Workstation 7",
          role: "Your Workspace",
          emoji: "DESK",
          personality: "A focused setup built for your first week.",
        };
        controlsRef.current.interactables.push(top);
      }

      scene.add(group);
    };

    buildDesk(
      -6,
      -4,
      "Sarah",
      "HR Manager",
      0x2563eb,
      "HR",
      "Supportive HR lead focused on onboarding and practical reassurance.",
      false
    );
    buildDesk(
      6,
      -4,
      "Mike",
      "Lead Developer",
      0x059669,
      "DEV",
      "Direct engineering lead who explains team expectations clearly.",
      false
    );
    buildDesk(
      -6,
      5,
      "Alex",
      "QA Analyst",
      0x64748b,
      "QA",
      "Methodical teammate who likes edge cases and clean handoffs.",
      false
    );
    buildDesk(
      6,
      5,
      "My Desk",
      "Workspace",
      0xffffff,
      "DESK",
      "Your desk with monitors, keyboard, and onboarding notes.",
      true
    );

    const whiteboard = new THREE.Mesh(
      new THREE.BoxGeometry(5, 3, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        emissive: 0x60a5fa,
        emissiveIntensity: 0.08,
      })
    );
    whiteboard.position.set(0, 2.1, -11.85);
    whiteboard.userData = {
      type: "board",
      name: "Whiteboard",
      role: "System Architecture",
      emoji: "BOARD",
      personality: "A high-level view of the product flow and team collaboration.",
    };
    controlsRef.current.interactables.push(whiteboard);
    scene.add(whiteboard);

    const animate = () => {
      const controls = controlsRef.current;
      const activeCamera = cameraRef.current;
      const activeRenderer = rendererRef.current;
      const activeRaycaster = raycasterRef.current;

      if (activeCamera && activeRenderer) {
        if (!dialogueRef.current && document.pointerLockElement === activeRenderer.domElement) {
          const delta = 0.1;
          controls.velocity.x -= controls.velocity.x * 10 * delta;
          controls.velocity.z -= controls.velocity.z * 10 * delta;
          controls.direction.z =
            Number(controls.moveForward) - Number(controls.moveBackward);
          controls.direction.x =
            Number(controls.moveRight) - Number(controls.moveLeft);
          controls.direction.normalize();

          if (controls.moveForward || controls.moveBackward) {
            controls.velocity.z -= controls.direction.z * 26 * delta;
          }

          if (controls.moveLeft || controls.moveRight) {
            controls.velocity.x -= controls.direction.x * 26 * delta;
          }

          activeCamera.translateX(-controls.velocity.x * delta);
          activeCamera.translateZ(controls.velocity.z * delta);

          const limit = 11.2;
          activeCamera.position.x = Math.max(
            -limit,
            Math.min(limit, activeCamera.position.x)
          );
          activeCamera.position.z = Math.max(
            -limit,
            Math.min(limit, activeCamera.position.z)
          );
          activeCamera.position.y = 1.7;
        }

        activeCamera.rotation.order = "YXZ";
        activeCamera.rotation.y = controls.yaw;
        activeCamera.rotation.x = controls.pitch;

        if (activeRaycaster) {
          activeRaycaster.setFromCamera({ x: 0, y: 0 }, activeCamera);
          const hits = activeRaycaster.intersectObjects(
            controls.interactables,
            true
          );

          if (hits.length > 0 && hits[0].distance < 3.5) {
            let object = hits[0].object;
            while (object.parent && !object.userData?.type) {
              object = object.parent;
            }

            lastTargetRef.current = object;
            if (!showPromptRef.current) {
              showPromptRef.current = true;
              setShowPrompt(true);
            }
          } else {
            lastTargetRef.current = null;
            if (showPromptRef.current) {
              showPromptRef.current = false;
              setShowPrompt(false);
            }
          }
        }

        activeRenderer.render(scene, activeCamera);
      }

      animationRef.current = window.requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }

      const { clientWidth, clientHeight } = mountRef.current;
      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(clientWidth, clientHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(animationRef.current);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (
          mountRef.current &&
          rendererRef.current.domElement.parentNode === mountRef.current
        ) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      }

      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  useEffect(() => {
    const initChat = async () => {
      const target = lastTargetRef.current;
      if (!target) {
        return;
      }

      const npcData = target.userData;
      setIsDialogueActive(true);
      document.exitPointerLock();
      setActiveNPC(npcData);

      const initialHistory = [
        { role: "user", text: `Hi ${npcData.name}, how is the day going?` },
      ];

      setChatHistory(initialHistory);
      const aiText = await callGemini(initialHistory, npcData);

      if (!isMountedRef.current) {
        return;
      }

      setChatHistory([...initialHistory, { role: "model", text: aiText }]);

      if (npcData.name === "Sarah") updateTask("t1");
      if (npcData.name === "Mike") updateTask("t2");
      if (npcData.name === "My Desk" || npcData.name === "Workstation 7") {
        updateTask("t3");
      }
      if (npcData.name === "Alex") updateTask("t5");
      if (npcData.name === "Whiteboard") updateTask("t7");
    };

    const handleKeys = (event) => {
      const isDown = event.type === "keydown";
      const controls = controlsRef.current;

      if (event.code === "KeyW") controls.moveForward = isDown;
      if (event.code === "KeyS") controls.moveBackward = isDown;
      if (event.code === "KeyA") controls.moveLeft = isDown;
      if (event.code === "KeyD") controls.moveRight = isDown;

      if (event.code === "KeyE" && isDown && !dialogueRef.current) {
        initChat();
      }
    };

    const handleLook = (event) => {
      const renderer = rendererRef.current;
      if (!renderer || document.pointerLockElement !== renderer.domElement) {
        return;
      }

      const controls = controlsRef.current;
      controls.yaw -= event.movementX * 0.0011;
      controls.pitch -= event.movementY * 0.0011;
      controls.pitch = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, controls.pitch)
      );
    };

    window.addEventListener("keydown", handleKeys);
    window.addEventListener("keyup", handleKeys);
    window.addEventListener("mousemove", handleLook);

    return () => {
      window.removeEventListener("keydown", handleKeys);
      window.removeEventListener("keyup", handleKeys);
      window.removeEventListener("mousemove", handleLook);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isAILoading || !activeNPC) {
      return;
    }

    const outgoingText = userInput;
    const updatedHistory = [...chatHistory, { role: "user", text: outgoingText }];
    setChatHistory(updatedHistory);
    setUserInput("");

    const aiText = await callGemini(updatedHistory, activeNPC);
    if (!isMountedRef.current) {
      return;
    }

    setChatHistory([...updatedHistory, { role: "model", text: aiText }]);

    const normalizedText = outgoingText.toLowerCase();
    if (normalizedText.includes("credential")) updateTask("t4");
    if (normalizedText.includes("height") || normalizedText.includes("stand")) {
      updateTask("t6");
    }
    if (normalizedText.includes("coffee")) updateTask("t8");
  };

  const closeDialogue = () => {
    setIsDialogueActive(false);
    setActiveNPC(null);
    setChatHistory([]);

    window.setTimeout(() => {
      const renderer = rendererRef.current;
      if (renderer?.domElement && hasStarted) {
        renderer.domElement.requestPointerLock();
      }
    }, 160);
  };

  const startExperience = () => {
    setHasStarted(true);
    rendererRef.current?.domElement?.requestPointerLock();
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel relative overflow-hidden rounded-[2.5rem] p-6 shadow-soft md:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-5rem] top-[-4rem] h-48 w-48 rounded-full bg-sky-300/12 blur-3xl" />
          <div className="absolute right-[-4rem] top-10 h-44 w-44 rounded-full bg-orange-300/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-sky-300/5 to-transparent" />
        </div>

        <div className="relative z-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-sky-200">
              <Sparkles className="h-4 w-4" />
              Interactive Onboarding Simulation
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                Dashboard Experience
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-4xl leading-[0.96] text-white md:text-5xl">
                Step into a guided workspace that matches the
                <span className="text-gradient"> original NextStep mood.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                This simulation now lives inside the dashboard and uses the same
                dark glass aesthetic, soft sky highlights, and warm accent glow
                as the rest of the frontend.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {quickSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <article
                    key={signal.label}
                    className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/20 to-white/10 text-sky-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                      {signal.label}
                    </p>
                    <p className="mt-2 font-display text-2xl text-white">
                      {signal.value}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,15,30,0.9),rgba(7,11,22,0.66))] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Progress Overview
                </p>
                <h3 className="mt-2 font-display text-3xl text-white">
                  First Week Flow
                </h3>
              </div>
              <div className="rounded-full border border-sky-200/20 bg-sky-200/10 px-4 py-2 text-sm text-white">
                {completedTaskCount}/{tasks.length} done
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-300 via-cyan-200 to-orange-200 transition-all duration-500"
                style={{
                  width: `${(completedTaskCount / tasks.length) * 100}%`,
                }}
              />
            </div>

            <div className="mt-5 space-y-3">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      task.status === "done"
                        ? "bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.5)]"
                        : "bg-slate-500"
                    }`}
                  />
                  <span
                    className={`text-sm leading-6 ${
                      task.status === "done"
                        ? "text-emerald-200 line-through"
                        : "text-slate-300"
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="glass-panel relative overflow-hidden rounded-[2.5rem] shadow-soft">
          <div
            ref={mountRef}
            className="relative h-[720px] w-full cursor-crosshair overflow-hidden rounded-[2.5rem]"
            onClick={() => {
              if (!isDialogueActive && hasStarted) {
                rendererRef.current?.domElement?.requestPointerLock();
              }
            }}
          />

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-6 top-6 rounded-[1.6rem] border border-white/10 bg-[#081122]/70 px-5 py-4 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/20 to-white/10 text-sm font-semibold text-sky-100">
                  NS
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Onboarding Studio
                  </p>
                  <p className="mt-1 font-display text-2xl text-white">
                    Office Sync
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div
                className={`max-w-xs rounded-full border border-sky-200/20 bg-sky-200/10 px-5 py-3 text-xs uppercase tracking-[0.24em] text-white backdrop-blur-xl transition-all duration-300 ${
                  showPrompt && !isDialogueActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
              >
                Press E to start a discussion
              </div>

              <div className="rounded-[1.6rem] border border-white/10 bg-[#081122]/70 px-5 py-4 backdrop-blur-xl">
                <div className="flex items-center gap-3 text-slate-300">
                  <ClipboardList className="h-5 w-5 text-sky-200" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Task Completion
                    </p>
                    <p className="text-sm text-white">
                      {completedTaskCount} of {tasks.length} checkpoints cleared
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!hasStarted && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050816]/88 p-6 backdrop-blur-sm">
              <div className="dashboard-glow max-w-xl rounded-[2.8rem] border border-white/10 p-10 text-center shadow-soft">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-sky-300/20 to-orange-200/10 text-2xl font-semibold text-white">
                  NS
                </div>
                <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-400">
                  Dashboard Simulation
                </p>
                <h3 className="mt-4 font-display text-5xl text-white">
                  Corporate Nexus
                </h3>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  Walk through a stylized office, meet teammates, and complete a
                  short onboarding flow without leaving the dashboard.
                </p>

                <div className="mt-8 grid gap-3 text-left md:grid-cols-3">
                  {quickSignals.map((signal) => (
                    <div
                      key={signal.label}
                      className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                        {signal.label}
                      </p>
                      <p className="mt-2 text-lg text-white">{signal.value}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={startExperience}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-sky-200/20 bg-sky-200/10 px-6 py-3 text-sm text-white transition hover:bg-sky-200/15"
                >
                  Launch Experience
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div
            className={`absolute inset-0 z-30 flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm transition duration-300 ${
              isDialogueActive
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <div className="glass-panel w-full max-w-lg overflow-hidden rounded-[2.4rem] shadow-soft">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#060a17] text-2xl">
                    {activeNPC?.emoji}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {activeNPC?.role}
                    </p>
                    <h4 className="mt-1 font-display text-3xl text-white">
                      {activeNPC?.name}
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDialogue}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[420px] space-y-4 overflow-y-auto px-6 py-6">
                {chatHistory.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm leading-7 shadow-sm ${
                        message.role === "user"
                          ? "rounded-tr-sm bg-sky-300/15 text-white"
                          : "rounded-tl-sm border border-white/10 bg-white/5 text-slate-200"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {isAILoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-1.5 rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-sky-200/60" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-sky-200/60 [animation-delay:0.15s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-sky-200/60 [animation-delay:0.3s]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 bg-white/5 px-6 py-5">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(event) => setUserInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask about the team, setup, or next steps..."
                    className="w-full rounded-[1.3rem] border border-white/10 bg-[#060a17] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-200/20"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={isAILoading}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-[1.3rem] border border-sky-200/20 bg-sky-200/10 text-white transition hover:bg-sky-200/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="glass-panel rounded-[2rem] p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/20 to-white/10 text-sky-100">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Simulation Cast
                </p>
                <h3 className="mt-1 font-display text-3xl text-white">
                  Meet the team
                </h3>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { name: "Sarah", role: "HR Manager", note: "Onboarding and support" },
                { name: "Mike", role: "Lead Developer", note: "Sprint and workflow context" },
                { name: "Alex", role: "QA Analyst", note: "Testing mindset and edge cases" },
              ].map((person) => (
                <div
                  key={person.name}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-white">{person.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                        {person.role}
                      </p>
                    </div>
                    <Zap className="h-4 w-4 text-sky-200" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {person.note}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[2rem] p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-200/20 to-white/10 text-orange-100">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Task List
                </p>
                <h3 className="mt-1 font-display text-3xl text-white">
                  Onboarding checkpoints
                </h3>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(11,16,34,0.82),rgba(15,22,42,0.55))] px-4 py-4"
                >
                  <div className="pt-1">
                    {task.status === "done" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-white/15 bg-white/5" />
                    )}
                  </div>
                  <span
                    className={`text-sm leading-6 ${
                      task.status === "done"
                        ? "text-emerald-200"
                        : "text-slate-300"
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
