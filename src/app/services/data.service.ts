import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IQuote } from '../models/IQuote';

@Injectable({
  providedIn: 'root'
})
export class DataService {
quotes:IQuote[] = [];
datachanged:Subject<IQuote[]> = new Subject<IQuote[]>();
 
constructor( private http:HttpClient) {
   this.LoadQuotes();
   }

getData(){
   return  this.http.get<IQuote[]>('assets/data.json')
     
}

fillData(){
  this.getData();
  return this.quotes;
}

updateData(id:number, quote:IQuote){
  debugger;
  let xx = this.quotes;
  let x =  this.quotes.findIndex(q=>q.QuoteID == id);
 this.quotes[x] = quote;
 localStorage.setItem('quotes', JSON.stringify(this.quotes));
 this.datachanged.next(this.quotes);
}
AddData(quote:IQuote){
  let id  = (this.quotes.sort( (a,b)=> a.QuoteID-b.QuoteID)).length + 1;
quote.QuoteID = id;
this.quotes.push(quote);
localStorage.setItem('quotes', JSON.stringify(this.quotes));
this.datachanged.next(this.quotes);

}

deleteItem(id:number){
  debugger;
  let x =  this.quotes.findIndex(q=>q.QuoteID == id);
 
  this.quotes.splice(x, 1);
  localStorage.setItem('quotes', JSON.stringify(this.quotes));
this.datachanged.next(this.quotes);

}



LoadQuotes() {
  debugger;
  this.quotes = [];
  let qoutes = JSON.stringify(localStorage.getItem('quotes'));
  this.quotes = JSON.parse(JSON.parse(qoutes));
  console.log(this.quotes);

  
 
  if (!this.quotes) {
    this.http.get<IQuote[]>('assets/data.json').subscribe(data => {
      debugger;
      this.quotes = data;
      localStorage.setItem('quotes', JSON.stringify(this.quotes));
    });
  }


}
}

