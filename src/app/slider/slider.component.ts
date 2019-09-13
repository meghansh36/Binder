import { Component, OnInit, ViewChild, ElementRef, QueryList, AfterContentInit, AfterViewInit, ContentChildren } from '@angular/core';
import { SliderItemDirective } from '../slider-item.directive';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit, AfterContentInit, AfterViewInit {
  @ContentChildren(SliderItemDirective, { read: ElementRef }) items: QueryList<ElementRef>;

  @ViewChild('slides', { read: ElementRef, static: true }) slidesContainer: ElementRef;
  constructor() { }

  private slidesIndex = 0;

  get currentItem(): ElementRef {
    return this.items.find((item, index) => index === this.slidesIndex);
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    console.log('items', this.items);
  }

  ngAfterViewInit() {
    console.log('slides', this.slidesContainer);
  }

  onClickLeft() {
    this.slidesContainer.nativeElement.scrollLeft -= this.currentItem.nativeElement.offsetWidth;
    if (this.slidesIndex > 0) {
      this.slidesIndex--;
    }
  }

  onClickRight() {
    this.slidesContainer.nativeElement.scrollLeft += this.currentItem.nativeElement.offsetWidth;

    if (this.slidesIndex < this.items.length - 1) {
      this.slidesIndex++;
    }
  }

}
