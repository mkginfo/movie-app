import { Injectable } from '@angular/core';
import {MovieDetails} from '../models/movie.model';
import {OmdbService} from './omdb.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  movieDetails: MovieDetails[] = [];
  public validSearch: boolean;
  public notFound: boolean;
  public notProvided: boolean;

  constructor(
    private omdbService: OmdbService
  ) { }

  addMovie(movieDetails: MovieDetails) {
    this.movieDetails =  JSON.parse(localStorage.getItem('movies'));
    this.movieDetails.push(movieDetails);
    localStorage.setItem('movies', JSON.stringify(this.movieDetails));
  }

  setStorage(movies) {
    localStorage.setItem('movies', JSON.stringify(movies));
  }

  public searchMovie(title: string) {
    if (!title) {
      this.validSearch = false;
      this.notProvided = true;
      this.notFound = false;
    } else {
      return this.omdbService.getMoviesByTitle(title);
    }
  }
}
