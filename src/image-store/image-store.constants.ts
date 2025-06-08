export enum ImageStoreFolders {
  PROFILE = 'flyio/profile-images',
  BANNER = 'flyio/banner-images',
}
export type ImageFolder = keyof typeof ImageStoreFolders;
