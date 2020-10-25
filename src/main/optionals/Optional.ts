import Assert from '../asserts/Assert';
import Verify from '../verifies/Verify';
import { Consumer, Func, Runnable, Supplier } from '../types';

export default class Optional<T = unknown | null | undefined> {
  public constructor(private readonly value: T | null | undefined) {}

  public static from<G = unknown>(value: G | null | undefined): Optional<G> {
    return new Optional<G>(value);
  }

  public static empty<G>(): Optional<G> {
    return new Optional<G>(null);
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

  public isPresent(): boolean {
    return Verify.isNotNullOrUndefined(this.value);
  }

  public isNotPresent(): boolean {
    return Verify.isNullOrUndefined(this.value);
  }

  public map<R>(mapper: Func<NonNullable<T>, R>): Optional<R> {
    Assert.notNullOrUndefined(mapper, { errorMessage: 'a funcao do mapper nao estar nulla'});

    if (this.isPresent()) {
     return Optional.from(mapper(this.value as NonNullable<T>));
    }
    return Optional.empty();
  }

  public orElse(other: NonNullable<T>): NonNullable<T> {
    const returnValue = Verify.isNullOrUndefined(this.value)
      ? other
      : this.value;

    return returnValue as NonNullable<T>
  }

  public orElseGet(supplier: Supplier<NonNullable<T>>): NonNullable<T> {
    const returnValue = Verify.isNullOrUndefined(this.value)
    ? supplier()
    : this.value;

    return returnValue as NonNullable<T>;
  }
}
