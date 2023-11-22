const { StatusCodes } = require("http-status-codes");
const { type } = require("./typeValidation");

module.exports.validate = (schema, typeSchema) => {
    let result = false;
    return (req, res, next) => {
        switch (typeSchema) {
            //validate body
            case type.body:
                result = schema.validate(req.body);
                break;
            ///validate query
            case type.query:
                result = schema.validate(req.query);
                break;
            ///validate params
            case type.params:
                result = schema.validate(req.params);
                break;
        }
        //check if error
        if (result.error) {
            const { details } = result.error;
            const message = details.map((i) => i.message).join(" , ");
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Validation Error Message :" + message,
            });
        }
        next();
    };
};
