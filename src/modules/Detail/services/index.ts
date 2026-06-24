import { mapApiResponse } from '@/api/core/helpers'
import type { ApiResponse } from '@/api/core/types'
import { getDetailPanel } from '@/modules/Detail/api'
import { toDetailPanelModel } from '@/modules/Detail/mappers/detail'
import type { DetailPanelModel } from '@/modules/Detail/models/detail'

export async function getDetailOverview(
  resourceId: string
): Promise<ApiResponse<DetailPanelModel>> {
  const response = await getDetailPanel(resourceId)
  return mapApiResponse(response, toDetailPanelModel)
}
