% Parâmetros do algoritmo
:- dynamic population/1.
:- dynamic prob_crossover/1.
:- dynamic prob_mutation/1.
:- dynamic generations/1.
:- dynamic selected_surgery_room/1.
:- dynamic target_fitness/1.
:- dynamic printed_generation/2.
:- dynamic surgery/5.

% Timetables for staff members
doctor(d001, 20241028, (480, 1200)).
doctor(d002, 20241028, (500, 1440)).
doctor(d003, 20241028, (520, 1320)).

% Timetables for surgery rooms
surgery_room(c1, 20241028, (480, 1200)).
surgery_room(c2, 20241028, (500, 1440)).
surgery_room(c3, 20241028, (520, 1320)).

% Surgeries (ID, Duration Time, doctors, startTime, endTime)
surgery(so100001, 150, d001, _, _).
surgery(so100002, 165, d002, _, _).
surgery(so100003, 180, d003, _, _).
surgery(so100004, 170, d001, _, _).
surgery(so100005, 100, d002, _, _).
surgery(so100006, 120, d003, _, _).
surgery(so100007, 130, d001, _, _).
surgery(so100008, 140, d002, _, _).
surgery(so100009, 110, d003, _, _).
surgery(so100010, 160, d001, _, _).




% Solicita a sala de cirurgia ao usuário
initialize_surgery_room(SurgeryRoom) :-
    write('Escolha a sala de cirurgia para marcação (e.g., c1, c2, c3): '),
    read(SurgeryRoom),
    surgery_room(SurgeryRoom, _, _),
    retractall(selected_surgery_room(_)),
    assertz(selected_surgery_room(SurgeryRoom)),
    write('Sala escolhida: '), write(SurgeryRoom), nl.

initialize :-
    write('Starting initialization...'), nl,
    initialize_surgery_room(SurgeryRoom),
    write('Number of new generations: '), read(NG),
    retractall(generations(_)),
    assertz(generations(NG)),
    write('Population size: '), read(PS),
    retractall(population(_)),
    assertz(population(PS)),
    write('Probability of crossover (%): '), read(P1),
    PC is P1 / 100,
    retractall(prob_crossover(_)),
    assertz(prob_crossover(PC)),
    write('Probability of mutation (%): '), read(P2), 
    PM is P2 / 100,
    retractall(prob_mutation(_)),
    assertz(prob_mutation(PM)),
    write('Target fitness: '), read(Target), nl,
    retractall(target_fitness(_)),
    assertz(target_fitness(Target)),
    retractall(printed_generation(_, _)),
    assertz(printed_generation(0, [])),

    write('Generating population...'), nl, nl,
    (generate(SurgeryRoom) ->
        write(''), nl
    ;
        write('Error: Failed to generate a valid population!'), nl, nl,
        !, fail). % Cut and fail to terminate


% Geração inicial
generate(SurgeryRoom) :-
    findall(S, surgery(S, _,_,_,_), Surgeries),
    surgery_room(SurgeryRoom, _, (_, _)),
    generate_population(Surgeries, Population),
    evaluate_population(Population, Values),
    
    generations(NG),
    evolve(Values, NG).

% Geração de população inicial
generate_population(Surgeries, Population) :-
    population(PopSize),
    findall(Subset, subset(Surgeries, Subset), Candidates),
    include(valid_schedule(), Candidates, ValidCandidates),
    length(ValidCandidates, ValidCount),
    (ValidCount > 0 ->
        catch(custom_random_permutation(ValidCandidates, ShuffledCandidates),
            Error,
            (write('Error during custom_random_permutation: '), write(Error), nl, nl, fail)),
        take_n_candidates(min(ValidCount, PopSize), ShuffledCandidates, Population),
        write('Generation 0: '), write(Population), nl, nl
    ;
        write('Error: No valid candidates available!'), nl, nl,
        fail).

custom_random_permutation([], []).
custom_random_permutation(List, [Elem | Rest]) :-
    length(List, Len),
    UpperBound is Len + 1, % Evaluate Len + 1
    random(1, UpperBound, Index), % Use the evaluated number
    nth1(Index, List, Elem, Remaining),
    custom_random_permutation(Remaining, Rest).
    
nth1(Index, List, Elem, Remaining) :-
    nth1(Index, List, Elem),
    delete(List, Elem, Remaining).

take_n_candidates(0, _, []) :- !.
take_n_candidates(_, [], []) :- !.
take_n_candidates(N, [H | T], [H | Rest]) :-
    N1 is N - 1,
    no_doctor_conflict(H), % Ensure no conflicts for the current candidate
    take_n_candidates(N1, T, Rest).
take_n_candidates(N, [_ | T], Rest) :-
    take_n_candidates(N, T, Rest).


% Define start and end times dynamically before checking conflicts
no_doctor_conflict(Schedule) :-
    assign_start_end_times(Schedule, 0), % Assign start and end times
    validate_doctor_conflicts(Schedule). % Check conflicts after assigning times

% Assign start and end times to surgeries based on current time
assign_start_end_times([], _) :- !.
assign_start_end_times([Surgery | Rest], CurrentTime) :-
    surgery(Surgery, Duration, Doctor, _, _),
    surgery_room(_, _, (_, RoomEndTime)),
    doctor(Doctor, _, (DoctorStart, _)),
    FirstAvailable is max(CurrentTime, DoctorStart),
    surgery_timing(FirstAvailable, Duration, RoomEndTime, StartTime, EndTime),
    retractall(surgery(Surgery, Duration, Doctor, _, _)),
    assertz(surgery(Surgery, Duration, Doctor, StartTime, EndTime)),
    assign_start_end_times(Rest, EndTime).

% Calculate timing for a surgery
surgery_timing(CurrentTime, Duration, RoomEndTime, StartTime, EndTime) :-
    StartTime = CurrentTime,
    EndTime is CurrentTime + Duration,
    EndTime =< RoomEndTime. % Ensure surgery finishes within room time

validate_doctor_conflicts([]).
validate_doctor_conflicts([Surgery | Rest]) :-
    surgery(Surgery, _, Doctor, StartTime, EndTime), % Get surgery details
    doctor(Doctor, _, (DoctorStart, DoctorEnd)), % Get doctor's availability
    StartTime >= DoctorStart, % Start time must be within the doctor's available window
    EndTime =< DoctorEnd, % End time must not exceed the doctor's available window
    validate_doctor_conflicts(Rest). % Check the rest of the schedule


subset([], []).
subset([E | Tail], [E | NTail]) :-
    subset(Tail, NTail).
subset([_ | Tail], NTail) :-
    subset(Tail, NTail).

valid_schedule(Schedule) :-
    
    no_duplicates(Schedule),
    no_overlap_schedule(Schedule).



no_duplicates(Schedule) :-
    sort(Schedule, Sorted),
    length(Schedule, OriginalLength),
    length(Sorted, SortedLength),
    OriginalLength =:= SortedLength.

no_overlap_schedule(Schedule) :-
    selected_surgery_room(Room),
    surgery_room(Room, _, (RoomStart, RoomEnd)), % Get room's start and end times.
    validate_first_surgery(Schedule, RoomStart, RoomEnd). % Handle the first surgery separately.
    
validate_first_surgery([Surgery | Rest], RoomStart, RoomEnd) :-
    surgery(Surgery, Duration, Doctor, _, _), % Get surgery details.
    doctor(Doctor, _, (DoctorStart, _)), % Get doctor's availability.
    FirstAvailable is max(RoomStart, DoctorStart), % First surgery starts after both room and doctor availability.
    SurgeryEnd is FirstAvailable + Duration, % Calculate end time for the first surgery.
    (SurgeryEnd =< RoomEnd -> % Ensure it ends within the room's available time.
        validate_rest_surgeries(Rest, SurgeryEnd, RoomEnd) % Proceed to the rest of the surgeries.
    ;
        !, fail).

validate_rest_surgeries([], _, _) :- !. % Base case: No more surgeries to validate.
validate_rest_surgeries([Surgery | Rest], CurrentTime, RoomEnd) :-
    surgery(Surgery, Duration, _, _, _), % Get surgery details.
    SurgeryEnd is CurrentTime + Duration, % Calculate the end time.
    (SurgeryEnd =< RoomEnd -> % Check if it fits within the room's schedule.
        validate_rest_surgeries(Rest, SurgeryEnd, RoomEnd) % Recursively validate the next surgery.
    ;
        fail, !). % Fail immediately if any surgery is invalid.
    





% Avaliação da população
evaluate_population([], []).
evaluate_population([Ind | Rest], [Ind : SharedFitness | RestFitness]) :-
    evaluate_individual(Ind, RawFitness), % Raw fitness is calculated here
    sharing_factor(Ind, Rest, SharePenalty), % Sharing penalty based on similarity
    SharedFitness is RawFitness - SharePenalty, % Adjust fitness
    evaluate_population(Rest, RestFitness). % Recursive evaluation

evaluate_individual(Schedule, Fitness) :-
    assign_start_end_times(Schedule, 0), % Assign start and end times
    calculate_schedule_time(Schedule, TotalTime),
    count_surgeries(Schedule, Count),
    calculate_waste_time(Schedule, WasteTime),
    Fitness is Count * 1000 - WasteTime - TotalTime.

calculate_schedule_time([], 0).

% Recursive case: calculate the total time based on durations and the first surgery's start time
calculate_schedule_time([FirstSurgery | Rest], TotalEndTime) :-
    surgery_room(_, _, (RoomStart, _)),        % Get the room's start time
    surgery(FirstSurgery, Duration, _, _, _), % Get the first surgery's duration and doctor
    calculate_rest_time(Rest, RoomStart + Duration, TotalEndTime). % Calculate total end time
    
% Calculate the end time of the rest of the surgeries
calculate_rest_time([], LastEndTime, LastEndTime). % If no more surgeries, end time is the last one
    
calculate_rest_time([Surgery | Rest], CurrentTime, TotalEndTime) :-
    surgery(Surgery, Duration, _, _, _),       % Get the duration of the next surgery
    SurgeryEnd is CurrentTime + Duration,      % Calculate the end time of this surgery
    calculate_rest_time(Rest, SurgeryEnd, TotalEndTime). % Continue for the rest

count_surgeries([], 0).
count_surgeries([_ | Rest], Count) :-
    count_surgeries(Rest, RestCount),
    Count is RestCount + 1.

calculate_waste_time([], 0).
calculate_waste_time([FirstSurgery | Rest], WasteTime) :-
    surgery_room(_, _, (RoomStart, _)),
    surgery(FirstSurgery, _, Doctor, _, _),
    doctor(Doctor, _, (DoctorStart, _)),
    InitialWaste is max(0, DoctorStart - RoomStart), % Waste before the first surgery
    calculate_consecutive_waste([FirstSurgery | Rest], ConsecutiveWaste),
    WasteTime is InitialWaste + ConsecutiveWaste.

calculate_consecutive_waste([], 0).
calculate_consecutive_waste([_], 0).
calculate_consecutive_waste([S1, S2 | Rest], WasteTime) :-
    surgery(S1, _, _, _, End1), % Get the start and end time of the first surgery
    surgery(S2, _, _, Start2, _),    % Get the start time of the second surgery
    Gap is max(0, Start2 - End1),    % Calculate the gap (idle time) between surgeries
    calculate_consecutive_waste([S2 | Rest], RestWaste),
    WasteTime is Gap + RestWaste.

% Fitness Sharing Logic
sharing_factor(Chromosome, Population, SharePenalty) :-
    Weight = 10, % Adjust penalty strength as needed
    findall(ScaledPenalty,
        (member(Other, Population), Chromosome \= Other, sequence_similarity(Chromosome, Other, Similarity),
         ScaledPenalty is Weight // (1 + Similarity)),
        Penalties),
    sumlist(Penalties, SharePenalty).

sequence_similarity(Chromosome1, Chromosome2, Similarity) :-
    compare_positions(Chromosome1, Chromosome2, 0, Similarity).

compare_positions([], [], Similarity, Similarity).
compare_positions([H1 | T1], [H2 | T2], Acc, Similarity) :-
    (H1 == H2 -> NewAcc is Acc + 1 ; NewAcc is Acc),
    compare_positions(T1, T2, NewAcc, Similarity).


% Evolution
evolve(Population, 0) :-
    write('Final Population: '), nl,
    maplist(write, Population), nl,
    check_best_solution(Population).

evolve(Population, GenerationsLeft) :-
    % Parameters
    generations(TotalGenerations),
    CurrentGeneration is TotalGenerations - GenerationsLeft + 1,
    target_fitness(TargetFitness), % Desired fitness value
    % Check if this generation has already been printedS
    (printed_generation(CurrentGeneration, _) ->
        true % Skip printing if already recorded
    ;
        % Record and print this generation
        assertz(printed_generation(CurrentGeneration, Population)),
        write('Generation '), write(CurrentGeneration), write(': '), write(Population), nl, nl
    ),
    % Check if threshold is met
    (meets_fitness_threshold(Population, TargetFitness) ->
        write('Target fitness achieved in Generation '), write(CurrentGeneration), nl,
        write('Final Population: '), nl,
        maplist(write, Population), nl
    ;
        % Continue evolving
        evolve_next_generation(Population, GenerationsLeft)
    ).

% Process the next generation
evolve_next_generation(Population, GenerationsLeft) :-
    population(PopSize),

    % Step 1: Generate descendants via crossover and mutation
    findall(Chromosome, (Member = Chromosome:_Fitness, member(Member, Population)), RawChromosomes),
    crossover(RawChromosomes, CrossedPopulation),
    mutation(CrossedPopulation, MutatedPopulation),
    evaluate_population(MutatedPopulation, EvaluatedOffspring),

    % Step 2: Merge current population with descendants and remove duplicates
    append(Population, EvaluatedOffspring, CombinedPopulation),
    remove_duplicates(CombinedPopulation, UniquePopulation),

    % Step 3: Sort combined population by fitness (ascending)
    sort(2, @>=, UniquePopulation, SortedPopulation),

    % Step 4: Retain top P individuals
    P is round(0.3 * PopSize), % Adjust percentage (30% in this case)
    length(TopIndividuals, P),
    append(TopIndividuals, RemainingIndividuals, SortedPopulation),

    % Step 5: Randomly select N-P individuals from the remaining T-P individuals
    process_remaining_individuals(RemainingIndividuals, NMinusPIndividuals),

    % Combine the top P and the selected N-P individuals
    append(TopIndividuals, NMinusPIndividuals, NextGeneration),

    % Continue evolving
    GenerationsLeft1 is GenerationsLeft - 1,
    evolve(NextGeneration, GenerationsLeft1).

% Check if any individual's fitness meets the target
meets_fitness_threshold(Population, TargetFitness) :-
    member(_ : Fitness, Population),
    Fitness >= TargetFitness. % Check if fitness is less than or equal to the target

% Placeholder for checking the best solution at the end
check_best_solution(Population) :-
    member(Best : Fitness, Population),
    write('Best solution found: '), write(Best), write(' with fitness: '), write(Fitness), nl.

% Remove duplicate individuals from the population
remove_duplicates(Population, UniquePopulation) :-
    sort(Population, UniquePopulation).

% Process remaining individuals (T-P)
process_remaining_individuals(RemainingIndividuals, SelectedIndividuals) :-
    population(PopSize),
    P is round(0.3 * PopSize), % Number of top individuals already retained
    NMinusP is PopSize - P,    % Remaining spots to fill in the next generation

    % Randomly shuffle the remaining individuals
    random_permutation(RemainingIndividuals, ShuffledIndividuals),

    % Select the first N-P individuals
    length(SelectedIndividuals, NMinusP),
    append(SelectedIndividuals, _, ShuffledIndividuals).

% Crossover
crossover([], []).
crossover([Ind], [Ind]). % If there's only one individual, no crossover occurs.
crossover([Ind1, Ind2 | Rest], [NewInd1, NewInd2 | NewRest]) :-
    prob_crossover(Pc),
    random(0.0, 1.0, R),
    (R =< Pc ->
        generate_crossover_points(P1, P2, Ind1),
        crossover_segments(Ind1, Ind2, P1, P2, NewInd1, NewInd2),
        % Ensure individuals are valid
        (valid_schedule(NewInd1), valid_schedule(NewInd2) -> true ; NewInd1 = Ind1,
    NewInd2 = Ind2)
    ;
        NewInd1 = Ind1,
        NewInd2 = Ind2
    ),
    crossover(Rest, NewRest).
        
generate_crossover_points(P1, P2, List) :-
    length(List, Len),
    Len > 1, % Ensure there's enough length for crossover
    random(1, Len, P1),
    P2 is P1 + 1, % Ensure at least one element in the segment
    P2 =< Len. % Ensure P2 doesn't exceed the length.

crossover_segments(Ind1, Ind2, P1, P2, NewInd1, NewInd2) :-
    nth_segment(Ind1, P1, P2, Segment1),
    nth_segment(Ind2, P1, P2, Segment2),
    union(Segment1, Segment2, Merged1), % Combine segments
    union(Segment2, Segment1, Merged2),
    subtract(Ind2, Merged1, Filtered1),
    subtract(Ind1, Merged2, Filtered2),
    append(Segment1, Filtered1, NewInd1),
    append(Segment2, Filtered2, NewInd2).

nth_segment(List, P1, P2, Segment) :-
    findall(Elem, (nth1(Index, List, Elem), Index >= P1, Index =< P2), Segment).

% Mutation
mutation([], []).
mutation([Ind | Rest], [NewInd | NewRest]) :-
    prob_mutation(Pm),
    random(0.0, 1.0, R),
    (R =< Pm ->
        random_permutation(Ind, NewInd)
    ;
        NewInd = Ind),
    mutation(Rest, NewRest).

% Random permutation for mutation
random_permutation([], []).
random_permutation(List, Permuted) :-
    permutation(List, Permuted).

