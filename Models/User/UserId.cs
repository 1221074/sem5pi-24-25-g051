using System;
using sem5pi_24_25_g051.Models.Shared;


namespace sem5pi_24_25_g051.Models.User
{
    public class UserId : EntityId
    {

        public UserId(String value):base(value)
        {

        }

        override
        protected  Object createFromString(String text){
            return text;
        }
        override
        public String AsString(){
            return (String) base.Value;
        }
    }
}