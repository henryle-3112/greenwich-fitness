import {Component, OnInit} from '@angular/core';
import {PrivacyPolicyService} from '@gw-services/core/api/policy/privacy-policy.service';
import {PrivacyPolicy} from '@gw-models/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  // selected privacy policy content
  selectedPrivacyPolicyContent: PrivacyPolicy;

  // check loading component is showing or not
  loading: boolean;

  /**
   *
   * @param privacyPolicyService - inject privacyPolicyService
   */
  constructor(private privacyPolicyService: PrivacyPolicyService) {
  }

  ngOnInit() {
    // get selected privacy policy content
    this.getSelectedPrivacyPolicyContent();
  }

  /**
   * get selected privacy policy content
   */
  private getSelectedPrivacyPolicyContent() {
    // show loading component
    this.loading = true;
    // get selected privacy policy content
    this.privacyPolicyService.getPrivacyPolicyById(1)
      .subscribe((selectedPrivacyPolicyContent: PrivacyPolicy) => {
        if (selectedPrivacyPolicyContent) {
          this.selectedPrivacyPolicyContent = selectedPrivacyPolicyContent;
        }
        // hide loading component
        this.loading = false;
      });
  }
}
