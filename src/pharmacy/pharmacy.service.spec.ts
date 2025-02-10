import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyServices } from './pharmacy.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pharmacy } from '../schemas/pharmacy.schema';

describe('PharmacyServices', () => {
  let service: PharmacyServices;
  let model: Model<Pharmacy>;

  const mockPharmacy = {
    _id: '123',
    name: 'Test Pharmacy',
    latitude: 34.0522,
    longitude: -118.2437,
    isOnGard: true,
    isOnDuty: false,
    address: {
      street: 'Test Street',
      city: 'Test City',
    },
    services: ['Service 1'],
    toObject: jest.fn().mockReturnThis(),
    save: jest.fn(),
  };

  const mockPharmacyModel = {
    find: jest.fn(),
    findById: jest.fn(),
    aggregate: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PharmacyServices,
        {
          provide: getModelToken(Pharmacy.name),
          useValue: mockPharmacyModel,
        },
      ],
    }).compile();

    service = module.get<PharmacyServices>(PharmacyServices);
    model = module.get<Model<Pharmacy>>(getModelToken(Pharmacy.name));
  });

  describe('setPharmacyOnDuty', () => {
    it('should set pharmacy as on duty', async () => {
      const updatedPharmacy = { ...mockPharmacy, isOnDuty: true };
      mockPharmacyModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPharmacy),
      });
      mockPharmacy.save.mockResolvedValue(updatedPharmacy);

      const result = await service.setPharmacyOnDuty('123');
      expect(result.isOnDuty).toBe(true);
    });

    it('should return null if pharmacy not found', async () => {
      mockPharmacyModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.setPharmacyOnDuty('123');
      expect(result).toBeNull();
    });
  });

  describe('findGuardPharmacies', () => {
    const location = { latitude: 34.0522, longitude: -118.2437 };

    it('should return pharmacies with calculated distances', async () => {
      const mockPharmacies = [mockPharmacy];
      mockPharmacyModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPharmacies),
      });

      const result = await service.findGuardPharmacies(location);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('distance');
      expect(typeof result.data[0].distance).toBe('number');
    });

  });

  describe('getPharmacyDetails', () => {
    it('should return pharmacy details by id', async () => {
      mockPharmacyModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPharmacy),
      });

      const result = await service.getPharmacyDetails('123');
      expect(result).toEqual(mockPharmacy);
    });

    it('should return null if pharmacy not found', async () => {
      mockPharmacyModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.getPharmacyDetails('123');
      expect(result).toBeNull();
    });
  });

  describe('searchPharmacies', () => {
    it('should search pharmacies with location and query', async () => {
      const searchParams = {
        query: 'test',
        latitude: 34.0522,
        longitude: -118.2437,
        maxDistance: 5000,
      };

      const expectedAggregation = [
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [searchParams.longitude, searchParams.latitude],
            },
            distanceField: 'distance',
            maxDistance: searchParams.maxDistance,
            spherical: true,
          },
        },
        {
          $match: {
            $or: [
              { name: { $regex: searchParams.query, $options: 'i' } },
              {
                'address.street': { $regex: searchParams.query, $options: 'i' },
              },
              { 'address.city': { $regex: searchParams.query, $options: 'i' } },
              { services: { $regex: searchParams.query, $options: 'i' } },
            ],
          },
        },
      ];

      mockPharmacyModel.aggregate.mockResolvedValue([mockPharmacy]);

      const result = await service.searchPharmacies(searchParams);
      expect(mockPharmacyModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining(expectedAggregation),
      );
      expect(result).toEqual([mockPharmacy]);
    });

    it('should return all pharmacies when no search criteria provided', async () => {
      mockPharmacyModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockPharmacy]),
      });

      const result = await service.searchPharmacies({});
      expect(result).toEqual([mockPharmacy]);
    });
  });

  describe('getPharmaciesOnGuard', () => {
    it('should return pharmacies on guard', async () => {
      const mockPharmacies = [mockPharmacy];
      mockPharmacyModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPharmacies),
      });

      const result = await service.getPharmaciesOnGuard();
      expect(result).toEqual(mockPharmacies);
      expect(mockPharmacyModel.find).toHaveBeenCalledWith({ isOnGard: true });
    });

    it('should handle errors when fetching pharmacies on guard', async () => {
      mockPharmacyModel.find.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(service.getPharmaciesOnGuard()).rejects.toThrow(
        'Failed to fetch pharmacies on guard: Database error',
      );
    });
  });

  // Test for the private calculateDistance method
  describe('calculateDistance', () => {
    it('should calculate distance between two points correctly', () => {
      // Access private method using any type
      const distance = (service as any).calculateDistance(
        34.0522,
        -118.2437,
        40.7128,
        -74.006,
      );

      // The distance between LA and NY is roughly 3935 km
      expect(distance).toBeCloseTo(3935, -2);
    });

    it('should return 0 for same coordinates', () => {
      const distance = (service as any).calculateDistance(
        34.0522,
        -118.2437,
        34.0522,
        -118.2437,
      );

      expect(distance).toBe(0);
    });
  });
});
