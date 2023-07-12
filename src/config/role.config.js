import UserDto from "../dao/DTOs/users.dto.js";
import logger from "./winston.config.js";

const authorizeRol = (...roles) => async (req, res, next) => {

    const user = req.user.user;

        if (!user) {
            return res.status(401).send({ error: 'Usuario no autenticado' });
        };

    const userDto = new UserDto(user);
        if (roles.includes(userDto.role)) {
            return next();
        } else {
            res.status(403).send('Unauthorized, You dont have permission');
        };
};

export default authorizeRol;