import { Component, OnInit, Input, Directive } from '@angular/core';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'], 
})
export class CardComponent implements OnInit {

  ticker: boolean;
  title: string;
  @Input() type: string;
  @Input() currency: string;
  constructor() { 
    
  }

  ngOnInit() {
    if (this.currency != "n/a") {
      this.title = this.currency + " " + this.type;
    }
    else {
      this.title = this.type;
    }
  }
}
