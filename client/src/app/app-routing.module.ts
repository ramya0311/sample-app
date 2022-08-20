import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SimpleFormComponent } from "./simple-form/simple-form.component";

const routes: Routes = [
  { path: "", component: SimpleFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
