import {Component, Input, OnInit} from '@angular/core';
import {MovieService} from '../../services/movie.service';
import {Observable, Subscription} from 'rxjs';
import {Movie, MovieDetails, MovieList} from '../../models/movie.model';
import {OmdbService} from '../../services/omdb.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-feature-page',
  templateUrl: './feature-page.component.html',
  styleUrls: ['./feature-page.component.scss']
})
export class FeaturePageComponent implements OnInit {

  private subscription: Subscription;
  public loading: boolean;
  public movies: MovieDetails[];
  public errorLog: string;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private omdbService: OmdbService,
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(params => {
      this.getMovies(params.title);
    });
  }

  getMovies(title: string = 'bridge') {
    this.omdbService.getMoviesFullDatilsByTitle(title, 2)
      .subscribe(movies => {
        this.movies = movies.splice(0, 2);
        this.loading = false;
      }, error => {
        this.loading = false;
        if (error) {
          this.errorLog = error.Error;
        } else {
          console.log('Error in Service response', error);
        }

      });
  }

  public isValidSearch = () => this.movieService.validSearch;
  public isNotFound = () => this.movieService.notFound;
  public isNotProvided = () => this.movieService.notProvided;

}
