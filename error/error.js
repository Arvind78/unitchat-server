
/** 
@param {number} status - HTTP status code for the error response.
@param {string} message - Error message to be included in the error object.
@returns {Error} - Custom error object with status and message properties.
 **/

const error = (status,message)=>{ 
 // Create a new Error object
   const err = new Error();
   err.status = status,
   err.message = message
 // Return the custom error object
   return err; 
}

// Export the error function for use in other modules
module.exports = error;

