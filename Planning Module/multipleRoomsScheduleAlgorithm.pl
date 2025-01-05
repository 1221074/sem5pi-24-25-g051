% File: scheduling.pl
% Load necessary libraries for HTTP server
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).
:- use_module(library(http/http_header)).

% Load the scheduling algorithm
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:- dynamic agenda_operation_room/3.
:- dynamic agenda_operation_room1/3.
:- dynamic better_sol/5.

%% SERVER CONFIGURATION

% Initialize the HTTP server on port 5000
:- initialization(start_server(5000)).

start_server(Port) :-
    http_server(http_dispatch, [port(Port)]),
    format('Prolog scheduling server started on port ~w~n', [Port]).

% HTTP Handlers
:- http_handler('/scheduleForAllRooms', cors_wrapper(handle_schedule_all_rooms), []).

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

% STAFF INFORMATION =============================================================
% Staff (ID, Type, Specialty, List of permformable surgeries)
staff(d001,doctor,orthopedist,[so2,so3,so4]).
staff(d002,doctor,orthopedist,[so2,so3,so4]).
staff(d003,doctor,orthopedist,[so2,so3,so4]).
staff(d004,doctor,orthopedist,[so2,so3,so4]).
staff(da001,doctor,anesthetist,[so2,so3,so4]).
staff(da002,doctor,anesthetist,[so2,so3,so4]).
staff(an001,staff,anesthetistnurse,[so2,so3,so4]). 
staff(an002,staff,anesthetistnurse,[so2,so3,so4]).
staff(maa001,staff,medicalassistant,[so2,so3,so4]).
staff(maa002,staff,medicalassistant,[so2,so3,so4]). 

% AGENDA STAFF - staff_id, date, time_slots
agenda_staff(d001,20241028,[]).
agenda_staff(d002,20241028,[]).
agenda_staff(d003,20241028,[]).
agenda_staff(d004,20241028,[]).
agenda_staff(da001,20241028,[]).
agenda_staff(da002,20241028,[]).
agenda_staff(an001,20241028,[]).
agenda_staff(an002,20241028,[]).
agenda_staff(maa001,20241028,[]).
agenda_staff(maa002,20241028,[]).

% Timetables for staff members - staff_id, date, time_slots
timetable(d001, 20241028,(400, 1100)).
timetable(d002, 20241028,(500, 1500)).
timetable(d003, 20241028,(520, 1320)).
timetable(d004, 20241028,(500, 1440)).
timetable(da001,20241028,(480,1200)).
timetable(da002,20241028,(500,1440)).
timetable(an001,20241028,(500,1440)).
timetable(an002,20241028,(520,1320)).
timetable(maa001,20241028,(520,1320)).
timetable(maa002,20241028,(500,1440)).

% SURGERY INFORMATION ===============================================================================================================
% Surgeries - Type, Anesthesia Time, Surgery Time, Cleaning Time)
surgery(so2, 45, 60, 45).
surgery(so3, 45, 90, 45).
surgery(so4, 45, 75, 45).

% SURGERY REQUIREMENTS (Tipo, Num_Anestesistas, Num_Enfermeiros_Anestesistas, Num_Assistentes_Médicos)
surgery_staff_requirements(so2, 1, 2, 2).
surgery_staff_requirements(so3, 1, 1, 1).
surgery_staff_requirements(so4, 2, 1, 1).

% SURGERY INFORMATION - surgery_id, surgery_type 
surgery_id(so100001, so2).
surgery_id(so100002, so3).
surgery_id(so100003, so4).
surgery_id(so100004, so2).
surgery_id(so100005, so4).
surgery_id(so100006,so2).
surgery_id(so100007,so3).
surgery_id(so100008,so2).
surgery_id(so100009,so2).
surgery_id(so100010,so2).

% SURGERY ASSIGNMENT - surgery_id, doctor_id
assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
assignment_surgery(so100004,d001).
assignment_surgery(so100004,d002).
assignment_surgery(so100005,d002).
assignment_surgery(so100005,d003).
assignment_surgery(so100006,d001).
assignment_surgery(so100007,d001).
assignment_surgery(so100008,d004).
assignment_surgery(so100008,d003).
assignment_surgery(so100009,d002).
assignment_surgery(so100009,d004).
assignment_surgery(so100010,d003).

% OPERATION ROOM INFORMATION =========================================================================================================
% AGENDA OPERATION ROOM - operation_room_id, date, time_slots
agenda_operation_room(or1,20241028,[]).
agenda_operation_room(or2,20241028,[]).
agenda_operation_room(or3,20241028,[]).
agenda_operation_room(or4,20241028,[]).

%% HTTP HANDLERS ==================================================================================================================================

:- set_prolog_flag(debug, true).

handle_schedule_all_rooms(Request) :-
    % Parse JSON body to extract "day"
    http_read_json_dict(Request, Dict),
    (   get_dict(day, Dict, Day) ->
        debug(scheduling, 'Parsed day: ~w', [Day]),  % Debugging output
        % Ensure clean initial state
        retractall(agenda_staff1(_, _, _)),
        retractall(agenda_operation_room1(_, _, _)),

        % Start the scheduling
        (   schedule_all_surgeries(_, Day)
        ->  % Success logic
            debug(scheduling, 'Scheduling succeeded', []),  % Debugging output
            Response = json{success: "Scheduling succeeded."}
        ;   % Failure logic
            debug(scheduling, 'Scheduling failed', []),  % Debugging output
            Response = json{error: "Scheduling failed. Ensure proper input and configuration."}
        )
    ;   % Handle missing "day" parameter
        Response = json{error: "Missing 'day' parameter in request body."}
    ),

    % Send the response
    reply_json(Response).

% CODE ===============================================================================================================================

schedule_all_surgeries(Room,Day):-
    get_time(Ti),
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
    findall(_,(agenda_operation_room(Or,Date,Agenda),assertz(agenda_operation_room1(Or,Date,Agenda))),_),
    findall(_,(agenda_staff1(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_),
    findall(OpCode,surgery_id(OpCode,_),LOpCode),

    availability_all_surgeries(LOpCode, _, Day),

    write("\nRoom schedules:\n"),
    findall(RoomAgenda, (agenda_operation_room1(Room, Day, AgendaRoom), 
                        RoomAgenda = (Room, AgendaRoom),
                        AgendaRoom \= []),
                        RoomAgendas),
                    (   RoomAgendas \= [] ->
                        sort(RoomAgendas, SortedRoomAgendas),
                        forall(member((Room, AgendaRoom), SortedRoomAgendas),
                        format(" Schedule for ~w in the day ~w: ~w~n", [Room, Day, AgendaRoom]));
                        write(" No room was used.\n")
                    ),
    get_time(Tf),
    T is Tf-Ti,
    write('Time to generate solution: '),write(T),write("\n").


availability_all_surgeries([],_,_).
availability_all_surgeries([OpCode|LOpCode],_,Day):-
    surgery_id(OpCode,OpType),
    surgery(OpType,TAnes,TSurgery,TClean),
    findall(Room,agenda_operation_room(Room,Day,_),Rooms),
    occupation_room_sort(Day,Rooms, RoomsSorted),
    select_first(RoomsSorted, (SelectedRoom, _)), TATotal is TAnes + TSurgery, TSTotal is TATotal + TClean,
    surgery_staff_requirements(OpType,NAnaes,NAnaesNurses,NMedicalAssistants),
    findall(Doctor,staff(Doctor,doctor,anesthetist,_),LDoctors),
    findall(NAnesthetist,staff(NAnesthetist,staff,anesthetistnurse,_),LANurses),
    findall(Assistant,staff(Assistant,staff,medicalassistant,_),LMassistants),
    select_first_elements(LDoctors,NAnaes,LDoctorsSelected),
    select_first_elements(LANurses,NAnaesNurses,LNursesSelected),
    select_first_elements(LMassistants,NMedicalAssistants,LMassistantsSelected),
    findall(Doctor, assignment_surgery(OpCode,Doctor),LDoctorsAssigned),
    append([LDoctorsSelected,LNursesSelected,LMassistantsSelected,LDoctorsAssigned], LStaff),
    intersect_all_agendas(LStaff,Day,LIntersected),
    agenda_operation_room1(SelectedRoom,Day,LAgenda),
    free_agenda0(LAgenda,LFA),
    intersect_2_agendas(LFA,LIntersected,GlobalAgenda),
    remove_unf_intervals(TSTotal,GlobalAgenda,LPossibilities),
    (
        LPossibilities \= [] ->
    (
        schedule_first_interval(TSTotal,LPossibilities,(TinS,TfinS)), TfinA is TinS + TATotal, TinDoc is TinS + TAnes, TfinDoc is TinDoc + TSurgery, TinMA is TinS + TATotal,
        retract(agenda_operation_room1(SelectedRoom,Day,Agenda)),
        insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
        assertz(agenda_operation_room1(SelectedRoom,Day,Agenda1)),
        insert_agenda_staff((TinS,TfinA,OpCode),Day,LDoctorsSelected),
        insert_agenda_staff((TinS,TfinA,OpCode),Day,LNursesSelected),
        insert_agenda_staff((TinMA,TfinS,OpCode),Day,LMassistantsSelected),
        insert_agenda_doctors((TinDoc,TfinDoc,OpCode),Day,LDoctorsAssigned)
    );
    n1
), availability_all_surgeries(LOpCode,_,Day).
   

select_first_elements(_, 0, []).
select_first_elements([Element | Rest], N, [Element | SelectedRest]) :- N > 0, N1 is N - 1,
select_first_elements(Rest, N1, SelectedRest).
 

%% ROOM SORTER

occupation_room_sort(Date, Rooms, SortedRoomOccupations) :-
    calculate_room_occupations_percentage(Date, Rooms, RoomOccupations),
    sort(2, @=<, RoomOccupations, SortedRoomOccupations).

calculate_room_occupations_percentage(_, [], []).
calculate_room_occupations_percentage(Date, [Room | Rooms], [RoomOccupation | RoomOccupations]) :-
    agenda_operation_room1(Room, Date, Agenda),
    calculate_occupied_time(Agenda, OccupiedTime),
    MaxTime is 1440,
    OccupationPercent is (OccupiedTime / MaxTime) * 100,
    RoomOccupation = (Room, OccupationPercent),
    calculate_room_occupations_percentage(Date, Rooms, RoomOccupations).


calculate_occupied_time([], 0).
calculate_occupied_time([(Tin, Tfin, _) | Rooms], TotalTime) :-
    IntervalTime is Tfin - Tin,
    calculate_occupied_time(Rooms, RestTime),
    TotalTime is IntervalTime + RestTime.


% UTILS - Code from the previous version
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
adapt_timetable(D, Date, LFA, LFA2) :-timetable(D, Date, (InTime, FinTime)),treatin(InTime, LFA, LFA1),treatfin(FinTime, LFA1, LFA2).

treatin(InTime, [(In, Fin) | LFA], [(In, Fin) | LFA]) :- InTime =< In, !.
treatin(InTime, [(_, Fin) | LFA], LFA1) :- InTime > Fin, !,
treatin(InTime, LFA, LFA1).
treatin(InTime, [(_, Fin) | LFA], [(InTime, Fin) | LFA]).
treatin(_, [], []).

treatfin(FinTime, [(In, Fin) | LFA], [(In, Fin) | LFA1]) :- FinTime >= Fin, !,treatfin(FinTime, LFA, LFA1).
treatfin(FinTime, [(In, _) | _], []) :- FinTime =< In, !.
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


% Remove unfeasible intervals
remove_unf_intervals(_, [], []).
remove_unf_intervals(TSurgery, [(Tin, Tfin) | LA], [(Tin, Tfin) | LA1]) :- 
    DT is Tfin - Tin + 1, 
    TSurgery =< DT, !,
    remove_unf_intervals(TSurgery, LA, LA1).
remove_unf_intervals(TSurgery, [_ | LA], LA1) :- remove_unf_intervals(TSurgery, LA, LA1).

% Schedule the first available interval
schedule_first_interval(TSurgery, [(Tin, _) | _], (Tin, TfinS)) :- TfinS is Tin + TSurgery - 1.

% Insert into agenda
insert_agenda((TinS, TfinS, OpCode), [], [(TinS, TfinS, OpCode)]).
insert_agenda((TinS, TfinS, OpCode), [(Tin, Tfin, OpCode1) | LA], [(TinS, TfinS, OpCode), (Tin, Tfin, OpCode1) | LA]) :- TfinS < Tin, !.
insert_agenda((TinS, TfinS, OpCode), [(Tin, Tfin, OpCode1) | LA], [(Tin, Tfin, OpCode1) | LA1]) :- insert_agenda((TinS, TfinS, OpCode), LA, LA1).

% Insert into doctors' agendas
insert_agenda_staff(_, _, []).
insert_agenda_staff((TinS, TfinS, OpCode), Date, [Doctor | LDoctors]) :-
    retract(agenda_staff1(Doctor, Date, Agenda)),
    insert_agenda((TinS, TfinS, OpCode), Agenda, Agenda1),
    assert(agenda_staff1(Doctor, Date, Agenda1)),
    insert_agenda_staff((TinS, TfinS, OpCode), Date, LDoctors).


insert_agenda_doctors(_,_,[]).
insert_agenda_doctors((TinS,TfinS,OpCode),Day,[Doctor|LDoctors]):-
    retract(agenda_staff1(Doctor,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assert(agenda_staff1(Doctor,Day,Agenda1)),
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors).


% List agendas of doctors
list_doctors_agenda(_, [], []).
list_doctors_agenda(Date, [D | LD], [(D, AgD) | LAgD]) :-
    agenda_staff1(D, Date, AgD),
    list_doctors_agenda(Date, LD, LAgD).

% Remove duplicates from a list
remove_duplicates([], []).
remove_duplicates([X | L], L1) :- member(X, L), !,remove_duplicates(L, L1).
remove_duplicates([X | L], [X | L1]) :- remove_duplicates(L, L1).

is_doctor(Doctor) :-
    atom_concat('d0', _, Doctor).

select_first([Element | _], Element).
