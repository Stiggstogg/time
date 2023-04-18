import Phaser from 'phaser';

// Block class
export default class Block extends Phaser.Physics.Matter.Image {

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, angle: number) {

        super(scene.matter.world, x, y, 'block');

        this.setBody({                            // MatterSetBodyConfig: configuration of the collision body itself
            type: 'rectangle',                          // set the type to rectangle (basically not needed as it is the default
        }, {                                     // MatterBodyConfig: Configuration of the behavior in the world
            label: 'block',                             // provide a label for better identification
            isStatic: true,                              // set it to static
            isSensor: true                              // only works as a sensor
        });

        // set display size and angle
        this.setDisplaySize(width, height);
        this.setAngle(angle);

        // set collision category and with whom it collides
        this.setCollisionCategory(2);   // category needs to be a power of 2, e.g. 1, 2, 4, 8,...!
        this.setCollidesWith([1, 4]);   // collides with ship and ship sensor

    }

}