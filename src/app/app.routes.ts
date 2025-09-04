import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Restaurants } from './features/restaurants/restaurants';
import { Branches } from './features/branches/branches';
import { Systems } from './features/systems/systems';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'restaurants', component: Restaurants },
    { path: 'branches/:id', component: Branches },
    { path: 'systems', component: Systems }
];
