import { expect, test, describe, vi } from 'vitest';
import type { Request, Response } from 'express';

// Import the Express app
import app from './app';

// Define interface for mock router

// Mock Express request and response
const mockRequest = (body = {}): Request => {
  return {
    body
  } as Request;
};

const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
};

describe('Lambda Backend API', () => {
  test('Health check endpoint returns 200', async () => {
    const req = mockRequest();
    const res = mockResponse();
    
    // Cast app to include _router property and ignore TypeScript error
    type AppWithRouter = typeof app & { 
      _router: { 
        handle: (req: Request, res: Response, next: () => void) => Promise<void> 
      } 
    };
    await (app as AppWithRouter)._router.handle(req, res, () => {});
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'ok'
    }));
  });
  
  test('Generate endpoint returns checklist based on trip and weather data', async () => {
    const req = mockRequest({
      trip: {
        name: 'Winter Vacation',
        startDate: '2025-12-20',
        endDate: '2025-12-27',
        destinations: ['Oslo, Norway'],
        travelModes: ['plane'],
        tripDetails: 'Winter vacation to see the Northern Lights'
      },
      weather: [{
        location: 'Oslo, Norway',
        temperature: -5,
        conditions: 'Snow',
        precipitation: 2
      }]
    });
    
    const res = mockResponse();
    
    // Cast app to include _router property
    type AppWithRouter = typeof app & { 
      _router: { 
        handle: (req: Request, res: Response, next: () => void) => Promise<void> 
      } 
    };
    await (app as AppWithRouter)._router.handle(req, res, () => {});
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      checklist: expect.arrayContaining([
        expect.objectContaining({
          category: 'Clothing',
          text: 'Winter jacket'
        })
      ])
    }));
  });

  test('Generate endpoint returns 400 for invalid request', async () => {
    // Missing weather data
    const req = mockRequest({
      trip: {
        name: 'Invalid Trip',
        startDate: '2025-12-20',
        endDate: '2025-12-27',
        destinations: ['Oslo, Norway'],
        travelModes: ['plane'],
        tripDetails: 'Winter vacation to see the Northern Lights'
      }
      // weather data missing
    });
    
    const res = mockResponse();
    
    // Cast app to include _router property
    type AppWithRouter = typeof app & { 
      _router: { 
        handle: (req: Request, res: Response, next: () => void) => Promise<void> 
      } 
    };
    await (app as AppWithRouter)._router.handle(req, res, () => {});
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.stringContaining('Missing')
    }));
  });
});
