export default function checkAuth(req, res, next){

    if(req.session){

        if(req.session.userId){
            next()
        }
    }else {
        return res.status(401).json({ message: "No autorizado" });
    }





}