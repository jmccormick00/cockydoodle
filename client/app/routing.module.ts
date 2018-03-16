import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CatsComponent } from './cats/cats.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { StartComponent } from './start/start.component';
import { RulesComponent } from './rules/rules.component';
import { FullRulesComponent } from './full-rules/full-rules.component';
import { BetComponent } from './bet/bet.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MybetsComponent } from './mybets/mybets.component';

import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'full-rules', component: FullRulesComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'mybets', component: MybetsComponent},
  { path: 'leaderboard', component: LeaderboardComponent},
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardLogin] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardAdmin] },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class RoutingModule {}
