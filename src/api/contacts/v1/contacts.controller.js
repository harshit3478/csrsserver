
const contactServices = require('./contacts.services');
const responses = require('../../../utility/responses');

const addContact = async (req, res) => {
    try {
      const result = await contactServices.addContact(req);
      if (result.status && result.status !== 200) {
        return response.generateResponse(
          res,
          false,
          result.message,
          result.status
        );
      }
  
      return responses.successResponse(res, result.data);
    } catch (err) {
      console.log(err);
      return responses.internalFailureResponse(res, err);
    }
  };

    const getContacts = async (req, res) => {
        try {
        const result = await contactServices.getContacts(req);
        if (result.status && result.status !== 200) {
            return response.generateResponse(
            res,
            false,
            result.message,
            result.status
            );
        }
    
        return responses.successResponse(res, result.data);
        } catch (err) {
        console.log(err);
        return responses.internalFailureResponse(res, err);
        }
    };

    const deleteContact = async (req, res) => {
        try {
            const result = await contactServices.deleteContact(req);
            if (result.status && result.status !== 200) {
                return response.generateResponse(
                res,
                false,
                result.message,
                result.status
                );
            }
            return responses.successResponse(res, result.data);
        } catch (err) {
            console.log(err);
            return responses.internalFailureResponse(res, err);
        }
    };

    const updateContacts = async (req, res) => {
        try {
            const result = await contactServices.updateContacts(req);
            if (result.status && result.status !== 200) {
                return response.generateResponse(
                res,
                false,
                result.message,
                result.status
                );
            }
            return responses.successResponse(res, result.data);
        } catch (err) {
            console.log(err);
            return responses.internalFailureResponse(res, err);
        }
    };

    module.exports = {
        addContact,
        getContacts,
        deleteContact,
        updateContacts
    };