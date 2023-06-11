import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HTML2PDFService {
  url = environment.apiUrl || localStorage.getItem('ServerUrl');
  invoice = '<!DOCTYPE html><html><head> <meta charset="utf-8"/> <title>ApniDukan Invoice</title> <style>.invoice-box{max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; color: #555;}.invoice-box table{width: 100%; line-height: inherit; text-align: left;}.invoice-box table td{padding: 5px; vertical-align: top;}.invoice-box table tr td:nth-child(2){text-align: right;}.invoice-box table tr.top table td{padding-bottom: 20px;}.invoice-box table tr.top table td.title{font-size: 45px; line-height: 45px; color: #333;}.invoice-box table tr.information table td{padding-bottom: 40px;}.invoice-box table tr.heading td{background: #eee; border-bottom: 1px solid #ddd; font-weight: bold;}.invoice-box table tr.details td{padding-bottom: 20px;}.invoice-box table tr.item td{border-bottom: 1px solid #eee;}.invoice-box table tr.item.last td{border-bottom: none;}.invoice-box table tr.total td:nth-child(2){border-top: 2px solid #eee; font-weight: bold;}@media only screen and (max-width: 600px){.invoice-box table tr.top table td{width: 100%; display: block; text-align: center;}.invoice-box table tr.information table td{width: 100%; display: block; text-align: center;}}/** RTL **/ .invoice-box.rtl{direction: rtl; font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;}.invoice-box.rtl table{text-align: right;}.invoice-box.rtl table tr td:nth-child(2){text-align: left;}</style></head><body> <div class="invoice-box"> <table cellpadding="0" cellspacing="0"> <tr class="top"> <td colspan="2"> <table> <tr> <td class="title"> <img src="https://apnidukan.yantraworld.in/assets/yantra-logo.png" style="width: 35%; max-width: 300px"/> </td><td> <b>ApniDukan Global</b><br/> Tower 8, Provident Kenworth, Rajender Nagar<br>Hyderabad, 500030<br/> India <br></td></tr></table> </td></tr><tr class="information"> <td colspan="2"> <table> <tr> <td id="date"> </td><td> <b>Contact Sales</b><br/> yantraworld@gmail.com </td></tr></table> </td></tr></table> </div><div id="content"> </div></body><script>window.onload=()=>{const event=new Date("05 October 2011 14:48 UTC"); console.log(event.toString()); document.getElementById("date").innerHTML="<b>Invoice Generated On: </b> <br>" + event.toString().substring(0, 28);}</script></html>';
  constructor(private http: HttpClient) { 
    // import jspdf from 'jspdf';
    // var doc = new jspdf();

    //   doc.html(document.body, {
    //     callback: function (doc) {
    //       doc.save();
    //     }
    //   });
  }

  getInvoiceTemplate(): Observable<any> {
    return this.http.get<any[]>(`http://localhost:4200/assets/templates/invoice.html`);
  }
  captureScreen(data, name) {

    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      // var imgWidth = 208;   
      // var pageHeight = 295;    
      // var imgHeight = canvas.height * imgWidth / canvas.width;  
      // var heightLeft = imgHeight;  

      // const contentDataURL = canvas.toDataURL('image/png')  
      var doc = new jspdf();

      doc.html(document.body, {
        callback: function (doc) {
          doc.save();
        }
      });
      // var position = 0;  
      // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, '','FAST')  
      // pdf.save(name + '.pdf'); // Generated PDF   
      const contentDataURL = canvas.toDataURL('image/png')
      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link)
      link.setAttribute('download', 'invoice' + '.png');
      link.setAttribute('href', contentDataURL.replace("image/png", "image/octet-stream"));
      link.click();
    })
  }
}
