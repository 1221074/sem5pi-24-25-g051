namespace backend_module.Models.MedicalRecords {
public class MedicalRecord
    {
        public string Id { get; set; }
        public string patientId { get; set; }
        public List<string> allergies { get; set; }
        public List<string> medicalConditions { get; set; }
        public string freeText { get; set; }
    }
}