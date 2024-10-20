using System.Text.Json.Serialization;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.OperationType
{
    public class OperationTypeId : EntityId
    {
        [JsonConstructor]
        public OperationTypeId(Guid value) : base(value)
        {
        }

        public OperationTypeId(String value) : base(value)
        {
        }

        override
        protected  Object createFromString(String text){
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