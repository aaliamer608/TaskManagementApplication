import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuote } from '../models/IQuote';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-quote-details',
  templateUrl: './quote-details.component.html',
  styleUrls: ['./quote-details.component.css']
})
export class QuoteDetailsComponent implements OnInit {
  quote: IQuote = { QuoteID: 0, QuoteType: '', Description: '', DueDate: '', Premium: 0, Sales: '' };
   quotes:IQuote[]= [];
  constructor(private activatedroute: ActivatedRoute, private dataservice: DataService) {
    this.quotes = this.dataservice.quotes;

   }

  ngOnInit(): void {
    
    this.activatedroute.queryParams.subscribe((params) => {
      let id = +params['id'];
        let x = this.quotes.findIndex(x => x.QuoteID == +params['id'])
        this.quote = this.quotes[x];
      
    })
  }

}
