export abstract class Hasher {
  abstract hash(password: string): Promise<string>;
}
