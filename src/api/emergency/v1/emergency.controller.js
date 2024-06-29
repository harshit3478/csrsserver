const responses = require('../../../utility/responses');
const emergencyServices = require('./emergency.services');

const createEmergency = async (req, res) => {
    try {
        const result = await emergencyServices.initiateEmergency(req);
        if (result.status && result.status !== 200) {
        return responses.generateResponse(
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

const updateEmergency = async (req, res) => {
    try {
        const result = await emergencyServices.updateStatus(req);
        if (result.status && result.status !== 200) {
        return responses.generateResponse(
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
    }

const getEmergencies = async (req, res) => {
    try {
        const result = await emergencyServices.getEmergencies(req);
        if (result.status && result.status !== 200) {
        return responses.generateResponse(
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
    }

    const getEmergencyById = async (req, res) => {
        try {
            // id will be in path params 

            console.log(req);

            const result = await emergencyServices.getEmergencyById(req);
            if (result.status && result.status !== 200) {
            return responses.generateResponse(
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
        }

const resolveEmergency = async (req, res) => {
    try {
        const result = await emergencyServices.resolveEmergency(req);
        if (result.status && result.status !== 200) {
        return responses.generateResponse(
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
    }

    module.exports = {
        createEmergency,
        updateEmergency,
        getEmergencies,
        resolveEmergency,
        getEmergencyById
    };
// };