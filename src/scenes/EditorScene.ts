import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {GameData, LevelData, OtherKeys} from '../helper/interfaces';
import FixedKeyControl = Phaser.Cameras.Controls.FixedKeyControl;
import * as dat from 'dat.gui';

/* "Editor" scene which can be used to create levels and save them as JSON

Controls:
----------------

Mouse:              Select objects
Mouse drag:         Drag objects
Cursor keys:        Move around when zoomed in
Z + mouseclick:     Zoom in / Zoom out
Q + mouseclick:     Spawn block
W + mouseclick:     Spawn objective
D:                  Delete selected objective or block

 */

export default class EditorScene extends Phaser.Scene {

    private ship!: Phaser.GameObjects.Sprite;
    private blocks!: Phaser.GameObjects.Sprite[]
    private objectives!: Phaser.GameObjects.Sprite[];
    private gameData!: GameData;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private cameraControl!: Phaser.Cameras.Controls.FixedKeyControl;
    private isZoom!: boolean;
    private otherKeys!: OtherKeys;
    private selectedObject!: Phaser.GameObjects.Sprite;
    private blockGUI!: dat.GUI;

    // Constructor
    constructor() {
        super({
            key: 'Editor'
        });
    }

    /// Initialize parameters
    init(data: GameData): void {

        // get game data
        this.gameData = data;

        // initialize variables
        this.objectives = [];
        this.blocks = [];
        this.isZoom = false;
        this.blockGUI = new dat.GUI();

    }

    // Creates all objects of this scene
    create(): void {

        // create the world
        this.createWorld();

        // create level
        this.createLevel();

        // Add controls
        this.addControls();

        // select ship
        this.selectedObject = this.ship;

        // select first block for the UI
        this.updateGUI(this.blocks[0]);

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        this.cameraControl.update(_delta);

    }

    // Add keyboard controls and dragging to the scene.
    addControls(): void {

        // add keyboard controls to move the camera
        this.cursors = this.input.keyboard!.createCursorKeys();

        this.cameraControl = new FixedKeyControl({
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            speed: 1
        });

        // add keyboard other keyboard controls
        this.otherKeys = this.input.keyboard?.addKeys('Z,Q,W,ENTER,D') as OtherKeys;

        // dragging
        this.input.on('drag', function (_pointer: Phaser.Input.Pointer, sprite: Phaser.GameObjects.Sprite, dragX: number, dragY: number) {
            sprite.x = dragX;
            sprite.y = dragY;
        });

        // Actions for mouse clicks
        this.input.on('pointerdown', function(this: EditorScene, pointer: Phaser.Input.Pointer) {

            if (this.isZoom && this.otherKeys.Z.isDown) {               // zoom in

                this.isZoom = false;

                this.cameras.main.setZoom(gameOptions.gameWidth / gameOptions.worldWidth);

            }
            else if (this.otherKeys.Z.isDown) {                         // zoom out

                this.isZoom = true;

                console.log(pointer.x);

                this.cameras.main.setZoom(1);

                this.cameras.main.centerOn(pointer.worldX, pointer.worldY);

            }
            else if (this.otherKeys.Q.isDown) {                         // create a new block

                this.createNewBlock(pointer.worldX, pointer.worldY);

            }
            else if (this.otherKeys.W.isDown) {                         // create a new objective

                this.createNewObjective(pointer.worldX, pointer.worldY);

            }

        }, this);

        // control for the ENTER key: Download JSON file
        this.otherKeys.ENTER.on('down', function(this: EditorScene) {this.downloadJSON()}, this);

        // control for the D key: Delete the selected object
        this.otherKeys.D.on('down', function(this: EditorScene) {this.destroySelected()}, this);

    }

    // Create the world (background and boundaries)
    createWorld(): void {

        // add background
        this.add.image(0, 0, 'background').setOrigin(0);

        // set main camera
        this.cameras.main.setBounds(0, 0, gameOptions.worldWidth, gameOptions.worldHeight);
        this.cameras.main.setScroll(gameOptions.worldWidth / 2, gameOptions.worldHeight - gameOptions.gameHeight);
        this.cameras.main.setZoom(gameOptions.gameWidth / gameOptions.worldWidth);


    }

    // Create level
    createLevel(): void {

        // get the level data from the corresponding json file
        const levelNumber: number = this.gameData.level;                // get the number of the level
        const levelString: string = 'level' + levelNumber.toString();   // create the string with the level name (key to the loaded json)
        const levelData: LevelData = this.cache.json.get(levelString);  // get the data from the json

        // place the ship
        this.ship = this.add.sprite(
            gameOptions.worldWidth * levelData.ship.x,
            gameOptions.worldHeight * levelData.ship.y,
            'ship'
        );

        this.ship.setInteractive({draggable: true});

        // place all blocks
        for (let i = 0; i < levelData.blocks.length; i++) {

            this.createNewBlock(
                gameOptions.worldWidth * levelData.blocks[i].x,
                gameOptions.worldHeight * levelData.blocks[i].y
            );
        }

        // place all objectives and add them to the objectives array
        for (let i = 0; i < levelData.objectives.length; i++) {

            this.createNewObjective(
                gameOptions.worldWidth * levelData.objectives[i].x,
                gameOptions.worldHeight * levelData.objectives[i].y
            );
        }

    }

    downloadJSON(): void {

        // create object will ships, blocks and objectives
        let levelDataObject: LevelData = {                  // create object and add ship data
            ship: {
                x: this.ship.x / gameOptions.worldWidth,
                y: this.ship.y / gameOptions.worldHeight
            },
            blocks: [],
            objectives: []
        }

        for (let i = 0; i < this.blocks.length; i++) {      // add blocks data

            levelDataObject.blocks.push({
                x: this.blocks[i].x  / gameOptions.worldWidth,
                y: this.blocks[i].y  / gameOptions.worldHeight,
                width: this.blocks[i].displayWidth / gameOptions.worldWidth,
                height: this.blocks[i].displayHeight / gameOptions.worldHeight,
                angle: this.blocks[i].angle,
            });
        }

        for (let i = 0; i < this.objectives.length; i++) {      // add objectives data

            levelDataObject.objectives.push({
                x: this.objectives[i].x  / gameOptions.worldWidth,
                y: this.objectives[i].y  / gameOptions.worldHeight,
            });
        }

        // create a file and download it
        const a = document.createElement('a');
        const file = new Blob([JSON.stringify(levelDataObject, null, 2)], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = 'level.json';
        a.click();

    }

    // create a new block
    createNewBlock(x: number, y: number): void {

        const tempSprite = this.add.sprite(x, y, 'block');      // create block object

        tempSprite.setInteractive({draggable: true});           // make it interactive and draggable

        tempSprite.on('pointerdown', function(this: Phaser.GameObjects.Sprite) {

            const scene: any = this.scene;

            scene.selectedObject.clearTint();
            scene.selectedObject = this;
            scene.selectedObject.setTintFill(0xff0000);

            scene.updateGUI(this);

        });

        this.blocks.push(tempSprite);                                   // add it to the array of blocks

    }

    // create a new block
    createNewObjective(x: number, y: number): void {

        const tempSprite = this.add.sprite(x, y, 'objective');      // create objective object

        tempSprite.setInteractive({draggable: true});               // make it interactive and draggable

        tempSprite.on('pointerdown', function(this: Phaser.GameObjects.Sprite) {

            const scene: any = this.scene;
            scene.selectedObject.clearTint();
            scene.selectedObject = this;
            scene.selectedObject.setTintFill(0xff0000);

        });

        this.objectives.push(tempSprite);                                 // add it to the array of objectives

    }

    // add gui (for block manipulation
    updateGUI(block: Phaser.GameObjects.Sprite): void {

        this.blockGUI.destroy();

        this.blockGUI = new dat.GUI({name: 'block GUI'});

        this.blockGUI.add(block as any, 'displayWidth');
        this.blockGUI.add(block as any, 'displayHeight');
        this.blockGUI.add(block as any, 'angle');

    }

    // destroy selected object
    destroySelected():void {

        if (this.selectedObject.texture.key == 'block') {

            this.blocks.splice(this.blocks.indexOf(this.selectedObject), 1);
            this.selectedObject.destroy();

        }
        else if (this.selectedObject.texture.key == 'objective') {

            this.objectives.splice(this.objectives.indexOf(this.selectedObject), 1);
            this.selectedObject.destroy();

        }

    }

}