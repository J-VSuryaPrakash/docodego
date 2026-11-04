import { z } from 'zod'
import { billParamSchema } from './schemas/bills.schema'
import { homeParamSchema } from './schemas/member.schema'
import { shareParamSchema } from './schemas/share.schema'

const payShareParamsSchema = z.object({
  ...billParamSchema.shape,
  ...shareParamSchema.shape,
})

const getSharesParamSchema = z.object({
  ...homeParamSchema.shape,
  ...billParamSchema.shape,
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

export { getSharesParamSchema, payShareParamsSchema }
