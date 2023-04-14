import Phaser from 'phaser';

// Ship class
export default class Ship extends Phaser.Physics.Matter.Sprite {

    private readonly speed: number;
    private readonly rotationSpeed: number;
    private turnFactor: number;                 // factor which is used to indicate the direction it is moving (1: clockwise, -1: counterclockwise)

    // Constructor
    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene.matter.world, x, y, 'ship');

        // set speed
        this.speed = 2;            // speed of the movement
        this.rotationSpeed = 0.03;         // speed of the rotation

        // set the properties of the body
        this.setBounce(0);
        this.setFrictionAir(0);

        // set the movement direction
        this.angle = 270;               // face the ship to look upwards
        this.turnFactor = -1;           // set it first to counterclockwise
        this.changeDirection();         // then change the direction

    }

    changeDirection(): void {

        this.turnFactor = this.turnFactor * -1;

        this.setAngularVelocity(this.turnFactor * this.rotationSpeed);

        console.log('I change direction!');

    }

    move(): void {

        // Calculating the angle in which the ship is facing in radians.
        // Phaser uses a right hand clockwise rotation system, where 0 is right, 90 is down.
        // As the vector component calculation is based on counter-clockwise angles the angle needs to be set to negative for the calculation.
        const angleRad = -this.angle * Math.PI / 180;

        // setting the velocity
        this.setVelocityX(this.speed * Math.cos(angleRad));
        this.setVelocityY(-this.speed * Math.sin(angleRad));

    }

}