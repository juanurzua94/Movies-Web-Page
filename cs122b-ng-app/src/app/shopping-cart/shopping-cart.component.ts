import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../movies-list/movies-list.service';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent implements OnInit{

  shoppingCart : object;
  items : any[];
  totalPrice : number;

  added : boolean;
  subtracted : boolean;
  deleted : boolean;

  constructor(private service: ConfigService, private router: Router){
    this.totalPrice = 0;
    this.added = false;
    this.subtracted = false;
    this.deleted = false;

  }

  ngOnInit(){
    if(this.service.isLoggedIn() == "N")
      this.router.navigate(['api/login']);
    else {
        this.shoppingCart = this.service.getShoppingCart();

        this.items = Object.entries(this.shoppingCart);

        this.addPrices();
    }
  }

  removeItem(data: string){
      this.subtracted = true;
      if(this.added)
        this.added = false;
      if(this.deleted)
        this.deleted = false;
      this.shoppingCart[data]['quantity']--;
      this.items = Object.entries(this.shoppingCart);
      this.totalPrice = 0;
      this.addPrices();

  }

  addItem(data: string){
    this.added = true;
      if(this.subtracted)
        this.subtracted = false;
      if(this.deleted)
        this.deleted = false;
    this.shoppingCart[data]['quantity']++;
      this.items = Object.entries(this.shoppingCart);
      this.totalPrice = 0;
      this.addPrices();

  }

  deleteItem(data: string){
    this.deleted = true;
      if(this.added)
        this.added = false;
      if(this.subtracted)
        this.subtracted= false;
    delete this.shoppingCart[data];
    this.items = Object.entries(this.shoppingCart);
    this.totalPrice = 0;
    this.addPrices();
  }

  initiatePaymentPage(){
    this.service.updateShoppingCart(this.shoppingCart);
    this.service.setPayTotal(this.totalPrice);
    this.router.navigate(['api/pay']);
  }

  private addPrices(){
    for(let i = 0; i < this.items.length; ++i){
      let tempPrice = this.items[i][1]['quantity'] * 9.99;
      this.items[i].push(tempPrice);
      this.totalPrice += tempPrice;
    }
  }

}
