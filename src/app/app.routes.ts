import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Restaurants } from './features/restaurants/restaurants';
import { Branches } from './features/branches/branches';
import { Branch } from './features/branch/branch';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'restaurants', component: Restaurants },
    { path: 'branches/:id', component: Branches },
    { path: 'branch', component: Branch }
];
