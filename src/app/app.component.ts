import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AppService} from "./app.service";

import Swal from 'sweetalert2';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],

})
export class AppComponent {
    currency = '$';
    form = this.fb.group({
        order: ["", Validators.required],
        name: ["", Validators.required],
        phone: ["", Validators.required],
        message: ['', Validators.required],
    })

    productsData= [
        {
            image: "1.png",
            title: "Cheddar & Bacon Burger",
            text: "Crispy beef patty, bun, tomato, Cheddar cheese, bacon, red onion, iceberg lettuce, mayonnaise, ketchup, cheese sauce.",
            price: 8,
            basePrice:8,
            grams: 360,
        },
        {
            image: "2.png",
            title: "BBQ Chicken and Bacon Burger",
            text: "Sesame seed brioche bun, chicken patty, Cheddar cheese, tomato, pickled cucumber, pickled onion, Romaine lettuce, bacon, BBQ sauce.",
            price: 7,
            basePrice:7,
            grams: 390,
        },
        {
            image: "3.png",
            title: "Double Beef Burger",
            text: "Two beef patties, Cheddar cheese, Romaine lettuce, pickled cucumbers, fresh tomato, bacon, red onion, burger sauce, mustard.",
            price: 10,
            basePrice:10,
            grams: 420,
        },
        {
            image: "4.png",
            title: "Bavarian Burger",
            text: "Burger bun, beef patty, red onion, cheese, hunter's sausage, BBQ sauce, cheese sauce, iceberg lettuce.",
            price: 7,
            basePrice:7,
            grams: 220,
        },
        {
            image: "5.png",
            title: "Bacon Cheeseburger",
            text: "Burger bun, beef patty, bacon, tomato, pickled cucumber, cheese, cheese sauce, ketchup, greens.",
            price: 8,
            basePrice:8,
            grams: 220,
        },
        {
            image: "6.png",
            title: "Indiana Burger",
            text: "Burger bun, chicken patty, bacon, egg, pickled cucumber, crispy onions, ketchup, cheese sauce, mustard, greens.",
            price: 9,
            basePrice:9,
            grams: 320,
        },
        {
            image: "7.png",
            title: "Veggie Burger",
            text: "Burger bun, vegetarian patty, red onion, cheese, fresh tomato, BBQ sauce, cheese sauce, iceberg lettuce",
            price: 8,
            basePrice:8,
            grams: 280,
        },
        {
            image: "8.png",
            title: "Cheddar & Bacon Burger",
            text: "Crispy beef patty, bun, tomato, Cheddar cheese, bacon, red onion, iceberg lettuce, mayonnaise, ketchup, cheese sauce",
            price: 8,
            basePrice:8,
            grams: 360,
        },
        {
            image: "9.png",
            title: "Double Cheeseburger",
            text: "Burger bun, two beef patties, double Cheddar cheese, pickled cucumber, crispy onions, ketchup, cheese sauce, mustard, greens",
            price: 7,
            basePrice:7,
            grams: 380,
        },
        {
            image: "10.png",
            title: "Fresh Burger",
            text: "Burger bun, beef patty, bacon, Cheddar cheese, egg, salami, BBQ sauce, cheese sauce, iceberg lettuce, fresh tomato",
            price: 11,
            basePrice:11,
            grams: 400,
        },
        {
            image: "11.png",
            title: "Zucchini Burger",
            text: "Burger bun, vegetarian chickpea patty, grilled zucchini, tomato, pickled cucumber, cheese, mustard sauce, ketchup, greens",
            price: 9,
            basePrice:9,
            grams: 300,
        },
        {
            image: "12.png",
            title: "Double Cheddar Burger",
            text: "Burger bun, beef patty, bacon, red onion, pickled cucumber, tomato, ketchup, double Cheddar cheese, mustard, greens",
            price: 8,
            basePrice:8,
            grams: 320,
        },
    ];

    constructor(private fb: FormBuilder, private appService:AppService) {
    }

    scrollTo(target: HTMLElement, burger?: any) {
        target.scrollIntoView({behavior: "smooth"});
        if (burger) {
            this.form.patchValue({order: burger.title + ' (' + burger.price + ' ' + this.currency + ')'});
        }
    }

  confirmOrder() {
    if (this.form.valid) {
      this.appService.sendOrder(this.form.value)
        .subscribe(
          {
            next: (response: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Thank you for your order!',
                text: 'Your order has been successfully placed.',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.form.reset();
                }
              });
            },
            error: (response) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while processing your order.',
              });
            },
          }
        );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill out all fields',
      });
    }
  }



    changeCurrency(){
        let newCurrency = "$";
        let coefficient = 1;

        if (this.currency === '$') {
            newCurrency = '€';
            coefficient = 0.93;
        }else if (this.currency === '€') {
            newCurrency = '₴';
            coefficient = 39.38;
        }
        this.currency=newCurrency;
        this.productsData.forEach((item: any) =>{
            item.price = +(item.basePrice * coefficient).toFixed(1)
        })

    }
}
