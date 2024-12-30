import { Router } from 'express';
import allergy from './Routes/allergyRoute';
import medicalcondition from './Routes/medicalconditionRoutes';
import medicalrecord from './Routes/medicalrecordRoutes';

export default () => {
	const app = Router();

	allergy(app);
	medicalcondition(app);
	medicalrecord(app);

	return app
}