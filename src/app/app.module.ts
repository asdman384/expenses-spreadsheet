import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SecurityModule } from 'security';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SecurityModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
