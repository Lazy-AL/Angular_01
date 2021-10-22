import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { Role } from '@app/_models';
import { Order } from '@app/_models/order';

// array in local storage for registered users
const usersKey = 'users';
const ordersKey = 'orders';

let orders : Order[] = [
    { id: 1, name: 'shirt ', color: 'red', material: 'cotton', size: 'xxl' }
]

let users = [
    { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
    { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User },
    { id: 3, username: 'mod', password: 'mod', firstName: 'Mod', lastName: 'User', role: Role.Mod },
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                //orders ----------------------------
                case url.endsWith('/orders') && method === 'GET':
                    return getOrders();

                case url.endsWith('/orders') && method === 'POST':
                    return registerOrder();

                case url.match(/\/orders\/\d+$/) && method === 'PUT':
                    return updateOrder();

                case url.match('/orders') && method === 'DELETE':
                    return deleteOrder();
                //orders end ------------------------------
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default:

                    return next.handle(request);
            }

        }

        // route functions users
        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                ...basicDetails(user),
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: `fake-jwt-token.${user.id}`
            });
        }

        function register() {
            const user = body

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok(user);
        }

        function registerOrder() {
            const order = body

            if (orders.find(x => x.name === order.name)) {
                return error('name"' + order.name + '" is already taken')
            }
            // order.id = orders.length ? Math.max(...orders.map(x => x.id)) + 1 : 1;
            orders.push(order);
            console.log(orders,'dioooo')
            localStorage.setItem(ordersKey, JSON.stringify(orders));
            return ok(order);
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }
            // update and save user
            Object.assign(user, params);
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok(user);
        }
        
        function updateOrder() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let order = orders.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }
            // update and save user
            Object.assign(order, params);
            localStorage.setItem(ordersKey, JSON.stringify(orders));
            return ok(order);
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok(users);
        }


        function deleteOrder() {

            orders = orders.filter(x => x.id != idFromUrl());
            console.log(idFromUrl())
            localStorage.setItem(ordersKey, JSON.stringify(orders));
            console.log(orders,'deleted')
            return ok(orders);
        }

        function getUsers() {
            // if (!isAdmin()) return unauthorized();
            return ok(users);
        }

        // route functions orders
        function getOrders() {
                if(orders.length > 0){
                    orders = JSON.parse(localStorage.getItem('orders'));
                    return ok(orders);
                }
                return ok(orders);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            /** 
             * !only admins can access other user records
             * */
            if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(user);
        }

        // helper functions


        function ok(body) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } })
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }

        function error(message) {
            return throwError({ status: 400, error: { message } })
                .pipe(materialize(), delay(500), dematerialize());
        }

        function isLoggedIn() {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer fake-jwt-token');
        }
        function basicDetails(user) {
            const { id, username, firstName, lastName } = user;
            return { id, username, firstName, lastName };
        }
        function isAdmin() {
            return isLoggedIn() && currentUser().role === Role.Admin;
        }

        function currentUser() {
            if (!isLoggedIn()) return;
            const id = parseInt(headers.get('Authorization').split('.')[1]);
            return users.find(x => x.id === id);
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};