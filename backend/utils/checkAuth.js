import jwt from 'jsonwebtoken'

export const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '') ?? ''; 
        if (!token){
            throw new Error ('Токен не подходит.')
        }

        const decoded = jwt.verify(token, 'secretTwitter');

        if (!decoded){
            throw new Error ('Токен не прошел верификацию.')
        }

        req.userId = decoded._id;

        next();
    } catch (error) {
        console.log("Check Auth problem" + error);
        return res.status(403).json("Something wrong with authorization.")
    }
} 