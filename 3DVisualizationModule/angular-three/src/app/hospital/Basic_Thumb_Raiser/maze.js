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

            /*
            // Adicionar o retângulo à cena
            const wallGeometry = new THREE.BoxGeometry(1, 2, 0.1); // Largura, altura, profundidade da parede
            const textureLoader = new THREE.TextureLoader();
            const wallTexture = textureLoader.load('./texture/wall.jpg');
            const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture }); // Material com textura
            const wallCaf = new THREE.Mesh(wallGeometry, wallMaterial);
            wallCaf.position.set(0, 1, 0); // Ajuste a posição conforme necessário//rectangle.rotateY(Math.PI / 2); // Rotaciona o plano para ficar na vertical
            this.object.add(wallCaf);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz ambiente
            this.object.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Luz direcional
            directionalLight.position.set(5, 10, 7.5);
            this.object.add(directionalLight);
            */

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

/*        
        //=======================================================================================================
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

        loaderGLTF.load('./models/school_locker/scene.gltf', (gltf) => {
            this.locker = gltf.scene;
            this.locker.scale.set(0.1, 0.15, 0.1);
            this.locker.position.set(-7.95, 0, 0.8);
            this.object.add(this.locker);

            let locker2 = gltf.scene.clone();
            locker2.position.set(-7.95, 0, 0.4);
            this.object.add(locker2);

            let locker3 = gltf.scene.clone();
            locker3.position.set(-7.95, 0, 0);
            this.object.add(locker3);

            let locker4 = gltf.scene.clone();
            locker4.position.set(-7.95, 0, -0.4);
            this.object.add(locker4);

            let locker5 = gltf.scene.clone();
            locker5.position.set(-7.95, 0, -0.8);
            this.object.add(locker5);

        }
        );

        loaderGLTF.load('./models/cleaning_cart/scene.gltf', (gltf) => {
            this.cart = gltf.scene;
            this.cart.scale.set(0.1, 0.1, 0.1);
            this.cart.position.set(-7.58, 0, -2.2);
            this.cart.rotateY(Math.PI / 2);
            this.object.add(this.cart);
        }
        );

        loaderGLTF.load('./models/broom/scene.gltf', (gltf) => {
            this.broom = gltf.scene;
            this.broom.scale.set(0.0051, 0.0051, 0.0051);
            this.broom.position.set(-7.8, 0, -1.8);
            this.broom.rotateY(3 * Math.PI / 2);
            this.broom.rotateX(Math.PI / 16);
            this.object.add(this.broom);
        }
        );


        loaderGLTF.load('./models/security_camera/scene.gltf', (gltf) => {
            this.camera = gltf.scene;
            this.camera.scale.set(0.5, 0.5, 0.5);
            this.camera.position.set(-3, 0.785, -2.59);
            this.object.add(this.camera);
        
            let camera2 = gltf.scene.clone();
            camera2.position.set(-3, 0.785, 2.59);
            camera2.rotateY(Math.PI);
            this.object.add(camera2);

            let camera3 = gltf.scene.clone();
            camera3.position.set(-8.09, 0.785, -1);
            camera3.rotateY(Math.PI / 2);
            this.object.add(camera3);
        }
        );

        loaderGLTF.load('./models/fire_alarm/scene.gltf', (gltf) => {
            this.alarm = gltf.scene;
            this.alarm.scale.set(0.05, 0.05, 0.05);
            this.alarm.position.set(-8.025, 0.5, 1);
            this.alarm.rotateY(3 * Math.PI / 2);
            this.object.add(this.alarm);

            let alarm2 = gltf.scene.clone();
            alarm2.position.set(-3.02, 0.5, 0.1);
            this.object.add(alarm2);

        }
        );

        loaderGLTF.load('./models/fire_exting/scene.gltf', (gltf) => {
            this.exting = gltf.scene;
            this.exting.scale.set(0.003, 0.004, 0.003);
            this.exting.position.set(-8.07, 0.4, 1.5);
            this.exting.rotateY(3 * Math.PI / 2);
            this.object.add(this.exting);

            let exting2 = gltf.scene.clone();
            exting2.position.set(-3.06, 0.4, -0.1);
            this.object.add(exting2);
        }
        );


        //=======================================================================================================
        // Cafeteria

        loaderGLTF.load('./models/buffet_table/scene.gltf', (gltf) => {
            this.buffet = gltf.scene;
            this.buffet.scale.set(0.05, 0.05, 0.05);
            this.buffet.position.set(-5.4, 0.36, 0.6);
            this.buffet.rotateY(Math.PI / 2);
            this.object.add(this.buffet);
        }
        );

        loaderGLTF.load('./models/buffets_food_warmer_foods_and_plates/scene.gltf', (gltf) => {
            this.tray = gltf.scene;
            this.tray.scale.set(0.2, 0.2, 0.2);
            this.tray.position.set(-5.55, -0.03, -0.2);
            this.tray.rotateY(Math.PI / 2);
            this.object.add(this.tray);
        }
        );

        loaderGLTF.load('./models/unbranded_conventional_fridge/scene.gltf', (gltf) => {
            this.fridge = gltf.scene;
            this.fridge.scale.set(0.002, 0.002, 0.002);
            this.fridge.position.set(-6.7, 0.465, -1.2);
            this.fridge.rotateY(Math.PI / 2);
            this.object.add(this.fridge);
        }
        );

        loaderGLTF.load('./models/stove_with_hood/scene.gltf', (gltf) => {
            this.stove = gltf.scene;
            this.stove.scale.set(0.4, 0.5, 0.4);
            this.stove.position.set(-6.95, 0, 1.3);
            this.object.add(this.stove);

            let stove2 = gltf.scene.clone();
            stove2.position.set(-6.95, 0, 1);
            this.object.add(stove2);

        }
        );

        loaderGLTF.load('./models/kitchen_sink/scene.gltf', (gltf) => {
            this.sink = gltf.scene;
            this.sink.scale.set(0.4, 0.5, 0.4);
            this.sink.position.set(-6.95, 0.4, 0.65);
            this.sink.rotateY(Math.PI / 2);
            this.object.add(this.sink);
        }
        );

        loaderGLTF.load('./models/furniture__mobel_-_kuchentisch/scene.gltf', (gltf) => {
            this.oven = gltf.scene;
            this.oven.scale.set(0.3, 0.5, 0.7);
            this.oven.position.set(-6.8, 0.24, -0.35);
            this.object.add(this.oven);
        }
        );

        loaderGLTF.load('./models/sm_chair_table/scene.gltf', (gltf) => {
            this.cafeTable = gltf.scene;
            this.cafeTable.scale.set(0.5, 0.4, 0.5);
            this.cafeTable.position.set(-5.4, 0, -2);
            this.object.add(this.cafeTable);

            let cafeTable2 = gltf.scene.clone();
            cafeTable2.position.set(-5.4, 0, 2);
            this.object.add(cafeTable2);

            let cafeTable3 = gltf.scene.clone();
            cafeTable3.position.set(-3.6, 0, -2);
            this.object.add(cafeTable3);

            let cafeTable4 = gltf.scene.clone();
            cafeTable4.position.set(-3.6, 0, 2);
            this.object.add(cafeTable4);

            let cafeTable5 = gltf.scene.clone();
            cafeTable5.position.set(-4.2, 0, 0);
            this.object.add(cafeTable5);

        }
        );

        loaderGLTF.load('./models/small_table/scene.gltf', (gltf) => {
            this.smallTable = gltf.scene;
            this.smallTable.scale.set(0.15, 0.12, 0.15);
            this.smallTable.position.set(-5.4, 0.1, 0.85);
            this.object.add(this.smallTable);
        }
        );

        loaderGLTF.load('./models/coffee__tea_mugs_free/scene.gltf', (gltf) => {
            this.mug = gltf.scene;
            this.mug.scale.set(0.2, 0.2, 0.2);
            this.mug.position.set(-5.32, 0.3, 0.85);
            this.object.add(this.mug);

        }
        );

        loaderGLTF.load('./models/coffeemachinemodel_archviz_productdesign_free/scene.gltf', (gltf) => {
            this.coffee = gltf.scene;
            this.coffee.scale.set(0.7, 0.7, 0.7);
            this.coffee.position.set(-5.55, 0.3, 0.85);
            this.object.add(this.coffee);
        }
        );

        //=======================================================================================================
        // Bedroom

        loaderGLTF.load('./models/bed_curtain_and_vital_signs_monitor/scene.gltf', (gltf) => {
            this.bed = gltf.scene;
            this.bed.scale.set(0.15, 0.12, 0.12);
            this.bed.position.set(5.2, 0, -2.1);
            this.bed.rotateY(3 * Math.PI / 2);
            this.object.add(this.bed);

            let bed2 = gltf.scene.clone();
            bed2.position.set(5.2, 0, -0.85);
            this.object.add(bed2);

            let bed3 = gltf.scene.clone();
            bed3.position.set(5.2, 0, 0.4);
            this.object.add(bed3);

            let bed4 = gltf.scene.clone();
            bed4.position.set(5.2, 0, 1.55);
            this.object.add(bed4);
        }
        );

        loaderGLTF.load('./models/hospital_bed/scene.gltf', (gltf) => {
            this.hospitalBed = gltf.scene;
            this.hospitalBed.scale.set(0.18, 0.3, 0.18);
            this.hospitalBed.position.set(5.6, 0, -2.1);
            this.object.add(this.hospitalBed);

            let hospitalBed2 = gltf.scene.clone();
            hospitalBed2.position.set(5.6, 0, -0.85);
            this.object.add(hospitalBed2);

            let hospitalBed3 = gltf.scene.clone();
            hospitalBed3.position.set(5.6, 0, 0.4);
            this.object.add(hospitalBed3);

            let hospitalBed4 = gltf.scene.clone();
            hospitalBed4.position.set(5.6, 0, 1.55);
            this.object.add(hospitalBed4);
        }
        );

        loaderGLTF.load('./models/gourney_-_hospital_bed/scene.gltf', (gltf) => {
            this.gourney = gltf.scene;
            this.gourney.scale.set(0.115, 0.115, 0.115);
            this.gourney.position.set(4.3, 0.25, -1.7);
            this.object.add(this.gourney);
        }
        );



        //=======================================================================================================
        // Parking lot


        // KOENIGSEGG ONE PRO
        loaderGLTF.load('./models/koenigsegg_one_pro/scene.gltf', (gltf) => {
            this.kOnePro = gltf.scene;
            this.kOnePro.scale.set(4, 5.5, 4);
            this.kOnePro.position.set(8, 0, 1);
            this.kOnePro.rotateY(Math.PI / 2);
            this.object.add(this.kOnePro);
            //this.kOnePro.visible = false;
        }
        );

        loaderGLTF.load('./models/aventador_svj_black-ghosttm/scene.gltf', (gltf) => {
            this.aventador = gltf.scene;
            this.aventador.scale.set(0.3, 0.4, 0.3);
            this.aventador.position.set(8, 0, 2);
            this.aventador.rotateY(Math.PI / 2);
            this.object.add(this.aventador);
        }
        );

        loaderGLTF.load('./models/ac_-_mclaren_p1_free/scene.gltf', (gltf) => {
            this.mclaren = gltf.scene;
            this.mclaren.scale.set(0.27, 0.34, 0.27);
            this.mclaren.position.set(8, 0, 3);
            this.mclaren.rotateY(Math.PI / 2);
            this.object.add(this.mclaren);
        }
        );

        loaderGLTF.load('./models/suzuki_gsx_750_bike_3d_model/scene.gltf', (gltf) => {
            this.suzuki = gltf.scene;
            this.suzuki.scale.set(0.3, 0.3, 0.3);
            this.suzuki.position.set(8, 0, 4);
            this.suzuki.rotateY(3 * Math.PI / 2);
            this.object.add(this.suzuki);
        }
        );

        loaderGLTF.load('./models/japanese_parking_machine/scene.gltf', (gltf) => {
            this.parkingMachine = gltf.scene;
            this.parkingMachine.scale.set(0.008, 0.008, 0.008);
            this.parkingMachine.position.set(7.15, 0, 5);
            this.parkingMachine.rotateY(Math.PI / 2);
            this.object.add(this.parkingMachine);
        }
        );

        loaderGLTF.load('./models/concrete_road_barrier_photoscanned/scene.gltf', (gltf) => {
            this.roadBarrier = gltf.scene;
            this.roadBarrier.scale.set(0.5, 0.5, 0.5);
            this.roadBarrier.position.set(8, 0, 0);
            this.roadBarrier.rotateY(Math.PI / 2);
            this.object.add(this.roadBarrier);

            let roadBarrier2 = gltf.scene.clone();
            roadBarrier2.position.set(9, 0, 0);
            this.object.add(roadBarrier2);

            let roadBarrier3 = gltf.scene.clone();
            roadBarrier3.position.set(10, 0, 0);
            this.object.add(roadBarrier3);
        }
        );

        loaderGLTF.load('./models/ambulance/scene.gltf', (gltf) => {
            this.ambulance = gltf.scene;
            this.ambulance.scale.set(0.3, 0.45, 0.3);
            this.ambulance.position.set(8.2, 0, -1);
            this.ambulance.rotateY(Math.PI / 2);
            this.object.add(this.ambulance);

            let ambulance2 = gltf.scene.clone();
            ambulance2.position.set(8.2, 0, -2);
            this.object.add(ambulance2);

        }
        );


        //=======================================================================================================
        // Consultório

        loaderGLTF.load('./models/table/scene.gltf', (gltf) => {
            this.tableC = gltf.scene;
            this.tableC.scale.set(0.65, 0.8, 0.75);
            this.tableC.position.set(-7.44, 0.39, -4.73);
            this.object.add(this.tableC);

            let tableC2 = gltf.scene.clone();
            tableC2.position.set(-7.44, 0.39, 4.73);
            this.object.add(tableC2);

            let tableC3 = gltf.scene.clone();
            tableC3.position.set(-5.44, 0.39, -4.73);
            this.object.add(tableC3);
            
            let tableC4 = gltf.scene.clone();
            tableC4.position.set(-5.44, 0.39, 4.73);
            this.object.add(tableC4);
            
            let tableC5 = gltf.scene.clone();
            tableC5.position.set(-3.44, 0.39, -4.73);
            this.object.add(tableC5);

            let tableC6 = gltf.scene.clone();
            tableC6.position.set(-3.44, 0.39, 4.73);
            this.object.add(tableC6);
        }
        );

        loaderGLTF.load('./models/retro_computer_setup_free/scene.gltf', (gltf) => {
            this.computerC = gltf.scene;
            this.computerC.scale.set(0.005, 0.005, 0.004);
            this.computerC.position.set(-7.6, 0.42, -4.8);
            this.computerC.rotateY(Math.PI);
            this.object.add(this.computerC);

            let computerC2 = gltf.scene.clone();
            computerC2.position.set(-7.6, 0.42, 4.8);
            computerC2.rotateY(Math.PI);
            this.object.add(computerC2);

            let computerC3 = gltf.scene.clone();
            computerC3.position.set(-5.6, 0.42, -4.8);
            this.object.add(computerC3);

            let computerC4 = gltf.scene.clone();
            computerC4.position.set(-5.6, 0.42, 4.8);
            computerC4.rotateY(Math.PI);
            this.object.add(computerC4);

            let computerC5 = gltf.scene.clone();
            computerC5.position.set(-3.6, 0.42, -4.8);
            this.object.add(computerC5);

            let computerC6 = gltf.scene.clone();
            computerC6.position.set(-3.6, 0.42, 4.8);
            computerC6.rotateY(Math.PI);
            this.object.add(computerC6);
        }
        );

        loaderGLTF.load('./models/ikea_markus_office_chair/scene.gltf', (gltf) => {
            this.chairC = gltf.scene;
            this.chairC.scale.set(0.0045, 0.0055, 0.0045);
            this.chairC.position.set(-7.55, 0, -5);
            this.object.add(this.chairC);

            let chairC2 = gltf.scene.clone();
            chairC2.position.set(-7.55, 0, 5);
            chairC2.rotateY(Math.PI);
            this.object.add(chairC2);

            let chairC3 = gltf.scene.clone();
            chairC3.position.set(-5.55, 0, -5);
            this.object.add(chairC3);

            let chairC4 = gltf.scene.clone();
            chairC4.position.set(-5.55, 0, 5);
            chairC4.rotateY(Math.PI);
            this.object.add(chairC4);

            let chairC5 = gltf.scene.clone();
            chairC5.position.set(-3.55, 0, -5);
            this.object.add(chairC5);

            let chairC6 = gltf.scene.clone();
            chairC6.position.set(-3.55, 0, 5);
            chairC6.rotateY(Math.PI);
            this.object.add(chairC6);
        }
        );

        loaderGLTF.load('./models/chair/scene.gltf', (gltf) => {
            this.patientChair = gltf.scene;
            this.patientChair.scale.set(0.39, 0.45, 0.39);
            this.patientChair.position.set(-7.7, 0.01, -4.4);
            this.patientChair.rotateY(Math.PI);
            this.object.add(this.patientChair);

            let patientChair2 = gltf.scene.clone();
            patientChair2.position.set(-7.3, 0.01, -4.4);
            this.object.add(patientChair2);

            let patientChair3 = gltf.scene.clone();
            patientChair3.position.set(-7.7, 0.01, 4.4);
            patientChair3.rotateY(Math.PI);
            this.object.add(patientChair3);

            let patientChair4 = gltf.scene.clone();
            patientChair4.position.set(-7.3, 0.01, 4.4);
            patientChair4.rotateY(Math.PI);
            this.object.add(patientChair4);

            let patientChair5 = gltf.scene.clone();
            patientChair5.position.set(-5.7, 0.01, -4.4);
            this.object.add(patientChair5);

            let patientChair6 = gltf.scene.clone();
            patientChair6.position.set(-5.3, 0.01, -4.4);
            this.object.add(patientChair6);

            let patientChair7 = gltf.scene.clone();
            patientChair7.position.set(-5.7, 0.01, 4.4);
            patientChair7.rotateY(Math.PI);
            this.object.add(patientChair7);

            let patientChair8 = gltf.scene.clone();
            patientChair8.position.set(-5.3, 0.01, 4.4);
            patientChair8.rotateY(Math.PI);
            this.object.add(patientChair8);

            let patientChair9 = gltf.scene.clone();
            patientChair9.position.set(-3.7, 0.01, -4.4);
            this.object.add(patientChair9);

            let patientChair10 = gltf.scene.clone();
            patientChair10.position.set(-3.3, 0.01, -4.4);
            this.object.add(patientChair10);

            let patientChair11 = gltf.scene.clone();
            patientChair11.position.set(-3.7, 0.01, 4.4);
            patientChair11.rotateY(Math.PI);
            this.object.add(patientChair11);

            let patientChair12 = gltf.scene.clone();
            patientChair12.position.set(-3.3, 0.01, 4.4);
            patientChair12.rotateY(Math.PI);
            this.object.add(patientChair12);
        }
        );

        loaderGLTF.load('./models/office_filing_cabinet_free/scene.gltf', (gltf) => {
            this.cabinet = gltf.scene;
            this.cabinet.scale.set(0.11, 0.13, 0.12);
            this.cabinet.position.set(-7, 0.2, -5.33);
            this.object.add(this.cabinet);

            let cabinet2 = gltf.scene.clone();
            cabinet2.position.set(-7, 0.2, 5.33);
            cabinet2.rotateY(Math.PI);
            this.object.add(cabinet2);

            let cabinet3 = gltf.scene.clone();
            cabinet3.position.set(-5, 0.2, -5.33);
            this.object.add(cabinet3);

            let cabinet4 = gltf.scene.clone();
            cabinet4.position.set(-5, 0.2, 5.33);
            cabinet4.rotateY(Math.PI);
            this.object.add(cabinet4);

            let cabinet5 = gltf.scene.clone();
            cabinet5.position.set(-3, 0.2, -5.33);
            this.object.add(cabinet5);

            let cabinet6 = gltf.scene.clone();
            cabinet6.position.set(-3, 0.2, 5.33);
            cabinet6.rotateY(Math.PI);
            this.object.add(cabinet6);
        }
        );

        loaderGLTF.load('./models/hospital_bed_patient/scene.gltf', (gltf) => {
            this.hospitalBedC = gltf.scene;
            this.hospitalBedC.scale.set(0.5, 0.5, 0.5);
            this.hospitalBedC.position.set(-6.25, 0, -4.8);
            this.hospitalBedC.rotateY(Math.PI / 2);
            this.object.add(this.hospitalBedC);

            let hospitalBedC2 = gltf.scene.clone();
            hospitalBedC2.position.set(-6.25, 0, 4.8);
            hospitalBedC2.rotateY(Math.PI);
            this.object.add(hospitalBedC2);

            let hospitalBedC3 = gltf.scene.clone();
            hospitalBedC3.position.set(-4.25, 0, -4.8);
            this.object.add(hospitalBedC3);

            let hospitalBedC4 = gltf.scene.clone();
            hospitalBedC4.position.set(-4.25, 0, 4.8);
            hospitalBedC4.rotateY(Math.PI);
            this.object.add(hospitalBedC4);

            let hospitalBedC5 = gltf.scene.clone();
            hospitalBedC5.position.set(-2.25, 0, -4.8);
            this.object.add(hospitalBedC5);

            let hospitalBedC6 = gltf.scene.clone();
            hospitalBedC6.position.set(-2.25, 0, 4.8);
            hospitalBedC6.rotateY(Math.PI);
            this.object.add(hospitalBedC6);
        }
        );

    
        //=======================================================================================================
        // Surgery room

        loaderGLTF.load('./models/surgical__instrument_table_collection/scene.gltf', (gltf) => {
            this.surgicalInstruments = gltf.scene;
            this.surgicalInstruments.scale.set(0.4, 0.5, 0.4);
            this.surgicalInstruments.position.set(-0.9, 0, -0.8);
            this.surgicalInstruments.rotateY(Math.PI / 2);
            this.object.add(this.surgicalInstruments);

            let surgicalInstruments2 = gltf.scene.clone();
            surgicalInstruments2.position.set(-0.9, 0, 0.8);
            surgicalInstruments2.rotateY(Math.PI);
            this.object.add(surgicalInstruments2);

            let surgicalInstruments3 = gltf.scene.clone();
            surgicalInstruments3.position.set(3.1, 0, -0.8);
            this.object.add(surgicalInstruments3);

            let surgicalInstruments4 = gltf.scene.clone();
            surgicalInstruments4.position.set(3.1, 0, 0.8);
            surgicalInstruments4.rotateY(Math.PI);
            this.object.add(surgicalInstruments4);

            let surgicalInstruments5 = gltf.scene.clone();
            surgicalInstruments5.scale.set(0.3, 0.5, 0.3);
            surgicalInstruments5.position.set(1, 0, -5.35);
            this.object.add(surgicalInstruments5);

            let surgicalInstruments6 = gltf.scene.clone();
            surgicalInstruments6.scale.set(0.3, 0.5, 0.3);
            surgicalInstruments6.position.set(1, 0, 5.35);
            surgicalInstruments6.rotateY(Math.PI);
            this.object.add(surgicalInstruments6);

            let surgicalInstruments7 = gltf.scene.clone();
            surgicalInstruments7.scale.set(0.3, 0.5, 0.3);
            surgicalInstruments7.position.set(3, 0, -5.35);
            this.object.add(surgicalInstruments7);

            let surgicalInstruments8 = gltf.scene.clone();
            surgicalInstruments8.scale.set(0.3, 0.5, 0.3);
            surgicalInstruments8.position.set(3, 0, 5.35);
            surgicalInstruments8.rotateY(Math.PI);
            this.object.add(surgicalInstruments8);

            let surgicalInstruments9 = gltf.scene.clone();
            surgicalInstruments9.scale.set(0.3, 0.5, 0.3);
            surgicalInstruments9.position.set(5, 0, -5.35);
            this.object.add(surgicalInstruments9);

            let surgicalInstruments10 = gltf.scene.clone();
            surgicalInstruments10.scale.set(0.3, 0.5, 0.3);
            surgicalInstruments10.position.set(5, 0, 5.35);
            surgicalInstruments10.rotateY(Math.PI);
            this.object.add(surgicalInstruments10);
        }
        );

        loaderGLTF.load('./models/surgical_bed/scene.gltf', (gltf) => {
            this.surgicalBed = gltf.scene;
            this.surgicalBed.scale.set(0.5, 0.57, 0.5);
            this.surgicalBed.position.set(-2.7, 0, -4.2);
            this.object.add(this.surgicalBed);

            let surgicalBed2 = gltf.scene.clone();
            surgicalBed2.position.set(-2.7, 0, -1);
            this.object.add(surgicalBed2);

            let surgicalBed3 = gltf.scene.clone();
            surgicalBed3.position.set(1.3, 0, -4.2);
            this.object.add(surgicalBed3);

            let surgicalBed4 = gltf.scene.clone();
            surgicalBed4.position.set(1.3, 0, -1);
            this.object.add(surgicalBed4);

            let surgicalBed5 = gltf.scene.clone();
            surgicalBed5.position.set(-0.5, 0, -7.2);
            this.object.add(surgicalBed5);

            let surgicalBed6 = gltf.scene.clone();
            surgicalBed6.position.set(-0.5, 0, 2);
            this.object.add(surgicalBed6);

            let surgicalBed7 = gltf.scene.clone();
            surgicalBed7.position.set(1.5, 0, -7.2);
            this.object.add(surgicalBed7);

            let surgicalBed8 = gltf.scene.clone();
            surgicalBed8.position.set(1.5, 0, 2);
            this.object.add(surgicalBed8);

            let surgicalBed9 = gltf.scene.clone();
            surgicalBed9.position.set(3.5, 0, -7.2);
            this.object.add(surgicalBed9);

            let surgicalBed10 = gltf.scene.clone();
            surgicalBed10.position.set(3.5, 0, 2);
            this.object.add(surgicalBed10);
        }
        );

        loaderGLTF.load('./models/doctors_office_-_assets/scene.gltf', (gltf) => {
            this.doctorsOffice = gltf.scene;
            this.doctorsOffice.scale.set(0.5, 0.5, 0.5);
            this.doctorsOffice.position.set(-2.3, 0, -2.2);
            this.doctorsOffice.rotateY(3 * Math.PI / 2);
            this.object.add(this.doctorsOffice);

            let doctorsOffice2 = gltf.scene.clone();
            doctorsOffice2.position.set(-2.3, 0, 2.2);
            doctorsOffice2.rotateY(Math.PI);
            this.object.add(doctorsOffice2);

            let doctorsOffice3 = gltf.scene.clone();
            doctorsOffice3.position.set(1.7, 0, -2.2);
            this.object.add(doctorsOffice3);

            let doctorsOffice4 = gltf.scene.clone();
            doctorsOffice4.position.set(1.7, 0, 2.2);
            doctorsOffice4.rotateY(Math.PI);
            this.object.add(doctorsOffice4);
        }
        );

        loaderGLTF.load('./models/simple_studio_light/scene.gltf', (gltf) => {
            this.light = gltf.scene;
            this.light.scale.set(0.5, 0.45, 0.5);
            this.light.position.set(-0.3, 0, -2.2);
            this.light.rotateY(7 * Math.PI / 4);
            this.object.add(this.light);

            let light2 = gltf.scene.clone();
            light2.position.set(-0.3, 0, 2.2);
            light2.rotateY(3 * Math.PI / 2);
            this.object.add(light2);

            let light3 = gltf.scene.clone();
            light3.position.set(3.7, 0, -2.2);
            this.object.add(light3);

            let light4 = gltf.scene.clone();
            light4.position.set(3.7, 0, 2.2);
            light4.rotateY(3 * Math.PI / 2);
            this.object.add(light4);

            let light5 = gltf.scene.clone();
            light5.position.set(1.7, 0, -3.8);
            light5.rotateY(7 * Math.PI / 5);
            this.object.add(light5);

            let light6 = gltf.scene.clone();
            light6.position.set(1.7, 0, 3.8);
            light6.rotateY(11 * Math.PI / 5);
            this.object.add(light6);

            let light7 = gltf.scene.clone();
            light7.position.set(3.7, 0, -3.8);
            light7.rotateY(7 * Math.PI / 5);
            this.object.add(light7);

            let light8 = gltf.scene.clone();
            light8.position.set(3.7, 0, 3.8);
            light8.rotateY(11 * Math.PI / 5);
            this.object.add(light8);

            let light9 = gltf.scene.clone();
            light9.position.set(5.7, 0, -3.8);
            light9.rotateY(7 * Math.PI / 5);
            this.object.add(light9);

            let light10 = gltf.scene.clone();
            light10.position.set(5.7, 0, 3.8);
            light10.rotateY(11 * Math.PI / 5);
            this.object.add(light10);
            
        }
        );

        //=======================================================================================================
        // PATIENT

        loaderGLTF.load('./models/patient/scene.gltf', (gltf) => {
            this.patient = gltf.scene;
            this.patient.scale.set(0.16, 0.16, 0.16);
            this.patient.position.set(-1.565, 0.6, -1.6);
            this.patient.rotateY(3 * Math.PI / 2);
            this.patient.rotateX(3 * Math.PI / 2);
            this.object.add(this.patient);

            let patient2 = gltf.scene.clone();
            patient2.position.set(-1.565, 0.6, 1.6);
            this.object.add(patient2);

            let patient3 = gltf.scene.clone();
            patient3.position.set(2.425, 0.6, -1.6);
            this.object.add(patient3);

            let patient4 = gltf.scene.clone();
            patient4.position.set(2.425, 0.6, 1.6);
            this.object.add(patient4);

            let patient5 = gltf.scene.clone();
            patient5.position.set(0.63, 0.6, -4.6);
            this.object.add(patient5);

            let patient6 = gltf.scene.clone();
            patient6.position.set(0.63, 0.6, 4.6);
            this.object.add(patient6);

            let patient7 = gltf.scene.clone();
            patient7.position.set(2.63, 0.6, -4.6);
            this.object.add(patient7);

            let patient8 = gltf.scene.clone();
            patient8.position.set(2.63, 0.6, 4.6);
            this.object.add(patient8);

            let patient9 = gltf.scene.clone();
            patient9.position.set(4.63, 0.6, -4.6);
            this.object.add(patient9);

            let patient10 = gltf.scene.clone();
            patient10.position.set(4.63, 0.6, 4.6);
            this.object.add(patient10);
        }
        );



        //=======================================================================================================
        // CRISTIANO RONALDO
        
        loaderGLTF.load('./models/3d_rigged_cristiano_ronaldo_al_nassr/scene.gltf', (gltf) => {
            this.cr = gltf.scene;
            this.cr.scale.set(0.01, 0.013, 0.01);
            this.cr.position.set(-1.45, 0.6, -1.59);
            this.cr.rotateY(3 * Math.PI / 2);
            this.cr.rotateX(3 * Math.PI / 2);
            this.object.add(this.cr);

            let cr2 = gltf.scene.clone();
            cr2.position.set(-1.45, 0.6, 1.59);
            cr2.rotateY(Math.PI);
            cr2.rotateX(3 * Math.PI / 2);
            this.object.add(cr2);
        }
        );
*/
        //=======================================================================================================
        // Create a ground

        loaderGLTF.load('./models/cobblestone_ground_-_lowpoly/scene.gltf', (gltf) => {
            this.cobblestone = gltf.scene;
            this.cobblestone.scale.set(1, 0.05, 1.65);
            this.cobblestone.position.set(9, 0, 0.085);
            this.object.add(this.cobblestone);

            let cobblestone2 = gltf.scene.clone();
            cobblestone2.scale.set(0.25, 0.05, 0.765);
            cobblestone2.position.set(4.02, 0, -6);
            cobblestone2.rotateY(Math.PI / 2);
            this.object.add(cobblestone2);

            let cobblestone3 = gltf.scene.clone();
            cobblestone3.scale.set(0.25, 0.05, 0.765);
            cobblestone3.position.set(-2.04, 0, -6);
            cobblestone3.rotateY(Math.PI / 2);
            this.object.add(cobblestone3);

            let cobblestone4 = gltf.scene.clone();
            cobblestone4.scale.set(0.25, 0.05, 0.765);
            cobblestone4.position.set(-8.102, 0, -6);
            cobblestone4.rotateY(Math.PI / 2);
            this.object.add(cobblestone4);

            let cobblestone5 = gltf.scene.clone();
            cobblestone5.scale.set(0.25, 0.05, 0.765);
            cobblestone5.position.set(4.02, 0, 6);
            cobblestone5.rotateY(Math.PI / 2);
            this.object.add(cobblestone5);

            let cobblestone6 = gltf.scene.clone();
            cobblestone6.scale.set(0.25, 0.05, 0.765);
            cobblestone6.position.set(-2.04, 0, 6);
            cobblestone6.rotateY(Math.PI / 2);
            this.object.add(cobblestone6);

            let cobblestone7 = gltf.scene.clone();
            cobblestone7.scale.set(0.25, 0.05, 0.765);
            cobblestone7.position.set(-8.102, 0, 6);
            cobblestone7.rotateY(Math.PI / 2);
            this.object.add(cobblestone7);

            let cobblestone8 = gltf.scene.clone();
            cobblestone8.scale.set(0.3, 0.05, 0.7);
            cobblestone8.position.set(-10.605, 0, -2.68);
            this.object.add(cobblestone8);

            let cobblestone9 = gltf.scene.clone();
            cobblestone9.scale.set(0.3, 0.05, 0.6895);
            cobblestone9.position.set(-10.605, 0, 2.818);
            this.object.add(cobblestone9);
           
        }
        );

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
