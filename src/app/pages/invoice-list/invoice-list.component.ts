import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { HttpService } from '../../services/http.service';
import { InvoiceService } from '../../services/invoice.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-collection-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  collectionData = [];
  currentInvoiceList = [];
  displayedColumns: string[] = ['name', 'total', 'pay', 'extra', 'minus'];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource();

  isLoading = false;

  supplierName;
  lineNumber;
  disableLineNumber = false;
  lineNumberList;
  suppliers;
  showMonthlyTextBox: boolean;
  minus_milk_value = '';
  extra_milk_value = '';
  columnDefs = [
    { headerName: 'Make', field: 'make' },
    { headerName: 'Model', field: 'model' },
    {
      headerName: 'Price',
      field: 'price',
      valueGetter: function(params) {
        console.log('====', params);
        return params.data;
      },
      valueSetter: function(params) {
        if (params.data.price !== params.newValue) {
          console.log('====', params);
          params.data.b = params.newValue;
          return true;
        } else {
          return false;
        }
      }
    }
  ];

  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 }
  ];
  constructor(
    private _http: HttpService,
    private _utils: UtilsService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private _invoiceService: InvoiceService,
    private router: Router
  ) {
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/examples/thumbup-icon.svg'
      )
    );
  }
  ngOnInit() {
    this.getInvoice();
    this.showMonthlyTextBox = localStorage.showMonthlyTextBox
      ? JSON.parse(localStorage.showMonthlyTextBox)
      : false;
    // this.displayedColumns = ['name', 'total', 'pay'];
    this.columnDefs = [
      { headerName: 'Name', field: 'name' },
      { headerName: 'Amount', field: 'amount' },
      { headerName: 'Supplier', field: 'supplier' }
    ];
    // if (this.showMonthlyTextBox) {
    //   // this.displayedColumns = ['name', 'total', 'extra', 'minus'];
    //   this.columnDefs = [
    //     { headerName: 'name', field: 'name' },
    //     { headerName: 'total', field: 'total' },
    //     { headerName: 'extra', field: 'extra' },
    //     { headerName: 'minus', field: 'minus' }
    //   ];
    // }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  updateAmount(amountValue: number, customer, type) {
    const customerInvoice = {};

    customerInvoice['amount'] = amountValue;
    if (type === 'invoice_amount') {
      customerInvoice['customerDocId'] = customer['_id'];
      customerInvoice['amount'] = -amountValue;
      this._invoiceService.updateInvoice(customerInvoice).subscribe(res => {
        this.getInvoice();
      });
    } else {
      customerInvoice['id'] = customer['_id'];
      customerInvoice['operation'] = type;
      this._invoiceService
        .updateExtraAndMinusAmount(customerInvoice)
        .subscribe(res => {
          console.log(res);
          this._utils.openSnackBar('Update successfully!');
          this.minus_milk_value = '';
          this.extra_milk_value = '';
        });
    }
  }
  editInvoice(customer_id) {
    this.router.navigate(['/edit-invoice', customer_id]);
  }
  changeSupplier(supplier) {
    this.supplierName = supplier.value;
    localStorage.supplierName = JSON.stringify(this.supplierName);
    this.disableLineNumber = false;
    if (this.supplierName === 'all') {
      this.disableLineNumber = true;
    }
    this.dataSource.data = this._invoiceService.getFilterData(
      this.supplierName,
      'all'
    );
    this.lineNumberList = this._invoiceService.getLinesDependOnSupplier(
      this.supplierName
    );
    this.currentInvoiceList = this.dataSource.data;
  }
  changeLine(lineNumber) {
    this.lineNumber = lineNumber.value;
    localStorage.lineNumber = JSON.stringify(this.lineNumber);
    this.dataSource.data = this._invoiceService.getFilterData(
      this.supplierName,
      this.lineNumber
    );
    this.currentInvoiceList = this.dataSource.data;
  }

  getInvoice() {
    this.isLoading = true;
    const that = this;
    this._invoiceService.getInvoiceList().subscribe(data => {
      this.supplierName = localStorage.supplierName
        ? JSON.parse(localStorage.supplierName)
        : 'all';
      if (this.supplierName === 'all') {
        this.disableLineNumber = true;
      }
      this.lineNumber = localStorage.lineNumber
        ? JSON.parse(localStorage.lineNumber)
        : 'all';
      this.suppliers = this._invoiceService.supplierList(this.supplierName);
      this.lineNumberList = this._invoiceService.getLinesDependOnSupplier(
        this.supplierName
      );
      if (this.supplierName === 'all' && this.lineNumber === 'all') {
        // this.dataSource.data = data;
        that.rowData = data;
      } else {
        // this.dataSource.data = this._invoiceService.getFilterData(
        //   this.supplierName,
        //   this.lineNumber
        // );
        that.rowData = this._invoiceService.getFilterData(
          this.supplierName,
          this.lineNumber
        );
        console.log(that.rowData);
      }
      // this.currentInvoiceList = this.dataSource.data;
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
  }

  filterNotPaidCustomer(isPaid) {
    if (isPaid.checked) {
      this.dataSource.data = this.currentInvoiceList.filter(
        customer =>
          (customer.invoice ? customer.invoice.payment[0].amount : 0) > 0
      );
    } else {
      this.dataSource.data = this.currentInvoiceList;
    }
  }

  findDailyMonthUpdate(event) {
    if (event.checked) {
      this.showMonthlyTextBox = true;
      localStorage.showMonthlyTextBox = true;
      this.displayedColumns = ['name', 'total', 'extra', 'minus'];
    } else {
      this.showMonthlyTextBox = false;
      localStorage.showMonthlyTextBox = false;
      this.displayedColumns = ['name', 'total', 'pay'];
    }
    return this.showMonthlyTextBox;
  }

  // convertDataToAgGridFormat(invoiceList) {
  //   let agGridObject = {};
  //   invoiceList.map((invoice)=>{

  //   })
  // }
}
