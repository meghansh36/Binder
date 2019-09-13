import { Component, OnInit, ViewChild, ElementRef, QueryList, AfterContentInit,
  AfterViewInit, ContentChildren, Renderer2, ChangeDetectorRef } from '@angular/core';
import { SliderItemDirective } from '../slider-item.directive';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit, AfterContentInit, AfterViewInit {
  @ContentChildren(SliderItemDirective, { read: ElementRef }) items: QueryList<ElementRef>;

  @ViewChild('slides', { read: ElementRef, static: true }) slidesContainer: ElementRef;
  constructor(private renderer: Renderer2, private cd: ChangeDetectorRef) { }

  private slidesIndex = 0;
  height: number;
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
    setTimeout(() => {
      this.height = this.slidesContainer.nativeElement.offsetHeight;
      console.log(this.height);
      this.cd.detectChanges();
    }, 2000)
  }

  onClickLeft() {
    this.slidesContainer.nativeElement.scrollLeft -= this.currentItem.nativeElement.offsetWidth + 300;
    if (this.slidesIndex > 0) {
      this.slidesIndex--;
    }
  }

  onClickRight() {
    this.slidesContainer.nativeElement.scrollLeft += this.currentItem.nativeElement.offsetWidth + 300;

    if (this.slidesIndex < this.items.length - 1) {
      this.slidesIndex++;
    }
  }

}
