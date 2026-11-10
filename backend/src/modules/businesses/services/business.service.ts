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

// PROVISORIO hasta HT-01: sin isOpenNow no se puede saber si está abierto, así que todo negocio
// que no está en pausa figura como cerrado. La pausa ya es la primera regla de RN-01, así que ese
// caso no cambia. Cuando esté isOpenNow, se reemplaza esta función y el resto del servicio queda igual.
function provisionalStatus(entry: BusinessListEntry): BusinessStatus {
  return { state: entry.isPaused ? 'paused' : 'closed', closesAt: null, nextOpeningAt: null };
}

function toListItem(entry: BusinessListEntry): BusinessListItem {
  return {
    slug: entry.slug,
    name: entry.name,
    category: entry.category,
    // Hasta US-19 no hay adaptador de almacenamiento que convierta photoKey en una URL (D-14).
    photoUrl: null,
    status: provisionalStatus(entry),
  };
}

export class BusinessService {
  constructor(private readonly businessRepository: BusinessRepository) {}

  async list(query: BusinessListQuery): Promise<BusinessListResponse> {
    const { items, total } = await this.businessRepository.findPage(query);
    return toPage(items.map(toListItem), total, query);
  }
}
