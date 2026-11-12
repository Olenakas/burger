import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AppService} from './app.service';

import Swal from 'sweetalert2';

type Filter = 'all' | 'beef' | 'chicken' | 'veggie';

interface Product {
  id: string;
  title: string;
  text: string;
  price: number;
  grams: number;
  image: string;
  type: Exclude<Filter, 'all'>;
  badge?: string;
}

interface CartItem {
  id: string;
  title: string;
  sub: string;
  price: number;
  image?: string;
  qty: number;
}

interface Ingredient {
  id: string;
  name: string;
  grams: number;
  kcal: number;
  price: number;
  color: string;
  qty: number;
}

interface Kitchen {
  x: number;
  y: number;
  street: string;
}

interface District {
  name: string;
  x: number;
  y: number;
}

const ASSETS = './assets/new/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  readonly assets = ASSETS;

  /* nav */
  menuOpen = false;

  /* anatomy */
  layers = [
    {name: 'Sourdough bun', note: 'baked at 06:00, toasted on the grill', side: 'l', label: [25, 95.5], line: 122},
    {name: 'Red onion', note: 'sliced thin for a sweet crunch', side: 'r', label: [1018, 191.5], line: 218},
    {name: 'Tomato', note: 'ripe, never fridge-cold', side: 'l', label: [101, 233.5], line: 260},
    {name: 'Aged cheddar', note: '9 months, melts over the patty', side: 'r', label: [1018, 269.5], line: 296},
    {name: 'Beef patty', note: '180 g chuck, seared at 400 °C', side: 'l', label: [55, 329.5], line: 356},
    {name: 'Smoky sauce', note: 'house recipe, cooked every day', side: 'r', label: [1018, 365.5], line: 392},
    {name: 'Lettuce', note: 'iceberg keeps the bun dry', side: 'l', label: [79, 413.5], line: 440},
    {name: 'Bottom bun', note: 'holds it all together', side: 'r', label: [1018, 497.5], line: 524},
  ];
  activeLayer = 0;

  /* menu */
  filters: { id: Filter; label: string }[] = [
    {id: 'all', label: 'All'},
    {id: 'beef', label: 'Beef'},
    {id: 'chicken', label: 'Chicken'},
    {id: 'veggie', label: 'Veggie'},
  ];
  filter: Filter = 'all';

  productsData: Product[] = [
    {id: 'indiana', title: 'Indiana Burger', grams: 320, price: 9, type: 'chicken', image: 'menu-indiana.webp', badge: 'Bestseller',
      text: 'Chicken patty, bacon, egg, pickled cucumber, crispy onions, cheese sauce, greens'},
    {id: 'fresh', title: 'Fresh Burger', grams: 400, price: 11, type: 'beef', image: 'menu-fresh.webp',
      text: 'Beef patty, bacon, Cheddar, egg, salami, BBQ sauce, iceberg lettuce, tomato'},
    {id: 'bbq', title: 'BBQ Chicken', grams: 390, price: 7, type: 'chicken', image: 'menu-bbq.webp',
      text: 'Sesame brioche, chicken patty, Cheddar, tomato, pickles, pickled onion, BBQ sauce'},
    {id: 'double', title: 'Double Beef', grams: 420, price: 10, type: 'beef', image: 'menu-double.webp', badge: 'Hot',
      text: 'Two beef patties, Cheddar, Romaine, pickles, tomato, bacon, red onion'},
    {id: 'bavarian', title: 'Bavarian Burger', grams: 220, price: 7, type: 'beef', image: 'menu-bavarian.webp',
      text: 'Pretzel bun, beef patty, hunter\'s sausage, red onion, cheese, BBQ sauce'},
    {id: 'bacon', title: 'Bacon Cheeseburger', grams: 220, price: 8, type: 'beef', image: 'menu-bacon.webp',
      text: 'Beef patty, bacon, tomato, pickled cucumber, cheese, ketchup, greens'},
    {id: 'veggie', title: 'Veggie Burger', grams: 280, price: 8, type: 'veggie', image: 'menu-veggie.webp',
      text: 'Vegetable patty, red onion, cheese, tomato, BBQ sauce, iceberg lettuce'},
    {id: 'zucchini', title: 'Zucchini Burger', grams: 300, price: 9, type: 'veggie', image: 'menu-zucchini.webp', badge: 'New',
      text: 'Chickpea patty, grilled zucchini, tomato, pickled cucumber, cheese, greens'},
  ];

  /* builder: the brioche bun is the base, layers are added on top */
  readonly base = {grams: 355, kcal: 535, price: 3.4};
  readonly maxQty = 2;
  ingredients: Ingredient[] = [
    {id: 'patty', name: 'Beef patty', grams: 180, kcal: 420, price: 3, color: '#6b3a22', qty: 1},
    {id: 'cheddar', name: 'Cheddar', grams: 20, kcal: 80, price: 0.8, color: '#f6c945', qty: 1},
    {id: 'bacon', name: 'Crispy bacon', grams: 25, kcal: 130, price: 1.2, color: '#b5452b', qty: 1},
    {id: 'lettuce', name: 'Lettuce', grams: 15, kcal: 3, price: 0.3, color: '#6dbe45', qty: 1},
    {id: 'tomato', name: 'Tomato', grams: 30, kcal: 6, price: 0.4, color: '#e3241b', qty: 1},
    {id: 'onion', name: 'Red onion', grams: 15, kcal: 6, price: 0.3, color: '#9b3a7a', qty: 1},
    {id: 'sauce', name: 'Smoky sauce', grams: 20, kcal: 70, price: 0.5, color: '#7a3b1e', qty: 0},
  ];
  sesame = [
    {x: 65, y: 30, r: 0}, {x: 115.6, y: 16.7, r: -12}, {x: 165.6, y: 24.7, r: -12}, {x: 215, y: 16, r: 0},
    {x: 255.6, y: 38.7, r: -12}, {x: 45.9, y: 59.3, r: -24}, {x: 100.6, y: 50.7, r: -12}, {x: 155, y: 58, r: 0},
    {x: 205.9, y: 47.3, r: -24}, {x: 250.9, y: 71.3, r: -24},
  ];

  /* how it works */
  activeStep = 2;
  @ViewChild('steps') stepsRef?: ElementRef<HTMLElement>;

  /* deal */
  countdown = {h: '16', m: '53', s: '52'};
  private timer?: ReturnType<typeof setInterval>;

  /* delivery map */
  kitchens: Kitchen[] = [
    {x: 200, y: 120, street: 'Marymoncka'}, {x: 300, y: 180, street: 'Słowackiego'},
    {x: 460, y: 190, street: 'Radzymińska'}, {x: 150, y: 230, street: 'Powstańców Śląskich'},
    {x: 250, y: 270, street: 'Wolska'}, {x: 360, y: 270, street: 'Marszałkowska'},
    {x: 500, y: 300, street: 'Grochowska'}, {x: 220, y: 370, street: 'Grójecka'},
    {x: 340, y: 370, street: 'Puławska'}, {x: 470, y: 410, street: 'Wał Miedzeszyński'},
    {x: 280, y: 470, street: 'KEN'}, {x: 400, y: 470, street: 'Wilanowska'},
  ];
  districts: District[] = [
    {name: 'Białołęka', x: 470, y: 52}, {name: 'Bielany', x: 150, y: 84}, {name: 'Targówek', x: 496, y: 150},
    {name: 'Żoliborz', x: 262, y: 150}, {name: 'Bemowo', x: 70, y: 200}, {name: 'Praga-Północ', x: 420, y: 214},
    {name: 'Wola', x: 196, y: 250}, {name: 'Rembertów', x: 560, y: 240}, {name: 'Śródmieście', x: 300, y: 292},
    {name: 'Ursus', x: 40, y: 300}, {name: 'Praga-Południe', x: 450, y: 330}, {name: 'Ochota', x: 184, y: 346},
    {name: 'Wesoła', x: 566, y: 360}, {name: 'Włochy', x: 80, y: 400}, {name: 'Mokotów', x: 300, y: 410},
    {name: 'Wawer', x: 500, y: 440}, {name: 'Ursynów', x: 230, y: 500}, {name: 'Wilanów', x: 400, y: 500},
  ];
  district = this.districts.find(d => d.name === 'Mokotów')!;

  /* cart */
  cart: CartItem[] = [];
  cartOpen = false;
  readonly freeDeliveryFrom = 20;
  readonly deliveryFee = 2;
  form = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    message: [''],
  });

  /* footer */
  subscribed = false;
  toastText = '';
  private toastTimer?: ReturnType<typeof setTimeout>;

  constructor(private fb: FormBuilder, private appService: AppService) {
  }

  ngOnInit() {
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    clearTimeout(this.toastTimer);
  }

  /* nav */
  scrollTo(target: HTMLElement) {
    this.menuOpen = false;
    target.scrollIntoView({behavior: 'smooth'});
  }

  /* menu */
  get visibleProducts() {
    return this.filter === 'all' ? this.productsData : this.productsData.filter(p => p.type === this.filter);
  }

  addProduct(p: Product) {
    this.addToCart({id: p.id, title: p.title, sub: p.grams + ' g', price: p.price, image: p.image});
  }

  /* builder */
  get builderTotals() {
    return this.ingredients.reduce((t, i) => ({
      grams: t.grams + i.grams * i.qty,
      kcal: t.kcal + i.kcal * i.qty,
      price: t.price + i.price * i.qty,
    }), {...this.base});
  }

  /** Layers from bottom to top, as they sit on the stage. */
  get stack(): string[] {
    const order = ['patty', 'sauce', 'cheddar', 'bacon', 'lettuce', 'tomato', 'onion'];
    const out: string[] = [];
    for (const id of order) {
      const ing = this.ingredients.find(i => i.id === id)!;
      for (let n = 0; n < ing.qty; n++) out.push(id);
    }
    return out;
  }

  changeQty(ing: Ingredient, delta: number) {
    ing.qty = Math.min(this.maxQty, Math.max(0, ing.qty + delta));
  }

  addCustomBurger() {
    const parts = this.ingredients.filter(i => i.qty).map(i => (i.qty > 1 ? i.qty + 'x ' : '') + i.name.toLowerCase());
    const t = this.builderTotals;
    const key = 'custom-' + this.ingredients.map(i => i.qty).join('');
    this.addToCart({id: key, title: 'Your burger', sub: parts.join(', ') || 'just the bun', price: +t.price.toFixed(2)});
  }

  /* how it works */
  stepFill() {
    // 4 equal columns with 24px gaps; the fill ends 12px into the active dot
    return `calc(${this.activeStep - 1} * (25% + 6px) + 12px)`;
  }

  @HostListener('window:scroll')
  onScroll() {
    const el = this.stepsRef?.nativeElement;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    const progress = (window.innerHeight * 0.85 - top) / (window.innerHeight * 0.5);
    this.activeStep = Math.min(4, Math.max(1, Math.ceil(progress * 4)));
  }

  /* deal */
  private tick() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(24, 0, 0, 0);
    let left = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
    const pad = (n: number) => String(n).padStart(2, '0');
    this.countdown = {h: pad(Math.floor(left / 3600)), m: pad(Math.floor(left % 3600 / 60)), s: pad(left % 60)};
  }

  addDeal() {
    this.addToCart({id: 'red-dragon', title: 'Red Dragon combo', sub: 'with fries and a drink', price: 9, image: 'red-dragon.webp'});
  }

  /* delivery map */
  get eta() {
    const cx = this.district.x + 25, cy = this.district.y + 7;
    let best = this.kitchens[0], dist = Infinity;
    for (const k of this.kitchens) {
      const d = Math.hypot(k.x - cx, k.y - cy);
      if (d < dist) { dist = d; best = k; }
    }
    return {min: Math.round(10 + dist / 12), street: best.street};
  }

  get pin() {
    return {x: Math.min(this.district.x + 18, 640 - 150), y: this.district.y + 20};
  }

  selectDistrict(name: string) {
    this.district = this.districts.find(d => d.name === name) ?? this.district;
  }

  /* cart */
  get cartCount() {
    return this.cart.reduce((n, i) => n + i.qty, 0);
  }

  get subtotal() {
    return this.cart.reduce((s, i) => s + i.qty * i.price, 0);
  }

  get delivery() {
    return !this.cart.length || this.subtotal >= this.freeDeliveryFrom ? 0 : this.deliveryFee;
  }

  /** 1180 -> "1 180", as in the design */
  spaced(n: number) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  money(n: number) {
    return '$' + (Number.isInteger(n) ? n : n.toFixed(2));
  }

  addToCart(item: Omit<CartItem, 'qty'>) {
    const found = this.cart.find(i => i.id === item.id);
    if (found) found.qty++;
    else this.cart.push({...item, qty: 1});
    this.toast(item.title + ' added to cart');
  }

  changeCartQty(item: CartItem, delta: number) {
    item.qty += delta;
    if (item.qty <= 0) this.cart = this.cart.filter(i => i !== item);
  }

  confirmOrder() {
    if (!this.cart.length) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const order = this.cart.map(i => `${i.qty} x ${i.title} (${i.sub})`).join('; ');
    this.appService.sendOrder({
      order: `${order}. Total ${this.money(this.subtotal + this.delivery)}`,
      name: this.form.value.name,
      phone: this.form.value.phone,
      message: this.form.value.message,
    }).subscribe({
      next: () => {
        this.cartOpen = false;
        Swal.fire({
          icon: 'success',
          title: 'Thank you for your order!',
          text: 'An operator will call you within 5 minutes to confirm the details.',
          confirmButtonColor: '#e3241b',
        });
        this.cart = [];
        this.form.reset();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while processing your order.',
          confirmButtonColor: '#e3241b',
        });
      },
    });
  }

  /* footer */
  subscribe(email: HTMLInputElement, e: Event) {
    e.preventDefault();
    if (!email.checkValidity() || !email.value) {
      email.reportValidity();
      return;
    }
    this.subscribed = true;
    email.value = '';
  }

  private toast(text: string) {
    this.toastText = text;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastText = '', 2200);
  }

  @HostListener('document:keydown.escape')
  closeOverlays() {
    this.cartOpen = false;
    this.menuOpen = false;
  }
}
