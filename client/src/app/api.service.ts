import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private token: string;

  constructor(private http: HttpClient) {}

  public upload(formData:FormData): Observable<any> {
    return this.http.post(`http://localhost:3000/api/upload`, formData);
  }

}
