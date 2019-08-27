import { Component, OnInit } from '@angular/core';
import { AboutService } from '@gw-services/core/api/about/about.service';
import { About } from '@gw-models/core';
import { Config } from '@gw-config/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  selectedAboutContent: About;
  isLoadingSpinnerShown: boolean;

  /**
   *
   * @param aboutService - inject aboutService
   */
  constructor(private aboutService: AboutService) {
  }

  ngOnInit(): void {
    // get about's content
    this.getAboutContent();
  }

  /**
   * get about's content
   */
  private getAboutContent(): void {
    this.isLoadingSpinnerShown = true;
    const aboutId = 1;
    const getAboutUrl = `${Config.apiBaseUrl}/${Config.apiAboutManagementPrefix}/${Config.apiAbouts}/${aboutId}`;
    this.aboutService.getAbout(getAboutUrl)
      .subscribe((selectedAboutContent: About) => {
        if (selectedAboutContent) {
          this.selectedAboutContent = selectedAboutContent;
        }
        this.isLoadingSpinnerShown = false;
      });
  }
}
