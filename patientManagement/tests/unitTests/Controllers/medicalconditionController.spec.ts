import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import MedicalConditionController from '../../../src/controllers/MedicalConditionController';
import IMedicalConditionService from '../../../src/Services/IServices/IMedicalConditionService';
import { Result } from '../../../src/core/logic/Result';
import sinon from 'sinon';
import { beforeEach, describe, it } from "node:test";

describe('MedicalConditionController', () => {
    let mockMedicalConditionService: sinon.SinonStubbedInstance<IMedicalConditionService>;
    let medicalConditionController: MedicalConditionController;
    let mockResponse: Partial<Response>;
    let mockRequest: Partial<Request>;
    let nextFunction: sinon.SinonStub;

    beforeEach(() => {
        mockMedicalConditionService = {
            createMedicalCondition: sinon.stub(),
            updateMedicalCondition: sinon.stub(),
            getMedicalCondition: sinon.stub(),
            getAllMedicalConditions: sinon.stub(),
        } as unknown as sinon.SinonStubbedInstance<IMedicalConditionService>;

        Container.set('medicalConditionService', mockMedicalConditionService);
        medicalConditionController = new MedicalConditionController(mockMedicalConditionService);

        mockResponse = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub(),
            json: sinon.stub(),
        };

        mockRequest = {};
        nextFunction = sinon.stub();
    });

    describe('createMedicalCondition', () => {
        it('should return 201 and the created medical condition on success', async () => {
            const medicalConditionDTO = { name: 'Hypertension', description: '-' };
            mockRequest.body = medicalConditionDTO;
            mockMedicalConditionService.createMedicalCondition.resolves(Result.ok(medicalConditionDTO));

            await medicalConditionController.createMedicalCondition(mockRequest as Request, mockResponse as Response, nextFunction);

            sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 201);
            sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, medicalConditionDTO);
        });

        it('should return 400 and error message on failure', async () => {
            const errorMessage = 'Invalid data';
            mockRequest.body = { name: '' };
            mockMedicalConditionService.createMedicalCondition.resolves(Result.fail(errorMessage));

            await medicalConditionController.createMedicalCondition(mockRequest as Request, mockResponse as Response, nextFunction);

            sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 400);
            sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, { message: errorMessage });
        });
    });

    describe('updateMedicalCondition', () => {
        it('should return 201 and updated medical condition on success', async () => {
            const medicalConditionDTO = { id: '1', name: 'Updated Condition' };
            mockRequest.params = { id: '1' };
            mockRequest.body = { name: 'Updated Condition' };
            mockMedicalConditionService.updateMedicalCondition.resolves(Result.ok(medicalConditionDTO));

            await medicalConditionController.updateMedicalCondition(mockRequest as Request, mockResponse as Response, nextFunction);

            sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 201);
            sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, medicalConditionDTO);
        });

        it('should return 404 if medical condition is not found', async () => {
            const errorMessage = 'Condition not found';
            mockRequest.params = { id: '1' };
            mockRequest.body = { name: 'Updated Condition' };
            mockMedicalConditionService.updateMedicalCondition.resolves(Result.fail(errorMessage));

            await medicalConditionController.updateMedicalCondition(mockRequest as Request, mockResponse as Response, nextFunction);

            sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 404);
            sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, { message: errorMessage });
        });
    });

    describe('getMedicalCondition', () => {
        it('should return 200 and medical condition data on success', async () => {
            const medicalConditionDTO = { id: '1', name: 'Diabetes' };
            mockRequest.params = { id: '1' };
            mockMedicalConditionService.getMedicalCondition.resolves(Result.ok(medicalConditionDTO));

            await medicalConditionController.getMedicalCondition(mockRequest as Request, mockResponse as Response, nextFunction);

            sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 200);
            sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, medicalConditionDTO);
        });

        it('should return 500 if medical condition is not found', async () => {
            const errorMessage = 'Condition not found';
            mockRequest.params = { id: '1' };
            mockMedicalConditionService.getMedicalCondition.resolves(Result.fail(errorMessage));

            await medicalConditionController.getMedicalCondition(mockRequest as Request, mockResponse as Response, nextFunction);

            sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 500);
            sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, 'Medical Condition not found: ' + errorMessage);
        });
    });

    describe('getAllMedicalConditions', () => {
        it('should return 200 and list of medical conditions', async () => {
            const conditions = [{ id: '1', name: 'Asthma' }, { id: '2', name: 'Hypertension' }];
            mockMedicalConditionService.getAllMedicalConditions.resolves(conditions);

            await medicalConditionController.getAllMedicalConditions(mockRequest as Request, mockResponse as Response, nextFunction);

            console.log('Status calls:', (mockResponse.status as sinon.SinonStub).args); // Debug
            console.log('JSON calls:', (mockResponse.json as sinon.SinonStub).args);   // Debug

            sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 200);
            sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, conditions);
        });
    });
});
