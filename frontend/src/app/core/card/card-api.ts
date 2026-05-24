import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments';
import { buildHttpParams, ICard, ICardCreate, ICardPreview } from '@shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardApi {
  readonly #http = inject(HttpClient);

  getById(id: string): Observable<ICard> {
    return this.#http.get<ICard>(`${environment.apiUrl}/cards/${id}`);
  }

  preview(params: Pick<ICardCreate, 'birthDate' | 'countryCode' | 'gender'>): Observable<ICardPreview> {
    const d = params.birthDate instanceof Date ? params.birthDate : new Date(params.birthDate);
    const birthDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return this.#http.get<ICardPreview>(`${environment.apiUrl}/cards/preview`, { params: buildHttpParams({ ...params, birthDate }) });
  }

  create(body: ICardCreate): Observable<ICard> {
    return this.#http.post<ICard>(`${environment.apiUrl}/cards`, body);
  }
}
