const mysql = require('../../database');
const utils = require('../../utils/');
const moment = require('moment');
const methods = {};
require('dotenv').config();

methods.postToDoList = (req, res) => {
    if (req.user.idTypeUser === 1) {
        mysql.getConnection((error, conn) => {
            conn.query(
                `INSERT INTO todo_list(id_user,
                                       name,
                                       description)
                 VALUES (?, ?, ?);
                `, [
                    req.user.idUser,
                    req.body.name,
                    req.body.description,
                ],
                (error) => {
                    conn.release();

                    if (error) {
                        return res.status(400).json({
                            error: 'Ops! Ocorreu um erro interno, tente novamente.'
                        });
                    }

                    return res.status(201).send({
                        message: 'Seu lista foi criada com sucesso!'
                    });
                });
        });
    } else {
        return res.status(401).send({
            message: 'Permission not allowed!'
        });
    }
};

methods.getToDoListByIdUser = (req, res) => {
    if (req.user.idTypeUser === 1) {
        mysql.getConnection((error, conn) => {
            conn.query(
                `SELECT todo_list.id_todo_list                              AS idToDoList,
                        todo_list.id_user                                   AS idUser,
                        users.email,
                        todo_list.name,
                        todo_list.description,
                        todo_list.created,
                        todo_list.modified,
                        (SELECT count(id_task)
                         FROM tasks
                         WHERE tasks.id_todo_list = todo_list.id_todo_list) AS countTasks
                 FROM todo_list
                          INNER JOIN users on todo_list.id_user = users.id_user
                 WHERE todo_list.id_user = ?;
                `, [
                    req.user.idUser,
                ],
                (error, result) => {
                    conn.release();

                    if (error) {
                        return res.status(400).json({
                            error: 'Ops! Ocorreu um erro interno, tente novamente.'
                        });
                    }
                    return res.status(201).json(result);
                });
        });
    } else {
        return res.status(401).send({
            message: 'Permission not allowed!'
        });
    }
};

methods.patchToDoListByIdUser = (req, res) => {
    if (req.user.idTypeUser === 1) {
        mysql.getConnection((error, conn) => {
            conn.query(
                `UPDATE todo_list
                 SET name        = ?,
                     description = ?,
                     modified    = NOW()
                 WHERE todo_list.id_todo_list = ?
                   AND todo_list.id_user = ?;
                `, [
                    req.body.name,
                    req.body.description,
                    req.params.idToDoList,
                    req.user.idUser,
                ],
                (error) => {
                    conn.release();

                    if (error) {
                        return res.status(400).json({
                            error: 'Ops! Ocorreu um erro interno, tente novamente.'
                        });
                    }
                    return res.status(201).json({
                        message: 'Lista alterada com sucesso!'
                    });
                });
        });
    } else {
        return res.status(401).send({
            message: 'Permission not allowed!'
        });
    }
};

methods.postTask = (req, res) => {
    if (req.user.idTypeUser === 1) {
        mysql.getConnection((error, conn) => {
            conn.query(
                `INSERT INTO tasks(id_todo_list,
                                   name,
                                   description,
                                   end_at)
                 VALUES (?, ?, ?, ?);
                `, [
                    req.params.idToDoList,
                    req.body.name,
                    req.body.description,
                    req.body.endAt
                ],
                (error) => {
                    conn.release();

                    if (error) {
                        return res.status(400).json({
                            error: 'Ops! Ocorreu um erro interno, tente novamente.'
                        });
                    }

                    return res.status(201).send({
                        message: 'Seu tarefa foi criada com sucesso!'
                    });
                });
        });
    } else {
        return res.status(401).send({
            message: 'Permission not allowed!'
        });
    }
};

methods.getTasksByIdToDoList = (req, res) => {
    if (req.user.idTypeUser === 1) {
        mysql.getConnection((error, conn) => {
            conn.query(
                `SELECT tasks.id_task      AS idTask,
                        tasks.id_todo_list AS idToDoList,
                        todo_list.name     AS toDoName,
                        tasks.name,
                        tasks.description,
                        tasks.end_at       AS endAt,
                        tasks.was_finished AS wasFinished,
                        CASE
                            WHEN end_at > NOW() AND was_finished = 0 THEN 'Em andamento'
                            WHEN end_at < NOW() AND was_finished = 0 THEN 'Em atraso'
                            WHEN end_at > NOW() OR end_at < NOW() AND was_finished = 1 THEN 'Finalizado'
                            END            AS status,
                        tasks.created,
                        tasks.modified
                 FROM tasks
                          INNER JOIN todo_list on tasks.id_todo_list = todo_list.id_todo_list
                 WHERE tasks.id_todo_list = ?;
                `, [
                    req.params.idToDoList,
                ],
                (error, results) => {
                    conn.release();

                    if (error) {
                        return res.status(400).json({
                            error: 'Ops! Ocorreu um erro interno, tente novamente.'
                        });
                    }

                    return res.status(201).json(results);
                });
        });
    } else {
        return res.status(401).send({
            message: 'Permission not allowed!'
        });
    }
};

methods.patchTaskByIdToDoList = (req, res) => {
    if (req.user.idTypeUser === 1) {
        mysql.getConnection((error, conn) => {
            if (error) {
                conn.release();
                return res.status(500).json({
                    message: 'Ops! Ocorreu um erro interno, tente novamente.'
                });
            }

            conn.beginTransaction((error) => {
                if (error) {
                    conn.release();
                    return res.status(500).json({
                        message: 'Ops! Ocorreu um erro interno, tente novamente.'
                    });
                }

                /* Verify if is a Finished Task */

                conn.query(
                    `SELECT tasks.id_task      AS idTask,
                            tasks.id_todo_list AS idToDoList,
                            todo_list.name     AS toDoName,
                            tasks.name,
                            tasks.description,
                            tasks.end_at       AS endAt,
                            tasks.was_finished AS wasFinished,
                            CASE
                                WHEN end_at > NOW() AND was_finished = 0 THEN 'Em andamento'
                                WHEN end_at < NOW() AND was_finished = 0 THEN 'Em atraso'
                                WHEN end_at > NOW() OR end_at < NOW() AND was_finished = 1 THEN 'Finalizado'
                                END            AS status,
                            tasks.created,
                            tasks.modified
                     FROM tasks
                              INNER JOIN todo_list on tasks.id_todo_list = todo_list.id_todo_list
                     WHERE tasks.id_task = ?
                       AND tasks.id_todo_list = ?;
                    `, [
                        req.params.idTask,
                        req.params.idToDoList,
                    ],
                    (error, results) => {

                        if (error) {
                            conn.release();
                            return res.status(400).json({
                                error: 'Ops! Ocorreu um erro interno, tente novamente.'
                            });
                        }

                        console.log(results[0].wasFinished)
                        if (results[0].wasFinished === 0) {
                            conn.query(
                                `UPDATE tasks
                                 SET name         = ?,
                                     description  = ?,
                                     end_at       = ?,
                                     was_finished = ?,
                                     modified     = NOW()
                                 WHERE tasks.id_task = ?
                                   AND tasks.id_todo_list = ?;
                                `, [
                                    req.body.name,
                                    req.body.description,
                                    req.body.endAt,
                                    req.body.wasFinished,
                                    req.params.idTask,
                                    req.params.idToDoList
                                ],
                                (error) => {


                                    if (error) {
                                        conn.release();
                                        return res.status(400).json({
                                            error: 'Ops! Ocorreu um erro interno, tente novamente.'
                                        });
                                    }

                                    conn.commit((error) => {
                                        if (error) {
                                            conn.rollback(() => {
                                                conn.release();
                                                return res.status(500).json({
                                                    error: 'Ops...ocorreu um erro interno, tente novamente.'
                                                });
                                            });
                                        }

                                        return res.status(201).json({
                                            message: 'Tarefa alterada com sucesso!'
                                        });

                                    });

                                });
                        } else {
                            return res.status(400).json({
                                message: 'Esta tarefa já foi finalizada e por este motivo não pode ser mais alterada.'
                            });
                        }
                    });
            });
        });
    } else {
        return res.status(401).send({
            message: 'Permission not allowed!'
        });
    }
};

getStatus = (end, wasFinished) => {
    let endAt = moment(end).isBefore(Date.now());

    if (endAt && wasFinished === 0) {
        return 'Em atraso'
    }

    if (!endAt && wasFinished === 0) {
        return 'Em andamento'
    }

    if (wasFinished) {
        return 'Finalizado'
    }
}

module.exports = methods;
