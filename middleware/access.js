const { StatusCodes } = require("http-status-codes");
module.exports.access = (permission) => {
    return (req, res, next) => {
        try {
            // console.log(req.role.data);
            let allPermission = JSON.parse(req.role.data).permission;
            // console.log(req.role);
            if (req.role.name === "admin") {
                // console.log(12);
                // don't do any things just allow to access
            } else if (!allPermission.includes(permission))
                throw Error(
                    "لا يمكنك الوصول الى هذه الصفحة, لا تملك صلاحية وصول"
                );
            next();
        } catch (err) {
            return res.status(StatusCodes.UNAUTHORIZED).send({
                success: false,
                error: err.message,
            });
        }
    };
};
