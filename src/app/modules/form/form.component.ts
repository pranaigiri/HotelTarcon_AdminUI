import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  //for new phone numebr input on checkout
  form: any = {};
  CountryISO = CountryISO; //for initial selected country enum in international telephone list
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.Bhutan, CountryISO.Nepal, CountryISO.Bangladesh];


  constructor() { }

  ngOnInit() {
  }

  onContactInfoSubmit() {

  }

  onReset() {

  }
}
