import users  from '../models/users.js'


export const getUsers = async(req,res)=>{
    try {
        const user = await users.findAll()
    res.json(user)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
export const getUser = async(req,res)=>{
    const {id} = req.params
    try {
        const user = await users.findOne({
            where:{
                id,
            }
        })

        if(!user) return res.status(404).json({message:"Usuario no encontrado"})
        res.json(user)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const createtUsers = async (req,res)=>{
    const {username,password} = req.body;

    try {
        const newUsers = await users.create({
            username,
            password
        })
        res.json(newUsers)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
};
export const updateUsers = async (req,res)=>{
    const {id} = req.params
    const {username,password} = req.body

    try {
        const user = await users.findByPk(id)
        user.username = username
        user.password = password
        await user.save()
        res.json(user)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
export const deleteUsers = async (req,res)=>{
    const {id} = req.params;
    try {
        await users.destroy({
            where:{
                id,
            },
        });
        res.sendStatus('204');
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
};