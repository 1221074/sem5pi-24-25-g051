:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_client)).

% Inicializa o servidor na porta 5000
:- initialization(iniciar_servidor(5000)).

iniciar_servidor(Porta) :-
    http_server(http_dispatch, [port(Porta)]),
    format('Servidor iniciado na porta ~w~n', [Porta]).

% Manipuladores
:- http_handler('/ola', responde_ola, []).
:- http_handler('/registrar_usuario', registrar_usuario, []).
:- http_handler('/enviar_arquivo', receber_arquivo, []).

% Responde ao caminho '/ola'
responde_ola(_Pedido) :-
    format('Content-type: text/plain~n~n'),
    format('Olá, mundo Prolog!~n').

% Manipula o registro de usuário
registrar_usuario(Pedido) :-
    http_parameters(Pedido,
        [ nome(Nome, []),
          sexo(Sexo, [oneof([masculino, feminino])]),
          ano_nascimento(Ano, [integer, between(1900, 2023)])
        ]),
    format('Content-type: text/plain~n~n'),
    format('Usuário registrado com sucesso!~n'),
    format('Nome: ~w~nSexo: ~w~nAno de Nascimento: ~w~n', [Nome, Sexo, Ano]).

% Recebe um arquivo enviado via POST
receber_arquivo(Pedido) :-
    setup_call_cleanup(
        http_read_data(Pedido, Dados, [form_data(mime)]),
        processar_arquivo(Dados),
        true).

processar_arquivo(Dados) :-
    member(mime(Conteudo, [filename(NomeArquivo)|_], _), Dados),
    % Aqui você pode salvar o arquivo ou processá-lo conforme necessário
    format('Content-type: text/plain~n~n'),
    format('Arquivo ~w recebido com sucesso!~n', [NomeArquivo]).
