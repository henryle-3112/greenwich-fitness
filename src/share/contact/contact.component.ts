import { Component, OnInit } from '@angular/core';
import { Contact } from '@gw-models/core';
import { ContactService } from '@gw-services/core/api/contact/contact.service';
import { Config } from '@gw-config/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  selectedContactContent: Contact;
  isLoadingSpinnerShown: boolean;

  /**
   *
   * @param contactService - inject contactService
   */
  constructor(private contactService: ContactService) {
  }

  ngOnInit(): void {
    this.getSelectedContactContent();
  }

  /**
   * get selected contact's content
   */
  private getSelectedContactContent(): void {
    this.isLoadingSpinnerShown = true;
    const contactId = 1;
    const getContactUrl = `${Config.apiBaseUrl}/${Config.apiContactManagementPrefix}/${Config.apiContacts}/${contactId}`;
    this.contactService.getContact(getContactUrl)
      .subscribe((selectedContactContent: Contact) => {
        if (selectedContactContent) {
          this.selectedContactContent = selectedContactContent;
        }
        this.isLoadingSpinnerShown = false;
      });
  }
}
