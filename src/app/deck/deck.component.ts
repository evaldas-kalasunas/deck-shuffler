import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { DeckOpsHandlerService } from './../deck-ops-handler.service';
import { IcardInterface } from './../IDeckShufflerInterface';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})

export class DeckComponent implements OnInit, AfterViewInit {
  public deckObj: Array<IcardInterface>;
  public hidden: Boolean;
  
  constructor(private renderer: Renderer2, private deckOpsService: DeckOpsHandlerService) { 
    this.deckObj = [];
    this.hidden = false;

    this.deckOpsService.selectedCardsSubject.subscribe(selectedCards => {
      this.deckObj = this.deckObj
        .filter(({ stringValue: id1, displayValue: key1 }) => !selectedCards
          .some(({ stringValue: id2, displayValue: key2 }) =>  id2 === id1 && key1 === key2));
      this.clearDeck();
      this.deckOpsService.setDeck(this.deckObj);
      this.generateCards(this.deckObj);

      if (selectedCards.length === 0) {
        this.clearDeck();
        this.deckObj = this.deckOpsService.buildDeck(); 
        this.deckOpsService.setDeck(this.deckObj);
        this.generateCards(this.deckObj);
      }
    })
   }

  @ViewChild('dc',  {static: false}) dc:ElementRef;

  ngOnInit() {}

  ngAfterViewInit() {
    this.deckObj = this.deckOpsService.buildDeck(); 
    this.deckOpsService.setDeck(this.deckObj);
    this.generateCards(this.deckObj);
  }

  clearDeck() {
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
    const cardDiv = this.deckOpsService.buildCard(card, this.renderer)

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
    for (var i = this.deckObj.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this.deckObj[i];
        this.deckObj[i] = this.deckObj[j];
        this.deckObj[j] = temp;
    }
    this.deckOpsService.setDeck(this.deckObj);

    // above algorithm using es6
    // for (let i = array.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [array[i], array[j]] = [array[j], array[i]];
    //     }
    this.generateCards(this.deckObj);
  }

  handleReset(event) {
    this.clearDeck();
    this.deckObj = this.deckOpsService.buildDeck();
    this.deckOpsService.setDeck(this.deckObj);
    this.deckOpsService.resetHand(true); // to clear hand
    this.generateCards(this.deckObj);
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
