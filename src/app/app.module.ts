import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SecurityModule, SecurityService } from 'security';
import {
  LocalStorageService,
  StorageService,
} from 'src/shared/services/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initGapi, initSecurity } from './init-factories';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SecurityModule, AppRoutingModule],
  providers: [
    { provide: StorageService, useClass: LocalStorageService },
    {
      provide: APP_INITIALIZER,
      useFactory: initSecurity,
      deps: [SecurityService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initGapi,
      deps: [SecurityService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
