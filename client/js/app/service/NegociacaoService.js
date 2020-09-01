'use strict';

System.register(['./HttpService.js', '../models/Negociacao.js', '../dao/NegociacaoDAO.js', './ConnectionFactory.js'], function (_export, _context) {
  "use strict";

  var HttpService, Negociacao, NegociacaoDao, ConnectionFactory, _createClass, NegociacaoService;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_HttpServiceJs) {
      HttpService = _HttpServiceJs.HttpService;
    }, function (_modelsNegociacaoJs) {
      Negociacao = _modelsNegociacaoJs.Negociacao;
    }, function (_daoNegociacaoDAOJs) {
      NegociacaoDao = _daoNegociacaoDAOJs.NegociacaoDao;
    }, function (_ConnectionFactoryJs) {
      ConnectionFactory = _ConnectionFactoryJs.ConnectionFactory;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('NegociacaoService', NegociacaoService = function () {
        function NegociacaoService() {
          _classCallCheck(this, NegociacaoService);

          this._http = new HttpService();
        }

        _createClass(NegociacaoService, [{
          key: 'obterNegociacoesDaSemana',
          value: function obterNegociacoesDaSemana() {
            var _this = this;

            return new Promise(function (resolve, reject) {
              _this._http.get('negociacoes/semana').then(function (negociacoes) {
                resolve(negociacoes.map(function (r) {
                  return new Negociacao(new Date(r.data), r.quantidade, r.valor);
                }));
              }).catch(function (erro) {
                console.log(erro);
                reject("Não foi possível obter as negociações da semana");
              });
            });
          }
        }, {
          key: 'obterNegociacoesDaSemanaAnterior',
          value: function obterNegociacoesDaSemanaAnterior() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
              _this2._http.get('negociacoes/anterior').then(function (negociacoes) {
                resolve(negociacoes.map(function (r) {
                  return new Negociacao(new Date(r.data), r.quantidade, r.valor);
                }));
              }).catch(function (erro) {
                console.log(erro);
                reject("Não foi possível obter as negociações da semana anterior");
              });
            });
          }
        }, {
          key: 'obterNegociacoesDaSemanaRetrasada',
          value: function obterNegociacoesDaSemanaRetrasada() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
              _this3._http.get('negociacoes/retrasada').then(function (negociacoes) {
                resolve(negociacoes.map(function (r) {
                  return new Negociacao(new Date(r.data), r.quantidade, r.valor);
                }));
              }).catch(function (erro) {
                console.log(erro);
                reject("Não foi possível obter as negociações da semana retrasada");
              });
            });
          }
        }, {
          key: 'obterNegociacoes',
          value: function obterNegociacoes() {

            return Promise.all([this.obterNegociacoesDaSemana(), this.obterNegociacoesDaSemanaAnterior(), this.obterNegociacoesDaSemanaRetrasada()]).then(function (periodos) {

              var negociacoes = periodos.reduce(function (dados, periodo) {
                return dados.concat(periodo);
              }, []).map(function (dado) {
                return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
              });

              return negociacoes;
            }).catch(function (erro) {
              throw new Error(erro);
            });
          }
        }, {
          key: 'cadastra',
          value: function cadastra(negociacao) {
            return ConnectionFactory.getConnection().then(function (connection) {
              return new NegociacaoDao(connection);
            }).then(function (dao) {
              return dao.adiciona(negociacao);
            }).then(function () {
              return 'Negociação cadastrada com sucesso';
            }).catch(function (erro) {
              console.log(erro);
              throw new Error('Não foi possível adicionar a negociação');
            });
          }
        }, {
          key: 'lista',
          value: function lista() {
            return ConnectionFactory.getConnection().then(function (connection) {
              return new NegociacaoDao(connection);
            }).then(function (dao) {
              return dao.listaTodos();
            }).catch(function (erro) {
              console.log(erro);
              throw new Error('Não foi possível obter as negociações');
            });
          }
        }, {
          key: 'apaga',
          value: function apaga() {
            return ConnectionFactory.getConnection().then(function (connection) {
              return new NegociacaoDao(connection);
            }).then(function (dao) {
              return dao.apagaTodos();
            }).then(function () {
              return 'Negociações apagadas com sucesso';
            }).catch(function (erro) {
              console.log(erro);
              throw new Error('Não foi possível apagar as negociações');
            });
          }
        }, {
          key: 'importa',
          value: function importa(listaAtual) {
            var _this4 = this;

            return this.obterNegociacoes().then(function (negociacoes) {
              return negociacoes.filter(function (negociacao) {
                return !listaAtual.some(function (negociacaoExistente) {
                  return JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente);
                });
              });
            }).catch(function (erro) {
              return _this4._mensagem.texto = erro;
            });
          }
        }]);

        return NegociacaoService;
      }());

      _export('NegociacaoService', NegociacaoService);
    }
  };
});
//# sourceMappingURL=NegociacaoService.js.map