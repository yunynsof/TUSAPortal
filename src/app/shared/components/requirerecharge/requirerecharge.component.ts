import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { FormBuilder, Validators, FormGroup, FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import validator from 'validator';
import swal from 'sweetalert';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface State {

  id: string;
  areaCode: string;
}


declare var $;
@Component({
  selector: 'app-requirerecharge',
  templateUrl: './requirerecharge.component.html',
  styleUrls: ['./requirerecharge.component.scss']
})
export class RequirerechargeComponent implements OnInit {

  telephoneTigo;
  selectedCountry = 1;
  selectedArea;
  nameIcon;
  telephoneUSA;
  telephoneComplete;
  sms;
  rows = 2;
  listCountry: any = [];
  dataCountry: any = [];
  listArea: any = [];
  dataArea: any = [];
  filteredList5;


  constructor(
    private serviceService: ServicesService,
    private formBuilder: FormBuilder,
    private router: Router,
    fb: FormBuilder
  ) {
    this.validations_form = fb.group({
      floatLabel: this.floatLabelControl,
    });

    this.telephoneTigo = localStorage.getItem('idTigo');
    if (this.telephoneTigo == null || this.telephoneTigo == '' || this.telephoneTigo == undefined) {
      this.router.navigate(['generateotp']);
    }
  }

  @ViewChild('form', { static: false }) form: NgForm;
  validations_form: FormGroup;
  floatLabelControl = new FormControl();
  filteredStates: Observable<State[]>;

  states: State[] = [
    {
      id: '1',
      areaCode: '2',
    }
  ];

  ngOnInit(): void {

    this.getCountryCode();
    this.getAreaCode();
    this.obtainNameIcon();
    $(() => {
      $("#testid").keypress(function (evt) {
        evt.preventDefault();
      });
      $("#testid").keydown(function (e) {
        var elid = $(document.activeElement).hasClass('textInput');
        if ((e.keyCode === 8 || e.keyCode === 46) && !elid) {
          return false;
        };
      });
      $("#testid2").keypress(function (evt) {
        evt.preventDefault();
      });
      $("#testid2").keydown(function (e) {
        var elid = $(document.activeElement).hasClass('textInput');
        if ((e.keyCode === 8 || e.keyCode === 46) && !elid) {
          return false;
        };
      });
      $("#areaid").keypress(function (evt) {
        evt.preventDefault();
      });
      $("#areaid").keydown(function (e) {
        var elid = $(document.activeElement).hasClass('textArea');
        if ((e.keyCode === 8 || e.keyCode === 46) && !elid) {
          return false;
        };
      });

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
  require(form) {
    if (this.formValidator()) {
      let telephoneUSAComplete = this.selectedCountry.toString() + this.selectedArea.toString() + this.telephoneUSA.toString();
      let smsFinal = 'Hola, me quede sin saldo, puedes enviarme una recarga desde USA? Ingresa a este link :  https://micuenta.tigo.com.hn/comprar-inter/';
      this.serviceService.postGenerictrx(form.value.telephoneTigo, telephoneUSAComplete, smsFinal).subscribe(
        data => {

          let test = JSON.stringify(data)
          let test2 = JSON.parse(test)
          if (test2.code == 0) {
            swal("Exitoso", test2.description, "success");
          }
        },
        error => {

          if (error.error.code == 1) {
            swal("Lo sentimos", error.error.description + "\n" + "Intente nuevamente", "warning");

          } if (error.error.code == 2) {
            swal("Lo sentimos", error.error.description, "error");
            localStorage.removeItem('idTigo')
            this.router.navigate(['generateotp']);

          } if (error.error.code == 3) {
            swal("Lo sentimos", error.error.description + "\n" + "Intente nuevamente", "warning");
            localStorage.removeItem('idTigo')
            this.router.navigate(['generateotp']);

          } if (error.status == 0) {
            swal("Lo sentimos", "Error en la conexión" + "\n" + "Intente nuevamente", "warning");
          }
        },
        () => {
          setTimeout(() => {
            form.reset();
          }, 500);
          setTimeout(() => {
            this.clearFields();
            this.obtainNameIcon();
          }, 1000);

        }
      );
    }
  }

  getCountryCode() {
    this.serviceService.getCountryCode()
      .then(data => {
        this.dataCountry = data;
        for (let i = 0; i < this.dataCountry.list.length; i++) {
          this.listCountry.push({
            id: this.dataCountry.list[i].id,
            code: this.dataCountry.list[i].code,
            name: this.dataCountry.list[i].name,
            nameIcon: this.dataCountry.list[i].nameIcon
          });
        }
        for (let a = 0; a < this.listCountry.length; a++) {
          if (this.listCountry[a].code == this.selectedCountry) {
            this.nameIcon = this.listCountry[a].nameIcon;
          }
        }
      });
  }

  getAreaCode() {
    this.serviceService.getAreaCode()
      .then(data => {
        this.dataArea = data;
        for (let i = 0; i < this.dataArea.list.length; i++) {
          this.listArea.push({
            id: this.dataArea.list[i].id,
            areaCode: this.dataArea.list[i].areaCode
          });
        }
        this.filteredList5 = this.listArea.slice();
        this.filteredStates = this.floatLabelControl.valueChanges
          .pipe(
            startWith(''),
            map(state => state ? this._filterStates(state) : this.listArea.slice())
          );
      });
  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.listArea.filter(state => state.areaCode.toLowerCase().indexOf(filterValue) === 0);
  }


  obtainNameIcon() {
    for (let a = 0; a < this.listCountry.length; a++) {
      if (this.listCountry[a].code == this.selectedCountry) {
        this.nameIcon = this.listCountry[a].nameIcon;
      }
    }
    this.obtainTelephoneComplete();
    this.loginFormValidator.selectedCountry.empty = '';
  }

  areaValidate = false;
  buttonValidate = true;

  obtainTelephoneComplete() {

    if (this.telephoneUSA != undefined && this.selectedCountry != undefined && this.selectedArea != undefined) {
      if (this.selectedArea > 99 && this.selectedArea < 1000) {
        this.areaValidate = false;
        for (let a = 0; a < this.listArea.length; a++) {
          if (this.listArea[a].areaCode == this.selectedArea) {
            this.telephoneComplete = '+' + this.selectedCountry + ' (' + this.selectedArea + ') ' + this.telephoneUSA;
            this.sms = 'Hola, me quede sin saldo, puedes enviarme una recarga desde USA? Ingresa a este link :  https://micuenta.tigo.com.hn/comprar-inter/'
            this.rows = 4;
            this.areaValidate = false;
            break;
          } else {
            this.areaValidate = true;
          }
        }
      } else {
        this.areaValidate = true;
      }
    }
  }


  validateFieldsForm() {
    let tigoRegex: RegExp = /^[0-9]{8,8}$/
    let usaRegex: RegExp = /^[0-9]{7,7}$/
    let areaRegex: RegExp = /^[0-9]{3,3}$/
    this.validations_form = this.formBuilder.group({
      'telephoneTigo': [null, [Validators.pattern(tigoRegex), Validators.required]],
      'selectedCountry': [null, [Validators.required]],
      'selectedArea': [null, [Validators.pattern(areaRegex), Validators.required]],
      'telephoneUSA': [null, [Validators.pattern(usaRegex), Validators.required]],
      'telephoneComplete': [null, [Validators.required]],
      'sms': [null, [Validators.required]]
    });
  }

  loginFormValidator = {
    telephoneTigo: {
      empty: '',
    },
    selectedCountry: {
      empty: '',
    },
    selectedArea: {
      empty: '',
    },
    telephoneUSA: {
      empty: '',
    },
    telephoneComplete: {
      empty: '',
    },
    sms: {
      empty: '',
    }
  };

  validation_messages = {
    'telephoneTigo': [
      { type: 'pattern', message: 'Debe ser teléfono Tigo, debe tener 8 dígitos' },
      { type: 'required', message: 'Ingrese teléfono Tigo' }
    ],
    'selectedCountry': [
      { type: 'required', message: 'Seleccione país' }
    ],
    'selectedArea': [
      { type: 'required', message: 'Seleccione área' }
    ],
    'telephoneUSA': [
      { type: 'pattern', message: 'Debe ser teléfono válido, debe tener 7 dígitos' },
      { type: 'required', message: 'Ingrese teléfono al cual solicitar' }
    ],
    'telephoneComplete': [
      { type: 'required', message: 'Ingrese teléfono' }
    ],
    'sms': [
      { type: 'required', message: 'Ingrese SMS' }
    ]
  }

  formValidator(): boolean {

    if (this.validations_form.value.telephoneTigo == null || this.validations_form.value.telephoneTigo == '') {
      this.validations_form.value.telephoneTigo = '';
    } if (this.validations_form.value.selectedCountry == null || this.validations_form.value.selectedCountry == '') {
      this.validations_form.value.selectedCountry = '';
    } if (this.validations_form.value.selectedArea == null || this.validations_form.value.selectedArea == '') {
      this.validations_form.value.selectedArea = '';
    } if (this.validations_form.value.telephoneUSA == null || this.validations_form.value.telephoneUSA == '') {
      this.validations_form.value.telephoneUSA = '';
    } if (this.validations_form.value.telephoneComplete == null || this.validations_form.value.telephoneComplete == '') {
      this.validations_form.value.telephoneComplete = '';
    } if (this.validations_form.value.sms == null || this.validations_form.value.sms == '') {
      this.validations_form.value.sms = '';
    }

    if (validator.isEmpty(this.validations_form.value.telephoneTigo.toString())) {
      this.loginFormValidator.telephoneTigo.empty = ' ';
    } else {
      this.loginFormValidator.telephoneTigo.empty = '';
    }

    if (validator.isEmpty(this.validations_form.value.selectedCountry.toString())) {
      this.loginFormValidator.selectedCountry.empty = ' ';
    } else {
      this.loginFormValidator.selectedCountry.empty = '';
    }
    if (validator.isEmpty(this.validations_form.value.selectedArea.toString())) {
      this.loginFormValidator.selectedArea.empty = ' ';
    } else {
      this.loginFormValidator.selectedArea.empty = '';
    }
    if (validator.isEmpty(this.validations_form.value.telephoneUSA.toString())) {
      this.loginFormValidator.telephoneUSA.empty = ' ';
    } else {
      this.loginFormValidator.telephoneUSA.empty = '';
    }
    if (validator.isEmpty(this.validations_form.value.telephoneComplete.toString())) {
      this.loginFormValidator.telephoneComplete.empty = ' ';
    } else {
      this.loginFormValidator.telephoneComplete.empty = '';
    }
    if (validator.isEmpty(this.validations_form.value.sms.toString())) {
      this.loginFormValidator.sms.empty = ' ';
    } else {
      this.loginFormValidator.sms.empty = '';
    }

    if (this.loginFormValidator.telephoneTigo.empty == ' ' || this.loginFormValidator.selectedCountry.empty == ' '
      || this.loginFormValidator.selectedArea.empty == ' ' || this.loginFormValidator.telephoneUSA.empty == ' '
      || this.loginFormValidator.telephoneComplete.empty == ' ' || this.loginFormValidator.sms.empty == ' ') {
      return false;
    } else return true;
  }

  clearFields() {
    this.telephoneTigo = localStorage.getItem('idTigo');
    this.selectedCountry = 1;
    this.rows = 2;
  }

  disableForm() {
    this.validations_form.disable();
  }

  enableForm() {
    this.validations_form.enable();
  }
  back(){
    localStorage.removeItem('idTigo')
  }
}
