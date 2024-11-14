import * as THREE from "three";
import * as TWEEN from "three/addons/libs/tween.module.js";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


/*
 * parameters = {
 *  textureUrl: String
 * }
 */

export default class NormalDoor {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        const frameSize = { width: 0.840, height: 1.788, depth: 0.045 };
        const doorSize = { width: 0.654, height: 1.686, depth: 0.035, gap: 0.0465 };
        let scene, camera, renderer, controls;

        // Create a material
        const sideMaterial = new THREE.MeshBasicMaterial({ color: 0xc36e2d });

        // Create the frame

        // Create a box geometry
        let geometry = new THREE.BoxGeometry(frameSize.width, frameSize.height, frameSize.depth);

        // Create a texture
        let texture = new THREE.TextureLoader().load("./textures/frame_front.png");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        let frontMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
        frontMaterial.transparent = true;

        // Create a texture
        texture = new THREE.TextureLoader().load("./textures/frame_back.png");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        let backMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
        backMaterial.transparent = true;

        // Create a mesh with the specified geometry and materials
        let mesh = new THREE.Mesh(geometry, [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, backMaterial]);

        // Add the mesh to the scene
        scene.add(mesh);

        // Create the door

        // Create a box geometry
        geometry = new THREE.BoxGeometry(doorSize.width, doorSize.height, doorSize.depth);

        // Create a texture
        texture = new THREE.TextureLoader().load("./textures/door_front.png");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        frontMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });

        // Create a texture
        texture = new THREE.TextureLoader().load("./textures/door_back.png");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        backMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });

        // Create a mesh with the specified geometry and materials
        mesh = new THREE.Mesh(geometry, [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, backMaterial]);
        mesh.translateX(doorSize.width / 2.0);
        mesh.translateY(-doorSize.gap);

        // Create a group

        const door = new THREE.Group();

        // Add the mesh to the group
        door.add(mesh);
        door.translateX(-doorSize.width / 2.0);

        // Add the group to the scene
        scene.add(door);

        // Create and configure two tweens
        let state = "close";
        const tween = new TWEEN.Tween(door.rotation);

        // Create and configure the GUI
        const gui = new GUI();
        const actions = {
            open: () => {
                if (state != "open") {
                    state = "open";
                    tween.stop();
                    tween.to({ y: Math.PI / 2.0 }, 2000 * (1.0 - door.rotation.y / (Math.PI / 2.0)));
                    tween.startFromCurrentValues();
                }
            },
            stop: () => {
                state = "stop";
                tween.stop();
            },
            close: () => {
                if (state != "close") {
                    state = "close";
                    tween.stop();
                    tween.to({ y: 0.0 }, 2000 * door.rotation.y / (Math.PI / 2.0));
                    tween.startFromCurrentValues();
                }
            }
        };
        gui.add(actions, "open");
        gui.add(actions, "stop");
        gui.add(actions, "close");

        // Set the camera position;
        camera.position.z = 2.5;

        // Register the event handler to be called on window resize
        window.addEventListener("resize", windowResize);

        animate();
    }

    windowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
