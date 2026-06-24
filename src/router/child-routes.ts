import { authRoutes } from '@/router/routes/modules/auth'
import { catalogRoutes } from '@/router/routes/modules/catalog'
import { detailRoutes } from '@/router/routes/modules/detail'

const childRoutes: Array<RouteRecordRaw> = [
  ...authRoutes,
  ...catalogRoutes,
  ...detailRoutes
]

export default childRoutes
