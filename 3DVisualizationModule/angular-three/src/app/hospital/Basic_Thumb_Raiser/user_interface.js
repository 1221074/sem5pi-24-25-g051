import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Maze from "./maze";

export default class UserInteraction {
    constructor(scene, renderer, lights, fog, object, animations, maze) {

        function colorCallback(object, color) {
            object.color.set(color);
        }

        function shadowsCallback(enabled) {
            scene.traverseVisible(function (child) { // Modifying the scene graph inside the callback is discouraged: https://threejs.org/docs/index.html?q=object3d#api/en/core/Object3D.traverseVisible
                if (child.material) {
                    child.material.needsUpdate = true;
                }
            });
        }

        function createEmoteCallback(animations, name) {
            callbacks[name] = function () {
                animations.fadeToAction(name, 0.2);
            };
            emotesFolder.add(callbacks, name);
        }

        function visibilityCallback(objects, visible) {
            objects.forEach(object => {
                object.visible = visible;
            });
        }

        // Create the graphical user interface
        this.gui = new GUI({ hideable: false });

        // Create the room folder
        const roomFolder = this.gui.addFolder("Rooms");

        const receptionObjects = maze.receptionModels;
        const toiletObjects = maze.toiletModels;
        const staffObjects = maze.staffModels;
        const screeningObjects = maze.screeningModels;
        const kitchenObjects = maze.kitchenModels;
        const cafeteriaObjects = maze.cafeteriaModels;
        const waitingRoomObjects = maze.waitingRoomModels;
        const surgicalObjects = maze.surgeryRoomModels;
        const bedroomObjects = maze.bedroomModels;
        const parkingObjects = maze.parkingLotModels;

        // Adicionar checkboxes para cada sala
        const roomVisibility = {
            reception: false,
            toilet: false,
            staff: false,
            screening: false,
            kitchen: false,
            cafeteria: false,
            waitingRoom: false,
            surgical: false,
            bedroom: false,
            parking: false
        };

        roomFolder.add(roomVisibility, 'reception').name('Reception').onChange(visible => visibilityCallback(receptionObjects, visible));
        roomFolder.add(roomVisibility, 'toilet').name('Toilet').onChange(visible => visibilityCallback(toiletObjects, visible));
        roomFolder.add(roomVisibility, 'staff').name('Staff Room').onChange(visible => visibilityCallback(staffObjects, visible));
        roomFolder.add(roomVisibility, 'screening').name('Screening').onChange(visible => visibilityCallback(screeningObjects, visible));
        roomFolder.add(roomVisibility, 'kitchen').name('Kitchen').onChange(visible => visibilityCallback(kitchenObjects, visible));
        roomFolder.add(roomVisibility, 'cafeteria').name('Cafeteria').onChange(visible => visibilityCallback(cafeteriaObjects, visible));
        roomFolder.add(roomVisibility, 'waitingRoom').name('Waiting Room').onChange(visible => visibilityCallback(waitingRoomObjects, visible));
        roomFolder.add(roomVisibility, 'surgical').name('Surgical Room').onChange(visible => visibilityCallback(surgicalObjects, visible));
        roomFolder.add(roomVisibility, 'bedroom').name('Bedroom').onChange(visible => visibilityCallback(bedroomObjects, visible));
        roomFolder.add(roomVisibility, 'parking').name('Parking Lot').onChange(visible => visibilityCallback(parkingObjects, visible));

        roomFolder.close();

        // Create the lights folder
        const lightsFolder = this.gui.addFolder("Lights");

        // Create the ambient light folder
        const ambientLightFolder = lightsFolder.addFolder("Ambient light");
        const ambientLight = lights.object.ambientLight;
        const ambientColor = { color: "#" + new THREE.Color(ambientLight.color).getHexString() };
        ambientLightFolder.addColor(ambientColor, "color").onChange(color => colorCallback(ambientLight, color));
        ambientLightFolder.add(lights.object.ambientLight, "intensity", 0.0, 1.0, 0.01);

        ambientLightFolder.close();

        // Create point light #1 folder
        const pointLight1Folder = lightsFolder.addFolder("Point light #1");
        const pointLight1 = lights.object.pointLight1;
        const pointColor1 = { color: "#" + new THREE.Color(pointLight1.color).getHexString() };
        pointLight1Folder.addColor(pointColor1, "color").onChange(color => colorCallback(pointLight1, color));
        pointLight1Folder.add(lights.object.pointLight1, "intensity", 0.0, 100.0, 1.0);
        pointLight1Folder.add(lights.object.pointLight1, "distance", 0.0, 20.0, 0.01);
        pointLight1Folder.add(lights.object.pointLight1.position, "x", -10.0, 10.0, 0.01);
        pointLight1Folder.add(lights.object.pointLight1.position, "y", 0.0, 20.0, 0.01);
        pointLight1Folder.add(lights.object.pointLight1.position, "z", -10.0, 10.0, 0.01);

        pointLight1Folder.close();

        // Create point light #2 folder
        const pointLight2Folder = lightsFolder.addFolder("Point light #2");
        const pointLight2 = lights.object.pointLight2;
        const pointColor2 = { color: "#" + new THREE.Color(pointLight2.color).getHexString() };
        pointLight2Folder.addColor(pointColor2, "color").onChange(color => colorCallback(pointLight2, color));
        pointLight2Folder.add(lights.object.pointLight2, "intensity", 0.0, 100.0, 1.0);
        pointLight2Folder.add(lights.object.pointLight2, "distance", 0.0, 20.0, 0.01);
        pointLight2Folder.add(lights.object.pointLight2.position, "x", -10.0, 10.0, 0.01);
        pointLight2Folder.add(lights.object.pointLight2.position, "y", 0.0, 20.0, 0.01);
        pointLight2Folder.add(lights.object.pointLight2.position, "z", -10.0, 10.0, 0.01);

        pointLight2Folder.close();

        lightsFolder.close();

        // Create the shadows folder
        const shadowsFolder = this.gui.addFolder("Shadows");
        shadowsFolder.add(renderer.shadowMap, "enabled").onChange(enabled => shadowsCallback(enabled));

        shadowsFolder.close();

        // Create the fog folder
        const fogFolder = this.gui.addFolder("Fog");
        const fogColor = { color: "#" + new THREE.Color(fog.color).getHexString() };
        fogFolder.add(fog, "enabled").listen();
        fogFolder.addColor(fogColor, "color").onChange(color => colorCallback(fog.object, color));
        fogFolder.add(fog.object, "near", 0.01, 1.0, 0.01);
        fogFolder.add(fog.object, "far", 1.01, 20.0, 0.01);

        fogFolder.close();

        // Create the character folder
        const characterFolder = this.gui.addFolder("Character");

        // Create the emotes folder and add emotes
        const emotesFolder = characterFolder.addFolder("Emotes");
        const callbacks = [];
        for (let i = 0; i < animations.emotes.length; i++) {
            createEmoteCallback(animations, animations.emotes[i]);
        }

        emotesFolder.close();

        // Create the expressions folder and add expressions
        const expressionsFolder = characterFolder.addFolder("Expressions");
        const face = object.getObjectByName("Head_4");
        const expressions = Object.keys(face.morphTargetDictionary);
        for (let i = 0; i < expressions.length; i++) {
            expressionsFolder.add(face.morphTargetInfluences, i, 0.0, 1.0, 0.01).name(expressions[i]);
        }

        expressionsFolder.close();

        characterFolder.close();
    }

    setVisibility(visible) {
        if (visible) {
            this.gui.show();
        }
        else {
            this.gui.hide();
        }
    }
}