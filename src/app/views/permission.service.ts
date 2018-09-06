
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Permission } from './permission';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})


@Injectable({ providedIn: 'root' })
export class PermissionService {

  private permissionUrl = 'https://betarest.learnerguru.com/inslearnerguru/permission/get/all';  // URL to web api

  constructor(
      private https: HttpClient,
      private messageService: MessageService) { }

  /** GET heroes from the server */
  getPermissions (): Observable<Permission[]> {
    return this.https.get<Permission[]>(this.permissionUrl)
        .pipe(
        tap(heroes => this.log(`fetched Permissions`)),
        catchError(this.handleError('getPermissions', []))
    );
  }


    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a PermissionService message with the MessageService */
  private log(message: string) {
    this.messageService.add('PermissionService: ' + message);
  }
}
