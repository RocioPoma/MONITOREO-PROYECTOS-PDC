export class GlobalCostants {
    //Message
    public static genericError: string = "Algo salió mal. Por favor, inténtelo de nuevo más tarde";
    
    public static unauthorized: string = "No eres una persona autorizada para acceder a esta página";
    
    //Regex
    public static nameRegex: string = "[a-zA-Z0-9 ]*";

    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static contactNumberRegex: string = "^[e0-9]{10,10}$";

    //variables
    public static error: string = "error";
}
