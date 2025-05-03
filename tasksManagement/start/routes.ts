import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

// Controllers
import AuthController from '#controllers/auth_controller';
import TaskController from "#controllers/tasks_controller";
import TaskUsersController from "#controllers/task_users_controller";
import UserController from "#controllers/users_controller";

// Root route
router.get('/', async () => {
  return { hello: 'world' };
});

// Public routes
router
  .group(() => {
    router.post('/login', [AuthController, 'login']);
    router.post('/confirmLogin', [AuthController, 'confirmLogin']);
  })
  .prefix('/auth');

// Authenticated routes
router
  .group(() => {
    router.get('/me', [AuthController, 'me']);

    // Admin routes : gestion des utilisateurs
    router
      .group(() => {
        router.get('/users', [UserController, 'index']);
        router.post('/users', [UserController, 'store']);
        router.get('/users/:id', [UserController, 'show']);
        router.put('/users/:id', [UserController, 'update']);
        router.delete('/users/:id', [UserController, 'destroy']);
        router.put('/change_status_user/:userId', [UserController, 'activateOrDesactivateUser']);
      })
      .use(middleware.admin())
      .prefix('/admin');

    // Routes liées aux tâches
    router
      .group(() => {
        // Tâches
        router.post('/add_task', [TaskController, 'createTask']);
        router.get('/list_tasks', [TaskController, 'listTasks']);
        router.put('/update_task/:id', [TaskController, 'updateTask']);
        router.delete('/delete_task/:id', [TaskController, 'deleteTask']);
        router.put('/change_task_status/:id', [TaskController, 'changeTaskStatus']);
        router.put('/change_task_group/:id', [TaskController, 'changeTaskGroup']);
        router.put('/update_progression/:id', [TaskController, 'updateProgression']);
        router.get('/getTasksInLate', [TaskController, 'getTasksInLate']);

        // Assignations des tâches aux utilisateurs
        router.post('/assign_task_to_user/:taskId/users/:userId', [TaskUsersController, 'assignTaskToUser']);
        router.delete('/unassign_task_to_user/:taskId/users/:userId', [TaskUsersController, 'unassignTaskFromUser']);
        router.post('/assign_task_to_users/:taskId/users', [TaskUsersController, 'assignTaskToUsers']);
        router.get('/list_users_for_task/:taskId', [TaskUsersController, 'listUsersForTask']);
        router.get('/list_tasks_for_user/:userId', [TaskUsersController, 'listTasksForUser']);
        router.get('/:taskId/users/:userId/check', [TaskUsersController, 'checkUserAssignment']);
      })
      .prefix('/planification/tasks');
  })
  .prefix('/auth');
