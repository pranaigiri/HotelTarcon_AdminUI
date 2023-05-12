import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  { path: "", component: LoginComponent, pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "**", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
