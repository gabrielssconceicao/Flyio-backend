export enum ImageStoreFolders {
  PROFILE = 'flyio/profile-images',
  BANNER = 'flyio/banner-images',

  POST = 'flyio/post-images',
}
export type ImageFolder = keyof typeof ImageStoreFolders;

export enum ImageStoreTypeFolder {
  PROFILE = 'PROFILE',
  BANNER = 'BANNER',
  POST = 'POST',
}
