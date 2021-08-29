import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeckOpsHandlerService {
  public deck: Array<string>

  constructor() {
    this.deck = [];
   }

   getDeck(): Array<string> {
    return this.deck;
   }

   setDeck(deck): void {
    this.deck = deck;
   }
}
