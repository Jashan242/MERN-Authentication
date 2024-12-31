class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const error=(err, req, res, next)=>{
    err.statusCode = err.statusCode;
    err.message = err.message;

    if(err.name==="CastError"){ 
        const message=`Invalid ${err.path}`; 
        err=new ErrorHandler(message, 400);
    }

    if(err.name==="JsonWebTokenError"){ 
        const message=`JSON web token is invalid`; 
        err=new ErrorHandler(message, 400);
    }

    if(err.name==="TokenExpiredError"){  
        const message=`JSON Web token is expired`;  
        err=new ErrorHandler(message, 400);
    }

    if((error.code===11000)){
        const message=`Duplicate field value entered`;
        err=new ErrorHandler(message, 400);
    }
}

export default ErrorHandler;