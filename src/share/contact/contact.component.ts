import {Component, OnInit} from '@angular/core';
import {Contact} from '@gw-models/core';
import {ContactService} from '@gw-services/core/api/contact/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  // selected contact's content
  selectedContactContent: Contact;

  // check loading component is showing or not
  loading: boolean;

  /**
   *
   * @param contactService - inject contactService
   */
  constructor(private contactService: ContactService) {
  }

  ngOnInit() {
    // get selected contact content
    this.getSelectedContactContent();
  }

  /**
   * get selected contact's content
   */
  private getSelectedContactContent() {
    // show loading component
    this.loading = true;
    // get selected contact content
    this.contactService.getContactById(1)
      .subscribe((selectedContactContent: Contact) => {
        if (selectedContactContent) {
          this.selectedContactContent = selectedContactContent;
        }
        // hide loading componnet
        this.loading = false;
      });
  }
}
