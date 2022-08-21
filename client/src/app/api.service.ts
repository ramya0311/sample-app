import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ApiService {

  constructor(private http: HttpClient) {}

  public upload(formData): Observable<any> {
    return this.http.post(`/api/upload`, formData);;
  }
}
