INSERT INTO types_users (type_user)
VALUES ('Client'),
       ('Admin');

INSERT INTO users (id_type_user, email, password, is_active_user, created, modified)
VALUES (2, 'admin@gmail.com', '$2a$10$Is.yh7gMcMHTiGeKdtKdQ.kCY8DheBif6F.dW.kgQfGUA967xqGKm', 1, '2021-09-06 12:31:36',
        null);

CREATE VIEW tasks_view AS SELECT tasks.id_task      AS idTask,
                                 tasks.id_todo_list AS idToDoList,
                                 users.email,
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
                                   INNER JOIN todo_list ON tasks.id_todo_list = todo_list.id_todo_list
                                   INNER JOIN users ON todo_list.id_user = users.id_user;
