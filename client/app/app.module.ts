import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { CatService } from './services/cat.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AppComponent } from './app.component';
import { CatsComponent } from './cats/cats.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { CardComponent } from './card/card.component';
import { StartComponent } from './start/start.component';
import { NavComponent } from './nav/nav.component';
import { RulesComponent } from './rules/rules.component';
import { FullRulesComponent } from './full-rules/full-rules.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { BetComponent } from './bet/bet.component';
import { TokenInterceptor } from './token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CatsComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent,
    HomeComponent,
    CardComponent,
    StartComponent,
    NavComponent,
    RulesComponent,
    FullRulesComponent,
    LeaderboardComponent,
    BetComponent
  ],
  imports: [
    RoutingModule,
    SharedModule,
    PdfViewerModule
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    CatService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
