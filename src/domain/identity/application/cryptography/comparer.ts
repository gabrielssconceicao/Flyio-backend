export abstract class HashComparer {
  abstract compare(password: string, hashedPassword: string): Promise<boolean>;
}
