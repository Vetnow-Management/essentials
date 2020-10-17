import { Consumer, Optional } from '../../main';

function testFuncCalled(func: Consumer<any>): void {
  expect(func)
    .toBeCalledWith('a');
  expect(func)
    .toBeCalledWith('');
  expect(func)
    .toBeCalledWith({ a: 's' });
  expect(func)
    .toBeCalledWith(['s', { s: 's' }]);
  expect(func)
    .toBeCalledWith(123);
  expect(func)
    .toBeCalledWith(true);
  expect(func)
    .toBeCalledWith(false);
}

describe('Optional', () => {
  describe('If present', () => {
    test('should execute function passed to ifPresent', () => {
      const func = jest.fn();
      Optional.from('a')
        .ifPresent(func);
      Optional.from('')
        .ifPresent(func);
      Optional.from({ a: 's' })
        .ifPresent(func);
      Optional.from(['s', { s: 's' }])
        .ifPresent(func);
      Optional.from(123)
        .ifPresent(func);
      Optional.from(true)
        .ifPresent(func);
      Optional.from(false)
        .ifPresent(func);

      testFuncCalled(func);
    });

    test('should not execute function passed to ifPresent', () => {
      const func = jest.fn();
      Optional.from(null)
        .ifPresent(func);
      Optional.from(undefined)
        .ifPresent(func);

      expect(func)
        .not.toBeCalled();
    });
  });

  describe('If present or else', () => {
    test('should execute presentFunc passed to ifPresentOrElse', () => {
      const presentFunc = jest.fn();
      const notPresentFunc = jest.fn();

      Optional.from('a')
        .ifPresentOrElse(presentFunc, notPresentFunc);
      Optional.from('')
        .ifPresentOrElse(presentFunc, notPresentFunc);
      Optional.from({ a: 's' })
        .ifPresentOrElse(presentFunc, notPresentFunc);
      Optional.from(['s', { s: 's' }])
        .ifPresentOrElse(presentFunc, notPresentFunc);
      Optional.from(123)
        .ifPresentOrElse(presentFunc, notPresentFunc);
      Optional.from(true)
        .ifPresentOrElse(presentFunc, notPresentFunc);
      Optional.from(false)
        .ifPresentOrElse(presentFunc, notPresentFunc);

      testFuncCalled(presentFunc);
      expect(notPresentFunc)
        .not.toBeCalled();
    });

    test('should execute notPresentFunc passed to ifPresentOrElse', () => {
      const presentFunc = jest.fn();
      const notPresentFunc = jest.fn();

      Optional.from(null)
        .ifPresentOrElse(presentFunc, notPresentFunc);
      Optional.from(undefined)
        .ifPresentOrElse(presentFunc, notPresentFunc);

      expect(presentFunc)
        .not.toBeCalled();
      expect(notPresentFunc)
        .toBeCalled();
    });
  });

  describe('Empty', () => {
    test('Success testes', () => {
      const isOptional = Optional.empty() instanceof Optional;
      const mockThatShouldNotBeCalled = jest.fn();
      const mockThatShouldBeCalled = jest.fn();

      Optional.empty()
        .ifPresent(mockThatShouldNotBeCalled);
      Optional.empty()
        .ifPresentOrElse(
          mockThatShouldNotBeCalled,
          mockThatShouldBeCalled,
        );

      expect(isOptional)
        .toBeTruthy();
      expect(Optional.empty().get())
        .toBeNull();
      expect(mockThatShouldNotBeCalled)
        .not.toBeCalled();
      expect(mockThatShouldBeCalled)
        .toBeCalled();
    });
  });

  describe('Get', () => {
    test('Success testes', () => {
      expect(Optional.from('flamboyant').get())
        .toBe('flamboyant');
      expect(
        // @ts-ignore: So para testar se vai da erro
        () => Optional.from<string>(null).get().toUpperCase()
      ).toThrow();
      expect(Optional.from<string>(null).get())
        .toBe(null);
    })
  })
});
