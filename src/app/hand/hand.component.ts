import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DeckOpsHandlerService } from './../deck-ops-handler.service';
import { IcardInterface } from '../IDeckShufflerInterface';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})

export class HandComponent implements OnInit {
  public localDeck: Array<IcardInterface>
  public drawnCards: Array<IcardInterface>
  public showMessage: Boolean

  @ViewChild('hc',  {static: false}) hc:ElementRef;

  constructor(private renderer: Renderer2,private deckOpsService: DeckOpsHandlerService) {
    this.drawnCards = [];
    this.showMessage = false;
   }

  ngOnInit() {   
  }

  handleDrawRandom(event) {
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

  handleDrawSelected(event) {
    
  }

  handleClear(event) {
    this.showMessage = false;
    this.drawnCards = [];
    this.clearHand();
  }

  handleSort(event) {
    let sortedHand = [];
    let sortedRed = [];
    let sortedBlack = [];
    if (this.drawnCards.length === 0) {
      this.showMessage = true;
    } else {
      this.showMessage = false;
    }

    for (let i = 0; i < this.drawnCards.length; i++) {
      if (this.drawnCards[i].color === 'red') {
        sortedRed.unshift(this.drawnCards[i]);
      } else {
        sortedBlack.push(this.drawnCards[i]);
      }
    }

    sortedRed = sortedRed.sort((a,b) => a.value > b.value ? 1 : -1);
    sortedBlack =  sortedBlack.sort((a,b) => a.value > b.value ? 1 : -1);
    sortedHand = sortedRed.concat(sortedBlack)
    this.clearHand();
    this.generateCards(sortedHand);
  }

  generateCards(hand) {
    for ( let i = 0; i < hand.length; i++) {
      this.generateCard(hand[i]);   
    }
  }

  generateCard(card) {
    const cardDiv = this.deckOpsService.buildCard(card, this.renderer)

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
