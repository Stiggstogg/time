import Phaser from 'phaser';
//import gameOptions from '../helper/gameOptions';

// Ship sensor class, which checks if the ship is in a save position and stores the last save position
export default class ShipSensor extends Phaser.Physics.Matter.Image {

    private isColliding: boolean;
    public safeX: number;
    public safeY: number;

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {

        super(scene.matter.world, x, y, 'placeholder');

        // set the body settings
        this.setBody({                            // MatterSetBodyConfig: configuration of the collision body itself
            type: 'circle',                             // set the type to a trapezoid
            radius: radius,                               // set the slope so it is a triangle
        }, {                                            // MatterBodyConfig: Configuration of the behavior in the world
            label: 'shipSensor',                                // provide a label for better identification
            isSensor: true,                                     // set it as a sensor as it will be only used to check the save positions
            onCollideCallback: this.collisionStart.bind(this),
            onCollideEndCallback: this.collisionEnd.bind(this)
        });

        // make the image invisible
        this.setVisible(false);

        // set collision category and with whom it collides
        this.setCollisionCategory(4);           // category needs to be a power of 2, e.g. 1, 2, 4, 8,...!
        this.setCollidesWith(2);                // collides only with blocks

        // initialize parameters
        this.isColliding = false;
        this.safeX = x;
        this.safeY = y;

    }

    // update
    update(): void {

        // save the last save position when the sensor was not colliding
        if (!this.isColliding) {
            this.safeX = this.x;
            this.safeY = this.y;
        }

    }

    // move the sensor to a certain position
    moveTo(x: number, y: number): void {

        this.x = x;
        this.y = y;

    }

    // action which happens when the collision starts
    collisionStart(): void {
        this.isColliding = true;
    }

    // action which happens when the collision ends
    collisionEnd(): void {
        this.isColliding = false;
    }


}