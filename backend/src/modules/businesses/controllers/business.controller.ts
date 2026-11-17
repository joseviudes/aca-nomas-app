import type { Request, Response } from 'express';
import type { BusinessListQuery } from '../schemas/business.schema.js';
import type { BusinessService } from '../services/business.service.js';

export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  // Funciones flecha: el router las recibe sueltas y tienen que conservar el this.
  list = async (req: Request, res: Response) => {
    // validate ya reemplazó req.query por la consulta parseada (page y limit como números, con sus
    // valores por defecto). Express no conoce ese tipo, por eso la conversión.
    const query = req.query as unknown as BusinessListQuery;
    res.json(await this.businessService.list(query));
  };
}
