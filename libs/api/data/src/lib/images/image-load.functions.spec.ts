import faker from '@faker-js/faker';

import {
  DUMMY_MONGODB_ID,
  Image,
  ImageState,
} from '@dark-rush-photography/shared/types';
import {
  findFirstImage,
  findLovedPublishImages,
  findStarredPublishImage,
  loadImageAdmin,
  loadImagePublic,
} from './image-load.functions';

describe('image-load.functions', () => {
  describe('loadImageAdmin', () => {
    const image: Image = {
      id: faker.datatype.uuid(),
      entityId: DUMMY_MONGODB_ID,
      storageId: faker.datatype.uuid(),
      pathname: faker.lorem.word(),
      order: faker.datatype.number(),
      state: faker.random.arrayElement(Object.values(ImageState)),
      threeSixtyImageStorageId: faker.datatype.uuid(),
      isStarred: faker.datatype.boolean(),
      isLoved: faker.datatype.boolean(),
      title: faker.lorem.sentence(),
      seoDescription: faker.lorem.sentences(),
      seoKeywords: [
        faker.lorem.word(),
        faker.lorem.word(),
        faker.lorem.word(),
      ].join(','),
    };

    it('should not contain an _id value', () => {
      const imageWithMongoDbId = {
        ...image,
        _id: faker.datatype.uuid(),
      };
      const result = loadImageAdmin(imageWithMongoDbId);
      expect('_id' in result).toBe(false);
      expect(result.id).toBe(image.id);
    });

    it('should load an admin image with all values', () => {
      const result = loadImageAdmin(image);

      expect(result.id).toBe(image.id);
      expect(result.entityId).toBe(image.entityId);
      expect(result.storageId).toBe(image.storageId);
      expect(result.pathname).toBe(image.pathname);
      expect(result.order).toBe(image.order);
      expect(result.state).toBe(image.state);
      expect(result.threeSixtyImageStorageId).toBe(
        image.threeSixtyImageStorageId
      );
      expect(result.isStarred).toBe(image.isStarred);
      expect(result.isLoved).toBe(image.isLoved);
      expect(result.title).toBe(image.title);
      expect(result.seoDescription).toBe(image.seoDescription);
      expect(result.seoKeywords).toEqual(image.seoKeywords?.split(','));
    });

    it('should load an admin image with values when they are not provided', () => {
      const result = loadImageAdmin({
        ...image,
        title: undefined,
        seoDescription: undefined,
        seoKeywords: undefined,
      });
      expect(result.title).toBe('');
      expect(result.seoDescription).toBe('');
      expect(result.seoKeywords).toEqual([]);
    });
  });

  describe('loadImagePublic', () => {
    const image = {
      storageId: faker.datatype.uuid(),
      pathname: faker.lorem.word(),
      order: faker.datatype.number(),
      threeSixtyImageStorageId: faker.datatype.uuid(),
      smallDimension: {
        width: faker.datatype.number(),
        height: faker.datatype.number(),
      },
    } as Image;

    it('should not contain an _id value', () => {
      const imageWithMongoDbId = {
        ...image,
        _id: faker.datatype.uuid(),
      };
      const result = loadImagePublic(imageWithMongoDbId);
      expect('_id' in result).toBe(false);
    });

    it('should load a public image with all values', () => {
      const result = loadImagePublic(image);

      expect(result.storageId).toBe(image.storageId);
      expect(result.pathname).toBe(image.pathname);
      expect(result.order).toBe(image.order);
      expect(result.threeSixtyImageStorageId).toBe(
        image.threeSixtyImageStorageId
      );
      expect(result.smallDimension).toEqual(image.smallDimension);
    });

    it('should load a public image with values when they are not provided', () => {
      const result = loadImagePublic({
        ...image,
        smallDimension: undefined,
      });
      expect(result.smallDimension).toEqual({ width: 0, height: 0 });
    });
  });

  describe('findStarredPublishImage', () => {
    it('should find a starred publish image with state of selected', () => {
      const images = [
        { isStarred: true, state: ImageState.Selected } as Image,
        {} as Image,
      ];

      const result = findStarredPublishImage(images);
      expect(result).toBeDefined();
    });

    it('should find a starred publish image with state of public', () => {
      const images = [
        { isStarred: true, state: ImageState.Public } as Image,
        {} as Image,
      ];

      const result = findStarredPublishImage(images);
      expect(result).toBeDefined();
    });

    it('should not find a starred publish image when non are available', () => {
      const images = [{} as Image];

      const result = findStarredPublishImage(images);
      expect(result).toBeUndefined();
    });

    it('should not find a starred publish image when images empty', () => {
      const images: Image[] = [];

      const result = findStarredPublishImage(images);
      expect(result).toBeUndefined();
    });
  });

  describe('findLovedPublishImages', () => {
    it('should find loved publish images with state of selected', () => {
      const images = [
        { isLoved: true, state: ImageState.Selected } as Image,
        { isLoved: true, state: ImageState.Selected } as Image,
        {} as Image,
      ];

      const result = findLovedPublishImages(images);
      expect(result.length).toBe(2);
    });

    it('should find loved publish images with state of public', () => {
      const images = [
        { isLoved: true, state: ImageState.Public } as Image,
        { isLoved: true, state: ImageState.Public } as Image,
        {} as Image,
      ];

      const result = findLovedPublishImages(images);
      expect(result.length).toBe(2);
    });

    it('should find loved publish images with state of selected and public', () => {
      const images = [
        { isLoved: true, state: ImageState.Selected } as Image,
        { isLoved: true, state: ImageState.Public } as Image,
        {} as Image,
      ];

      const result = findLovedPublishImages(images);
      expect(result.length).toBe(2);
    });

    it('should not find loved publish images when non are available', () => {
      const images = [{} as Image];

      const result = findLovedPublishImages(images);
      expect(result.length).toBe(0);
    });

    it('should not find loved publish images when images empty', () => {
      const images: Image[] = [];

      const result = findLovedPublishImages(images);
      expect(result.length).toBe(0);
    });
  });

  describe('findFirstImage', () => {
    it('should find the first image', () => {
      const firstImageId = faker.datatype.uuid();
      const images = [
        { id: firstImageId } as Image,
        { id: faker.datatype.uuid() } as Image,
      ];

      const result = findFirstImage(images);
      expect(result?.id).toBe(firstImageId);
    });

    it('should return undefined if there are not any images', () => {
      const images: Image[] = [];

      const result = findFirstImage(images);
      expect(result).toBeUndefined();
    });
  });
});
