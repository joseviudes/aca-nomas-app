import type { BusinessStatus as OpeningHoursStatus } from '../../opening-hours/domain/opening-hours.types.js';
import type { OpeningHoursService } from '../../opening-hours/services/opening-hours.service.js';
import { toPage } from '../../../shared/pagination/pagination.js';
import type {
  BusinessListEntry,
  BusinessRepository,
} from '../../../shared/ports/business.repository.js';
import type {
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
    const { items, total } = await this.businessRepository.findPage(query);
    return toPage(
      items.map((entry) => this.toListItem(entry)),
      total,
      query,
    );
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
