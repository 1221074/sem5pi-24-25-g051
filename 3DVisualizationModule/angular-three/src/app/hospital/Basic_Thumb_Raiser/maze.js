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
        // Reception chair
        loaderGLTF.load('./models/ikea_markus_office_chair/scene.gltf', (gltf) => {
            this.recChair = gltf.scene;
            this.recChair.scale.set(0.0045, 0.0045, 0.0045);
            this.recChair.position.set(-8.25, 0, 0);
            this.recChair.rotateY(3 * Math.PI / 2);
            this.object.add(this.recChair);

            let recChair2 = gltf.scene.clone();
            recChair2.position.set(-7.57, 0, 1.99);
            recChair2.rotateY(Math.PI / 2);
            this.object.add(recChair2);
        }
        );


        //=======================================================================================================
        // Toilet
        loaderGLTF.load('./models/toilet/scene.gltf', (gltf) => {
            this.toilet = gltf.scene;
            this.toilet.scale.set(0.4, 0.5, 0.4);
            this.toilet.position.set(-8.2, 0.25, -5.363);
            this.toilet.rotateY(3 * Math.PI / 2);
            this.object.add(this.toilet);

            let toilet2 = gltf.scene.clone();
            toilet2.position.set(-8.2, 0.25, 5.363);
            toilet2.rotateY(Math.PI);
            this.object.add(toilet2);

            let toilet3 = gltf.scene.clone();
            toilet3.position.set(6.55, 0.25, -5.363);
            this.object.add(toilet3);

            let toilet4 = gltf.scene.clone();
            toilet4.position.set(6.55, 0.25, 5.363);
            toilet4.rotateY(Math.PI);
            this.object.add(toilet4);
        }
        );

        loaderGLTF.load('./models/toilet_paper_holder/scene.gltf', (gltf) => {
            this.toiletPaper = gltf.scene;
            this.toiletPaper.scale.set(0.4, 0.5, 0.4);
            this.toiletPaper.position.set(-8.4, 0, -5.35);
            this.object.add(this.toiletPaper);

            let toiletPaper2 = gltf.scene.clone();
            toiletPaper2.position.set(-8.4, 0, 5.35);
            toiletPaper2.rotateY(Math.PI);
            this.object.add(toiletPaper2);

            let toiletPaper3 = gltf.scene.clone();
            toiletPaper3.position.set(6.35, 0, -5.35);
            this.object.add(toiletPaper3);

            let toiletPaper4 = gltf.scene.clone();
            toiletPaper4.position.set(6.35, 0, 5.35);
            toiletPaper4.rotateY(Math.PI);
            this.object.add(toiletPaper4);
        }
        );

        loaderGLTF.load('./models/sink/scene.gltf', (gltf) => {
            this.sink = gltf.scene;
            this.sink.scale.set(0.25, 0.35, 0.25);
            this.sink.position.set(-9.5, 0, -5.37);
            this.sink.rotateY(2 * Math.PI);
            this.object.add(this.sink);

            let sink2 = gltf.scene.clone();
            sink2.position.set(-9.5, 0, 5.37);
            sink2.rotateY(Math.PI);
            this.object.add(sink2);

            let sink3 = gltf.scene.clone();
            sink3.position.set(6.13, 0, -4);
            sink3.rotateY(Math.PI / 2);
            this.object.add(sink3);

            let sink4 = gltf.scene.clone();
            sink4.position.set(6.13, 0, 4.6);
            sink4.rotateY(Math.PI / 2);
            this.object.add(sink4);
        }
        );

        loaderGLTF.load('./models/ornate_mirror_01_1k.gltf/ornate_mirror_01_1k.gltf', (gltf) => {
            this.mirror = gltf.scene;
            this.mirror.scale.set(0.4, 0.52, 0.4);
            this.mirror.position.set(-9.5, 0.7, -5.47);
            this.mirror.rotateY(2 * Math.PI);
            this.object.add(this.mirror);

            let mirror2 = gltf.scene.clone();
            mirror2.position.set(-9.5, 0.7, 5.47);
            mirror2.rotateY(Math.PI);
            this.object.add(mirror2);

            let mirror3 = gltf.scene.clone();
            mirror3.position.set(6.03, 0.7, -4);
            mirror3.rotateY(Math.PI / 2);
            this.object.add(mirror3);

            let mirror4 = gltf.scene.clone();
            mirror4.position.set(6.03, 0.7, 4.6);
            mirror4.rotateY(Math.PI / 2);
            this.object.add(mirror4);
        }
        );

        loaderGLTF.load('./models/hand_dryer_clean/scene.gltf', (gltf) => {
            this.dryer = gltf.scene;
            this.dryer.scale.set(0.2, 0.2, 0.2);
            this.dryer.position.set(-9.15, 0.5, -5.4);
            this.dryer.rotateY(2 * Math.PI);
            this.object.add(this.dryer);

            let dryer2 = gltf.scene.clone();
            dryer2.position.set(-9.15, 0.5, 5.4);
            dryer2.rotateY(Math.PI);
            this.object.add(dryer2);

            let dryer3 = gltf.scene.clone();
            dryer3.position.set(6.1, 0.5, -4.33);
            dryer3.rotateY(Math.PI / 2);
            this.object.add(dryer3);

            let dryer4 = gltf.scene.clone();
            dryer4.position.set(6.1, 0.5, 4.9);
            dryer4.rotateY(Math.PI / 2);
            this.object.add(dryer4);
        }
        );


        loaderGLTF.load('./models/free_urinal__commercial_urinal_realistic/scene.gltf', (gltf) => {
            this.urinal = gltf.scene;
            this.urinal.scale.set(0.1, 0.15, 0.12);
            this.urinal.position.set(-8.9, 0.4, -4.6);
            this.urinal.rotateY(Math.PI);
            this.object.add(this.urinal);

            let urinal2 = gltf.scene.clone();
            urinal2.position.set(6.9, 0.4, -4.15);
            urinal2.rotateY(Math.PI / 2);
            this.object.add(urinal2);

            let urinal3 = gltf.scene.clone();
            urinal3.position.set(6.9, 0.4, -3.85);
            urinal3.rotateY(Math.PI / 2);
            this.object.add(urinal3);
        }
        );

        loaderGLTF.load('./models/cubicle_without_toilet/scene.gltf', (gltf) => {
            this.cubicle = gltf.scene;
            this.cubicle.scale.set(0.455, 0.43, 0.3);
            this.cubicle.position.set(-8.25, 0, -5.3);
            this.object.add(this.cubicle);

            let cubicle2 = gltf.scene.clone();
            cubicle2.scale.set(0.65, 0.43, 0.3);
            cubicle2.position.set(6.5, 0, -5.3);
            this.object.add(cubicle2);

        }
        );

        //=======================================================================================================
        // Staff room

        loaderGLTF.load('./models/table/scene.gltf', (gltf) => {
            this.table = gltf.scene;
            this.table.scale.set(0.65, 0.8, 0.75);
            this.table.position.set(-7.44, 0.35, 2.23);
            this.object.add(this.table);
        }
        );

        loaderGLTF.load('./models/retro_computer_setup_free/scene.gltf', (gltf) => {
            this.computer = gltf.scene;
            this.computer.scale.set(0.005, 0.005, 0.004);
            this.computer.position.set(-7.6, 0.38, 2.2);
            this.computer.rotateY(Math.PI);
            this.object.add(this.computer);
        }
        );

        loaderGLTF.load('./models/server_rack/scene.gltf', (gltf) => {
            this.server = gltf.scene;
            this.server.scale.set(0.3, 0.4, 0.3);
            this.server.position.set(-6.15, 0.4, 2.3);
            this.server.rotateY(Math.PI / 2);
            this.object.add(this.server);

            let server2 = gltf.scene.clone();
            server2.scale.set(0.3, 0.4, 0.3);
            server2.position.set(-6.15, 0.4, 2.1);
            this.object.add(server2);

            let server3 = gltf.scene.clone();
            server3.scale.set(0.3, 0.4, 0.3);
            server3.position.set(-6.15, 0.4, 1.9);
            this.object.add(server3);

            let server4 = gltf.scene.clone();
            server4.scale.set(0.3, 0.4, 0.3);
            server4.position.set(-6.15, 0.4, 1.7);
            this.object.add(server4);
        }
        );

        loaderGLTF.load('./models/printer_copy_machine_and_scanner_in_one/scene.gltf', (gltf) => {
            this.printer = gltf.scene;
            this.printer.scale.set(0.3, 0.38, 0.3);
            this.printer.position.set(-7.17, 0.437, 2.24);
            this.printer.rotateY(Math.PI);
            this.object.add(this.printer);
        }
        );

        loaderGLTF.load('./models/industrial_-_locker/scene.gltf', (gltf) => {
            this.locker = gltf.scene;
            this.locker.scale.set(0.03, 0.05, 0.03);
            this.locker.position.set(-7.84, 0.4, 1.2);
            this.locker.rotateY(Math.PI / 2);
            this.object.add(this.locker);

            let locker2 = gltf.scene.clone();
            locker2.scale.set(0.03, 0.05, 0.03);
            locker2.position.set(-7.84, 0.4, 0.8);
            this.object.add(locker2);

            let locker3 = gltf.scene.clone();
            locker3.scale.set(0.03, 0.05, 0.03);
            locker3.position.set(-7.84, 0.4, 0.4);
            this.object.add(locker3);

            let locker4 = gltf.scene.clone();
            locker4.scale.set(0.03, 0.05, 0.03);
            locker4.position.set(-7.84, 0.4, 0);
            this.object.add(locker4);

            let locker5 = gltf.scene.clone();
            locker5.scale.set(0.03, 0.05, 0.03);
            locker5.position.set(-7.84, 0.4, -0.4);
            this.object.add(locker5);

            let locker6 = gltf.scene.clone();
            locker6.scale.set(0.03, 0.05, 0.03);
            locker6.position.set(-7.84, 0.4, -0.8);
            this.object.add(locker6);

            let locker7 = gltf.scene.clone();
            locker7.scale.set(0.03, 0.05, 0.03);
            locker7.position.set(-7.84, 0.4, -1.2);
            this.object.add(locker7);
            
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
