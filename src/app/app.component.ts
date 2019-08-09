import {Component, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'greenwich-fitness';

  ngOnDestroy(): void {
    // clear all local storage when the app was destroyed
    localStorage.clear();
  }
}
