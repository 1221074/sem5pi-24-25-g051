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

    }
}
