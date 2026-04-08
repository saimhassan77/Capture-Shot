class apiResponse{
    constructor(status,data,message="success"){
        this.status=status
        this.message=message||"success"
        this.data=data
        this.success=status < 400
    }
}

export default apiResponse