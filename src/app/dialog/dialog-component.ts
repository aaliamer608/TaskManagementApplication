import { Component, Inject, OnInit } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA , MatDialog} from "@angular/material/dialog";
import { IQuote } from "../models/IQuote";
import * as _moment from 'moment';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataService } from "../services/data.service";
const moment = _moment;




@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css'],
    
  })
export class DialogComponent implements OnInit{
  val:string='';
  quote:IQuote = {QuoteID:0,  QuoteType:'', Description:'', DueDate:'', Premium:0, Sales:''};
  date = moment();
  title="Add New Quote";
  dialog_form:any;

  get QuoteID() { return this.dialog_form.get('QuoteID'); }
  get Sales () { return this.dialog_form.get('Sales'); }

  get QuoteType() { return this.dialog_form.get('QuoteType'); }
  get DueDate() { return this.dialog_form.get('DueDate'); }
  get Premium() { return this.dialog_form.get('Premium'); }
  get Description() { return this.dialog_form.get('Description'); }
   
  hours = 12;
  minutes = 0;

  
  constructor(@Inject(MAT_DIALOG_DATA) public data: IQuote, private dataservice:DataService) {
  
  }

  ngOnInit(): void {
      this.dialog_form = new FormGroup({
        'QuoteID': new FormControl( 0, [Validators.required]),
        'Sales': new FormControl('', [Validators.required]),
        'QuoteType': new FormControl( '', [Validators.required]),
        'DueDate': new FormControl(new Date(), [Validators.required]),
        'Premium': new FormControl('' , [Validators.required]),
        'Description': new FormControl('', [Validators.required]),
        
         
      });

      if(this.data){
        debugger;
         this.QuoteID.value = this.data.QuoteID; 
         this.QuoteType.value = this.data.QuoteType;
         this.Sales.value = this.data.Sales;
         this.Premium.value = this.data.Premium;
         this.Description.value= this.data.Description;
         this.DueDate.value = new Date( this.data.DueDate);
         this.title = "Update Quote"
      } else{
        this.title = "Add New Quote";
      }
   
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    debugger;
    this.date = moment(event.value);
     this.quote.DueDate = this.date.month().toString()+'/' + this.date.day().toString()+'/' + this.date.year().toString();
  }


  SubmitForm(){
    this.quote.Description = this.Description.value;
    this.quote.Sales = this.Sales.value;
    this.quote.Premium = this.Premium.value;
    this.quote.QuoteType = this.QuoteType.value;
    this.quote.QuoteID = this.QuoteID.value;
    this.quote.DueDate =  moment( this.DueDate.value).format('MM/DD/YYYY').toString();   

    if(this.title == 'Update Quote'){
      this.dataservice.updateData(this.quote.QuoteID, this.quote);
     }
     else{
       this.dataservice.AddData(this.quote);
     }

}
}