% Representation of tasks with ID, process time, due time, and penalty weight.
% task(Id, ProcessTime, DueTime, PenaltyWeight).
task(t1, 2, 5, 1).
task(t2, 4, 7, 6).
task(t3, 1, 11, 2).
task(t4, 3, 9, 3).
task(t5, 3, 8, 2).

% Dynamic declarations for various genetic algorithm parameters.
:- dynamic generations/1. % Number of generations.
:- dynamic population/1. % Population size.
:- dynamic prob_crossover/1. % Crossover probability.
:- dynamic prob_mutation/1. % Mutation probability.

% Parameters initialization for the genetic algorithm.
initialize :-
    write('Number of new generations: '), read(NG),
    (retract(generations(_)); true), asserta(generations(NG)), % Update generations.
    write('Population size: '), read(PS),
    (retract(population(_)); true), asserta(population(PS)), % Update population size.
    write('Probability of crossover (%):'), read(P1),
    PC is P1 / 100, % Convert percentage to decimal.
    (retract(prob_crossover(_)); true), asserta(prob_crossover(PC)), % Update crossover probability.
    write('Probability of mutation (%):'), read(P2),
    PM is P2 / 100, % Convert percentage to decimal.
    (retract(prob_mutation(_)); true), asserta(prob_mutation(PM)). % Update mutation probability.

% Main entry point to generate and evolve the population.
generate :-
    initialize, % Initialize parameters.
    generate_population(Pop), % Generate the initial population.
    write('Pop='), write(Pop), nl,
    evaluate_population(Pop, PopValue), % Evaluate the initial population.
    write('PopValue='), write(PopValue), nl,
    order_population(PopValue, PopOrd), % Sort population by fitness.
    generations(NG), % Retrieve number of generations.
    generate_generation(0, NG, PopOrd). % Start generation loop.

% Generate initial population of individuals.
generate_population(Pop) :-
    population(PopSize),
    tasks(NumT), % Get the number of tasks.
    findall(Task, task(Task, _, _, _), TasksList), % Collect all task IDs.
    generate_population(PopSize, TasksList, NumT, Pop).

% Base case: No individuals left to generate.
generate_population(0, _, _, []) :- !.

% Recursive case: Generate one individual at a time.
generate_population(PopSize, TasksList, NumT, [Ind | Rest]) :-
    PopSize1 is PopSize - 1, % Decrement population size.
    generate_population(PopSize1, TasksList, NumT, Rest), % Generate remaining individuals.
    generate_individual(TasksList, NumT, Ind), % Generate a new individual.
    not(member(Ind, Rest)). % Ensure uniqueness of individuals.

% Generate an individual as a permutation of tasks.
generate_individual([G], 1, [G]) :- !.
generate_individual(TasksList, NumT, [G | Rest]) :-
    NumTemp is NumT + 1, % Add 1 for random selection.
    random(1, NumTemp, N), % Select a random task.
    remove(N, TasksList, G, NewList), % Remove selected task.
    NumT1 is NumT - 1, % Decrease task count.
    generate_individual(NewList, NumT1, Rest). % Generate the rest of the individual.

% Remove the N-th element from a list.
remove(1, [G | Rest], G, Rest).
remove(N, [G1 | Rest], G, [G1 | Rest1]) :-
    N1 is N - 1,
    remove(N1, Rest, G, Rest1).

% Evaluate all individuals in the population.
evaluate_population([], []).
evaluate_population([Ind | Rest], [Ind * V | Rest1]) :-
    evaluate(Ind, V), % Evaluate the fitness of the individual.
    evaluate_population(Rest, Rest1).

% Fitness function: Calculate penalty based on lateness.
evaluate([], _, 0).
evaluate([T | Rest], Inst, V) :-
    task(T, Dur, Due, Pen), % Get task details.
    FinInst is Inst + Dur, % Calculate finish time.
    evaluate(Rest, FinInst, VRest), % Recursively evaluate the rest.
    ((FinInst =< Due, !, VT is 0) ; (VT is (FinInst - Due) * Pen)), % Compute penalty.
    V is VT + VRest. % Aggregate penalty.

% Sort the population by fitness value using bubble sort.
order_population(PopValue, PopValueOrd) :-
    bsort(PopValue, PopValueOrd).

% Bubble sort implementation.
bsort([X], [X]) :- !.
bsort([X | Xs], Ys) :-
    bsort(Xs, Zs),
    bchange([X | Zs], Ys).

% Swap adjacent elements if necessary.
bchange([X * VX, Y * VY | L1], [Y * VY | L2]) :-
    VX > VY, !,
    bchange([X * VX | L1], L2).
bchange([X | L1], [X | L2]) :- bchange(L1, L2).

% Recursive generation loop for evolving the population.
generate_generation(G, G, Pop) :- !,
    write('Generation '), write(G), write(':'), nl, write(Pop), nl.
generate_generation(N, G, Pop) :-
    write('Generation '), write(N), write(':'), nl, write(Pop), nl,
    crossover(Pop, NPop1), % Perform crossover.
    mutation(NPop1, NPop), % Perform mutation.
    evaluate_population(NPop, NPopValue), % Evaluate the new population.
    order_population(NPopValue, NPopOrd), % Sort the population.
    N1 is N + 1, % Increment generation counter.
    generate_generation(N1, G, NPopOrd). % Continue to next generation.

% Generate random crossover points.
generate_crossover_points(P1, P2) :- generate_crossover_points1(P1, P2).

% Helper for generating random crossover points.
generate_crossover_points1(P1, P2) :-
    tasks(N),
    NTemp is N + 1,
    random(1, NTemp, P11),
    random(1, NTemp, P21),
    P11 \== P21, !,
    ((P11 < P21, !, P1 = P11, P2 = P21) ; P1 = P21, P2 = P11).

% Crossover operation for creating offspring.
crossover([], []).
crossover([Ind * _], [Ind]).
crossover([Ind1 * _, Ind2 * _ | Rest], [NInd1, NInd2 | Rest1]) :-
    generate_crossover_points(P1, P2),
    prob_crossover(Pcruz),
    random(0.0, 1.0, Pc),
    ((Pc =< Pcruz, !,
    cross(Ind1, Ind2, P1, P2, NInd1),
    cross(Ind2, Ind1, P1, P2, NInd2)) ;
    (NInd1 = Ind1, NInd2 = Ind2)),
    crossover(Rest, Rest1).

% Mutation operation for introducing diversity.
mutation([], []).
mutation([Ind | Rest], [NInd | Rest1]) :-
    prob_mutation(Pmut),
    random(0.0, 1.0, Pm),
    ((Pm < Pmut, !, mutacao1(Ind, NInd)) ; NInd = Ind),
    mutation(Rest, Rest1).
