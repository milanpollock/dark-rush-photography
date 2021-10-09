import {
  IsArray,
  IsBoolean,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { EntityUpdate } from '@dark-rush-photography/shared/types';
import { LocationDto } from './location.dto';

export class EntityUpdateDto implements EntityUpdate {
  @IsString()
  slug!: string;

  @IsInt()
  @Min(0)
  order!: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  seoDescription?: string;

  @IsArray()
  @Type(() => String)
  seoKeywords: string[] = [];

  @IsISO8601()
  @IsOptional()
  dateCreated?: string;

  @IsISO8601()
  @IsOptional()
  datePublished?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location!: LocationDto;

  @IsBoolean()
  starredImageIsCentered!: boolean;

  @IsArray()
  @Type(() => String)
  text: string[] = [];

  @IsBoolean()
  isPublic!: boolean;
}
