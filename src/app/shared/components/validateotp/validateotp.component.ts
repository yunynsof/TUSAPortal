import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import validator from 'validator';
import swal from 'sweetalert';

declare var $;
@Component({
  selector: 'app-validateotp',
  templateUrl: './validateotp.component.html',
  styleUrls: ['./validateotp.component.scss']
})
export class ValidateotpComponent implements OnInit {

  data: any;
  codeOtp;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceService: ServicesService,
    private formBuilder: FormBuilder
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state;
      } else {
        this.router.navigate(['generateotp']);
      }
    });
  }

  @ViewChild('form', { static: false }) form: NgForm;
  validations_form: FormGroup;

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
      window.onbeforeunload = function (event) {
        event.returnValue = "Seguro que desea abandonar la transacción";
      };
    });
    this.validateFieldsForm();
  }

  validate(form) {
    if (this.formValidator()) {

      this.serviceService.validateOTP(this.data, form.value.codeOtp).then(
        data => {

          let test = JSON.stringify(data)
          let test2 = JSON.parse(test)

          if (test2.action == 'OTP Correcto') {
            localStorage.setItem('idTigo', this.data);
            this.router.navigate(['requirerecharge']);

          } 
        });
    }
  }

  sendAgain() {
    this.serviceService.generateOTP(504 + this.data).subscribe(
      data => {
      },
      error => {
        swal("Lo sentimos", "No se logro enviar el código." + "\n" + "Intente nuevamente", "warning");
      }
    );
  }

  validateFieldsForm() {
    let tigoRegex: RegExp = /^[\s\S]{6,6}$/
    this.validations_form = this.formBuilder.group({
      'codeOtp': [null, [Validators.pattern(tigoRegex), Validators.required]],
    });
  }

  loginFormValidator = {
    codeOtp: {
      empty: '',
    }
  };

  formValidator(): boolean {

    if (this.validations_form.value.codeOtp == null || this.validations_form.value.codeOtp == '') {
      this.validations_form.value.codeOtp = '';
    }

    if (validator.isEmpty(this.validations_form.value.codeOtp.toString())) {
      this.loginFormValidator.codeOtp.empty = ' ';
    } else {
      this.loginFormValidator.codeOtp.empty = '';
    }

    if (this.loginFormValidator.codeOtp.empty == ' ') {
      return false;
    } else return true;
  }

  goBack() {
    window.history.back();
  }
}
