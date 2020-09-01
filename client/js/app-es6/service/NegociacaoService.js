import {HttpService} from './HttpService.js';
import {Negociacao} from '../models/Negociacao.js';
import {NegociacaoDao} from '../dao/NegociacaoDAO.js';
import {ConnectionFactory} from './ConnectionFactory.js';

export class NegociacaoService {

  constructor() {

    this._http = new HttpService();
  }

  obterNegociacoesDaSemana() {
    return new Promise((resolve, reject) => {
      this._http
        .get('negociacoes/semana')
        .then(negociacoes => {
          resolve(negociacoes.map(r => new Negociacao(new Date(r.data), r.quantidade, r.valor)))
        })
        .catch(erro => {
          console.log(erro);
          reject("Não foi possível obter as negociações da semana");
        })
    })
  }

  obterNegociacoesDaSemanaAnterior() {
    return new Promise((resolve, reject) => {
      this._http
        .get('negociacoes/anterior')
        .then(negociacoes => {
          resolve(negociacoes.map(r => new Negociacao(new Date(r.data), r.quantidade, r.valor)))
        })
        .catch(erro => {
          console.log(erro);
          reject("Não foi possível obter as negociações da semana anterior");
        })
    })
  }

  obterNegociacoesDaSemanaRetrasada() {

    return new Promise((resolve, reject) => {
      this._http
        .get('negociacoes/retrasada')
        .then(negociacoes => {
          resolve(negociacoes.map(r => new Negociacao(new Date(r.data), r.quantidade, r.valor)))
        })
        .catch(erro => {
          console.log(erro);
          reject("Não foi possível obter as negociações da semana retrasada");
        })
    })
  }

  obterNegociacoes() {
        
    return Promise.all([
        this.obterNegociacoesDaSemana(),
        this.obterNegociacoesDaSemanaAnterior(),
        this.obterNegociacoesDaSemanaRetrasada()
    ]).then(periodos => {

        let negociacoes = periodos
            .reduce((dados, periodo) => dados.concat(periodo), [])
            .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor ));

        return negociacoes;
    }).catch(erro => {
        throw new Error(erro);
    });
  } 

  cadastra(negociacao) {
    return ConnectionFactory
      .getConnection()
      .then(connection => new NegociacaoDao(connection))
      .then(dao => dao.adiciona(negociacao))
      .then(() => 'Negociação cadastrada com sucesso')
      .catch(erro => {
        console.log(erro);
        throw new Error('Não foi possível adicionar a negociação');
      })
  }

  lista() {
    return ConnectionFactory
      .getConnection()
      .then(connection => new NegociacaoDao(connection))
      .then(dao => dao.listaTodos())
      .catch(erro => {
        console.log(erro);
        throw new Error('Não foi possível obter as negociações');
      })
  }

  apaga() {
    return ConnectionFactory
      .getConnection()
        .then(connection => new NegociacaoDao(connection))
        .then(dao => dao.apagaTodos())
        .then(() => 'Negociações apagadas com sucesso')
        .catch(erro => {
          console.log(erro);
          throw new Error('Não foi possível apagar as negociações')
        });
  }

  importa(listaAtual) {
    return this.obterNegociacoes()
        .then(negociacoes =>
          negociacoes.filter(negociacao => 
            !listaAtual.some(negociacaoExistente => 
              JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)
            )
          )  
        )
        .catch(erro => this._mensagem.texto = erro);
  }
}