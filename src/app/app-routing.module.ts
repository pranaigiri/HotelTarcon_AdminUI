import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AuthGuard } from './helpers/auth.guard';
import { FormComponent } from './modules/form/form.component';
import { SidebarComponent } from './modules/sidebar/sidebar.component';
import { LayoutComponent } from './modules/layout/layout.component';

const routes: Routes = [
  // { path: "", component: LoginComponent, pathMatch: "full" },
  // { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  // { path: "form", component: FormComponent, canActivate: [AuthGuard] },
  // { path: "sidebar", component: SidebarComponent, canActivate: [AuthGuard] },
  // { path: "**", component: LoginComponent },

  { path: '', component: LoginComponent },
  { 
    path: 'admin', 
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent,canActivateChild: [AuthGuard] },
      { path: 'form', component: FormComponent ,canActivateChild: [AuthGuard] },
      // Add more routes as needed
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
