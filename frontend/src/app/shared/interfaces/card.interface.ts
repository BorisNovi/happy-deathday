import { CardStyle } from './card-style.enum';
import { Country } from './country.enum';
import { IEntity } from './entity.interface';

export interface ICard extends IEntity {
  recipientName: string;
  birthDate: string | Date;
  deathDate?: string | Date;
  expiresAt: string | Date;
}

export interface ICardCreate {
  recipientName: string;
  birthDate: string | Date;
  lang: string;
  countryCode: Country;
  gender: 'male' | 'female';
  style: CardStyle;
}
