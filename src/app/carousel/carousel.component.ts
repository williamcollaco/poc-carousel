import {
  Component,
  Input,
  OnDestroy,
  TemplateRef,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  KeyValueDiffer,
  KeyValueDiffers
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export enum Direction {
  Next,
  Prev
}

export enum Animation {
  Fade = 'fade',
  Slide = 'slide'
}

export interface ActiveSlides {
  previous: number;
  current: number;
  next: number;
}

@Component({
  selector: 'app-carousel',
  templateUrl: `carousel.component.html`,
  styleUrls: ['./carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideState', [
      state('current', style({
        transform: 'translateX(0%)',
        zIndex: 1
      })),
      state('next', style({
        transform: 'translateX(100%)',
        zIndex: 1
      })),
      state('previous', style({
        transform: 'translateX(-100%)',
        zIndex: 1
      })),
      transition('current => next', animate('400ms ease-out')),
      transition('previous => current', animate('400ms ease-out')),
      transition('current => previous', animate('400ms ease-out')),
      transition('next => current', animate('400ms ease-out')),
    ])
  ]
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input()
  slides;
  @Input()
  animation: Animation = Animation.Fade;
  @Input()
  slideTemplateRef: TemplateRef<any>;
  currentInterval;
  differ: KeyValueDiffer<ActiveSlides, any>;
 
  private _direction: Direction = Direction.Next;
  get direction() {
    return this._direction;
  }
  set direction(direction: Direction) {
    this._direction = direction;
  }

  private _activeSlides: ActiveSlides;
  get activeSlides() {
    return this._activeSlides;
  }
  set activeSlides(activeSlides: ActiveSlides) {
    this._activeSlides = activeSlides;
  }

  constructor(private cd: ChangeDetectorRef, private differs: KeyValueDiffers) { }

  ngOnInit(): void {
    if (this.slides) {
      this.activeSlides = this.getPreviousCurrentNextIndexes(0);
      this.differ = this.differs.find(this.activeSlides).create();   
    }
  }

  ngOnDestroy(): void {
    this.cd.detach();
  }

  select(index: number): void {
    this.activeSlides = this.getPreviousCurrentNextIndexes(index);
    this.direction = this.getDirection(this.activeSlides.current, index);    
    if (this.differ.diff(this.activeSlides)) {
      this.cd.detectChanges();
    }
  }
  isActive(index: number): boolean{
    return (this.activeSlides.current == index);
  }

  getPreviousCurrentNextIndexes(index: number): ActiveSlides {
    const images = this.slides;

    return {
      previous: (index === 0 ? 0 : index - 1) % images.length,
      current: index % images.length,
      next: (index === images.length - 1 ? index : index + 1) % images.length
    };
  }

 getDirection(oldIndex: number, newIndex: number): Direction {
    const images = this.slides;
   
    if (oldIndex === images.length - 1 && newIndex === 0) {
      return Direction.Next;
    } else if (oldIndex === 0 && newIndex === images.length - 1) {
      return Direction.Prev;
    }
    return oldIndex < newIndex ? Direction.Next : Direction.Prev;
  }

  getAnimationSlideState(index: number) {    
    return index === this.activeSlides.current ? 'current' : index === this.activeSlides.next ? 'next' : 'previous'
  }

private swipeCoord?: [number, number];
private swipeTime?: number;

swipe(e: TouchEvent, when: string): void {
  const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
  const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
          const swipe = direction[0] < 0 ? this.select(this.activeSlides.next) : this.select(this.activeSlides.previous);
          
      }
    }
  }
}
