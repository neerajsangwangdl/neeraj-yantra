import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown'
import { ProductPaginData } from 'src/app/models/product-pagin-data';
import { Paging } from 'src/app/models/paging';
import { ProductService } from 'src/app/services/Product/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import imageCompression from 'browser-image-compression';


@Component({
  selector: 'app-product-insert-trainee',
  templateUrl: './product-insert-trainee.component.html',
  styleUrls: ['./product-insert-trainee.component.scss']
})
export class ProductInsertTraineeComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  // dropdownList:any[] = [];
  selectedProducts: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  productList: any;
  productId: number;
  PRODUCT_COUNT: any;
  product: any;
  productInsertForm: FormGroup;
  addNew: number;


  ngOnInit(): void {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ProductId',
      textField: 'Name',
      // selectAllText:'Select All',
      // unSelectAllText:'Unselect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      limitSelection: 1,
    };

    this.route.queryParams.subscribe(res => {
      if (res['addNew']) {
        this.addNew = parseInt(res['addNew']);
      }

    })
    this.searchProduct();
    this.productForm();

  }

  productSelect(item: any) {
    // console.log(item);
    this.productId = item.ProductId;
    this.getProduct();
    this.patchForm();
  }

  productDeselect(item: any) {
    console.log(item);
    this.product = "";
    this.productForm();
  }

  productForm() {
    this.productInsertForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.max(20)]],
      subcatagory: [""],
      youtubeLink: [""],
      description: [""],
      deliveryCharges: [""],
      price: [""],
      searchTags: [""],
      landingRate: [""],
      stock: [""],
      newPrice: [""],
      newStock: [""],
      warranty: [""],
      image: [""],
    });
    if (!this.addNew) {
      this.productInsertForm.controls['price'].disable();
    }
  }

  searchProduct() {
    let filterObj: Paging = new Paging();
    filterObj.DepartmentId = 0;
    filterObj.CategoryId = 0;
    filterObj.SubCategoryId = 0;
    filterObj.PageSize = 100;
    filterObj.ReceivedCount = 0;
    filterObj.CurrentPage = 1;
    // filterObj.SearchString = this.searchText;
    let productPagingObj: ProductPaginData = new ProductPaginData();
    this.productService.getProductList(filterObj).subscribe(a => {
      productPagingObj = a.data as ProductPaginData;
      if (productPagingObj.Products) {
        this.productList = productPagingObj.Products.length ? productPagingObj.Products : [{ 'ProductId': 0, 'Name': 'No Data' }];
        // console.log(this.productList);

        this.PRODUCT_COUNT = productPagingObj.ProductCount[0].ProductCount;
      }
    });
  }


  getProduct() {
    for (let index = 0; index < this.productList.length; index++) {
      // const element = this.productList[index];
      if (this.productList[index].ProductId == this.productId) {
        this.product = this.productList[index];
        console.log(this.product);
      }
    }
  }

  patchForm() {
    this.productInsertForm.patchValue({
      name: this.product['Name'] || '',
      subcatagory: this.product['CatagoryId'] || '',
      youtubeLink: this.product['videolink'] || 'null',
      description: this.product['Description'] || '',
      deliveryCharges: this.product['DiscountPercentage'] || '',
      price: this.product['Price'] || '',
      searchTags: this.product['Tags'] || '',
      landingRate: this.product['landing_rate'] || '',
      stock: this.product['stock'] || '',
      newPrice: this.product['Price'] || '',
      newStock: this.product['newstock'] || '',
      warranty: this.product['WarrantyInDays'] || '',
    })

  }

  uploadImageHandler(event) {
    // Instruction: remove fileControlName from Image field of HTML file.
    // TODO: remove fileControlName from HTML.
    var image = event.target.files[0];
    console.log(image);
    // console.log('blob instance ', image instanceof Blob);
    console.log('File actual size: ', (image.size / 1024), 'KB');

    var options = {
      maxSizeMB: 0.1,
      useWebWorker: true,
    };
  
    imageCompression(image, options)
      .then((compressedFile) => {
        console.log(compressedFile);
        console.log('Compressed File size: ', (compressedFile.size / 1024), 'KB');

        this.productInsertForm.get('image').setValue(compressedFile);
      })
      .catch(function (error) {
        console.log(error.message);
      })
  }


  formSubmit() {
    console.log(this.productInsertForm.value);
  }

}
