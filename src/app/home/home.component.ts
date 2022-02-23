import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IQuote } from '../models/IQuote';
import { DataService } from '../services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog-component';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<IQuote>();
  quotes: IQuote[] = [];
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('secondDialog', { static: true })
  ConfirmDelete!: TemplateRef<any>;
  
  ConfirmDeleteDialog!: MatDialogRef<any, any>;
  desc= 'asc';
  colmnsort ='QuoteID';
  counter = 1;
  pagesSize = 0;
  totalEntries: number = 0;
  fromEntries: number = 0;
  toEntries = 0;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 15, 25];
  pageIndexArray: number[] = [];
  activePage = 1;
  item:any;
  pageItemsArray:number[]=[];
   quote:IQuote = {QuoteID:0,  QuoteType:'', Description:'', DueDate:'', Premium:0, Sales:''};
 


  constructor(private route: Router, private dataservice: DataService, public dialog: MatDialog) {


  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent,{data:{}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngAfterViewInit() {
   // this.congfigPaginator();
   }

  ngOnInit(): void {
    
   // let x = this.getPageList(15, 1, 5)
   debugger;
   
   this.quotes = [];
   let qts = JSON.stringify(localStorage.getItem('quotes'));
   this.quotes = JSON.parse(JSON.parse(qts));
 if(!this.quotes){
   
     this.quotes = this.dataservice.quotes;
     
     localStorage.setItem('quotes', JSON.stringify(this.quotes));
     this.dataSource.data = this.quotes;
    this.displayedColumns = Object.keys(this.dataSource.data[0]);
    this.displayedColumns.push('Actions');
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSizeOptions[0];
    this.paginator.length = this.dataSource.data.length;
  
    this.congfigPaginator();
    this.calculateRangeLabel() ;
    
   
 } else{
  this.dataSource.data = this.quotes;
  this.displayedColumns = Object.keys(this.dataSource.data[0]);
  this.displayedColumns.push('Actions');
  this.paginator.pageIndex = 0;
  this.paginator.pageSize = this.pageSizeOptions[0];
  this.paginator.length = this.dataSource.data.length;

  this.congfigPaginator();
  this.calculateRangeLabel() ;
  
 }
 


  //  this.quotes = this.dataservice.fillData();
    this.dataSource.data = this.quotes;
    this.displayedColumns = Object.keys(this.dataSource.data[0]);
    this.displayedColumns.push('Actions');
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSizeOptions[0];
    this.paginator.length = this.dataSource.data.length;
  
    this.congfigPaginator();
    this.calculateRangeLabel() ;
    this.dataservice.datachanged.subscribe(x=>{
      debugger
      let desc = this.desc;
      let colmnsort = this.colmnsort 
      this.quotes = x;
      this.dataSource.data = this.quotes;
    this.displayedColumns = Object.keys(this.dataSource.data[0]);
    this.displayedColumns.push('Actions');
    // this.paginator.pageIndex = 0;
    // this.paginator.pageSize = this.pageSizeOptions[0];
    // this.paginator.length = this.dataSource.data.length;
  
    this.congfigPaginator();
    this.calculateRangeLabel() ;
    this.sortData(desc, colmnsort);
    })

  }

  Logout() {
    this.route.navigate([''])
  }
  previousitem() {
    this.paginator.previousPage();
    this.congfigPaginator();
    this.calculateRangeLabel();
    this.activePage = this.paginator.pageIndex +1; 
  
  }

  nextitem() {
    this.paginator.nextPage();
    this.congfigPaginator();
    this.calculateRangeLabel();
    
    this.activePage = this.paginator.pageIndex +1;
  
  }

  congfigPaginator() {
    this.pageIndexArray =[];
     for(let i=1; i<=this.paginator.getNumberOfPages();i++){
       if((this.paginator.pageIndex+1) < this.paginator.length){
         this.pageIndexArray.push(i)
       }
     }

  this.buildPage(this.paginator.pageIndex);
    this.dataSource.paginator = this.paginator;
   // this.paginator.pageSize = this.pagesSize;  // come back and make change

    //this.paginator.pageSizeOptions = this.pageSizeOptions;
    //this.fromEntries = 1;
    //this.toEntries = this.paginator.pageSize;
    //this.totalEntries = this.dataSource.data.length;


  }

  
  selectPage(psg: number) {
    
    this.paginator.pageIndex = (psg - 1);
   this.congfigPaginator();
   this.calculateRangeLabel();
  
   this.activePage = this.paginator.pageIndex +1;
  }

 

addTask(){
  
  const dialogRef = this.dialog.open(DialogComponent,{data:null});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
}

updateTask(task: any){
  let  quote:IQuote = {QuoteID:0,  QuoteType:'', Description:'', DueDate:'', Premium:0, Sales:''};
 quote.QuoteID = task['QuoteID'];
 quote.Sales = task['Sales'];
 quote.Description = task['Description'];
 quote.Premium = task['Premium'];
 quote.QuoteType = task['QuoteType'];
 quote.DueDate = task['DueDate'];
 
  const dialogRef = this.dialog.open(DialogComponent,{data:quote});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
}

details(task:any){
    this.route.navigate(['quote-details'],{queryParams:{id:task['QuoteID']}});
}
deleteTask(task:any){
 // const dialogRef = this.dialog.open(,)
 this.ConfirmDeleteDialog = this.dialog.open(this.ConfirmDelete);
 
 this.ConfirmDeleteDialog.afterClosed().subscribe(dialogResult =>{
  
  
  if(dialogResult){
     this.dataservice.deleteItem(task['QuoteID']);
   }
 });

}
onDismissDelete(){
 this.ConfirmDeleteDialog.close(false);
}
onConfirmDelete(){
  this.ConfirmDeleteDialog.close(true);
}


setPageSizeOptions(event: Event) {
  this.paginator.pageSize= +( event.target as HTMLInputElement).value;
 // this.activePage = 1;
  this.paginator.pageIndex = 0;
  this.congfigPaginator();
  this.calculateRangeLabel();  
 
}


calculateRangeLabel(){
  let pageIndex = this.paginator.pageIndex;
  let pageSize = this.paginator.pageSize;
  let length = this.paginator.length;
  this.item ="Showing "+ this.paginator._intl.getRangeLabel(pageIndex,pageSize,length).replace(String.fromCharCode(8211), 'to');

 
}


buildPage(currPage:number) {
  this.pageItemsArray = [];
  let arry:number[] =[];
  if(this.paginator.getNumberOfPages()>=7){
    const trimStart = currPage;
    const trimEnd = trimStart + 7;
    
    const maxlength = this.pageIndexArray.length-1;

    if(trimStart >= this.pageIndexArray[this.pageIndexArray.length-6]){
      arry= this.pageIndexArray.slice( this.pageIndexArray[this.pageIndexArray.length-6], this.pageIndexArray.length);
    } else{
      if (trimEnd > (maxlength) ) {
        arry = this.pageIndexArray.slice(maxlength-7, this.pageIndexArray[maxlength]);
      } else{
        arry= this.pageIndexArray.slice(trimStart, trimEnd);
      }
    }
   
   
  } else{
    arry = this.pageIndexArray;
  }
 
 this.pageItemsArray = arry;
 console.log(this.pageItemsArray)
}


OrderBy(x: any){
  this.colmnsort =x.value;
this.sortData(this.desc, this.colmnsort);
}
checkboxChange(event:any){
  debugger;
 if(event.checked){
   this.desc ='desc';
 } else{
   this.desc = 'asc';
 }

 this.sortData(this.desc, this.colmnsort);

}

compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

sortData(_direction:string, _active: string) {
  let SortDirection:SortDirection= "";
  if(_direction=='asc'){
    SortDirection = 'asc';
  } else{
    SortDirection = 'desc'
  }

  let sort:Sort ={direction:SortDirection, active:_active}
  const data = this.dataSource.data.slice();
  if (!sort.active || sort.direction === '') {
    this.dataSource.data = data;
    return;
  }
 
  this.dataSource.data = data.sort((a, b) => {
    const x = _active;
    const isAsc = sort.direction === 'asc';
    debugger
    switch (sort.active) {
      case 'QuoteID':
        return this.compare(a['QuoteID'], b['QuoteID'], isAsc);
      case 'QuoteType':
        return this.compare(a['QuoteType'], b['QuoteType'], isAsc);
      case 'Description':
        return this.compare(a['Description'], b['Description'], isAsc);
      case 'Sales':
        return this.compare(a['Sales'], b['Sales'], isAsc);
      case 'DueDate':
        return this.compare(a['DueDate'], b['DueDate'], isAsc);
      case _active:
        return this.compare(a['Premium'], b['Premium'], isAsc);
         
      default:
        return 0;
    }
 
});

}


applyFilter(event: Event) {
  debugger;
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  this.congfigPaginator();
  this.calculateRangeLabel();  
 
}
}

// this.activePage =  1 + this.paginator.pageIndex ;

// calculateFromToPages() {
  
//   if (this.paginator.hasPreviousPage()) {

//     this.fromEntries = (this.paginator.pageSize) * (this.paginator.pageIndex + 1) - (this.paginator.pageSize - 1);

//   } else {
//     this.fromEntries = 1;
//   }

//   if (this.paginator.hasNextPage()) {

//     this.toEntries = (this.paginator.pageSize) * (this.paginator.pageIndex + 1);
//     if(this.toEntries> this.paginator.length){
//       this.toEntries = this.paginator.length;
//     }
//   }
//   else {
//     this.toEntries = (this.paginator.length)
//   }
// }


// calculatePages() {

//   let numberofpages = this.paginator.getNumberOfPages();

//   this.pageIndexArray = [];
//   if (this.paginator.pageIndex >= 5 && (this.paginator.pageIndex <= numberofpages - 5)) {
//     let counter = -2;
//     for (let x = 1; x <= 5; x++) {
//       let y = this.paginator.pageIndex;
//       this.pageIndexArray.push(y + counter);
//       counter++;
//     }

//   }
//   if (this.paginator.pageIndex > numberofpages - 5) {
//     this.pageIndexArray = [numberofpages - 1, numberofpages - 2, numberofpages - 3, numberofpages - 4, numberofpages - 5];

//   }
//   if (this.paginator.pageIndex < 5) {
//     this.pageIndexArray = [1, 2, 3, 4, 5];
//   }
//   debugger;
//   this.pageIndexArray.sort(function (a, b) {
//     return a - b;
//   });

//   this.congfigPaginator();
// }
