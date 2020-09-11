import { Component } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TUSAPortal';
  constructor(
    private bnIdle: BnNgIdleService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.bnIdle.startWatching(300).subscribe((res) => {
      if (res) {
        localStorage.removeItem('idTigo')
        this.router.navigate(['generateotp']);
      }
    })
  }
}
