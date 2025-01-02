import { Router } from 'express';
import allergy from './Routes/allergyRoute';
import medicalcondition from './Routes/medicalconditionRoutes';
import medicalrecord from './Routes/medicalrecordRoutes';
import freetext from './Routes/freeTextRoute';

export default () => {
	const app = Router();

	allergy(app);
	medicalcondition(app);
	medicalrecord(app);
	freetext(app);

	return app
}