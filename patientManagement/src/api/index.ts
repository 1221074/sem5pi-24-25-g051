import { Router } from 'express';
import allergy from './Routes/allergyRoute';
import medicalcondition from './Routes/medicalconditionRoutes';

export default () => {
	const app = Router();

	allergy(app);
	medicalcondition(app);

	return app
}