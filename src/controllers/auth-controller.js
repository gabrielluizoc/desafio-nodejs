const mysql = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const utils = require('../utils/');
const methods = {};
require('dotenv').config();

methods.verifyEmail = (req, res) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT users.email
             FROM users
             WHERE users.email = ?;
            `,
            [req.body.email],
            (error, result) => {
                conn.release();

                if (error)
                    return res.status(500).json({
                        error: "Ops...ocorreu um erro interno, tente novamente."
                    });

                if (result.length > 0)
                    return res.status(200).json({
                        isRegistered: true,
                        message: "Este e-mail já foi cadastrado, tente outro..."
                    });
                else
                    return res.status(200).json({
                        isRegistered: false
                    });
            }
        );
    });
};

methods.verifyToken = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({
            isValid: false
        });

    const parts = authHeader.split(' ');

    if (parts.length !== 2)
        return res.status(401).json({
            isValid: false
        });


    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).json({
            isValid: false
        });

    jwt.verify(token, process.env.SECRET_PASS_AUTH, (error) => {
        if (error)
            return res.status(401).json({
                isValid: false
            });

        return res.status(200).json({
            isValid: true
        });
    });
};

methods.register = async (req, res) => {
    let user = req.body;
    user.idTypeUser = 1;
    user.isActiveUser = true;
    try {
        user.password = await utils.generateHash(user.password, 10);
        mysql.getConnection((error, conn) => {
                conn.query(
                    `INSERT INTO users(id_type_user,
                                       email,
                                       password,
                                       is_active_user)
                     VALUES (?, ?, ?, ?);
                    `,
                    [
                        user.idTypeUser,
                        user.email,
                        user.password,
                        user.isActiveUser
                    ],
                    (error) => {
                        conn.release();

                        if (error)
                            return res.status(500).json({
                                error: 'Ops...ocorreu um erro interno, tente novamente.'
                            });

                        return res.status(201).send({
                            message: 'Sua conta foi criada com sucesso!'
                        });
                    }
                );
            }
        );
    } catch (error) {
        return res.status(400).json({
            error: "Ops...ocorreu um erro interno, tente novamente."
        })
    }
};

methods.authenticate = async (req, res) => {
    const {email, password} = req.body;
    mysql.getConnection((error, conn) => {
        conn.query(
            `SELECT users.email,
                    users.password
             FROM users
             WHERE users.email = ?;
            `, email,
            (error, result) => {
                conn.release();

                if (error) {
                    return res.status(400).json({
                        error: error
                    });
                }

                if (!result.length > 0) {
                    return res.status(400).json({
                        message: "E-mail ou senha inválido!"
                    });
                }

                if (result.length > 0) {
                    bcrypt.compare(password, result[0].password,
                        (error, result) => {

                            if (error) {
                                return res.status(400).json({
                                    error: error
                                });
                            }

                            if (result) {
                                mysql.getConnection((error, conn) => {
                                    conn.query(
                                        `SELECT users.id_user        AS idUser,
                                                users.id_type_user   AS idTypeUser,
                                                users.is_active_user AS isActiveUser
                                         FROM users
                                         WHERE users.email = ?;
                                        `, email,
                                        (error, result) => {
                                            conn.release();

                                            if (error) {
                                                return res.status(400).json({
                                                    error: error
                                                });
                                            }

                                            if (!result[0].isActiveUser) {
                                                return res.status(401).json({
                                                    message: 'Sua conta foi desativada...'
                                                });
                                            } else {
                                                const token = jwt.sign({user: result[0]}, process.env.SECRET_PASS_AUTH, {
                                                    expiresIn: 432000
                                                });

                                                return res.status(200).json({
                                                    token: token
                                                });

                                            }
                                        }
                                    );
                                })
                            } else {
                                return res.status(401).json({
                                    message: "E-mail ou senha inválido!"
                                });
                            }
                        }
                    );
                }
            }
        );
    });
};

module.exports = methods;
