import {Component, OnInit} from '@angular/core';
import {AboutService} from '@gw-services/core/api/about/about.service';
import {About} from '@gw-models/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  // selected about's content
  selectedAboutContent: About;

  // check loading component is showing or not
  loading: boolean;

  /**
   *
   * @param aboutService - inject aboutService
   */
  constructor(private aboutService: AboutService) {
  }

  ngOnInit() {
    // get about's content
    this.getAboutContent();
  }

  /**
   * get about's content
   */
  private getAboutContent() {
    // show loading component
    this.loading = true;
    // get about's content
    this.aboutService.getAboutById(1)
      .subscribe((selectedAboutContent: About) => {
        if (selectedAboutContent) {
          this.selectedAboutContent = selectedAboutContent;
        }
        // hide loading component
        this.loading = false;
      });
  }
}
