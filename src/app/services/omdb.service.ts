import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, pipe} from 'rxjs';
import {OmdbConfig} from '../config/omdb-config';
import {Movie, MovieDetails, MovieList} from '../models/movie.model';
import {map, mergeMap} from 'rxjs/operators';
import {async} from 'rxjs/internal/scheduler/async';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {

  defaultOmdbUrl =
    `${OmdbConfig.baseUrl}?apikey=${OmdbConfig.apiKey}&type=${OmdbConfig.videoType}&r=${OmdbConfig.responseType}`;

  constructor(private http: HttpClient) { }

  getMoviesByTitle(title: string): Observable<MovieList> {
    return this.http.get<MovieList>(`${this.defaultOmdbUrl}&s=${encodeURI(title)}&plot=full`);
  }

  getMoviesFullDatilsByTitle(title: string, topCount: number): Observable<MovieDetails[]> {
    return this.getMoviesByTitle(title)
      .pipe(
        map((movies: MovieList) => {
          if (movies.Response === 'False' || movies.Error) { throw movies; }

          if (movies.Response && movies.Search.length > 0) {
              movies.Search = movies.Search.splice(0, topCount);
              return movies;
          } else {
            if (movies.Search.length === 0) {
              throw new Error('No Record Found.');
            }
          }
        }),
        mergeMap((movies) => {
          console.log('movies', movies);
          const urls = movies.Search.map((movie) => {
            return this.getMovieDetailsByImdbId(movie.imdbID);
          });
          return forkJoin(urls);
        })
     );
  }

  getMovieDetailsByImdbId(imdbId: string): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.defaultOmdbUrl}&i=${imdbId}`);
  }

  getMovieDetailsByTitle(title: string): Observable<any> {
    return this.http.get(`${this.defaultOmdbUrl}&t=${title}`);
  }

  getMoviesAtPage(title: string, pageValue: number): Observable<any> {
    return this.http.get(`${this.defaultOmdbUrl}&s=${encodeURI(title)}*&page=${pageValue}&plot=full`);
  }

}
