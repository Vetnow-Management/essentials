import { Consumer, Runnable } from '../types';
import Verify from '../verifies/Verify';

export default class Optional<T> {
  private static readonly EMPTY: Optional<null> = new Optional<null>(null);

  public constructor(private readonly value: T | null | undefined) {}

  public static from<G = unknown>(value: G | null | undefined): Optional<G> {
    return new Optional<G>(value);
  }

  public static empty(): Optional<null> {
    return this.EMPTY;
  }

  public ifPresent(func: Consumer<NonNullable<T>>): void {
    if (Verify.isNotNullOrUndefined(this.value)) {
      func(this.value as NonNullable<T>);
    }
  }

  public ifPresentOrElse(presentFunc: Consumer<NonNullable<T>>, notPresentFunc: Runnable): void {
    if (Verify.isNotNullOrUndefined(this.value)) {
      presentFunc(this.value as NonNullable<T>);
    } else {
      notPresentFunc();
    }
  }

  public get(): T | null | undefined {
    return this.value;
  }
}

