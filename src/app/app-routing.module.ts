import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './mapa/mapa.component';
import { StationDashboardComponent } from "./station-dashboard/station-dashboard.component";

const routes: Routes = [
  {path:'station/:id', component: StationDashboardComponent},
  {path:'**', component: MapaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
