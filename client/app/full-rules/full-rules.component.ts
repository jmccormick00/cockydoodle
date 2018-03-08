import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-full-rules',
  templateUrl: './full-rules.component.html',
  styleUrls: ['./full-rules.component.css']
})
export class FullRulesComponent implements OnInit {
  pdfSrc: string = 'assets/rules.pdf';
  constructor() { }

  ngOnInit() {
  }

}
