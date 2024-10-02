using Microsoft.AspNetCore.Mvc;
namespace backoffice_module.Controllers
{
public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
}