const methods = {};

methods.upload = (req, res) => {
    res.status(200).json({
        message : 'Follow up'
    });
}

module.exports = methods;
