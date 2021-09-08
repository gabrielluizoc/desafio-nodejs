const mysql = require('../database');
const utils = require('../utils');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const methods = {};
require('dotenv').config();

methods.recoveryPasswordByEmail = async (req, res) => {
    try {
        mysql.getConnection((error, conn) => {
            conn.query(`
                        SELECT users.id_user AS idUser
                        FROM users
                        WHERE users.email = ?;
                `, [
                    req.body.email,
                ],
                (error, result) => {
                    conn.release();

                    if (error) {
                        return res.status(500).json({
                            message: 'Ops...ocorreu um erro interno, tente novamente.'
                        });
                    }

                    if (result.length > 0) {
                        const recoveryToken = jwt.sign({user: result}, process.env.SECRET_RECOVERY_PASS, {
                            expiresIn: 1800
                        });

                        utils.sendMail(
                            req.body.email,
                            'Alteração de senha',
                            '',
                            `
                            <html lang="pt-br">
                                <div style="height: auto;
                                        width: auto;
                                        border: 1px solid #ededed;
                                        border-radius: 5px;
                                        ">
                                    <div style="padding: 1em;">
                                        <p style="font-family: Cantarell; margin: 0px;">
                                            Vimos que você solicitou realizar a alteração de sua senha,
                                            este código de alteração será válido por apenas 30 minutos.
                                        </p>
                                        <a style="text-decoration: none;
                                        background-color: #0a8447;
                                        padding: 10px;
                                        border-radius: 5px;
                                        color: #fff;
                                        margin-top: 10px;
                                        font-family: Cantarell;
                                display: inline-block" href="http://upganic.com.br/delivery/recovery/${recoveryToken}">Alterar senha</a>
                                    </div>
                                </div>
                            </html>
                        `);

                        return res.status(200).json({
                            message: `Enviamos um email de alteração de senha para ${req.body.email}`,
                        });
                    }
                });
        });
    } catch (error) {
        return res.status(400).json({
            error: "Ops...ocorreu um erro interno, tente novamente."
        });
    }

}

methods.putPassword = async (req, res) => {
    let body = req.body;
    let user = [];
    jwt.verify(req.params.token, process.env.SECRET_RECOVERY_PASS, (error, decoded) => {
        if (error) {
            if (error.message === 'jwt expired') {
                return res.status(401).json({
                    message: 'Seu código de alteração expirou, solicite a alteração novamente.'
                });
            } else {
                return res.status(400).json({
                    message: 'Ops...ocorreu um erro, tente novamente ou solicite uma nova alteração de senha.'
                });
            }
        } else {
            if (decoded.user.length > 0) {
                user = decoded.user;
            }
        }
    });

    if (user.length > 0) {
        try {
            body.password ? body.password = await utils.generateHash(body.password, 10) : body.password = crypto.randomBytes(80).toString('hex');
            mysql.getConnection((error, conn) => {
                conn.query(`
                    UPDATE users
                    SET users.password = ?,
                        users.modified = NOW()
                    WHERE users.id_user = ${user[0].idUser};
            `, [
                        body.password,
                    ],
                    (error, results) => {
                        conn.release();

                        if (error) {
                            return res.status(500).json({
                                message: 'Ops...ocorreu um erro interno, tente novamente.'
                            });
                        }

                        return res.status(200).json({
                            message: 'Senha atualizada com sucesso!'
                        });

                    });
            });
        } catch (error) {
            return res.status(400).json({
                error: "Ops...ocorreu um erro interno, tente novamente."
            });
        }
    }
}

module.exports = methods;
