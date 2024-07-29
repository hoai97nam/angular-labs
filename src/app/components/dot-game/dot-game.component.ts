import { afterNextRender, afterRender, Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';

const PIXELS_MOVEMENT = 50;
const POINT_SIZE = 20;
const CONTAINER_SIZE = 500;
const enum AXIS {
  'HORIZONTAL' = 0,
  'VERTICAL' = 1,
}
@Component({
  selector: 'app-dot-game',
  standalone: true,
  imports: [],
  templateUrl: './dot-game.component.html',
  styleUrl: './dot-game.component.css'
})
export class DotGameComponent {
  @ViewChild('point', { static: false }) point!: ElementRef;
  @ViewChild('pointToTouch', { static: false }) pointToTouch!: ElementRef;
  @ViewChild('playingArea', { static: false }) playingArea!: ElementRef;

  position = signal<[number, number]>([0, 0])
  positionPointToTouch = signal<[number, number]>([
    CONTAINER_SIZE - POINT_SIZE,
    CONTAINER_SIZE - POINT_SIZE,
  ]);
  score = signal<number>(0);

  private readonly possiblePositions = new Array(
    CONTAINER_SIZE / PIXELS_MOVEMENT,
  )
    .fill(0)
    .map((v, i) => i * PIXELS_MOVEMENT);
  private readonly possibleX = Array.from(this.possiblePositions);
  private readonly possibleY = Array.from(this.possiblePositions);
  constructor() {
    afterRender(() => {
      this.drawPoint();
      this.drawPointToTouch();
    })
    afterNextRender( ( )=> {
      this.initBoard();
    })
  }
  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft': // left
        this.moveHorizontal(-PIXELS_MOVEMENT);
        break;
      case 'ArrowUp': // up
        this.moveVertical(-PIXELS_MOVEMENT);
        break;
      case 'ArrowRight': // right
        this.moveHorizontal(PIXELS_MOVEMENT);
        break;
      case 'ArrowDown': // down
        this.moveVertical(PIXELS_MOVEMENT);
        break;
    }
  }

  moveHorizontal(amount: number) {
    const maxX = this.point.nativeElement.parentNode.clientWidth;
    this.movePoint(AXIS.HORIZONTAL, amount, maxX);
  }
  moveVertical(amount: number) {
    const maxY = this.point.nativeElement.parentNode.clientHeight;
    this.movePoint(AXIS.VERTICAL, amount, maxY);
  }

  private initBoard() {
    this.playingArea.nativeElement.setAttribute(
      'style',
      `border:3px solid #dedede;`,
    );
    const instructions = document.createElement('div');
    instructions.innerHTML =
      '<p style="font-weight: bolder; font-size:1.2rem;">Using your arrow keys, move the red dot to catch the blue one</p>';
    this.playingArea.nativeElement.parentNode.append(instructions);
  }
  private movePoint(axis: number, amount: number, maxAxisPosition: number) {
    this.position.update(positionItem => {
      const currentAxisValue = positionItem[axis];
      const newAxisValue = currentAxisValue + amount;
      if (newAxisValue >= maxAxisPosition) {
        positionItem[axis] = maxAxisPosition - POINT_SIZE;
      } else if (currentAxisValue === maxAxisPosition - POINT_SIZE) {
        positionItem[axis] = newAxisValue + POINT_SIZE;
      } else if (newAxisValue < 0) {
        positionItem[axis] = 0;
      } else {
        positionItem[axis] = newAxisValue;
      }
      this.hasTouchedPoint();
      return positionItem
    });
  }

  private hasTouchedPoint() {
    const [x, y] = this.position();
    const [xx, yy] = this.positionPointToTouch();
    if (x === xx && y === yy) {
      this.score.update((s) => (s += 1));
      this.movePointToTouch();
    }
  }

  private movePointToTouch() {
    const newX = Math.floor(Math.random() * this.possibleX.length);
    const newY = Math.floor(Math.random() * this.possibleY.length);
    this.positionPointToTouch.set([this.possibleX[newX], this.possibleY[newY]]);
  }

  private drawPoint() {
    const [x, y] = this.position();
    this.point.nativeElement.setAttribute(
      'style',
      `transform: translateY(${y}px) translateX(${x}px)`,
    );
  }
  private drawPointToTouch() {
    const [x, y] = this.positionPointToTouch();
    this.pointToTouch.nativeElement.setAttribute(
      'style',
      `transform: translateY(${y}px) translateX(${x}px)`,
    );
  }

}
