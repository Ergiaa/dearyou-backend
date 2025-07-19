import { Router } from 'express';
import { LetterController } from '../controllers/letter.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createLetterSchema,
  updateLetterSchema,
  updateGuestLetterSchema,
  getLetterSchema,
  getLetterByIdSchema,
  deleteLetterSchema,
  deleteGuestLetterSchema,
  listLettersSchema,
} from '../validations/letter.validation';

const router = Router();
const letterController = new LetterController();

// Public routes
router.get('/:slug', validate(getLetterSchema), letterController.getLetter);
router.post('/guest', validate(createLetterSchema), letterController.createGuestLetter);
router.patch('/guest/:id', validate(updateGuestLetterSchema), letterController.updateGuestLetter);
router.delete('/guest/:id', validate(deleteGuestLetterSchema), letterController.deleteGuestLetter);

// Protected routes
router.post('/', authenticate, validate(createLetterSchema), letterController.createLetter);
router.get('/my/:id', authenticate, validate(getLetterByIdSchema), letterController.getLetterById);
router.patch('/:id', authenticate, validate(updateLetterSchema), letterController.updateLetter);
router.delete('/:id', authenticate, validate(deleteLetterSchema), letterController.deleteLetter);
router.get('/', authenticate, validate(listLettersSchema), letterController.listMyLetters);

export default router;
