import type { BusinessStatus as OpeningHoursStatus } from '../../opening-hours/domain/opening-hours.types.js';
import type { OpeningHoursService } from '../../opening-hours/services/opening-hours.service.js';
import { NotFoundError } from '../../../shared/errors/http-errors.js';
import { toPage } from '../../../shared/pagination/pagination.js';
import type {
  BusinessListEntry,
  BusinessRepository,
} from '../../../shared/ports/business.repository.js';
import type {
  BusinessDetail,
  BusinessListItem,
  BusinessListQuery,
  BusinessListResponse,
  BusinessStatus,
} from '../schemas/business.schema.js';

// isOpenNow devuelve momentos como Date; la API los manda en ISO 8601 UTC (D-11).
function toStatusResponse(status: OpeningHoursStatus): BusinessStatus {
  return {
    state: status.state,
    closesAt: status.closesAt?.toISOString() ?? null,
    nextOpeningAt: status.nextOpeningAt?.toISOString() ?? null,
  };
}

export class BusinessService {
  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly openingHoursService: OpeningHoursService,
  ) {}

  async list(query: BusinessListQuery): Promise<BusinessListResponse> {
    const { items, total } = await this.businessRepository.findPage({
      page: query.page,
      limit: query.limit,
      category: query.category,
    });
    return toPage(
      items.map((entry) => this.toListItem(entry)),
      total,
      query,
    );
  }

  async getBySlug(slug: string): Promise<BusinessDetail> {
    const entry = await this.businessRepository.findBySlug(slug);
    if (!entry) {
      throw new NotFoundError('No se encontró el negocio', 'BUSINESS_NOT_FOUND');
    }
    return {
      slug: entry.slug,
      name: entry.name,
      description: entry.description,
      category: entry.category,
      // Como en el listado: hasta US-19 no hay adaptador que convierta photoKey en una URL (D-14).
      photoUrl: null,
      status: toStatusResponse(
        this.openingHoursService.currentStatus(entry.openingHours, entry.timezone),
      ),
      schedule: this.openingHoursService.weeklySchedule(entry.openingHours, entry.timezone),
    };
  }

  private toListItem(entry: BusinessListEntry): BusinessListItem {
    const status = this.openingHoursService.currentStatus(entry.openingHours, entry.timezone);
    return {
      slug: entry.slug,
      name: entry.name,
      category: entry.category,
      // Hasta US-19 no hay adaptador de almacenamiento que convierta photoKey en una URL (D-14).
      photoUrl: null,
      status: toStatusResponse(status),
    };
  }
}
