import { Component, HostListener, AfterViewInit } from '@angular/core';
import { ResizeService } from '../resize.service';

@Component({
  selector: 'app-resizehandler',
  templateUrl: './resizehandler.component.html',
  styleUrls: ['./resizehandler.component.css']
})
export class ResizehandlerComponent implements AfterViewInit {

  constructor(private resizeSvc: ResizeService) { }

  ngOnInit() {
  }

  @HostListener("window:resize", [])
  onResize() {
    this.detectScreenSize();
  }

  ngAfterViewInit() {
    this.detectScreenSize();
  }

  private detectScreenSize() {
    let width = window.innerWidth;
    let isMobile = false;
    if(width < 570)
      isMobile = true;
    this.resizeSvc.onResize(isMobile);
  }

}
