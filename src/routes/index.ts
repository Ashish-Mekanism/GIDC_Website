import { Request, Response, Router } from 'express';

import { RESPONSE_CODE } from '../utils/constants';
import userRoutes from './user';
import adminRoutes from './admin';
import Config from '../config';
import { SendEmailTemplateMail } from '../services/emailService';
import ServiceRequestsExcel from '../services/excel/modules/serviceRequestExcel';
import NOCNoDueExcel from '../services/excel/modules/nocNoDueExcel';
import SeekerExcel from '../services/excel/modules/seekerExcel';
import SponsorshipExcel from '../services/excel/modules/sponsorshipExcel__';
import CareerOpportunityExcel from '../services/excel/modules/careerOpportunityExcel';
import AppliedJobsExcel from '../services/excel/modules/appliedJobsExcel';
import asyncHandler from '../utils/asyncHandler';
import { NoNocDueService } from '../services/user/noc/nocNoDueService';
import path from 'path';
import { ContractorService } from '../services/admin/contractor/contractorService';
import { AdminComplaintService } from '../services/admin/complaint/AdminComplaintService';
import UsersExcel from '../services/excel/modules/usersExcel';
const router: Router = Router();

// All user Related Routes
router.use('/user', userRoutes);

// // All admin Related Routes
router.use('/admin', adminRoutes);

// // All Host Related Routes
// router.use('/host', hostRoutes);

// Index Route
router.get('/', (_req: Request, res: Response) => {
  const message = {
    message: ` [OIA] | NODE ENVIRONMENT:${Config.NODE_ENV} | ${'serverRunning'} on port  ${Config.PORT}`,
  };
  res.status(RESPONSE_CODE.SUCCESS).json(message);
});


export default router;
