import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { FormBuilder, Validators, FormGroup, FormControl, NgForm } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import validator from 'validator';
import swal from 'sweetalert';

declare var $;
@Component({
  selector: 'app-generateotp',
  templateUrl: './generateotp.component.html',
  styleUrls: ['./generateotp.component.scss']
})
export class GenerateotpComponent implements OnInit {

  constructor(
    private serviceService: ServicesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.validations_form = formBuilder.group({
      floatLabel: this.floatLabelControl,
    });
  }

  @ViewChild('form', { static: false }) form: NgForm;
  validations_form: FormGroup;
  floatLabelControl = new FormControl('always');

  ngOnInit(): void {

    $(() => {

      $('input').on('keypress', function (event) {
        var regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
          event.preventDefault();
          return false;
        }
      });

    });
    this.validateFieldsForm();
  }

  telephoneTigo;
  selectedCountry = 'honduras'
  responseValidateTel: any = [];

  generate(form) {
    if (this.formValidator()) {
      this.serviceService.getValidateTel(form.value.telephoneTigo)
        .then(data => {
          this.responseValidateTel = data;
          let test = JSON.stringify(data)
          let test2 = JSON.parse(test)

          if (test2.code == 4) {
            this.serviceService.getCount(form.value.telephoneTigo).then(data => {
              this.serviceService.generateOTP(504 + form.value.telephoneTigo).subscribe(
                data => {

                  let navigationExtras: NavigationExtras = {
                    state: form.value.telephoneTigo
                  };
                  this.router.navigate(['validateotp'], navigationExtras);
                },
                error => {
                  swal("Lo sentimos", "No se logro enviar el código." + "\n" + "Intente nuevamente", "warning");
                }
              );
            }
            );
          }
        });
    }
  }

  pagar() {

  }

  validateFieldsForm() {
    let tigoRegex: RegExp = /^[\s\S]{8,8}$/
    this.validations_form = this.formBuilder.group({
      'telephoneTigo': [null, [Validators.pattern(tigoRegex), Validators.required]],
    });
  }

  loginFormValidator = {
    telephoneTigo: {
      empty: '',
    }
  };

  validation_messages = {
    'telephoneTigo': [
      { type: 'pattern', message: 'Debe ser teléfono Tigo, debe tener 8 dígitos' },
      { type: 'required', message: 'Ingrese teléfono Tigo' }
    ]
  }

  formValidator(): boolean {

    if (this.validations_form.value.telephoneTigo == null || this.validations_form.value.telephoneTigo == '') {
      this.validations_form.value.telephoneTigo = '';
    }

    if (validator.isEmpty(this.validations_form.value.telephoneTigo.toString())) {
      this.loginFormValidator.telephoneTigo.empty = ' ';
    } else {
      this.loginFormValidator.telephoneTigo.empty = '';
    }

    if (this.loginFormValidator.telephoneTigo.empty == ' ') {
      return false;
    } else return true;
  }
}
