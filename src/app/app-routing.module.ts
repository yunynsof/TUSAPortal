import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequirerechargeComponent } from './shared/components/requirerecharge/requirerecharge.component'
import { GenerateotpComponent } from './shared/components/generateotp/generateotp.component'
import { ValidateotpComponent } from './shared/components//validateotp/validateotp.component'

const routes: Routes = [
{path: '', redirectTo: 'generateotp', pathMatch: 'full' },
{path: 'requirerecharge', component: RequirerechargeComponent},
{path: 'generateotp', component: GenerateotpComponent},
{path: 'validateotp', component: ValidateotpComponent},
{path: '', redirectTo: '/generateotp', pathMatch: 'full' },
{path: '**', redirectTo: '/generateotp'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
