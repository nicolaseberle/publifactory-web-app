'use strict';

const express = require('express')
const router = express.Router()

const auth = require('../../auth/auth.service');
const rolesController = require('./roles.controller')

router.post('/', rolesController.createRole);
router.put('/:id', rolesController.modifyRight);
router.delete('/:id', rolesController.deleteRole);
router.get('/:id', rolesController.getRoleById);
router.get('/user/:id?', rolesController.getUserRoles);
router.get('/article/:id_article/:right([author|associateEditor|reviewer])?',
  rolesController.getArticleUsers);

module.exports = router;
