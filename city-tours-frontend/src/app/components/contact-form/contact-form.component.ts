import { ContactService } from './../../services/contact.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-contact-form',
   templateUrl: './contact-form.component.html',
   styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent implements OnInit {
   contactForm: FormGroup;
   isSend: boolean = false;

   constructor(private formBuilder: FormBuilder, private contactService: ContactService) {}

   ngOnInit(): void {
      this.contactForm = this.formBuilder.group({
         name: [null, Validators.required],
         email: this.formBuilder.control(null, [
            Validators.required,
            Validators.pattern('[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*'),
         ]),
         message: [null, Validators.required],
      });
   }

   onSubmit(): void {
      console.log(this.contactForm.value);
      this.contactService.sendContactForm(this.contactForm.value).subscribe(
         (data) => {
            console.log(data);
         },
         (err) => {
            console.log(err);
         }
      );
      this.contactForm.reset();
      this.isSend = true;
   }
}
