import { Component, OnInit } from '@angular/core';
import { ListResult, Evacuee } from '../../../core/models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { SearchQueryParameters } from 'src/app/core/models/search-interfaces';
import { UniqueKeyService } from 'src/app/core/services/unique-key.service';
import { EvacueeService } from 'src/app/core/services/evacuee.service';

@Component({
  selector: 'app-evacuee-list',
  templateUrl: './evacuee-list.component.html',
  styleUrls: ['./evacuee-list.component.scss']
})
export class EvacueeListComponent implements OnInit {
  evacuees: any;
  // server response
  resultsAndPagination: ListResult<Evacuee>;
  notFoundMessage = 'Searching ...';
  defaultSearchQuery: SearchQueryParameters = {
    offset: 0,
    limit: 20
  };
  queryString: string;
  // a place to save the last query parameters
  previousQuery: SearchQueryParameters = {};
  sort = '-registrationId'; // how do we sort the list query param
  path: string = null; // the base path for routing

  advancedSearchMode = false;

  constructor(
    private evacueeService: EvacueeService,
    private router: Router,
    private authService: AuthService,
    private uniqueKeyService: UniqueKeyService,
  ) { }

  ngOnInit() {
    // save the base url path
    this.authService.path.subscribe((path: string) => this.path = path);
    this.getEvacuees().subscribe((listResult: ListResult<Evacuee>) => {
      this.resultsAndPagination = listResult;
    });
  }

  switchToAdvancedSearch() {
    this.advancedSearchMode = true;

    // TODO: clean-up & manage new search state
  }

  switchToBasicSearch() {
    this.advancedSearchMode = false;

    // TODO: clean-up & manage new search state
  }

  getEvacuees(query: SearchQueryParameters = this.defaultSearchQuery): Observable<ListResult<Evacuee>> {
    // store the sorting
    query.sort = this.sort;
    // save the generic query for repeat searches
    this.previousQuery = query;
    // save the organization id into the query from the default
    return this.evacueeService.getEvacuees(query);
  }

  search() {
    // submit and collect search with a query string
    const query = this.defaultSearchQuery;
    query.q = this.queryString;
    this.getEvacuees(query).subscribe((listResult: ListResult<Evacuee>) => {
      if (listResult.data.length <= 0) {
        this.notFoundMessage = 'No results found.';
      } else {
        this.notFoundMessage = 'Searching ...';
      }
      this.resultsAndPagination = listResult;
    });
  }

  advancedSearch(args: any = {}) {
    // TODO: submit search params to server endpoint
    alert('Advanced search query issued to server...');
  }

  onPaginationEvent(event: SearchQueryParameters) {
    // save the pagination into the previous query and execute the query again
    this.getEvacuees(event).subscribe((listResult: ListResult<Evacuee>) => {
      this.resultsAndPagination = listResult;
    });
  }

  edit(registrationId: string) {
    // save registration ID for lookup in the new component
    this.uniqueKeyService.setKey(registrationId);

    // go to registration maker
    this.router.navigate([`/${this.path}/registration`]);
  }

  view(registrationId: string) {
    // save registration ID for lookup in the new component
    this.uniqueKeyService.setKey(registrationId);

    // go to registration summary page
    this.router.navigate([`/${this.path}/registration/summary`]);
  }
}
