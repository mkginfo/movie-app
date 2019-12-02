import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {OmdbService} from '../../services/omdb.service';
import {MovieDetails} from '../../models/movie.model';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {

  public loading: boolean;
  private subscription: Subscription;
  public searchText = '';
  public movies: MovieDetails[];
  public errorLog: string;
  public selectedPlot = '';
  public searchFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(
    private route: ActivatedRoute,
    private omdbService: OmdbService
  ) { }

  ngOnInit() {
    this.searchText = '';
    this.route.params.subscribe(params => {
      this.searchText = params.title;
      if (params.title) {
        this.getMovies(params.title);
      }
    });
  }

  onSeachChange(event) {
    if (event) {
      this.getMovies(this.searchText);
    }
  }

  getMovies(title: string) {
    this.loading = true;
    this.movies = null;
    this.subscription = this.omdbService.getMoviesFullDatilsByTitle(title, 5)
      .subscribe((movies) => {
        this.movies = movies;
        this.loading = false;
      }, error => {
        this.loading = false;
        if (error.Response === 'False') {
          this.errorLog = error.Error;
        } else {
          if (error.status === 500) {
            this.errorLog = error.statusText;
          } else {
            this.errorLog = 'Error in Service response';
          }
        }
        this.movies = null;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
