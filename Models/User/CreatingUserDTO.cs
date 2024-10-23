namespace sem5pi_24_25_g051.Models.User
{
    public class CreatingUserDTO
    {

    public string Nif{get;set;}
    public string Email { get; set; }

    public string UserName { get; set; }

    public string PhoneNumber { get; set; }

    public RoleType Role { get; set; }

    public CreatingUserDTO(string nif, string email, string username, string phone, RoleType role)  
        {
            this.Nif = nif;
            this.Email = email;
            this.UserName = username;
            this.PhoneNumber = phone;
            this.Role = role;
        }
    
        public CreatingUserDTO() {}

    }
}