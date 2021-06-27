import { Injectable } from '@nestjs/common';

import { EntityType, SocialMedia } from '@dark-rush-photography/shared-types';
import { SocialMediaCreateDto } from '@dark-rush-photography/api/types';
import { DocumentModel } from '../schema/document.schema';
import { toImage } from '../functions/image.functions';
import { toImageDimension } from '../functions/image-dimension.functions';
import { toVideo } from '../functions/video.functions';
import { toVideoDimension } from '../functions/video-dimension.functions';
import { findPublicContent } from '../functions/public.functions';

@Injectable()
export class SocialMediaProvider {
  newSocialMedia(socialMedia: SocialMediaCreateDto): SocialMedia {
    return {
      type: EntityType.SocialMedia,
      group: socialMedia.group,
      slug: socialMedia.slug,
      isPublic: true,
      images: [],
      imageDimensions: [],
      videos: [],
      videoDimensions: [],
    } as SocialMedia;
  }

  fromDocumentModel = (documentModel: DocumentModel): SocialMedia => {
    return {
      id: documentModel._id,
      group: documentModel.group,
      slug: documentModel.slug,
      images: documentModel.images.map((image) => toImage(image)),
      imageDimensions: documentModel.imageDimensions.map((imageDimension) =>
        toImageDimension(imageDimension)
      ),
      videos: documentModel.videos.map((video) => toVideo(video)),
      videoDimensions: documentModel.videoDimensions.map((videoDimension) =>
        toVideoDimension(videoDimension)
      ),
    };
  };

  fromDocumentModelPublic = (documentModel: DocumentModel): SocialMedia => {
    const publicContent = findPublicContent(documentModel);
    return {
      id: documentModel._id,
      group: documentModel.group,
      slug: documentModel.slug,
      images: publicContent.images,
      imageDimensions: publicContent.imageDimensions,
      videos: publicContent.videos,
      videoDimensions: publicContent.videoDimensions,
    };
  };
}
