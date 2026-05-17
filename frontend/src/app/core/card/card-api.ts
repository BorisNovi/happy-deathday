import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments';
import { ICard, ICardCreate } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class CardApi {
  readonly #http = inject(HttpClient);

  getById(id: string): Observable<ICard> {
    return this.#http.get<ICard>(`${environment.apiUrl}/cards/${id}`);
  }

  create(body: ICardCreate): Observable<ICard> {
    return this.#http.post<ICard>(`${environment.apiUrl}/cards`, body);
  }
}
