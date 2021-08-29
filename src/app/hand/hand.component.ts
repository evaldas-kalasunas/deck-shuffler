import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DeckOpsHandlerService } from './../deck-ops-handler.service';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent implements OnInit {
  public localDeck: Array<string>
  public drawnCards: Array<string>
  public showMessage: Boolean

  @ViewChild('hc',  {static: false}) hc:ElementRef;

  constructor(private renderer: Renderer2,private deckOpsService: DeckOpsHandlerService) {
    this.drawnCards = [];
    this.showMessage = false;
   }

  ngOnInit() {   
  }

  handleDraw(event) {
    this.showMessage = false;
    this.drawnCards = [];
    this.clearHand();
    this.localDeck = this.deckOpsService.getDeck();

    let n = 5;
    let result = new Array(n),
      len = this.localDeck.length,
      taken = new Array(len);
      if (n > len) {
        throw new RangeError("More elements taken than available");
      }
      while(n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = this.localDeck[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
      }
      this.drawnCards = result;
      this.generateCards(result);
  }

  handleClear(event) {
    this.showMessage = false;
    this.drawnCards = [];
    this.clearHand();
  }

  handleSort(event) {
    if (this.drawnCards.length === 0) {
      this.showMessage = true;
    } else {
      this.showMessage = false;
    }
    let mappedCards = this.drawnCards.map(card => {
      return {
        value: this.getCardValue(card),
        color: this.getCardColor(card),
        stringValue: card,
      }
    })
    
    this.drawnCards = mappedCards.sort((a,b) => {
      return a.value - b.value;
    }).map(card => card.stringValue);
   
    this.clearHand();
    this.generateCards(this.drawnCards);
  }

  getCardValue(localCard) {
    const splitted = localCard.split('')[1];
    switch(splitted) {
      case '2':
        return 2;
      case '3':
        return 3;
      case '4':
        return 4;
      case '5':
        return 5;
      case '6':
        return 6;
      case '7':
        return 7;
      case '8':
        return 8;
      case '9':
        return 9;
      case 'T':
        return 10;
      case 'J':
        return 11;
      case 'Q':
        return 12;
      case 'K':
        return 13;
      case 'A':
        return 14;
    }
  }

  getCardColor(localCard) {
    const splitted = localCard.split('')[0];
    switch(splitted) {
      case 'H':
      case 'D':
        return 'R';
      case 'S':
      case 'C':
        return 'B';
    }
  }

  generateCards(hand) {
    for ( let i = 0; i < hand.length; i++) {
      this.generateCard(hand[i]);   
    }
  }

  generateCard(card) {
    const cardDiv = this.renderer.createElement('div');
    const text = this.renderer.createText(`${card}`);
    this.renderer.appendChild(cardDiv, text);
    if (card.includes('H') || card.includes('D')) {
      this.renderer.addClass(cardDiv, `card-base-r`)
    } else {
      this.renderer.addClass(cardDiv, `card-base-b`)
    }

    this.renderer.appendChild(this.hc.nativeElement, cardDiv);
  }

  clearHand() {
    const childElements = this.hc.nativeElement.children;
    // removes HTMLCollection childElements
    while (childElements.length > 0) {
       var childElement = childElements[0];
        childElement.parentNode.removeChild(childElement);
    }
  }

}
