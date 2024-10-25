namespace sem5pi_24_25_g051.Models.User
{
    //Enum to represent the different types of roles that a user can have
    public enum RoleType
    {
        ADMIN,
        DOCTOR,
        NURSE,
        TECHNICIAN,
        PATIENT

    }

    public static class RoleTypeExtensions
{
    public static string GetRoleDescription(this RoleType roleType)
    {
        return roleType switch
        {
            RoleType.ADMIN => "Admin",
            RoleType.DOCTOR => "Doctor",
            RoleType.NURSE => "Nurse",
            RoleType.TECHNICIAN => "Technician",
            RoleType.PATIENT => "Patient"
        };
    }
}

}
