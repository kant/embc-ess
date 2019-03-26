import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { CoreModule } from '../core.module';
import { Volunteer } from '../models';
import { RestService } from './rest.service';
import { HttpResponse } from '@angular/common/http';
import { SearchQueryParameters } from 'src/app/shared/components/search';

// const VOLUNTEERS: Volunteer[] = [
//   {
//     personType: 'VOLN',
//     id: 'none',
//     bceidAccountNumber: 'TESTBCEIDNUMBER',
//     isAdministrator: true,
//     isPrimaryContact: true,
//     canAccessRestrictedFiles: true,
//     firstName: 'Fonzie',
//     initials: 'D',
//     lastName: 'Delphon',
//     nickname: 'Fando',
//     gender: 'Male',
//     dob: new Date(),
//     organization: {
//       id: '1234',
//       name: 'Quartech',
//       bceidAccountNumber: 'BCEIDACCOUNTNUMBER'
//     }
//   },
//   {
//     personType: 'VOLN',
//     id: 'none',
//     bceidAccountNumber: 'NUMBERGOESHERE',
//     isAdministrator: false,
//     isPrimaryContact: true,
//     canAccessRestrictedFiles: false,
//     firstName: 'Beana',
//     initials: 'K',
//     lastName: 'Andervig',
//     nickname: 'Bean',
//     gender: 'female',
//     dob: new Date(),
//     organization: {
//       id: '1234',
//       name: 'Quartech',
//       bceidAccountNumber: 'BCEIDACCOUNTNUMBER'
//     }
//   },
//   {
//     personType: 'VOLN',
//     id: 'none',
//     bceidAccountNumber: 'IAMACATMEOW',
//     isAdministrator: false,
//     isPrimaryContact: false,
//     canAccessRestrictedFiles: true,
//     firstName: 'Fluffer',
//     initials: '',
//     lastName: 'Macgoodie',
//     nickname: 'Fluf',
//     gender: 'x',
//     dob: new Date(),
//     organization: {
//       id: '764',
//       name: 'Pet Store',
//       bceidAccountNumber: 'KLASHIFUAYFUISOAYDOIU'
//     }
//   },
//   {
//     personType: 'VOLN',
//     id: 'none',
//     bceidAccountNumber: 'WHATISTHISANDWHATAMIDOING',
//     isAdministrator: false,
//     isPrimaryContact: false,
//     canAccessRestrictedFiles: false,
//     firstName: 'Allan',
//     initials: '',
//     lastName: 'McGruff',
//     nickname: 'Big Al',
//     gender: 'male',
//     dob: new Date(),
//     organization: {
//       id: '6970',
//       name: 'Land Movers',
//       bceidAccountNumber: 'BCEIDACCOUNTNUMBER'
//     }
//   },
// ];

@Injectable({
  providedIn: CoreModule
})
export class VolunteerService extends RestService {
  apiRoute = 'api/volunteers';

  getVolunteers(props: SearchQueryParameters = {}): Observable<Volunteer[]> {
    const { limit = 100, offset = 0, q, sort } = props;
    const params = {
      limit: limit.toString(), // query params are strings
      offset: offset.toString(),
      q,
      sort
    };
    // get a list of all volunteers back from the api
    return this.http.get<Volunteer[]>(this.apiRoute, { headers: this.headers, params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getVolunteerById(id: string): Observable<Volunteer> {
    // get a single volunteer by their bceidAccountNumber
    // return of(VOLUNTEERS[0]);
    return this.http.get<Volunteer>(this.apiRoute + '/' + id, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  createVolunteer(data: Volunteer): Observable<Volunteer> {
    // this will return a response string of 200. This may need to become a Response eventually
    // return of('200');
    return this.http.post<Volunteer>(this.apiRoute, data, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
  updateVolunteer(data: Volunteer): Observable<HttpResponse<any>> {
    // this will return a response string of 200. This may need to become a Response eventually
    // return of('200');
    return this.http.put<HttpResponse<any>>(this.apiRoute + '/' + data.id, data, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
}
