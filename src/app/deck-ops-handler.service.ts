import { Injectable } from '@angular/core';
import { IcardInterface } from './IDeckShufflerInterface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeckOpsHandlerService {
  public deck: Array<string>
  public deckObj: Array<IcardInterface>
  public selectedCards: Array<IcardInterface>

  public selectedCardsSubject = new Subject<IcardInterface[]>();
  public deckSubject = new Subject<IcardInterface[]>();
  public resetHandSubject = new Subject<Boolean>();

  constructor() {
    this.deck = [];
    this.deckObj = [];
    this.selectedCards = [];
   }

   getDeck(): Array<IcardInterface> {
    return this.deckObj;
   }

   setDeck(deck): void {
     return this.deckSubject.next(deck)
   }

   setSelectedCards(selectedCards) {
    return this.selectedCardsSubject.next(selectedCards);
   }
   resetHand(shouldResetHand) {
    return this.resetHandSubject.next(shouldResetHand);
   }

   buildDeck(): Array<IcardInterface> {
    this.deckObj = [];
    const suits = ['S', 'C', 'D', 'H'];
    const cards = [
      { displayValue: '2', value: 2}, 
      { displayValue: '3', value: 3}, 
      { displayValue: '4', value: 4},
      { displayValue: '5', value: 5},
      { displayValue: '6', value: 6},
      { displayValue: '7', value: 7},
      { displayValue: '8', value: 8},
      { displayValue: '8', value: 8},
      { displayValue: 'T', value: 10},
      { displayValue: 'J', value: 11},
      { displayValue: 'Q', value: 12},
      { displayValue: 'K', value: 13},
      { displayValue: 'A', value: 14}];

    for (let i = 0 ; i < suits.length; i++) {
      for  (let j = 0; j < cards.length; j++ ) {
        this.deckObj.push({
          value: cards[j].value,
          displayValue: cards[j].displayValue,
          suit: suits[i],
          color: suits[i] === 'D' || suits[i] === 'H' ? 'red' : 'black',
          stringValue: `${suits[i]}${cards[j].displayValue}`  
        })
      }
    }
    
    return this.deckObj;
   }

   buildCard(card, renderer) {
    const cardDiv = renderer.createElement('div');
    const topDiv = renderer.createElement('div');
    const topDivSymbol = renderer.createText(`${card.suit}`);
    renderer.appendChild(topDiv, topDivSymbol);
    const middleDiv = renderer.createElement('div');
    const text = renderer.createText(`${card.stringValue}`);
    const bottomDiv = renderer.createElement('div');
    const bottomDivSymbol =  renderer.createText(`${card.displayValue}`);
    renderer.appendChild(middleDiv, text);
    renderer.appendChild(bottomDiv, bottomDivSymbol);
    renderer.appendChild(cardDiv, topDiv);
    renderer.appendChild(cardDiv, middleDiv)
    renderer.appendChild(cardDiv, bottomDiv);
    if (card.suit === 'H' || card.suit === 'D') {
      renderer.addClass(cardDiv, `card-base-r`)
    } else {
      renderer.addClass(cardDiv, `card-base-b`)
    }

    return cardDiv;
   }
   
}
