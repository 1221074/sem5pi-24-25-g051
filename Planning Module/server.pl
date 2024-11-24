% File: scheduling.pl
% Load necessary libraries for HTTP server
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).
:- use_module(library(http/http_header)).

% Declare dynamic predicates
:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:- dynamic agenda_operation_room/3.
:- dynamic agenda_operation_room1/3.
:- dynamic better_sol/5.
:- dynamic surgery_priority/2.

% Initialize the HTTP server on port 5000
:- initialization(start_server(5000)).

start_server(Port) :-
    http_server(http_dispatch, [port(Port)]),
    format('Prolog scheduling server started on port ~w~n', [Port]).

% HTTP Handlers
:- http_handler('/optimal_schedule', cors_wrapper(handle_optimal_schedule), []).
:- http_handler('/heuristic_schedule_maximized', cors_wrapper(handle_heuristic_maximized_schedule), []).
:- http_handler('/heuristic_schedule_earliest', cors_wrapper(handle_heuristic_schedule_earliest), []).
:- http_handler('/complexity_analysis', cors_wrapper(handle_complexity_analysis), []).

% Enable CORS by adding headers to all responses
add_cors_headers :-
    format('Access-Control-Allow-Origin: http://localhost:4000~n'),
    format('Access-Control-Allow-Methods: GET, POST, OPTIONS~n'),
    format('Access-Control-Allow-Headers: Content-Type~n').

% Handle OPTIONS preflight requests
handle_options_request(_Request) :-
    add_cors_headers,
    format('~n'). 

% Wrapper to add CORS headers to responses
cors_wrapper(Handler, Request) :-
(   memberchk(method(options), Request)
->  handle_options_request(Request)
;   add_cors_headers,
    call(Handler, Request)
).

% Sample Data
% ------------

% Agenda for staff members
agenda_staff(d001, 20241028, [(720, 790, m01), (1080, 1140, c01)]).
agenda_staff(d002, 20241028, [(850, 900, m02), (901, 960, m02), (1380, 1440, c02)]).
agenda_staff(d003, 20241028, [(720, 790, m01), (910, 980, m02)]).
%agenda_staff(d004,20241028,[(850,900,m02),(940,980,c04)]).

% Timetables for staff members
timetable(d001, 20241028, (480, 1200)).
timetable(d002, 20241028, (500, 1440)).
timetable(d003, 20241028, (520, 1320)).
%timetable(d004,20241028,(620,1020)).

% Staff details
staff(d001, doctor, orthopaedist, [so2, so3, so4]).
staff(d002, doctor, orthopaedist, [so2, so3, so4]).
staff(d003, doctor, orthopaedist, [so2, so3, so4]).

% Surgeries (Type, Anesthesia Time, Surgery Time, Cleaning Time)
surgery(so2, 45, 60, 45).
surgery(so3, 45, 90, 45).
surgery(so4, 45, 75, 45).

% Surgery IDs and their types
surgery_id(so100001, so2).
surgery_id(so100002, so3).
surgery_id(so100003, so4).
surgery_id(so100004, so2).
surgery_id(so100005, so4).
%surgery_id(so100006,so2).
%surgery_id(so100007,so3).
%surgery_id(so100008,so2).
%surgery_id(so100009,so2).
%surgery_id(so100010,so2).
%surgery_id(so100011,so4).
%surgery_id(so100012,so2).
%surgery_id(so100013,so2).


% Assignment of surgeries to doctors
assignment_surgery(so100001, d001).
assignment_surgery(so100002, d002).
assignment_surgery(so100003, d003).
assignment_surgery(so100004, d001).
assignment_surgery(so100004, d002).
assignment_surgery(so100005, d002).
assignment_surgery(so100005, d003).
%assignment_surgery(so100006,d001).
%assignment_surgery(so100007,d003).
%assignment_surgery(so100008,d004).
%assignment_surgery(so100008,d003).
%assignment_surgery(so100009,d002).
%assignment_surgery(so100009,d004).
%assignment_surgery(so100010,d003).
%assignment_surgery(so100011,d001).
%assignment_surgery(so100012,d001).
%assignment_surgery(so100013,d004).


% Agenda for the operation room
agenda_operation_room(or1, 20241028, []).

% Utility Predicates
% ------------------

% Start the scheduling process based on the request parameters
handle_optimal_schedule(Request) :-
    % Parse parameters from the request
    http_parameters(Request, [
        room(Room, []),
        date(DateAtom, []),
        surgeries(SurgeriesAtom, [])
    ]),
    % Convert date and surgeries to appropriate formats
    atom_number(DateAtom, Date),
    atomic_list_concat(SurgeryList, ',', SurgeriesAtom),
    % Start optimal scheduling
    schedule_optimal(Room, Date, SurgeryList, Response),
    % Send JSON response
    reply_json(Response).

    handle_heuristic_schedule_earliest(Request) :-
        % Parse parameters from the request
        http_parameters(Request, [
            room(Room, []),
            date(DateAtom, []),
            surgeries(SurgeriesAtom, [])
        ]),
        % Convert date and surgeries to appropriate formats
        atom_number(DateAtom, Date),
        atomic_list_concat(SurgeryList, ',', SurgeriesAtom),
        % Call the heuristic scheduler
        schedule_heuristic_earliest(Room, Date, SurgeryList, Response),
        % Send JSON response
        reply_json(Response).
    

handle_heuristic_maximized_schedule(Request) :-
    % Parse parameters from the request
    http_parameters(Request, [
        room(Room, []),
        date(DateAtom, []),
        surgeries(SurgeriesAtom, [])
    ]),
    % Convert date and surgeries to appropriate formats
    atom_number(DateAtom, Date),
    atomic_list_concat(SurgeryList, ',', SurgeriesAtom),
    % Call the scheduling heuristic
    schedule_heuristic_maximize(Room, Date, SurgeryList, Response),
    % Send JSON response
    reply_json(Response).

handle_complexity_analysis(Request) :-
    % Parse parameters from the request
    http_parameters(Request, [
        room(Room, []),
        date(DateAtom, [])
    ]),
    % Convert date to number
    atom_number(DateAtom, Date),
    % Perform complexity analysis
    perform_complexity_analysis(Room, Date, Results),
    % Send JSON response
    reply_json(Results).


% Optimal Scheduling Algorithm
% ----------------------------
schedule_optimal(Room, Date, SurgeryList, Response) :-
    % Record start time
    get_time(Ti),
    % Initialize best solution
    asserta(better_sol(Date, Room, _, _, 1441)),
    % Generate all permutations of surgeries
    findall(Perm, permutation(SurgeryList, Perm), Permutations),
    % Try each permutation to find the best schedule
    (   member(Surgeries, Permutations),
        % Reset agendas
        reset_agendas(Date),
        % Attempt to schedule surgeries
        schedule_surgeries(Surgeries, Room, Date),
        % Evaluate the schedule
        agenda_operation_room1(Room, Date, AgendaR),
        update_better_solution(Date, Room, AgendaR, Surgeries),
        fail
    ;   true
    ),
    % Get the best solution
    retract(better_sol(Date, Room, AgOpRoomBetter, LAgDoctorsBetter, TFinOp)),
    % Record end time
    get_time(Tf),
    ExecutionTime is Tf - Ti,
    transform_agenda(AgOpRoomBetter, OperationRoomAgendaJson),
    transform_doctor_agenda(LAgDoctorsBetter, DoctorsAgendaJson),
    Response = _{
        status: 'success',
        execution_time: ExecutionTime,
        finish_time: TFinOp,
        operation_room_agenda: OperationRoomAgendaJson,
        doctors_agenda: DoctorsAgendaJson
    }.

% Heuristic Scheduling Algorithm ==========================================================================================
% ------------------------------

%%% First Heuristic - Earliest Availability

schedule_heuristic_earliest(Room, Date, SurgeryList, Response) :-
    % Record start time
    get_time(Ti),
    % Reset agendas
    reset_agendas(Date),
    % Sort surgeries based on the earliest availability of doctors
    sort_surgeries_by_earliest_availability(SurgeryList, Date, SortedSurgeries),
    % Attempt to schedule surgeries
    (   schedule_surgeries(SortedSurgeries, Room, Date)
    ->  agenda_operation_room1(Room, Date, AgOpRoomBetter),
        findall(Doctor, assignment_surgery(_, Doctor), LDoctors),
        list_doctors_agenda(Date, LDoctors, LAgDoctorsBetter),
        % Evaluate finish time
        reverse(AgOpRoomBetter, AgendaR),
        evaluate_final_time(AgendaR, SortedSurgeries, TFinOp),
        % Record end time
        get_time(Tf),
        ExecutionTime is Tf - Ti,
        transform_agenda(AgOpRoomBetter, OperationRoomAgendaJson),
        transform_doctor_agenda(LAgDoctorsBetter, DoctorsAgendaJson),
        Response = _{
            status: 'success',
            execution_time: ExecutionTime,
            finish_time: TFinOp,
            operation_room_agenda: OperationRoomAgendaJson,
            doctors_agenda: DoctorsAgendaJson
        }
    ;   get_time(Tf),
        ExecutionTime is Tf - Ti,
        Response = _{
            status: 'failure',
            execution_time: ExecutionTime,
            message: 'Unable to schedule all surgeries with heuristic method.'
        }
    ).


% Sort surgeries based on the earliest availability of doctors
sort_surgeries_by_earliest_availability(Surgeries, Date, SortedSurgeries) :-
    findall(StartTime-OpCode,
            (member(OpCode, Surgeries),
             earliest_available_doctor(OpCode, Date, _, StartTime)),
            SurgeryTimes),
    keysort(SurgeryTimes, SortedSurgeryTimes),
    pairs_values(SortedSurgeryTimes, SortedSurgeries).

% Find the earliest available doctor for a given surgery
earliest_available_doctor(OpCode, Date, Doctor, StartTime) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, _, TSurgery, _),
    findall(Doctor, assignment_surgery(OpCode, Doctor), LDoctors),
    intersect_all_agendas(LDoctors, Date, LA),
    remove_unf_intervals(TSurgery, LA, LPossibilities),
    LPossibilities = [(StartTime, _) | _],
    member(Doctor, LDoctors),
    availability(Doctor, Date, DoctorAgenda),
    member((StartTime, _), DoctorAgenda).

% Calculate the occupation percentage for a doctor
occupation_percentage(Doctor, Date, OccupationPercentage) :-
    findall(OpCode, assignment_surgery(OpCode, Doctor), Surgeries),
    findall(TSurgery, (member(OpCode, Surgeries), surgery_id(OpCode, OpType), surgery(OpType, _, TSurgery, _)), Durations),
    sum_list(Durations, TotalSurgeryTime),
    availability(Doctor, Date, DoctorAgenda),
    findall(FreeTime, (member((Start, End), DoctorAgenda), FreeTime is End - Start + 1), FreeTimes),
    sum_list(FreeTimes, TotalFreeTime),
    (TotalFreeTime > 0 -> OccupationPercentage is TotalSurgeryTime / TotalFreeTime * 100 ; OccupationPercentage is 0).

% Sort surgeries by occupation percentage
sort_surgeries_by_occupation_percentage(Surgeries, Date, SortedSurgeries) :-
    list_to_set(Surgeries, UniqueSurgeries),
    findall(MinOccupationPercentage-OpCode,
            (member(OpCode, UniqueSurgeries),
             findall(OccupationPercentage,
                     (assignment_surgery(OpCode, Doctor),
                      occupation_percentage(Doctor, Date, OccupationPercentage)),
                     OccupationPercentages),
             min_list(OccupationPercentages, MinOccupationPercentage)),
            SurgeryPercentages),
    keysort(SurgeryPercentages, SortedSurgeryPercentages),
    pairs_values(SortedSurgeryPercentages, SortedSurgeries).

% Heuristic Scheduling Algorithm ==========================================================================================
% ------------------------------
% Second Heuristic - Maximize Occupied Time
schedule_heuristic_maximize(Room, Date, SurgeryList, Response) :-
    % Record start time
    get_time(Ti),
    % Reset agendas
    reset_agendas(Date),
    % Sort surgeries by occupation percentage
    sort_surgeries_by_occupation_percentage(SurgeryList, Date, SortedSurgeries),
    % Attempt to schedule surgeries
    (   schedule_surgeries(SortedSurgeries, Room, Date)
    ->  agenda_operation_room1(Room, Date, AgOpRoomBetter),
        findall(Doctor, assignment_surgery(_, Doctor), LDoctors),
        list_doctors_agenda(Date, LDoctors, LAgDoctorsBetter),
        % Evaluate finish time
        reverse(AgOpRoomBetter, AgendaR),
        evaluate_final_time(AgendaR, SortedSurgeries, TFinOp),
        % Record end time
        get_time(Tf),
        ExecutionTime is Tf - Ti,
        transform_agenda(AgOpRoomBetter, OperationRoomAgendaJson),
        transform_doctor_agenda(LAgDoctorsBetter, DoctorsAgendaJson),
        Response = _{
            status: 'success',
            execution_time: ExecutionTime,
            finish_time: TFinOp,
            operation_room_agenda: OperationRoomAgendaJson,
            doctors_agenda: DoctorsAgendaJson
        }
    ;   get_time(Tf),
        ExecutionTime is Tf - Ti,
        Response = _{
            status: 'failure',
            execution_time: ExecutionTime,
            message: 'Unable to schedule all surgeries with heuristic method.'
        }
    ).

% Transform Agendas to JSON-Compatible Structures
% -----------------------------------------------

transform_agenda([], []).
transform_agenda([(Start, End, Surgery) | Rest], [_{start: Start, end: End, surgery: Surgery} | RestJson]) :-
    transform_agenda(Rest, RestJson).

transform_doctor_agenda([], []).
transform_doctor_agenda([(Doctor, Agenda) | Rest], [_{doctor: Doctor, agenda: AgendaJson} | RestJson]) :-
    transform_agenda(Agenda, AgendaJson),
    transform_doctor_agenda(Rest, RestJson).

% Complexity Analysis
% -------------------

perform_complexity_analysis(Room, Date, Results) :-
    % Define the range of surgeries to test
    findall(OpCode, surgery_id(OpCode, _), AllSurgeries),
    length(AllSurgeries, MaxSurgeries),
    % Initialize results list
    perform_analysis(Room, Date, AllSurgeries, MaxSurgeries, [], Results).

perform_analysis(_, _, _, 0, Acc, Acc).
perform_analysis(Room, Date, AllSurgeries, N, Acc, Results) :-
    % Select first N surgeries
    length(SurgeryList, N),
    append(SurgeryList, _, AllSurgeries),
    % Measure execution time
    get_time(Ti),
    (   schedule_optimal(Room, Date, SurgeryList, _)
    ->  true
    ;   true
    ),
    get_time(Tf),
    ExecutionTime is Tf - Ti,
    % Add result
    Acc1 = [_{number_of_surgeries: N, execution_time: ExecutionTime} | Acc],
    % Decrease N
    N1 is N - 1,
    perform_analysis(Room, Date, AllSurgeries, N1, Acc1, Results).

% Common Scheduling Predicates
% ----------------------------

% Reset agendas before scheduling
reset_agendas(Date) :-
    retractall(agenda_staff1(_, _, _)),
    retractall(agenda_operation_room1(_, _, _)),
    retractall(availability(_, _, _)),
    findall(_, (agenda_staff(D, Date, Agenda), assertz(agenda_staff1(D, Date, Agenda))), _),
    findall(_, (agenda_operation_room(Or, Date, Agenda), assertz(agenda_operation_room1(Or, Date, Agenda))), _),
    findall(_, (
        agenda_staff1(D, Date, L),
        free_agenda0(L, LFA),
        adapt_timetable(D, Date, LFA, LFA2),
        assertz(availability(D, Date, LFA2))
    ), _).

% Schedule surgeries based on the given list
schedule_surgeries([], _, _).
schedule_surgeries([OpCode | LOpCode], Room, Date) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, _, TSurgery, _),
    % Find availability
    availability_operation(OpCode, Room, Date, LPossibilities, LDoctors),
    % Choose first available interval
    schedule_first_interval(TSurgery, LPossibilities, (TinS, TfinS)),
    % Update operation room agenda
    retract(agenda_operation_room1(Room, Date, Agenda)),
    insert_agenda((TinS, TfinS, OpCode), Agenda, Agenda1),
    assertz(agenda_operation_room1(Room, Date, Agenda1)),
    % Update doctors' agendas
    insert_agenda_doctors((TinS, TfinS, OpCode), Date, LDoctors),
    % Continue scheduling
    schedule_surgeries(LOpCode, Room, Date).

% Update the best solution found
update_better_solution(Date, Room, Agenda, LOpCode) :-
    better_sol(Date, Room, _, _, FinTime),
    reverse(Agenda, AgendaR),
    evaluate_final_time(AgendaR, LOpCode, FinTime1),
    FinTime1 < FinTime,
    retract(better_sol(_, _, _, _, _)),
    findall(Doctor, assignment_surgery(_, Doctor), LDoctors1),
    remove_duplicates(LDoctors1, LDoctors),
    list_doctors_agenda(Date, LDoctors, LDAgendas),
    asserta(better_sol(Date, Room, Agenda, LDAgendas, FinTime1)).

% Evaluate the finish time of the schedule
evaluate_final_time([], _, 1441).
evaluate_final_time([(_, Tfin, OpCode) | _], LOpCode, Tfin) :-
    member(OpCode, LOpCode), !.
evaluate_final_time([_ | AgR], LOpCode, Tfin) :-
    evaluate_final_time(AgR, LOpCode, Tfin).

% List agendas of doctors
list_doctors_agenda(_, [], []).
list_doctors_agenda(Date, [D | LD], [(D, AgD) | LAgD]) :-
    agenda_staff1(D, Date, AgD),
    list_doctors_agenda(Date, LD, LAgD).

% Remove duplicates from a list
remove_duplicates([], []).
remove_duplicates([X | L], L1) :-
    member(X, L), !,
    remove_duplicates(L, L1).
remove_duplicates([X | L], [X | L1]) :-
    remove_duplicates(L, L1).

% Availability Predicates
% -----------------------

availability_operation(OpCode, Room, Date, LPossibilities, LDoctors) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, _, TSurgery, _),
    findall(Doctor, assignment_surgery(OpCode, Doctor), LDoctors),
    intersect_all_agendas(LDoctors, Date, LA),
    agenda_operation_room1(Room, Date, LAgenda),
    free_agenda0(LAgenda, LFAgRoom),
    intersect_2_agendas(LA, LFAgRoom, LIntAgDoctorsRoom),
    remove_unf_intervals(TSurgery, LIntAgDoctorsRoom, LPossibilities).



% Remove unfeasible intervals
remove_unf_intervals(_, [], []).
remove_unf_intervals(TSurgery, [(Tin, Tfin) | LA], [(Tin, Tfin) | LA1]) :-
    DT is Tfin - Tin + 1,
    TSurgery =< DT, !,
    remove_unf_intervals(TSurgery, LA, LA1).
remove_unf_intervals(TSurgery, [_ | LA], LA1) :-
    remove_unf_intervals(TSurgery, LA, LA1).

% Schedule the first available interval
schedule_first_interval(TSurgery, [(Tin, _) | _], (Tin, TfinS)) :-
    TfinS is Tin + TSurgery - 1.

% Insert into agenda
insert_agenda((TinS, TfinS, OpCode), [], [(TinS, TfinS, OpCode)]).
insert_agenda((TinS, TfinS, OpCode), [(Tin, Tfin, OpCode1) | LA], [(TinS, TfinS, OpCode), (Tin, Tfin, OpCode1) | LA]) :-
    TfinS < Tin, !.
insert_agenda((TinS, TfinS, OpCode), [(Tin, Tfin, OpCode1) | LA], [(Tin, Tfin, OpCode1) | LA1]) :-
    insert_agenda((TinS, TfinS, OpCode), LA, LA1).

% Insert into doctors' agendas
insert_agenda_doctors(_, _, []).
insert_agenda_doctors((TinS, TfinS, OpCode), Date, [Doctor | LDoctors]) :-
    retract(agenda_staff1(Doctor, Date, Agenda)),
    insert_agenda((TinS, TfinS, OpCode), Agenda, Agenda1),
    assert(agenda_staff1(Doctor, Date, Agenda1)),
    insert_agenda_doctors((TinS, TfinS, OpCode), Date, LDoctors).

% Agenda Utilities
% -------------------------------------------------------------------------

% Compute free agenda slots
free_agenda0([], [(0, 1440)]).
free_agenda0([(0, Tfin, _) | LT], LT1) :- !,
    free_agenda1([(0, Tfin, _) | LT], LT1).
free_agenda0([(Tin, Tfin, _) | LT], [(0, T1) | LT1]) :-
    T1 is Tin - 1,
    free_agenda1([(Tin, Tfin, _) | LT], LT1).

free_agenda1([(_, Tfin, _)], [(T1, 1440)]) :-
    Tfin \== 1440, !,
    T1 is Tfin + 1.
free_agenda1([(_, _, _)], []).
free_agenda1([(_, T, _), (T1, Tfin2, _) | LT], LT1) :-
    Tx is T + 1,
    T1 == Tx, !,
    free_agenda1([(T1, Tfin2, _) | LT], LT1).
free_agenda1([(_, Tfin1, _), (Tin2, Tfin2, _) | LT], [(T1, T2) | LT1]) :-
    T1 is Tfin1 + 1,
    T2 is Tin2 - 1,
    free_agenda1([(Tin2, Tfin2, _) | LT], LT1).

% Adapt timetable to free agenda slots
adapt_timetable(D, Date, LFA, LFA2) :-
    timetable(D, Date, (InTime, FinTime)),
    treatin(InTime, LFA, LFA1),
    treatfin(FinTime, LFA1, LFA2).

treatin(InTime, [(In, Fin) | LFA], [(In, Fin) | LFA]) :-
    InTime =< In, !.
treatin(InTime, [(_, Fin) | LFA], LFA1) :-
    InTime > Fin, !,
    treatin(InTime, LFA, LFA1).
treatin(InTime, [(_, Fin) | LFA], [(InTime, Fin) | LFA]).
treatin(_, [], []).

treatfin(FinTime, [(In, Fin) | LFA], [(In, Fin) | LFA1]) :-
    FinTime >= Fin, !,
    treatfin(FinTime, LFA, LFA1).
treatfin(FinTime, [(In, _) | _], []) :-
    FinTime =< In, !.
treatfin(FinTime, [(In, _) | _], [(In, FinTime)]).
treatfin(_, [], []).

% Intersect agendas

intersect_all_agendas([Name], Date, LA) :- !,
    availability(Name, Date, LA).
intersect_all_agendas([Name | LNames], Date, LI) :-
    availability(Name, Date, LA),
    intersect_all_agendas(LNames, Date, LI1),
    intersect_2_agendas(LA, LI1, LI).

intersect_2_agendas([], _, []).
intersect_2_agendas([D | LD], LA, LIT) :-
    intersect_availability(D, LA, LI, LA1),
    intersect_2_agendas(LD, LA1, LID),
    append(LI, LID, LIT).

intersect_availability((_, _), [], [], []).
intersect_availability((_, Fim), [(Ini1, Fim1) | LD], [], [(Ini1, Fim1) | LD]) :-
    Fim < Ini1, !.
intersect_availability((Ini, Fim), [(_, Fim1) | LD], LI, LA) :-
    Ini > Fim1, !,
    intersect_availability((Ini, Fim), LD, LI, LA).
intersect_availability((Ini, Fim), [(Ini1, Fim1) | LD], [(Imax, Fmin)], [(Fim, Fim1) | LD]) :-
    Fim1 > Fim, !,
    min_max(Ini, Ini1, _, Imax),
    min_max(Fim, Fim1, Fmin, _).
intersect_availability((Ini, Fim), [(Ini1, Fim1) | LD], [(Imax, Fmin) | LI], LA) :-
    Fim >= Fim1, !,
    min_max(Ini, Ini1, _, Imax),
    min_max(Fim, Fim1, Fmin, _),
    intersect_availability((Fim1, Fim), LD, LI, LA).

min_max(I, I1, I, I1) :- I < I1, !.
min_max(I, I1, I1, I).

% Heuristic: Sort surgeries by priority
sort_surgeries_by_priority(Surgeries, SortedSurgeries) :-
    map_list_to_pairs(get_surgery_priority, Surgeries, Pairs),
    keysort(Pairs, SortedPairs),
    pairs_values(SortedPairs, SortedSurgeries).

get_surgery_priority(OpCode, Priority) :-
    surgery_priority(OpCode, Priority).

% End of File