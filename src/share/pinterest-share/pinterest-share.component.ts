import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pinterest-share',
  templateUrl: './pinterest-share.component.html',
  styleUrls: ['./pinterest-share.component.css']
})
export class PinterestShareComponent implements OnInit, AfterViewInit {

  @Input() url = location.href;
  @Input() media = '';
  @Input() description = '';

  constructor() {
    // load pinterest sdk if required
    const url = 'https://assets.pinterest.com/js/pinit.js';
    if (!document.querySelector(`script[src='${url}']`)) {
      const script = document.createElement('script');
      script.src = url;
      script['data-pin-build'] = 'parsePins';
      document.body.appendChild(script);
    }
  }

  ngAfterViewInit(): void {
    // render pin it button
    window['parsePins'] && window['parsePins']();
  }

  ngOnInit(): void {
  }

}
