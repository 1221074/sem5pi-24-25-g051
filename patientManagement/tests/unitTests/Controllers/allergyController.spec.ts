import "reflect-metadata";
import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import AllergyController from '../../../src/controllers/AllergyController';
import IAllergyService from '../../../src/Services/IServices/IAllergyService';
import { Result } from '../../../src/core/logic/Result';
import { expect } from 'chai';
import sinon from 'sinon';
import { beforeEach, describe, it } from "node:test";

describe('AllergyController', () => {
  let mockAllergyService: sinon.SinonStubbedInstance<IAllergyService>;
  let allergyController: AllergyController;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockAllergyService = {
      createAllergy: sinon.stub(),
      updateAllergy: sinon.stub(),
      getAllergy: sinon.stub(),
      getAllAllergies: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<IAllergyService>;

    Container.set('allergyService', mockAllergyService);
    allergyController = new AllergyController(mockAllergyService);

    mockResponse = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      json: sinon.stub(),
    };

    mockRequest = {};
    nextFunction = sinon.stub();
  });

  describe('createAllergy', () => {
    it('should  return 201 and the created allergy on success', async () => {
      const allergyDTO = { name: 'Peanut Allergy', description: '-' };
      mockRequest.body = allergyDTO;
      mockAllergyService.createAllergy.resolves(Result.ok(allergyDTO));

      await allergyController.createAllergy(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 201);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, allergyDTO);
    });

    it('should return 400 and error message on failure', async () => {
      const errorMessage = 'Invalid data';
      mockRequest.body = { name: '' };
      mockAllergyService.createAllergy.resolves(Result.fail(errorMessage));

      await allergyController.createAllergy(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 400);
      sinon.assert.calledWith(mockResponse.send as sinon.SinonStub, errorMessage);
    });
  });

  describe('updateAllergy', () => {
    it('should return 200 and updated allergy on success', async () => {
      const allergyDTO = { id: '1', name: 'Updated Allergy' };
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 'Updated Allergy' };
      mockAllergyService.updateAllergy.resolves(Result.ok(allergyDTO));

      await allergyController.updateAllergy(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 200);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, allergyDTO);
    });

    it('should return 404 if allergy is not found', async () => {
      const errorMessage = 'Allergy not found';
      mockRequest.params = { id: '1' };
      mockAllergyService.getAllergy.resolves(Result.fail(errorMessage)); // Simulate failure

      await allergyController.getAllergy(mockRequest as Request, mockResponse as Response, nextFunction);

      // Check the status and send calls
      sinon.assert.calledOnce(mockResponse.status as sinon.SinonStub);
      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 404);

      sinon.assert.calledOnce(mockResponse.send as sinon.SinonStub);
      sinon.assert.calledWith(mockResponse.send as sinon.SinonStub, errorMessage);
    });

  });

  describe('getAllergy', () => {
    it('should return 200 and allergy data on success', async () => {
      const allergyDTO = { id: '1', name: 'Peanut Allergy' };
      mockRequest.params = { id: '1' };
      mockAllergyService.getAllergy.resolves(Result.ok(allergyDTO));

      await allergyController.getAllergy(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 200);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, allergyDTO);
    });

    it('should return 404 if allergy is not found', async () => {
      const errorMessage = 'Allergy not found';
      mockRequest.params = { id: '1' };
      mockAllergyService.getAllergy.resolves(Result.fail(errorMessage)); // Simulate failure

      await allergyController.getAllergy(mockRequest as Request, mockResponse as Response, nextFunction);

      // Use Sinon assertions directly
      sinon.assert.calledOnce(mockResponse.status as sinon.SinonStub);
      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 404);

      sinon.assert.calledOnce(mockResponse.send as sinon.SinonStub);
      sinon.assert.calledWith(mockResponse.send as sinon.SinonStub, errorMessage);
    });
  });

  describe('getAllAllergies', () => {
    it('should return 200 and list of allergies', async () => {
      const allergies = [{ id: '1', name: 'Peanut Allergy' }];
      mockAllergyService.getAllAllergies.resolves(allergies);

      await allergyController.getAllAllergies(mockRequest as Request, mockResponse as Response, nextFunction);

      sinon.assert.calledOnce(mockResponse.status as sinon.SinonStub);
      sinon.assert.calledWith(mockResponse.status as sinon.SinonStub, 200);

      sinon.assert.calledOnce(mockResponse.json as sinon.SinonStub);
      sinon.assert.calledWith(mockResponse.json as sinon.SinonStub, allergies);
    });
  });
});
