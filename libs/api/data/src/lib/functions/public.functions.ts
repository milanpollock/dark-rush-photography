import {
  Comment,
  Emotion,
  Image,
  ImageDimension,
  Video,
  VideoDimension,
} from '@dark-rush-photography/shared-types';
import { DocumentModel } from '../schema/document.schema';
import { findPublicImages } from './image.functions';
import { findPublicImageDimensions } from './image-dimension.functions';
import { findPublicVideos } from './video.functions';
import { findPublicVideoDimensions } from './video-dimension.functions';
import { findPublicComments } from './comment.functions';
import { findPublicEmotions } from './emotion.functions';

export const findPublicContent = (
  documentModel: DocumentModel
): {
  images: Image[];
  imageDimensions: ImageDimension[];
  videos: Video[];
  videoDimensions: VideoDimension[];
  comments: Comment[];
  emotions: Emotion[];
} => {
  const publicImages = findPublicImages(documentModel.images);
  const publicImageIds = publicImages.map((i) => i.id);
  const publicImageDimensions = findPublicImageDimensions(
    documentModel.imageDimensions,
    publicImageIds
  );
  const publicVideos = findPublicVideos(documentModel.videos);
  const publicVideoIds = publicVideos.map((v) => v.id);
  const publicVideoDimensions = findPublicVideoDimensions(
    documentModel.videoDimensions,
    publicVideoIds
  );
  const publicComments = findPublicComments(documentModel.comments, [
    ...publicImageIds,
    ...publicVideoIds,
  ]);
  const publicEmotions = findPublicEmotions(
    documentModel.emotions,
    [...publicImageIds, ...publicVideoIds],
    publicComments.map((c) => c.id)
  );

  return {
    images: publicImages,
    imageDimensions: publicImageDimensions,
    videos: publicVideos,
    videoDimensions: publicVideoDimensions,
    comments: publicComments,
    emotions: publicEmotions,
  };
};
