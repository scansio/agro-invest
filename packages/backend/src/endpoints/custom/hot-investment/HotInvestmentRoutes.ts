import { RequestMethods } from '../../../configs/constants'
import { IControllerRoute } from '../../../libs/types/IControllerRoute'
import HotInvestment from './HotInvestment'

const HotInvestmentRoutes: IControllerRoute = {
  tag: 'Hot Investment',
  controller: HotInvestment,
  baseUrl: '/hot-investment',
  routes: [
    {
      path: '/',
      fields: {},
      method: RequestMethods.GET,
      metadata: {
        summary: 'Get HotInvestments',
      },
    },
  ],
  schema: {},
  model: null,
  description: 'Operation on HotInvestment',
}

export default HotInvestmentRoutes
