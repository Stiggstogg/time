import Phaser from 'phaser';

// Objective class
export default class Objective extends Phaser.Physics.Matter.Image {

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number, color: number) {

        super(scene.matter.world, x, y, 'objective');

        this.setBody({                            // MatterSetBodyConfig: configuration of the collision body itself
            type: 'circle',                             // set the type to rectangle (basically not needed as it is the default
        }, {                                     // MatterBodyConfig: Configuration of the behavior in the world
            label: 'objective',                         // provide a label for better identification
            isStatic: true,                              // set it to static
            isSensor: true                              // define it as a sensor
        });

        // set color
        this.setTint(color);

        // set collision category and with whom it collides
        this.setCollisionCategory(2);   // category needs to be a power of 2, e.g. 1, 2, 4, 8,...!
        this.setCollidesWith(1);        // collides only with ship

    }

}