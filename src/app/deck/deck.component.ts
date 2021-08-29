import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { DeckOpsHandlerService } from './../deck-ops-handler.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})

export class DeckComponent implements OnInit, AfterViewInit {
  public deck: Array<string>;
  public hidden: Boolean;
  
  constructor(private renderer: Renderer2, private deckOpsService: DeckOpsHandlerService) { 
    this.deck = [];
    this.hidden = false;
   }

  @ViewChild('dc',  {static: false}) dc:ElementRef;
  ngOnInit() {}

  ngAfterViewInit() {
    this.createDeck(); 
    this.deckOpsService.setDeck(this.deck); 
    this.generateCards(this.deck);
  }

  createDeck() {
    const suits = ['S', 'C', 'D', 'H'];
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

    for (let i = 0 ; i < suits.length; i++) {
      for  (let j = 0; j < cards.length; j++ ) {
        this.deck.push(`${suits[i]}${cards[j]}`)
      }
    }
    
    return this.deck;
  }

  clearDeck() {
    this.deck = [];
    const childElements = this.dc.nativeElement.children;
    // removes HTMLCollection childElements
    while (childElements.length > 0) {
       var childElement = childElements[0];
        childElement.parentNode.removeChild(childElement);
    }
  }

  generateCards(deck) {
    for ( let i = 0; i < deck.length; i++) {
      this.generateCard(deck[i]);   
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

    if (this.hidden) {
      this.renderer.addClass(cardDiv, `hidden-card`) 
    } else {
      this.renderer.removeClass(cardDiv, `hidden-card`) 
    }
    this.renderer.appendChild(this.dc.nativeElement, cardDiv);
    
  }

  // Durstenfeld shuffle,
  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  handleShuffle(event) {
    this.clearDeck();
    this.createDeck();
    for (var i = this.deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this.deck[i];
        this.deck[i] = this.deck[j];
        this.deck[j] = temp;
    }
    this.deckOpsService.setDeck(this.deck);
    // above algorithm using es6
    // for (let i = array.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [array[i], array[j]] = [array[j], array[i]];
    //     }
    this.generateCards(this.deck);
  }

  handleReset(event) {
    this.clearDeck();
    this.createDeck();
    this.deckOpsService.setDeck(this.deck);
    this.generateCards(this.deck);
  }

  handleHideUnhide(event) {
    this.hidden = !this.hidden;
    const childElements = this.dc.nativeElement.children;
    // hides
    if (this.hidden) {
      for(let child of childElements) {
        this.renderer.addClass(child, 'hidden-card');
      }
    } else {
      for(let child of childElements) {
        this.renderer.removeClass(child, 'hidden-card');
      }
    }
  }

}
