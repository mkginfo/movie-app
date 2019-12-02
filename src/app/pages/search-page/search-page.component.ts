import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {OmdbService} from '../../services/omdb.service';
import {MovieDetails} from '../../models/movie.model';

/** Error when invalid control is dirty, touched, or submitted. */
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
export class SearchPageComponent implements OnInit {

  public loading: boolean;
  public searchText = '';
  public movies: MovieDetails[];
  public errorLog: string;
  public searchFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private omdbService: OmdbService) { }

  ngOnInit() {
  }

  onSeachChange(event) {
    console.log(event);
    if (event) {
      console.log(this.searchText);
      this.getMovies(this.searchText);
    }
  }

  getMovies(title: string = 'bridge') {
    this.loading = true;
    this.omdbService.getMoviesFullDatilsByTitle(title, 5)
      .subscribe((movies) => {
        this.movies = movies;
        console.log('movies--!!##', movies);
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

}
