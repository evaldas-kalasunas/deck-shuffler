import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DeckComponent } from './deck/deck.component';
import { HandComponent } from './hand/hand.component';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { DeckOpsHandlerService } from './deck-ops-handler.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DeckComponent,
    HandComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule 
  ],
  providers: [DeckOpsHandlerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
