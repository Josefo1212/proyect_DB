import express from 'express';
import {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord,
    profile
} from '../controllers/admin.controller.js';
import { isAdmin, validateTable } from '../middleware/admin.middleware.js'; // Updated path

const router = express.Router();

router.post('/:table',
    isAdmin,
    validateTable,
    createRecord
);

router.get('/:table',
    isAdmin,
    validateTable,
    getRecords
);

router.put('/:table/:id',
    validateTable,
    updateRecord
);

router.delete('/:table/:id',
    isAdmin,
    validateTable,
    deleteRecord
);

router.get('/profile/:username?',
    isAdmin,
    profile
);

export default router;