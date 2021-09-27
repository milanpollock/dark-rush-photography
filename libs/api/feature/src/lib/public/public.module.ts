import { Module } from '@nestjs/common';

import { AboutModule } from './about/about.module';
import { BestOfModule } from './best-of/best-of.module';
import { DestinationsModule } from './destinations/destinations.module';
import { EventsModule } from './events/events.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ImagesModule } from './images/images.module';
import { PhotoOfTheWeekModule } from './photo-of-the-week/photo-of-the-week.module';
import { ReviewMediaModule } from './review-media/review-media.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SitemapModule } from './sitemap/sitemap.module';

@Module({
  imports: [
    AboutModule,
    BestOfModule,
    DestinationsModule,
    EventsModule,
    FavoritesModule,
    ImagesModule,
    PhotoOfTheWeekModule,
    ReviewMediaModule,
    ReviewsModule,
    SitemapModule,
  ],
})
export class PublicModule {}
