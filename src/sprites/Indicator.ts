import Phaser from 'phaser';
import Objective from "./Objective";
import Ship from "./Ship";
import gameOptions from "../helper/gameOptions";

// Block class
export default class Indicator extends Phaser.GameObjects.Sprite {

    private readonly ship: Ship;                    // ship object
    private readonly objective: Objective;          // objective object to which the indicator should show
    private readonly line: Phaser.Geom.Line;        // line between the two objects
    private readonly indicatorRectangle: Phaser.Geom.Rectangle;       // rectangle which is a bit smaller than the game area. On this rectangle the indicator will be drawn
    private readonly distanceToBoundary: number;    // distance between the indicator (center) and the boundary (in pixels)

    // Constructor
    constructor(scene: Phaser.Scene, ship: Ship, objective: Objective) {

        super(scene, 0, 0, 'indicator');

        // initialize properties
        this.ship = ship;
        this.objective = objective;
        this.line = new Phaser.Geom.Line(this.ship.x, this.ship.y, this.objective.x, this.objective.y);
        this.distanceToBoundary = gameOptions.indicatorDistance * gameOptions.gameWidth;
        this.indicatorRectangle = new Phaser.Geom.Rectangle(0,0,1, 1);

        // set color (the same as the objective
        this.setTint(this.objective.tintTopLeft);           // this.objective.tint does not work, as it is only a setter

        this.setDepth(3);

    }

    update() {

        // update the line between the ship and the objective
        this.line.setTo(this.ship.x, this.ship.y, this.objective.x, this.objective.y);

        // update the rectangle on which the indicator is drawn (just a bit smaller than the game area)
        const gameArea = this.scene.cameras.main.worldView;     // get the game boundaries as rectangle
        this.indicatorRectangle.setPosition(gameArea.x + this.distanceToBoundary, gameArea.y + this.distanceToBoundary);
        this.indicatorRectangle.setSize(gameArea.width - 2 * this.distanceToBoundary, gameArea.height - 2 * this.distanceToBoundary)

        // check if the line crosses any of the game boundaries (currently visible play area)
        // if yes, then the objective is outside the game area and the indicator should be displayed
        if (Phaser.Geom.Intersects.GetLineToRectangle(this.line, gameArea).length < 1) {        // if there is any intersection between the line and the game area

            this.setVisible(false);     // make the indicator invisible when there is no intersection as then the objective is visible (within the game area)

        }
        else {

            this.setVisible(true);      // make the indicator visible

            const drawingPoint = Phaser.Geom.Intersects.GetLineToRectangle(this.line, this.indicatorRectangle)[0];   // get the intersection point (the return is an array, but there should be always only one intersection, therefore we always take the first one) between the line and the indicator rectangle

            this.setPosition(drawingPoint.x, drawingPoint.y);                                           // set the position of the indicator

            this.setAngle(Phaser.Math.RadToDeg(Phaser.Geom.Line.Angle(this.line)) + 90);                // set the angle (+90 degrees, as the image points upwards, but Phasers 0° angle is on the x axis.

        }

    }

}