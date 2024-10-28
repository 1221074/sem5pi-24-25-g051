using System.Text.Json.Serialization;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.Staff
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