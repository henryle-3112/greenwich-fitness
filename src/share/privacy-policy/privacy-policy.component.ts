import { Component, OnInit } from '@angular/core';
import { PrivacyPolicyService } from '@gw-services/core/api/policy/privacy-policy.service';
import { PrivacyPolicy } from '@gw-models/core';
import { Config } from '@gw-config/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
  selectedPrivacyPolicyContent: PrivacyPolicy;
  isLoadingSpinnerShown: boolean;

  /**
   *
   * @param privacyPolicyService - inject privacyPolicyService
   */
  constructor(private privacyPolicyService: PrivacyPolicyService) {
  }

  ngOnInit() {
    this.getSelectedPrivacyPolicyContent();
  }

  /**
   * get selected privacy policy content
   */
  private getSelectedPrivacyPolicyContent() {
    this.isLoadingSpinnerShown = true;
    const privacyPolicyId = 1;
    const privacyPolicyUrl = `${Config.apiBaseUrl}/
${Config.apiPrivacyPolicyManagementPrefix}/
${Config.apiPrivacyPolicies}/${privacyPolicyId}`;
    this.privacyPolicyService.getPrivacyPolicy(privacyPolicyUrl)
      .subscribe((selectedPrivacyPolicyContent: PrivacyPolicy) => {
        if (selectedPrivacyPolicyContent) {
          this.selectedPrivacyPolicyContent = selectedPrivacyPolicyContent;
        }
        this.isLoadingSpinnerShown = false;
      });
  }
}
