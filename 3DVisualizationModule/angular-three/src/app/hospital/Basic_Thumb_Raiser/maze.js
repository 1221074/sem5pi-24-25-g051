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
            this.surgicalBeds = description.surgicalBeds;
            this.exitSigns = description.exitSigns;
            this.keypads = description.keypads;
            this.staffDoors = description.staffDoors;
            this.entranceDoors = description.entranceDoors;
            this.toiletDoors = description.toiletDoors;
            this.surgeryDoors = description.surgeryDoors;
            this.screeningDoors = description.screeningDoors;
            this.cobblestoneGround = description.cobblestoneGround;
            this.studioLights = description.studioLights;
            this.doctorsOffices = description.doctorsOffices;
            this.surgicalInstrumentModels = description.surgicalInstrumentModels;
            this.hospitalBedModels = description.hospitalBedModels;
            this.cabinetModels = description.cabinetModels;
            this.chairModels = description.chairModels;
            this.chairCModels = description.chairCModels;
            this.computerCModels = description.computerCModels;
            this.tableCModels = description.tableCModels;
            this.ambulanceModels = description.ambulanceModels;
            this.roadBarrierModels = description.roadBarrierModels;
            this.parkingMachineModels = description.parkingMachineModels;
            this.suzukiModels = description.suzukiModels;
            this.mclarenModels = description.mclarenModels;
            this.aventadorModels = description.aventadorModels;
            this.kOneProModels = description.kOneProModels;
            this.gourneyModels = description.gourneyModels;
            this.hospitalBedroomBedModels = description.hospitalBedroomBedModels;
            this.bedData = description.bedData;
            this.coffeeData = description.coffeeData;
            this.mugData = description.mugData;
            this.smallTableData = description.smallTableData;
            this.cafeTableData = description.cafeTableData;
            this.ovenData = description.ovenData;
            this.sinkData = description.sinkData;
            this.stoveData = description.stoveData;
            this.fridgeData = description.fridgeData;
            this.trayData = description.trayData;
            this.buffetData = description.buffetData;
            this.extingData = description.extingData;
            this.extingDataCaf = description.extingDataCaf;
            this.fireAlarmModels = description.fireAlarmModels;
            this.fireAlarmCafModels = description.fireAlarmCafModels;
            this.securityCameraModels = description.securityCameraModels;
            this.securityCameraRecModels = description.securityCameraRecModels;
            this.broomModels = description.broomModels;
            this.cleaningCartModels = description.cleaningCartModels;
            this.schoolLockerModels = description.schoolLockerModels;
            this.printerModels = description.printerModels;
            this.serverModels = description.serverModels;
            this.computerStaffModels = description.computerStaffModels;
            this.tableModels = description.tableModels;
            this.cubicleModels = description.cubicleModels;
            this.urinalModels = description.urinalModels;
            this.dryerModels = description.dryerModels;
            this.mirrorModels = description.mirrorModels;
            this.sinkModels = description.sinkModels;
            this.toiletPaperModels = description.toiletPaperModels;
            this.toiletRoundModels = description.toiletRoundModels;
            this.receptionChairModels = description.receptionChairModels;
            this.staffChairModels = description.staffChairModels;
            this.receptionPCModels = description.receptionPCModels;
            this.receptionDeskModels = description.receptionDeskModels;
            this.waitingRoomChairs = description.waitingRoomChairs;
            this.receptionChairs = description.receptionChairs;
            this.cristiano = description.cristiano;

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

            // Raycaster

            const raycasterGeometry = new THREE.BoxGeometry(1.5, 0.7, 1);
            const raycasterMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            this.raycaster = new THREE.Mesh(raycasterGeometry, raycasterMaterial);
            this.raycasterArray = [];
            //this.raycaster.position.set(-1, 0.5, -1.65);
            //this.object.add(this.raycaster);

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

        
        //const receptionObjects = [/* lista de objetos da recepção */];
        //const toiletObjects = [/* lista de objetos do banheiro */];
        //const staffObjects = [/* lista de objetos da sala dos funcionários */];
        //const screeningObjects = [/* lista de objetos da sala de triagem */];
        //const kitchenObjects = [/* lista de objetos da cozinha */];
        //const cafeteriaObjects = [/* lista de objetos da cafeteria */];
        //const waitingRoomObjects = [/* lista de objetos da sala de espera */];
        //const surgicalObjects = [/* lista de objetos da sala cirúrgica */];
        //const bedroomObjects = [/* lista de objetos do quarto */];
        //const parkingObjects = [/* lista de objetos do estacionamento */];
        
        this.receptionModels = [];
        this.toiletModels = [];
        this.staffModels = [];
        this.screeningModels = [];
        this.kitchenModels = [];
        this.cafeteriaModels = [];
        this.waitingRoomModels = [];
        this.surgeryRoomModels = [];
        this.bedroomModels = [];
        this.parkingLotModels = [];
        this.cristianoModels = [];
        let bedErrorRaycaster = { x: 1.73, y: 0.5, z: 2.6 };
        this.selectedRoom = null;

        // Create a resource .gltf or .glb file loader
        const loaderGLTF = new GLTFLoader();


        //=======================================================================================================
        // CHAIRS
        // Load the chair model
        loaderGLTF.load('./models/tandem_seating_-_hospital/scene.gltf', (gltf) => {
            const originalChair = gltf.scene;
            originalChair.visible = false;

            // Load reception chairs
            this.receptionChairs.forEach((chairData) => {
                let chairClone = originalChair.clone(true);
                chairClone.scale.set(chairData.scale[0], chairData.scale[1], chairData.scale[2]);
                chairClone.position.set(chairData.position[0], chairData.position[1], chairData.position[2]);
                chairClone.rotateY(chairData.rotationY || 0);
                chairClone.visible = false;
                this.object.add(chairClone);
                this.receptionModels.push(chairClone);
            });

            // Load waiting room 1 chairs
            this.waitingRoomChairs.forEach((chairData) => {
                let chairClone = originalChair.clone(true);
                chairClone.scale.set(chairData.scale[0], chairData.scale[1], chairData.scale[2]);
                chairClone.position.set(chairData.position[0], chairData.position[1], chairData.position[2]);
                chairClone.rotateY(chairData.rotationY || 0);
                chairClone.visible = false;
                this.object.add(chairClone);
                this.waitingRoomModels.push(chairClone);
            });
        });

/*
        //=======================================================================================================
        // Reception desk
        loaderGLTF.load('./models/reception_desk/scene.gltf', (gltf) => {
            const deskModel = gltf.scene;
            deskModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the receptionDeskModels array to create each instance.
            this.receptionDeskModels.forEach((deskData) => {
                let deskClone = deskModel.clone(true); // Clone the original desk model
                deskClone.scale.set(deskData.scale[0], deskData.scale[1], deskData.scale[2]);
                deskClone.position.set(deskData.position[0], deskData.position[1], deskData.position[2]);
                deskClone.rotateY(deskData.rotationY || 0); // Apply rotation if provided
                deskClone.visible = false; // Set visibility to false initially
                this.object.add(deskClone);
        
                // Add to the reception models array
                this.receptionModels.push(deskClone);
            });
        });
        

        //=======================================================================================================
        loaderGLTF.load('./models/imac_computer/scene.gltf', (gltf) => {
            const pcModel = gltf.scene;
            pcModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the receptionPCModels array to create each instance.
            this.receptionPCModels.forEach((pcData) => {
                let pcClone = pcModel.clone(true); // Clone the original pc model
                pcClone.scale.set(pcData.scale[0], pcData.scale[1], pcData.scale[2]);
                pcClone.position.set(pcData.position[0], pcData.position[1], pcData.position[2]);
                pcClone.rotateY(pcData.rotationY || 0); // Apply rotation if provided
                pcClone.visible = false; // Set visibility to false initially
                this.object.add(pcClone);
        
                // Add to the reception models array
                this.receptionModels.push(pcClone);
            });
        });
        

        //=======================================================================================================
        // Reception chair
        loaderGLTF.load('./models/ikea_markus_office_chair/scene.gltf', (gltf) => {
            const chairModel = gltf.scene;
            chairModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the receptionChairModels array to create each instance.
            this.receptionChairModels.forEach((chairData) => {
                let chairClone = chairModel.clone(true); // Clone the original chair model
                chairClone.scale.set(chairData.scale[0], chairData.scale[1], chairData.scale[2]);
                chairClone.position.set(chairData.position[0], chairData.position[1], chairData.position[2]);
                chairClone.rotateY(chairData.rotationY || 0); // Apply rotation if provided
                chairClone.visible = false; // Set visibility to false initially
                this.object.add(chairClone);
        
                // Add to the reception models array
                this.receptionModels.push(chairClone);
            });

            this.staffChairModels.forEach((chairData) => {
                let chairClone = chairModel.clone(true); // Clone the original chair model
                chairClone.scale.set(chairData.scale[0], chairData.scale[1], chairData.scale[2]);
                chairClone.position.set(chairData.position[0], chairData.position[1], chairData.position[2]);
                chairClone.rotateY(chairData.rotationY || 0); // Apply rotation if provided
                chairClone.visible = false; // Set visibility to false initially
                this.object.add(chairClone);
        
                // Add to the reception models array
                this.staffModels.push(chairClone);
            });
        });        


        //=======================================================================================================
        // Toilet
        loaderGLTF.load('./models/toilet/scene.gltf', (gltf) => {
            const toiletModel = gltf.scene;
            toiletModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the toiletModels array to create each instance.
            this.toiletRoundModels.forEach((toiletData) => {
                let toiletClone = toiletModel.clone(true); // Clone the original toilet model
                toiletClone.scale.set(toiletData.scale[0], toiletData.scale[1], toiletData.scale[2]);
                toiletClone.position.set(toiletData.position[0], toiletData.position[1], toiletData.position[2]);
                toiletClone.rotateY(toiletData.rotationY || 0); // Apply rotation if provided
                toiletClone.visible = false; // Set visibility to false initially
                this.object.add(toiletClone);
        
                // Add to the toilet models array
                this.toiletModels.push(toiletClone);
            });
        });
        

        loaderGLTF.load('./models/toilet_paper_holder/scene.gltf', (gltf) => {
            const toiletPaperModel = gltf.scene;
            toiletPaperModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the toiletPaperModels array to create each instance.
            this.toiletPaperModels.forEach((toiletPaperData) => {
                let toiletPaperClone = toiletPaperModel.clone(true); // Clone the original toilet paper holder model
                toiletPaperClone.scale.set(toiletPaperData.scale[0], toiletPaperData.scale[1], toiletPaperData.scale[2]);
                toiletPaperClone.position.set(toiletPaperData.position[0], toiletPaperData.position[1], toiletPaperData.position[2]);
                toiletPaperClone.rotateY(toiletPaperData.rotationY || 0); // Apply rotation if provided
                toiletPaperClone.visible = false; // Set visibility to false initially
                this.object.add(toiletPaperClone);
        
                // Add to the toilet models array
                this.toiletModels.push(toiletPaperClone);
            });
        });
        

        loaderGLTF.load('./models/sink/scene.gltf', (gltf) => {
            const sinkModel = gltf.scene;
            sinkModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the sinkModels array to create each instance.
            this.sinkModels.forEach((sinkData) => {
                let sinkClone = sinkModel.clone(true); // Clone the original sink model
                sinkClone.scale.set(sinkData.scale[0], sinkData.scale[1], sinkData.scale[2]);
                sinkClone.position.set(sinkData.position[0], sinkData.position[1], sinkData.position[2]);
                sinkClone.rotateY(sinkData.rotationY || 0); // Apply rotation if provided
                sinkClone.visible = false; // Set visibility to false initially
                this.object.add(sinkClone);
        
                // Add to the toilet models array
                this.toiletModels.push(sinkClone);
            });
        });
        
        loaderGLTF.load('./models/ornate_mirror_01_1k.gltf/ornate_mirror_01_1k.gltf', (gltf) => {
            const mirrorModel = gltf.scene;
            mirrorModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the mirrorModels array to create each instance.
            this.mirrorModels.forEach((mirrorData) => {
                let mirrorClone = mirrorModel.clone(true); // Clone the original mirror model
                mirrorClone.scale.set(mirrorData.scale[0], mirrorData.scale[1], mirrorData.scale[2]);
                mirrorClone.position.set(mirrorData.position[0], mirrorData.position[1], mirrorData.position[2]);
                mirrorClone.rotateY(mirrorData.rotationY || 0); // Apply rotation if provided
                mirrorClone.visible = false; // Set visibility to false initially
                this.object.add(mirrorClone);
        
                // Add to the toilet models array
                this.toiletModels.push(mirrorClone);
            });
        });        

        loaderGLTF.load('./models/hand_dryer_clean/scene.gltf', (gltf) => {
            const dryerModel = gltf.scene;
            dryerModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the dryerModels array to create each instance.
            this.dryerModels.forEach((dryerData) => {
                let dryerClone = dryerModel.clone(true); // Clone the original dryer model
                dryerClone.scale.set(dryerData.scale[0], dryerData.scale[1], dryerData.scale[2]);
                dryerClone.position.set(dryerData.position[0], dryerData.position[1], dryerData.position[2]);
                dryerClone.rotateY(dryerData.rotationY || 0); // Apply rotation if provided
                dryerClone.visible = false; // Set visibility to false initially
                this.object.add(dryerClone);
        
                // Add to the toilet models array
                this.toiletModels.push(dryerClone);
            });
        });        


        loaderGLTF.load('./models/free_urinal__commercial_urinal_realistic/scene.gltf', (gltf) => {
            const urinalModel = gltf.scene;
            urinalModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the urinalModels array to create each instance.
            this.urinalModels.forEach((urinalData) => {
                let urinalClone = urinalModel.clone(true); // Clone the original urinal model
                urinalClone.scale.set(urinalData.scale[0], urinalData.scale[1], urinalData.scale[2]);
                urinalClone.position.set(urinalData.position[0], urinalData.position[1], urinalData.position[2]);
                urinalClone.rotateY(urinalData.rotationY || 0); // Apply rotation if provided
                urinalClone.visible = false; // Set visibility to false initially
                this.object.add(urinalClone);
        
                // Add to the toilet models array
                this.toiletModels.push(urinalClone);
            });
        });
        

        loaderGLTF.load('./models/cubicle_without_toilet/scene.gltf', (gltf) => {
            const cubicleModel = gltf.scene;
            cubicleModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the cubicleModels array to create each instance.
            this.cubicleModels.forEach((cubicleData) => {
                let cubicleClone = cubicleModel.clone(true); // Clone the original cubicle model
                cubicleClone.scale.set(cubicleData.scale[0], cubicleData.scale[1], cubicleData.scale[2]);
                cubicleClone.position.set(cubicleData.position[0], cubicleData.position[1], cubicleData.position[2]);
                cubicleClone.rotateY(cubicleData.rotationY || 0); // Apply rotation if provided
                cubicleClone.visible = false; // Set visibility to false initially
                this.object.add(cubicleClone);
        
                // Add to the toilet models array
                this.toiletModels.push(cubicleClone);
            });
        });
        

        //=======================================================================================================
        // Staff room

        loaderGLTF.load('./models/table/scene.gltf', (gltf) => {
            const tableModel = gltf.scene;
            tableModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the tableModels array to create each instance.
            this.tableModels.forEach((tableData) => {
                let tableClone = tableModel.clone(true); // Clone the original table model
                tableClone.scale.set(tableData.scale[0], tableData.scale[1], tableData.scale[2]);
                tableClone.position.set(tableData.position[0], tableData.position[1], tableData.position[2]);
                tableClone.rotateY(tableData.rotationY || 0); // Apply rotation if provided
                tableClone.visible = false; // Set visibility to false initially
                this.object.add(tableClone);
        
                // Add to the staff models array
                this.staffModels.push(tableClone);
            });
        });
        

        loaderGLTF.load('./models/server_rack/scene.gltf', (gltf) => {
            const serverModel = gltf.scene;
            serverModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the serverModels array to create each instance.
            this.serverModels.forEach((serverData) => {
                let serverClone = serverModel.clone(true); // Clone the original server model
                serverClone.scale.set(serverData.scale[0], serverData.scale[1], serverData.scale[2]);
                serverClone.position.set(serverData.position[0], serverData.position[1], serverData.position[2]);
                serverClone.rotateY(serverData.rotationY || 0); // Apply rotation if provided
                serverClone.visible = false; // Set visibility to false initially
                this.object.add(serverClone);
        
                // Add to the staff models array
                this.staffModels.push(serverClone);
            });
        });
        
        loaderGLTF.load('./models/printer_copy_machine_and_scanner_in_one/scene.gltf', (gltf) => {
            const printerModel = gltf.scene;
            printerModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the printerModels array to create each instance.
            this.printerModels.forEach((printerData) => {
                let printerClone = printerModel.clone(true); // Clone the original printer model
                printerClone.scale.set(printerData.scale[0], printerData.scale[1], printerData.scale[2]);
                printerClone.position.set(printerData.position[0], printerData.position[1], printerData.position[2]);
                printerClone.rotateY(printerData.rotationY || 0); // Apply rotation if provided
                printerClone.visible = false; // Set visibility to false initially
                this.object.add(printerClone);
        
                // Add to the staff models array
                this.staffModels.push(printerClone);
            });
        });
        

        loaderGLTF.load('./models/school_locker/scene.gltf', (gltf) => {
            const lockerModel = gltf.scene;
            lockerModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the schoolLockerModels array to create each instance.
            this.schoolLockerModels.forEach((lockerData) => {
                let lockerClone = lockerModel.clone(true); // Clone the original locker model
                lockerClone.scale.set(lockerData.scale[0], lockerData.scale[1], lockerData.scale[2]);
                lockerClone.position.set(lockerData.position[0], lockerData.position[1], lockerData.position[2]);
                lockerClone.visible = false; // Set visibility to false initially
                this.object.add(lockerClone);
        
                // Add to the staff models array
                this.staffModels.push(lockerClone);
            });
        });
        

        loaderGLTF.load('./models/cleaning_cart/scene.gltf', (gltf) => {
            const cleaningCartModel = gltf.scene;
            cleaningCartModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the cleaningCartModels array to create each instance.
            this.cleaningCartModels.forEach((cartData) => {
                let cartClone = cleaningCartModel.clone(true); // Clone the original cleaning cart model
                cartClone.scale.set(cartData.scale[0], cartData.scale[1], cartData.scale[2]);
                cartClone.position.set(cartData.position[0], cartData.position[1], cartData.position[2]);
                cartClone.rotateY(cartData.rotationY || 0); // Apply rotation if provided
                cartClone.visible = false; // Set visibility to false
                this.object.add(cartClone);
        
                // Add to the staff models array
                this.staffModels.push(cartClone);
            });
        });
        

        loaderGLTF.load('./models/broom/scene.gltf', (gltf) => {
            const broomModel = gltf.scene;
            broomModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the broomModels array to create each instance.
            this.broomModels.forEach((broomData) => {
                let broomClone = broomModel.clone(true); // Clone the original broom model
                broomClone.scale.set(broomData.scale[0], broomData.scale[1], broomData.scale[2]);
                broomClone.position.set(broomData.position[0], broomData.position[1], broomData.position[2]);
                broomClone.rotateY(broomData.rotationY || 0); // Apply Y rotation if provided
                broomClone.rotateX(broomData.rotationX || 0); // Apply X rotation if provided
                broomClone.visible = false; // Set visibility to false
                this.object.add(broomClone);
        
                // Add to the staff models array
                this.staffModels.push(broomClone);
            });
        });
        

        loaderGLTF.load('./models/security_camera/scene.gltf', (gltf) => {
            const securityCameraModel = gltf.scene;
            securityCameraModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the securityCameraModels array to create each instance.
            this.securityCameraModels.forEach((cameraData) => {
                let securityCameraClone = securityCameraModel.clone(true); // Clone the original camera model
                securityCameraClone.scale.set(cameraData.scale[0], cameraData.scale[1], cameraData.scale[2]);
                securityCameraClone.position.set(cameraData.position[0], cameraData.position[1], cameraData.position[2]);
                securityCameraClone.rotateY(cameraData.rotationY || 0); // Apply rotation if provided
                securityCameraClone.visible = false; // Set visibility to true
                this.object.add(securityCameraClone);
                this.waitingRoomModels.push(securityCameraClone);
            });

            this.securityCameraRecModels.forEach((cameraData) => {
                let securityCameraClone = securityCameraModel.clone(true); // Clone the original camera model
                securityCameraClone.scale.set(cameraData.scale[0], cameraData.scale[1], cameraData.scale[2]);
                securityCameraClone.position.set(cameraData.position[0], cameraData.position[1], cameraData.position[2]);
                securityCameraClone.rotateY(cameraData.rotationY || 0); // Apply rotation if provided
                securityCameraClone.visible = false; // Set visibility to true
                this.object.add(securityCameraClone);
                this.receptionModels.push(securityCameraClone);
            });
        });
        


        loaderGLTF.load('./models/fire_alarm/scene.gltf', (gltf) => {
            const fireAlarmModel = gltf.scene;
            fireAlarmModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the fireAlarmModels array to create each instance.
            this.fireAlarmModels.forEach((alarmData, index) => {
                let fireAlarmClone = fireAlarmModel.clone(true); // Clone the original alarm model
                fireAlarmClone.scale.set(alarmData.scale[0], alarmData.scale[1], alarmData.scale[2]);
                fireAlarmClone.position.set(alarmData.position[0], alarmData.position[1], alarmData.position[2]);
                fireAlarmClone.rotateY(alarmData.rotationY || 0); // Apply rotation if provided
                fireAlarmClone.visible = false; // Set visibility to true
                this.object.add(fireAlarmClone);
                this.receptionModels.push(fireAlarmClone); // Push the alarm model into the receptionModels array
            });

            this.fireAlarmCafModels.forEach((alarmData, index) => {
                let fireAlarmClone = fireAlarmModel.clone(true); // Clone the original alarm model
                fireAlarmClone.scale.set(alarmData.scale[0], alarmData.scale[1], alarmData.scale[2]);
                fireAlarmClone.position.set(alarmData.position[0], alarmData.position[1], alarmData.position[2]);
                fireAlarmClone.rotateY(alarmData.rotationY || 0); // Apply rotation if provided
                fireAlarmClone.visible = false; // Set visibility to true
                this.object.add(fireAlarmClone);
                this.cafeteriaModels.push(fireAlarmClone); // Push the alarm model into the cafeteriaModels array
            });
        });
        

        // Load the GLTF model for the fire extinguisher
        loaderGLTF.load('./models/fire_exting/scene.gltf', (gltf) => {
        const extingModel = gltf.scene;
        extingModel.visible = false; // Hide the original model for cloning.

        // Iterate over the extingData array (from JSON) to create each instance.
        this.extingData.forEach((extingConfig) => {
        let extingClone = extingModel.clone(true); // Clone the original fire extinguisher model
        extingClone.scale.set(extingConfig.scale[0], extingConfig.scale[1], extingConfig.scale[2]);
        extingClone.position.set(extingConfig.position[0], extingConfig.position[1], extingConfig.position[2]);
        extingClone.rotateY(extingConfig.rotationY || 0); // Apply Y-axis rotation if specified
        extingClone.visible = false; // Set visibility to false
        this.object.add(extingClone); // Add the cloned model to the scene
        this.receptionModels.push(extingClone); // Push the extinguisher model into the receptionModels array
        });

        this.extingDataCaf.forEach((extingConfig) => {
            let extingClone = extingModel.clone(true); // Clone the original fire extinguisher model
            extingClone.scale.set(extingConfig.scale[0], extingConfig.scale[1], extingConfig.scale[2]);
            extingClone.position.set(extingConfig.position[0], extingConfig.position[1], extingConfig.position[2]);
            extingClone.rotateY(extingConfig.rotationY || 0); // Apply Y-axis rotation if specified
            extingClone.visible = false; // Set visibility to false
            this.object.add(extingClone); // Add the cloned model to the scene
            this.cafeteriaModels.push(extingClone); // Push the extinguisher model into the receptionModels array
            });
        });



        //=======================================================================================================
        // Cafeteria

        // Load the GLTF model for the buffet table
        loaderGLTF.load('./models/buffet_table/scene.gltf', (gltf) => {
        const buffetModel = gltf.scene;
        buffetModel.visible = false; // Hide the original model for cloning.

        // Iterate over the buffetData array (from JSON) to create each instance.
        this.buffetData.forEach((buffetConfig) => {
        let buffetClone = buffetModel.clone(true); // Clone the original buffet model
        buffetClone.scale.set(buffetConfig.scale[0], buffetConfig.scale[1], buffetConfig.scale[2]);
        buffetClone.position.set(buffetConfig.position[0], buffetConfig.position[1], buffetConfig.position[2]);
        buffetClone.rotateY(buffetConfig.rotationY || 0); // Apply Y-axis rotation if specified
        buffetClone.visible = false; // Set visibility to false
        this.object.add(buffetClone); // Add the cloned model to the scene
        this.cafeteriaModels.push(buffetClone); // Push the buffet model into the cafeteriaModels array
        });
        });


        // Load the GLTF model for the tray
        loaderGLTF.load('./models/buffets_food_warmer_foods_and_plates/scene.gltf', (gltf) => {
        const trayModel = gltf.scene;
        trayModel.visible = false; // Hide the original model for cloning.

        // Iterate over the trayData array (from JSON) to create each instance.
        this.trayData.forEach((trayData) => {
        let trayClone = trayModel.clone(true); // Clone the original tray model
        trayClone.scale.set(trayData.scale[0], trayData.scale[1], trayData.scale[2]);
        trayClone.position.set(trayData.position[0], trayData.position[1], trayData.position[2]);
        trayClone.rotateY(trayData.rotationY || 0); // Apply Y-axis rotation if specified
        trayClone.visible = false; // Set visibility to false
        this.object.add(trayClone); // Add the cloned model to the scene
        this.cafeteriaModels.push(trayClone); // Push the tray model into the cafeteriaModels array
        });
        });


        // Load the GLTF model for the fridge
        loaderGLTF.load('./models/unbranded_conventional_fridge/scene.gltf', (gltf) => {
        const fridgeModel = gltf.scene;
        fridgeModel.visible = false; // Hide the original model for cloning.

        // Iterate over the fridgeData array (from JSON) to create each instance.
        this.fridgeData.forEach((fridgeData) => {
        let fridgeClone = fridgeModel.clone(true); // Clone the original fridge model
        fridgeClone.scale.set(fridgeData.scale[0], fridgeData.scale[1], fridgeData.scale[2]);
        fridgeClone.position.set(fridgeData.position[0], fridgeData.position[1], fridgeData.position[2]);
        fridgeClone.rotateY(fridgeData.rotationY || 0); // Apply Y-axis rotation if specified
        fridgeClone.visible = false; // Set visibility to false
        this.object.add(fridgeClone); // Add the cloned model to the scene
        this.kitchenModels.push(fridgeClone); // Push the fridge model into the kitchenModels array
        });
        });


        loaderGLTF.load('./models/stove_with_hood/scene.gltf', (gltf) => {
            const stoveModel = gltf.scene;
            stoveModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `stoveData` array (from JSON) to create each instance.
            this.stoveData.forEach((stoveData) => {
                let stoveClone = stoveModel.clone(true); // Clone the original stove model
                stoveClone.scale.set(stoveData.scale[0], stoveData.scale[1], stoveData.scale[2]);
                stoveClone.position.set(stoveData.position[0], stoveData.position[1], stoveData.position[2]);
                stoveClone.visible = false; // Set visibility to false
                this.object.add(stoveClone);
                this.kitchenModels.push(stoveClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/kitchen_sink/scene.gltf', (gltf) => {
            const sinkModel = gltf.scene;
            sinkModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `sinkData` array (from JSON) to create each instance.
            this.sinkData.forEach((sinkData) => {
                let sinkClone = sinkModel.clone(true); // Clone the original sink model
                sinkClone.scale.set(sinkData.scale[0], sinkData.scale[1], sinkData.scale[2]);
                sinkClone.position.set(sinkData.position[0], sinkData.position[1], sinkData.position[2]);
                sinkClone.rotateY(sinkData.rotationY); // Apply rotation (if needed)
                sinkClone.visible = false; // Set visibility to false
                this.object.add(sinkClone);
                this.kitchenModels.push(sinkClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/furniture__mobel_-_kuchentisch/scene.gltf', (gltf) => {
            const ovenModel = gltf.scene;
            ovenModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `ovenData` array (from JSON) to create each instance.
            this.ovenData.forEach((ovenData, index) => {
                let ovenClone = ovenModel.clone(true); // Clone the original oven model
                ovenClone.scale.set(ovenData.scale[0], ovenData.scale[1], ovenData.scale[2]);
                ovenClone.position.set(ovenData.position[0], ovenData.position[1], ovenData.position[2]);
                ovenClone.visible = false; // Set visibility to false
                this.object.add(ovenClone);
                this.kitchenModels.push(ovenClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/sm_chair_table/scene.gltf', (gltf) => {
            const cafeTableModel = gltf.scene;
            cafeTableModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `cafeTableData` array (from JSON) to create each instance.
            this.cafeTableData.forEach((tableData, index) => {
                let cafeTableClone = cafeTableModel.clone(true); // Clone the original table model
                cafeTableClone.scale.set(tableData.scale[0], tableData.scale[1], tableData.scale[2]);
                cafeTableClone.position.set(tableData.position[0], tableData.position[1], tableData.position[2]);
                cafeTableClone.visible = false; // Set visibility to false
                this.object.add(cafeTableClone);
                this.cafeteriaModels.push(cafeTableClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/small_table/scene.gltf', (gltf) => {
            const tableModel = gltf.scene;
            tableModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `smallTableData` array (from JSON) to create each instance.
            this.smallTableData.forEach((tableData, index) => {
                let tableClone = tableModel.clone(true); // Clone the original table model
                tableClone.scale.set(tableData.scale[0], tableData.scale[1], tableData.scale[2]);
                tableClone.position.set(tableData.position[0], tableData.position[1], tableData.position[2]);
                tableClone.visible = false; // Set visibility to false
                this.object.add(tableClone);
                this.cafeteriaModels.push(tableClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/coffee__tea_mugs_free/scene.gltf', (gltf) => {
            const mugModel = gltf.scene;
            mugModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `mugData` array (from JSON) to create each instance.
            this.mugData.forEach((mugData, index) => {
                let mugClone = mugModel.clone(true); // Clone the original mug model
                mugClone.scale.set(mugData.scale[0], mugData.scale[1], mugData.scale[2]);
                mugClone.position.set(mugData.position[0], mugData.position[1], mugData.position[2]);
                mugClone.visible = false; // Set visibility to false
                this.object.add(mugClone);
                this.cafeteriaModels.push(mugClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/coffeemachinemodel_archviz_productdesign_free/scene.gltf', (gltf) => {
            const coffeeModel = gltf.scene;
            coffeeModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `coffeeMachines` array (from JSON) to create each instance.
            this.coffeeData.forEach((coffeeData, index) => {
                let coffeeClone = coffeeModel.clone(true); // Clone the original coffee machine model
                coffeeClone.scale.set(coffeeData.scale[0], coffeeData.scale[1], coffeeData.scale[2]);
                coffeeClone.position.set(coffeeData.position[0], coffeeData.position[1], coffeeData.position[2]);
                coffeeClone.visible = false; // Set visibility to false
                this.object.add(coffeeClone);
                this.cafeteriaModels.push(coffeeClone); // Add to models array
            });
        });
        

        //=======================================================================================================
        // Bedroom

        loaderGLTF.load('./models/bed_curtain_and_vital_signs_monitor/scene.gltf', (gltf) => {
            const bedModel = gltf.scene;
            bedModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `bedModels` array (from JSON) to create each instance.
            this.bedData.forEach((bedData, index) => {
                let bedClone = bedModel.clone(true); // Clone the original bed model
                bedClone.scale.set(bedData.scale[0], bedData.scale[1], bedData.scale[2]);
                bedClone.position.set(bedData.position[0], bedData.position[1], bedData.position[2]);
                bedClone.rotateY(bedData.rotationY); // Apply rotation if any
                bedClone.visible = false; // Set visibility to false
                this.object.add(bedClone);
                this.bedroomModels.push(bedClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/hospital_bed/scene.gltf', (gltf) => {
            const hospitalBedroomBedModel = gltf.scene;
            hospitalBedroomBedModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `hospitalBedroomBedModels` array (from JSON) to create each instance.
            this.hospitalBedroomBedModels.forEach((bedData, index) => {
                let hospitalBedClone = hospitalBedroomBedModel.clone(true); // Clone the original hospital bed model
                hospitalBedClone.scale.set(bedData.scale[0], bedData.scale[1], bedData.scale[2]);
                hospitalBedClone.position.set(bedData.position[0], bedData.position[1], bedData.position[2]);
                hospitalBedClone.visible = false; // Set visibility to false
                this.object.add(hospitalBedClone);
                this.bedroomModels.push(hospitalBedClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/gourney_-_hospital_bed/scene.gltf', (gltf) => {
            const gourneyModel = gltf.scene;
            gourneyModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `gourneyModels` array (from JSON) to create each instance.
            this.gourneyModels.forEach((bedData, index) => {
                let gourneyClone = gourneyModel.clone(true); // Clone the original Gourney hospital bed model
                gourneyClone.scale.set(bedData.scale[0], bedData.scale[1], bedData.scale[2]);
                gourneyClone.position.set(bedData.position[0], bedData.position[1], bedData.position[2]);
                gourneyClone.visible = false; // Set visibility to false
                this.object.add(gourneyClone);
                this.bedroomModels.push(gourneyClone); // Add to models array
            });
        });
        



        //=======================================================================================================
        // Parking lot


        // KOENIGSEGG ONE PRO
        loaderGLTF.load('./models/koenigsegg_one_pro/scene.gltf', (gltf) => {
            const kOneProModel = gltf.scene;
            kOneProModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `kOneProModels` array (from JSON) to create each instance.
            this.kOneProModels.forEach((carData, index) => {
                let kOneProClone = kOneProModel.clone(true); // Clone the original Koenigsegg model
                kOneProClone.scale.set(carData.scale[0], carData.scale[1], carData.scale[2]);
                kOneProClone.position.set(carData.position[0], carData.position[1], carData.position[2]);
                kOneProClone.rotateY(carData.rotationY || 0); // Apply rotation if provided
                kOneProClone.visible = false; // Set visibility to false
                this.object.add(kOneProClone);
                this.parkingLotModels.push(kOneProClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/aventador_svj_black-ghosttm/scene.gltf', (gltf) => {
            const aventadorModel = gltf.scene;
            aventadorModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `aventadorModels` array (from JSON) to create each instance.
            this.aventadorModels.forEach((carData, index) => {
                let aventadorClone = aventadorModel.clone(true); // Clone the original Aventador model
                aventadorClone.scale.set(carData.scale[0], carData.scale[1], carData.scale[2]);
                aventadorClone.position.set(carData.position[0], carData.position[1], carData.position[2]);
                aventadorClone.rotateY(carData.rotationY || 0); // Apply rotation if provided
                aventadorClone.visible = false; // Set visibility to false
                this.object.add(aventadorClone);
                this.parkingLotModels.push(aventadorClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/ac_-_mclaren_p1_free/scene.gltf', (gltf) => {
            const mclarenModel = gltf.scene;
            mclarenModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `mclarenModels` array (from JSON) to create each instance.
            this.mclarenModels.forEach((carData, index) => {
                let mclarenClone = mclarenModel.clone(true); // Clone the original McLaren model
                mclarenClone.scale.set(carData.scale[0], carData.scale[1], carData.scale[2]);
                mclarenClone.position.set(carData.position[0], carData.position[1], carData.position[2]);
                mclarenClone.rotateY(carData.rotationY || 0); // Apply rotation if provided
                mclarenClone.visible = false; // Set visibility to false
                this.object.add(mclarenClone);
                this.parkingLotModels.push(mclarenClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/suzuki_gsx_750_bike_3d_model/scene.gltf', (gltf) => {
            const suzukiModel = gltf.scene;
            suzukiModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `suzukiModels` array (from JSON) to create each instance.
            this.suzukiModels.forEach((bikeData, index) => {
                let suzukiClone = suzukiModel.clone(true); // Clone the original Suzuki bike model
                suzukiClone.scale.set(bikeData.scale[0], bikeData.scale[1], bikeData.scale[2]);
                suzukiClone.position.set(bikeData.position[0], bikeData.position[1], bikeData.position[2]);
                suzukiClone.rotateY(bikeData.rotationY || 0); // Apply rotation if provided
                suzukiClone.visible = false; // Set visibility to false
                this.object.add(suzukiClone);
                this.parkingLotModels.push(suzukiClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/japanese_parking_machine/scene.gltf', (gltf) => {
            const parkingMachineModel = gltf.scene;
            parkingMachineModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `parkingMachineModels` array (from JSON) to create each instance.
            this.parkingMachineModels.forEach((machineData, index) => {
                let parkingMachineClone = parkingMachineModel.clone(true); // Clone the original parking machine model
                parkingMachineClone.scale.set(machineData.scale[0], machineData.scale[1], machineData.scale[2]);
                parkingMachineClone.position.set(machineData.position[0], machineData.position[1], machineData.position[2]);
                parkingMachineClone.rotateY(machineData.rotationY || 0); // Apply rotation if provided
                parkingMachineClone.visible = false; // Set visibility to false
                this.object.add(parkingMachineClone);
                this.parkingLotModels.push(parkingMachineClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/concrete_road_barrier_photoscanned/scene.gltf', (gltf) => {
            const roadBarrierModel = gltf.scene;
            roadBarrierModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `roadBarrierModels` array (from JSON) to create each instance.
            this.roadBarrierModels.forEach((barrierData, index) => {
                let roadBarrierClone = roadBarrierModel.clone(true); // Clone the original road barrier model
                roadBarrierClone.scale.set(barrierData.scale[0], barrierData.scale[1], barrierData.scale[2]);
                roadBarrierClone.position.set(barrierData.position[0], barrierData.position[1], barrierData.position[2]);
                roadBarrierClone.rotateY(barrierData.rotationY || 0); // Apply rotation if provided
                roadBarrierClone.visible = false; // Set visibility to false
                this.object.add(roadBarrierClone);
                this.parkingLotModels.push(roadBarrierClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/ambulance/scene.gltf', (gltf) => {
            const ambulanceModel = gltf.scene;
            ambulanceModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `ambulanceModels` array (from JSON) to create each instance.
            this.ambulanceModels.forEach((ambulanceData, index) => {
                let ambulanceClone = ambulanceModel.clone(true); // Clone the original ambulance model
                ambulanceClone.scale.set(ambulanceData.scale[0], ambulanceData.scale[1], ambulanceData.scale[2]);
                ambulanceClone.position.set(ambulanceData.position[0], ambulanceData.position[1], ambulanceData.position[2]);
                ambulanceClone.rotateY(ambulanceData.rotationY || 0); // Apply rotation if provided
                ambulanceClone.visible = false; // Set visibility to false
                this.object.add(ambulanceClone);
                this.parkingLotModels.push(ambulanceClone); // Add to models array
            });
        });
        

*/
        //=======================================================================================================
        // Consultório

        loaderGLTF.load('./models/table/scene.gltf', (gltf) => {
            const tableModel = gltf.scene;
            tableModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `tableCModels` array (from JSON) to create each instance.
            this.tableCModels.forEach((tableData, index) => {
                let tableClone = tableModel.clone(true); // Clone the original table model
                tableClone.scale.set(tableData.scale[0], tableData.scale[1], tableData.scale[2]);
                tableClone.position.set(tableData.position[0], tableData.position[1], tableData.position[2]);
                tableClone.visible = false; // Set visibility to false
                this.object.add(tableClone);
                this.screeningModels.push(tableClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/retro_computer_setup_free/scene.gltf', (gltf) => {
            const computerModel = gltf.scene;
            computerModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `computerCModels` array (from JSON) to create each instance.
            this.computerCModels.forEach((computerData, index) => {
                let computerClone = computerModel.clone(true); // Clone the original computer model
                computerClone.scale.set(computerData.scale[0], computerData.scale[1], computerData.scale[2]);
                computerClone.position.set(computerData.position[0], computerData.position[1], computerData.position[2]);
                computerClone.rotateY(computerData.rotationY || 0); // Apply rotation if provided
                computerClone.visible = false; // Set visibility to false
                this.object.add(computerClone);
                this.screeningModels.push(computerClone); // Add to models array
            });

            this.computerStaffModels.forEach((computerData) => {
                let computerClone = computerModel.clone(true); // Clone the original computer model
                computerClone.scale.set(computerData.scale[0], computerData.scale[1], computerData.scale[2]);
                computerClone.position.set(computerData.position[0], computerData.position[1], computerData.position[2]);
                computerClone.rotateY(computerData.rotationY || 0); // Apply rotation if provided
                computerClone.visible = false; // Set visibility to false initially
                this.object.add(computerClone);
        
                // Add to the staff models array
                this.staffModels.push(computerClone);
            });
        });
        

        loaderGLTF.load('./models/ikea_markus_office_chair/scene.gltf', (gltf) => {
            const chairModel = gltf.scene;
            chairModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `chairCModels` array (from JSON) to create each instance.
            this.chairCModels.forEach((chairData, index) => {
                let chairClone = chairModel.clone(true); // Clone the original chair model
                chairClone.scale.set(chairData.scale[0], chairData.scale[1], chairData.scale[2]);
                chairClone.position.set(chairData.position[0], chairData.position[1], chairData.position[2]);
                chairClone.rotateY(chairData.rotationY || 0); // Apply rotation if provided
                chairClone.visible = false; // Set visibility to false
                this.object.add(chairClone);
                this.screeningModels.push(chairClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/chair/scene.gltf', (gltf) => {
            const chairModel = gltf.scene;
            chairModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `chairModels` array (from JSON) to create each instance.
            this.chairModels.forEach((chairData, index) => {
                let chairClone = chairModel.clone(true); // Clone the original chair model
                chairClone.scale.set(chairData.scale[0], chairData.scale[1], chairData.scale[2]);
                chairClone.position.set(chairData.position[0], chairData.position[1], chairData.position[2]);
                chairClone.rotateY(chairData.rotationY || 0); // Apply rotation if provided
                chairClone.visible = false; // Set visibility to false
                this.object.add(chairClone);
                this.screeningModels.push(chairClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/office_filing_cabinet_free/scene.gltf', (gltf) => {
            const cabinetModel = gltf.scene;
            cabinetModel.visible = false; // Hide the original model for cloning.
            
            // Iterate over the `cabinetModels` array (from JSON) to create each instance.
            this.cabinetModels.forEach((cabinetData, index) => {
                let cabinetClone = cabinetModel.clone(true); // Clone the original cabinet model
                cabinetClone.scale.set(cabinetData.scale[0], cabinetData.scale[1], cabinetData.scale[2]);
                cabinetClone.position.set(cabinetData.position[0], cabinetData.position[1], cabinetData.position[2]);
                cabinetClone.rotateY(cabinetData.rotationY || 0); // Apply rotation if provided
                cabinetClone.visible = false; // Set visibility to false
                this.object.add(cabinetClone);
                this.screeningModels.push(cabinetClone); // Add to models array
            });
        });
        

        loaderGLTF.load('./models/hospital_bed_patient/scene.gltf', (gltf) => {
            const hospitalBedModel = gltf.scene;
            hospitalBedModel.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `hospitalBedModels` array (from JSON) to create each instance.
            this.hospitalBedModels.forEach((bedData, index) => {
                let hospitalBedClone = hospitalBedModel.clone(true); // Clone the original bed model
                hospitalBedClone.scale.set(bedData.scale[0], bedData.scale[1], bedData.scale[2]);
                hospitalBedClone.position.set(bedData.position[0], bedData.position[1], bedData.position[2]);
                hospitalBedClone.rotateY(bedData.rotationY || 0); // Apply rotation if provided
                hospitalBedClone.visible = false; // Set visibility to true
                this.object.add(hospitalBedClone);
                this.screeningModels.push(hospitalBedClone); // Add to models array
            });
        });
        


        //=======================================================================================================
        // Surgery room

        loaderGLTF.load('./models/surgical__instrument_table_collection/scene.gltf', (gltf) => {
            const originalInstruments = gltf.scene;
            originalInstruments.visible = false; // Hide the original model for cloning.
        
            // Iterate over the `surgicalInstrumentModels` array (from JSON) to create each instance
            this.surgicalInstrumentModels.forEach((instrumentData, index) => {
                let instrumentClone = originalInstruments.clone(true); // Clone the original model.
                instrumentClone.scale.set(instrumentData.scale[0], instrumentData.scale[1], instrumentData.scale[2]);
                instrumentClone.position.set(instrumentData.position[0], instrumentData.position[1], instrumentData.position[2]);
                instrumentClone.rotateY(instrumentData.rotationY || 0); // Apply rotation if provided
                instrumentClone.visible = false; // Set visibility to true
                this.object.add(instrumentClone);
                this.surgeryRoomModels.push(instrumentClone); // Add to models array
            });
        });
        

        // Load the doctor's office model
        loaderGLTF.load('./models/doctors_office_-_assets/scene.gltf', (gltf) => {
        const originalOffice = gltf.scene;
        originalOffice.visible = false;

        this.doctorsOffices.forEach((officeData, index) => {
        let officeClone = originalOffice.clone(true);
        officeClone.scale.set(officeData.scale[0], officeData.scale[1], officeData.scale[2]);
        officeClone.position.set(officeData.position[0], officeData.position[1], officeData.position[2]);
        officeClone.rotateY(officeData.rotationY || 0); // Apply rotation if provided
        officeClone.visible = false; // Set visibility for added elements
        this.object.add(officeClone);
        this.surgeryRoomModels.push(officeClone);
        });
        });


        // Load the studio light model
        loaderGLTF.load('./models/simple_studio_light/scene.gltf', (gltf) => {
        const originalLight = gltf.scene;
        originalLight.visible = false;

        this.studioLights.forEach((lightData, index) => {
        let lightClone = originalLight.clone(true);
        lightClone.scale.set(lightData.scale[0], lightData.scale[1], lightData.scale[2]);
        lightClone.position.set(lightData.position[0], lightData.position[1], lightData.position[2]);
        lightClone.rotateY(lightData.rotationY || 0); // Apply rotation if provided
        lightClone.visible = false; // Set visibility for added elements
        this.object.add(lightClone);
        this.surgeryRoomModels.push(lightClone);
        });
        });


        loaderGLTF.load('./models/surgical_bed/scene.gltf', (gltf) => {
            const originalBed = gltf.scene;
            originalBed.visible = false; // Hide the original model for cloning
            let bedRaycaster; // Create a raycaster for the bed model
        
            // Iterate over the surgicalBeds configuration and create clones for each
            this.surgicalBeds.forEach((bedData) => {
                let bedClone = originalBed.clone(true); // Clone the original bed
                
                // Apply scale from configuration
                bedClone.scale.set(bedData.scale[0], bedData.scale[1], bedData.scale[2]);
                
                bedClone.position.set(bedData.position[0], bedData.position[1], bedData.position[2]); // Set position from configuration
                
                // Apply rotation from configuration (rotation is in radians)
                bedClone.rotation.set(bedData.rotation[0], bedData.rotation[1], bedData.rotation[2]);
        
                bedClone.visible = false; // Initially hide the clone
                this.object.add(bedClone); // Add the clone to the object
        
                this.surgeryRoomModels.push(bedClone); // Add the cloned bed to the surgery room models array

                bedRaycaster = this.raycaster.clone();
                bedRaycaster.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
                bedRaycaster.position.set(bedData.position[0] + bedErrorRaycaster.x, bedErrorRaycaster.y, bedData.position[2] + bedErrorRaycaster.z + 0.3);
                this.raycasterArray.push(bedRaycaster);
                this.object.add(bedRaycaster);
            });
        });
        
        //=======================================================================================================
        // PATIENT
/*
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
*/
        //=======================================================================================================

        // Load the exit sign model
        loaderGLTF.load('./models/low_poly_green_running_man_exit_sign/scene.gltf', (gltf) => {
        const originalExitSign = gltf.scene;
        originalExitSign.scale.set(0.15, 0.2, 0.1);
        originalExitSign.visible = false;

        this.exitSigns.forEach((signData, index) => {
        let exitSignClone = originalExitSign.clone(true);
        exitSignClone.position.set(signData.position[0], signData.position[1], signData.position[2]);
        exitSignClone.rotateY(signData.rotationY || 0); // Apply rotation if provided
        exitSignClone.visible = false;
        this.object.add(exitSignClone);
        this.receptionModels.push(exitSignClone);
            });
        });

        // Load the keypad model
        loaderGLTF.load('./models/cc0_-_keypad_door_lock/scene.gltf', (gltf) => {
        const originalKeypad = gltf.scene;
        originalKeypad.scale.set(1, 1, 0.7);
        originalKeypad.visible = false;

        this.keypads.forEach((keypadData, index) => {
        let keypadClone = originalKeypad.clone(true);
        keypadClone.position.set(keypadData.position[0], keypadData.position[1], keypadData.position[2]);
        keypadClone.rotateY(keypadData.rotationY || 0); // Apply rotation if defined
        keypadClone.visible = false;
        this.object.add(keypadClone);
        this.staffModels.push(keypadClone);
        });
        });

        //=======================================================================================================
        // Doors

        // Load the staff door model
        loaderGLTF.load('./models/metal_door/scene.gltf', (gltf) => {
        const originalStaffDoor = gltf.scene;
        originalStaffDoor.scale.set(0.0035, 0.0042, 0.0035);
        originalStaffDoor.visible = false;

        this.staffDoors.forEach((doorData, index) => {
        let doorClone = originalStaffDoor.clone(true);
        doorClone.position.set(doorData.position[0], doorData.position[1], doorData.position[2]);
        doorClone.rotateY(doorData.rotationY || 0); // Apply rotation if provided
        doorClone.visible = false;
        this.object.add(doorClone);
        this.staffModels.push(doorClone);
        });
        });

        // Load the entrance door model
        loaderGLTF.load('./models/emergency_glass_double_door/scene.gltf', (gltf) => {
        const originalEntranceDoor = gltf.scene;
        originalEntranceDoor.scale.set(0.0047, 0.00469, 0.0035);
        originalEntranceDoor.visible = false;

        this.entranceDoors.forEach((doorData, index) => {
        let doorClone = originalEntranceDoor.clone(true);
        doorClone.position.set(doorData.position[0], doorData.position[1], doorData.position[2]);
        doorClone.rotateY(doorData.rotationY || 0); // Apply rotation if provided
        doorClone.visible = true;
        this.object.add(doorClone);
        });
        });

        // Load the toilet door model
        loaderGLTF.load('./models/double_door/scene.gltf', (gltf) => {
        const originalToiletDoor = gltf.scene;
        originalToiletDoor.scale.set(0.6, 0.48, 0.5);
        originalToiletDoor.visible = false;

        this.toiletDoors.forEach((doorData, index) => {
        let doorClone = originalToiletDoor.clone(true);
        doorClone.position.set(doorData.position[0], doorData.position[1], doorData.position[2]);
        doorClone.rotateY(doorData.rotationY || 0); // Apply rotation if provided
        doorClone.visible = false;
        this.object.add(doorClone);
        this.toiletModels.push(doorClone);
        });
        });

        // Load the surgery door model
loaderGLTF.load('./models/hospitaldoor_double_swing/scene.gltf', (gltf) => {
    const originalSurgeryDoor = gltf.scene;
    originalSurgeryDoor.visible = false;

    // Loop through surgeryDoors configuration and create clones
    this.surgeryDoors.forEach((doorData) => {
        let doorClone = originalSurgeryDoor.clone(true);
        doorClone.scale.set(doorData.scale[0], doorData.scale[1], doorData.scale[2]);  // Apply scale from JSON
        doorClone.position.set(doorData.position[0], doorData.position[1], doorData.position[2]);
        doorClone.rotateY(doorData.rotationY || 0);  // Apply rotation from JSON
        doorClone.visible = false;
        this.object.add(doorClone);
        this.surgeryRoomModels.push(doorClone);
    });

    // Loop through screeningDoors configuration and create clones
    this.screeningDoors.forEach((doorData) => {
        let doorClone = originalSurgeryDoor.clone(true);
        doorClone.scale.set(doorData.scale[0], doorData.scale[1], doorData.scale[2]);
        doorClone.position.set(doorData.position[0], doorData.position[1], doorData.position[2]);
        doorClone.rotateY(doorData.rotationY || 0);  // Apply rotation from JSON
        doorClone.visible = false;
        this.object.add(doorClone);
        this.screeningModels.push(doorClone);
    });
});


        //=======================================================================================================
        
        // Load the cobblestone ground model
        loaderGLTF.load('./models/cobblestone_ground_-_lowpoly/scene.gltf', (gltf) => {
        const originalCobblestone = gltf.scene;
        originalCobblestone.visible = false;

        this.cobblestoneGround.forEach((groundData, index) => {
        let cobblestoneClone = originalCobblestone.clone(true);
        cobblestoneClone.scale.set(groundData.scale[0], groundData.scale[1], groundData.scale[2]);
        cobblestoneClone.position.set(groundData.position[0], groundData.position[1], groundData.position[2]);
        cobblestoneClone.rotateY(groundData.rotationY || 0); // Apply rotation if provided
        cobblestoneClone.visible = true; // Set visibility for added elements
        this.object.add(cobblestoneClone);
        });
        });

        //=======================================================================================================
        // CRISTIANO RONALDO
        loaderGLTF.load('./models/3d_rigged_cristiano_ronaldo_al_nassr/scene.gltf', (gltf) => {
            this.cr = gltf.scene;
            this.cr.scale.set(0.01, 0.013, 0.01);
            this.cr.position.set(-1.45, 0.6, -1.59);
            this.cr.rotateY(3 * Math.PI / 2);
            this.cr.rotateX(3 * Math.PI / 2);
            this.cr.visible = false;
            this.object.add(this.cr);
            this.cristianoModels.push(this.cr);
        }
        );

        loaderGLTF.load('./models/3d_rigged_cristiano_ronaldo_al_nassr/scene.gltf', (gltf) => {
            this.cr2 = gltf.scene;
            this.cr2.scale.set(0.01, 0.013, 0.01);
            this.cr2.position.set(-1.45, 0.6, 1.59);
            this.cr2.rotateY(3 * Math.PI / 2);
            this.cr2.rotateX(3 * Math.PI / 2);
            this.cr2.visible = false;
            this.object.add(this.cr2);
            this.cristianoModels.push(this.cr2);
        }
        );

        loaderGLTF.load('./models/3d_rigged_cristiano_ronaldo_al_nassr/scene.gltf', (gltf) => {
            this.cr3 = gltf.scene;
            this.cr3.scale.set(0.01, 0.013, 0.01);
            this.cr3.position.set(2.55, 0.6, -1.59);
            this.cr3.rotateY(3 * Math.PI / 2);
            this.cr3.rotateX(3 * Math.PI / 2);
            this.cr3.visible = false;
            this.object.add(this.cr3);
            this.cristianoModels.push(this.cr3);
        }
        );

        loaderGLTF.load('./models/3d_rigged_cristiano_ronaldo_al_nassr/scene.gltf', (gltf) => {
            this.cr4 = gltf.scene;
            this.cr4.scale.set(0.01, 0.013, 0.01);
            this.cr4.position.set(2.55, 0.6, 1.59);
            this.cr4.rotateY(3 * Math.PI / 2);
            this.cr4.rotateX(3 * Math.PI / 2);
            this.cr4.visible = false;
            this.object.add(this.cr4);
            this.cristianoModels.push(this.cr4);
        }
        );

        loaderGLTF.load('./models/3d_rigged_cristiano_ronaldo_al_nassr/scene.gltf', (gltf) => {
            this.cr5 = gltf.scene;
            this.cr5.scale.set(0.01, 0.013, 0.01);
            this.cr5.position.set(0.73, 0.6, -4.59);
            this.cr5.rotateY(3 * Math.PI / 2);
            this.cr5.rotateX(3 * Math.PI / 2);
            this.cr5.visible = false;
            this.object.add(this.cr5);
            this.cristianoModels.push(this.cr5);
        }
        );

        loaderGLTF.load('./models/3d_rigged_cristiano_ronaldo_al_nassr/scene.gltf', (gltf) => {
            this.cr6 = gltf.scene;
            this.cr6.scale.set(0.01, 0.013, 0.01);
            this.cr6.position.set(0.73, 0.6, 4.59);
            this.cr6.rotateY(3 * Math.PI / 2);
            this.cr6.rotateX(3 * Math.PI / 2);
            this.cr6.visible = false;
            this.object.add(this.cr6);
            this.cristianoModels.push(this.cr6);
        }
        );

        loaderGLTF.load('./models/3d_rigged_cristiano_ronaldo_al_nassr/scene.gltf', (gltf) => {
            this.cr7 = gltf.scene;
            this.cr7.scale.set(0.01, 0.013, 0.01);
            this.cr7.position.set(2.73, 0.6, -4.59);
            this.cr7.rotateY(3 * Math.PI / 2);
            this.cr7.rotateX(3 * Math.PI / 2);
            this.cr7.visible = false;
            this.object.add(this.cr7);
            this.cristianoModels.push(this.cr7);
        }
        );

        loaderGLTF.load('./models/3d_rigged_cristiano_ronaldo_al_nassr/scene.gltf', (gltf) => {
            this.cr8 = gltf.scene;
            this.cr8.scale.set(0.01, 0.013, 0.01);
            this.cr8.position.set(2.73, 0.6, 4.59);
            this.cr8.rotateY(3 * Math.PI / 2);
            this.cr8.rotateX(3 * Math.PI / 2);
            this.cr8.visible = false;
            this.object.add(this.cr8);
            this.cristianoModels.push(this.cr8);
        }
        );

        loaderGLTF.load('./models/3d_rigged_cristiano_ronaldo_al_nassr/scene.gltf', (gltf) => {
            this.cr9 = gltf.scene;
            this.cr9.scale.set(0.01, 0.013, 0.01);
            this.cr9.position.set(4.73, 0.6, -4.59);
            this.cr9.rotateY(3 * Math.PI / 2);
            this.cr9.rotateX(3 * Math.PI / 2);
            this.cr9.visible = false;
            this.object.add(this.cr9);
            this.cristianoModels.push(this.cr9);
        }
        );

        loaderGLTF.load('./models/3d_rigged_cristiano_ronaldo_al_nassr/scene.gltf', (gltf) => {
            this.cr10 = gltf.scene;
            this.cr10.scale.set(0.01, 0.013, 0.01);
            this.cr10.position.set(4.73, 0.6, 4.59);
            this.cr10.rotateY(3 * Math.PI / 2);
            this.cr10.rotateX(3 * Math.PI / 2);
            this.cr10.visible = false;
            this.object.add(this.cr10);
            this.cristianoModels.push(this.cr10);
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

    raycasterInterception(raycasterParam) {

        const intersects = raycasterParam.intersectObjects(this.raycasterArray, false);
        if (intersects.length > 0) {
            console.log('Intersection detected with:', intersects[0].object);
            
            this.selectedRoom = intersects[0].object;

            return intersects[0].object;
        }
        console.log('No intersection detected');
        return null;
    }
}
