/*using System.Collections.Generic;

namespace backend_module.Models // Replace YourNamespace with your actual namespace
{
    public class PlanningResult
    {
        public string Status { get; set; } // "success" or "failure"
        public double ExecutionTime { get; set; } // Time taken for the planning, in seconds
        public int FinishTime { get; set; } // Finish time in minutes since midnight
        public List<OperationRoomAgenda> OperationRoomAgenda { get; set; } = new();
        public Dictionary<string, List<DoctorAgenda>> DoctorsAgenda { get; set; } = new();
    }

    public class OperationRoomAgenda
    {
        public int Start { get; set; } // Start time in minutes since midnight
        public int End { get; set; } // End time in minutes since midnight
        public string SurgeryId { get; set; }
    }

    public class DoctorAgenda
    {
        public int Start { get; set; } // Start time in minutes since midnight
        public int End { get; set; } // End time in minutes since midnight
        public string SurgeryId { get; set; }
    }
}
*/
