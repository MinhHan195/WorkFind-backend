const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'dcgog8pcw', 
    api_key: '761143515491342', 
    api_secret: 'yz5_EKCRPdqhuH24tMso7defw98'// Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;