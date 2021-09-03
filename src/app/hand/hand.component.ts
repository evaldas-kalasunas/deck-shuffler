import { Component, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter, AfterViewInit, OnChanges, DoCheck } from '@angular/core';
import { DeckOpsHandlerService } from './../deck-ops-handler.service';
import { IcardInterface } from '../IDeckShufflerInterface';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})

export class HandComponent implements OnInit {
  public localDeck: Array<IcardInterface>
  public drawnCards: Array<IcardInterface>
  public showMessage: Boolean
  public showSelectedMessage: Boolean
  public showNoCardsMessage: Boolean
  public cardForm: FormGroup
  public numberOfCards = new FormControl('');
  public selectedCardNumber: Number

  @ViewChild('hc',  {static: false}) hc:ElementRef;
  // @Output() updatedDeck = new EventEmitter<IcardInterface[]> ();

  constructor(private renderer: Renderer2,private deckOpsService: DeckOpsHandlerService, private formBuilder: FormBuilder) {
    this.drawnCards = [];
    this.showMessage = false;
    this.showSelectedMessage = false;
    this.showNoCardsMessage = false;
    this.selectedCardNumber = 0;

    this.deckOpsService.deckSubject.subscribe(deck => {
      this.localDeck = deck;
    })
   }

  ngOnInit() {   
    this.cardForm = this.formBuilder.group({
      numberOfCards: [this.numberOfCards]
    })
  }

  handleDrawRandom(event) {
    this.showMessage = false;
    this.showSelectedMessage = false
    this.drawnCards = [];
    this.clearHand();    
    this.helperHandleDraw(5, event);
  }

  handleDrawSelected(event) {
    const selectedCards = this.cardForm.controls['numberOfCards'].value;

    this.showMessage = false;
    this.drawnCards = [];
    this.clearHand();
    if (Object.keys(selectedCards).length > 0 || selectedCards === 0) { // when cards not selected input is obj, once selected = value
      this.showSelectedMessage = true
    } else {
      this.showSelectedMessage = false
      this.helperHandleDraw(selectedCards, event);
    }
  }

  helperHandleDraw(numOfCards=5, event) {

    let result = new Array(numOfCards),
      len = this.localDeck.length,
      taken = new Array(len);
      if (numOfCards > len) {
        this.showNoCardsMessage = true;
        throw new RangeError("More elements taken than available");
      }
      this.showNoCardsMessage = false;
      while(numOfCards--) {
        const x = Math.floor(Math.random() * len);
        result[numOfCards] = this.localDeck[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
      }
      this.drawnCards = result;
      this.deckOpsService.setSelectedCards(this.drawnCards)

      this.generateCards(result);
      
  }

  handleClear(event) {
    this.showMessage = false;
    this.showNoCardsMessage = false;
    this.drawnCards = [];
    this.deckOpsService.setSelectedCards(this.drawnCards);
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
