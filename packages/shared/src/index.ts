import { z } from 'zod'
import { billParamSchema } from './schemas/bills.schema'
import { shareParamSchema } from './schemas/share.schema'

const paramsSchema = z.object({
  ...billParamSchema.shape,
  ...shareParamSchema.shape,
})

export {
  type createBillInput,
  createBillSchema,
} from './schemas/bills.schema'

export {
  type createHomeInput,
  createHomeSchema,
} from './schemas/home.schema'

export {
  type createMemberInput,
  createMemberSchema,
  homeParamSchema,
} from './schemas/member.schema'
export { paramsSchema }
