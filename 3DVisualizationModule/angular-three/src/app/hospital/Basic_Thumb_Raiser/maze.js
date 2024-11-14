import * as THREE from "three";
import Ground from "./ground.js";
import Wall from "./wall.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {
    constructor(parameters) {
        this.onLoad = function (description) {
            // Store the maze's map and size
            this.map = description.map;
            this.size = description.size;

            // Store the player's initial position and direction
            this.initialPosition = this.cellToCartesian(description.initialPosition);
            this.initialDirection = description.initialDirection;

            // Store the maze's exit location
            this.exitLocation = this.cellToCartesian(description.exitLocation);

            // Create a group of objects
            this.object = new THREE.Group();

            // Create the ground
            this.ground = new Ground({ textureUrl: description.groundTextureUrl, size: description.size });
            this.object.add(this.ground.object);

            // Create a wall
            this.wall = new Wall({ textureUrl: description.wallTextureUrl });

            // Build the maze
            let wallObject;
            for (let i = 0; i <= description.size.width; i++) { // In order to represent the eastmost walls, the map width is one column greater than the actual maze width
                for (let j = 0; j <= description.size.height; j++) { // In order to represent the southmost walls, the map height is one row greater than the actual maze height
                    /*
                     * description.map[][] | North wall | West wall
                     * --------------------+------------+-----------
                     *          0          |     No     |     No
                     *          1          |     No     |    Yes
                     *          2          |    Yes     |     No
                     *          3          |    Yes     |    Yes
                     */
                    if (description.map[j][i] == 2 || description.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - description.size.width / 2.0 + 0.5, 0.5, j - description.size.height / 2.0);
                        this.object.add(wallObject);
                    }
                    if (description.map[j][i] == 1 || description.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.rotateY(Math.PI / 2.0);
                        wallObject.position.set(i - description.size.width / 2.0, 0.5, j - description.size.height / 2.0 + 0.5);
                        this.object.add(wallObject);
                    }
                }
            }

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;
        }

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        }

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a maze description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => this.onProgress(this.url, xhr),

            // onError callback
            error => this.onError(this.url, error)
        );

        // Create a resource .gltf or .glb file loader
        const loaderGLTF = new GLTFLoader();

        // CHAIRS
        loaderGLTF.load('./models/tandem_seating_-_hospital/scene.gltf', (gltf) => {
            this.chair = gltf.scene;
            this.chair.scale.set(0.4, 0.4, 0.4);
            this.chair.position.set(-9.85, 0, -3);
            this.chair.rotateY(3 * Math.PI / 1.975); //1.94 virado para a porta
            this.object.add(this.chair);

            let chair2 = gltf.scene.clone();
            chair2.position.set(-9.85, 0, 3);
            this.object.add(chair2);

            let chair3 = gltf.scene.clone();
            chair3.position.set(-9.85, 0, 2);
            this.object.add(chair3);

            let chair4 = gltf.scene.clone();
            chair4.position.set(-9.85, 0, -2);
            this.object.add(chair4);

            //=======================================================================================================
            // waiting room 1
            let chair5 = gltf.scene.clone();
            chair5.position.set(-1.6, 0, -5.35);
            chair5.rotateY(3 * Math.PI / 2);
            this.object.add(chair5);
            
            let chair6 = gltf.scene.clone();
            chair6.position.set(-0.4, 0, -5.35);
            chair6.rotateY(3 * Math.PI / 2);
            this.object.add(chair6);

            let chair7 = gltf.scene.clone();
            chair7.position.set(-1.6, 0, -4.6);
            chair7.rotateY( 3 * Math.PI / 2);
            this.object.add(chair7);

            let chair8 = gltf.scene.clone();
            chair8.position.set(-0.4, 0, -4.6);
            chair8.rotateY( 3 * Math.PI / 2);
            this.object.add(chair8);
        
            let chair9 = gltf.scene.clone();
            chair9.position.set(-1.6, 0, -3.85);
            chair9.rotateY( 3 * Math.PI / 2);
            this.object.add(chair9);
        
            let chair10 = gltf.scene.clone();
            chair10.position.set(-0.4, 0, -3.85);
            chair10.rotateY( 3 * Math.PI / 2);
            this.object.add(chair10);
        

            //=======================================================================================================
            // waiting room 2
            let chair11 = gltf.scene.clone();
            chair11.position.set(-1.6, 0, 5.35);
            chair11.rotateY(Math.PI / 2);
            this.object.add(chair11);
            
            let chair12 = gltf.scene.clone();
            chair12.position.set(-0.4, 0, 5.35);
            chair12.rotateY(Math.PI / 2);
            this.object.add(chair12);

            let chair13 = gltf.scene.clone();
            chair13.position.set(-1.6, 0, 4.6);
            chair13.rotateY(Math.PI / 2);
            this.object.add(chair13);

            let chair14 = gltf.scene.clone();
            chair14.position.set(-0.4, 0, 4.6);
            chair14.rotateY(Math.PI / 2);
            this.object.add(chair14);
        
            let chair15 = gltf.scene.clone();
            chair15.position.set(-1.6, 0, 3.85);
            chair15.rotateY(Math.PI / 2);
            this.object.add(chair15);
        
            let chair16 = gltf.scene.clone();
            chair16.position.set(-0.4, 0, 3.85);
            chair16.rotateY(Math.PI / 2);
            this.object.add(chair16);
        } 
        );

        //=======================================================================================================
        // Reception desk
        loaderGLTF.load('./models/reception_desk/scene.gltf', (gltf) => {
            this.desk = gltf.scene;
            this.desk.scale.set(4, 5.5, 4);
            this.desk.position.set(-8.72, 0, -0.67);
            this.desk.rotateY(3 * Math.PI / 2);
            this.object.add(this.desk);
        }
        );

        //=======================================================================================================
        // Reception pc
        loaderGLTF.load('./models/imac_computer/scene.gltf', (gltf) => {
            this.pc = gltf.scene;
            this.pc.scale.set(0.37, 0.5, 0.37);
            this.pc.position.set(-8.55, 0.4, 0);
            this.pc.rotateY(3 * Math.PI / 2);
            this.object.add(this.pc);
        }
        );

        //=======================================================================================================
        // Toilet 
        loaderGLTF.load('./models/toilet/scene.gltf', (gltf) => {
            this.toilet = gltf.scene;
            this.toilet.scale.set(0.4, 0.4, 0.4);
            this.toilet.position.set(-8.2, 0.2, -5.35);
            this.toilet.rotateY(3 * Math.PI / 2);
            this.object.add(this.toilet);

            let toilet2 = gltf.scene.clone();
            toilet2.position.set(-8.2, 0.2, 5.35);
            toilet2.rotateY(Math.PI);
            this.object.add(toilet2);

            let toilet3 = gltf.scene.clone();
            toilet3.position.set(6.55, 0.2, -5.35);
            this.object.add(toilet3);

            let toilet4 = gltf.scene.clone();
            toilet4.position.set(6.55, 0.2, 5.35);
            toilet4.rotateY(Math.PI);
            this.object.add(toilet4);
        }
        );


        // KOENIGSEGG ONE PRO
        /*loaderGLTF.load('./models/koenigsegg_one_pro/scene.gltf', (gltf) => {
            this.chair = gltf.scene;
            this.chair.scale.set(10, 10, 10);
            this.chair.position.set(0, 0, 0);
            this.chair.rotateY(3 * Math.PI / 1.975); //1.94 virado para a porta
            this.object.add(this.chair);
        }
        );*/
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.size.width / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z)
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.size.height / 2.0), Math.floor(position.x / this.scale.x + this.size.width / 2.0)];
    }

    distanceToWestWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    distanceToEastWall(position) {
        const indices = this.cartesianToCell(position);
        indices[1]++;
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        return Infinity;
    }

    distanceToNorthWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }
        return Infinity;
    }

    distanceToSouthWall(position) {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        return Infinity;
    }

    foundExit(position) {
        return Math.abs(position.x - this.exitLocation.x) < 0.5 * this.scale.x && Math.abs(position.z - this.exitLocation.z) < 0.5 * this.scale.z
    };
}