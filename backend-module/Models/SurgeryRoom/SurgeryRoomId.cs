using System.Text.Json.Serialization;
using backend_module.Models.Shared;

namespace backend_module.Models.SurgeryRoom
{
    public class SurgeryRoomId : EntityId
    {
        public SurgeryRoomId(String value) : base(value)
        {
        }

        override
        protected Object createFromString(String text){
            return text;
        }
        override
        public String AsString(){
            return base.ObjValue.ToString();
        }
    }
}