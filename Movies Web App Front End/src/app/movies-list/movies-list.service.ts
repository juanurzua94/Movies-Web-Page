import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { movie } from './movies-list.model';
import { Actor } from './actor.model';
import { Router, UrlSerializer } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private dashboardUrl = '/api/fablix/_dashboard'
  private employeeLoginUrl = '/login';
  private suggestedUrl = '/api/movies/suggestedsearch'

  private apiUrl = '/api/movies';
  private loginUrl = '/api/login';
  private salesUrl = '/sales';
  private loggedin = false;
  //private fullUrl = 'http://ec2-54-153-87-236.us-west-1.compute.amazonaws.com:8080/css122b-spring20api-0.0.1-SNAPSHOT'
  //private fullUrl = 'http://ec2-13-52-241-63.us-west-1.compute.amazonaws.com:8080/css122b-spring20api-0.0.1-SNAPSHOT';
  private fullUrl = 'http://localhost:8090'


  private genreItemUrl = '/genre/';
  private titleUrl = '/title/';
  private payUrl = '/api/pay'
  private moviesUpdated = new Subject<movie[]>();




  private movies : movie[] = [];

  private actors: Actor[] = [];
  private shoppingCart = {};

  private worked = true;
  private totalPay = 0;
  private paymentSuccess = true;
  private customerId : string;
  private employeeFailedLoggedIn : boolean;
  private employeeLoggedIn : boolean;



  constructor(private http: HttpClient, private router: Router, private serializer: UrlSerializer) {
    this.employeeLoggedIn = false;
    this.employeeFailedLoggedIn = false;
   }

  getMovies() {
    this.http.get<movie[]>(this.fullUrl + this.apiUrl)
    .subscribe(movieData => {
      this.movies = movieData;
      this.moviesUpdated.next([...this.movies]);
     // this.updateActorsList();
    })
  }

  getMoviesinGenre(genre : string, offset : number){
    const fullUrl = `${this.fullUrl}${this.apiUrl}${this.genreItemUrl}${genre}/${offset}`;
    this.http.get<movie[]>(fullUrl)
    .subscribe(movieData => {
      this.movies = movieData;
      this.moviesUpdated.next([...this.movies]);
    })
  }

  getFullSearchResults(data : any){
    const queryUrl = this.router.createUrlTree(['api/movies/fullsearch'], {queryParams: data});
    let queryString = this.serializer.serialize(queryUrl);
    const fullUrl = `${this.fullUrl}${queryString}`;
    console.log(fullUrl);

    this.http.get<movie[]>(fullUrl)
    .subscribe(movieData => {
      this.movies = movieData;
      this.moviesUpdated.next([...this.movies]);
    })
  }

  getQueryResults(data : any){
    const queryUrl = this.router.createUrlTree(['api/movies/search'], {queryParams: data});
    let queryString = this.serializer.serialize(queryUrl);
    const fullUrl = `${this.fullUrl}${queryString}`;
    console.log(fullUrl);
    this.http.get<movie[]>(fullUrl)
    .subscribe(movieData => {
      console.log(movieData);
      this.movies = movieData;
      this.moviesUpdated.next([...this.movies]);
    });

  }

  getMoviesByLetter(letter : string, offset : number){
    const fullUrl = `${this.fullUrl}${this.apiUrl}${this.titleUrl}${letter}/${offset}`;
    this.http.get<movie[]>(fullUrl)
    .subscribe(movieData=> {
      this.movies = movieData;
      this.moviesUpdated.next([...this.movies]);
    })
  }

  getMovieUpdateListener(){
      return this.moviesUpdated.asObservable();
  }


  login(email: string, password: string){
    const account = {email: email, password: password};
    this.http.post<object>(
      `${this.fullUrl}${this.loginUrl}`, account
    ).subscribe(responseData => {
        if(responseData['user'] == "success"){
          this.customerId = responseData['userid'];
          this.loggedin = true;
          this.router.navigate(['api/home']);
        } else {
          this.worked = false;
        }

    });
  }

  employeeLogin(email: string, password: string){
    const account = {email: email, password: password};
    this.http.post<object>(
      `${this.fullUrl}${this.dashboardUrl}${this.employeeLoginUrl}`, account
    ).subscribe(responseData => {
      if(responseData['employee'] == 'success'){
        this.employeeLoggedIn = true;
        this.router.navigate(['api/fablix/_dashboard']);
      }
      else {
        this.employeeFailedLoggedIn = true;
      }
    });
  }

  addToSales(){
    const fullUrl = `${this.fullUrl}${this.apiUrl}${this.salesUrl}`;
    let temp = this.parseShoppingCart();
    console.log(temp);
    this.http.post<object>(
      fullUrl, temp
    ).subscribe(responseData => {

    });
  }

  parseShoppingCart(){
    let temp = [];
    const values = Object.values(this.shoppingCart);
    for(const value of values){
      temp.push({'ccid': this.customerId, 'movieid': value['id'], 'quantity': value['quantity']})
    }
    return temp;
  }

  submitPayment(data : any){
    const fullUrl = `${this.fullUrl}${this.payUrl}`
    this.http.post<object>(
      fullUrl, data
    ).subscribe(responseData => {
        if(responseData["RESULT"] == "T"){

          this.paymentSuccess = true;
          this.router.navigate(['api/home']);
          this.addToSales();
        }
        else {
          this.paymentSuccess = false;
        }
    })
  }

  errorWithPayment(){
    return this.paymentSuccess;
  }


  getShoppingCart(){
    return this.shoppingCart;
  }

  addToShoppingCart(data : string, dataid : string){
    if(this.shoppingCart[data] == undefined)
      this.shoppingCart[data] = {'id' : dataid, 'quantity': 0};
    this.shoppingCart[data]['quantity']++;
    console.log(this.shoppingCart);
  }

  updateShoppingCart(data : any){
    this.shoppingCart = data;
  }

  setPayTotal(data: number){
    this.totalPay = data;
  }

  getWorked(){
    return this.worked;
  }

  isLoggedIn(){
    if(this.loggedin)
      return "Y"
    return "N"
  }

  logout(){
    this.worked = true;
    this.loggedin = false;
  }

  employeeLogout(){
    this.employeeFailedLoggedIn = false;
    this.employeeLoggedIn = false;
  }

  isEmployeeLoggedIn(){
    return this.employeeLoggedIn;
  }

  employeeLoginError(){
    return this.employeeFailedLoggedIn;
  }

}
