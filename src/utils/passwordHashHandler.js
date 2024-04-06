import bcrypt from 'bcrypt';

export const hashing = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error
        })
    }
}

export const compare = async(password, hashedPassword) =>{
    return await bcrypt.compare(password, hashedPassword);
}