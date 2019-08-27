import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-twitter-share',
  templateUrl: './twitter-share.component.html',
  styleUrls: ['./twitter-share.component.css']
})
export class TwitterShareComponent implements OnInit, AfterViewInit {

  @Input() url = location.href;
  @Input() text = '';

  constructor() {
    // load twitter sdk if required
    const url = 'https://platform.twitter.com/widgets.js';
    if (!document.querySelector(`script[src='${url}']`)) {
      const script = document.createElement('script');
      script.src = url;
      document.body.appendChild(script);
    }
  }

  ngAfterViewInit(): void {
    // render tweet button
    // window['twttr'] && window['twttr'].widgets.load();
  }

  ngOnInit(): void {
  }

}
