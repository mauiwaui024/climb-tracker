module.exports = class ApiError extends Error{
    status;
    error;

    constructor(status,message,errors = []){
        super(message)
        this.status = status;
        this.errors = errors;
    }
    //static функции - это функции, которые можно создавать, не используя экземпляр класса
    static UnauthorizedError(){
        return new ApiError(401, 'Пользователь не авторизован')
    }
    static BadRequest(message, errors = []){
        return new ApiError(400, message, errors);
    }
}