export abstract class Comparator {
  abstract compare(data: { password: string; hash: string }): Promise<boolean>;
}
