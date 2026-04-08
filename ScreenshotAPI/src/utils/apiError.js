class apiError extends Error{
    constructor(status,message="Samething Went Wrong",data=null,errors=[],stack=""){

        super(message)
        this.status=status
        this.data=data
        this.message=message
        this.errors=errors
        this.success=false
        
        if (stack) {
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export default apiError 