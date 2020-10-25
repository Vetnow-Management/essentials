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
  });

  describe('Is Present', () => {
    test('Should always return true', () => {
      expect(Optional.from('test').isPresent())
        .toBeTruthy();
      expect(Optional.from({t: 'tst'}).isPresent())
        .toBeTruthy();
      expect(Optional.from(true).isPresent())
        .toBeTruthy();
      expect(Optional.from(false).isPresent())
        .toBeTruthy();
      expect(Optional.from(0).isPresent())
        .toBeTruthy();
      expect(Optional.from(1).isPresent())
        .toBeTruthy();
      expect(Optional.from('').isPresent())
        .toBeTruthy();
      expect(Optional.from({}).isPresent())
        .toBeTruthy();
      expect(Optional.from([]).isPresent())
        .toBeTruthy();
    });
    test('Should always return false', () => {
      expect(Optional.from(null).isPresent())
        .toBeFalsy();
      expect(Optional.from(undefined).isPresent())
        .toBeFalsy();
    });
  });

  describe('Is Not Present', () => {
    test('Should always return true', () => {
      expect(Optional.from(null).isNotPresent())
        .toBeTruthy();
      expect(Optional.from(undefined).isNotPresent())
        .toBeTruthy()
    });
    test('Should always return false', () => {
      expect(Optional.from('test').isNotPresent())
        .toBeFalsy();
      expect(Optional.from({t: 'tst'}).isNotPresent())
        .toBeFalsy();
      expect(Optional.from(true).isNotPresent())
        .toBeFalsy();
      expect(Optional.from(false).isNotPresent())
        .toBeFalsy();
      expect(Optional.from(0).isNotPresent())
        .toBeFalsy();
      expect(Optional.from(1).isNotPresent())
        .toBeFalsy();
      expect(Optional.from('').isNotPresent())
        .toBeFalsy();
      expect(Optional.from({}).isNotPresent())
        .toBeFalsy();
      expect(Optional.from([]).isNotPresent())
        .toBeFalsy();
    });
  })

  describe('Map', () => {
    test('Success', () => {
      type PessoaType = {
        nome?: string;
        cpf?: string;
        endereco?: {
          cep?: string
        },
        filiacao?: {
          mae: PessoaType,
          pai: PessoaType,
        }
      };

      const pessoa: PessoaType = {
        nome: 'Mateus',
        cpf: '74917649161',
        endereco: {
          cep: '73062004'
        },
        filiacao: {
          mae: {
            nome: 'Adelcia',
            cpf: '24897942217',
            endereco: {
              cep: '73062004',
            },
          },
          pai: {
            nome: 'Wilton',
            cpf: undefined,
            endereco: undefined
          }
        },
      };

      const cepMateus = Optional
        .from(pessoa)
        .map(pessoaPresent => pessoaPresent.endereco)
        .map(endereco => endereco.cep)
        .get();
      const cepPai = Optional
        .from(pessoa)
        .map(pessoaPresent => pessoaPresent.filiacao)
        .map(filicao => filicao.pai)
        .map(pai => pai.endereco)
        .map(endereco => endereco.cep)
        .get();
      const cpfPai = Optional
        .from(pessoa)
        .map(pessoaPresent => pessoaPresent.filiacao)
        .map(filiacao => filiacao.pai)
        .map(pai => pai.cpf)
        .map(cpf => cpf.toUpperCase())
        .get();
      const nomeMae = Optional
        .from(pessoa)
        .map(pessoaPresent => pessoaPresent.filiacao?.mae?.nome?.toUpperCase())
        .get();

      expect(cepMateus).toBe('73062004')
      expect(cepPai).toBeNull();
      expect(cpfPai).toBeNull();
      expect(nomeMae).toBe('ADELCIA');
    });
  });

  describe('orElse', () => {
    test('Success', () => {
      type Pessoa = {
        endereco?: {
          cep?: string;
          numero?: string;
        },
        nome?: string;
        idade?: number;
      }

      const pessoa: Pessoa = {
        endereco: {
          cep: '11111',
          numero: '22'
        },
        nome: 'test'
      };

      const idade = Optional.from(pessoa)
        .map(p => p.idade)
        .orElse(22);
      const nome = Optional.from(pessoa)
        .map((p) => p.nome)
        .orElse('outro nome');

      expect(idade).toBe(22);
      expect(nome).toBe('test');
    });
  });

  describe('OrElseGet', () => {
    test('Success', () => {
      type Pessoa = {
        endereco?: {
          cep?: string;
          numero?: string;
        },
        nome?: string;
        idade?: number;
      }

      const pessoa: Pessoa = {
        endereco: {
          cep: '11111',
          numero: '22'
        },
        nome: 'test'
      };

      const idade = Optional.from(pessoa)
        .map(p => p.idade)
        .orElseGet(() => 22);
      const nome = Optional.from(pessoa)
        .map((p) => p.nome)
        .orElseGet(() => 'outro nome');

      expect(idade).toBe(22);
      expect(nome).toBe('test');
    });
  })
});
