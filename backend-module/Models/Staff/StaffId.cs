using System.Text.Json.Serialization;
using backend_module.Models.Shared;

namespace backend_module.Models.Staff
{
    public class StaffId : EntityId
    {

        [JsonConstructor]
        public StaffId(Guid value) : base(value)
        {
        }

        public StaffId(String value) : base(value)
        {
        }

        override
        protected Object createFromString(String text){
            return new Guid(text);
        }
        override
        public String AsString(){
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }

        public Guid AsGuid(){
            return (Guid) base.ObjValue;
        }
    }
}