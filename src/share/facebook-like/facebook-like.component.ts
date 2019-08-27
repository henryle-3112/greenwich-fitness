import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-facebook-like',
  templateUrl: './facebook-like.component.html',
  styleUrls: ['./facebook-like.component.css']
})
export class FacebookLikeComponent implements OnInit, AfterViewInit {
  @Input() url = location.href;

  constructor() {

  }

  ngAfterViewInit(): void {
    // render facebook button
    window['FB'] && window['FB'].XFBML.parse();
  }

  ngOnInit(): void {
    // initialise facebook sdk after it loads if required
    if (!window['fbAsyncInit']) {
      window['fbAsyncInit'] = function () {
        window['FB'].init({
          appId: '637862946640486',
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v3.1'
        });
      };
    }

    // load facebook sdk if required
    const url = 'https://connect.facebook.net/en_US/sdk.js';
    if (!document.querySelector(`script[src='${url}']`)) {
      const script = document.createElement('script');
      script.src = url;
      document.body.appendChild(script);
    }
  }

}
