import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import eventsCenter from '../helper/eventsCenter';
import ShipSensor from "./ShipSensor";

// Ship class
export default class Ship extends Phaser.Physics.Matter.Sprite {

    public turnFactor: number;         // factor which is used to indicate the direction it is moving (1: clockwise, -1: counterclockwise)
    private isTumbling: boolean;        // ship is tumbling when it collided with a wall and is on the way back to a save position
    private tumblingStartTime: number;  // time when the tumbling has started (used to calculate how long the ship should tumble
    private isIdle: boolean;            // ship is idle when it is standing in one place and rotating (at the start and after a collision)
    private sensor: ShipSensor;         // sensor which detects where the last save position of the ship was
    public xgeo: number;               // x coordinate of the geometrical center of the ship (middle point of the bounding box around the triangle)
    public ygeo: number;               // y coordinate of the geometrical center of the ship (middle point of the bounding box around the triangle)

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene.matter.world, x, y, 'ship');

        this.setBody({                            // MatterSetBodyConfig: configuration of the collision body itself
            type: 'trapezoid',                          // set the type to a trapezoid
            slope: 1,                                   // set the slope so it is a triangle
        }, {                                     // MatterBodyConfig: Configuration of the behavior in the world
            label: 'ship',                              // provide a label for better identification
            frictionAir: gameOptions.shipFrictionAir,   // remove air friction
            onCollideCallback: this.collisionHandling.bind(this), // Attention: bind(this) is needed so that the correct scope (the ship) is set. Otherwise the scope would be on the body object
            isSensor: true
        });

        // create the sensor and add it to the scene
        const sensorAngle = 2 * Math.atan(this.width / (2 * this.height) );
        const sensorRadius = this.width / (2 * Math.sin(sensorAngle)) * gameOptions.shipSaveZoneFactor;
        this.sensor = scene.add.existing(new ShipSensor(scene, x, y, sensorRadius));

        // set the movement direction
        this.turnFactor = -1;           // set it first to counterclockwise
        this.changeDirection();         // then change the direction

        // set collision category and with whom it collides
        this.setCollisionCategory(1);   // category needs to be a power of 2, e.g. 1, 2, 4, 8,...!
        this.setCollidesWith(2);      // collides only with blocks

        // initialize variables
        this.isTumbling = false;                // ship is not tumbling at the beginning
        this.isIdle = true;                     // ship is idle at the beginning
        this.tumblingStartTime = Date.now();   // set the tumbling start time to now
        this.xgeo = this.x;                     // set the geometrical middle point coordinates
        this.ygeo = this.y - this.height / 6;   // set the geometrical middle point coordinates

        this.setBounce(gameOptions.shipBounce);

    }

    changeDirection(): void {

        // do not do anything if it is tumbling!
        if (!this.isTumbling) {

            if (this.isIdle) {

                this.isIdle = false;                    // if it is idle then remove the idle state

            }
            else {

                this.turnFactor = this.turnFactor * -1;     // change the direction (if it is not idle and not tumbling)

            }

        }

    }

    update(): void {

        // set the geometrical middle point coordinates (calculation is based on the fact that the center of mass is at height / 3)
        this.xgeo = this.x + this.height * Math.sin(Phaser.Math.DegToRad(this.angle)) / 6;
        this.ygeo = this.y - this.height * Math.cos(Phaser.Math.DegToRad(this.angle)) / 6;

        // sensor update
        this.sensor.update();                   // update the sensor

        this.sensor.moveTo(this.x, this.y);     // move the sensor together with the ship

        // check for tumbling, idle or flying
        if (this.isTumbling) {                  // tumbling

            this.setAngularVelocity(this.turnFactor * gameOptions.shipTumblingRotationSpeed);

            if (Date.now() - this.tumblingStartTime >= gameOptions.shipTumblingTime) {
                this.isTumbling = false;
                this.isIdle = true;
            }

        }
        else if (this.isIdle) {                 // idle (rotating, e.g. at the start and after a crash)

            this.setAngularVelocity(this.turnFactor * gameOptions.shipRotationSpeed);

        }
        else {                                  // when the ship is moving

            this.setAngularVelocity(this.turnFactor * gameOptions.shipRotationSpeed);

            // Calculating the angle in which the ship is facing in radians.
            // Phaser uses a right hand clockwise rotation system, where 0 is right, 90 is down.
            // 90 degrees need to be added to the angle as the ship was painted facing up, but the angle 0 is phasing to the right.
            // As the vector component calculation is based on counter-clockwise angles the angle needs to be set to negative for the calculation.
            const angleRad = (-this.angle + 90) * Math.PI / 180;

            // setting the velocity components based on the angle it is facing to move it in a cricle
            this.setVelocityX(gameOptions.shipSpeed * Math.cos(angleRad));
            this.setVelocityY(-gameOptions.shipSpeed * Math.sin(angleRad));
        }


    }

    private collisionHandling(data: Phaser.Types.Physics.Matter.MatterCollisionData): void {

        // only handle the collision if the ship is not tumbling
        if (!this.isTumbling) {

            if (data.bodyB.label == 'block') {                              // collision with a block

                this.scene.cameras.main.shake(500, 0.01);    // shake camera

                this.tumblingStartTime = Date.now();        // set the tumbling start time to now
                this.isTumbling = true;                     // set that the ship is tumbling (going back to a new position)

                // stop all movement
                this.setAngularVelocity(0);
                this.setVelocityX(0);
                this.setVelocityY(0);

                // place the ship back to the last safe position
                this.x = this.sensor.safeX;
                this.y = this.sensor.safeY;

                eventsCenter.emit('blockCollide');      // emit event when the ship collides with a block so that the number of collisions can be counted


            }
            else if (data.bodyB.label == 'objective') {

                eventsCenter.emit('objectiveCollide', data.bodyB.gameObject);

            }
            else {
                console.log('collision with unknown object!');
            }

        }

    }

}