import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import { environment } from '@environments/environment';
import { User } from '../_models';
import { environment } from 'src/environments/environment';
import { Order } from '@app/_models/order';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    private orderSubject: BehaviorSubject<Order>;

    public user!: Observable<User>;
    public order!: Observable<Order>;


    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.orderSubject = new BehaviorSubject<Order>(JSON.parse(localStorage.getItem('orders')));

        this.user = this.userSubject.asObservable();
        this.order = this.orderSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }
    public get orderValue(): Order {
        return this.orderSubject.value;
    }

    login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                //store user details and kwt token in local storage
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        //remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }
    
    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`,user);
    }
    

    registerOrder(order: Order) {
        return this.http.post(`${environment.apiUrl}/orders`,order);
    }

    getAllOrder(){
        return this.http.get<Order[]>(`${environment.apiUrl}/orders`);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }


    getById(id: string){
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }
    getByOrderId(id: string){
        return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }
    updateOrder(id, params) {
        return this.http.put(`${environment.apiUrl}/orders/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.orderValue.id) {
                    // update local storage
                    const order = { ...this.orderValue, ...params };
                    localStorage.setItem('order', JSON.stringify(order));

                    // publish updated user to subscribers
                    this.orderSubject.next(order);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }

    deleteOrder(id: number) {
        return this.http.delete(`${environment.apiUrl}/orders/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                
                return x;
            }));
    }
}