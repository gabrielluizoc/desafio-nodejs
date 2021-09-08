const mysql = require('../../database');
const methods = {};
require('dotenv').config();

methods.getTasks = (req, res) => {
    if (req.user.idTypeUser === 2) {
        const page = req.query.page;
        const limit = req.query.limit;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        mysql.getConnection((error, conn) => {
            conn.query(
                `SELECT * FROM tasks_view WHERE status like '%${req.body.status}%';`,
                (error, results) => {
                    conn.release();

                    if (error) {
                        return res.status(400).json({
                            error: 'Ops! Ocorreu um erro interno, tente novamente.'
                        });
                    }
                    const tasks = results.slice(startIndex, endIndex);
                    return res.status(201).json(tasks);
                });
        });
    } else {
        return res.status(401).send({
            message: 'Permission not allowed!'
        });
    }
};

module.exports = methods;
