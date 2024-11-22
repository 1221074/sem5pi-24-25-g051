/*using backend_module.Models;
using backend_module.Models.OperationRequest;
using backend_module.Models.SurgeryRoom;
using Newtonsoft.Json;

public class PlanningService
{
    private readonly ISurgeryRoomRepository _SRrepo;
    private readonly IOperationRequestRepository _ORrepo;

    public PlanningService(ISurgeryRoomRepository surgeryRoomRepository, IOperationRequestRepository operationRequestRepository)
    {
        _SRrepo = surgeryRoomRepository;
        _ORrepo = operationRequestRepository;
    }

    public async Task<PlanningResult> GetOptimalSchedule(string room,string date,string surgeries)
    {
        var surgeryRooms = await _SRrepo.GetAllAsync();
        var operationRequests = await _ORrepo.GetAllAsync();

        var roomDetails = surgeryRooms.FirstOrDefault(r => r.RoomNumber.ToString() == room && r.CurrentStatus.ToString() == "Available");
        if (roomDetails == null)
        {
            throw new Exception("Selected room is not available for scheduling.");
        }

        // Consider maintenance slots
        var maintenanceConflicts = roomDetails.MaintenanceSlots.Any(ms =>
            DateTime.Parse(date) >= ms.Start && DateTime.Parse(date) <= ms.End);

        if (maintenanceConflicts)
        {
            throw new Exception("Selected room is under maintenance on the chosen date.");
        }

        // Build the Prolog query
        var url = $"http://localhost:5000/optimal_schedule?room={room}&date={date}&surgeries={surgeries}";
        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Error fetching optimal schedule: {response.StatusCode}");
        }

        var content = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<PlanningResult>(content);
    }
    public async Task<PlanningResult> GetHeuristicSchedule(string room,string date,string surgeries,string heuristic)
    {
        // Similar checks for room availability and maintenance

        var url = $"http://localhost:5000/heuristic_schedule?room={room}&date={date}&surgeries={surgeries}&heuristic={heuristic}";
        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Error fetching heuristic schedule: {response.StatusCode}");
        }

        var content = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<PlanningResult>(content);
    }

    public async Task<List<(int NumberOfSurgeries, double ExecutionTime)>> GetComplexityAnalysis(string room,string date)
    {
        // Ensure room availability and no maintenance conflicts

        var url = $"http://localhost:5000/complexity_analysis?room={room}&date={date}";
        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Error fetching complexity analysis: {response.StatusCode}");
        }

        var content = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<List<(int NumberOfSurgeries, double ExecutionTime)>>(content);
    }
}
*/