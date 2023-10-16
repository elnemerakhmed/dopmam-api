const { Gateway, Wallets } = require( 'fabric-network' );
const { buildConnectionProfile } = require( '../fabric/ccp' );
const { buildWallet } = require( '../fabric/wallet' );
const { getChannelsForOrganization } = require('./channel');

const initializeConnectionForOrgranization = async (name, organization, channel) => {
    const connectionProfile = buildConnectionProfile( organization );
    const wallet = await buildWallet( Wallets, organization );
    const gateway = new Gateway();
    const connectionOptions = {
        identity: name,
        wallet: wallet,
        gatewayDiscovery: {
            enabled: true,
            asLocalhost: true
        }
    };
    await gateway.connect( connectionProfile, connectionOptions );
    const network = await gateway.getNetwork( channel );
    const contract = network.getContract( process.env.CHAINCODE );
    return contract;
};

const createPatient = async (name, organization, nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate, channel = getChannelsForOrganization( organization )[0]) => {
    const contract = await initializeConnectionForOrgranization(name, organization, channel);
    const buffer = await contract.submitTransaction('createPatient', nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate);
    return buffer.toString();
};

const deletePatient = async (name, organization, nationalId, channel = getChannelsForOrganization( organization )[0]) => {
    const contract = await initializeConnectionForOrgranization(name, organization, channel);
    const buffer = await contract.submitTransaction('deletePatient', nationalId);
    return buffer.toString();
};

const getPatient = async (name, organization, nationalId, channel = getChannelsForOrganization( organization )[0]) => {
    const contract = await initializeConnectionForOrgranization(name, organization, channel);
    const buffer = await contract.evaluateTransaction('getPatient', nationalId);
    return buffer.toString();
};

const createReport = async (name, organization, patientNationalId, reportDate, medicalHistoryAndClinicalFindings, diagnosis, recommendation, channel = getChannelsForOrganization( organization )[0]) => {
    const contract = await initializeConnectionForOrgranization(name, organization, channel);
    const buffer = await contract.submitTransaction('createReport', patientNationalId, reportDate, medicalHistoryAndClinicalFindings, diagnosis, recommendation);
    return buffer.toString();
};

const signReport = async (name, organization, reportId, country, city, hospital, dept, date, coverage, channel = getChannelsForOrganization( organization )[0]) => {
    const contract = await initializeConnectionForOrgranization(name, organization, channel);
    const buffer = await contract.submitTransaction('signReport', reportId, country, city, hospital, dept, date, coverage);
    return buffer.toString();
};

const rejectReport = async (name, organization, reportId, channel = getChannelsForOrganization( organization )[0]) => {
    const contract = await initializeConnectionForOrgranization(name, organization, channel);
    const buffer = await contract.submitTransaction('rejectReport', reportId);
    return buffer.toString();
};

const getReport = async (name, organization, reportId, channel = getChannelsForOrganization( organization )[0]) => {
    const contract = await initializeConnectionForOrgranization(name, organization, channel);
    const buffer = await contract.evaluateTransaction('getReport', reportId);
    return buffer.toString();
};

const getReports = async (name, organization, channel = getChannelsForOrganization( organization )[0]) => {
    const contract = await initializeConnectionForOrgranization(name, organization, channel);
    const buffer = await contract.evaluateTransaction('getReports');
    return buffer.toString();
};

module.exports = {
    createPatient,
    getPatient,
    deletePatient,
    createReport,
    signReport,
    rejectReport,
    getReport,
    getReports
};
