using System;
using System.Text.Json.Serialization;
using sem5pi_24_25_g051.Models.Shared;


// UserId.cs
namespace sem5pi_24_25_g051.Models.User
{
    public class UserId : EntityId
    {
        public UserId(string value) : base(value){}

        public bool Equals(UserId other)
        {
            if (other is null)
                return false;
            return Value == other.Value;
        }
        public override bool Equals(object obj) => Equals(obj as UserId);
        public override int GetHashCode() => Value.GetHashCode();
        override
        protected  Object createFromString(String text){
            return new Guid(text);
        }
        override
        public String AsString(){
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }        
    }
}