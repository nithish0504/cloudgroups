import Joi from "joi";

async function validate<T>(input: any, schema: Joi.ObjectSchema): Promise<T> {
  return new Promise((resolve, reject) => {
    const result = schema.validate(input, {
      stripUnknown: true,
    });
    let error: Joi.ValidationError = result.error;
    // error.errorType =;
    
    if (error) {
      return reject(error);
    }
    resolve(result.value);
  });
}

export const Validator = {
  validate,
};
